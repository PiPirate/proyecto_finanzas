// src/pages/unit1/EvaluationStage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EvaluationStage.css';

// GameWorldSimple del banco (GameEvaluation.jsx)
import { GameWorldSimple } from '../../games/unit2/components/GameEvaluation';
import '../../games/unit2/styles/globals.css';

import GameViewport from '../../components/responsive/GameViewport';
import { useDeviceMode } from '../../hooks/useDeviceMode';

// 👉 Importamos los endpoints
import {
  getBeneficiarioByDocumento,
  actualizarNivel,
} from '../../api/endpoint';

// Mismo documento por defecto que usas en ModulesController
const DEFAULT_DOCUMENTO = '91111103';

export default function EvaluationStage({ onComplete }) {
  const { isMobile } = useDeviceMode();
  const navigate = useNavigate();

  const handleFinish = async () => {
    try {
      // 1. OBTENER DOCUMENTO IGUAL QUE EN ModulesController
      const storedDoc = localStorage.getItem('finanzas_doc');
      const documento = (storedDoc || DEFAULT_DOCUMENTO || '').trim();

      console.log('📄 [EvalStage] Documento para actualizar nivel:', documento);

      if (!documento) {
        console.warn(
          '[EvalStage] No hay documento (finanzas_doc ni DEFAULT_DOCUMENTO). No se actualiza nivel.'
        );
      } else {
        // 2. LEER USUARIO ACTUAL DESDE EL BACKEND
        const userData = await getBeneficiarioByDocumento(documento);
        console.log('[EvalStage] Usuario obtenido antes de subir nivel:', userData);

        if (userData) {
          const nivelActual = Number(userData.nivelactual ?? 0);
          // Queremos que al menos quede en 3 (para desbloquear módulo 3)
          const nextLevel = Math.max(nivelActual, 3);

          console.log(
            `[EvalStage] Subiendo nivel de ${nivelActual} a ${nextLevel}...`
          );

          await actualizarNivel(userData, nextLevel);

          console.log('✅ [EvalStage] Nivel actualizado en backend a:', nextLevel);
        } else {
          console.warn(
            `[EvalStage] No se encontró usuario con documento ${documento} al intentar subir nivel`
          );
        }
      }

      // 3. Avisar al flujo general (UnitPage) que la evaluación terminó
      if (typeof onComplete === 'function') {
        await onComplete();
      }

      // 4. Volver al menú principal
      navigate('/');

      // 5. Forzar que App.jsx se remonte y useModulesController
      // vuelva a leer el nivel nuevo desde el backend.
      window.location.reload();
    } catch (err) {
      console.error('❌ [EvalStage] Error al finalizar evaluación:', err);
      navigate('/');
    }
  };

  return (
    <GameViewport showControls={true} forceFullscreen>
      <div
        className={`tutorial-map-container ${
          isMobile ? 'tutorial-map-container--mobile' : ''
        }`}
      >
        {/* Wrapper del juego, igual al Tutorial */}
        <div
          className={`tutorial-game-wrapper ${
            isMobile ? 'tutorial-game-wrapper--mobile-scale' : ''
          }`}
        >
          {/* El dungeon: cuando se completa Bien, llama a handleFinish */}
          <GameWorldSimple onComplete={handleFinish} />
        </div>

        {/* Botón flotante opcional como salida manual extra */}
        <div className="floating-continue-btn" onClick={handleFinish}>
          Continuar →
        </div>
      </div>
    </GameViewport>
  );
}
