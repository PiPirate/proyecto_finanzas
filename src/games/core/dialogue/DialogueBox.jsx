// src/games/core/dialogue/DialogueBox.jsx
import React from 'react';
import useTypewriterText from '../hooks/useTypewriterText';
import './DialogueBox.css';

// Props:
// visible: bool
// text: string
// speakingSprite: tirilla cuando está hablando
// idleSprite: tirilla cuando está en reposo
// speakerName: nombre que aparece en el panel ("Carmina", "Asesor", etc.)
// onNext: se llama cuando el texto ya terminó y el jugador hace click
export default function DialogueBox({
  visible,
  text,
  speakingSprite,
  idleSprite,
  speakerName,
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

  // quién está hablando
  const isAdvisor = speakerName === 'Asesor';
  const isCarmina = speakerName === 'Carmina';

  // hablando mientras el texto se escribe
  const isSpeaking = !isDone;

  // sprite que se usa (hablando vs idle)
  const spriteToUse = isSpeaking
    ? (speakingSprite || idleSprite)
    : (idleSprite || speakingSprite);

  // clase de animación según personaje y si habla o está idle
  let animationClass = '';

  if (isSpeaking) {
    if (isAdvisor) {
      // animación de hablar del asesor
      animationClass = 'dialogue-face--talking-advisor';
    } else {
      // por defecto (Carmina u otros)
      animationClass = 'dialogue-face--talking-carmina';
    }
  } else {
    if (isAdvisor) {
      // animación neutral del asesor
      animationClass = 'dialogue-face--idle-advisor';
    } else {
      // por defecto neutral (Carmina u otros)
      animationClass = 'dialogue-face--idle-carmina';
    }
  }

  const faceClassName = `dialogue-face ${animationClass}`;

  return (
    <div className="dialogue-root" onClick={handleClick}>
      <div className="dialogue-face-wrapper">
        <div
          className={faceClassName}
          style={{ backgroundImage: `url(${spriteToUse})` }}
        />
      </div>

      <div className="dialogue-panel">
        {speakerName && (
          <div className="dialogue-speaker-name">
            {speakerName}
          </div>
        )}

        <p className="dialogue-text">
          {displayedText}
        </p>

        <span
          className={`dialogue-next ${
            isDone ? 'dialogue-next--visible' : ''
          }`}
        >
          ▼
        </span>
      </div>
    </div>
  );
}
