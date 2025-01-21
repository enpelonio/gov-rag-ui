"use client";

import ChatInterface from "@/components/ui/chat_interface";
import Hero from "@/components/ui/hero";
import { NavBar } from "@/components/ui/navbar";
import { useState, useEffect } from "react";
import { ChatMessage } from "@/components/ui/chat_interface";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [useHero, setUseHero] = useState(true);
  const handleSend = async (message) => {
    let isFirstMessage = false;
    if (!message.trim()) return; // Prevent sending empty messages

    // Add the user's message to the chat UI
    const userMessage = { text: message, type: "sent", sources: [] };
    if (messages.length === 0) isFirstMessage = true;
    setMessages((prev) => [...prev, userMessage]);
    if (isFirstMessage) setUseHero(false);
    setIsLoading(true);
    try {
      // Send the message to the server
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setUseHero(false);
      // Append the reply from the server
      const replyMessage = {
        text: data.reply,
        type: "received",
        sources: data.sources,
      };
      console.log("This is the reply: ", replyMessage);
      setMessages((prev) => [...prev, replyMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    // request a conversation id to backend
    async function fetchConversationId() {
      const response = await fetch("api/chat");
      const jsonResponse = await response.json();
      setConversationId(jsonResponse.conversationId);
      setIsLoading(false);
    }
    fetchConversationId();
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full h-[calc(100vh-9rem)] flex items-center justify-center">
        {useHero && <Hero isLoading={isLoading} handleSend={handleSend} />}
        {!useHero && (
          <div className="mt-36">
            <ChatInterface
              messages={messages}
              handleSend={handleSend}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </>
  );
}
