import React, { useState, useEffect } from 'react';

// =====================================
// ESCENARIOS DE LOS 5 DÍAS
// =====================================

const dailyScenarios = [
  // DÍA 1
  [
    {
      id: 'd1-1',
      situation: '🍜 Es tu primer día. ¿Cómo resuelves la comida?',
      optionA: {
        text: 'Cocinar en casa ($30)',
        cost: 30,
        category: 'needs',
        consequence: 'Ahorras dinero y comes saludable. ¡Bien!',
      },
      optionB: {
        text: 'Pedir comida rápida ($120)',
        cost: 120,
        category: 'wants',
        consequence: 'Gastaste más por comodidad. Cuidado con esto.',
      },
    },
    {
      id: 'd1-2',
      situation: '📱 Tu celular necesita recarga para trabajar mañana',
      optionA: {
        text: 'Recargar $50 (básico)',
        cost: 50,
        category: 'needs',
        consequence: 'Suficiente para trabajar. Decisión inteligente.',
      },
      optionB: {
        text: 'Recargar $200 (plan premium)',
        cost: 200,
        category: 'wants',
        consequence: 'Pagas por extras que no necesitas ahora.',
      },
    },
    {
      id: 'd1-3',
      situation: '🎮 Tus amigos te invitan al cine...',
      optionA: {
        text: 'Ir al cine ($150)',
        cost: 150,
        category: 'wants',
        consequence: 'Te diviertes pero gastas. Está bien, pero con medida.',
      },
      optionB: {
        text: 'Quedarte en casa ($0)',
        cost: 0,
        category: 'savings',
        consequence: 'Guardas dinero y descansas.',
      },
    },
  ],

  // DÍA 2
  [
    {
      id: 'd2-1',
      situation: '💡 Se vence el recibo de luz',
      optionA: {
        text: 'Pagar a tiempo ($80)',
        cost: 80,
        category: 'needs',
        consequence: 'Pagas a tiempo sin recargos. Perfecto.',
      },
      optionB: {
        text: 'Dejarlo para después ($0)',
        cost: 0,
        category: 'wants',
        consequence: 'Podrías generar intereses o corte del servicio.',
      },
    },
    {
      id: 'd2-2',
      situation: '🚲 Tu bicicleta necesita mantenimiento',
      optionA: {
        text: 'Repararla ($60)',
        cost: 60,
        category: 'needs',
        consequence: 'Más segura y eficiente. Buena decisión.',
      },
      optionB: {
        text: 'Ignorarlo ($0)',
        cost: 0,
        category: 'wants',
        consequence: 'Riesgo de daño mayor o accidente.',
      },
    },
    {
      id: 'd2-3',
      situation: '🍔 Se te antoja pedir hamburguesa',
      optionA: {
        text: 'Pedir hamburguesa ($100)',
        cost: 100,
        category: 'wants',
        consequence: 'Está bien darse gustos, pero controla la frecuencia.',
      },
      optionB: {
        text: 'Preparar algo en casa ($20)',
        cost: 20,
        category: 'needs',
        consequence: 'Ahorro + comida saludable. Excelente.',
      },
    },
  ],

  // DÍA 3
  [
    {
      id: 'd3-1',
      situation: '🚌 Necesitas transporte para ir a trabajar',
      optionA: {
        text: 'Bus ($30)',
        cost: 30,
        category: 'needs',
        consequence: 'Eficiente y económico.',
      },
      optionB: {
        text: 'Taxi ($90)',
        cost: 90,
        category: 'wants',
        consequence: 'Más cómodo pero caro.',
      },
    },
    {
      id: 'd3-2',
      situation: '🎁 Cumpleaños de un amigo cercano',
      optionA: {
        text: 'Regalo pequeño ($40)',
        cost: 40,
        category: 'wants',
        consequence: 'Un lindo detalle sin arruinar tu presupuesto.',
      },
      optionB: {
        text: 'Regalo caro ($150)',
        cost: 150,
        category: 'wants',
        consequence: 'Muy generoso, pero tu cartera sufre.',
      },
    },
    {
      id: 'd3-3',
      situation: '🧼 Necesitas productos de aseo',
      optionA: {
        text: 'Comprar lo básico ($35)',
        cost: 35,
        category: 'needs',
        consequence: 'Indispensable para tu higiene.',
      },
      optionB: {
        text: 'Comprar marca premium ($90)',
        cost: 90,
        category: 'wants',
        consequence: 'Más caro sin necesidad.',
      },
    },
  ],

  // DÍA 4
  [
    {
      id: 'd4-1',
      situation: '🍽️ Un familiar te invita a comer afuera',
      optionA: {
        text: 'Aceptar ($80)',
        cost: 80,
        category: 'wants',
        consequence: 'Una salida agradable.',
      },
      optionB: {
        text: 'Comer en casa ($25)',
        cost: 25,
        category: 'needs',
        consequence: 'Ahorro significativo.',
      },
    },
    {
      id: 'd4-2',
      situation: '📘 Necesitas material para un curso',
      optionA: {
        text: 'Comprar lo esencial ($50)',
        cost: 50,
        category: 'needs',
        consequence: 'Inversión útil para tu progreso.',
      },
      optionB: {
        text: 'Comprar material extra ($120)',
        cost: 120,
        category: 'wants',
        consequence: 'No todo era necesario.',
      },
    },
    {
      id: 'd4-3',
      situation: '☕ Antojo de café especial',
      optionA: {
        text: 'Comprar café premium ($45)',
        cost: 45,
        category: 'wants',
        consequence: 'No está mal, pero no lo hagas diario.',
      },
      optionB: {
        text: 'Hacer café en casa ($10)',
        cost: 10,
        category: 'needs',
        consequence: 'Perfecto y económico.',
      },
    },
  ],

  // DÍA 5
  [
    {
      id: 'd5-1',
      situation: '💳 Cuota de internet mensual',
      optionA: {
        text: 'Pagar ahora ($75)',
        cost: 75,
        category: 'needs',
        consequence: 'Pago a tiempo, sin problema.',
      },
      optionB: {
        text: 'Pagar después ($0)',
        cost: 0,
        category: 'wants',
        consequence: 'Cuidado con los intereses.',
      },
    },
    {
      id: 'd5-2',
      situation: '🧁 Se te antoja un postre',
      optionA: {
        text: 'Comprar postre ($30)',
        cost: 30,
        category: 'wants',
        consequence: 'Darse gustos está bien.',
      },
      optionB: {
        text: 'No comprar ($0)',
        cost: 0,
        category: 'savings',
        consequence: 'Ahorro pequeño pero valioso.',
      },
    },
    {
      id: 'd5-3',
      situation: '🛒 Falta comprar fruta para la semana',
      optionA: {
        text: 'Comprar fruta ($25)',
        cost: 25,
        category: 'needs',
        consequence: 'Saludable y necesario.',
      },
      optionB: {
        text: 'No comprar ($0)',
        cost: 0,
        category: 'wants',
        consequence: 'No es recomendable.',
      },
    },
  ],
];


// =======================================================
//                COMPONENTE PRINCIPAL
// =======================================================

export default function ExpenseGamePanel({ currentDay, playerBudget, onComplete, onClose }) {
  const [stage, setStage] = useState('intro');
  const [day, setDay] = useState(1);
  const [money, setMoney] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [choicesMade, setChoicesMade] = useState([]);

  // salario diario
  const dailyWage = 400;

  const handleStartGame = () => setStage('work');

  const handleWork = () => {
    setMoney(prev => prev + dailyWage);
    setTotalEarned(prev => prev + dailyWage);

    setStage('choices');
    setCurrentChoiceIndex(0);
  };

  const handleChoice = (choice, option) => {
    const selected = option === 'A' ? choice.optionA : choice.optionB;

    if (selected.cost > money) {
      alert(`❌ No tienes suficiente dinero. Tienes: $${money}, necesitas: $${selected.cost}`);
      return;
    }

    setChoicesMade(prev => [
      ...prev,
      {
        day,
        choice: `${choice.situation} → ${selected.text}`,
        cost: selected.cost,
        category: selected.category,
      },
    ]);

    setMoney(prev => prev - selected.cost);
    setTotalSpent(prev => prev + selected.cost);

    alert(`${selected.consequence}\n💰 Dinero restante: $${money - selected.cost}`);

    if (currentChoiceIndex < 2) {
      setCurrentChoiceIndex(prev => prev + 1);
    } else {
      if (day < 5) {
        setDay(prev => prev + 1);
        setStage('work');
      } else {
        setStage('complete');
      }
    }
  };


  // =======================================================
  //                  PANTALLA INTRO
  // =======================================================

  if (stage === 'intro') {
    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">

          <div className="panel-header">
            <h2>📚 Simulación de 5 días</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>

          <div className="panel-content">
            <div className="intro-info">
              <p>
                Vas a aprender a manejar tus ingresos usando la regla <strong>50-30-20</strong>,
                tomando decisiones reales durante 5 días.
              </p>

              <ul className="intro-list">
                <li>🛒 Priorizar necesidades</li>
                <li>🎮 Moderar gustos</li>
                <li>🐷 Dedicar una parte al ahorro</li>
                <li>💡 Tomar decisiones inteligentes</li>
              </ul>

              <button className="primary-btn" onClick={handleStartGame}>
                ¡Comenzar! 🚀
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }


  // =======================================================
  //                  PANTALLA DE TRABAJO
  // =======================================================

  if (stage === 'work') {
    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">

          <div className="panel-header">
            <h2>💼 Trabajo del Día {day}</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>

          <div className="panel-content work-content">
            <p className="work-text">
              Hoy ganas <strong>${dailyWage}</strong> por tu trabajo.
            </p>

            <button className="primary-btn" onClick={handleWork}>
              Recibir pago y continuar 💰
            </button>
          </div>

        </div>
      </div>
    );
  }


  // =======================================================
  //                  PANTALLA DE DECISIONES
  // =======================================================

  if (stage === 'choices') {
    const choicesToday = dailyScenarios[day - 1][currentChoiceIndex];
    const selected = choicesMade.filter(c => c.day === day);

    const percentNeeds = Math.round(
      (choicesMade.filter(c => c.category === 'needs').reduce((a, b) => a + b.cost, 0) /
        (totalSpent + 1)) * 100
    );

    const percentWants = Math.round(
      (choicesMade.filter(c => c.category === 'wants').reduce((a, b) => a + b.cost, 0) /
        (totalSpent + 1)) * 100
    );

    const percentSavings = Math.round(
      (choicesMade.filter(c => c.category === 'savings').reduce((a, b) => a + b.cost, 0) /
        (totalSpent + 1)) * 100
    );

    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">

          <div className="panel-header">
            <h2>🧠 Día {day} — Decisión {currentChoiceIndex + 1}/3</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>

          <div className="panel-content">

            <div className="decision-box">
              <p className="situation">{choicesToday.situation}</p>

              <div className="options">
                <button
                  className="option-btn option-a"
                  onClick={() => handleChoice(choicesToday, 'A')}
                >
                  {choicesToday.optionA.text}
                </button>

                <button
                  className="option-btn option-b"
                  onClick={() => handleChoice(choicesToday, 'B')}
                >
                  {choicesToday.optionB.text}
                </button>
              </div>
            </div>

            <div className="budget-progress">
              <h4>Distribución de gastos:</h4>

              <div className="progress-item">
                <span>🛒 Necesidades</span>
                <div className="progress-bar">
                  <div className="fill needs" style={{ width: `${percentNeeds}%` }}></div>
                </div>
                <span>{percentNeeds}%</span>
              </div>

              <div className="progress-item">
                <span>🎮 Gustos</span>
                <div className="progress-bar">
                  <div className="fill wants" style={{ width: `${percentWants}%` }}></div>
                </div>
                <span>{percentWants}%</span>
              </div>

              <div className="progress-item">
                <span>🐷 Ahorro</span>
                <div className="progress-bar">
                  <div className="fill savings" style={{ width: `${percentSavings}%` }}></div>
                </div>
                <span>{percentSavings}%</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }



  // =======================================================
  //                  PANTALLA FINAL
  // =======================================================

  if (stage === 'complete') {
    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">

          <div className="panel-header">
            <h2>🎉 ¡Simulación Completa!</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>

          <div className="panel-content">
            <div className="final-summary">

              <h3>Resumen de tus 5 días</h3>

              <p><strong>Total ganado: </strong>${totalEarned}</p>
              <p><strong>Total gastado: </strong>${totalSpent}</p>
              <p><strong>Saldo final: </strong>${totalEarned - totalSpent}</p>

              <div className="choices-list">
                {choicesMade.map((c, index) => (
                  <div className="choice-item" key={index}>
                    <span className="choice-day">Día {c.day}:</span>
                    <span className="choice-text">{c.choice}</span>
                    <span className="choice-cost">-${c.cost}</span>
                  </div>
                ))}
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  onComplete({
                    finalBudget: {
                      needs: choicesMade
                        .filter(c => c.category === 'needs')
                        .reduce((a, b) => a + b.cost, 0),
                      wants: choicesMade
                        .filter(c => c.category === 'wants')
                        .reduce((a, b) => a + b.cost, 0),
                      savings: choicesMade
                        .filter(c => c.category === 'savings')
                        .reduce((a, b) => a + b.cost, 0),
                      total: totalEarned - totalSpent,
                      savingsGoal: playerBudget.savingsGoal,
                    },
                  })
                }
              >
                Continuar → 
              </button>

            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
