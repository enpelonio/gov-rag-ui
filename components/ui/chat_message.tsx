"use client";

import React from "react";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "./chat_interface";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SourcesNavigation } from "./sources_navigation";
import { useState, useEffect } from "react";
import { CodeDisplay } from "./code_display";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageElement({ message }: ChatMessageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const tempTitles = [];
    message.sources.map((value) => {
      tempTitles.push(value.slice(0, 15) + "...");
    });
    setTitles(tempTitles);
  }, [message]);

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
      <div className="flex flex-col max-w-[70%]">
        <div
          className={`rounded-lg p-3 shadow ${
            message.type === "sent"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
        >
          <Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>
        </div>
        {message.sources.length > 0 && (
          <div className="self-end">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="link">View Sources</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-[1200px] h-[80vh] p-0 flex flex-col sm:flex-row">
                <div className="h-[190px] sm:h-full">
                  <SourcesNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    items={titles}
                  />
                </div>
                <div className="flex-grow overflow-auto p-6">
                  <CodeDisplay code={message.sources[activeTab]} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
