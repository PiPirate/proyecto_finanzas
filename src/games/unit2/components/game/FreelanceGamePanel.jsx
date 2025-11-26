import React, { useEffect, useMemo, useState, useCallback } from 'react';

const ROUND_DURATION_MS = 20000; // 20 segundos de trabajo intensivo
const WELLBEING_PER_CLICK = 5; // Impacto acumulativo por click de trabajo

export function FreelanceGamePanel({ currentDay = 1, playerBudget, onComplete, onClose }) {
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION_MS);
  const [clicks, setClicks] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [status, setStatus] = useState('active'); // active | summary

  const wellbeingPenalty = useMemo(() => clicks * WELLBEING_PER_CLICK, [clicks]);

  const formatTime = useCallback((ms) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (status !== 'active') return undefined;

    const startedAt = performance.now();
    let animationFrame;

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, ROUND_DURATION_MS - elapsed);
      setTimeLeft(remaining);

      if (remaining > 0) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        setStatus('summary');
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [status]);

  const handleWork = useCallback((event) => {
    event.preventDefault();
    if (status !== 'active') return;

    const pay = 500 + Math.floor(Math.random() * 301); // $500 - $800
    setClicks(prev => prev + 1);
    setEarnings(prev => prev + pay);
  }, [status]);

  const finalBudget = useMemo(() => ({
    needs: playerBudget?.needs ?? 0,
    wants: playerBudget?.wants ?? 0,
    savings: (playerBudget?.savings ?? 0) + earnings,
  }), [playerBudget?.needs, playerBudget?.savings, playerBudget?.wants, earnings]);

  const handleFinish = useCallback(() => {
    onComplete?.({
      finalBudget,
      wellbeingPenalty,
      clicks,
      earnings,
    });
  }, [onComplete, finalBudget, wellbeingPenalty, clicks, earnings]);

  return (
    <div className="game-panel-overlay">
      <div className="game-panel freelance-panel">
        <div className="panel-header">
          <h2>💼 Trabajo Freelance (Día {currentDay})</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="freelance-game">
          {status === 'active' ? (
            <>
              <div className="freelance-timer">
                <div className="timer-label">Tiempo restante</div>
                <div className="timer-value">{formatTime(timeLeft)}</div>
              </div>

              <button
                className="freelance-work-button"
                onClick={handleWork}
                onTouchStart={handleWork}
              >
                <div className="work-button-icon">⚡</div>
                <div className="work-button-text">TRABAJAR</div>
                <div className="work-button-count">Clics: {clicks}</div>
              </button>

              <div className="freelance-earnings">
                <p><strong>Ganancia acumulada:</strong> ${earnings.toLocaleString()}</p>
                <p className="earnings-rate">Cada clic genera entre $500 y $800</p>
              </div>

              <div className="freelance-tip">
                <p>Tip: Trabajar freelance ayuda en emergencias, pero puede desgastarte.</p>
              </div>
            </>
          ) : (
            <div className="freelance-result">
              <div className="freelance-result-icon">✅</div>
              <h3>Sesión completada</h3>
              <p>Ganaste <strong>${earnings.toLocaleString()}</strong> en este turno.</p>
              <p className="freelance-note">Tu bienestar bajó {wellbeingPenalty} puntos por el esfuerzo extra.</p>

              <div className="freelance-warning">
                <p><strong>Recuerda:</strong> El trabajo extra no es sostenible todos los días.</p>
              </div>

              <button className="primary-btn" onClick={handleFinish}>
                Continuar con ${finalBudget.savings.toLocaleString()} ahorrados
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FreelanceGamePanel;
