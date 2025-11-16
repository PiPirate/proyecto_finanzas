import React from 'react';

export default function ExpenseCard({
  card,
  daysLeft,
  onPayNow,
  onPayFromSavings,
  onPostpone,
  onDiscard,
  canPostpone = true,
}) {
  const isUrgent = daysLeft !== undefined && daysLeft <= 1;
  const isNeed = card.type === 'need';

  return (
    <div
      className={`expense-card 
        ${isNeed ? 'expense-card--need' : 'expense-card--want'} 
        ${isUrgent ? 'expense-card--urgent' : ''}`}
    >
      {/* HEADER */}
      <div className="card-header">
        <div className="card-icon">{card.icon}</div>

        <div className="card-title-area">
          <h4>{card.name}</h4>

          <div className="card-badges">
            {/* NECESIDAD / GUSTO */}
            <span
              style={{
                display: 'inline-block',
                padding: '4px 8px',
                fontSize: '12px',
                borderRadius: '4px',
                background: isNeed ? '#dc2626' : '#6b7280',
                color: 'white',
              }}
            >
              {isNeed ? 'Necesidad' : 'Gusto'}
            </span>

            {/* URGENCIA */}
            {daysLeft !== undefined && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  background: isUrgent ? '#dc2626' : 'transparent',
                  color: isUrgent ? 'white' : '#000',
                  border: isUrgent ? 'none' : '1px solid #ccc',
                }}
              >
                {isUrgent ? '⚠️ URGENTE' : `${daysLeft} días`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="card-body">
        <p className="card-description">{card.description}</p>
      </div>

      {/* COSTO */}
      <div className="card-amount">
        <span className="amount-label">Costo:</span>
        <span className="amount-value">${card.amount.toLocaleString()}</span>
      </div>

      {/* CONSECUENCIAS */}
      <div className="card-consequence">
        <p className="consequence-label">Si no pagas:</p>
        <p className="consequence-text">{card.consequence}</p>
        <p className="consequence-impact">
          Bienestar: <span className="impact-value">{card.wellbeingImpact}</span>
        </p>
      </div>

      {/* ACCIONES */}
      <div className="card-actions">
        <button
          onClick={onPayNow}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            background: isNeed ? '#4CAF50' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '8px',
          }}
        >
          💳 Pagar de {isNeed ? 'Necesidades' : 'Gustos'}
        </button>

        <div className="card-secondary-actions">
          {/* USAR AHORRO */}
          {onPayFromSavings && (
            <button
              onClick={onPayFromSavings}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                background: 'transparent',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '4px',
              }}
            >
              🐷 Usar Ahorro
            </button>
          )}

          {/* POSPONER */}
          {onPostpone && canPostpone && (
            <button
              onClick={onPostpone}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                background: 'transparent',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '4px',
              }}
            >
              ⏰ Posponer
            </button>
          )}

          {/* DESCARTAR */}
          <button
            onClick={onDiscard}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: 'transparent',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
            }}
          >
            ❌ No Pagar
          </button>
        </div>
      </div>
    </div>
  );
}
