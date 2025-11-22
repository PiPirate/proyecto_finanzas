// src/pages/unit1/EvaluationStage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EvaluationStage.css';

// IMPORTAMOS EL JUEGO
import { PuzzleGamePanel } from '../../games/evaluation/PuzzleGamePanel';

export default function EvaluationStage({ onComplete, unitColor }) {
  const navigate = useNavigate();
  const [showGame, setShowGame] = useState(true);

  const handleFinishEvaluation = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
    navigate('/'); // Regresa a módulos
  };

  return (
    <div className="tutorial-map-container">

      {/* Contenedor central tipo TutorialStage */}
      <div className="evaluation-map-frame">
        {showGame && (
          <PuzzleGamePanel
            onComplete={handleFinishEvaluation}
            onClose={() => setShowGame(false)}
          />
        )}

        {!showGame && (
          <div className="evaluation-empty">
            <h2 className="evaluation-title">Evaluación</h2>
            <p className="evaluation-description">
              Completa la actividad o continúa cuando quieras.
            </p>
          </div>
        )}
      </div>

      {/* Botón flotante SIEMPRE visible */}
      <div className="floating-continue-btn" onClick={handleFinishEvaluation}>
        Continuar →
      </div>
    </div>
  );
}
