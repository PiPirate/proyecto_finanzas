// src/games/unit4/LinksSecurityGame.jsx
import React, { useState } from 'react';
import '../core/dialogue/DialogueBox.css';
import '../unit1/css/BudgetConsole.css';
import './css/LinksSecurityGame.css';
import useTypewriterText from '../core/hooks/useTypewriterText';

const questions = [
  {
    id: 1,
    title: 'Situación 1',
    message:
      'Te pagan 200.000 pesos por un trabajo extra y además recibes tu mesada normal.',
    decision:
      'Decides gastarte todo en domicilios y ropa en los próximos 3 días, sin guardar nada.',
    correct: 'riesgosa',
    explanation:
      'Si gastas todo de una vez, te quedas sin dinero para el resto del mes y no avanzas en ninguna meta financiera. Antes de gastar, es mejor separar algo para tus metas y tus gastos básicos.',
  },
  {
    id: 2,
    title: 'Situación 2',
    message:
      'Quieres ahorrar para comprar unos audífonos que cuestan 240.000 pesos en 3 meses.',
    decision:
      'Decides guardar 80.000 pesos cada mes apenas recibes tu dinero, y dejar lo demás para gastos normales y pequeños gustos.',
    correct: 'responsable',
    explanation:
      'Estás conectando tu decisión diaria con tu meta: sabes cuánto cuestan los audífonos, en cuánto tiempo los quieres y cuánto guardar cada mes. Eso es una decisión financiera responsable.',
  },
  {
    id: 3,
    title: 'Situación 3',
    message:
      'Tienes una tarjeta de crédito casi llena y recibes la oferta de hacer una compra grande “a muchas cuotas con una cuota muy bajita este mes”.',
    decision:
      'Aceptas de inmediato sin revisar cuánto vas a pagar en total ni cuántos meses durarás pagando.',
    correct: 'riesgosa',
    explanation:
      'Aceptar una deuda sin revisar tiempo ni monto total puede alejarte de tus metas financieras. Las cuotas parecen pequeñas, pero sumadas pueden ser un problema a largo plazo.',
  },
];

export default function LinksSecurityGame({ visible, onFinished }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('question'); // 'question' | 'feedback'
  const [feedbackText, setFeedbackText] = useState('');
  const [wasCorrect, setWasCorrect] = useState(false);

  const current = questions[index];
  const isLastQuestion = index === questions.length - 1;

  const { displayedText, isDone, showAll } = useTypewriterText(
    phase === 'feedback' ? feedbackText : '',
    28
  );

  if (!visible) return null;
  if (!current) return null;

  const handleAnswer = (choice) => {
    if (phase !== 'question') return;

    const correct = choice === current.correct;
    setWasCorrect(correct);

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

    if (!isLastQuestion) {
      setIndex((prev) => prev + 1);
      setPhase('question');
      setFeedbackText('');
      setWasCorrect(false);
    } else {
      if (typeof onFinished === 'function') {
        onFinished();
      }
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
              <span>▲▲▲</span>
              <span>Decisiones con tu dinero</span>
              <span>▮▮▮</span>
            </div>

            <h2 className="links-game-title">
              ¿Decisión responsable o riesgosa?
            </h2>

            {phase === 'question' && (
              <div className="links-game-body">
                <p className="links-game-subtitle">
                  Lee la situación y la decisión que se toma con el dinero.
                  Elige si es una decisión financiera responsable o riesgosa para las metas de Carmina.
                </p>

                <div className="links-game-message">
                  <div className="links-game-message-bubble">
                    <span className="links-game-message-title">
                      {current.title}
                    </span>
                    <p className="links-game-message-text">
                      {current.message}
                    </p>
                    <p className="links-game-message-text">
                      <strong>Decisión:</strong> {current.decision}
                    </p>
                  </div>
                </div>

                {/* Zona inferior pegada al fondo del card */}
                <div className="links-game-bottom">
                  <div className="links-game-buttons">
                    <button
                      type="button"
                      className="links-game-btn links-game-btn--safe"
                      onClick={() => handleAnswer('responsable')}
                    >
                      Decisión responsable
                    </button>
                    <button
                      type="button"
                      className="links-game-btn links-game-btn--danger"
                      onClick={() => handleAnswer('riesgosa')}
                    >
                      Decisión riesgosa
                    </button>
                  </div>

                  <p className="links-game-progress">
                    Ejemplo {index + 1} de {questions.length}
                  </p>
                </div>
              </div>
            )}

            {phase === 'feedback' && (
              <div className="links-game-feedback">
                <p className="links-game-feedback-text">
                  {displayedText}
                </p>
                {isDone && (
                  <span className="links-game-next-hint">
                    Haz clic para continuar ▼
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
