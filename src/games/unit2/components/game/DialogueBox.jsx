import React from 'react';
import useTypewriterText from '../hooks/useTypewriterText';

// Sprites por defecto (placeholders)
const protagonistSpeaking =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23131b34"/><circle cx="100" cy="100" r="60" fill="%234c6fbf"/><text x="100" y="120" font-size="60" text-anchor="middle">😊</text></svg>';

const protagonistIdle =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23131b34"/><circle cx="100" cy="100" r="60" fill="%234c6fbf"/><text x="100" y="120" font-size="60" text-anchor="middle">😌</text></svg>';

const mk25Robot =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23131b34"/><rect x="50" y="50" width="100" height="100" fill="%239bb6ff" rx="10"/><text x="100" y="120" font-size="60" text-anchor="middle">🤖</text></svg>';

export default function DialogueBox({
  visible = true,
  text,
  speakingSprite,
  idleSprite,
  speakerName,
  onNext
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

  // Tipo de personaje
  const isAdvisor = speakerName === 'Asesor' || speakerName === 'MK-25';
  const isSystem = speakerName === 'Sistema';
  const isCarmina = speakerName === 'Carmina' || speakerName === 'Jugador';
  const isPig = speakerName === 'Alcancía' || speakerName === 'Cerdito';

  // Si está hablando (animación activa)
  const isSpeaking = !isDone;

  // Sprite a usar
  let spriteToUse = '';

  if (isAdvisor) {
    spriteToUse = isSpeaking ? protagonistSpeaking : protagonistIdle;
  } else if (isSystem) {
    spriteToUse = mk25Robot;
  } else {
    spriteToUse = isSpeaking
      ? (speakingSprite || idleSprite || '')
      : (idleSprite || speakingSprite || '');
  }

  // Clases de animación según personaje
  let animationClass = '';

  if (isPig) {
    animationClass = 'dialogue-face--pig';
  } else if (isAdvisor || isSystem) {
    animationClass = 'dialogue-face--talking-advisor';
  } else if (isSpeaking) {
    animationClass = 'dialogue-face--talking-carmina';
  } else {
    animationClass = 'dialogue-face--idle-carmina';
  }

  const faceClassName = `dialogue-face ${animationClass}`;

  const wrapperClassName =
    'dialogue-face-wrapper' +
    (isPig ? ' dialogue-face-wrapper--pig' : '');

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
          <div className="dialogue-speaker-name">{speakerName}</div>
        )}

        <p className="dialogue-text">{displayedText}</p>

        <span
          className={`dialogue-next ${isDone ? 'dialogue-next--visible' : ''}`}
        >
          ▼
        </span>
      </div>
    </div>
  );
}
