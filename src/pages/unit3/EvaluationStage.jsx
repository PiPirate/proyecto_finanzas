import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../games/unit3/css/FinalLoanEvaluationGame.css";

// 👉 Importa tu minijuego final (ajusta la ruta según tu proyecto)
import FinalLoanEvaluationGame from "../../games/unit3/FinalLoanEvaluationGame";

export default function EvaluationStage({ onComplete, unitColor }) {
  const navigate = useNavigate();

  // Estado para mostrar el juego de evaluación
  const [isGameOpen, setIsGameOpen] = useState(true);

  const handleFinishEvaluation = (result) => {
    // Marca la evaluación como completada dentro de la unidad
    if (typeof onComplete === "function") {
      onComplete(result);
    }

    // Redirige al menú principal o página de módulos
    navigate("/");
  };

  return (
    <div className="stage-container">
      {/* Si el minijuego está abierto → se muestra */}
      {isGameOpen && (
        <FinalLoanEvaluationGame
          visible={true}
          onFinish={(result) => {
            setIsGameOpen(false);
            handleFinishEvaluation(result);
          }}
        />
      )}

      {/* Si quieres mantener un fondo/grilla detrás, mantenemos el contenedor */}
      {!isGameOpen && (
        <div className="evaluation-empty">
          <h2 className="evaluation-title">Evaluación Final</h2>

          <p className="evaluation-description">
            ¡Gracias por completar la evaluación de esta unidad!
          </p>

          <button className="evaluation-finish-btn" onClick={handleFinishEvaluation}>
            Finalizar evaluación
          </button>
        </div>
      )}
    </div>
  );
}
