// src/pages/unit4/TutorialStage.jsx
import React, { useState } from 'react';
import '../css/TutorialStage.css';
import Unit4GameScene from '../../games/unit4/Unit4GameScene';

export default function TutorialStage({ onComplete }) {
  const [completed, setCompleted] = useState(false);

  const handleGoalReached = () => {
    setCompleted((prev) => (prev ? prev : true));
  };

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div className="tutorial-map-container">
      {/* Escena de la cafetería + links sospechosos + QR */}
      <Unit4GameScene onGoalReached={handleGoalReached} />

      {/* Modal final cuando termina TODO el recorrido */}
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
              Revisaste mensajes con enlaces sospechosos, aprendiste a
              diferenciar links confiables de los peligrosos y conociste buenas
              prácticas para pagar con QR sin ser víctima de fraude.
              <br />
              Ahora pasarás a la prueba evaluativa para poner a prueba lo que
              aprendiste en esta unidad.
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
