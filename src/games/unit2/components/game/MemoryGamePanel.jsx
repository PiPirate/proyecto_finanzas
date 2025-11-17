import React, { useState, useEffect } from 'react';

/* -----------------------------------------------------
   JUEGO 1: NECESIDADES - "¿Puedo vivir sin esto?"
----------------------------------------------------- */
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

/* -----------------------------------------------------
   JUEGO 2: GUSTOS - "Quiero vs Necesito"
----------------------------------------------------- */
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

/* -----------------------------------------------------
  JUEGO 3: AHORRO - "Planta tu Futuro"
----------------------------------------------------- */
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
      { text: 'Solo si me sobra dinero', isCorrect: false, feedback: 'No. Ahorra PRIMERO.' },
      { text: 'Desde que recibo mi salario', isCorrect: true, feedback: 'Correcto. Págate a ti primero.' },
    ]
  },
  {
    id: '3',
    emoji: '🎓',
    question: 'Ahorrar para un curso es:',
    options: [
      { text: 'Un gasto innecesario', isCorrect: false, feedback: 'No. La educación mejora tu futuro.' },
      { text: 'Invertir en tu futuro', isCorrect: true, feedback: '¡Sí! Es una inversión en ti mismo.' },
    ]
  },
  {
    id: '4',
    emoji: '💼',
    question: '¿Cuántos meses de gastos debo ahorrar?',
    options: [
      { text: '1 mes', isCorrect: false, feedback: 'Muy poco. Se recomiendan 3-6 meses.' },
      { text: '3-6 meses', isCorrect: true, feedback: 'Perfecto. Eso te da tranquilidad.' },
    ]
  },
  {
    id: '5',
    emoji: '🏖️',
    question: 'Para irme de vacaciones debo:',
    options: [
      { text: 'Usar tarjeta de crédito', isCorrect: false, feedback: 'Eso genera deudas.' },
      { text: 'Ahorrar con anticipación', isCorrect: true, feedback: 'Planificar evita deudas.' },
    ]
  },
];

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */
export function MemoryGamePanel({ zone, onComplete, onClose }) {
  if (zone === 'needs') return <NeedsGame onComplete={onComplete} onClose={onClose} />;
  if (zone === 'wants') return <WantsGame onComplete={onComplete} onClose={onClose} />;
  return <SavingsGame onComplete={onComplete} onClose={onClose} />;
}

/* =====================================================
   JUEGO DE NECESIDADES
===================================================== */
function NeedsGame({ onComplete, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledItems] = useState(() => [...needsItems].sort(() => Math.random() - 0.5));

  const currentItem = shuffledItems[currentIndex];

  const handleAnswer = (canLiveWithout) => {
    if (feedback) return;

    const isCorrect = (canLiveWithout === !currentItem.isNeed);
    if (isCorrect) setScore(prev => prev + 1);

    setFeedback(isCorrect ? '✓ ' + currentItem.explanation : '✗ ' + currentItem.explanation);

    setTimeout(() => {
      if (currentIndex < shuffledItems.length - 1) {
        setCurrentIndex(i => i + 1);
        setFeedback(null);
      } else {
        setIsComplete(true);
      }
    }, 1800);
  };

  if (isComplete) {
    const percentage = Math.round((score / shuffledItems.length) * 100);

    return (
      <div className="game-panel-overlay">
        <div className="minigame-container">

          <div className="minigame-header"><h2>COMPLETADO</h2></div>

          <div className="minigame-content">
            <div className="complete-emoji">✓</div>
            <h3>{percentage >= 75 ? 'EXCELENTE' : percentage >= 50 ? 'BIEN HECHO' : 'SIGUE PRACTICANDO'}</h3>

            <div className="score-display">{score}/{shuffledItems.length}</div>

            <div className="lesson-box">
              <p><strong>NECESIDADES</strong> son cosas sin las que NO puedes vivir.</p>
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
              <button className="choice-btn choice-btn--no" onClick={() => handleAnswer(false)}>
                <div className="choice-text">NO PUEDO VIVIR SIN ESTO</div>
                <div className="choice-hint">Es una necesidad</div>
              </button>

              <button className="choice-btn choice-btn--yes" onClick={() => handleAnswer(true)}>
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

/* =====================================================
   JUEGO DE GUSTOS
===================================================== */
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

    const labels = { want: 'un GUSTO opcional', need: 'una NECESIDAD' };

    setFeedback(
      isCorrect
        ? `✓ ¡Correcto! "${currentItem.name}" es ${labels[currentItem.category]}.`
        : `✗ Incorrecto. "${currentItem.name}" es ${labels[currentItem.category]}.`
    );

    setTimeout(() => {
      if (currentIndex < shuffledItems.length - 1) {
        setCurrentIndex(i => i + 1);
        setFeedback(null);
      } else setIsComplete(true);
    }, 1800);
  };

  if (isComplete) {
    const percentage = Math.round((score / shuffledItems.length) * 100);

    return (
      <div className="game-panel-overlay">
        <div className="minigame-container">

          <div className="minigame-header"><h2>COMPLETADO</h2></div>

          <div className="minigame-content">
            <div className="complete-emoji">✓</div>

            <h3>{percentage >= 75 ? 'EXCELENTE' : percentage >= 50 ? 'BIEN HECHO' : 'SIGUE PRACTICANDO'}</h3>

            <div className="score-display">{score}/{shuffledItems.length}</div>

            <div className="lesson-box">
              <p>Los <strong>GUSTOS</strong> son opcionales; las <strong>NECESIDADES</strong> son esenciales.</p>
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
              <button className="choice-btn choice-btn--want" onClick={() => handleChoice('want')}>
                <div className="choice-text">GUSTO</div>
                <div className="choice-hint">Opcional</div>
              </button>

              <button className="choice-btn choice-btn--need" onClick={() => handleChoice('need')}>
                <div className="choice-text">NECESIDAD</div>
                <div className="choice-hint">Esencial</div>
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

/* =====================================================
   JUEGO DE AHORRO
===================================================== */
function SavingsGame({ onComplete, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [treeLevel, setTreeLevel] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledItems] = useState(() =>
    [...savingsItems].sort(() => Math.random() - 0.5).slice(0, 5)
  );

  const currentItem = shuffledItems[currentIndex];
  const treeEmojis = ['🌱', '🌿', '🌳', '🌳✨', '🌳🌟', '🌳💎'];

  const handleAnswer = (index) => {
    if (feedback) return;

    const option = currentItem.options[index];
    setFeedback(option.isCorrect ? '✓ ' + option.feedback : '✗ ' + option.feedback);

    if (option.isCorrect) setTreeLevel(level => level + 1);

    setTimeout(() => {
      if (currentIndex < shuffledItems.length - 1) {
        setCurrentIndex(i => i + 1);
        setFeedback(null);
      } else setIsComplete(true);
    }, 2200);
  };

  if (isComplete) {
    return (
      <div className="game-panel-overlay">
        <div className="minigame-container">
          
          <div className="minigame-header"><h2>COMPLETADO</h2></div>

          <div className="minigame-content">
            <div className="tree-final">{treeEmojis[treeLevel]}</div>

            <h3>
              {treeLevel >= 4 ? 'EXCELENTE' :
               treeLevel >= 3 ? 'BIEN HECHO' : 'SIGUE PRACTICANDO'}
            </h3>

            <div className="score-display">
              {treeLevel}/{shuffledItems.length}
            </div>

            <div className="lesson-box">
              <p><strong>AHORRAR</strong> es invertir en tu futuro. Págate a ti primero.</p>
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
              {currentItem.options.map((opt, i) => (
                <button
                  key={i}
                  className="choice-btn choice-btn--savings"
                  onClick={() => handleAnswer(i)}
                >
                  <div className="choice-text">{opt.text}</div>
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
