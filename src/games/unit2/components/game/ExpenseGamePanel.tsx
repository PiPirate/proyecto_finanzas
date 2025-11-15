import React, { useState, useEffect } from 'react';
import { ExpenseCard } from './ExpenseCard';
import { expenseCards, ExpenseCard as ExpenseCardType } from '../data/expenseCards';

interface ExpenseGamePanelProps {
  currentDay: number;
  playerBudget: {
    needs: number;
    wants: number;
    savings: number;
  };
  onComplete: (results: any) => void;
  onClose: () => void;
}

interface DailyChoice {
  id: string;
  situation: string;
  optionA: {
    text: string;
    cost: number;
    category: 'needs' | 'wants' | 'savings';
    consequence: string;
  };
  optionB: {
    text: string;
    cost: number;
    category: 'needs' | 'wants' | 'savings';
    consequence: string;
  };
}

// 5 días, cada uno con 3 elecciones predefinidas
const dailyScenarios: DailyChoice[][] = [
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
      situation: '🎮 Amigos te invitan al cine. Acabas de llegar y quieres encajar...',
      optionA: { text: 'Ir al cine ($150)', cost: 150, category: 'wants', consequence: 'Te diviertes pero gastas. Está bien, pero con medida.' },
      optionB: { text: 'Declinar y guardar ($0)', cost: 0, category: 'savings', consequence: '¡Priorizas tu futuro! Muy responsable.' }
    }
  ],
  
  // DÍA 2
  [
    {
      id: 'd2-1',
      situation: '🚌 ¿Cómo llegas al trabajo hoy?',
      optionA: { text: 'Transporte público ($20)', cost: 20, category: 'needs', consequence: 'Eficiente y económico. Excelente.' },
      optionB: { text: 'Taxi por comodidad ($100)', cost: 100, category: 'wants', consequence: 'Conveniente pero caro para uso diario.' }
    },
    {
      id: 'd2-2',
      situation: '☕ Hora del almuerzo. Tienes hambre...',
      optionA: { text: 'Llevar lunch de casa ($0)', cost: 0, category: 'needs', consequence: '¡Planificaste bien! Ahorras mucho así.' },
      optionB: { text: 'Salir a comer con colegas ($90)', cost: 90, category: 'wants', consequence: 'Socializas pero gastas. Cuida la frecuencia.' }
    },
    {
      id: 'd2-3',
      situation: '💡 Llegó el recibo de luz ($180). ¿Qué haces?',
      optionA: { text: 'Pagar ahora ($180)', cost: 180, category: 'needs', consequence: 'Responsable. Evitas recargos e intereses.' },
      optionB: { text: 'Posponer y arriesgar ($0)', cost: 0, category: 'savings', consequence: 'Peligroso. Los servicios básicos NO se posponen.' }
    }
  ],

  // DÍA 3
  [
    {
      id: 'd3-1',
      situation: '🎁 Es el cumpleaños de tu amigo. Te invita a su fiesta...',
      optionA: { text: 'Comprar regalo ($100)', cost: 100, category: 'wants', consequence: 'Gesto amable pero opcional. Evalúa tu presupuesto.' },
      optionB: { text: 'Felicitar sin regalo ($0)', cost: 0, category: 'savings', consequence: 'Lo material no es todo. Tu presencia vale más.' }
    },
    {
      id: 'd3-2',
      situation: '🛒 Tu despensa está baja. Necesitas comprar comida...',
      optionA: { text: 'Compra inteligente ($250)', cost: 250, category: 'needs', consequence: 'Esencial y bien calculado. Así se hace.' },
      optionB: { text: 'Compra impulsiva ($450)', cost: 450, category: 'wants', consequence: 'Compraste cosas que no necesitabas realmente.' }
    },
    {
      id: 'd3-3',
      situation: '📺 Ves un anuncio de Netflix. ¿Te suscribes?',
      optionA: { text: 'Suscribirse ($200/mes)', cost: 200, category: 'wants', consequence: 'Entretenimiento, pero es un gasto recurrente. ¿Lo usarás?' },
      optionB: { text: 'Usar contenido gratuito ($0)', cost: 0, category: 'savings', consequence: 'Hay alternativas gratis. Buen autocontrol.' }
    }
  ],

  // DÍA 4
  [
    {
      id: 'd4-1',
      situation: '🤒 Te sientes mal del estómago. ¿Qué haces?',
      optionA: { text: 'Comprar medicina ($80)', cost: 80, category: 'needs', consequence: 'Tu salud es prioridad. Decisión correcta.' },
      optionB: { text: 'Ignorarlo y ahorrar ($0)', cost: 0, category: 'savings', consequence: '¡Error! La salud no se negocia. Puede empeorar.' }
    },
    {
      id: 'd4-2',
      situation: '👕 Tu ropa de trabajo está sucia. Necesitas lavarla...',
      optionA: { text: 'Lavandería básica ($60)', cost: 60, category: 'needs', consequence: 'Higiene necesaria para trabajar. Bien hecho.' },
      optionB: { text: 'Lavandería premium ($150)', cost: 150, category: 'wants', consequence: 'Pagas por servicios que puedes hacer tú mismo.' }
    },
    {
      id: 'd4-3',
      situation: '🎮 Sale un videojuego nuevo que esperabas. Cuesta $800...',
      optionA: { text: 'Comprarlo ahora ($800)', cost: 800, category: 'wants', consequence: '¡Cuidado! Es casi todo tu ahorro. ¿Vale la pena?' },
      optionB: { text: 'Esperar oferta ($0)', cost: 0, category: 'savings', consequence: 'Paciencia = Ahorro. Los precios siempre bajan.' }
    }
  ],

  // DÍA 5 (ÚLTIMO)
  [
    {
      id: 'd5-1',
      situation: '🏠 El casero pide la renta: $2,500. Es obligatorio...',
      optionA: { text: 'Pagar renta ($2,500)', cost: 2500, category: 'needs', consequence: 'Techo seguro. Siempre prioriza esto.' },
      optionB: { text: 'Intentar negociar ($0)', cost: 0, category: 'savings', consequence: 'Muy arriesgado. Puedes perder tu hogar.' }
    },
    {
      id: 'd5-2',
      situation: '🍕 Último día de la semana. ¿Celebras?',
      optionA: { text: 'Salir a cenar ($200)', cost: 200, category: 'wants', consequence: 'Recompensa merecida si tu presupuesto lo permite.' },
      optionB: { text: 'Cenar en casa ($40)', cost: 40, category: 'needs', consequence: 'Celebras sin descuidar tus finanzas. Sabio.' }
    },
    {
      id: 'd5-3',
      situation: '🐷 Fin de ciclo. ¿Qué haces con lo que te sobró?',
      optionA: { text: 'Guardarlo todo ($0)', cost: 0, category: 'savings', consequence: '¡Excelente! Tu yo del futuro te lo agradecerá.' },
      optionB: { text: 'Gastarlo en capricho ($300)', cost: 300, category: 'wants', consequence: 'Perdiste la oportunidad de construir tu colchón.' }
    }
  ]
];

type GameStage = 'intro' | 'work' | 'choices' | 'complete';

export function ExpenseGamePanel({ currentDay, playerBudget, onComplete, onClose }: ExpenseGamePanelProps) {
  const [stage, setStage] = useState<GameStage>('intro');
  const [day, setDay] = useState(1);
  const [money, setMoney] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [dailyChoices, setDailyChoices] = useState<string[]>([]);
  const [choicesMade, setChoicesMade] = useState<Array<{day: number, choice: string, cost: number, category: string}>>([]);

  const dailyWage = 400; // Ganas $400 por día trabajado

  const handleStartGame = () => {
    setStage('work');
  };

  const handleWork = () => {
    setMoney(prev => prev + dailyWage);
    setTotalEarned(prev => prev + dailyWage);
    setStage('choices');
    setCurrentChoiceIndex(0);
  };

  const handleChoice = (choice: DailyChoice, option: 'A' | 'B') => {
    const selected = option === 'A' ? choice.optionA : choice.optionB;
    
    if (selected.cost > money) {
      alert(`❌ No tienes suficiente dinero. Tienes: $${money}, Necesitas: $${selected.cost}`);
      return;
    }

    // Registrar la elección
    setChoicesMade(prev => [...prev, {
      day,
      choice: `${choice.situation} → ${selected.text}`,
      cost: selected.cost,
      category: selected.category
    }]);

    setMoney(prev => prev - selected.cost);
    setTotalSpent(prev => prev + selected.cost);
    
    // Mostrar consecuencia
    alert(`${selected.consequence}\n\n💰 Dinero restante: $${money - selected.cost}`);

    // Avanzar a la siguiente elección
    if (currentChoiceIndex < 2) {
      setCurrentChoiceIndex(prev => prev + 1);
    } else {
      // Terminar día
      if (day < 5) {
        setDay(prev => prev + 1);
        setStage('work');
      } else {
        setStage('complete');
      }
    }
  };

  const calculateResults = () => {
    const needsSpent = choicesMade.filter(c => c.category === 'needs').reduce((sum, c) => sum + c.cost, 0);
    const wantsSpent = choicesMade.filter(c => c.category === 'wants').reduce((sum, c) => sum + c.cost, 0);
    const saved = money;
    
    const needsPercentage = Math.round((needsSpent / totalEarned) * 100);
    const wantsPercentage = Math.round((wantsSpent / totalEarned) * 100);
    const savingsPercentage = Math.round((saved / totalEarned) * 100);

    return { needsSpent, wantsSpent, saved, needsPercentage, wantsPercentage, savingsPercentage };
  };

  // PANTALLA DE INTRODUCCIÓN
  if (stage === 'intro') {
    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">
          <div className="panel-header">
            <h2>💡 Antes de empezar...</h2>
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
            <div className="intro-section">
              <h3>📚 ¿Qué vas a aprender?</h3>
              <div className="learning-objectives">
                <div className="objective-item">
                  <span className="objective-icon">1️⃣</span>
                  <p><strong>La Regla 50-30-20:</strong> Cómo dividir tu dinero inteligentemente entre necesidades (50%), gustos (30%) y ahorro (20%).</p>
                </div>
                
                <div className="objective-item">
                  <span className="objective-icon">2️⃣</span>
                  <p><strong>Priorizar gastos:</strong> Diferenciar entre lo que NECESITAS y lo que solo QUIERES.</p>
                </div>
                
                <div className="objective-item">
                  <span className="objective-icon">3️⃣</span>
                  <p><strong>Consecuencias reales:</strong> Cada decisión afecta tu dinero y bienestar. Aprende a balancear.</p>
                </div>

                <div className="objective-item">
                  <span className="objective-icon">4️⃣</span>
                  <p><strong>Ahorrar PRIMERO:</strong> El secreto de las finanzas es separar dinero ANTES de gastar, no esperar "a ver qué sobra".</p>
                </div>
              </div>

              <div className="game-overview">
                <h4>🎮 ¿Cómo funciona?</h4>
                <ul>
                  <li>Vivirás <strong>5 días</strong> de trabajo</li>
                  <li>Cada día <strong>trabajas y ganas $400</strong></li>
                  <li>Luego enfrentas <strong>3 situaciones</strong> donde debes elegir cómo gastar</li>
                  <li>Al final verás <strong>qué tan bien manejaste tu dinero</strong></li>
                </ul>
              </div>

              <div className="warning-box">
                <p>⚠️ <strong>Recuerda:</strong> No todo lo que te ofrecen NECESITAS comprarlo. A veces la mejor decisión es NO gastar.</p>
              </div>

              <button 
                onClick={handleStartGame}
                style={{
                  width: '100%',
                  padding: '12px 32px',
                  fontSize: '16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ¡Comenzar Simulación! 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA DE TRABAJAR
  if (stage === 'work') {
    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">
          <div className="panel-header">
            <h2>💼 Día {day} de 5</h2>
          </div>

          <div className="panel-content">
            <div className="work-section">
              <h3>⏰ Hora de trabajar</h3>
              <div className="work-animation">
                <p className="work-text">
                  {day === 1 && '¡Tu primer día de trabajo! Es emocionante pero también un poco intimidante...'}
                  {day === 2 && '¡Segundo día! Ya le estás agarrando el ritmo al trabajo.'}
                  {day === 3 && '¡Mitad de semana! Ya te sientes más cómodo en tu nueva vida.'}
                  {day === 4 && '¡Casi viernes! El esfuerzo está dando frutos.'}
                  {day === 5 && '¡Último día de la semana! Has trabajado duro.'}
                </p>
                <div className="work-emoji">💻</div>
              </div>

              <div className="earnings-box">
                <p>Ganaste hoy: <strong>$400</strong></p>
                <p>Dinero total: <strong>${money + dailyWage}</strong></p>
              </div>

              <button 
                onClick={handleWork}
                style={{
                  width: '100%',
                  padding: '12px 32px',
                  fontSize: '16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cobrar y continuar ➡️
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA DE ELECCIONES
  if (stage === 'choices') {
    const currentChoice = dailyScenarios[day - 1][currentChoiceIndex];
    
    // Calcular porcentajes actuales para la barra de progreso
    const needsSpent = choicesMade.filter(c => c.category === 'needs').reduce((sum, c) => sum + c.cost, 0);
    const wantsSpent = choicesMade.filter(c => c.category === 'wants').reduce((sum, c) => sum + c.cost, 0);
    const totalSpent = needsSpent + wantsSpent;
    
    const needsPercentage = totalEarned > 0 ? Math.round((needsSpent / totalEarned) * 100) : 0;
    const wantsPercentage = totalEarned > 0 ? Math.round((wantsSpent / totalEarned) * 100) : 0;
    const savingsPercentage = totalEarned > 0 ? Math.round(((totalEarned - totalSpent) / totalEarned) * 100) : 0;
    
    // Determinar status de cada categoría
    const needsStatus = needsPercentage >= 40 && needsPercentage <= 60 ? 'good' : needsPercentage < 40 ? 'low' : 'high';
    const wantsStatus = wantsPercentage <= 30 ? 'good' : wantsPercentage <= 40 ? 'ok' : 'high';
    const savingsStatus = savingsPercentage >= 20 ? 'good' : savingsPercentage >= 10 ? 'ok' : 'low';
    
    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">
          <div className="panel-header">
            <h2>🤔 Día {day} - Decisión {currentChoiceIndex + 1}/3</h2>
            <div className="money-display">💰 Tienes: ${money}</div>
          </div>

          {/* BARRA DE PROGRESO 50-30-20 */}
          <div className="progress-tracker">
            <div className="tracker-header">
              <h4>📊 Tu desempeño vs Regla 50-30-20</h4>
              <p className="tracker-subtitle">Gráfica en tiempo real de tus decisiones</p>
            </div>

            <div className="tracker-bars">
              {/* NECESIDADES */}
              <div className="tracker-item">
                <div className="tracker-item-header">
                  <div className="tracker-label">
                    <span className="tracker-icon">🛒</span>
                    <span>Necesidades</span>
                  </div>
                  <div className={`tracker-value ${needsStatus}`}>
                    {needsPercentage}%
                    {needsStatus === 'good' && ' ✓'}
                    {needsStatus === 'low' && ' ⚠️'}
                    {needsStatus === 'high' && ' ⚠️'}
                  </div>
                </div>
                <div className="tracker-bar-container">
                  <div className="tracker-bar-bg">
                    <div 
                      className={`tracker-bar-fill needs ${needsStatus}`}
                      style={{ width: `${Math.min(needsPercentage, 100)}%` }}
                    />
                    <div className="tracker-target-line" style={{ left: '50%' }}>
                      <span className="target-label">50%</span>
                    </div>
                  </div>
                </div>
                <div className="tracker-feedback">
                  {needsStatus === 'good' && '✅ Perfecto balance en necesidades'}
                  {needsStatus === 'low' && '⚠️ Puedes invertir más en necesidades básicas'}
                  {needsStatus === 'high' && '⚠️ Estás gastando demasiado en necesidades'}
                </div>
              </div>

              {/* GUSTOS */}
              <div className="tracker-item">
                <div className="tracker-item-header">
                  <div className="tracker-label">
                    <span className="tracker-icon">🎮</span>
                    <span>Gustos</span>
                  </div>
                  <div className={`tracker-value ${wantsStatus}`}>
                    {wantsPercentage}%
                    {wantsStatus === 'good' && ' ✓'}
                    {wantsStatus === 'ok' && ' ⚠️'}
                    {wantsStatus === 'high' && ' ❌'}
                  </div>
                </div>
                <div className="tracker-bar-container">
                  <div className="tracker-bar-bg">
                    <div 
                      className={`tracker-bar-fill wants ${wantsStatus}`}
                      style={{ width: `${Math.min(wantsPercentage, 100)}%` }}
                    />
                    <div className="tracker-target-line" style={{ left: '30%' }}>
                      <span className="target-label">30%</span>
                    </div>
                  </div>
                </div>
                <div className="tracker-feedback">
                  {wantsStatus === 'good' && '✅ Excelente autocontrol en gustos'}
                  {wantsStatus === 'ok' && '⚠️ Cuidado, estás cerca del límite de gustos'}
                  {wantsStatus === 'high' && '❌ Te estás excediendo en gustos. ¡Contrólate!'}
                </div>
              </div>

              {/* AHORRO */}
              <div className="tracker-item">
                <div className="tracker-item-header">
                  <div className="tracker-label">
                    <span className="tracker-icon">🐷</span>
                    <span>Ahorro</span>
                  </div>
                  <div className={`tracker-value ${savingsStatus}`}>
                    {savingsPercentage}%
                    {savingsStatus === 'good' && ' ✓'}
                    {savingsStatus === 'ok' && ' ⚠️'}
                    {savingsStatus === 'low' && ' ❌'}
                  </div>
                </div>
                <div className="tracker-bar-container">
                  <div className="tracker-bar-bg">
                    <div 
                      className={`tracker-bar-fill savings ${savingsStatus}`}
                      style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
                    />
                    <div className="tracker-target-line" style={{ left: '20%' }}>
                      <span className="target-label">20%</span>
                    </div>
                  </div>
                </div>
                <div className="tracker-feedback">
                  {savingsStatus === 'good' && '✅ ¡Vas excelente! Estás ahorrando bien'}
                  {savingsStatus === 'ok' && '⚠️ Vas bien, pero podrías ahorrar un poco más'}
                  {savingsStatus === 'low' && '❌ ¡Alerta! Necesitas ahorrar más dinero'}
                </div>
              </div>
            </div>

            <div className="tracker-summary">
              <p>
                💰 <strong>De ${totalEarned} ganados:</strong> 
                {' '}Necesidades: ${needsSpent} • 
                Gustos: ${wantsSpent} • 
                Ahorro: ${totalEarned - totalSpent}
              </p>
            </div>
          </div>

          <div className="panel-content">
            <div className="choice-section">
              <div className="situation-box">
                <h3>{currentChoice.situation}</h3>
              </div>

              <div className="options-grid">
                <button 
                  className="choice-option option-a"
                  onClick={() => handleChoice(currentChoice, 'A')}
                >
                  <div className="option-label">Opción A</div>
                  <div className="option-text">{currentChoice.optionA.text}</div>
                  <div className="option-cost">${currentChoice.optionA.cost}</div>
                  <div className="option-category">
                    {currentChoice.optionA.category === 'needs' && '🛒 Necesidad'}
                    {currentChoice.optionA.category === 'wants' && '🎮 Gusto'}
                    {currentChoice.optionA.category === 'savings' && '🐷 Ahorro'}
                  </div>
                </button>

                <button 
                  className="choice-option option-b"
                  onClick={() => handleChoice(currentChoice, 'B')}
                >
                  <div className="option-label">Opción B</div>
                  <div className="option-text">{currentChoice.optionB.text}</div>
                  <div className="option-cost">${currentChoice.optionB.cost}</div>
                  <div className="option-category">
                    {currentChoice.optionB.category === 'needs' && '🛒 Necesidad'}
                    {currentChoice.optionB.category === 'wants' && '🎮 Gusto'}
                    {currentChoice.optionB.category === 'savings' && '🐷 Ahorro'}
                  </div>
                </button>
              </div>

              <div className="progress-indicator">
                Elección {currentChoiceIndex + 1} de 3
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA FINAL
  if (stage === 'complete') {
    const results = calculateResults();
    
    // Determinar calificación
    let grade = '';
    let message = '';
    let lesson = '';
    
    if (results.savingsPercentage >= 20 && results.needsPercentage >= 40) {
      grade = '🏆 EXCELENTE';
      message = '¡Felicidades! Manejaste tu dinero como un experto financiero.';
      lesson = 'Lograste balancear tus necesidades, darte gustos moderados y AHORRAR. Así se construye un futuro sólido.';
    } else if (results.savingsPercentage >= 10) {
      grade = '⭐ BIEN';
      message = 'Buen trabajo. Tienes las bases, solo necesitas más disciplina.';
      lesson = 'Ahorraste algo, pero podrías mejorar. Recuerda: cada peso que guardas hoy es seguridad mañana.';
    } else if (results.savingsPercentage > 0) {
      grade = '👍 REGULAR';
      message = 'No está mal para empezar, pero hay mucho por mejorar.';
      lesson = 'Gastaste demasiado en cosas no esenciales. La clave está en preguntarte: ¿realmente lo NECESITO o solo lo QUIERO?';
    } else {
      grade = '📚 MEJORABLE';
      message = 'Gastaste todo tu dinero. Esto es peligroso en la vida real.';
      lesson = 'Sin ahorros, cualquier emergencia te dejará sin opciones. SIEMPRE separa al menos el 20% antes de gastar.';
    }

    return (
      <div className="game-panel-overlay">
        <div className="game-panel expense-game-panel">
          <div className="panel-header">
            <h2>🎉 ¡Simulación Completada!</h2>
          </div>

          <div className="panel-content">
            <div className="final-results">
              <div className="grade-display">
                <h3>{grade}</h3>
                <p>{message}</p>
              </div>

              <div className="results-summary">
                <h4>📊 Tu desempeño:</h4>
                
                <div className="result-row">
                  <span>💰 Total ganado:</span>
                  <strong>${totalEarned}</strong>
                </div>
                
                <div className="result-row">
                  <span>💸 Total gastado:</span>
                  <strong>${totalSpent}</strong>
                </div>
                
                <div className="result-row highlight">
                  <span>🐷 Ahorro final:</span>
                  <strong>${results.saved}</strong>
                </div>

                <div className="percentage-breakdown">
                  <h4>Tu distribución vs Recomendado (50-30-20):</h4>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-header">
                      <span>🛒 Necesidades</span>
                      <span className={results.needsPercentage >= 40 && results.needsPercentage <= 60 ? 'good' : 'bad'}>
                        {results.needsPercentage}% {results.needsPercentage >= 40 && results.needsPercentage <= 60 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="breakdown-bar">
                      <div className="bar-fill needs" style={{width: `${results.needsPercentage}%`}} />
                    </div>
                    <small>Recomendado: ~50%</small>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-header">
                      <span>🎮 Gustos</span>
                      <span className={results.wantsPercentage <= 30 ? 'good' : 'bad'}>
                        {results.wantsPercentage}% {results.wantsPercentage <= 30 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="breakdown-bar">
                      <div className="bar-fill wants" style={{width: `${results.wantsPercentage}%`}} />
                    </div>
                    <small>Recomendado: ~30%</small>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-header">
                      <span>🐷 Ahorro</span>
                      <span className={results.savingsPercentage >= 20 ? 'good' : 'bad'}>
                        {results.savingsPercentage}% {results.savingsPercentage >= 20 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="breakdown-bar">
                      <div className="bar-fill savings" style={{width: `${results.savingsPercentage}%`}} />
                    </div>
                    <small>Recomendado: ~20%</small>
                  </div>
                </div>
              </div>

              <div className="lesson-box">
                <h4>💡 Enseñanza clave:</h4>
                <p>{lesson}</p>
                
                <div className="final-wisdom">
                  <p><strong>Recuerda siempre:</strong></p>
                  <ul>
                    <li>🛒 <strong>Necesidades primero:</strong> Comida, techo, transporte, salud</li>
                    <li>🎮 <strong>Gustos con moderación:</strong> Disfruta la vida, pero sin comprometer tu futuro</li>
                    <li>🐷 <strong>Ahorra ANTES de gastar:</strong> No esperes "a ver qué sobra"</li>
                    <li>⚠️ <strong>Pregúntate siempre:</strong> ¿Lo NECESITO o solo lo QUIERO?</li>
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => onComplete(results)}
                style={{
                  width: '100%',
                  padding: '12px 32px',
                  fontSize: '16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Volver al Mapa 🏠
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}