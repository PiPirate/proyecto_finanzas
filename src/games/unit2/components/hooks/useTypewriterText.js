import { useState, useEffect } from 'react';

export default function useTypewriterText(text, speed = 28) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [shouldShowAll, setShouldShowAll] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);
    setShouldShowAll(false);

    if (!text) return;

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (shouldShowAll || currentIndex >= text.length) {
        setDisplayedText(text);
        setIsDone(true);
        clearInterval(interval);
        return;
      }

      currentIndex++;
      setDisplayedText(text.slice(0, currentIndex));
      
      if (currentIndex >= text.length) {
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, shouldShowAll]);

  const showAll = () => {
    setShouldShowAll(true);
    setDisplayedText(text);
    setIsDone(true);
  };

  return {
    displayedText,
    isDone,
    showAll
  };
}
