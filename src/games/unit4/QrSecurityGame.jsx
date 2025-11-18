// src/games/unit4/QrSecurityGame.jsx
import React, { useState } from 'react';
import '../core/dialogue/DialogueBox.css';
import '../unit1/css/BudgetConsole.css';
import './css/LinksSecurityGame.css'; // reutilizamos el mismo estilo de “celular retro”
import useTypewriterText from '../core/hooks/useTypewriterText';

const qrQuestions = [
  {
    id: 1,
    title: 'Escena 1',
    message:
      'En la mesa ves un código QR pegado encima de otro, con un papel un poco torcido.',
    detail: 'El mesero no sabe quién lo pegó y el letrero original está debajo.',
    correct: 'sospechoso',
    explanation:
      'Un QR pegado encima de otro puede redirigir tu pago a otra cuenta. Si ves algo encima del QR original, no lo escanees y avisa al local.',
  },
  {
    id: 2,
    title: 'Escena 2',
    message:
      'Por chat te llega una foto de un QR diciendo: “Paga aquí tu consumo, te damos 10% de descuento si lo haces ya”.',
    detail: 'No es el canal oficial del comercio y no estás en el local.',
    correct: 'sospechoso',
    explanation:
      'Los comercios serios no te piden escanear QRs enviados por chats desconocidos. Es fácil que te manden un QR de un extraño para robarte el pago.',
  },
  {
    id: 3,
    title: 'Escena 3',
    message:
      'En la barra del local hay un QR impreso dentro de un acrílico con el logo oficial de la cafetería.',
    detail:
      'La app muestra el nombre de la cafetería y el valor exacto de tu consumo antes de confirmar.',
    correct: 'seguro',
    explanation:
      'Un QR físico bien presentado, verificado por el personal y con nombre y valor correctos en la app es una señal de pago seguro.',
  },
];

export default function QrSecurityGame({ visible, onFinished }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('question'); // 'question' | 'feedback'
  const [feedbackText, setFeedbackText] = useState('');

  const current = qrQuestions[index];
  const isLast = index === qrQuestions.length - 1;

  const { displayedText, isDone, showAll } = useTypewriterText(
    phase === 'feedback' ? feedbackText : '',
    28
  );

  if (!visible) return null;
  if (!current) return null;

  const handleAnswer = (choice) => {
    if (phase !== 'question') return;

    const correct = choice === current.correct;
    const prefix = correct ? '¡Bien! ' : 'Ojo: ';

    setFeedbackText(prefix + current.explanation);
    setPhase('feedback');
  };

  const handleCardClick = () => {
    if (phase !== 'feedback') return;

    if (!isDone) {
      showAll();
      return;
    }

    if (!isLast) {
      setIndex((prev) => prev + 1);
      setPhase('question');
      setFeedbackText('');
    } else if (typeof onFinished === 'function') {
      onFinished();
    }
  };

  return (
    <div className="links-game-overlay">
      <div className="links-game-phone-shell">
        <div className="links-game-phone-bezel">
          <div className="links-game-phone-speaker" />

          <div
            className="links-game-card"
            onClick={phase === 'feedback' ? handleCardClick : undefined}
          >
            <div className="links-game-phone-header">
              <span className="links-game-phone-signal">▲▲▲</span>
              <span className="links-game-phone-title">
                Escanear QR
              </span>
              <span className="links-game-phone-battery">█ ▓ ▒</span>
            </div>

            <h2 className="links-game-title">
              ¿QR confiable o trampa?
            </h2>

            {phase === 'question' && (
              <>
                <p className="links-game-subtitle">
                  Imagina que vas a tocar este código QR retro y decide
                  si la escena es segura o sospechosa.
                </p>

                <div className="links-game-message">
                  <div className="links-game-message-bubble">
                    <strong className="links-game-message-title">
                      {current.title}
                    </strong>
                    <p className="links-game-message-text">
                      {current.message}
                    </p>
                    <p className="links-game-message-text">
                      <em>{current.detail}</em>
                    </p>

                    {/* “QR” retro fake */}
                    <div className="qr-fake-box">
                      <span className="qr-fake-label">QR</span>
                    </div>
                  </div>
                </div>

                <div className="links-game-buttons">
                  <button
                    type="button"
                    className="links-game-btn links-game-btn--safe"
                    onClick={() => handleAnswer('seguro')}
                  >
                    QR confiable
                  </button>
                  <button
                    type="button"
                    className="links-game-btn links-game-btn--danger"
                    onClick={() => handleAnswer('sospechoso')}
                  >
                    QR sospechoso
                  </button>
                </div>

                <p className="links-game-progress">
                  Situación {index + 1} de {qrQuestions.length}
                </p>
              </>
            )}

            {phase === 'feedback' && (
              <div className="links-game-feedback">
                <p className="links-game-feedback-text">
                  {displayedText}
                </p>
                {isDone && (
                  <span className="links-game-next-hint">
                    Toca la pantalla para continuar ▼
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="links-game-phone-home-btn" />
        </div>
      </div>
    </div>
  );
}
