// src/pages/unit1/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import Unit1GameScene from '../../games/unit1/Unit1GameScene';

export default function TutorialStage({ onComplete }) {
  const [completed, setCompleted] = useState(false);

  const handleGoalReached = () => {
    // Evitamos marcar completado varias veces
    setCompleted((prev) => (prev ? prev : true));
  };

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div className="tutorial-map-container">
      {/* Escena del banco */}
      <Unit1GameScene onGoalReached={handleGoalReached} />

      {/* Overlay de éxito, similar al que tenías */}
      {completed && (
        <div className="tutorial-success">
          <p>¡Llegaste a la estación principal del banco! 🎉</p>
          <button className="tutorial-continue-btn" onClick={handleContinue}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
