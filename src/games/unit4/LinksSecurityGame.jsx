// src/games/unit4/LinksSecurityGame.jsx
import React, { useState } from 'react';
import '../core/dialogue/DialogueBox.css';
import '../unit1/css/BudgetConsole.css';
import './css/LinksSecurityGame.css';
import useTypewriterText from '../core/hooks/useTypewriterText';

const questions = [
  {
    id: 1,
    title: 'Mensaje 1',
    message:
      '“Has ganado un premio del Banco Andino. Reclámalo aquí antes de 10 minutos 👇”',
    link: 'https://bancoand1no-seguro.com/premios',
    correct: 'sospechoso',
    explanation:
      'El nombre del dominio está mal escrito (and1no) y mezcla letras con números. Además, te mete presión con poco tiempo: típico de phishing.',
  },
  {
    id: 2,
    title: 'Mensaje 2',
    message:
      '“Tu app de pedidos tiene una actualización de seguridad. Descárgala desde la tienda oficial.”',
    link: 'https://play.google.com/store/apps/details?id=com.app.oficial',
    correct: 'seguro',
    explanation:
      'Las actualizaciones legítimas suelen llevarte a la tienda oficial (Play Store o App Store), no a páginas raras con nombres extraños.',
  },
  {
    id: 3,
    title: 'Mensaje 3',
    message:
      '“Hicimos un cargo desconocido a tu cuenta. Revisa en: http://bit.ly/seguridad-banco-rapida”',
    link: 'http://bit.ly/seguridad-banco-rapida',
    correct: 'sospechoso',
    explanation:
      'Los acortadores (bit.ly, tinyurl, etc.) ocultan a dónde vas a llegar. Mezclados con miedo (“cargo desconocido”) son una señal fuerte de estafa.',
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
              <span>Mensajes</span>
              <span>▮▮▮</span>
            </div>

            <h2 className="links-game-title">Detecta enlaces sospechosos</h2>

            {phase === 'question' && (
              <div className="links-game-body">
                <p className="links-game-subtitle">
                  Lee el mensaje como si te llegara al celular y decide si el enlace es confiable o sospechoso.
                </p>

                <div className="links-game-message">
                  <div className="links-game-message-bubble">
                    <span className="links-game-message-title">
                      {current.title}
                    </span>
                    <p className="links-game-message-text">
                      {current.message}
                    </p>
                    <code className="links-game-link">
                      {current.link}
                    </code>
                  </div>
                </div>

                {/* Zona inferior pegada al fondo del card */}
                <div className="links-game-bottom">
                  <div className="links-game-buttons">
                    <button
                      type="button"
                      className="links-game-btn links-game-btn--safe"
                      onClick={() => handleAnswer('seguro')}
                    >
                      Link confiable
                    </button>
                    <button
                      type="button"
                      className="links-game-btn links-game-btn--danger"
                      onClick={() => handleAnswer('sospechoso')}
                    >
                      Link sospechoso
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
