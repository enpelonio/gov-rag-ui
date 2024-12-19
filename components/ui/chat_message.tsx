import React from "react";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "./chat_interface";

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageElement({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex items-start space-x-2 ${
        message.type === "sent" ? "justify-end" : "justify-start"
      }`}
    >
      {message.type === "received" && (
        <Avatar>
          <AvatarImage src="/images/JuanderBot Logo.png" alt="JuanderBot" />
          <AvatarFallback>Juander Bot</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg p-3 max-w-[70%] shadow ${
          message.type === "sent" ? "bg-blue-500 text-white" : "bg-white"
        }`}
      >
        <Markdown>{message.text}</Markdown>
      </div>
    </div>
  );
}
