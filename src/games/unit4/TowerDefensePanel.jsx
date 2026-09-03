// src/games/unit4/TowerDefensePanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import './css/TowerDefensePanel.css';

// SPRITES
import mapSprite from '../../assets/unit4/map.png';
import playerSprite from '../../assets/unit4/player.png';
import enemySprite from '../../assets/unit4/enemy.png';
import { useDeviceMode } from '../../hooks/useDeviceMode';

// ==================== CONFIGURACIÓN DEL JUEGO ====================
const GAME_CONFIG = {
  LANES: 3,              // 3 carriles
  LANE_HEIGHT: 150,      // altura de cada carril (3 x 150 = 450px)
  GAME_WIDTH: 1100,
  GAME_HEIGHT: 450,
  DEFENDER_X: 150,
  ENEMY_START_X: 1060,
  SPAWN_INTERVAL: 1000,
  QUESTIONS_TO_WIN: 7,
  MAX_ENEMIES_PASSED: 6,
  QUESTION_TIME: 20,
  TOTAL_GAME_TIME: 100,
  TIME_PENALTY: 10,
  MAX_ACTIVE_ENEMIES: 5
};

// Offsets por carril para ajustar visualmente el centro
// índice 0 = carril de arriba, 1 = medio, 2 = abajo
const LANE_OFFSETS = [
  -12,  // arriba (casi como estaba)
  -20,  // medio: un poquito más arriba
  -24   // abajo: un poco más arriba aún
];

// devuelve el centro en Y del carril con su offset visual
const getLaneCenterY = (lane) =>
  lane * GAME_CONFIG.LANE_HEIGHT +
  GAME_CONFIG.LANE_HEIGHT / 2 +
  (LANE_OFFSETS[lane] ?? 0);

// ==================== PREGUNTAS ====================
const FINANCE_QUESTIONS = [
  // 1
  {
    question:
      '¿Qué es una meta financiera?',
    options: [
      'Un deseo general sin fecha',
      'Un objetivo claro de dinero con propósito y tiempo estimado',
      'Cualquier compra que haces en el mes',
      'El dinero que te sobra después de gastar'
    ],
    correct: 1
  },
  // 2
  {
    question:
      '¿Cuál de estos ejemplos es una meta financiera BIEN planteada?',
    options: [
      '“Algún día quiero tener plata”',
      '“Quiero ahorrar 150.000 pesos en 3 meses para unos tenis”',
      '“Quiero ser millonario pronto”',
      '“Quiero gastar menos en comida”'
    ],
    correct: 1
  },
  // 3
  {
    question:
      'Una meta de CORTO PLAZO normalmente se cumple en:',
    options: [
      'Unos días o pocos meses',
      'Entre 5 y 10 años',
      'Toda la vida',
      'Solo cuando te jubiles'
    ],
    correct: 0
  },
  // 4
  {
    question:
      'Una meta de LARGO PLAZO suele ser:',
    options: [
      'Comprar un snack hoy después de clase',
      'Ahorrar para un fondo de emergencia o una casa en varios años',
      'Pagar un pasaje de bus mañana',
      'Comprar un helado el fin de semana'
    ],
    correct: 1
  },
  // 5
  {
    question:
      'Carmina dice: “Quiero ahorrar 50.000 cada mes para tener 300.000 en 6 meses y pagar un curso”. Esta meta es:',
    options: [
      'Corto plazo, bien definida',
      'Largo plazo, sin sentido',
      'Una meta sin propósito',
      'Solo un deseo vago'
    ],
    correct: 0
  },
  // 6
  {
    question:
      '¿Cuál de estas metas es MÁS parecida a “algún día” y necesita mejor definición?',
    options: [
      '“Quiero ahorrar 500.000 en un año para un viaje corto”',
      '“Quiero hacer un fondo de emergencia de 3 meses de gastos en 3 años”',
      '“Quiero comprar una casa algún día cuando tenga plata”',
      '“Quiero ahorrar 100.000 este mes para un libro”'
    ],
    correct: 2
  },
  // 7
  {
    question:
      '¿Qué elemento NO puede faltar en una buena meta financiera?',
    options: [
      'Monto aproximado',
      'Plazo o tiempo para lograrla',
      'Propósito o para qué la quieres',
      'Que sea secreta y nadie la sepa'
    ],
    correct: 3
  },
  // 8
  {
    question:
      'Una decisión financiera RESPONSABLE se reconoce porque:',
    options: [
      'Solo busca placer inmediato',
      'Tiene en cuenta cómo afecta tus metas y tu presupuesto',
      'Ignora completamente tus metas',
      'Se basa en copiar lo que hacen los demás'
    ],
    correct: 1
  },
  // 9
  {
    question:
      'A Carmina le pagan un trabajo extra. ¿Cuál de estas decisiones la acerca más a una meta?',
    options: [
      'Gastarlo todo el mismo día en domicilios',
      'Separar una parte para su meta y luego decidir qué gastar',
      'Comprar algo grande a crédito sin revisar cuotas',
      'Prestar todo el dinero sin saber cuándo se lo devuelven'
    ],
    correct: 1
  },
  // 10
  {
    question:
      '¿Cuál de estas acciones es una decisión financiera RIESGOSA?',
    options: [
      'Revisar cuánto puedes ahorrar antes de gastar',
      'Endeudarte sin saber la tasa de interés ni el tiempo de pago',
      'Separar una parte fija de ahorro cada mes',
      'Comparar precios antes de comprar'
    ],
    correct: 1
  },
  // 11
  {
    question:
      '“Gastar primero y ahorrar solo si sobra algo” es un hábito que normalmente:',
    options: [
      'Te ayuda a cumplir metas muy rápido',
      'Te aleja de tus metas porque casi nunca sobra',
      'Es la mejor forma de organizar el dinero',
      'Solo sirve si ganas mucho dinero'
    ],
    correct: 1
  },
  // 12
  {
    question:
      '¿Qué suele pasar cuando tomas muchas decisiones impulsivas con tu dinero?',
    options: [
      'Te sobran recursos para metas grandes',
      'Es más difícil saber en qué se fue tu plata y cumplir metas',
      'Siempre llegas con más saldo a fin de mes',
      'Pagas menos en intereses'
    ],
    correct: 1
  },
  // 13
  {
    question:
      'Carmina recibe 300.000 pesos. Quiere ahorrar para unos audífonos y también comer fuera. ¿Qué opción es más responsable?',
    options: [
      'Gastar todo en salidas y dejar los audífonos para “después”',
      'Comprar los audífonos a crédito sin revisar cuotas',
      'Primero separar lo que necesita para su meta y luego destinar una parte a gustos',
      'Prestar todo el dinero a un amigo'
    ],
    correct: 2
  },
  // 14
  {
    question:
      '¿Cuál de estas frases muestra mejor que una decisión afecta tus metas?',
    options: [
      '“Da igual, solo es plata”',
      '“Si compro esto ahora, tardaré más en llegar a mi meta”',
      '“Lo pago y luego veo qué hago”',
      '“Gasto sin pensar para no estresarme”'
    ],
    correct: 1
  },
  // 15
  {
    question:
      'Tener un pequeño fondo de emergencia sirve para:',
    options: [
      'Gastar más en gustos',
      'Cubrir imprevistos sin destruir tus metas principales',
      'Endeudarte más rápido',
      'Evitar que ahorres para otras cosas'
    ],
    correct: 1
  },
  // 16
  {
    question:
      '¿Cuál de estos ejemplos corresponde mejor a una meta de CORTO PLAZO?',
    options: [
      'Ahorrar 100.000 este mes para un libro',
      'Tener casa propia en 20 años',
      'Juntar dinero para la jubilación',
      'Vivir sin trabajar nunca más'
    ],
    correct: 0
  },
  // 17
  {
    question:
      '¿Cuál de estos ejemplos es claramente una meta de LARGO PLAZO?',
    options: [
      'Ahorrar para pagar un servicio de este mes',
      'Ahorrar 1.000.000 en 4 semanas',
      'Crear un fondo de emergencia de 3 meses de gastos en 3 años',
      'Comprar un snack después de clase'
    ],
    correct: 2
  },
  // 18
  {
    question:
      'Si tu meta es pagar la inscripción a un curso en 2 meses, lo más adecuado es:',
    options: [
      'Esperar al último día y ver si tienes dinero',
      'Hacer un plan para ahorrar una parte cada mes',
      'Pedir un préstamo sin revisar intereses',
      'Gastar todo y confiar en que “algo aparecerá”'
    ],
    correct: 1
  },
  // 19
  {
    question:
      '¿Qué ventaja tiene escribir tus metas financieras?',
    options: [
      'No sirve de nada, solo ocupa espacio',
      'Te ayuda a recordarlas, organizarlas y medir tu progreso',
      'Te obliga a gastar más',
      'Solo funciona si ganas mucho dinero'
    ],
    correct: 1
  },
  // 20
  {
    question:
      'Carmina dice: “Quiero ahorrar para un viaje, pero no sé cuánto cuesta ni cuándo quiero ir”. El problema principal es:',
    options: [
      'Que es muy caro viajar',
      'Que la meta no tiene monto ni plazo definidos',
      'Que ahorrar está mal',
      'Que el viaje no es importante'
    ],
    correct: 1
  },
  // 21
  {
    question:
      '¿Cuál es una buena práctica al recibir dinero (salario, mesada o pago de trabajo)?',
    options: [
      'Gastar todo primero y luego ver si ahorras',
      'Separar de entrada una parte para tus metas y otra para gastos',
      'No pensar en tus metas hasta fin de mes',
      'Usar todo para pagar deudas ajenas'
    ],
    correct: 1
  },
  // 22
  {
    question:
      'Si siempre pagas solo la cuota mínima de una deuda sin revisar intereses ni tiempo de pago, normalmente:',
    options: [
      'Sales de la deuda muy rápido',
      'Terminas pagando más dinero y tardas mucho en salir',
      'Te bajan los intereses a cero',
      'No afecta en nada tus metas'
    ],
    correct: 1
  },
  // 23
  {
    question:
      '¿Qué hábito te ayuda a entender mejor a dónde se va tu dinero?',
    options: [
      'Nunca revisar tu estado de cuenta',
      'Llevar un registro simple de ingresos y gastos',
      'Guardar todos los recibos en una caja sin mirarlos',
      'Evitar pensar en dinero para no estresarte'
    ],
    correct: 1
  },
  // 24
  {
    question:
      'La frase “cada peso que entra tiene una tarea” significa que:',
    options: [
      'Todo el dinero debe gastarse de inmediato',
      'Debes asignar tu dinero a categorías: metas, gastos necesarios y gustos',
      'No puedes disfrutar nunca tu dinero',
      'Solo debes pensar en metas grandes'
    ],
    correct: 1
  },
  // 25
  {
    question:
      'Si tu meta de corto plazo ya está por cumplirse, una buena idea es:',
    options: [
      'Olvidarte de todas las demás metas',
      'Usar la misma disciplina para empezar otra meta',
      'Gastar todo de inmediato en algo distinto',
      'Dejar de revisar tu presupuesto'
    ],
    correct: 1
  },
  // 26
  {
    question:
      '¿Cuál de estas acciones te aleja de tus metas financieras?',
    options: [
      'Revisar tus metas una vez al mes',
      'Hacer pequeños ajustes a tus gastos para seguir ahorrando',
      'Tomar de tu ahorro para compras impulsivas que no planeaste',
      'Separar una parte fija de ahorro apenas te pagan'
    ],
    correct: 2
  },
  // 27
  {
    question:
      'Carmina quiere tener un fondo de emergencia y una meta para estudiar. ¿Qué sería un buen enfoque?',
    options: [
      'Ignorar el fondo de emergencia y solo pensar en estudiar',
      'Organizar sus metas por prioridad y tiempo, y avanzar poco a poco en ambas',
      'Esperar a ganar mucho dinero para recién empezar',
      'Cambiar de meta cada semana'
    ],
    correct: 1
  },
  // 28
  {
    question:
      '¿Qué ayuda a que una meta financiera NO se quede solo en un sueño?',
    options: [
      'Repetirla muchas veces sin hacer nada',
      'Convertirla en un plan con monto, tiempo y pasos concretos',
      'Esperar a que alguien más la cumpla por ti',
      'Confiar solo en la suerte'
    ],
    correct: 1
  },
  // 29
  {
    question:
      'Si te cuesta mucho ahorrar, una estrategia sencilla puede ser:',
    options: [
      'Guardar solo lo que sobre a fin de mes',
      'Empezar con montos pequeños pero constantes',
      'Esperar a ganar el doble para recién empezar',
      'Endeudarte más para obligarte a ahorrar'
    ],
    correct: 1
  },
  // 30
  {
    question:
      'La idea principal de este módulo sobre finanzas y metas es que:',
    options: [
      'El dinero solo sirve para gastar rápido',
      'Tus decisiones diarias con el dinero pueden acercarte o alejarte de tus metas',
      'Ahorrar es imposible para la mayoría de personas',
      'Las metas financieras deben ser secretas'
    ],
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
  const [, setEnemiesKilledCount] = useState(0);
  const [gameTime, setGameTime] = useState(GAME_CONFIG.TOTAL_GAME_TIME);

  const { isMobile } = useDeviceMode();
  const battlefieldScale = isMobile ? 1.08 : 1;

  const gameLoopRef = useRef(null);
  const spawnIntervalRef = useRef(null);
  const questionTimerRef = useRef(null);
  const globalTimerRef = useRef(null);
  const enemyIdCounter = useRef(0);
  const battlefieldRef = useRef(null);

  // ref para saber la fase dentro del intervalo global
  const phaseRef = useRef(gamePhase);
  useEffect(() => {
    phaseRef.current = gamePhase;
  }, [gamePhase]);

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
        // centro alineado con su carril usando la función
        y: getLaneCenterY(lane),
        speed: 1.6
      };

      return [...prev, newEnemy];
    });
  };

  // ==================== MOSTRAR PREGUNTA ====================
  const showQuestion = () => {
    const q =
      FINANCE_QUESTIONS[Math.floor(Math.random() * FINANCE_QUESTIONS.length)];
    setCurrentQuestion(q);
    setQuestionTime(GAME_CONFIG.QUESTION_TIME);
    setSelectedAnswer(null);
    setShowResult(false);
    setGamePhase('question');
    clearInterval(spawnIntervalRef.current); // pausa spawn mientras respondes
  };


  const handleBattlefieldClick = (e) => {
    // Solo tiene sentido si estamos jugando
    if (gamePhase !== 'playing') return;
    if (!battlefieldRef.current) return;

    const pointer =
      'touches' in e && e.touches?.length
        ? e.touches[0]
        : e;

    if (isMobile && 'touches' in e) {
      e.preventDefault();
    }

    const rect = battlefieldRef.current.getBoundingClientRect();
    const relativeY = (pointer.clientY - rect.top) / battlefieldScale;

    // Altura real de cada carril según el DOM (respeta el escalado en CSS)
    const laneHeight = (rect.height / battlefieldScale) / GAME_CONFIG.LANES;

    let laneIndex = Math.floor(relativeY / laneHeight);

    // Clamp entre 0 y LANES - 1
    if (laneIndex < 0) laneIndex = 0;
    if (laneIndex > GAME_CONFIG.LANES - 1) laneIndex = GAME_CONFIG.LANES - 1;

    setPlayerLane(laneIndex);
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
      // centro del jugador, usando también el offset por carril
      const playerCenterY = getLaneCenterY(playerLane);

      setEnemies((prevEnemies) => {
        const updatedEnemies = [];
        let passedThisFrame = 0;
        let collidedThisFrame = false;

        for (const enemy of prevEnemies) {
          // --- COLISIÓN ---
          const distX = Math.abs(enemy.x - GAME_CONFIG.DEFENDER_X);
          const distY = Math.abs(enemy.y - playerCenterY);

          if (!collidedThisFrame && distX < 80 && distY < 80) {
            collidedThisFrame = true;
            setEnemiesKilledCount((prev) => prev + 1);

            // Disparamos la pregunta justo después de terminar este ciclo
            setTimeout(() => {
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

        // Máximo 1 vida perdida por frame
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

  // ==================== TIMER GLOBAL (pausado en preguntas) ====================
  useEffect(() => {
    globalTimerRef.current = setInterval(() => {
      // solo descuenta tiempo cuando estamos en "playing"
      if (phaseRef.current !== 'playing') return;

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
  }, []);

  const battlefieldHeight = GAME_CONFIG.LANES * GAME_CONFIG.LANE_HEIGHT; // 450
  const livesLeft = Math.max(0, GAME_CONFIG.MAX_ENEMIES_PASSED - enemiesPassedCount);

  return (
  <div className="unit4-game-container td-tower-defense-container">
      <div className="td-overlay">
      <div className="td-panel minigame-container td-tower-defense-panel">
          {/* INTRO */}
          {gamePhase === 'intro' && (
            <div className="td-intro-content">
              <h2 className="td-intro-title">Torre de Defensa Financiera</h2>
              <p className="td-intro-description">
                Bloquea a los enemigos colocándote en su carril y responde las preguntas
                sobre pagos digitales seguros. Tienes varias vidas y{' '}
                {GAME_CONFIG.TOTAL_GAME_TIME} segundos.
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
                ref={battlefieldRef}                    // 👈 IMPORTANTE
                className={`td-battlefield ${
                  gamePhase === 'question' ? 'td-battlefield-blur' : ''
                } ${isMobile ? 'td-battlefield--mobile' : ''}`}
                style={{
                  width: GAME_CONFIG.GAME_WIDTH,
                  height: battlefieldHeight,
                  backgroundImage: `url(${mapSprite})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  transform: battlefieldScale !== 1 ? `scale(${battlefieldScale})` : 'none',
                  transformOrigin: 'center top',
                }}
                onClick={handleBattlefieldClick}
                onTouchStart={handleBattlefieldClick}
              >

                {/* Carriles (solo líneas de referencia) */}
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
                    top: getLaneCenterY(playerLane)
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
                      top: enemy.y
                    }}
                  >
                    <img src={enemySprite} alt="enemy" className="td-enemy-img" />
                  </div>
                ))}
              </div>

              {/* PREGUNTA (MODAL) */}
              {gamePhase === 'question' && currentQuestion && (
                <div className="td-question-overlay">
                  <div className={`td-question-panel ${isMobile ? 'td-question-panel--mobile' : ''}`}>
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

                    <div className={`td-question-body ${isMobile ? 'td-question-body--mobile' : ''}`}>
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

                      {showResult && (
                        <div className="td-result-message">
                          {selectedAnswer === currentQuestion.correct
                            ? '✅ ¡Correcto!'
                            : '❌ Incorrecto. Se te restan 10 segundos.'}
                        </div>
                      )}
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
              <button
                className="td-end-button"
                onClick={() => onComplete?.({
                  passed: true,
                  score: correctAnswers,
                  total: GAME_CONFIG.QUESTIONS_TO_WIN,
                })}
              >
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
    </div>
  );
}
