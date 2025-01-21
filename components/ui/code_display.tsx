import React from "react";

interface CodeDisplayProps {
  code: string;
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  return (
    <div
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none overflow-auto h-full"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
