import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import Conversation from "@/models/Conversation";
import { connectToDB } from "@/utils/database";

export const POST = async (req) => {
  const { query, conversationId } = await req.json();
  const pinecone = new PineconeClient();
  // Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
  const pineconeIndex = pinecone.Index("government-rag-index");
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "models/text-embedding-004", // 768 dimensions,
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
  });
  const model = new ChatGoogleGenerativeAI({
    modelName: "models/gemini-1.5-flash",
    temperature: 0,
  });

  // query the database for an existing conversation
  const prevConversation = await Conversation.findById(conversationId);
  const promptJson = {
    user_query: query,
    previous_conversations: prevConversation.messages,
    query_question: "",
    context: "",
    answer: "",
  };

  console.log("Prompt JSON: ", promptJson);
  const promptPreText =
    "You are an assistant tasked to explain to common folk \
    a number of government processes and answer inquiries. \
    Based on the previous conversations and the query of the user, \
    decide whether to query the database of information for the user query, \
    ask more questions or reply based on the previous conversations. Input is in the following json format\n";
  const promptPostText =
    "If there is no context and an answer cannot be found in the previous conversation, \
    you must decide to query the database of information. Do not make up an answer. \
    The query_question must always be in English. When you formulate the query_question,\
    be sure to consider previous conversations if necessary.When the context is filled, \
    that means you have already queried the database, and must use the information \
    inside to formulate an answer. Put your answer in the answer attribute. \
    Remove the previous_conversations and context variables in the output. Output in json format with the same variables as the input \
    Always answer in a courteous manner in the language \
    of the user_query. The answer attribute must be comprehensive and with markdown annotation.";

  let promptTemplate =
    promptPreText + JSON.stringify(promptJson, null, 2) + "\n" + promptPostText;
  // send prompt to model

  let reply = await model.invoke(promptTemplate);
  console.log("Prompt Template: ", promptTemplate);
  console.log("First Reply: ", reply.content);
  let cleanedString = reply.content.match(/{.*}/s);
  let replyJson = JSON.parse(cleanedString[0]);

  // if answer is empty, query pinecone using query_question
  if (replyJson.answer === "") {
    const similaritySearchResults = await vectorStore.similaritySearch(
      replyJson.query_question,
      10
    );
    let context = "";
    for (let i = 0; i < similaritySearchResults.length; i++) {
      const result = similaritySearchResults[i];
      context += result.pageContent + "\n";
    }
    // send the context to gemini after query
    replyJson.context = context;
    promptTemplate =
      promptPreText +
      JSON.stringify(replyJson, null, 2) +
      "\n" +
      promptPostText;
    reply = await model.invoke(promptTemplate);
    cleanedString = reply.content.match(/{.*}/s);
    replyJson = JSON.parse(cleanedString[0]);
    console.log("Second Reply: ", replyJson);
  }
  const answer = replyJson.answer;
  console.log("Answer: ", answer);
  // insert messages to conversation
  await Conversation.findByIdAndUpdate(conversationId, {
    $push: {
      messages: {
        $each: [
          {
            from: "user",
            message: query,
          },
          {
            from: "assistant",
            message: answer,
          },
        ],
      },
    },
  });
  // send reply to front end
  return new Response(JSON.stringify({ reply: answer }), {
    status: 200,
  });
};

export const GET = async () => {
  try {
    // Ensure the database connection
    await connectToDB();

    // Create a new chat record with a default message
    const newConversation = new Conversation({
      messages: [
        {
          from: "assistant",
          message: "Hi, How may I help you today?",
        },
      ],
    });
    const savedChat = await newConversation.save();
    return new Response(
      JSON.stringify({ conversationId: savedChat._id.toString() }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating chat:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
