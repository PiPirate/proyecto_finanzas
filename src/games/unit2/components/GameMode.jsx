// src/games/unit2/components/GameMode.jsx
import React, { useState, useEffect } from 'react';
import ExpenseCard from './game/ExpenseCard.jsx';
import BudgetDisplay from './game/BudgetDisplay.jsx';
import DayResults from './game/DayResults.jsx';
import GameOver from './game/GameOver.jsx';
import { expenseCards } from './data/expenseCards.js';

export default function GameMode({ onBackToMenu }) {
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

  // ───────────────────────────────────────────────
  // INICIAR DÍA 1
  // ───────────────────────────────────────────────
  useEffect(() => {
    drawCards();
  }, []);

  const drawCards = () => {
    const availableCards = expenseCards.filter(
      (card) => !playedCards.includes(card.id)
    );

    const numCards = Math.floor(Math.random() * 3) + 5; // 5-7 cartas
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, Math.min(numCards, availableCards.length));

    setCurrentHand([...postponedCards, ...drawn]);
    setPostponedCards([]);
  };

  // ───────────────────────────────────────────────
  // ACCIONES DE CARTAS
  // ───────────────────────────────────────────────
  const handlePayNow = (card) => {
    const category = card.type === 'need' ? 'needs' : 'wants';

    const availableBudget = budget[category];
    if (availableBudget < card.amount) {
      alert(`No tienes suficiente presupuesto en ${category === "needs" ? "Necesidades" : "Gustos"}.`);
      return;
    }

    setBudget(prev => ({
      ...prev,
      [category]: prev[category] - card.amount,
      total: prev.total - card.amount
    }));

    setCurrentHand(prev => prev.filter(c => c.id !== card.id));
    setPlayedCards(prev => [...prev, card.id]);

    if (card.type === "need") {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handlePostpone = (card) => {
    // En expenseCards NO existen penalizaciones → las removemos para evitar errores
    const postponed = {
      ...card,
      amount: card.amount, 
    };

    setPostponedCards(prev => [...prev, postponed]);
    setCurrentHand(prev => prev.filter(c => c.id !== card.id));
    setScore(prev => prev - 5);
  };

  const handleDiscard = (card) => {
    const penalty = 10; // valor por defecto
    setComfortLevel(prev => Math.max(0, prev - penalty));
    setCurrentHand(prev => prev.filter(c => c.id !== card.id));
    setPlayedCards(prev => [...prev, card.id]);
    setScore(prev => prev - 3);
    setStreak(0);
  };

  // ───────────────────────────────────────────────
  // FIN DEL DÍA
  // ───────────────────────────────────────────────
  const handleEndDay = () => {
    if (currentHand.length > 0) {
      alert("Debes resolver todas las cartas antes de terminar el día.");
      return;
    }

    const savingsKept = budget.savings >= budget.savingsGoal;

    if (savingsKept) {
      setScore(prev => prev + 20);
    }

    setShowDayResults(true);
  };

  const handleContinueNextDay = () => {
    setShowDayResults(false);

    if (currentDay >= 5) {
      const finalWon =
        budget.savings >= budget.savingsGoal &&
        budget.total >= 0 &&
        comfortLevel > 20;

      setGameWon(finalWon);
      setGameOver(true);
      return;
    }

    setCurrentDay(prev => prev + 1);
    drawCards();
  };

  // ───────────────────────────────────────────────
  // REINICIAR JUEGO
  // ───────────────────────────────────────────────
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

  // ───────────────────────────────────────────────
  // PANTALLAS ESPECIALES
  // ───────────────────────────────────────────────
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

  // ───────────────────────────────────────────────
  // UI PRINCIPAL DEL JUEGO
  // ───────────────────────────────────────────────
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
          className="back-menu-btn"
        >
          ← Volver al Menú
        </button>
      </div>

      <BudgetDisplay budget={budget} />

      <div className="game-content">
        <div className="cards-area">
          <h3 style={{ textAlign: "center", marginBottom: "16px" }}>
            Gastos del día ({currentHand.length} pendientes)
          </h3>

          <div className="cards-hand">
            {currentHand.map(card => (
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
              <p style={{ textAlign: "center", marginBottom: "16px" }}>
                ¡Todos los gastos resueltos!
              </p>

              <button
                onClick={handleEndDay}
                className="end-day-btn"
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
