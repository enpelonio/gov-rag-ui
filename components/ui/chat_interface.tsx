"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Markdown from "react-markdown";

export default function ChatInterface() {
  const [conversationId, setConversationId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", type: "received" },
  ]);

  useEffect(() => {
    // request a conversation id to backend
    async function fetchConversationId() {
      const response = await fetch("api/chat");
      const jsonResponse = await response.json();
      setConversationId(jsonResponse.conversationId);
    }
    fetchConversationId();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    // Add the user's message to the chat UI
    const userMessage = { text: message, type: "sent" };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

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

      // Append the reply from the server
      const replyMessage = { text: data.reply, type: "received" };
      setMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage(""); // Clear the input field
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start ${
              msg.type === "sent" ? "justify-end" : ""
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-[70%] shadow ${
                msg.type === "sent" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              <Markdown>{msg.text}</Markdown>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
