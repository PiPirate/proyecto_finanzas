// src/pages/unit1/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import Unit1GameScene from '../../games/unit1/Unit1GameScene';
import GameViewport from '../../components/responsive/GameViewport';
import { useDeviceMode } from '../../hooks/useDeviceMode';

export default function TutorialStage({ onComplete }) {
  const [completed, setCompleted] = useState(false);
  const { isMobile } = useDeviceMode();

  const handleGoalReached = () => {
    // Solo marcamos completado una vez
    setCompleted((prev) => (prev ? prev : true));
  };

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete(); // 👉 aquí recién pasas a la prueba evaluativa
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
          {/* Escena del banco + MK25 + alcancía */}
          <Unit1GameScene onGoalReached={handleGoalReached} />
        </div>

        {/* Modal final al terminar TODO el recorrido (asesor + MK25 + cerdito) */}
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
                Ahora pasarás a la prueba evaluativa de conocimientos para poner
                a prueba lo que aprendiste en esta unidad.
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