// src/pages/unit1/EvaluationStage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EvaluationStage.css';

// Nuevo GameWorldSimple depurado
import { GameWorldSimple } from '../../games/unit2/components/GameEvaluation';
import '../../games/unit2/styles/globals.css';

import GameViewport from '../../components/responsive/GameViewport';
import { useDeviceMode } from '../../hooks/useDeviceMode';

export default function EvaluationStage({ onComplete }) {
  const { isMobile } = useDeviceMode();
  const navigate = useNavigate();

  const handleFinish = () => {
    if (typeof onComplete === 'function') {
      onComplete(); // Marca como completado
    }
    navigate('/'); // Volver a módulos
  };

  return (
    <GameViewport showControls={true} forceFullscreen>
      <div
        className={`tutorial-map-container ${
          isMobile ? 'tutorial-map-container--mobile' : ''
        }`}
      >
        {/* Wrapper del juego, igual al Tutorial */}
        <div
          className={`tutorial-game-wrapper ${
            isMobile ? 'tutorial-game-wrapper--mobile-scale' : ''
          }`}
        >
          <GameWorldSimple onComplete={() => {}} />
        </div>

        {/* Botón flotante siempre visible */}
        <div className="floating-continue-btn" onClick={handleFinish}>
          Continuar →
        </div>
      </div>
    </GameViewport>
  );
}
