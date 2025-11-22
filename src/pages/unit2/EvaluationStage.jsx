import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EvaluationStage.css';
import { GameWorldSimple } from '../../games/unit2/components/GameEvaluation';
import '../../games/unit2/styles/globals.css';
export default function EvaluationStage({ onComplete, unitColor }) {
  const navigate = useNavigate();

  const handleFinish = () => {
    onComplete();   // Marca esta sección como completada en UnitPage
    navigate('/');  // Regresa a módulos
  };

  return (
    <div className="stage-container">
        <h2 className="evaluation-title">Evaluación</h2>
      {/* Escena del banco UNIT 2 */}
      <GameWorldSimple onComplete={() => {}} />

      {/* Botón flotante SIEMPRE visible */}
      <div className="floating-continue-btn" onClick={handleFinish}>
        Continuar →
      </div>
    </div>
  );
}
