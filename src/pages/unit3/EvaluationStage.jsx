// src/pages/unit3/EvaluationStage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../games/unit3/css/FinalLoanEvaluationGame.css";
import GameViewport from "../../components/responsive/GameViewport";

// Minijuego de evaluación final
import FinalLoanEvaluationGame from "../../games/unit3/FinalLoanEvaluationGame";

// 👉 Importamos los endpoints (igual que en el otro EvaluationStage)
import {
  getBeneficiarioByDocumento,
  actualizarNivel,
} from "../../api/endpoint";

// Mismo documento por defecto que usas en ModulesController
const DEFAULT_DOCUMENTO = "91111103";

export default function EvaluationStage({ onComplete, unitColor }) {
  const navigate = useNavigate();

  // 🔚 Este handleFinish es el equivalente al del otro EvaluationStage
  const handleFinish = async (result) => {
    try {
      // 1. OBTENER DOCUMENTO IGUAL QUE EN ModulesController
      const storedDoc = localStorage.getItem("finanzas_doc");
      const documento = (storedDoc || DEFAULT_DOCUMENTO || "").trim();

      console.log(
        "📄 [EvalStage U3] Documento para actualizar nivel:",
        documento
      );

      // Opcional: solo subimos nivel si aprobó el juego
      const passed = result?.passed === true;

      if (!documento) {
        console.warn(
          "[EvalStage U3] No hay documento (finanzas_doc ni DEFAULT_DOCUMENTO). No se actualiza nivel."
        );
      } else if (!passed) {
        console.log(
          "[EvalStage U3] El jugador NO aprobó la evaluación. No se sube nivel."
        );
      } else {
        // 2. LEER USUARIO ACTUAL DESDE EL BACKEND
        const userData = await getBeneficiarioByDocumento(documento);
        console.log(
          "[EvalStage U3] Usuario obtenido antes de subir nivel:",
          userData
        );

        if (userData) {
          const nivelActual = Number(userData.nivelactual ?? 0);

          // 🔁 AJUSTA AQUÍ EL NIVEL MÍNIMO QUE QUIERES DEJAR
          // Por ejemplo, si esta es la evaluación de la unidad 3
          // y quieres desbloquear el módulo 4:
          const nextLevel = Math.max(nivelActual, 4);

          console.log(
            `[EvalStage U3] Subiendo nivel de ${nivelActual} a ${nextLevel}...`
          );

          await actualizarNivel(userData, nextLevel);

          console.log(
            "✅ [EvalStage U3] Nivel actualizado en backend a:",
            nextLevel
          );
        } else {
          console.warn(
            `[EvalStage U3] No se encontró usuario con documento ${documento} al intentar subir nivel`
          );
        }
      }

      // 3. Avisar al flujo general (UnitPage) que la evaluación terminó
      if (typeof onComplete === "function") {
        await onComplete(result);
      }

      // 4. Volver al menú principal
      navigate("/");

      // 5. Forzar que App.jsx se remonte y useModulesController
      // vuelva a leer el nivel nuevo desde el backend.
      window.location.reload();
    } catch (err) {
      console.error("❌ [EvalStage U3] Error al finalizar evaluación:", err);
      navigate("/");
    }
  };

  return (
    <GameViewport showControls={false} forceFullscreen>
      <div
        className="stage-container"
        style={unitColor ? { "--unit-color": unitColor } : undefined}
      >
        {/* El minijuego siempre visible, y su onFinish dispara handleFinish */}
        <FinalLoanEvaluationGame visible={true} onFinish={handleFinish} />
      </div>
    </GameViewport>
  );
}
