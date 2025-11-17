// src/pages/unit1/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import GameWorld from '../../games/unit2/components/GameWorld';
import '../../games/unit2/styles/globals.css';

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
    <div className="app-container">
      {/* Escena del banco */}
      <GameWorld />
    </div>
  );
}