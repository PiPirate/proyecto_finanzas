// src/components/EvaluationStage.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EvaluationStage.css';

// Ajusta estos nombres/rutas a tus archivos reales
import pigFighter from '../../assets/unit1/pig.png';
import enemyFighter from '../../assets/unit1/cat.png';
import fightBg from '../../assets/unit1/fondo.png';

const MAX_HEALTH = 100;
const QUESTION_TIME = 12; // segundos por pregunta

// Preguntas de evaluación tipo “decisión”
const evaluationQuestions = [
  {
    id: 'q1',
    context:
      'Tienes una meta de ahorrar 300.000 en 3 meses para un curso que te interesa mucho.',
    question:
      'La propuesta es: “Guardarás 100.000 cada mes y lo anotarás en tu presupuesto para hacerle seguimiento”.',
    correctDecision: 'accept', // Aceptar la propuesta es la decisión correcta
    feedback: {
      accept:
        'Exacto. Una meta clara tiene monto, plazo y un plan en el presupuesto. Así sabes si vas bien o te estás quedando atrás.',
      doubt:
        'Dudar puede hacer que la dejes para “después” y pierdas claridad sobre cuánto debes guardar cada mes.',
      reject:
        'Si rechazas esta propuesta, tu meta se vuelve vaga otra vez y es más difícil organizar tu ahorro.',
    },
    feedbackTimeout:
      'Al dejar pasar el tiempo sin decidir, tu meta sigue sin un plan concreto y se hace más difícil de alcanzar.',
  },
  {
    id: 'q2',
    context:
      'Ya tienes tu presupuesto hecho y aparece una salida muy cara de último minuto que no estaba planeada.',
    question:
      'La propuesta es: “Dices que sí de una vez, sin revisar tu presupuesto ni tu meta de ahorro”.',
    correctDecision: 'reject', // Lo sano es rechazar esa forma impulsiva
    feedback: {
      accept:
        'Si aceptas sin revisar tu presupuesto, es fácil que termines desordenando tu meta sin darte cuenta.',
      doubt:
        'Dudar está bien, pero lo ideal es rechazar esa forma impulsiva y revisar primero tu presupuesto.',
      reject:
        'Bien. Rechazas la idea de decir que sí sin pensar. Primero va tu meta y tu presupuesto, luego decides si el gasto vale la pena.',
    },
    feedbackTimeout:
      'Al no decidir, es posible que termines diciendo que sí por presión del momento, afectando tu presupuesto sin plan.',
  },
  {
    id: 'q3',
    context:
      'Encuentras 20.000 pesos en un bolsillo que no recordabas, y tus gastos básicos ya están cubiertos.',
    question:
      'La propuesta es: “Guardar esos 20.000 de una vez en tu alcancía o cuenta de ahorro de la meta”.',
    correctDecision: 'accept',
    feedback: {
      accept:
        'Buen movimiento. Es dinero que no esperabas y que puede acercarte a tu meta sin sacrificar nada.',
      doubt:
        'Dudar mucho hace que el dinero quede flotando sin plan, y es fácil que termine gastándose en cualquier cosa.',
      reject:
        'Si rechazas la idea de guardarlos, probablemente se irán en pequeños gastos que ni recordarás.',
    },
    feedbackTimeout:
      'Al no decidir, el dinero se queda sin plan. Es muy probable que acabe gastándose sin aportar a tu meta.',
  },
  {
    id: 'q4',
    context:
      'Te faltan pocas semanas para la fecha de tu meta y aún no has llegado al monto que querías.',
    question:
      'La propuesta es: “Durante estos días reducirás algunos antojitos y pequeños gastos para aumentar tu ahorro”.',
    correctDecision: 'accept',
    feedback: {
      accept:
        'Justo. Pequeños ajustes constantes en el tramo final pueden marcar la diferencia para alcanzar tu meta.',
      doubt:
        'Dudar hace que sigas igual, y si no cambias nada, el resultado tampoco cambia.',
      reject:
        'Si rechazas esa idea, probablemente seguirás gastando igual y será más difícil acercarte a tu meta a tiempo.',
    },
    feedbackTimeout:
      'Al dejar pasar el tiempo sin decidir, pierdes la oportunidad de aprovechar estas semanas finales para ajustar y avanzar.',
  },
];

export default function EvaluationStage({ onComplete, unitColor }) {
  const navigate = useNavigate();

  const [playerHealth, setPlayerHealth] = useState(MAX_HEALTH);
  const [enemyHealth, setEnemyHealth] = useState(MAX_HEALTH);
  const [timer, setTimer] = useState(QUESTION_TIME);
  const [round, setRound] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [correctCount, setCorrectCount] = useState(0);

  const [pigHit, setPigHit] = useState(false);
  const [enemyHit, setEnemyHit] = useState(false);

  const [showResult, setShowResult] = useState(false);

  const question = useMemo(
    () => evaluationQuestions[currentIndex] || null,
    [currentIndex]
  );

  const totalQuestions = evaluationQuestions.length;
  const passThreshold = Math.ceil(totalQuestions * 0.6);
  const passed = correctCount >= passThreshold;

  // Reset de estado básico cada vez que cambia de pregunta
  useEffect(() => {
    if (!showResult) {
      setTimer(QUESTION_TIME);
      setSelectedDecision(null);
      setHasAnswered(false);
      setIsCorrect(null);
      setFeedback('');
    }
  }, [currentIndex, showResult]);

  // Manejo de avance automático a la siguiente pregunta o resultado final
  const goToNextOrFinish = useCallback(() => {
    if (currentIndex >= totalQuestions - 1) {
      setShowResult(true);
    } else {
      setRound((prev) => prev + 1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalQuestions]);

  // Resolución genérica de decisión (correcta / incorrecta / timeout)
  const resolveDecision = useCallback(
    (decisionKey, opts = { isTimeout: false }) => {
      if (!question || showResult) return;
      if (hasAnswered) return;

      const { isTimeout } = opts;
      const isDecisionCorrect =
        !isTimeout && decisionKey === question.correctDecision;

      setSelectedDecision(decisionKey);
      setHasAnswered(true);
      setIsCorrect(isDecisionCorrect);

      // Feedback
      if (isTimeout) {
        setFeedback(
          question.feedbackTimeout ||
            'Se acabó el tiempo; el gasto impulsivo te tomó por sorpresa.'
        );
      } else {
        const fb = question.feedback?.[decisionKey] || '';
        setFeedback(fb);
      }

      // Golpe / daño
      if (isDecisionCorrect) {
        setCorrectCount((prev) => prev + 1);
        setEnemyHealth((prev) => Math.max(0, prev - 30));
        setEnemyHit(true);
        setTimeout(() => setEnemyHit(false), 220);
      } else {
        setPlayerHealth((prev) => Math.max(0, prev - 30));
        setPigHit(true);
        setTimeout(() => setPigHit(false), 220);
      }

      // Avanza automáticamente tras un pequeño delay
      setTimeout(() => {
        setSelectedDecision(null);
        setHasAnswered(false);
        setIsCorrect(null);
        setFeedback('');

        if (currentIndex >= totalQuestions - 1) {
          setShowResult(true);
        } else {
          setRound((prev) => prev + 1);
          setCurrentIndex((prev) => prev + 1);
        }
      }, 900);
    },
    [question, showResult, hasAnswered, currentIndex, totalQuestions]
  );

  // Click en botón de decisión (Aceptar / Dudar / Rechazar)
  const handleDecisionClick = (decisionKey) => {
    if (!question || showResult) return;
    if (hasAnswered) return;
    resolveDecision(decisionKey, { isTimeout: false });
  };

  // Manejo de timeout (cuando el contador llega a 0)
  const handleTimeout = useCallback(() => {
    if (!question || showResult) return;
    if (hasAnswered) return;
    resolveDecision('timeout', { isTimeout: true });
  }, [question, showResult, hasAnswered, resolveDecision]);

  // Efecto para el contador de tiempo (ahora sí cuenta de verdad)
  useEffect(() => {
    if (showResult) return;
    if (!question) return;
    if (hasAnswered) return;

    if (timer <= 0) {
      handleTimeout();
      return;
    }

    const id = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timer, showResult, question, hasAnswered, handleTimeout]);

  const handleFinishEvaluation = () => {
    if (onComplete) {
      onComplete();
    }
    navigate('/');
  };

  const feedbackClass =
    hasAnswered && isCorrect != null
      ? isCorrect
        ? 'evaluation-feedback evaluation-feedback--correct'
        : 'evaluation-feedback evaluation-feedback--wrong'
      : 'evaluation-feedback';

  return (
    <div className="stage-container evaluation-stage">
      <div className="fighting-game-container">
        {/* HUD superior tipo arcade */}
        <div className="hud-top">
          {/* HUD Cerdito (Jugador) */}
          <div className="hud-section player1-hud">
            <div className="player-info">
              <div className="player-name">CERDITO AHORRO</div>
              <div className="player-portrait player-portrait--pig" />
            </div>

            <div className="health-bar-outer">
              <div className="health-bar-label">VIDA</div>
              <div className="health-bar-container">
                <div
                  className="health-bar-fill player1-fill"
                  style={{ width: `${playerHealth}%` }}
                >
                  <div className="health-bar-shine" />
                </div>
              </div>
            </div>
          </div>

          {/* Timer y round central */}
          <div className="hud-center">
            <div className="timer-container">
              <div className="timer-display">
                {timer >= 0 ? timer : 0}
              </div>
              <div className="timer-label">TIME</div>
            </div>
            <div className="round-display">
              <div className="round-text">ROUND</div>
              <div className="round-number">{round}</div>
            </div>
          </div>

          {/* HUD Enemigo */}
          <div className="hud-section player2-hud">
            <div className="player-info">
              <div className="player-portrait player-portrait--enemy" />
              <div className="player-name">GASTO IMPULSIVO</div>
            </div>

            <div className="health-bar-outer">
              <div className="health-bar-label health-bar-label--right">
                VIDA
              </div>
              <div className="health-bar-container reverse">
                <div
                  className="health-bar-fill player2-fill"
                  style={{ width: `${enemyHealth}%` }}
                >
                  <div className="health-bar-shine" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arena de pelea */}
        <div className="fighting-arena">
          <div className="background-image">
            <img
              src={fightBg}
              alt="Escenario"
              className="background-img"
            />
            <div className="arena-overlay" />
          </div>

          {/* Personajes */}
          <div className="characters-container">
            <div
              className={
                'character player1-character' +
                (pigHit ? ' character-hit-left' : '')
              }
            >
              <img
                src={pigFighter}
                alt="Cerdito peleador"
                className="character-sprite pig-sprite"
              />
            </div>

            <div
              className={
                'character player2-character' +
                (enemyHit ? ' character-hit-right' : '')
              }
            >
              <img
                src={enemyFighter}
                alt="Enemigo"
                className="character-sprite enemy-sprite"
              />
            </div>
          </div>

          {/* Mensaje central FIGHT / feedback dinámico corto */}
          {!showResult && (
            <div className="fight-messages">
              <div className="combo-display">
                {!hasAnswered
                  ? 'FIGHT!'
                  : isCorrect
                  ? '¡BUEN GOLPE!'
                  : '¡AY, ESE GASTO!'}
              </div>
            </div>
          )}

          {/* Panel de enunciado / resultado */}
          <div className="evaluation-question-panel">
            {!showResult && question && (
              <>
                <p className="question-step">
                  Pregunta {currentIndex + 1} de {totalQuestions}
                </p>
                <p className="question-context">
                  {question.context}
                </p>
                <p className="question-text">
                  {question.question}
                </p>
                <p className={feedbackClass}>{feedback}</p>
              </>
            )}

            {showResult && (
              <div className="evaluation-result-panel">
                <h2 className="evaluation-result-title">
                  {passed
                    ? '¡Victoria para la Alcancía!'
                    : 'Combate completo'}
                </h2>

                <p className="evaluation-result-text">
                  Respondiste correctamente {correctCount} de{' '}
                  {totalQuestions} rondas.
                  {passed
                    ? ' Tus decisiones muestran que entendiste cómo definir metas, usar el presupuesto y alimentar tu ahorro con pequeñas acciones.'
                    : ' Aun así, este combate te muestra en qué decisiones puedes mejorar para que tu ahorro sea más fuerte.'}
                </p>

                <p className="evaluation-result-text evaluation-result-text--secondary">
                  Recuerda: metas claras + presupuesto + decisiones
                  constantes son el combo que hace crecer tu cerdito,
                  no al gasto impulsivo.
                </p>

                <div className="evaluation-bottom-row">
                  <button
                    type="button"
                    className="evaluation-finish-btn"
                    onClick={handleFinishEvaluation}
                  >
                    Finalizar evaluación
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Barra inferior de botones arcade */}
          <div className="controls-bar">
            {!showResult && question && (
              <div className="evaluation-options">
                <button
                  type="button"
                  className={
                    'evaluation-option-btn evaluation-option-btn--reject' +
                    (selectedDecision === 'reject'
                      ? ' evaluation-option-btn--selected'
                      : '')
                  }
                  onClick={() => handleDecisionClick('reject')}
                  disabled={hasAnswered}
                >
                  Rechazar
                </button>

                <button
                  type="button"
                  className={
                    'evaluation-option-btn evaluation-option-btn--doubt' +
                    (selectedDecision === 'doubt'
                      ? ' evaluation-option-btn--selected'
                      : '')
                  }
                  onClick={() => handleDecisionClick('doubt')}
                  disabled={hasAnswered}
                >
                  Dudar
                </button>

                <button
                  type="button"
                  className={
                    'evaluation-option-btn evaluation-option-btn--accept' +
                    (selectedDecision === 'accept'
                      ? ' evaluation-option-btn--selected'
                      : '')
                  }
                  onClick={() => handleDecisionClick('accept')}
                  disabled={hasAnswered}
                >
                  Aceptar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
