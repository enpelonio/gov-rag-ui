import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingAnimation } from "./loading_animation";
const ThinkingPlaceholder = () => {
  return (
    <div className="flex items-center space-x-2 justify-start">
      <Avatar>
        <AvatarImage src="/images/JuanderBot Logo.png" alt="JuanderBot" />
        <AvatarFallback>Juander Bot</AvatarFallback>
      </Avatar>
      <LoadingAnimation />
    </div>
  );
};

export default ThinkingPlaceholder;
