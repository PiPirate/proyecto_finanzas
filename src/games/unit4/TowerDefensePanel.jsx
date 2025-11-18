// src/games/unit4/TowerDefensePanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import './css/TowerDefensePanel.css';

// SPRITES
import mapSprite from '../../assets/unit4/map.png';
import playerSprite from '../../assets/unit4/player.png';
import enemySprite from '../../assets/unit4/enemy.png';

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
  TOTAL_GAME_TIME: 120,
  TIME_PENALTY: 10,
  MAX_ACTIVE_ENEMIES: 4
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
      'Antes de pagar con un código QR en una cafetería, ¿qué es lo MÁS importante revisar en la app antes de confirmar?',
    options: [
      'Que el QR tenga un diseño bonito',
      'Que el nombre del comercio y el valor del consumo sean correctos',
      'Que el QR esté en blanco y negro',
      'Que el QR tenga emojis o mensajes de promoción'
    ],
    correct: 1
  },
  // 2
  {
    question:
      'Ves un QR pegado ENCIMA de otro, con un papel torcido. El mesero no sabe quién lo pegó. ¿Qué deberías hacer?',
    options: [
      'Escanearlo rápido para terminar',
      'Tomar una foto y pagar más tarde',
      'No escanearlo y avisar al personal del local',
      'Escanearlo solo si nadie está mirando'
    ],
    correct: 2
  },
  // 3
  {
    question:
      'Te envían por WhatsApp un QR diciendo: “Paga aquí tu consumo, 10% de descuento si lo haces YA”. No es el chat oficial del negocio. ¿Qué tan confiable es?',
    options: [
      'Seguro, porque ofrece descuento',
      'Seguro, si el QR tiene el logo del banco',
      'Sospechoso, puede ser un intento de fraude',
      'Confiable solo si está en alta resolución'
    ],
    correct: 2
  },
  // 4
  {
    question:
      'En la barra del local hay un QR dentro de un acrílico con el logo oficial, y la app muestra el nombre correcto de la cafetería y el valor de tu consumo. Esto indica que:',
    options: [
      'Siempre tendrás cashback extra',
      'Probablemente sea un pago seguro',
      'Es obligatorio pagar con tarjeta física',
      'El QR está caducado y no sirve'
    ],
    correct: 1
  },
  // 5
  {
    question:
      'Si vas a escanear un QR para pagar, ¿qué acción es la MÁS segura?',
    options: [
      'Pedir al mesero que te reenvíe el QR por su WhatsApp personal',
      'Escanear cualquier QR visible en la mesa',
      'Pedir que te muestren el QR oficial del local y verificar en la app',
      'Hacer captura de pantalla del QR y compartirla con amigos'
    ],
    correct: 2
  },
  // 6
  {
    question:
      'Al escanear un QR, tu app muestra un nombre de comercio totalmente distinto al local donde estás. ¿Qué haces?',
    options: [
      'Pagas igual, seguro es una empresa asociada',
      'Pagas solo si el monto es pequeño',
      'Cancelas el pago y consultas al personal del local',
      'Intentas pagar varias veces hasta que cambie el nombre'
    ],
    correct: 2
  },
  // 7
  {
    question:
      '¿Cuál es una señal CLARA de que un QR puede ser trampa?',
    options: [
      'Está impreso en papel normal',
      'Está dentro de un acrílico limpio',
      'Está pegado encima de otro QR o sobre un aviso viejo',
      'Está cerca de la caja registradora'
    ],
    correct: 2
  },
  // 8
  {
    question:
      'En un cartel ves: “Escanea este QR para pagar más rápido, no hace falta revisar en la app”. ¿Qué deberías recordar?',
    options: [
      'Siempre debes revisar los datos en la app ANTES de confirmar',
      'Si el cartel es grande, no hay problema',
      'Mientras haya fila, es mejor confiar',
      'Si hay cámaras, no pueden estafarte'
    ],
    correct: 0
  },
  // 9
  {
    question:
      '¿Cuál de los siguientes es un BUEN hábito al usar QRs para pagar?',
    options: [
      'Guardar cualquier QR en tu galería para usarlo después',
      'Escanear solo QRs que envíen por grupos de redes sociales',
      'Verificar el nombre del comercio y el valor en la app bancaria',
      'Confiar en QRs que prometen regalos instantáneos'
    ],
    correct: 2
  },
  // 10
  {
    question:
      'Te llega un SMS: “Detectamos un ingreso sospechoso en tu cuenta. Entra YA a: http://bit.ly/seguro-banco-2024”. ¿Qué es lo más probable?',
    options: [
      'Es una actualización oficial del banco',
      'Es un intento de phishing usando un enlace acortado',
      'Es una encuesta de satisfacción segura',
      'Es solo publicidad, siempre es inofensiva'
    ],
    correct: 1
  },
  // 11
  {
    question:
      '¿Qué característica suele tener un enlace FRAUDULENTO?',
    options: [
      'Dominio muy corto y simple como “banco.com”',
      'Usar solo letras minúsculas sin números',
      'Mezclar letras y números raros para imitar un banco (ej. banc0-seguro.com)',
      'Tener un candado en el navegador'
    ],
    correct: 2
  },
  // 12
  {
    question:
      'Un mensaje dice: “Actualiza tu app bancaria desde este link especial para clientes VIP”. ¿Cuál es la opción segura?',
    options: [
      'Actualizar siempre desde la tienda oficial (Play Store / App Store)',
      'Actualizar desde cualquier link si viene por correo',
      'Actualizar solo si el link tiene muchas mayúsculas',
      'Nunca actualizar la app bancaria'
    ],
    correct: 0
  },
  // 13
  {
    question:
      '¿Por qué los delincuentes usan mensajes de URGENCIA como “en 10 minutos se bloquea tu cuenta”?',
    options: [
      'Para ayudarte a actuar más rápido y ahorrar tiempo',
      'Para que pienses con calma antes de hacer clic',
      'Para meter presión y que tomes decisiones sin verificar',
      'Porque así funcionan todos los bancos'
    ],
    correct: 2
  },
  // 14
  {
    question:
      'Si recibes un correo diciendo “tu cuenta será cerrada hoy, entra al siguiente link para evitarlo”, lo más prudente es:',
    options: [
      'Hacer clic de inmediato para no perder la cuenta',
      'Responder al correo con tus datos personales',
      'Ignorar el mensaje y entrar tú mismo desde la app o web oficial del banco',
      'Reenviar el correo a todos tus contactos para advertirles'
    ],
    correct: 2
  },
  // 15
  {
    question:
      '¿Cuál de estos enlaces se ve MÁS confiable a simple vista?',
    options: [
      'https://app-banc0-premios-rapidos.club',
      'http://bit.ly/ganar-dinero-banco',
      'https://www.bancoandino.com/usuarios',
      'https://bancoand1no-seguro.net'
    ],
    correct: 2
  },
  // 16
  {
    question:
      'Cuando recibes un enlace “sospechoso” en un chat, ¿qué deberías evitar?',
    options: [
      'Eliminar el mensaje',
      'Revisar primero con el banco por sus canales oficiales',
      'Compartirlo en grupos para preguntar si alguien ya entró',
      'Ignorarlo si viene de un número desconocido'
    ],
    correct: 2
  },
  // 17
  {
    question:
      '¿Qué información NUNCA debes ingresar en una página que te llegó por un link dudoso?',
    options: [
      'Tu apodo o nickname',
      'Tu color favorito',
      'Tus datos de tarjeta, claves o tokens de seguridad',
      'El nombre de tu banco'
    ],
    correct: 2
  },
  // 18
  {
    question:
      'Estás en una computadora pública y quieres revisar tu banca en línea. ¿Qué es lo más recomendable?',
    options: [
      'Guardar tu clave en el navegador para no olvidarla',
      'Usar solo el modo incógnito y luego cerrar sesión',
      'Dejar la sesión abierta para consultar rápido luego',
      'Tomar foto a la pantalla con tus datos por si los pierdes'
    ],
    correct: 1
  },
  // 19
  {
    question:
      'Si un mensaje te pide “enviar captura de tu app bancaria para verificar un pago”, lo más probable es que:',
    options: [
      'Sea un requisito normal del banco',
      'Quieran ayudarte a actualizar la app',
      'Estén intentando ver datos sensibles de tus movimientos',
      'Solo necesiten tu foto de perfil'
    ],
    correct: 2
  },
  // 20
  {
    question:
      '¿Cuál es una buena práctica al usar pagos con QR y links?',
    options: [
      'Conectarse a cualquier WiFi abierto sin clave',
      'Revisar que la red WiFi sea conocida y, si se puede, usar datos móviles',
      'Compartir tu clave bancaria por si falla el internet',
      'Aceptar todas las notificaciones de páginas desconocidas'
    ],
    correct: 1
  },
  // 21
  {
    question:
      'La app de tu banco te pide actualizar y ves el aviso dentro de la misma app, que te lleva a la tienda oficial. Esto suele ser:',
    options: [
      'Una estafa segura',
      'Un procedimiento normal y seguro',
      'Solo publicidad sin importancia',
      'Una invitación a un sorteo'
    ],
    correct: 1
  },
  // 22
  {
    question:
      '¿Qué significa el ícono de candado junto a la dirección web (https)?',
    options: [
      'Que la página es 100% legítima',
      'Que la conexión está cifrada, pero igual debes revisar si el sitio es el oficial',
      'Que puedes escribir tus claves sin pensar',
      'Que la página pertenece a un banco'
    ],
    correct: 1
  },
  // 23
  {
    question:
      'Te llega un mensaje de “soporte bancario” desde un número de celular informal. Te piden que envíes tu código SMS para “verificar tu cuenta”. ¿Qué haces?',
    options: [
      'Enviar el código para que te ayuden',
      'Llamar al número para confirmar',
      'No compartir el código y contactar al banco por sus canales oficiales',
      ' reenviar el código a tus amigos por seguridad'
    ],
    correct: 2
  },
  // 24
  {
    question:
      '¿Cuál de estas acciones ayuda a mantener seguros tus pagos digitales?',
    options: [
      'Instalar apps bancarias desde páginas de terceros',
      'Mantener la app bancaria actualizada desde la tienda oficial',
      'Desactivar las notificaciones del banco',
      'Prestar tu celular desbloqueado a cualquiera'
    ],
    correct: 1
  },
  // 25
  {
    question:
      'Si al abrir un enlace el navegador te muestra muchas ventanas emergentes raras y te pide descargar archivos desconocidos, lo más prudente es:',
    options: [
      'Descargar todo rápido y luego revisar',
      'Cerrar la página y no descargar nada',
      'Compartir el archivo con tus contactos',
      'Permitir todas las notificaciones que pida'
    ],
    correct: 1
  },
  // 26
  {
    question:
      '¿Qué es mejor al recibir un mensaje sobre un pago o premio “del banco” que no esperabas?',
    options: [
      'Confiar si el mensaje tiene tu nombre completo',
      'Hacer clic al link y revisar luego con calma',
      'Desconfiar y verificar tú mismo entrando a la app o web oficial',
      'Responder con tus datos para que te ubiquen'
    ],
    correct: 2
  },
  // 27
  {
    question:
      'Escaneas un QR en el local y el valor que aparece en la app es mucho MAYOR que tu consumo. ¿Qué debes hacer?',
    options: [
      'Pagar igual, quizá incluye propina automática',
      'Cancelar el pago y avisar inmediatamente al local',
      'Dividir el monto con tus amigos',
      'Hacer captura y pagar más tarde'
    ],
    correct: 1
  },
  // 28
  {
    question:
      '¿Cuál de estos ejemplos describe mejor un “link confiable”?',
    options: [
      'Te llega por mensaje de un número desconocido con muchas faltas de ortografía',
      'Proviene de un anuncio que promete dinero fácil si haces clic',
      'Es el enlace que encuentras al buscar el nombre oficial del banco en la tienda de apps',
      'Es un link acortado que no sabes a dónde lleva'
    ],
    correct: 2
  },
  // 29
  {
    question:
      'Cuando uses pagos con QR en un lugar nuevo, una buena idea adicional es:',
    options: [
      'Preguntar si aceptan solo efectivo para evitar problemas',
      'Pedir al personal que confirme cuál es el QR correcto del local',
      'Escanear cualquier QR visible en la pared',
      'Pedir que te envíen el QR por mensaje de un número personal'
    ],
    correct: 1
  },
  // 30
  {
    question:
      'Si tienes dudas sobre un mensaje, QR o link relacionado con tu dinero, la MEJOR regla general es:',
    options: [
      'Actuar rápido antes de perder la oferta',
      'Confiar si lleva logos de bancos o emojis',
      'No hacer clic ni pagar hasta verificar por un canal oficial',
      'Probar primero con un pago pequeño para “testear”'
    ],
    correct: 2
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

  const battlefieldHeight = GAME_CONFIG.LANES * GAME_CONFIG.LANE_HEIGHT; // 450
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
              sobre finanzas personales. Tienes varias vidas y{' '}
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
              className={`td-battlefield ${
                gamePhase === 'question' ? 'td-battlefield-blur' : ''
              }`}
              style={{
                width: GAME_CONFIG.GAME_WIDTH,
                height: battlefieldHeight,
                backgroundImage: `url(${mapSprite})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
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
