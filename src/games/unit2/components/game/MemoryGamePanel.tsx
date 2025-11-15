import React, { useState, useEffect } from 'react';

interface MemoryCard {
  id: string;
  content: string;
  type: 'image' | 'text';
  matchId: string; // ID para emparejar
}

interface MemoryGamePanelProps {
  zone: 'needs' | 'wants' | 'savings';
  onComplete: () => void;
  onClose: () => void;
}

// Datos de emparejamiento para cada zona
const memoryGameData = {
  needs: {
    title: '🛒 Necesidades - ¿Qué es esencial?',
    description: 'Empareja cada item con su categoría correcta',
    pairs: [
      { id: 'pair1', image: '🍞', text: 'Comida básica' },
      { id: 'pair2', image: '🏠', text: 'Pagar la renta' },
      { id: 'pair3', image: '💡', text: 'Servicios (luz, agua)' },
      { id: 'pair4', image: '🚌', text: 'Transporte al trabajo' },
      { id: 'pair5', image: '💊', text: 'Medicinas' },
      { id: 'pair6', image: '👕', text: 'Ropa básica' },
    ]
  },
  wants: {
    title: '🎮 Gustos - ¿Qué es opcional?',
    description: 'Empareja cada actividad de ocio con su descripción',
    pairs: [
      { id: 'pair1', image: '🎬', text: 'Ir al cine' },
      { id: 'pair2', image: '🍕', text: 'Pedir comida rápida' },
      { id: 'pair3', image: '📺', text: 'Suscripciones streaming' },
      { id: 'pair4', image: '👗', text: 'Ropa de moda' },
      { id: 'pair5', image: '🎮', text: 'Videojuegos nuevos' },
      { id: 'pair6', image: '🎁', text: 'Regalos para amigos' },
    ]
  },
  savings: {
    title: '🐷 Ahorro - ¿Para qué sirve?',
    description: 'Empareja cada situación con el uso del ahorro',
    pairs: [
      { id: 'pair1', image: '🚨', text: 'Emergencias médicas' },
      { id: 'pair2', image: '🏖️', text: 'Vacaciones planificadas' },
      { id: 'pair3', image: '🔧', text: 'Reparaciones imprevistas' },
      { id: 'pair4', image: '📚', text: 'Educación/Cursos' },
      { id: 'pair5', image: '💼', text: 'Fondo si pierdes trabajo' },
      { id: 'pair6', image: '🌟', text: 'Metas a largo plazo' },
    ]
  }
};

export function MemoryGamePanel({ zone, onComplete, onClose }: MemoryGamePanelProps) {
  const gameData = memoryGameData[zone];
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Crear las cartas mezcladas
    const imageCards: MemoryCard[] = gameData.pairs.map(pair => ({
      id: `img-${pair.id}`,
      content: pair.image,
      type: 'image',
      matchId: pair.id
    }));

    const textCards: MemoryCard[] = gameData.pairs.map(pair => ({
      id: `txt-${pair.id}`,
      content: pair.text,
      type: 'text',
      matchId: pair.id
    }));

    const allCards = [...imageCards, ...textCards].sort(() => Math.random() - 0.5);
    setCards(allCards);
  }, [zone]);

  const handleCardClick = (cardId: string) => {
    // No permitir seleccionar más de 2 cartas
    if (selectedCards.length >= 2) return;
    
    // No permitir seleccionar la misma carta dos veces
    if (selectedCards.includes(cardId)) return;
    
    // No permitir seleccionar cartas ya emparejadas
    const card = cards.find(c => c.id === cardId);
    if (!card || matchedPairs.includes(card.matchId)) return;

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    // Verificar empareamiento cuando hay 2 cartas seleccionadas
    if (newSelected.length === 2) {
      const card1 = cards.find(c => c.id === newSelected[0]);
      const card2 = cards.find(c => c.id === newSelected[1]);

      setAttempts(prev => prev + 1);

      if (card1 && card2 && card1.matchId === card2.matchId) {
        // ¡Match correcto!
        setMatchedPairs(prev => [...prev, card1.matchId]);
        setMessage('✅ ¡Correcto!');
        
        setTimeout(() => {
          setSelectedCards([]);
          setMessage('');
          
          // Verificar si completó el juego
          if (matchedPairs.length + 1 === gameData.pairs.length) {
            setIsComplete(true);
          }
        }, 800);
      } else {
        // No coinciden
        setMessage('❌ No coinciden. ¡Inténtalo de nuevo!');
        
        setTimeout(() => {
          setSelectedCards([]);
          setMessage('');
        }, 1200);
      }
    }
  };

  const isCardSelected = (cardId: string) => selectedCards.includes(cardId);
  const isCardMatched = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return card ? matchedPairs.includes(card.matchId) : false;
  };

  if (isComplete) {
    const rating = attempts <= gameData.pairs.length + 2 ? '🏆 ¡EXCELENTE!' 
                 : attempts <= gameData.pairs.length * 2 ? '⭐ ¡Bien hecho!' 
                 : '👍 ¡Completado!';

    return (
      <div className="game-panel-overlay">
        <div className="game-panel memory-game-panel">
          <div className="panel-header">
            <h2>🎉 ¡Juego Completado!</h2>
          </div>

          <div className="panel-content">
            <div className="memory-complete">
              <div className="complete-icon">🎊</div>
              <h3>{rating}</h3>
              <p>Completaste el juego en <strong>{attempts}</strong> intentos</p>
              
              <div className="complete-lesson">
                <h4>📚 Lección aprendida:</h4>
                {zone === 'needs' && (
                  <p>Las <strong>necesidades</strong> son gastos esenciales que NO puedes evitar. 
                  Siempre prioriza comida, vivienda, salud y transporte básico.</p>
                )}
                {zone === 'wants' && (
                  <p>Los <strong>gustos</strong> hacen la vida disfrutable pero son opcionales. 
                  Puedes tenerlos cuando tu presupuesto lo permita, ¡sin culpa!</p>
                )}
                {zone === 'savings' && (
                  <p>El <strong>ahorro</strong> es tu red de seguridad. Guarda PRIMERO antes de gastar. 
                  Tu yo del futuro te lo agradecerá.</p>
                )}
              </div>

              <button 
                onClick={onComplete}
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
                ¡Entendido! Continuar 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-panel-overlay">
      <div className="game-panel memory-game-panel">
        <div className="panel-header">
          <div>
            <h2>{gameData.title}</h2>
            <p className="panel-subtitle">{gameData.description}</p>
          </div>
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

        <div className="memory-stats">
          <div className="stat-item">
            <span className="stat-label">Intentos:</span>
            <span className="stat-value">{attempts}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Parejas:</span>
            <span className="stat-value">{matchedPairs.length}/{gameData.pairs.length}</span>
          </div>
        </div>

        {message && (
          <div className={`memory-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="panel-content">
          <div className="memory-cards-grid">
            {cards.map((card) => {
              const isSelected = isCardSelected(card.id);
              const isMatched = isCardMatched(card.id);
              
              return (
                <button
                  key={card.id}
                  className={`memory-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''} ${card.type}`}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isMatched}
                >
                  {card.type === 'image' ? (
                    <span className="card-emoji">{card.content}</span>
                  ) : (
                    <span className="card-text">{card.content}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="memory-instructions">
            <p>💡 <strong>Instrucciones:</strong> Haz clic en una imagen y luego en su descripción correspondiente</p>
          </div>
        </div>
      </div>
    </div>
  );
}