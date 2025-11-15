// src/pages/unit1/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import Unit1GameScene from '../../games/unit1/Unit1GameScene';

export default function TutorialStage({ onComplete }) {
  const [completed, setCompleted] = useState(false);

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
    <div className="tutorial-map-container">
      {/* Escena del banco + MK25 + alcancía */}
      <Unit1GameScene onGoalReached={handleGoalReached} />

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
              Terminaste el recorrido con el asesor, MK25 y la alcancía.
              <br />
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
  );
}
