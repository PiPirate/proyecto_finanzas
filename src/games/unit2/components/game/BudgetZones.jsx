import React, { useState } from 'react';

export default function BudgetZones({ totalIncome, currentBudget, onComplete, tutorialMode }) {
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
    if (savings === 0 && tutorialMode) {
      alert('Recuerda: ¡Siempre separa algo para el ahorro!');
      return;
    }
    onComplete({ needs, wants, savings });
  };

  return (
    <div className="budget-zones-overlay">
      <div className="budget-zones-modal">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          Distribuye tu presupuesto mensual
        </h2>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ textAlign: 'center' }}>
            Ingreso mensual: <strong>${totalIncome.toLocaleString()}</strong>
          </p>
          <p style={{ textAlign: 'center', color: remaining < 0 ? '#ef4444' : '#22c55e' }}>
            {remaining >= 0
              ? `Restante: $${remaining.toLocaleString()}`
              : `Excedido: $${Math.abs(remaining).toLocaleString()}`}
          </p>
        </div>

        {/* NECESIDADES */}
        <div className="budget-zone budget-zone--needs">
          <div className="zone-header">
            <div className="zone-icon">🛒</div>
            <div className="zone-info">
              <h3>Necesidades</h3>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Gastos básicos esenciales</p>
            </div>
          </div>

          <div className="zone-amount">
            <span className="amount">${needs.toLocaleString()}</span>
            <span className="percentage">({needsPercent}%)</span>
          </div>

          <input
            type="range"
            value={needs}
            onChange={(e) => setNeeds(Number(e.target.value))}
            max={totalIncome}
            step={100}
            className="zone-slider"
          />
        </div>

        {/* GUSTOS */}
        <div className="budget-zone budget-zone--wants">
          <div className="zone-header">
            <div className="zone-icon">🎮</div>
            <div className="zone-info">
              <h3>Gustos</h3>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Entretenimiento y opcionales</p>
            </div>
          </div>

          <div className="zone-amount">
            <span className="amount">${wants.toLocaleString()}</span>
            <span className="percentage">({wantsPercent}%)</span>
          </div>

          <input
            type="range"
            value={wants}
            onChange={(e) => setWants(Number(e.target.value))}
            max={totalIncome}
            step={100}
            className="zone-slider"
          />
        </div>

        {/* AHORRO */}
        <div className="budget-zone budget-zone--savings">
          <div className="zone-header">
            <div className="zone-icon">🐷</div>
            <div className="zone-info">
              <h3>Ahorro</h3>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Para tus metas financieras</p>
            </div>
          </div>

          <div className="zone-amount">
            <span className="amount">${savings.toLocaleString()}</span>
            <span className="percentage">({savingsPercent}%)</span>
          </div>

          <input
            type="range"
            value={savings}
            onChange={(e) => setSavings(Number(e.target.value))}
            max={totalIncome}
            step={100}
            className="zone-slider"
          />
        </div>

        {/* Regla 50-30-20 */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: '#eff6ff',
            borderRadius: '8px',
          }}
        >
          <p style={{ fontSize: '14px', textAlign: 'center' }}>
            💡 Regla guía: <strong>50% Necesidades</strong> /{' '}
            <strong>30% Gustos</strong> / <strong>20% Ahorro</strong>
          </p>
        </div>

        {/* Botón Confirmar */}
        <div style={{ marginTop: '24px' }}>
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
              cursor: remaining < 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Confirmar Presupuesto
          </button>
        </div>
      </div>
    </div>
  );
}
