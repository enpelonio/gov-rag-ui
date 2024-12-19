'use client'
import { useState, useEffect } from 'react';

interface TextSegment {
  text: string;
  className?: string;
}

export function useTypingAnimation(segments: TextSegment[], speed: number = 50) {
  const [displayedSegments, setDisplayedSegments] = useState<TextSegment[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentSegmentIndex < segments.length) {
      const currentSegment = segments[currentSegmentIndex];
      if (currentCharIndex < currentSegment.text.length) {
        const timer = setTimeout(() => {
          setDisplayedSegments(prev => {
            const newSegments = [...prev];
            if (!newSegments[currentSegmentIndex]) {
              newSegments[currentSegmentIndex] = { text: '', className: currentSegment.className };
            }
            newSegments[currentSegmentIndex].text += currentSegment.text[currentCharIndex];
            return newSegments;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
      } else {
        setCurrentSegmentIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    }
  }, [currentSegmentIndex, currentCharIndex, segments, speed]);

  return displayedSegments;
}

