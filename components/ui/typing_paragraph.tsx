'use client'
import React from 'react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

interface TextSegment {
  text: string;
  className?: string;
}

interface TypingParagraphProps {
  segments: TextSegment[];
  speed?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function TypingParagraph({ segments, speed = 50, className = '', as: Component = 'p' }: TypingParagraphProps) {
  const displayedSegments = useTypingAnimation(segments, speed);

  return (
    <Component className={`typing-paragraph ${className}`}>
      {displayedSegments.map((segment:any, index:any) => (
        <span key={index} className={segment.className}>
          {segment.text}
        </span>
      ))}
      <span className="cursor" />
    </Component>
  );
}

