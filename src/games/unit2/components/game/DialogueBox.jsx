import React, { useState, useEffect } from 'react';

export default function DialogueBox({ dialogue, onClose }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const TYPING_SPEED = 30;

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < dialogue.text.length) {
        setDisplayedText(dialogue.text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [dialogue]);

  const handleClick = () => {
    if (!isComplete) {
      setDisplayedText(dialogue.text);
      setIsComplete(true);
    } else {
      onClose();
    }
  };

  const speakerName = {
    assistant: '🤖 Asistente Virtual',
    player: '👤 Tú',
    system: '💬 Sistema',
  }[dialogue.speaker];

  return (
    <div className="dialogue-box" onClick={handleClick}>
      <div className="dialogue-container">
        
        <div className="dialogue-avatar">
          <div
            className={`dialogue-face dialogue-face--${dialogue.speaker} dialogue-face--${dialogue.emotion || 'neutral'}`}
            style={{
              width: '80px',
              height: '80px',
              backgroundImage: `var(--${dialogue.speaker}-face-${isComplete ? 'idle' : 'talking'})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        <div className="dialogue-content">
          <div className="dialogue-speaker">{speakerName}</div>
          
          <div className="dialogue-text">
            {displayedText}
            {!isComplete && <span className="dialogue-cursor">▋</span>}
          </div>
        </div>

      </div>

      <div className="dialogue-actions">
        <span className="dialogue-hint">
          {isComplete ? 'Click o ENTER para continuar' : 'Click para saltar'}
        </span>
      </div>
    </div>
  );
}
