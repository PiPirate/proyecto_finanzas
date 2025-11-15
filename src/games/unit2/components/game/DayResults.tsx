import React from 'react';

interface DayResultsProps {
  day: number;
  budget: {
    total: number;
    needs: number;
    wants: number;
    savings: number;
    savingsGoal: number;
  };
  score: number;
  comfortLevel: number;
  streak: number;
  onContinue: () => void;
}

export function DayResults({ day, budget, score, comfortLevel, streak, onContinue }: DayResultsProps) {
  const savingsAchieved = budget.savings >= budget.savingsGoal;
  const positiveBalance = budget.total >= 0;

  return (
    <div className="day-results">
      <div className="results-modal">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Día {day} Completado</h2>

        {/* ASSET: Imagen de resultados (celebración o preocupación) */}
        <div className="results-image">
          {savingsAchieved && positiveBalance ? (
            <div className="celebration-icon">🎉</div>
          ) : (
            <div className="concern-icon">😰</div>
          )}
        </div>

        <div className="results-stats">
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <span className="stat-label">Puntuación</span>
            <span className="stat-value">{score}</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-label">Racha máxima</span>
            <span className="stat-value">{streak}</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">😊</span>
            <span className="stat-label">Nivel de confort</span>
            <span className="stat-value">{comfortLevel}%</span>
          </div>
        </div>

        <div className="results-budget">
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Presupuesto final del día</h3>
          <div className="budget-summary">
            <div className="summary-row">
              <span>🛒 Necesidades:</span>
              <span>${budget.needs.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>🎮 Gustos:</span>
              <span>${budget.wants.toLocaleString()}</span>
            </div>
            <div className="summary-row summary-row--highlight">
              <span>🐷 Ahorro:</span>
              <span>
                ${budget.savings.toLocaleString()} / ${budget.savingsGoal.toLocaleString()}
                {savingsAchieved && ' ✅'}
              </span>
            </div>
            <div className={`summary-row summary-row--total ${budget.total < 0 ? 'negative' : ''}`}>
              <span>💰 Saldo Total:</span>
              <span style={{ color: budget.total < 0 ? '#dc2626' : '#16a34a' }}>
                ${budget.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="results-feedback">
          {savingsAchieved && positiveBalance && (
            <p className="feedback feedback--positive">
              ¡Excelente! Mantuviste tu meta de ahorro y terminaste con saldo positivo.
            </p>
          )}
          {!savingsAchieved && positiveBalance && (
            <p className="feedback feedback--warning">
              Mantuviste saldo positivo, pero no alcanzaste tu meta de ahorro. Intenta priorizar el ahorro desde el inicio.
            </p>
          )}
          {budget.total < 0 && (
            <p className="feedback feedback--negative">
              Terminaste con saldo negativo. Revisa tus gastos y prioriza necesidades sobre gustos.
            </p>
          )}
        </div>

        <button 
          onClick={onContinue} 
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '12px 32px',
            fontSize: '16px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {day < 5 ? 'Continuar al Día ' + (day + 1) : 'Ver Resultados Finales'} →
        </button>
      </div>
    </div>
  );
}