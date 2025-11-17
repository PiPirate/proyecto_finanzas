import React, { useState, useEffect } from 'react';

// ============================================
// JUEGO 1: NECESIDADES - "¿Puedes vivir sin esto?"
// ============================================
const needsItems = [
  { id: '1', emoji: '🏠', name: 'Pagar la renta', isNeed: true, explanation: 'Correcto. La vivienda es una necesidad básica.' },
  { id: '2', emoji: '🎮', name: 'Videojuego nuevo', isNeed: false, explanation: 'Correcto. Los videojuegos son entretenimiento opcional.' },
  { id: '3', emoji: '🍞', name: 'Comida del mes', isNeed: true, explanation: 'Correcto. La comida es esencial para vivir.' },
  { id: '4', emoji: '☕', name: 'Café en Starbucks', isNeed: false, explanation: 'Correcto. Puedes hacer café en casa.' },
  { id: '5', emoji: '💡', name: 'Pagar la luz', isNeed: true, explanation: 'Correcto. Los servicios básicos son necesarios.' },
  { id: '6', emoji: '👟', name: 'Tenis de marca', isNeed: false, explanation: 'Correcto. Hay opciones más económicas.' },
  { id: '7', emoji: '🚌', name: 'Transporte al trabajo', isNeed: true, explanation: 'Correcto. Necesitas llegar a tu trabajo.' },
  { id: '8', emoji: '🎬', name: 'Ir al cine', isNeed: false, explanation: 'Correcto. El cine es entretenimiento opcional.' },
];

// ============================================
// JUEGO 2: GUSTOS - "Quiero vs Necesito"
// ============================================
const wantsItems = [
  { id: '1', emoji: '🍕', name: 'Pizza a domicilio', category: 'want' },
  { id: '2', emoji: '💊', name: 'Medicinas recetadas', category: 'need' },
  { id: '3', emoji: '📺', name: 'Netflix Premium', category: 'want' },
  { id: '4', emoji: '🚰', name: 'Agua potable', category: 'need' },
  { id: '5', emoji: '🎧', name: 'Audífonos caros', category: 'want' },
  { id: '6', emoji: '🧼', name: 'Jabón e higiene', category: 'need' },
  { id: '7', emoji: '🍺', name: 'Salir de fiesta', category: 'want' },
  { id: '8', emoji: '📱', name: 'Plan de celular', category: 'need' },
];

// ============================================
// JUEGO 3: AHORRO - "Planta tu Futuro"
// ============================================
const savingsItems = [
  {
    id: '1',
    emoji: '🚨',
    question: '¿Para qué sirve un fondo de emergencias?',
    options: [
      { text: 'Comprar cosas que quiero', isCorrect: false, feedback: 'No. Es para imprevistos, no deseos.' },
      { text: 'Protegerme de imprevistos', isCorrect: true, feedback: '¡Sí! Te protege cuando algo inesperado pasa.' },
    ]
  },
  {
    id: '2',
    emoji: '📈',
    question: '¿Cuándo debo ahorrar?',
    options: [
      { text: 'Solo si me sobra dinero', isCorrect: false, feedback: 'No. Ahorra PRIMERO, es tu prioridad.' },
      { text: 'Desde que recibo mi salario', isCorrect: true, feedback: '¡Exacto! Págate a ti primero.' },
    ]
  },
  {
    id: '3',
    emoji: '🎓',
    question: 'Ahorrar para un curso de capacitación es:',
    options: [
      { text: 'Un gasto innecesario', isCorrect: false, feedback: 'No. La educación mejora tus ingresos futuros.' },
      { text: 'Invertir en tu futuro', isCorrect: true, feedback: '¡Correcto! Es inversión en ti mismo.' },
    ]
  },
  {
    id: '4',
    emoji: '💼',
    question: '¿Cuántos meses de gastos debo tener ahorrados?',
    options: [
      { text: 'Solo 1 mes', isCorrect: false, feedback: 'Muy poco. Lo ideal es 3-6 meses.' },
      { text: 'Al menos 3-6 meses', isCorrect: true, feedback: '¡Perfecto! Eso te da tranquilidad.' },
    ]
  },
  {
    id: '5',
    emoji: '🏖️',
    question: 'Si quiero irme de vacaciones debo:',
    options: [
      { text: 'Usar mi tarjeta de crédito', isCorrect: false, feedback: 'No. Eso genera deudas e intereses.' },
      { text: 'Ahorrar con anticipación', isCorrect: true, feedback: '¡Sí! Planifica y ahorra sin deudas.' },
    ]
  },
];

export function MemoryGamePanel({ zone, onComplete, onClose }) {
  if (zone === 'needs') {
    return <NeedsGame onComplete={onComplete} onClose={onClose} />;
  } else if (zone === 'wants') {
    return <WantsGame onComplete={onComplete} onClose={onClose} />;
  } else {
    return <SavingsGame onComplete={onComplete} onClose={onClose} />;
  }
}

// ============================================
// COMPONENTE: Juego de Necesidades
// ============================================
function NeedsGame({ onComplete, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledItems] = useState(() => [...needsItems].sort(() => Math.random() - 0.5));

  const currentItem = shuffledItems[currentIndex];

  const handleAnswer = (canLiveWithout) => {
    if (feedback) return;

    const isCorrect = canLiveWithout === !currentItem.isNeed;
    if (isCorrect) setScore(prev => prev + 1);
    
    setFeedback(isCorrect ? '✓ ' + currentItem.explanation : '✗ ' + currentItem.explanation);

    setTimeout(() => {
      if (currentIndex < shuffledItems.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setFeedback(null);
      } else {
        setIsComplete(true);
      }
    }, 2000);
  };

  if (isComplete) {
    const percentage = Math.round((score / shuffledItems.length) * 100);
    return (
      <div className="game-panel-overlay">
        <div className="minigame-container">
          <div className="minigame-header">
            <h2>COMPLETADO</h2>
          </div>
          <div className="minigame-content">
            <div className="complete-emoji">✓</div>
            <h3>{percentage >= 75 ? 'EXCELENTE' : percentage >= 50 ? 'BIEN HECHO' : 'SIGUE PRACTICANDO'}</h3>
            <div className="score-display">{score}/{shuffledItems.length}</div>
            <div className="lesson-box">
              <p><strong>NECESIDADES</strong> son gastos que NO puedes evitar. Si no puedes vivir sin ello, es una necesidad.</p>
            </div>
            <button className="btn-continue" onClick={onComplete}>CONTINUAR</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-panel-overlay">
      <div className="minigame-container">
        <div className="minigame-header">
          <div>
            <h2>NECESIDADES</h2>
            <div className="progress-text">{currentIndex + 1}/{shuffledItems.length}</div>
          </div>
          <button className="btn-close-mini" onClick={onClose}>×</button>
        </div>

        <div className="minigame-content">
          <div className="item-card">
            <div className="item-emoji-big">{currentItem.emoji}</div>
            <h3>{currentItem.name}</h3>
          </div>

          {!feedback ? (
            <div className="choice-buttons">
              <button 
                className="choice-btn choice-btn--no"
                onClick={() => handleAnswer(false)}
              >
                <div className="choice-text">NO PUEDO VIVIR SIN ESTO</div>
                <div className="choice-hint">Es una necesidad</div>
              </button>
              <button 
                className="choice-btn choice-btn--yes"
                onClick={() => handleAnswer(true)}
              >
                <div className="choice-text">SÍ PUEDO VIVIR SIN ESTO</div>
                <div className="choice-hint">Es opcional</div>
              </button>
            </div>
          ) : (
            <div className="feedback-box">{feedback}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Juego de Gustos
// ============================================
function WantsGame({ onComplete, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledItems] = useState(() => [...wantsItems].sort(() => Math.random() - 0.5));

  const currentItem = shuffledItems[currentIndex];

  const handleChoice = (choice) => {
    if (feedback) return;

    const isCorrect = choice === currentItem.category;
    if (isCorrect) setScore(prev => prev + 1);

    const explanations = {
      want: 'un GUSTO opcional',
      need: 'una NECESIDAD esencial'
    };

    setFeedback(
      isCorrect 
        ? `✓ ¡Correcto! "${currentItem.name}" es ${explanations[currentItem.category]}.`
        : `✗ Incorrecto. "${currentItem.name}" es ${explanations[currentItem.category]}.`
    );

    setTimeout(() => {
      if (currentIndex < shuffledItems.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setFeedback(null);
      } else {
        setIsComplete(true);
      }
    }, 2000);
  };

  if (isComplete) {
    const percentage = Math.round((score / shuffledItems.length) * 100);
    return (
      <div className="game-panel-overlay">
        <div className="minigame-container">
          <div className="minigame-header">
            <h2>COMPLETADO</h2>
          </div>
          <div className="minigame-content">
            <div className="complete-emoji">✓</div>
            <h3>{percentage >= 75 ? 'EXCELENTE' : percentage >= 50 ? 'BIEN HECHO' : 'SIGUE PRACTICANDO'}</h3>
            <div className="score-display">{score}/{shuffledItems.length}</div>
            <div className="lesson-box">
              <p><strong>GUSTOS</strong> mejoran tu vida pero son opcionales. <strong>NECESIDADES</strong> son esenciales. Pregúntate: ¿realmente lo necesito o solo lo quiero?</p>
            </div>
            <button className="btn-continue" onClick={onComplete}>CONTINUAR</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-panel-overlay">
      <div className="minigame-container">
        <div className="minigame-header">
          <div>
            <h2>GUSTOS VS NECESIDADES</h2>
            <div className="progress-text">{currentIndex + 1}/{shuffledItems.length}</div>
          </div>
          <button className="btn-close-mini" onClick={onClose}>×</button>
        </div>

        <div className="minigame-content">
          <div className="item-card">
            <div className="item-emoji-big">{currentItem.emoji}</div>
            <h3>{currentItem.name}</h3>
          </div>

          {!feedback ? (
            <div className="choice-buttons">
              <button 
                className="choice-btn choice-btn--want"
                onClick={() => handleChoice('want')}
              >
                <div className="choice-text">GUSTO</div>
                <div className="choice-hint">Opcional, mejora mi vida</div>
              </button>
              <button 
                className="choice-btn choice-btn--need"
                onClick={() => handleChoice('need')}
              >
                <div className="choice-text">NECESIDAD</div>
                <div className="choice-hint">Esencial para vivir</div>
              </button>
            </div>
          ) : (
            <div className="feedback-box">{feedback}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Juego de Ahorro
// ============================================
function SavingsGame({ onComplete, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [treeLevel, setTreeLevel] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledItems] = useState(() => [...savingsItems].sort(() => Math.random() - 0.5).slice(0, 5));

  const currentItem = shuffledItems[currentIndex];

  const handleAnswer = (optionIndex) => {
    if (feedback) return;

    const option = currentItem.options[optionIndex];
    setFeedback(option.isCorrect ? '✅ ' + option.feedback : '❌ ' + option.feedback);

    if (option.isCorrect) {
      setTreeLevel(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < shuffledItems.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setFeedback(null);
      } else {
        setIsComplete(true);
      }
    }, 2500);
  };

  const treeEmojis = ['🌱', '🌿', '🌳', '🌳✨', '🌳🌟', '🌳💎'];

  if (isComplete) {
    return (
      <div className="game-panel-overlay">
        <div className="minigame-container">
          <div className="minigame-header">
            <h2>COMPLETADO</h2>
          </div>
          <div className="minigame-content">
            <div className="tree-final">{treeEmojis[treeLevel]}</div>
            <h3>{treeLevel >= 4 ? 'EXCELENTE' : treeLevel >= 3 ? 'BIEN HECHO' : 'SIGUE PRACTICANDO'}</h3>
            <div className="score-display">{treeLevel}/{shuffledItems.length}</div>
            <div className="lesson-box">
              <p><strong>AHORRO</strong> es tu red de seguridad. Cada peso que guardas hoy es libertad mañana. Págate a ti primero.</p>
            </div>
            <button className="btn-continue" onClick={onComplete}>CONTINUAR</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-panel-overlay">
      <div className="minigame-container">
        <div className="minigame-header">
          <div>
            <h2>AHORRO</h2>
            <div className="progress-text">{currentIndex + 1}/{shuffledItems.length}</div>
          </div>
          <button className="btn-close-mini" onClick={onClose}>×</button>
        </div>

        <div className="minigame-content">
          <div className="tree-container">
            <div className="tree-growth">{treeEmojis[treeLevel]}</div>
            <div className="tree-label">Tu progreso</div>
          </div>

          <div className="question-card">
            <h3>{currentItem.question}</h3>
          </div>

          {!feedback ? (
            <div className="choice-buttons">
              {currentItem.options.map((option, index) => (
                <button 
                  key={index}
                  className="choice-btn choice-btn--savings"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="choice-text">{option.text}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="feedback-box">{feedback}</div>
          )}
        </div>
      </div>
    </div>
  );
}
