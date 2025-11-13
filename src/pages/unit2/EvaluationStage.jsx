import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EvaluationStage.css';

export default function EvaluationStage({ onComplete, unitColor }) {
  const navigate = useNavigate();

  const handleFinish = () => {
    onComplete();   // Marca esta sección como completada en UnitPage
    navigate('/');  // Regresa a módulos
  };

  return (
    <div className="stage-container">
      <div className="evaluation-empty">
        <h2 className="evaluation-title">Evaluación</h2>

        <p className="evaluation-description">
          Aquí estará la evaluación interactiva de esta unidad.  
          Esta vista está limpia y lista para agregar el juego de preguntas más adelante.
        </p>

        <button className="evaluation-finish-btn" onClick={handleFinish}>
          Finalizar evaluación
        </button>
      </div>
    </div>
  );
}
