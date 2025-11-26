// src/pages/unit4/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import Unit4GameScene from '../../games/unit4/Unit4GameScene';
import GameViewport from '../../components/responsive/GameViewport';

export default function TutorialStage({ onComplete }) {
  const [completed, setCompleted] = useState(false);

  const handleGoalReached = () => {
    setCompleted((prev) => (prev ? prev : true));
  };

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <GameViewport>
      <div className="tutorial-map-container">
        {/* Escena de la cafetería + decisiones con el dinero + metas financieras */}
        <Unit4GameScene onGoalReached={handleGoalReached} />

        {/* Modal final cuando termina TODO el recorrido */}
        {completed && (
          <div className="tutorial-overlay">
            <div
              className="tutorial-success"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="tutorial-success-title">
                ¡Has finalizado el tutorial!
              </h2>

              <p className="tutorial-success-text">
                Practicaste cómo tomar decisiones más conscientes con tu dinero,
                identificando cuáles te acercan o te alejan de tus metas
                financieras.
                <br />
                También aprendiste a diferenciar metas de corto plazo (logros
                que puedes alcanzar pronto) y metas de largo plazo (objetivos que
                requieren más tiempo y planificación).
                <br />
                Ahora pasarás a la prueba evaluativa para poner en práctica lo que
                aprendiste sobre organizar tu dinero y tus metas.
              </p>

              <button
                type="button"
                className="tutorial-continue-btn"
                onClick={handleContinue}
              >
                Ir a la prueba evaluativa
              </button>
            </div>
          </div>
        )}
      </div>
    </GameViewport>
  );
}
