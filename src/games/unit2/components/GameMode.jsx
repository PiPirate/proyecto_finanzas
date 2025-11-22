import React, { useState, useEffect } from 'react';
import { ExpenseCard } from './game/ExpenseCard';
import { BudgetDisplay } from './game/BudgetDisplay';
import { DayResults } from './game/DayResults';
import { GameOver } from './game/GameOver';
import { expenseCards } from './data/expenseCards';

export function GameMode({ onBackToMenu }) {
  const [currentDay, setCurrentDay] = useState(1);
  const [budget, setBudget] = useState({
    total: 10000,
    needs: 5000,
    wants: 3000,
    savings: 2000,
    savingsGoal: 2000,
  });
  const [currentHand, setCurrentHand] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);
  const [postponedCards, setPostponedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comfortLevel, setComfortLevel] = useState(100);
  const [showDayResults, setShowDayResults] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    drawCards();
  }, []);

  const drawCards = () => {
    const availableCards = expenseCards.filter(
      (card) => !playedCards.includes(card.id)
    );
    const numCards = Math.floor(Math.random() * 3) + 5;
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, Math.min(numCards, availableCards.length));
    
    setCurrentHand([...postponedCards, ...drawn]);
    setPostponedCards([]);
  };

  const handlePayNow = (card) => {
    const category = card.type === 'need' ? 'needs' : 'wants';
    const availableBudget = budget[category];

    if (availableBudget >= card.amount) {
      setBudget((prev) => ({
        ...prev,
        [category]: prev[category] - card.amount,
      }));

      setCurrentHand((prev) => prev.filter((c) => c.id !== card.id));
      setPlayedCards((prev) => [...prev, card.id]);

      if (card.type === 'need') {
        setScore((prev) => prev + 10);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }
    } else {
      alert(`No tienes suficiente presupuesto en ${category === 'needs' ? 'Necesidades' : 'Gustos'}. Disponible: $${availableBudget}`);
    }
  };

  const handlePostpone = (card) => {
    if (!card.postponable) {
      alert('Esta carta no se puede posponer');
      return;
    }

    const postponedCard = {
      ...card,
      amount: card.amount + (card.postponePenalty || 0),
    };

    setPostponedCards((prev) => [...prev, postponedCard]);
    setCurrentHand((prev) => prev.filter((c) => c.id !== card.id));
    setScore((prev) => prev - 5);
  };

  const handleDiscard = (card) => {
    const penalty = card.discardPenalty || 10;
    setComfortLevel((prev) => Math.max(0, prev - penalty));
    setCurrentHand((prev) => prev.filter((c) => c.id !== card.id));
    setPlayedCards((prev) => [...prev, card.id]);
    setScore((prev) => prev - 3);
    setStreak(0);
  };

  const handleEndDay = () => {
    if (currentHand.length > 0) {
      alert('Debes resolver todas las cartas antes de terminar el día');
      return;
    }

    const savingsKept = budget.savings >= budget.savingsGoal;
    if (savingsKept) {
      setScore((prev) => prev + 20);
    }

    setShowDayResults(true);
  };

  const handleContinueNextDay = () => {
    setShowDayResults(false);

    if (currentDay >= 5) {
      const finalWon = budget.savings >= budget.savingsGoal && budget.total >= 0;
      setGameWon(finalWon);
      setGameOver(true);
    } else {
      setCurrentDay((prev) => prev + 1);
      drawCards();
    }
  };

  const handleRestart = () => {
    setCurrentDay(1);
    setBudget({
      total: 10000,
      needs: 5000,
      wants: 3000,
      savings: 2000,
      savingsGoal: 2000,
    });
    setCurrentHand([]);
    setPlayedCards([]);
    setPostponedCards([]);
    setScore(0);
    setStreak(0);
    setComfortLevel(100);
    setShowDayResults(false);
    setGameOver(false);
    setGameWon(false);
    drawCards();
  };

  if (gameOver) {
    return (
      <GameOver
        won={gameWon}
        finalScore={score}
        finalBudget={budget}
        comfortLevel={comfortLevel}
        onRestart={handleRestart}
        onBackToMenu={onBackToMenu}
      />
    );
  }

  if (showDayResults) {
    return (
      <DayResults
        day={currentDay}
        budget={budget}
        score={score}
        comfortLevel={comfortLevel}
        streak={streak}
        onContinue={handleContinueNextDay}
      />
    );
  }

  return (
    <div className="game-mode">
      <div className="game-header">
        <div className="game-info">
          <h2>Día {currentDay} / 5</h2>
          <div className="game-stats">
            <span>📊 Puntos: {score}</span>
            <span>🔥 Racha: {streak}</span>
            <span>😊 Confort: {comfortLevel}%</span>
          </div>
        </div>
        <button 
          onClick={onBackToMenu}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Volver al Menú
        </button>
      </div>

      <BudgetDisplay budget={budget} />

      <div className="game-content">
        <div className="cards-area">
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Gastos del día ({currentHand.length} pendientes)</h3>
          <div className="cards-hand">
            {currentHand.map((card) => (
              <ExpenseCard
                key={card.id}
                card={card}
                onPayNow={() => handlePayNow(card)}
                onPostpone={() => handlePostpone(card)}
                onDiscard={() => handleDiscard(card)}
              />
            ))}
          </div>

          {currentHand.length === 0 && (
            <div className="day-complete">
              <p style={{ textAlign: 'center', marginBottom: '16px' }}>¡Todos los gastos resueltos!</p>
              <button 
                onClick={handleEndDay} 
                style={{
                  padding: '12px 32px',
                  fontSize: '16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'block',
                  margin: '0 auto'
                }}
              >
                Terminar Día {currentDay}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
