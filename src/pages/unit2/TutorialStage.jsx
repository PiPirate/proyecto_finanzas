// src/pages/unit1/TutorialStage.jsx
import React from 'react';
import '../css/TutorialStage.css';

// Juego de la unidad 2
import { GameWorld } from '../../games/unit2/components/GameWorld';
import '../../games/unit2/styles/globals.css';

export default function TutorialStage({ onComplete }) {

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete(); // Avanza a EvaluationStage
    }
  };

  return (
    <div className="tutorial-map-container">

      {/* Escena del banco UNIT 2 */}
      <GameWorld onComplete={() => {}} />

      {/* Botón flotante SIEMPRE visible */}
      <div className="floating-continue-btn" onClick={handleContinue}>
        Continuar →
      </div>

    </div>
  );
}
