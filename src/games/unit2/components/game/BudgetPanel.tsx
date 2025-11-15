import React, { useState } from 'react';

interface BudgetPanelProps {
  totalIncome: number;
  currentBudget: { needs: number; wants: number; savings: number };
  onComplete: (budget: { needs: number; wants: number; savings: number }) => void;
  onClose: () => void;
}

export function BudgetPanel({ totalIncome, currentBudget, onComplete, onClose }: BudgetPanelProps) {
  const [needs, setNeeds] = useState(currentBudget.needs || Math.floor(totalIncome * 0.5));
  const [wants, setWants] = useState(currentBudget.wants || Math.floor(totalIncome * 0.3));
  const [savings, setSavings] = useState(currentBudget.savings || Math.floor(totalIncome * 0.2));

  const total = needs + wants + savings;
  const remaining = totalIncome - total;

  const needsPercent = Math.round((needs / totalIncome) * 100);
  const wantsPercent = Math.round((wants / totalIncome) * 100);
  const savingsPercent = Math.round((savings / totalIncome) * 100);

  const handleConfirm = () => {
    if (remaining < 0) {
      alert('Has excedido tu ingreso mensual. Ajusta las cantidades.');
      return;
    }
    if (savings === 0) {
      alert('Recuerda: ¡Siempre separa algo para el ahorro!');
      return;
    }
    onComplete({ needs, wants, savings });
  };

  return (
    <div className="game-panel-overlay">
      <div className="game-panel budget-panel">
        <div className="panel-header">
          <h2>📊 Planificación de Presupuesto</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        <div className="panel-content">
          <div className="budget-intro">
            <p>Distribuye tu ingreso mensual de <strong>${totalIncome.toLocaleString()}</strong> en tres categorías:</p>
          </div>

          <div className="budget-status">
            <span style={{ color: remaining >= 0 ? '#16a34a' : '#dc2626' }}>
              {remaining >= 0 ? `Disponible: $${remaining.toLocaleString()}` : `Excedido: $${Math.abs(remaining).toLocaleString()}`}
            </span>
          </div>

          <div className="budget-categories">
            <div className="budget-category budget-category--needs">
              <div className="category-header">
                <div className="category-icon">🛒</div>
                <div>
                  <h3>Necesidades</h3>
                  <p>Gastos básicos esenciales</p>
                </div>
              </div>
              <div className="category-amount">
                <span className="amount-value">${needs.toLocaleString()}</span>
                <span className="amount-percent">({needsPercent}%)</span>
              </div>
              <input
                type="range"
                value={needs}
                onChange={(e) => setNeeds(Number(e.target.value))}
                max={totalIncome}
                step={100}
              />
            </div>

            <div className="budget-category budget-category--wants">
              <div className="category-header">
                <div className="category-icon">🎮</div>
                <div>
                  <h3>Gustos</h3>
                  <p>Entretenimiento y opcionales</p>
                </div>
              </div>
              <div className="category-amount">
                <span className="amount-value">${wants.toLocaleString()}</span>
                <span className="amount-percent">({wantsPercent}%)</span>
              </div>
              <input
                type="range"
                value={wants}
                onChange={(e) => setWants(Number(e.target.value))}
                max={totalIncome}
                step={100}
              />
            </div>

            <div className="budget-category budget-category--savings">
              <div className="category-header">
                <div className="category-icon">🐷</div>
                <div>
                  <h3>Ahorro</h3>
                  <p>Para tus metas financieras</p>
                </div>
              </div>
              <div className="category-amount">
                <span className="amount-value">${savings.toLocaleString()}</span>
                <span className="amount-percent">({savingsPercent}%)</span>
              </div>
              <input
                type="range"
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
                max={totalIncome}
                step={100}
              />
            </div>
          </div>

          <div className="budget-tip">
            <p>💡 Regla guía 50-30-20: <strong>50% Necesidades</strong> / <strong>30% Gustos</strong> / <strong>20% Ahorro</strong></p>
          </div>

          <button 
            onClick={handleConfirm} 
            disabled={remaining < 0}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              background: remaining < 0 ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: remaining < 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Confirmar Presupuesto
          </button>
        </div>
      </div>
    </div>
  );
}