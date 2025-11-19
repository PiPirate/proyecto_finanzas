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
  const isPig =
    speakerName === 'Alcancía' || speakerName === 'Cerdito';

  // hablando mientras el texto se escribe
  const isSpeaking = !isDone;

  // sprite que se usa (hablando vs idle)
  const spriteToUse = isSpeaking
    ? (speakingSprite || idleSprite)
    : (idleSprite || speakingSprite);

  // clase de animación según personaje y si habla o está idle
  let animationClass = '';

  if (isPig) {
    // cerdito siempre estático (sin animación)
    animationClass = 'dialogue-face--pig';
  } else if (isSpeaking) {
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

// --- Caja de diálogo específica para la Unidad 4 ---
// Muestra el nombre "Barista", pero lo trata internamente como "Asesor"
// para reutilizar animaciones y lógica de expresión.

export function DialogueBoxUnit4({
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

  // Internamente lo tratamos como "Asesor" para animaciones
  const internalSpeaker =
    speakerName === 'Barista' ? 'Asesor' : speakerName;

  const isAdvisor = internalSpeaker === 'Asesor';
  const isCarmina = internalSpeaker === 'Carmina';
  const isPig =
    internalSpeaker === 'Alcancía' || internalSpeaker === 'Cerdito';

  const isSpeaking = !isDone;

  const spriteToUse = isSpeaking
    ? (speakingSprite || idleSprite)
    : (idleSprite || speakingSprite);

  let animationClass = '';

  if (isPig) {
    animationClass = 'dialogue-face--pig';
  } else if (isSpeaking) {
    if (isAdvisor) {
      animationClass = 'dialogue-face--talking-advisor';
    } else {
      animationClass = 'dialogue-face--talking-carmina';
    }
  } else {
    if (isAdvisor) {
      animationClass = 'dialogue-face--idle-advisor';
    } else {
      animationClass = 'dialogue-face--idle-carmina';
    }
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
          <div className="dialogue-speaker-name">
            {/* Aquí se muestra "Barista" en pantalla */}
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
