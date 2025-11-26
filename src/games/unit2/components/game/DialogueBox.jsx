// DialogueBox.jsx
import React from 'react';
import useTypewriterText from '../hooks/useTypewriterText';
import mk25dialogue from '../../assets/asesor1.png';
// Sprites placeholder - reemplaza con tus assets reales
import protagonistSpeaking from '../../assets/asesorSpeak.png';
import protagonistIdle from '../../assets/asesorIdle.png';
import mk25Robot from '../../assets/system.png';

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

  // quién está hablando
  const isAdvisor = speakerName === 'Asesor' || speakerName === 'MK-25';
  const isSystem = speakerName === 'Sistema';
  const isCarmina = speakerName === 'Carmina' || speakerName === 'Jugador';
  const isPig =
    speakerName === 'Alcancía' || speakerName === 'Cerdito';

  // hablando mientras el texto se escribe
  const isSpeaking = !isDone;

  // sprite que se usa
  let spriteToUse = '';
  
    if (isAdvisor) {
      spriteToUse = isSpeaking
        ? (speakingSprite || protagonistSpeaking)
        : (idleSprite || protagonistIdle);
    } else if (isSystem) {
    // Sistema usa el robot MK-25
    spriteToUse = mk25Robot;
  } else {
    // Para otros personajes, usa el sprite proporcionado
    spriteToUse = isSpeaking
      ? (speakingSprite || idleSprite || '')
      : (idleSprite || speakingSprite || '');
  }

  // clase de animación según personaje y si habla o está idle
  let animationClass = '';

  if (isPig) {
    // cerdito siempre estático (sin animación)
    animationClass = 'dialogue-face--pig';
  } else if (isAdvisor || isSystem) {
    // MK-25 y Sistema usan clase estática sin animación
    animationClass = 'dialogue-face--talking-advisor';
  } else if (isSpeaking) {
    // por defecto (Carmina u otros)
    animationClass = 'dialogue-face--talking-carmina';
  } else {
    // por defecto neutral (Carmina u otros)
    animationClass = 'dialogue-face--idle-carmina';
  }

  const faceClassName = `dialogue-face ${animationClass}`;

  // wrapper normal o especial para el cerdito (para poder cambiarle el tamaño)
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
