// src/pages/unit1/TutorialStage.jsx
import React from 'react';
import '../css/TutorialStage.css';

// Juego de la unidad 2
import { GameWorld } from '../../games/unit2/components/GameWorld';
import '../../games/unit2/styles/globals.css';
import GameViewport from '../../components/responsive/GameViewport';
import { useDeviceMode } from '../../hooks/useDeviceMode';

export default function TutorialStage({ onComplete }) {
  const { isMobile } = useDeviceMode();

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete(); // Avanza a EvaluationStage
    }
  };

  return (
    <GameViewport>
      <div
        className={`tutorial-map-container ${
          isMobile ? 'tutorial-map-container--mobile' : ''
        }`}
      >
        {/* Escena del banco UNIT 2 */}
        <div
          className={`tutorial-game-wrapper ${
            isMobile ? 'tutorial-game-wrapper--mobile-scale' : ''
          }`}
        >
          <GameWorld onComplete={() => {}} />
        </div>

        {/* Botón flotante SIEMPRE visible */}
        <div className="floating-continue-btn" onClick={handleContinue}>
          Continuar →
        </div>
      </div>
    </GameViewport>
  );
}