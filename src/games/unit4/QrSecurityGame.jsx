// src/games/unit4/QrSecurityGame.jsx
import React, { useState } from 'react';
import '../core/dialogue/DialogueBox.css';
import '../unit1/css/BudgetConsole.css';
import './css/LinksSecurityGame.css'; // reutilizamos el mismo estilo
import useTypewriterText from '../core/hooks/useTypewriterText';

const qrQuestions = [
  {
    id: 1,
    title: 'Meta 1',
    message:
      'Quiero ahorrar 200.000 pesos en 2 meses para pagar la inscripción a un curso que empieza pronto.',
    detail:
      'Piensas guardar 100.000 cada mes y ya revisaste el valor exacto del curso.',
    correct: 'corto',
    explanation:
      'Es una meta de corto plazo: tiene un monto claro, un plazo cercano (2 meses) y un propósito específico (inscripción del curso).',
  },
  {
    id: 2,
    title: 'Meta 2',
    message:
      'Quiero comprarme una casa “algún día” cuando tenga plata.',
    detail:
      'No sabes cuánto cuesta, ni en cuánto tiempo quisieras lograrlo, solo que te gustaría.',
    correct: 'largo',
    explanation:
      'Comprar vivienda suele ser una meta de largo plazo, pero aquí está muy difusa. Falta definir un plazo aproximado y un monto objetivo para que sea realmente útil.',
  },
  {
    id: 3,
    title: 'Meta 3',
    message:
      'Quiero crear un fondo de emergencia de 3 meses de gastos en los próximos 3 años.',
    detail:
      'Ya calculaste que tus gastos mensuales son 800.000, así que tu meta total es de 2.400.000.',
    correct: 'largo',
    explanation:
      'Es una meta de largo plazo pero bien planteada: tiene monto concreto, plazo y un propósito muy claro (emergencias). Así puedes ir avanzando poco a poco.',
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
      <div className="links-game-phone-shell minigame-container">
        <div className="links-game-phone-bezel">
          <div className="links-game-phone-speaker" />

          <div
            className="links-game-card"
            onClick={phase === 'feedback' ? handleCardClick : undefined}
          >
            <div className="links-game-phone-header">
              <span className="links-game-phone-signal">▲▲▲</span>
              <span className="links-game-phone-title">
                Metas financieras
              </span>
              <span className="links-game-phone-battery">█ ▓ ▒</span>
            </div>

            <h2 className="links-game-title">
              ¿Meta de corto o largo plazo?
            </h2>

            {phase === 'question' && (
              <>
                <p className="links-game-subtitle">
                  Lee la meta financiera de Carmina y decide si es de corto plazo
                  (se logra pronto) o de largo plazo (requiere más tiempo y planificación).
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

                    {/* Caja retro para representar la meta */}
                    <div className="qr-fake-box">
                      <span className="qr-fake-label">META</span>
                    </div>
                  </div>
                </div>

                <div className="links-game-buttons">
                  <button
                    type="button"
                    className="links-game-btn links-game-btn--safe"
                    onClick={() => handleAnswer('corto')}
                  >
                    Meta de corto plazo
                  </button>
                  <button
                    type="button"
                    className="links-game-btn links-game-btn--danger"
                    onClick={() => handleAnswer('largo')}
                  >
                    Meta de largo plazo
                  </button>
                </div>

                <p className="links-game-progress">
                  Meta {index + 1} de {qrQuestions.length}
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
