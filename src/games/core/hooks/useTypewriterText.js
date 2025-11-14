// src/games/core/hooks/useTypewriterText.js
import { useState, useEffect, useCallback } from 'react';

export default function useTypewriterText(text, speed = 30) {
  const [index, setIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setIndex(0);
      setIsDone(true);
      return;
    }

    setIndex(0);
    setIsDone(false);

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          setIsDone(true);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const showAll = useCallback(() => {
    if (!text) return;
    setIndex(text.length);
    setIsDone(true);
  }, [text]);

  const displayedText = text ? text.slice(0, index) : '';

  return { displayedText, isDone, showAll };
}
