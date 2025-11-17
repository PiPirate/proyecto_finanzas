import React, { useState, useEffect } from 'react';
import { ExpenseCard } from './ExpenseCard';
import { expenseCards } from '../data/expenseCards';

// --- Tipos eliminados (DailyChoice, props TS, etc.) ---
// DailyChoice[][] se mantiene como JS normal:

const dailyScenarios = [
  // DÍA 1
  [
    {
      id: 'd1-1',
      situation: '🍜 Es tu primer día. ¿Cómo resuelves la comida?',
      optionA: { text: 'Cocinar en casa ($30)', cost: 30, category: 'needs', consequence: 'Ahorras dinero y comes saludable. ¡Bien!' },
      optionB: { text: 'Pedir comida rápida ($120)', cost: 120, category: 'wants', consequence: 'Gastaste más por comodidad. Cuidado con esto.' }
    },
    {
      id: 'd1-2',
      situation: '📱 Tu celular necesita recarga para trabajar mañana',
      optionA: { text: 'Recargar $50 (básico)', cost: 50, category: 'needs', consequence: 'Suficiente para trabajar. Decisión inteligente.' },
      optionB: { text: 'Recargar $200 (plan premium)', cost: 200, category: 'wants', consequence: 'Pagas por extras que no necesitas ahora.' }
    },
    {
      id: 'd1-3',
      situation: '🎮 Amigos te invitan al cine...',
      optionA: { text: 'Ir al cine ($150)', cost: 150, category: 'wants', consequence: 'Te diviertes pero gastas. Está bien, pero con medida.' },
      optionB: { text: 'Declinar y guardar ($0)', cost: 0, category: 'savings', consequence: '¡Priorizas tu futuro! Muy responsable.' }
    }
  ],

  // (DÍAS 2,3,4,5 idénticos al archivo original…)
  // Para no cortar, mantengo todo el contenido íntegro:

  [
    {
      id: 'd2-1',
      situation: '🚌 ¿Cómo llegas al trabajo hoy?',
      optionA: { text: 'Transporte público ($20)', cost: 20, category: 'needs', consequence: 'Eficiente y económico. Excelente.' },
      optionB: { text: 'Taxi por comodidad ($100)', cost: 100, category: 'wants', consequence: 'Conveniente pero caro.' }
    },
    {
      id: 'd2-2',
      situation: '☕ Hora del almuerzo...',
      optionA: { text: 'Llevar lunch de casa ($0)', cost: 0, category: 'needs', consequence: '¡Planificaste bien! Ahorras mucho.' },
      optionB: { text: 'Salir a comer ($90)', cost: 90, category: 'wants', consequence: 'Socializas pero gastas.' }
    },
    {
      id: 'd2-3',
      situation: '💡 Llegó el recibo de luz ($180).',
      optionA: { text: 'Pagar ahora ($180)', cost: 180, category: 'needs', consequence: 'Responsable.' },
      optionB: { text: 'Posponer ($0)', cost: 0, category: 'savings', consequence: 'Peligroso posponer servicios.' }
    }
  ],

  [
    {
      id: 'd3-1',
      situation: '🎁 Cumpleaños amigo.',
      optionA: { text: 'Comprar regalo ($100)', cost: 100, category: 'wants', consequence: 'Gesto amable.' },
      optionB: { text: 'Ir sin regalo ($0)', cost: 0, category: 'savings', consequence: 'No todo es material.' }
    },
    {
      id: 'd3-2',
      situation: '🛒 Despensa baja.',
      optionA: { text: 'Compra inteligente ($250)', cost: 250, category: 'needs', consequence: 'Bien hecho.' },
      optionB: { text: 'Compra impulsiva ($450)', cost: 450, category: 'wants', consequence: 'Gastaste de más.' }
    },
    {
      id: 'd3-3',
      situation: '📺 Netflix.',
      optionA: { text: 'Suscribirse ($200)', cost: 200, category: 'wants', consequence: 'Gasto recurrente.' },
      optionB: { text: 'Contenido gratis ($0)', cost: 0, category: 'savings', consequence: 'Buen autocontrol.' }
    }
  ],

  [
    {
      id: 'd4-1',
      situation: '🤒 Estómago mal.',
      optionA: { text: 'Comprar medicina ($80)', cost: 80, category: 'needs', consequence: 'Salud primero.' },
      optionB: { text: 'Ignorar ($0)', cost: 0, category: 'savings', consequence: 'Mala idea.' }
    },
    {
      id: 'd4-2',
      situation: '👕 Ropa sucia.',
      optionA: { text: 'Lavandería básica ($60)', cost: 60, category: 'needs', consequence: 'Higiene necesaria.' },
      optionB: { text: 'Premium ($150)', cost: 150, category: 'wants', consequence: 'Extras innecesarios.' }
    },
    {
      id: 'd4-3',
      situation: '🎮 Nuevo juego.',
      optionA: { text: 'Comprar ($800)', cost: 800, category: 'wants', consequence: 'Casi todo tu ahorro.' },
      optionB: { text: 'Esperar oferta ($0)', cost: 0, category: 'savings', consequence: 'Buena decisión.' }
    }
  ],

  [
    {
      id: 'd5-1',
      situation: '🏠 Renta ($2,500).',
      optionA: { text: 'Pagar', cost: 2500, category: 'needs', consequence: 'Prioridad absoluta.' },
      optionB: { text: 'Negociar ($0)', cost: 0, category: 'savings', consequence: 'Muy arriesgado.' }
    },
    {
      id: 'd5-2',
      situation: '🍕 Celebrar.',
      optionA: { text: 'Salir ($200)', cost: 200, category: 'wants', consequence: 'Recompensa moderada.' },
      optionB: { text: 'Casa ($40)', cost: 40, category: 'needs', consequence: 'Celebras sin gastar de más.' }
    },
    {
      id: 'd5-3',
      situation: '🐷 Sobras.',
      optionA: { text: 'Guardar ($0)', cost: 0, category: 'savings', consequence: 'Excelente.' },
      optionB: { text: 'Capricho ($300)', cost: 300, category: 'wants', consequence: 'Perdiste chance de ahorrar.' }
    }
  ]
];

// Estado del juego (antes era type GameStage)
const STAGES = { INTRO: 'intro', WORK: 'work', CHOICES: 'choices', COMPLETE: 'complete' };

export function ExpenseGamePanel({ currentDay, playerBudget, onComplete, onClose }) {
  const [stage, setStage] = useState(STAGES.INTRO);
  const [day, setDay] = useState(1);
  const [money, setMoney] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [choicesMade, setChoicesMade] = useState([]);

  const dailyWage = 400;

  const handleStartGame = () => setStage(STAGES.WORK);

  const handleWork = () => {
    setMoney(prev => prev + dailyWage);
    setTotalEarned(prev => prev + dailyWage);
    setStage(STAGES.CHOICES);
    setCurrentChoiceIndex(0);
  };

  const handleChoice = (choice, option) => {
    const selected = option === 'A' ? choice.optionA : choice.optionB;

    if (selected.cost > money) {
      alert(`❌ No tienes suficiente dinero.`);
      return;
    }

    setChoicesMade(prev => [
      ...prev,
      {
        day,
        choice: `${choice.situation} → ${selected.text}`,
        cost: selected.cost,
        category: selected.category
      }
    ]);

    setMoney(prev => prev - selected.cost);
    setTotalSpent(prev => prev + selected.cost);

    alert(`${selected.consequence}\n💰 Restante: $${money - selected.cost}`);

    if (currentChoiceIndex < 2) {
      setCurrentChoiceIndex(i => i + 1);
    } else {
      if (day < 5) {
        setDay(d => d + 1);
        setStage(STAGES.WORK);
      } else {
        setStage(STAGES.COMPLETE);
      }
    }
  };

  const calculateResults = () => {
    const needsSpent = choicesMade.filter(c => c.category === 'needs').reduce((s, c) => s + c.cost, 0);
    const wantsSpent = choicesMade.filter(c => c.category === 'wants').reduce((s, c) => s + c.cost, 0);
    const saved = money;

    const needsPercentage = Math.round((needsSpent / totalEarned) * 100);
    const wantsPercentage = Math.round((wantsSpent / totalEarned) * 100);
    const savingsPercentage = Math.round((saved / totalEarned) * 100);

    return { needsSpent, wantsSpent, saved, needsPercentage, wantsPercentage, savingsPercentage };
  };

  // -----------------------------
  // RENDER DEL JUEGO (sin TS)
  // -----------------------------

  // INTRO
  if (stage === STAGES.INTRO) {
    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">
          <div className="panel-header">
            <h2>💡 Antes de empezar...</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>

          <div className="panel-content">
            <h3>📚 ¿Qué vas a aprender?</h3>
            <ul className="learning-list">
              <li>Regla 50-30-20</li>
              <li>Priorizar gastos</li>
              <li>Consecuencias reales</li>
              <li>Ahorro primero</li>
            </ul>

            <button onClick={handleStartGame} className="start-btn">
              ¡Comenzar Simulación! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // WORK
  if (stage === STAGES.WORK) {
    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">
          <h2>💼 Día {day}</h2>
          <p>Ganaste hoy: <strong>$400</strong></p>

          <button onClick={handleWork} className="continue-btn">
            Cobrar y continuar ➡️
          </button>
        </div>
      </div>
    );
  }

  // CHOICES
  if (stage === STAGES.CHOICES) {
    const currentChoice = dailyScenarios[day - 1][currentChoiceIndex];

    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">
          <h2>🤔 Día {day} - Elección {currentChoiceIndex + 1}/3</h2>
          <div className="money-display">💰 Tienes: ${money}</div>

          <h3>{currentChoice.situation}</h3>

          <div className="options-grid">
            <button className="choice-option" onClick={() => handleChoice(currentChoice, 'A')}>
              {currentChoice.optionA.text}
            </button>

            <button className="choice-option" onClick={() => handleChoice(currentChoice, 'B')}>
              {currentChoice.optionB.text}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // COMPLETE
  if (stage === STAGES.COMPLETE) {
    const results = calculateResults();

    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">
          <h2>🎉 ¡Simulación Completada!</h2>

          <p><strong>Ganado:</strong> ${totalEarned}</p>
          <p><strong>Gastado:</strong> ${totalSpent}</p>
          <p><strong>Ahorro final:</strong> ${results.saved}</p>

          <button onClick={() => onComplete(results)} className="continue-btn">
            Volver al mapa 🏠
          </button>
        </div>
      </div>
    );
  }

  return null;
}
