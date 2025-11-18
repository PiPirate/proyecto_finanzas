// src/games/unit4/TowerDefensePanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import './css/TowerDefensePanel.css';

// SPRITES
import mapSprite from '../../assets/unit4/mapa_cafeteria.png';
import playerSprite from '../../assets/unit4/player.png';
import enemySprite from '../../assets/unit4/enemy.png';

// ==================== CONFIGURACIÓN DEL JUEGO ====================
const GAME_CONFIG = {
  LANES: 4,
   LANE_HEIGHT: 120,     // antes 100 -> más alto (4 carriles = 480px)
  GAME_WIDTH: 1100,     // antes 900 -> más ancho
  GAME_HEIGHT: 480,     // opcional, por coherencia
  DEFENDER_X: 140,      // un pelín más a la derecha para compensar el ancho
  ENEMY_START_X: 1050,  // antes 850, que salgan desde más lejos
  SPAWN_INTERVAL: 1000,      // cada cuántos ms aparece un enemigo
  QUESTIONS_TO_WIN: 7,
  MAX_ENEMIES_PASSED: 6,     // 3 vidas
  QUESTION_TIME: 15,
  TOTAL_GAME_TIME: 120,
  TIME_PENALTY: 10,
  MAX_ACTIVE_ENEMIES: 6
};

// ==================== PREGUNTAS ====================
const FINANCE_QUESTIONS = [
  {
    question: '¿Qué porcentaje de tu salario debes destinar a NECESIDADES según la regla 50-30-20?',
    options: ['30%', '50%', '20%', '70%'],
    correct: 1
  },
  {
    question: '¿Cuál de estos gastos es una NECESIDAD?',
    options: ['Netflix', 'Comida del mes', 'Videojuegos', 'Ropa de marca'],
    correct: 1
  },
  {
    question: '¿Qué porcentaje se destina a GUSTOS en la regla 50-30-20?',
    options: ['20%', '50%', '30%', '40%'],
    correct: 2
  },
  {
    question: '¿Cuál de estos es un GASTO (want)?',
    options: ['Luz', 'Agua', 'Conciertos', 'Transporte al trabajo'],
    correct: 2
  },
  {
    question: '¿Qué porcentaje debes AHORRAR según la regla 50-30-20?',
    options: ['10%', '30%', '20%', '50%'],
    correct: 2
  },
  {
    question: '¿Para qué sirve el ahorro de emergencia?',
    options: ['Comprar caprichos', 'Imprevistos y urgencias', 'Vacaciones', 'Ropa nueva'],
    correct: 1
  },
  {
    question: '¿Cuál NO es una necesidad básica?',
    options: ['Medicinas', 'Internet para trabajo', 'Streaming de música', 'Renta'],
    correct: 2
  },
  {
    question: 'Si ganas $10,000, ¿cuánto deberías ahorrar mínimo?',
    options: ['$1,000', '$2,000', '$3,000', '$5,000'],
    correct: 1
  }
];

// ==================== COMPONENTE PRINCIPAL ====================
export function TowerDefensePanel({ onComplete, onClose }) {
  const [gamePhase, setGamePhase] = useState('intro'); // intro | playing | question | victory | defeat
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionTime, setQuestionTime] = useState(GAME_CONFIG.QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [playerLane, setPlayerLane] = useState(1);
  const [enemies, setEnemies] = useState([]);
  const [enemiesPassedCount, setEnemiesPassedCount] = useState(0);
  const [enemiesKilledCount, setEnemiesKilledCount] = useState(0);
  const [gameTime, setGameTime] = useState(GAME_CONFIG.TOTAL_GAME_TIME);

  const gameLoopRef = useRef(null);
  const spawnIntervalRef = useRef(null);
  const questionTimerRef = useRef(null);
  const globalTimerRef = useRef(null);
  const enemyIdCounter = useRef(0);

  // ==================== INICIO DEL JUEGO ====================
  const startGame = () => {
    setGamePhase('playing');
    setPlayerLane(1);
    setEnemies([]);
    setCorrectAnswers(0);
    setEnemiesPassedCount(0);
    setEnemiesKilledCount(0);
    setGameTime(GAME_CONFIG.TOTAL_GAME_TIME);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    enemyIdCounter.current = 0;
  };

  // ==================== CONTROLES (W/S o flechas) ====================
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setPlayerLane((prev) => Math.max(0, prev - 1));
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setPlayerLane((prev) => Math.min(GAME_CONFIG.LANES - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase]);

  // ==================== CREAR ENEMIGO ====================
  const spawnEnemy = () => {
    setEnemies((prev) => {
      if (prev.length >= GAME_CONFIG.MAX_ACTIVE_ENEMIES) return prev;

      const lane = Math.floor(Math.random() * GAME_CONFIG.LANES);

      const newEnemy = {
        id: enemyIdCounter.current++,
        lane,
        x: GAME_CONFIG.ENEMY_START_X,
        y: lane * GAME_CONFIG.LANE_HEIGHT + GAME_CONFIG.LANE_HEIGHT / 2,
        speed: 1.6
      };

      return [...prev, newEnemy];
    });
  };

  // ==================== MOSTRAR PREGUNTA ====================
  const showQuestion = () => {
    const q = FINANCE_QUESTIONS[Math.floor(Math.random() * FINANCE_QUESTIONS.length)];
    setCurrentQuestion(q);
    setQuestionTime(GAME_CONFIG.QUESTION_TIME);
    setSelectedAnswer(null);
    setShowResult(false);
    setGamePhase('question');
    clearInterval(spawnIntervalRef.current); // pausa spawn mientras respondes
  };

  // ==================== GAME LOOP (colisión por X/Y) ====================
  useEffect(() => {
    if (gamePhase !== 'playing') {
      clearInterval(gameLoopRef.current);
      clearInterval(spawnIntervalRef.current);
      return;
    }

    // spawn de enemigos
    spawnIntervalRef.current = setInterval(spawnEnemy, GAME_CONFIG.SPAWN_INTERVAL);

    gameLoopRef.current = setInterval(() => {
      // posición "real" del centro del jugador en Y
      const playerCenterY =
        playerLane * GAME_CONFIG.LANE_HEIGHT + GAME_CONFIG.LANE_HEIGHT / 2;

      setEnemies((prevEnemies) => {
        const updatedEnemies = [];
        let passedThisFrame = 0;
        let collidedThisFrame = false;

        for (const enemy of prevEnemies) {
          // --- COLISIÓN ---
          const distX = Math.abs(enemy.x - GAME_CONFIG.DEFENDER_X);
          const distY = Math.abs(enemy.y - playerCenterY);

          // hitbox amplio para que se sienta natural
          if (!collidedThisFrame && distX < 80 && distY < 80) {
            collidedThisFrame = true;
            setEnemiesKilledCount((prev) => prev + 1);

            // Disparamos la pregunta justo después de terminar este ciclo de render
            setTimeout(() => {
              // solo si seguimos jugando
              setGamePhase((phase) => {
                if (phase !== 'playing') return phase;
                showQuestion();
                return 'question';
              });
            }, 0);

            // este enemigo desaparece
            continue;
          }

          // --- MOVIMIENTO NORMAL ---
          const newX = enemy.x - enemy.speed;

          // Si sale de la pantalla por la izquierda => suma a "pasados"
          if (newX < -40) {
            passedThisFrame += 1;
          } else {
            updatedEnemies.push({ ...enemy, x: newX });
          }
        }

        // Máximo 1 vida perdida por frame (evita sensación de "me quitó 2 de una")
        if (passedThisFrame > 0) {
          setEnemiesPassedCount((prev) => prev + Math.min(1, passedThisFrame));
        }

        return updatedEnemies;
      });
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoopRef.current);
      clearInterval(spawnIntervalRef.current);
    };
  }, [gamePhase, playerLane]);

  // ==================== TIMER DE PREGUNTA ====================
  useEffect(() => {
    if (gamePhase !== 'question') {
      clearInterval(questionTimerRef.current);
      return;
    }

    questionTimerRef.current = setInterval(() => {
      setQuestionTime((prev) => {
        if (prev <= 1) {
          clearInterval(questionTimerRef.current);
          handleAnswerSubmit(null); // sin respuesta → incorrecta
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(questionTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, currentQuestion]);

  // ==================== RESPUESTA ====================
  const handleAnswerSubmit = (answerIndex) => {
    clearInterval(questionTimerRef.current);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion?.correct;

    if (isCorrect) {
      const newCount = correctAnswers + 1;
      setCorrectAnswers(newCount);

      if (newCount >= GAME_CONFIG.QUESTIONS_TO_WIN) {
        setTimeout(() => setGamePhase('victory'), 1500);
        return;
      }
    } else {
      setGameTime((prev) => Math.max(0, prev - GAME_CONFIG.TIME_PENALTY));
    }

    setTimeout(() => {
      setCurrentQuestion(null);
      setSelectedAnswer(null);
      setShowResult(false);
      setGamePhase('playing');
    }, 1500);
  };

  // ==================== DERROTA POR VIDAS ====================
  useEffect(() => {
    if (gamePhase === 'playing' && enemiesPassedCount >= GAME_CONFIG.MAX_ENEMIES_PASSED) {
      setGamePhase('defeat');
    }
  }, [enemiesPassedCount, gamePhase]);

  // ==================== TIMER GLOBAL ====================
  useEffect(() => {
    if (gamePhase !== 'playing') {
      clearInterval(globalTimerRef.current);
      return;
    }

    globalTimerRef.current = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          clearInterval(globalTimerRef.current);
          setGamePhase('defeat');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(globalTimerRef.current);
  }, [gamePhase]);

  const battlefieldHeight = GAME_CONFIG.LANES * GAME_CONFIG.LANE_HEIGHT;
  const livesLeft = Math.max(0, GAME_CONFIG.MAX_ENEMIES_PASSED - enemiesPassedCount);

  return (
    <div className="td-overlay">
      <div className="td-panel">
        {/* INTRO */}
        {gamePhase === 'intro' && (
          <div className="td-intro-content">
            <h2 className="td-intro-title">Torre de Defensa Financiera</h2>
            <p className="td-intro-description">
              Bloquea a los enemigos colocándote en su carril y responde las preguntas
              sobre finanzas personales. Tienes 3 vidas y {GAME_CONFIG.TOTAL_GAME_TIME} segundos.
            </p>
            <button className="td-start-button" onClick={startGame}>
              Comenzar Juego
            </button>
          </div>
        )}

        {/* JUEGO ACTIVO */}
        {(gamePhase === 'playing' || gamePhase === 'question') && (
          <>
            {/* HEADER */}
            <div className="td-header">
              <div className="td-header-left">
                <div className="td-stat">⏱ Tiempo: {gameTime}s</div>
                <div className="td-stat">
                  ✅ Correctas: {correctAnswers}/{GAME_CONFIG.QUESTIONS_TO_WIN}
                </div>
              </div>
              <div className="td-header-right">
                <div className="td-stat">❤️ Vidas: {livesLeft}</div>
                <button className="td-close-button" onClick={onClose}>
                  Salir ✖
                </button>
              </div>
            </div>

            {/* CAMPO */}
            <div
              className={`td-battlefield ${
                gamePhase === 'question' ? 'td-battlefield-blur' : ''
              }`}
              style={{
                width: GAME_CONFIG.GAME_WIDTH,
                height: battlefieldHeight,
                backgroundImage: `url(${mapSprite})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Carriles */}
              {[...Array(GAME_CONFIG.LANES)].map((_, i) => (
                <div
                  key={i}
                  className="td-lane"
                  style={{
                    height: GAME_CONFIG.LANE_HEIGHT,
                    top: i * GAME_CONFIG.LANE_HEIGHT
                  }}
                />
              ))}

              {/* Player */}
              <div
                className="td-player"
                style={{
                  left: GAME_CONFIG.DEFENDER_X,
                  top: playerLane * GAME_CONFIG.LANE_HEIGHT + 25
                }}
              >
                <img src={playerSprite} alt="player" className="td-player-img" />
              </div>

              {/* Enemigos */}
              {enemies.map((enemy) => (
                <div
                  key={enemy.id}
                  className="td-enemy"
                  style={{
                    left: enemy.x,
                    top: enemy.y - 25
                  }}
                >
                  <img src={enemySprite} alt="enemy" className="td-enemy-img" />
                </div>
              ))}
            </div>

            {/* PREGUNTA (MODAL) */}
            {gamePhase === 'question' && currentQuestion && (
              <div className="td-question-overlay">
                <div className="td-question-panel">
                  <div className="td-question-header">
                    <h3 className="td-question-title">❓ Pregunta</h3>
                    <div
                      className={`td-question-timer ${
                        questionTime <= 10 ? 'td-timer-warning' : ''
                      }`}
                    >
                      ⏰ {questionTime}s
                    </div>
                  </div>

                  <div className="td-question-text">{currentQuestion.question}</div>

                  <div className="td-options">
                    {currentQuestion.options.map((op, idx) => (
                      <button
                        key={idx}
                        disabled={showResult}
                        className={`td-option ${
                          showResult
                            ? idx === currentQuestion.correct
                              ? 'td-option-correct'
                              : idx === selectedAnswer
                              ? 'td-option-wrong'
                              : ''
                            : selectedAnswer === idx
                            ? 'td-option-selected'
                            : ''
                        }`}
                        onClick={() => !showResult && setSelectedAnswer(idx)}
                      >
                        {op}
                      </button>
                    ))}
                  </div>

                  {!showResult && (
                    <button
                      className="td-submit-button"
                      disabled={selectedAnswer === null}
                      onClick={() => handleAnswerSubmit(selectedAnswer)}
                    >
                      Confirmar Respuesta
                    </button>
                  )}

                  {showResult && (
                    <div className="td-result-message">
                      {selectedAnswer === currentQuestion.correct
                        ? '✅ ¡Correcto!'
                        : '❌ Incorrecto. Se te restan 10 segundos.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* VICTORIA */}
        {gamePhase === 'victory' && (
          <div className="td-end-screen">
            <h2>🏆 ¡Victoria financiera!</h2>
            <p>Respondiste correctamente {GAME_CONFIG.QUESTIONS_TO_WIN} preguntas.</p>
            <button className="td-end-button" onClick={onComplete}>
              Finalizar
            </button>
          </div>
        )}

        {/* DERROTA */}
        {gamePhase === 'defeat' && (
          <div className="td-end-screen">
            <h2>💔 Has perdido</h2>
            <p>Se acabó el tiempo o pasaron demasiados enemigos.</p>
            <button className="td-end-button" onClick={startGame}>
              Reintentar
            </button>
            <button className="td-end-button" onClick={onClose}>
              Salir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
