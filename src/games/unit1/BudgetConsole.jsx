// src/games/unit1/BudgetConsole.jsx
import React, { useEffect, useMemo, useState } from 'react';
import useTypewriterText from '../core/hooks/useTypewriterText';
import './css/BudgetConsole.css';

import minigame1Icon from '../../assets/unit1/icons/minigame1_icon.png';
import minigame2Icon from '../../assets/unit1/icons/minigame2_icon.png';
import minigame3Icon from '../../assets/unit1/icons/minigame3_icon.png';

/* ---------- SCRIPT MK25 (pantalla inicial) ---------- */

const mkConsoleScript = [
  {
    speaker: 'MK25',
    text: 'Bienvenidos, mi nombre es MK25. Mi función es ayudarlos a dejar atrás frases como “quiero ahorrar más” y transformarlas en metas específicas que realmente puedas cumplir.',
  },
  {
    speaker: 'MK25',
    text: 'Para lograrlo vamos a jugar tres mini-juegos cortos. Cada uno les ayudará a entender una parte del proceso.',
  },
  {
    speaker: 'MK25',
    text: 'A continuación, elijan con cuál desean comenzar.',
  },
];

/* ---------- FRASES DEL MINI-JUEGO 1 ---------- */

const minigame1PhrasesPool = [
  {
    text: 'Quiero ahorrar más dinero.',
    type: 'vaga',
    hint: 'Es vaga porque no dice cuánto quieres ahorrar ni para cuándo.',
  },
  {
    text: 'Ahorrar 200.000 pesos en 2 meses para comprar ropa.',
    type: 'clara',
    hint: 'Es clara: tiene cantidad (200.000), plazo (2 meses) y propósito (ropa).',
  },
  {
    text: 'Gastar menos.',
    type: 'vaga',
    hint: '“Gastar menos” es muy general. Falta cuánto, durante cuánto tiempo y para qué.',
  },
  {
    text: 'Ahorrar 20.000 cada semana durante un mes.',
    type: 'clara',
    hint: 'Tiene cantidad (20.000), frecuencia (cada semana) y plazo (un mes).',
  },
  {
    text: 'Ser más responsable con mi dinero.',
    type: 'vaga',
    hint: 'Suena bien, pero no es medible: no hay números ni fechas.',
  },
  {
    text: 'Juntar 300.000 para reparar mi celular antes de mayo.',
    type: 'clara',
    hint: 'Meta específica: 300.000, propósito (reparar celular) y plazo (antes de mayo).',
  },
  {
    text: 'Ahorrar lo que sobre cada mes.',
    type: 'vaga',
    hint: 'No define cuánto debe sobrar ni para qué, así que es difícil de medir.',
  },
  {
    text: 'Ahorrar 50.000 pesos al mes durante 6 meses para un viaje.',
    type: 'clara',
    hint: 'Cantidad, plazo y propósito: cumple las tres claves de una meta clara.',
  },
];

/* ---------- DIÁLOGOS FINALES DEL MINI-JUEGO 1 ---------- */

const minigame1SummaryScript = [
  {
    speaker: 'Carmina',
    text: 'Creo que lo veo: si no tiene números ni fechas… es vaga.',
  },
  {
    speaker: 'MK25',
    text: 'Exacto. Las metas claras contienen tres claves: \n• Cantidad\n• Plazo\n• Propósito',
  },
  {
    speaker: 'MK25',
    text: 'Muy bien. Ya puedes reconocer metas claras y metas vagas, que es el primer paso para tomar decisiones financieras con dirección.',
  },
  {
    speaker: 'MK25',
    text: 'Pasaremos al segundo minijuego.',
  },
  {
    speaker: 'MK25',
    text: 'Vuelve a la pantalla principal del computador y selecciónalo.',
  },
];

/* ---------- CONFIGURACIÓN DEL MINI-JUEGO 2 (OPCIONES) ---------- */

const minigame2Questions = [
  {
    phrase: '“Quiero ahorrar para un celular.”',
    options: [
      {
        id: 'a',
        label: 'Ahorrar 50.000 pesos cuando pueda, sin fecha límite.',
        isCorrect: false,
        correctExplanation:
          'Esta opción no tiene fecha ni un compromiso claro. Decir “cuando pueda” hace que la meta siga siendo vaga.',
      },
      {
        id: 'b',
        label: 'Ahorrar 800.000 pesos en 4 meses para comprar un celular.',
        isCorrect: true,
        correctExplanation:
          'Esta meta es clara: tiene cantidad (800.000), plazo (4 meses) y propósito (comprar un celular).',
        wrongExplanation:
          'Fíjate que esta opción sí tiene cantidad, plazo y propósito. Eso la hace una meta clara.',
      },
      {
        id: 'c',
        label: 'Guardar lo que me sobre a fin de mes, si es que sobra algo.',
        isCorrect: false,
        correctExplanation:
          'Depender solo de “lo que sobre” no es una cantidad fija ni un compromiso real.',
      },
    ],
  },
  {
    phrase: '“Quiero dejar de gastar tanto en dulces.”',
    options: [
      {
        id: 'a',
        label: 'Gastar menos en dulces algún día.',
        isCorrect: false,
        correctExplanation:
          '“Algún día” no es un plazo concreto y “menos” no indica cuánto. Sigue siendo vaga.',
      },
      {
        id: 'b',
        label: 'No volver a comprar dulces nunca más en la vida.',
        isCorrect: false,
        correctExplanation:
          'Es muy extrema y poco realista. Una meta clara también debe ser alcanzable.',
      },
      {
        id: 'c',
        label: 'Gastar máximo 10.000 pesos a la semana en dulces.',
        isCorrect: true,
        correctExplanation:
          'Aquí hay un límite concreto (10.000) y un plazo (por semana). Eso te permite medir si cumples o no.',
        wrongExplanation:
          'Esta opción pone un máximo numérico y un periodo. Eso la hace una meta medible.',
      },
    ],
  },
  {
    phrase: '“Quiero empezar a guardar dinero.”',
    options: [
      {
        id: 'a',
        label: 'Ahorrar 20.000 pesos cada semana durante 6 meses.',
        isCorrect: true,
        correctExplanation:
          'Cantidad (20.000), frecuencia (cada semana) y plazo (6 meses): es una meta clara y medible.',
        wrongExplanation:
          'Esta opción tiene números y tiempo definido. Eso la convierte en un objetivo real, no solo un deseo.',
      },
      {
        id: 'b',
        label: 'Ahorrar un poco cada mes, si me acuerdo.',
        isCorrect: false,
        correctExplanation:
          '“Un poco” y “si me acuerdo” no permiten saber si cumpliste tu meta o no.',
      },
      {
        id: 'c',
        label: 'Guardar todo el dinero que reciba.',
        isCorrect: false,
        correctExplanation:
          'Decir “todo” suena bien, pero no es realista. Es mejor una cantidad específica y alcanzable.',
      },
    ],
  },
];

/* ---------- DIÁLOGOS FINALES DEL MINI-JUEGO 2 ---------- */

const minigame2SummaryScript = [
  {
    speaker: 'Carmina',
    text: 'Ok, entonces sí tengo que decidir números reales.',
  },
  {
    speaker: 'MK25',
    text: 'Sí. No existe meta clara sin compromiso numérico.',
  },
  {
    speaker: 'MK25',
    text: 'Perfecto. Ahora ya sabes cómo transformar cualquier deseo financiero en un objetivo medible.',
  },
];

/* ---------- CONFIGURACIÓN DEL MINI-JUEGO 3 (VARIOS ESCENARIOS) ---------- */

const minigame3Scenarios = [
  {
    id: 's1',
    description: 'Situación 1: Quieres mejorar tu año escolar y tu vida social.',
    budget: 100000,
    goals: [
      { id: 'headphones', label: 'Comprar audífonos – 80.000', cost: 80000 },
      { id: 'friends', label: 'Salida con amigos – 50.000', cost: 50000 },
      {
        id: 'project',
        label: 'Material para un proyecto importante – 60.000',
        cost: 60000,
      },
    ],
    recommendedId: 'project',
    recommendedExplanation:
      'Elegir el material para un proyecto importante suele ayudarte a largo plazo: impacta tus estudios o trabajo y puede abrir más oportunidades.',
    otherExplanation:
      'Qué opción tiene más impacto en tus metas a largo plazo, no solo en el momento.',
  },
  {
    id: 's2',
    description:
      'Situación 2: Termina el semestre y quieres divertirte, pero también mejorar tus herramientas.',
    budget: 90000,
    goals: [
      {
        id: 'videogame',
        label: 'Comprar un videojuego nuevo – 70.000',
        cost: 70000,
      },
      {
        id: 'course',
        label: 'Pagar un minicurso en línea – 65.000',
        cost: 65000,
      },
      {
        id: 'clothes',
        label: 'Comprar ropa para una salida – 60.000',
        cost: 60000,
      },
    ],
    recommendedId: 'course',
    recommendedExplanation:
      'Priorizar el minicurso puede ayudarte a aprender algo nuevo que se refleja en tu futuro académico o laboral.',
    otherExplanation:
      'Recuerda que no todo es ocio inmediato. A veces una parte de tu presupuesto puede ir a cosas que te dan ventajas a futuro.',
  },
  {
    id: 's3',
    description:
      'Situación 3: Te llega un dinero extra y tienes varias tentaciones.',
    budget: 80000,
    goals: [
      {
        id: 'concert',
        label: 'Ir a un concierto – 75.000',
        cost: 75000,
      },
      {
        id: 'books',
        label: 'Comprar libros para el colegio – 70.000',
        cost: 70000,
      },
      {
        id: 'decor',
        label: 'Decoración para tu habitación – 65.000',
        cost: 65000,
      },
    ],
    recommendedId: 'books',
    recommendedExplanation:
      'Elegir los libros refuerza tus estudios y puede ayudarte durante todo el año, no solo una noche.',
    otherExplanation:
      'No está mal querer disfrutar o mejorar tu espacio, pero trata de preguntarte qué decisión te ayuda durante más tiempo.',
  },
];

const minigame3SummaryScript = [
  {
    speaker: 'Carmina',
    text: 'Uy… no me alcanza para todo. Voy a tener que escoger.',
  },
  {
    speaker: 'MK25',
    text: 'Bien. Elegir prioridades te permite avanzar de verdad en tus metas.',
  },
  {
    speaker: 'MK25',
    text: 'No es malo decir “ahora no”, es parte de planear.',
  },
];

/* ---------- DIÁLOGO FINAL POST-ENTRENAMIENTO (MK25 + Carmina) ---------- */

const postTrainingScript = [
  {
    speaker: 'MK25',
    text: 'Excelente trabajo. Ya sabes:\n• Identificar metas vagas\n• Convertirlas en claras\n• Y priorizar cuál atacar primero.',
  },
  {
    speaker: 'MK25',
    text: 'Con esto ya están listos para el siguiente paso: estructurar tu presupuesto.',
  },
  {
    speaker: 'MK25',
    text: 'Habla nuevamente con el asesor, él te indicará cómo proseguir.',
  },
  {
    speaker: 'Carmina',
    text: '¡Gracias MK25!',
  },
];

/* ---------- DIÁLOGO INLINE DE RETROALIMENTACIÓN (dentro del monitor) ---------- */

function InlineFeedbackDialog({ speaker = 'MK25', text, onNext }) {
  const { displayedText, isDone, showAll } = useTypewriterText(text, 28);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isDone) {
      showAll();
      return;
    }
    if (onNext) onNext();
  };

  return (
    <div className="mg1-summary" onClick={handleClick}>
      <div className="budget-console-header">
        <span className="budget-console-speaker">{speaker}</span>
      </div>
      <p className="budget-console-text">{displayedText}</p>
      {/* Sin flecha para MK25 */}
    </div>
  );
}

/* ========= MINI-JUEGO 1 ========= */

function MiniGame1({ onFinished }) {
  const [questions] = useState(() => {
    const pool = [...minigame1PhrasesPool];
    pool.sort(() => Math.random() - 0.5);
    return pool.slice(0, 5);
  });

  const [index, setIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const [phase, setPhase] = useState('question'); // 'question' | 'feedback'
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);

  const current = questions[index];

  const handleAnswer = (answerType) => {
    if (showSummary || phase !== 'question') return;
    if (!current) return;

    const isCorrect = answerType === current.type;
    setFeedbackCorrect(isCorrect);

    const prefix = isCorrect ? '¡Correcto! ' : 'Casi... ';
    setFeedbackText(
      `${prefix}${current.hint} Recuerda: cantidad, plazo y propósito.`
    );

    setPhase('feedback');
  };

  const handleFeedbackNext = () => {
    if (feedbackCorrect) {
      const nextIndex = index + 1;
      if (nextIndex >= questions.length) {
        setShowSummary(true);
      } else {
        setIndex(nextIndex);
        setPhase('question');
      }
    } else {
      // Respuesta incorrecta → vuelve a intentar la misma frase
      setPhase('question');
    }
  };

  if (showSummary) {
    return <MiniGame1Summary onFinished={onFinished} />;
  }

  if (phase === 'feedback') {
    return (
      <InlineFeedbackDialog
        speaker="MK25"
        text={feedbackText}
        onNext={handleFeedbackNext}
      />
    );
  }

  // Fase de pregunta
  return (
    <div className="mg1-container">
      <h2 className="mg1-title">Meta vaga vs meta clara</h2>

      <p className="mg1-instructions">
        Selecciona cada frase y dime si es:
        <br />
        [Meta vaga] o [Meta clara]
      </p>

      <div className="mg1-phrase-box">
        “{current ? current.text : ''}”
      </div>

      <div className="mg1-buttons">
        <button
          type="button"
          className="mg1-button mg1-button--vaga"
          onClick={() => handleAnswer('vaga')}
        >
          Meta vaga
        </button>
        <button
          type="button"
          className="mg1-button mg1-button--clara"
          onClick={() => handleAnswer('clara')}
        >
          Meta clara
        </button>
      </div>

      <p className="mg1-progress">
        Frase {index + 1} de {questions.length}
      </p>
    </div>
  );
}

/* ---------- DIÁLOGOS FINALES MINI-JUEGO 1 ---------- */

function MiniGame1Summary({ onFinished }) {
  const [idx, setIdx] = useState(0);
  const line = minigame1SummaryScript[idx];
  const isCarmina = line.speaker === 'Carmina';

  const { displayedText, isDone, showAll } = useTypewriterText(
    line.text,
    28
  );

  const handleClick = (e) => {
    e.stopPropagation();

    if (!isDone) {
      showAll();
      return;
    }

    if (idx < minigame1SummaryScript.length - 1) {
      setIdx((prev) => prev + 1);
    } else {
      onFinished();
    }
  };

  if (isCarmina) {
    return (
      <div className="mg1-summary mg1-summary--carmina" onClick={handleClick}>
        <div className="mg1-dialogue-panel">
          <div className="mg1-dialogue-speaker">{line.speaker}</div>
          <p className="mg1-dialogue-text">{displayedText}</p>

          <span
            className={`budget-console-next ${
              isDone ? 'budget-console-next--visible' : ''
            }`}
          >
            ▼
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mg1-summary" onClick={handleClick}>
      <div className="budget-console-header">
        <span className="budget-console-speaker">{line.speaker}</span>
      </div>

      <p className="budget-console-text">{displayedText}</p>
    </div>
  );
}

/* ========= MINI-JUEGO 2 (OPCIONES) ========= */

function MiniGame2({ onFinished }) {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const [phase, setPhase] = useState('question'); // 'question' | 'feedback'
  const [feedbackText, setFeedbackText] = useState('');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  const currentQuestion = minigame2Questions[index];

  useEffect(() => {
    setSelectedId(null);
    setPhase('question');
    setFeedbackText('');
    setLastAnswerCorrect(false);
  }, [index]);

  const handleOptionClick = (option) => {
    if (phase !== 'question' || showSummary) return;

    setSelectedId(option.id);

    const explanation =
      option.isCorrect
        ? option.correctExplanation
        : option.wrongExplanation || option.correctExplanation;

    const prefix = option.isCorrect ? '¡Bien! ' : 'Mira: ';

    setFeedbackText(prefix + explanation);
    setLastAnswerCorrect(option.isCorrect);
    setPhase('feedback');
  };

  const handleFeedbackNext = () => {
    if (lastAnswerCorrect) {
      const nextIndex = index + 1;
      if (nextIndex >= minigame2Questions.length) {
        setShowSummary(true);
      } else {
        setIndex(nextIndex);
      }
    } else {
      // Si estaba mal, vuelve a mostrar la misma meta
      setPhase('question');
      setSelectedId(null);
      setFeedbackText('');
      setLastAnswerCorrect(false);
    }
  };

  if (showSummary) {
    return <MiniGame2Summary onFinished={onFinished} />;
  }

  if (phase === 'feedback') {
    return (
      <InlineFeedbackDialog
        speaker="MK25"
        text={feedbackText}
        onNext={handleFeedbackNext}
      />
    );
  }

  // Fase de pregunta
  return (
    <div className="mg2-container">
      <h2 className="mg2-title">Completa la meta</h2>

      <p className="mg2-instructions">
        Ahora vamos a convertir metas vagas en metas claras.
        <br />
        Elige la opción que tenga números y plazos claros.
      </p>

      <div className="mg2-phrase-box">{currentQuestion.phrase}</div>

      <div className="mg2-options">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={
              'mg2-option-button' +
              (selectedId === opt.id ? ' mg2-option-button--selected' : '')
            }
            onClick={() => handleOptionClick(opt)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mg2-bottom-row">
        <span className="mg2-progress">
          Meta {index + 1} de {minigame2Questions.length}
        </span>
      </div>
    </div>
  );
}

/* ---------- DIÁLOGOS FINALES MINI-JUEGO 2 ---------- */

function MiniGame2Summary({ onFinished }) {
  const [idx, setIdx] = useState(0);
  const line = minigame2SummaryScript[idx];
  const isCarmina = line.speaker === 'Carmina';

  const { displayedText, isDone, showAll } = useTypewriterText(
    line.text,
    28
  );

  const handleClick = (e) => {
    e.stopPropagation();

    if (!isDone) {
      showAll();
      return;
    }

    if (idx < minigame2SummaryScript.length - 1) {
      setIdx((prev) => prev + 1);
    } else {
      onFinished();
    }
  };

  if (isCarmina) {
    return (
      <div className="mg1-summary mg1-summary--carmina" onClick={handleClick}>
        <div className="mg1-dialogue-panel">
          <div className="mg1-dialogue-speaker">{line.speaker}</div>
          <p className="mg1-dialogue-text">{displayedText}</p>

          <span
            className={`budget-console-next ${
              isDone ? 'budget-console-next--visible' : ''
            }`}
          >
            ▼
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mg1-summary" onClick={handleClick}>
      <div className="budget-console-header">
        <span className="budget-console-speaker">{line.speaker}</span>
      </div>

      <p className="budget-console-text">{displayedText}</p>
    </div>
  );
}

/* ========= MINI-JUEGO 3: PRIORIZA TU OBJETIVO ========= */

function MiniGame3({ onFinished }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [chosenGoals, setChosenGoals] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const [phase, setPhase] = useState('question'); // 'question' | 'feedback'
  const [feedbackText, setFeedbackText] = useState('');

  const scenario = minigame3Scenarios[scenarioIndex];

  const handleSelectGoal = (goal) => {
    if (showSummary || phase !== 'question') return;
    if (!scenario) return;

    setSelectedGoalId(goal.id);
    setChosenGoals((prev) => [...prev, goal.label]);

    const isRecommended = scenario.recommendedId === goal.id;
    const explanation = isRecommended
      ? scenario.recommendedExplanation
      : scenario.otherExplanation;

    const prefix = isRecommended
      ? 'Buena elección. '
      : 'No es una mala meta, pero piensa: ';

    setFeedbackText(prefix + explanation);
    setPhase('feedback');
  };

  const handleNextScenarioFromFeedback = () => {
    const nextIndex = scenarioIndex + 1;

    if (nextIndex >= minigame3Scenarios.length) {
      setShowSummary(true);
    } else {
      setScenarioIndex(nextIndex);
      setSelectedGoalId(null);
      setPhase('question');
      setFeedbackText('');
    }
  };

  if (showSummary) {
    return (
      <MiniGame3Summary
        onFinished={onFinished}
        chosenGoals={chosenGoals}
      />
    );
  }

  if (!scenario) return null;

  if (phase === 'feedback') {
    return (
      <InlineFeedbackDialog
        speaker="MK25"
        text={feedbackText}
        onNext={handleNextScenarioFromFeedback}
      />
    );
  }

  // Fase de pregunta
  return (
    <div className="mg3-container">
      <h2 className="mg3-title">Prioriza tu objetivo</h2>

      <p className="mg3-instructions">
        {scenario.description}
        <br />
        Tienes un presupuesto ficticio de{' '}
        <span className="mg3-budget-amount">
          ${' '}
          {scenario.budget.toLocaleString('es-CO')}
        </span>
        .
        <br />
        Elige la meta que consideres más importante sabiendo que no te alcanza para todas.
      </p>

      <div className="mg3-goals">
        {scenario.goals.map((goal) => (
          <button
            key={goal.id}
            type="button"
            className={
              'mg3-goal-card' +
              (selectedGoalId === goal.id ? ' mg3-goal-card--selected' : '')
            }
            onClick={() => handleSelectGoal(goal)}
          >
            {goal.label}
          </button>
        ))}
      </div>

      <div className="mg3-bottom-row">
        <span className="mg3-progress">
          Situación {scenarioIndex + 1} de {minigame3Scenarios.length}
        </span>
      </div>
    </div>
  );
}

/* ---------- DIÁLOGOS FINALES MINI-JUEGO 3 ---------- */

function MiniGame3Summary({ onFinished, chosenGoals }) {
  const [idx, setIdx] = useState(0);
  const line = minigame3SummaryScript[idx];
  const isCarmina = line.speaker === 'Carmina';

  const { displayedText, isDone, showAll } = useTypewriterText(
    line.text,
    28
  );

  const handleClick = (e) => {
    e.stopPropagation();

    if (!isDone) {
      showAll();
      return;
    }

    if (idx < minigame3SummaryScript.length - 1) {
      setIdx((prev) => prev + 1);
    } else {
      onFinished();
    }
  };

  const extraLines =
    idx === 0 && chosenGoals && chosenGoals.length > 0
      ? `\n\nEn este minijuego decidiste priorizar:\n- ${chosenGoals.join(
          '\n- '
        )}`
      : '';

  if (isCarmina) {
    return (
      <div className="mg1-summary mg1-summary--carmina" onClick={handleClick}>
        <div className="mg1-dialogue-panel">
          <div className="mg1-dialogue-speaker">{line.speaker}</div>
          <p className="mg1-dialogue-text">
            {displayedText}
            {extraLines}
          </p>

          <span
            className={`budget-console-next ${
              isDone ? 'budget-console-next--visible' : ''
            }`}
          >
            ▼
          </span>
        </div>
      </div>
    );
  }

  // MK25 dentro del monitor, sin flecha
  return (
    <div className="mg1-summary" onClick={handleClick}>
      <div className="budget-console-header">
        <span className="budget-console-speaker">{line.speaker}</span>
      </div>

      <p className="budget-console-text">{displayedText}</p>
    </div>
  );
}

/* ---------- DIÁLOGO FINAL POST-ENTRENAMIENTO (MK25 + Carmina) ---------- */

function PostTrainingDialogue({ onFinished }) {
  const [idx, setIdx] = useState(0);
  const line = postTrainingScript[idx];
  const isCarmina = line.speaker === 'Carmina';

  const { displayedText, isDone, showAll } = useTypewriterText(
    line.text,
    28
  );

  const handleClick = (e) => {
    e.stopPropagation();

    if (!isDone) {
      showAll();
      return;
    }

    if (idx < postTrainingScript.length - 1) {
      setIdx((prev) => prev + 1);
    } else {
      if (onFinished) onFinished();
    }
  };

  if (isCarmina) {
    // Carmina con cuadrito tipo diálogo
    return (
      <div className="mg1-summary mg1-summary--carmina" onClick={handleClick}>
        <div className="mg1-dialogue-panel">
          <div className="mg1-dialogue-speaker">{line.speaker}</div>
          <p className="mg1-dialogue-text">{displayedText}</p>

          <span
            className={`budget-console-next ${
              isDone ? 'budget-console-next--visible' : ''
            }`}
          >
            ▼
          </span>
        </div>
      </div>
    );
  }

  // MK25 integrado en la pantalla del monitor, sin flecha
  return (
    <div className="mg1-summary" onClick={handleClick}>
      <div className="budget-console-header">
        <span className="budget-console-speaker">{line.speaker}</span>
      </div>
      <p className="budget-console-text">{displayedText}</p>
    </div>
  );
}

/* ========= BUDGET CONSOLE PRINCIPAL ========= */

/* ========= BUDGET CONSOLE PRINCIPAL ========= */

export default function BudgetConsole({
  visible,
  computerImage,
  onTrainingFinished, // callback cuando se termina TODO el entrenamiento (3 minijuegos + diálogo final MK25)
}) {
  const [lineIndex, setLineIndex] = useState(0);

  const [miniGame1Active, setMiniGame1Active] = useState(false);
  const [miniGame2Active, setMiniGame2Active] = useState(false);
  const [miniGame3Active, setMiniGame3Active] = useState(false);

  const [miniGame1Completed, setMiniGame1Completed] = useState(false);
  const [miniGame2Completed, setMiniGame2Completed] = useState(false);
  const [miniGame3Completed, setMiniGame3Completed] = useState(false);

  const [postTrainingMode, setPostTrainingMode] = useState(false);

  useEffect(() => {
    if (visible) {
      setLineIndex(0);
      setMiniGame1Active(false);
      setMiniGame2Active(false);
      setMiniGame3Active(false);
      setPostTrainingMode(false);
      // mantenemos completed para que no se repitan si vuelves a entrar
    }
  }, [visible]);

  const currentLine = useMemo(
    () =>
      mkConsoleScript[lineIndex] ||
      mkConsoleScript[mkConsoleScript.length - 1],
    [lineIndex]
  );

  const lastIndex = mkConsoleScript.length - 1;

  const { displayedText, isDone, showAll } = useTypewriterText(
    currentLine.text,
    28
  );

  const showMinigame1Icon =
    isDone &&
    lineIndex === lastIndex &&
    !miniGame1Active &&
    !miniGame2Active &&
    !miniGame3Active &&
    !miniGame1Completed &&
    !postTrainingMode;

  const showMinigame2Icon =
    isDone &&
    lineIndex === lastIndex &&
    !miniGame1Active &&
    !miniGame2Active &&
    !miniGame3Active &&
    miniGame1Completed &&
    !miniGame2Completed &&
    !postTrainingMode;

  const showMinigame3Icon =
    isDone &&
    lineIndex === lastIndex &&
    !miniGame1Active &&
    !miniGame2Active &&
    !miniGame3Active &&
    miniGame1Completed &&
    miniGame2Completed &&
    !miniGame3Completed &&
    !postTrainingMode;

  const handleOverlayClick = () => {
    if (miniGame1Active || miniGame2Active || miniGame3Active || postTrainingMode)
      return;

    if (!isDone) {
      showAll();
      return;
    }

    if (lineIndex < lastIndex) {
      setLineIndex((prev) => prev + 1);
      return;
    }
  };

  const handleMinigame1Finished = () => {
    setMiniGame1Active(false);
    setMiniGame1Completed(true);
  };

  const handleMinigame2Finished = () => {
    setMiniGame2Active(false);
    setMiniGame2Completed(true);
  };

  const handleMinigame3Finished = () => {
    // Terminar minijuego 3 → pasamos al diálogo final de MK25 dentro del monitor
    setMiniGame3Active(false);
    setMiniGame3Completed(true);
    setPostTrainingMode(true);
  };

  const handlePostTrainingFinished = () => {
    // Aquí avisamos al exterior que TODO el entrenamiento terminó.
    if (onTrainingFinished) onTrainingFinished();
  };

  if (!visible) return null;

  return (
    <div className="budget-console-overlay" onClick={handleOverlayClick}>
      <div className="budget-console-frame">
        <div
          className="budget-console-monitor"
          style={{ backgroundImage: `url(${computerImage})` }}
        >
          <div className="budget-console-screen">
            {miniGame1Active ? (
              <MiniGame1 onFinished={handleMinigame1Finished} />
            ) : miniGame2Active ? (
              <MiniGame2 onFinished={handleMinigame2Finished} />
            ) : miniGame3Active ? (
              <MiniGame3 onFinished={handleMinigame3Finished} />
            ) : postTrainingMode ? (
              <PostTrainingDialogue onFinished={handlePostTrainingFinished} />
            ) : (
              <>
                {/* Diálogo inicial de MK25 mientras aún no mostramos iconos */}
                {!showMinigame1Icon &&
                  !showMinigame2Icon &&
                  !showMinigame3Icon && (
                    <>
                      <div className="budget-console-header">
                        <span className="budget-console-speaker">
                          {currentLine.speaker}
                        </span>
                      </div>

                      <p className="budget-console-text">{displayedText}</p>
                    </>
                  )}

                {showMinigame1Icon && (
                  <div
                    className="budget-console-icon-wrapper"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMiniGame1Active(true);
                    }}
                  >
                    <img
                      src={minigame1Icon}
                      alt="Minijuego 1"
                      className="budget-console-icon"
                    />
                  </div>
                )}

                {showMinigame2Icon && (
                  <div
                    className="budget-console-icon-wrapper"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMiniGame2Active(true);
                    }}
                  >
                    <img
                      src={minigame2Icon}
                      alt="Minijuego 2"
                      className="budget-console-icon"
                    />
                  </div>
                )}

                {showMinigame3Icon && (
                  <div
                    className="budget-console-icon-wrapper"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMiniGame3Active(true);
                    }}
                  >
                    <img
                      src={minigame3Icon}
                      alt="Minijuego 3"
                      className="budget-console-icon"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
