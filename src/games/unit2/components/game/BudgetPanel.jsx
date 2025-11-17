import React, { useState, useEffect } from 'react';
import DialogueBox from './DialogueBox';

export function BudgetPanel({ totalIncome, currentBudget, onComplete, onClose }) {
  const [showDialogue, setShowDialogue] = useState(true);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [needs, setNeeds] = useState(0);
  const [wants, setWants] = useState(0);
  const [savings, setSavings] = useState(0);

  const dialogues = [
    "¡Perfecto! Has recibido tu primer salario de $10,000. Ahora viene lo importante: distribuirlo correctamente.",
    "Te voy a enseñar la regla 50-30-20, una estrategia simple pero poderosa para administrar tu dinero.",
    "50% para NECESIDADES: Renta, comida, transporte, servicios. Lo esencial para vivir con tranquilidad.",
    "30% para GUSTOS: Entretenimiento, salidas, hobbies. Disfrutar la vida sin descuidar tus finanzas.",
    "20% para AHORRO: Emergencias, metas futuras, inversiones. Tu red de seguridad para imprevistos.",
    "Recuerda: Esta es una guía, no una regla estricta. Ajusta según tu situación, pero SIEMPRE asigna TODO tu presupuesto y nunca olvides el ahorro. ¡Adelante!"
  ];

  const total = needs + wants + savings;
  const remaining = totalIncome - total;

  const needsPercent = total > 0 ? Math.round((needs / totalIncome) * 100) : 0;
  const wantsPercent = total > 0 ? Math.round((wants / totalIncome) * 100) : 0;
  const savingsPercent = total > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const handleDialogueAdvance = () => {
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setShowDialogue(false);
    }
  };

  const handleConfirm = () => {
    if (remaining > 0) {
      alert('Debes asignar todo tu presupuesto. No dejes dinero sin asignar.');
      return;
    }
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDialogue && e.key === 'Enter') {
        e.preventDefault();
        handleDialogueAdvance();
      } else if (!showDialogue && e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [needs, wants, savings, remaining, showDialogue, dialogueIndex]);

  return (
    <div className="game-panel-overlay">
      {showDialogue && (
        <DialogueBox
          text={dialogues[dialogueIndex]}
          speakerName="MK-25"
          onNext={handleDialogueAdvance}
          speakingSprite={undefined}
          idleSprite={undefined}
        />
      )}

      <div
        className="mobile-phone-frame"
        style={{
          opacity: showDialogue ? 0.3 : 1,
          pointerEvents: showDialogue ? 'none' : 'auto'
        }}
      >
        <div className="phone-notch"></div>

        <div className="phone-screen">
          <div className="budget-planning-screen">
            <div className="app-header">
              <div className="app-icon">💰</div>
              <h2>Distribuir Presupuesto</h2>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            <div className="planning-content">
              <div className="balance-display">
                <div className="balance-label">Saldo Disponible</div>

                <div
                  className={`balance-amount ${
                    remaining === 0
                      ? 'balance-complete'
                      : remaining < 0
                      ? 'balance-exceeded'
                      : 'balance-pending'
                  }`}
                >
                  ${remaining.toLocaleString()}
                </div>

                <div className="balance-hint">
                  {remaining > 0 && '⚠️ Asigna todo tu presupuesto'}
                  {remaining === 0 && '✓ ¡Perfecto! Todo asignado'}
                  {remaining < 0 && '❌ Has excedido el presupuesto'}
                </div>
              </div>

              <div className="budget-sliders">
                {/* NECESIDADES */}
                <div className="slider-group slider-group--needs">
                  <div className="slider-header">
                    <div className="slider-info">
                      <span className="slider-icon">🛒</span>
                      <div>
                        <div className="slider-label">Necesidades</div>
                        <div className="slider-sublabel">Gastos esenciales</div>
                      </div>
                    </div>
                    <div className="slider-value">
                      <div className="value-amount">${needs.toLocaleString()}</div>
                      <div className="value-percent">{needsPercent}%</div>
                    </div>
                  </div>

                  <input
                    type="range"
                    className="budget-range budget-range--needs"
                    value={needs}
                    onChange={(e) => setNeeds(Number(e.target.value))}
                    max={totalIncome}
                    step={100}
                  />

                  <div className="range-markers">
                    <span>$0</span>
                    <span className="marker-recommended">50% ($5,000)</span>
                    <span>${totalIncome.toLocaleString()}</span>
                  </div>
                </div>

                {/* GUSTOS */}
                <div className="slider-group slider-group--wants">
                  <div className="slider-header">
                    <div className="slider-info">
                      <span className="slider-icon">🎮</span>
                      <div>
                        <div className="slider-label">Gustos</div>
                        <div className="slider-sublabel">Entretenimiento</div>
                      </div>
                    </div>

                    <div className="slider-value">
                      <div className="value-amount">${wants.toLocaleString()}</div>
                      <div className="value-percent">{wantsPercent}%</div>
                    </div>
                  </div>

                  <input
                    type="range"
                    className="budget-range budget-range--wants"
                    value={wants}
                    onChange={(e) => setWants(Number(e.target.value))}
                    max={totalIncome}
                    step={100}
                  />

                  <div className="range-markers">
                    <span>$0</span>
                    <span className="marker-recommended">30% ($3,000)</span>
                    <span>${totalIncome.toLocaleString()}</span>
                  </div>
                </div>

                {/* AHORRO */}
                <div className="slider-group slider-group--savings">
                  <div className="slider-header">
                    <div className="slider-info">
                      <span className="slider-icon">🐷</span>
                      <div>
                        <div className="slider-label">Ahorro</div>
                        <div className="slider-sublabel">Para el futuro</div>
                      </div>
                    </div>

                    <div className="slider-value">
                      <div className="value-amount">${savings.toLocaleString()}</div>
                      <div className="value-percent">{savingsPercent}%</div>
                    </div>
                  </div>

                  <input
                    type="range"
                    className="budget-range budget-range--savings"
                    value={savings}
                    onChange={(e) => setSavings(Number(e.target.value))}
                    max={totalIncome}
                    step={100}
                  />

                  <div className="range-markers">
                    <span>$0</span>
                    <span className="marker-recommended">20% ($2,000)</span>
                    <span>${totalIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                className={`confirm-budget-btn ${
                  remaining !== 0 ? 'confirm-budget-btn--disabled' : ''
                }`}
                onClick={handleConfirm}
                disabled={remaining !== 0}
              >
                {remaining === 0 ? '✓ Confirmar Presupuesto' : '⚠️ Asigna Todo el Presupuesto'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
