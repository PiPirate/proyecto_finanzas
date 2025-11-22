import React from 'react';

export function GameOver({ won, finalScore, finalBudget, comfortLevel, onRestart, onBackToMenu }) {
  const grade = finalScore >= 200 ? 'A' : finalScore >= 150 ? 'B' : finalScore >= 100 ? 'C' : 'D';

  return (
    <div className="game-over">
      <div className="game-over-modal">
        <div className="game-over-image">
          {won ? (
            <div className="victory-animation">
              <span className="victory-icon">🏆</span>
              <h2 className="victory-title">¡Victoria!</h2>
            </div>
          ) : (
            <div className="defeat-animation">
              <span className="defeat-icon">😔</span>
              <h2 className="defeat-title">Fin del Juego</h2>
            </div>
          )}
        </div>

        <div className="final-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <p className="stat-label">Puntuación Final</p>
              <p className="stat-value">{finalScore}</p>
              <p className="stat-grade">Calificación: {grade}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">😊</div>
            <div className="stat-content">
              <p className="stat-label">Confort Final</p>
              <p className="stat-value">{comfortLevel}%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <p className="stat-label">Saldo Final</p>
              <p className="stat-value" style={{ color: finalBudget.total < 0 ? '#dc2626' : '#16a34a' }}>
                ${finalBudget.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="final-summary">
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Resumen Final</h3>
          
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-icon">🛒</span>
              <span className="summary-label">Necesidades</span>
              <span className="summary-value">${finalBudget.needs.toLocaleString()}</span>
            </div>

            <div className="summary-item">
              <span className="summary-icon">🎮</span>
              <span className="summary-label">Gustos</span>
              <span className="summary-value">${finalBudget.wants.toLocaleString()}</span>
            </div>

            <div className="summary-item summary-item--highlight">
              <span className="summary-icon">🐷</span>
              <span className="summary-label">Ahorro logrado</span>
              <span className="summary-value">
                ${finalBudget.savings.toLocaleString()}
                {finalBudget.savings >= finalBudget.savingsGoal && ' ✅'}
              </span>
            </div>
          </div>
        </div>

        <div className="final-message">
          {won ? (
            <>
              <p className="message-title">¡Felicitaciones!</p>
              <p className="message-text">
                Lograste completar las 5 rondas manteniendo tu meta de ahorro y un saldo positivo. 
                Has demostrado habilidad para gestionar tu presupuesto personal.
              </p>
            </>
          ) : (
            <>
              <p className="message-title">¡Buen intento!</p>
              <p className="message-text">
                Recuerda: prioriza necesidades, separa tu ahorro desde el inicio, y ajusta tus gustos según tu presupuesto. 
                ¡Inténtalo nuevamente!
              </p>
            </>
          )}
        </div>

        <div className="final-actions">
          <button 
            onClick={onRestart} 
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            🔄 Jugar de Nuevo
          </button>
          <button 
            onClick={onBackToMenu} 
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              background: 'transparent',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🏠 Volver al Menú
          </button>
        </div>
      </div>
    </div>
  );
}
