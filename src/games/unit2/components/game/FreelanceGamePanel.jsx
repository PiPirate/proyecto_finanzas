import React, { useState, useEffect } from 'react';

export default function FreelanceGamePanel({ onComplete, onClose }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [clicks, setClicks] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [moneyEarned, setMoneyEarned] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isComplete) {
      finishWork();
    }
  }, [timeLeft, isComplete]);

  const handleClick = () => {
    if (!isComplete) {
      setClicks(clicks + 1);
    }
  };

  const finishWork = () => {
    // $50 por click, máximo $800
    const earned = Math.min(clicks * 50, 800);
    setMoneyEarned(earned);
    setIsComplete(true);
  };

  const handleAccept = () => {
    onComplete(moneyEarned);
  };

  // --- PANEL DE RESULTADO ---
  if (isComplete) {
    return (
      <div className="game-panel-overlay">
        <div className="game-panel freelance-panel">
          <div className="panel-header">
            <h2>💼 Trabajo Completado</h2>
          </div>

          <div className="panel-content text-center">
            <div className="freelance-result">

              <p className="freelance-result-icon">💰</p>
              <h3>¡Ganaste ${moneyEarned}!</h3>
              <p className="freelance-note">
                {clicks} tareas completadas en 10 segundos
              </p>

              <div className="freelance-warning">
                <p>⚠️ <strong>Penalización:</strong> -50 puntos de balance vida-trabajo</p>
                <p style={{ fontSize: "14px" }}>
                  Trabajar de más afecta tu bienestar general.
                </p>
              </div>

              <button
                onClick={handleAccept}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  padding: "12px 32px",
                  fontSize: "16px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Aceptar Pago
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PANEL DE JUEGO ---
  return (
    <div className="game-panel-overlay">
      <div className="game-panel freelance-panel">

        <div className="panel-header">
          <div>
            <h2>💼 Trabajo Freelance</h2>
            <p className="panel-subtitle">¡Haz clic rápido para completar tareas!</p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        <div className="panel-content">
          <div className="freelance-game">

            <div className="freelance-timer">
              <p className="timer-label">Tiempo restante</p>
              <p className="timer-value">{timeLeft}s</p>
            </div>

            <button
              className="freelance-work-button"
              onClick={handleClick}
            >
              <span className="work-button-icon">⚡</span>
              <span className="work-button-text">¡Trabajar!</span>
              <span className="work-button-count">{clicks} tareas</span>
            </button>

            <div className="freelance-earnings">
              <p>
                💰 Ganando: <strong>${Math.min(clicks * 50, 800)}</strong>
              </p>
              <p className="earnings-rate">$50 por tarea (máx $800)</p>
            </div>

            <div className="freelance-tip">
              <p>💡 Tip: Haz clic lo más rápido posible durante 10 segundos</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
