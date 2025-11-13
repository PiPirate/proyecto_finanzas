import React from 'react';
import '../css/TutorialStage.css';

export default function TutorialStage({ onComplete, unitColor }) {
  return (
    <div className="stage-container">
      <div className="tutorial-empty">
        <h2 className="tutorial-title">Tutorial Interactivo</h2>

        <p className="tutorial-description">
          Aquí irá el juego interactivo del tutorial.  
          Esta vista ha sido limpiada para agregar el juego más adelante.
        </p>

        <button className="tutorial-continue-btn" onClick={onComplete}>
          Continuar
        </button>
      </div>
    </div>
  );
}
