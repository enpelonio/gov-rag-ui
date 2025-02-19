"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatMessageElement } from "./chat_message";
import ThinkingPlaceholder from "./thinking_placeholder";
import { Textarea } from "@/components/ui/textarea";

export type ChatMessage = {
  text: string;
  type: string;
  sources: Array<string>;
};
type ChatInterfaceProps = {
  messages: ChatMessage[];
  handleSend: (message: string) => Promise<void>;
  isLoading: boolean;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  handleSend,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const sendButtonRef = useRef(null);
  const chatContainerRef = useRef(null);
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButtonRef.current?.click();
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendChat = async (message) => {
    handleSend(message);
    setMessage(""); // Clear the input field
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-screen">
      <div className="flex-1 overflow-hidden mt-16">
        <div className="relative h-full">
          <div className="overflow-y-auto w-full h-full" ref={chatContainerRef}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <ChatMessageElement message={msg} key={index} />
              ))}
              {isLoading && <ThinkingPlaceholder />}
            </div>
          </div>
        </div>
      </div>
      {/* Input area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2">
          <Textarea
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <Button
            onClick={() => {
              handleSendChat(message);
            }}
            size="icon"
            ref={sendButtonRef}
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
