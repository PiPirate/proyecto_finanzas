// src/pages/unit4/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import Unit4GameScene from '../../games/unit4/Unit4GameScene';
import GameViewport from '../../components/responsive/GameViewport';
import { useDeviceMode } from '../../hooks/useDeviceMode';

export default function TutorialStage({ onComplete }) {
  const [completed, setCompleted] = useState(false);
  const { isMobile } = useDeviceMode();

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
      <div
        className={`tutorial-map-container ${
          isMobile ? 'tutorial-map-container--mobile' : ''
        }`}
      >
        <div
          className={`tutorial-game-wrapper ${
            isMobile ? 'tutorial-game-wrapper--mobile-scale' : ''
          }`}
        >
          {/* Escena de la cafetería + decisiones con el dinero + metas financieras */}
          <Unit4GameScene onGoalReached={handleGoalReached} />
        </div>

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
                identificando las metas financieras adecuadas.
                Ahora toca la prueba evaluativa.
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