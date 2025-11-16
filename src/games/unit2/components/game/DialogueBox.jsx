// src/games/core/dialogue/DialogueBox.jsx
import React from 'react';
import useTypewriterText from '../../../core/hooks/useTypewriterText.js';
import './DialogueBox.css';

export default function DialogueBox({
  visible = true,
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

  const isAdvisor = speakerName === 'Asesor' || speakerName === "MK-25";
  const isCarmina = speakerName === 'Carmina' || speakerName === "Tú";
  const isPig = speakerName === 'Alcancía';

  const isSpeaking = !isDone;

  const spriteToUse = isSpeaking
    ? (speakingSprite || idleSprite)
    : (idleSprite || speakingSprite);

  let animationClass = '';

  if (isPig) {
    animationClass = 'dialogue-face--pig';
  } else if (isSpeaking) {
    animationClass = isAdvisor
      ? 'dialogue-face--talking-advisor'
      : 'dialogue-face--talking-carmina';
  } else {
    animationClass = isAdvisor
      ? 'dialogue-face--idle-advisor'
      : 'dialogue-face--idle-carmina';
  }

  const faceClassName = `dialogue-face ${animationClass}`;
  const wrapperClassName =
    'dialogue-face-wrapper' + (isPig ? ' dialogue-face-wrapper--pig' : '');

  return (
    <div className="dialogue-root" onClick={handleClick}>
      <div className={wrapperClassName}>
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
