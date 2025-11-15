// src/pages/unit1/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import Unit1GameScene from '../../games/unit1/Unit1GameScene';

export default function TutorialStage({ onComplete }) {
  const [completed, setCompleted] = useState(false);

  // Lo llama Unit1GameScene cuando termina TODO (asesor + MK25 + cerdito)
  const handleTutorialFinished = () => {
    setCompleted(true); // muestra el modal
  };

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete(); // aquí sí pasas a EvaluationStage
    }
  };

  return (
    <div className="tutorial-map-container">
      {/* Escena del banco */}
      <Unit1GameScene onComplete={handleTutorialFinished} />

      {/* Modal final centrado */}
      {completed && (
        <div className="tutorial-endcard-overlay">
          <div
            className="tutorial-endcard"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="tutorial-endcard-title">
              ¡Has finalizado el tutorial!
            </h2>
            <p className="tutorial-endcard-text">
              Terminaste el recorrido con el asesor, MK25 y la alcancía.
              <br />
              Ahora pasarás a la prueba evaluativa de conocimientos para poner
              a prueba lo que aprendiste en esta unidad.
            </p>
            <button
              type="button"
              className="tutorial-endcard-button"
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
