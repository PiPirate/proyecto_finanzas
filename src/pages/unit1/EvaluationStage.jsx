// src/components/EvaluationStage.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EvaluationStage.css';
import useTypewriterText from '../../games/core/hooks/useTypewriterText';
import GameViewport from '../../components/responsive/GameViewport';

// Ajusta estos nombres/rutas a tus archivos reales
import pigFighter from '../../assets/unit1/pig.png';
import enemyFighter from '../../assets/unit1/cat.png';
import fightBg from '../../assets/unit1/fondo.png';

const MAX_HEALTH = 100;
const QUESTION_TIME = 25; // segundos por pregunta

/* ---------- TUTORIAL PREVIO A LA EVALUACIÓN ---------- */

const evaluationTutorialScript = [
  {
    text: 'Llegaste al juego final. Aquí vas a poner a prueba lo que aprendiste sobre cómo se mueve tu dinero en la vida diaria.',
  },
  {
    text: 'Verás situaciones donde hay dinero entrando (ingresos) y saliendo (gastos). Tendrás que decidir si cuidas tu presupuesto o si dejas que el gasto impulsivo gane.',
  },
  {
    text: 'Recuerda: los ingresos son todo lo que recibes; los gastos, todo lo que pagas; el ahorro es la parte que decides guardar; y el presupuesto es la herramienta donde organizas todo eso.',
  },
  {
    text: 'En cada ronda el Cerdito Ahorro y el Gasto Impulsivo se enfrentarán según tu elección: aceptar, dudar o rechazar la propuesta que aparece.',
  },
  {
    text: 'Piensa antes de hacer click. Tus respuestas mostrarán qué tanto estás cuidando tus gastos y tu ahorro en el día a día.',
  },
];

function EvaluationTutorial({ visible, onFinished }) {
  const [index, setIndex] = useState(0);

  // Siempre calculamos la línea y usamos el hook,
  // aunque luego no rendericemos nada si visible === false
  const line =
    evaluationTutorialScript[index] || evaluationTutorialScript[0];
  const text = line?.text || '';

  const { displayedText, isDone, showAll } = useTypewriterText(
    text,
    28
  );

  const handleClick = (e) => {
    e.stopPropagation();

    if (!isDone) {
      showAll();
      return;
    }

    if (index < evaluationTutorialScript.length - 1) {
      setIndex((prev) => prev + 1);
    } else if (onFinished) {
      onFinished();
    }
  };

  if (!visible) return null;

  return (
    <div className="evaluation-tutorial-overlay" onClick={handleClick}>
      <div className="evaluation-tutorial-dialog">
        <div className="evaluation-tutorial-header">
          <span className="evaluation-tutorial-speaker">
            Asesor
          </span>
        </div>

        <p className="evaluation-tutorial-text">
          {displayedText}
        </p>

        <span
          className={
            'evaluation-tutorial-next' +
            (isDone ? ' evaluation-tutorial-next--visible' : '')
          }
        >
          ▼
        </span>
      </div>
    </div>
  );
}

/* ---------- PREGUNTAS DE EVALUACIÓN ---------- */

const evaluationQuestions = [
  {
    id: 'q1',
    context:
      'Hiciste tu presupuesto del mes y, después de sumar tus ingresos y restar tus gastos básicos, te das cuenta de que te quedan 100.000 pesos disponibles.',
    question:
      'La propuesta es: “Separarás esos 100.000 pesos apenas recibas el dinero, los destinarás a ahorro y los anotarás en tu presupuesto como un valor fijo cada mes”.',
    correctDecision: 'accept',
    feedback: {
      accept:
        'Exacto. Cuando decides de antemano cuánto guardar y lo escribes en tu presupuesto, es más fácil respetar ese ahorro y no gastarlo sin darte cuenta.',
      doubt:
        'Dudar hace que esos 100.000 queden “sueltos”. Si no los separas ni los anotas, es muy probable que se vayan en gastos pequeños que ni notas.',
      reject:
        'Si rechazas esta idea, tu ahorro dependerá solo de “lo que sobre”, y casi siempre termina sobrando muy poco o nada.',
    },
    feedbackTimeout:
      'Al dejar pasar el tiempo sin decidir, esos 100.000 quedan sin plan y se mezclan con tus gastos diarios.',
  },
  {
    id: 'q2',
    context:
      'Ya tienes tu presupuesto hecho y aparece una salida muy cara de último minuto que no estaba incluida en tus gastos.',
    question:
      'La propuesta es: “Dices que sí de una vez, sin revisar tu presupuesto, tus gastos del mes ni lo que pensabas ahorrar”.',
    correctDecision: 'reject',
    feedback: {
      accept:
        'Si aceptas sin revisar, es fácil que te pases del presupuesto y luego no entiendas por qué tu dinero no alcanzó.',
      doubt:
        'Dudar está bien; te da tiempo para mirar tu presupuesto. Pero lo más sano es frenar esa decisión impulsiva y revisar números primero.',
      reject:
        'Bien. Rechazas la idea de decir que sí sin pensar. Primero miras tus ingresos, gastos y ahorro, y luego decides si esa salida realmente cabe en tu presupuesto.',
    },
    feedbackTimeout:
      'Al no decidir nada, puedes terminar diciendo que sí por presión del momento y dañar tu presupuesto sin haberlo revisado.',
  },
  {
    id: 'q3',
    context:
      'Encuentras 20.000 pesos en un bolsillo que no recordabas, y ya pagaste tus gastos importantes del mes.',
    question:
      'La propuesta es: “Guardar esos 20.000 de una vez en tu alcancía o en la parte de ahorro de tu presupuesto”.',
    correctDecision: 'accept',
    feedback: {
      accept:
        'Buen movimiento. Es dinero que no esperabas y que aumenta tu ahorro sin afectar tus gastos básicos.',
      doubt:
        'Dudar mucho hace que el dinero quede flotando sin plan, y es fácil que termine gastándose en antojos que ni recuerdas después.',
      reject:
        'Si rechazas la idea de guardarlo, lo más probable es que se vaya en pequeños gastos que no estaban en tu presupuesto.',
    },
    feedbackTimeout:
      'Al no decidir, esos 20.000 se quedan sin destino claro y es muy probable que terminen en gastos impulsivos.',
  },
  {
    id: 'q4',
    context:
      'Se acerca fin de mes y al revisar tu presupuesto ves que has gastado más de lo que pensabas en antojitos y salidas.',
    question:
      'La propuesta es: “Durante estos días reducirás algunos antojos y pequeños gastos para equilibrar tu presupuesto y poder ahorrar un poco más”.',
    correctDecision: 'accept',
    feedback: {
      accept:
        'Justo. Ajustar algunos gastos al final del mes te ayuda a que tu presupuesto vuelva a cuadrar y a no olvidar el ahorro.',
      doubt:
        'Dudar hace que sigas gastando igual, y si no cambias nada, tus números seguirán desordenados y tu ahorro se queda atrás.',
      reject:
        'Si rechazas esta idea, probablemente seguirás gastando como si nada y te costará terminar el mes sin quedarte corto de dinero.',
    },
    feedbackTimeout:
      'Al dejar pasar el tiempo sin decidir, pierdes la oportunidad de corregir tus gastos de estos días y mejorar tu ahorro.',
  },
];

/* ---------- COMPONENTE PRINCIPAL ---------- */

export default function EvaluationStage({ onComplete, unitColor }) {
  const navigate = useNavigate();

  const [showTutorial, setShowTutorial] = useState(true);

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

  useEffect(() => {
    if (!showResult && !showTutorial) {
      setTimer(QUESTION_TIME);
      setSelectedDecision(null);
      setHasAnswered(false);
      setIsCorrect(null);
      setFeedback('');
    }
  }, [currentIndex, showResult, showTutorial]);

  const resolveDecision = useCallback(
    (decisionKey, opts = { isTimeout: false }) => {
      if (!question || showResult || showTutorial) return;
      if (hasAnswered) return;

      const { isTimeout } = opts;
      const isDecisionCorrect =
        !isTimeout && decisionKey === question.correctDecision;

      setSelectedDecision(decisionKey);
      setHasAnswered(true);
      setIsCorrect(isDecisionCorrect);

      if (isTimeout) {
        setFeedback(
          question.feedbackTimeout ||
            'Se acabó el tiempo; el gasto impulsivo te tomó por sorpresa.'
        );
      } else {
        const fb = question.feedback?.[decisionKey] || '';
        setFeedback(fb);
      }

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
    [question, showResult, hasAnswered, currentIndex, totalQuestions, showTutorial]
  );

  const handleDecisionClick = (decisionKey) => {
    if (!question || showResult || showTutorial) return;
    if (hasAnswered) return;
    resolveDecision(decisionKey, { isTimeout: false });
  };

  const handleTimeout = useCallback(() => {
    if (!question || showResult || showTutorial) return;
    if (hasAnswered) return;
    resolveDecision('timeout', { isTimeout: true });
  }, [question, showResult, hasAnswered, resolveDecision, showTutorial]);

  useEffect(() => {
    if (showResult) return;
    if (!question) return;
    if (hasAnswered) return;
    if (showTutorial) return;

    if (timer <= 0) {
      handleTimeout();
      return;
    }

    const id = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timer, showResult, question, hasAnswered, handleTimeout, showTutorial]);

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
    <GameViewport showControls={false} forceFullscreen>
      <div className="stage-container evaluation-stage">
        <EvaluationTutorial
          visible={showTutorial}
          onFinished={() => setShowTutorial(false)}
        />

        <div className="fighting-game-container">
        {/* HUD superior */}
        <div className="hud-top">
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

        {/* Arena */}
        <div className="fighting-arena">
          <div className="background-image">
            <img
              src={fightBg}
              alt="Escenario"
              className="background-img"
            />
            <div className="arena-overlay" />
          </div>

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
                    ? ' Tus decisiones muestran que entendiste cómo leer tus ingresos, cuidar tus gastos, usar el presupuesto y hacer crecer tu ahorro con pequeñas acciones.'
                    : ' Aun así, este combate te muestra en qué decisiones puedes mejorar para que tu ahorro sea más fuerte.'}
                </p>

                <p className="evaluation-result-text evaluation-result-text--secondary">
                  Recuerda: conocer tus ingresos, ordenar tus gastos,
                  tener un presupuesto y tomar decisiones constantes es
                  el combo que hace crecer tu cerdito, no al gasto
                  impulsivo.
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
    </GameViewport>
  );
}
