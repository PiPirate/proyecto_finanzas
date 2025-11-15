import React from 'react';

interface Budget {
  total: number;
  needs: number;
  wants: number;
  savings: number;
  savingsGoal: number;
}

interface BudgetDisplayProps {
  budget: Budget;
}

export function BudgetDisplay({ budget }: BudgetDisplayProps) {
  const savingsProgress = (budget.savings / budget.savingsGoal) * 100;
  const needsProgress = (budget.needs / 5000) * 100;
  const wantsProgress = (budget.wants / 3000) * 100;

  return (
    <div className="budget-display">
      <div className="budget-card budget-card--needs">
        <div className="budget-card-header">
          <span className="budget-icon">🛒</span>
          <span className="budget-label">Necesidades</span>
        </div>
        <div className="budget-amount">${budget.needs.toLocaleString()}</div>
        <div 
          style={{
            width: '100%',
            height: '8px',
            background: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '8px'
          }}
        >
          <div 
            style={{
              width: `${Math.min(needsProgress, 100)}%`,
              height: '100%',
              background: '#4CAF50',
              transition: 'width 0.3s'
            }}
          />
        </div>
      </div>

      <div className="budget-card budget-card--wants">
        <div className="budget-card-header">
          <span className="budget-icon">🎮</span>
          <span className="budget-label">Gustos</span>
        </div>
        <div className="budget-amount">${budget.wants.toLocaleString()}</div>
        <div 
          style={{
            width: '100%',
            height: '8px',
            background: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '8px'
          }}
        >
          <div 
            style={{
              width: `${Math.min(wantsProgress, 100)}%`,
              height: '100%',
              background: '#2196F3',
              transition: 'width 0.3s'
            }}
          />
        </div>
      </div>

      <div className="budget-card budget-card--savings">
        <div className="budget-card-header">
          <span className="budget-icon">🐷</span>
          <span className="budget-label">Ahorro</span>
        </div>
        <div className="budget-amount">
          ${budget.savings.toLocaleString()} / ${budget.savingsGoal.toLocaleString()}
        </div>
        <div 
          style={{
            width: '100%',
            height: '8px',
            background: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '8px'
          }}
        >
          <div 
            style={{
              width: `${Math.min(savingsProgress, 100)}%`,
              height: '100%',
              background: '#FF9800',
              transition: 'width 0.3s'
            }}
          />
        </div>
        <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '4px', opacity: 0.7 }}>
          {savingsProgress >= 100 ? '✅ Meta cumplida' : `${Math.round(savingsProgress)}% de tu meta`}
        </p>
      </div>

      <div className="budget-card budget-card--total">
        <div className="budget-card-header">
          <span className="budget-icon">💰</span>
          <span className="budget-label">Saldo Total</span>
        </div>
        <div className="budget-amount" style={{ color: budget.total < 0 ? '#dc2626' : 'inherit' }}>
          ${budget.total.toLocaleString()}
        </div>
      </div>
    </div>
  );
}