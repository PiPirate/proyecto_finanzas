// src/games/core/dialogue/DialogueBox.jsx
import React from 'react';
import useTypewriterText from '../hooks/useTypewriterText';
import './DialogueBox.css';

// Props:
// visible: bool
// text: string
// speakingSprite: tirilla cuando está hablando
// idleSprite: tirilla cuando está en reposo
// onNext: se llama cuando el texto ya terminó y el jugador hace click
export default function DialogueBox({
  visible,
  text,
  speakingSprite,
  idleSprite,
  onNext,
}) {
  const { displayedText, isDone, showAll } = useTypewriterText(text, 28);

  if (!visible) return null;

  const handleClick = () => {
    if (!isDone) {
      showAll();
    } else if (onNext) {
      onNext();
    }
  };

  // hablando mientras el texto se escribe
  const isSpeaking = !isDone;
  const spriteToUse = isSpeaking
    ? (speakingSprite || idleSprite)
    : (idleSprite || speakingSprite);

  const faceClassName = `dialogue-face ${
    isSpeaking ? 'dialogue-face--talking' : 'dialogue-face--idle'
  }`;

  return (
    <div className="dialogue-root" onClick={handleClick}>
      <div className="dialogue-face-wrapper">
        <div
          className={faceClassName}
          style={{ backgroundImage: `url(${spriteToUse})` }}
        />
      </div>

      <div className="dialogue-panel">
        <p className="dialogue-text">
          {displayedText}
        </p>
        <span className={`dialogue-next ${isDone ? 'dialogue-next--visible' : ''}`}>
          ▼
        </span>
      </div>
    </div>
  );
}
