// src/pages/unit3/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import Unit3GameScene from '../../games/unit3/Unit3GameScene';
import GameViewport from '../../components/responsive/GameViewport';
import { useDeviceMode } from '../../hooks/useDeviceMode';

export default function TutorialStage({ onComplete }) {
  const [completed, setCompleted] = useState(false);
  const { isMobile } = useDeviceMode();

  const handleGoalReached = () => {
    // Evita volver a marcar completado si ya ocurrió
    setCompleted((prev) => (prev ? prev : true));
  };

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete(); // 👉 Avanza a la prueba evaluativa de la unidad 3
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
          {/* Escena interactiva de la Unidad 3 */}
          <Unit3GameScene onGoalReached={handleGoalReached} />
        </div>

        {/* Modal de éxito al terminar TODO el tutorial */}
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
                Completaste correctamente el recorrido interactivo de esta
                unidad.
                <br />
                Ahora continuarás con la prueba evaluativa para poner en
                práctica lo aprendido.
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
