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
    text: 'Bienvenidos, mi nombre es MK25. Mi función es ayudarlos a entender mejor su dinero: qué entra, qué sale y qué pueden guardar.',
  },
  {
    speaker: 'MK25',
    text: 'Para lograrlo vamos a jugar tres mini-juegos cortos. Cada uno les ayudará a practicar ingresos, gastos, ahorro y presupuesto.',
  },
  {
    speaker: 'MK25',
    text: 'A continuación, elijan con cuál desean comenzar.',
  },
];

/* ---------- FRASES DEL MINI-JUEGO 1 ---------- */

const minigame1PhrasesPool = [
  {
    text: 'Me pagaron 50.000 pesos por ayudar en un trabajo.',
    type: 'ingreso',
    hint: 'Es ingreso porque es dinero que entra a tu bolsillo.',
  },
  {
    text: 'Pagué 30.000 pesos en transporte esta semana.',
    type: 'gasto',
    hint: 'Es gasto porque es dinero que sale de tu bolsillo.',
  },
  {
    text: 'Me dieron una mesada de 100.000 pesos.',
    type: 'ingreso',
    hint: 'Es ingreso porque es dinero que recibes de otra persona.',
  },
  {
    text: 'Compré comida rápida con mis amigos por 25.000 pesos.',
    type: 'gasto',
    hint: 'Es gasto porque estás usando dinero para pagar algo.',
  },
  {
    text: 'Vendí unos cuadernos y recibí 15.000 pesos.',
    type: 'ingreso',
    hint: 'Es ingreso porque entra dinero por una venta.',
  },
  {
    text: 'Pagué la recarga de datos del celular.',
    type: 'gasto',
    hint: 'Es gasto porque pagas un servicio con tu dinero.',
  },
  {
    text: 'Me devolvieron 5.000 pesos de una vuelta que había prestado.',
    type: 'ingreso',
    hint: 'Es ingreso porque vuelve a ti dinero que antes no tenías en el bolsillo.',
  },
  {
    text: 'Compré un regalo para un amigo.',
    type: 'gasto',
    hint: 'Es gasto porque usas tu dinero para comprar algo.',
  },
];

/* ---------- DIÁLOGOS FINALES DEL MINI-JUEGO 1 ---------- */

const minigame1SummaryScript = [
  {
    speaker: 'Carmina',
    text: 'Creo que ya lo entiendo: ingreso es lo que entra y gasto es lo que sale.',
  },
  {
    speaker: 'MK25',
    text: 'Exacto. Es el primer paso para armar cualquier presupuesto: saber de dónde viene tu dinero y en qué se va.',
  },
  {
    speaker: 'MK25',
    text: 'Muy bien. Ya puedes reconocer ingresos y gastos, lo que te ayudará a organizar mejor tu dinero en la siguiente parte.',
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
    phrase: 'Quieres comprar un celular y decides hacer un plan de ahorro.',
    options: [
      {
        id: 'a',
        label: 'Ahorrar 50.000 pesos cuando puedas, sin fecha ni orden.',
        isCorrect: false,
        correctExplanation:
          'Esta opción no tiene un tiempo ni un compromiso claro. Es difícil controlar tus gastos y tu ahorro así.',
      },
      {
        id: 'b',
        label: 'Ahorrar 800.000 pesos en 4 meses para comprar un celular.',
        isCorrect: true,
        correctExplanation:
          'Esta opción define cuánto ahorrarás en total y en cuánto tiempo, lo que te permite ajustar tus gastos para lograrlo.',
        wrongExplanation:
          'Fíjate que esta opción tiene una cantidad y un tiempo definidos; eso hace más claro tu presupuesto y tu ahorro.',
      },
      {
        id: 'c',
        label: 'Guardar lo que me sobre a fin de mes, si es que sobra algo.',
        isCorrect: false,
        correctExplanation:
          'Depender solo de “lo que sobre” no es un plan claro; muchas veces no queda nada para guardar.',
      },
    ],
  },
  {
    phrase: 'Sientes que gastas demasiado en dulces y quieres ordenarte.',
    options: [
      {
        id: 'a',
        label: 'Gastar menos en dulces algún día.',
        isCorrect: false,
        correctExplanation:
          '“Algún día” no es un tiempo concreto y “menos” no indica cuánto. Es difícil saber si realmente cambiaste tus gastos.',
      },
      {
        id: 'b',
        label: 'No volver a comprar dulces nunca más en la vida.',
        isCorrect: false,
        correctExplanation:
          'Es muy extrema y poco realista. Un buen plan también debe poder cumplirse en la vida real.',
      },
      {
        id: 'c',
        label: 'Gastar máximo 10.000 pesos a la semana en dulces.',
        isCorrect: true,
        correctExplanation:
          'Aquí hay un límite concreto (10.000) y un tiempo (por semana). Eso te permite medir si estás controlando ese gasto.',
        wrongExplanation:
          'Esta opción pone un máximo numérico y un periodo. Así puedes revisar si estás cumpliendo tu decisión.',
      },
    ],
  },
  {
    phrase: 'Quieres empezar a guardar dinero todos los meses.',
    options: [
      {
        id: 'a',
        label: 'Ahorrar 20.000 pesos cada semana durante 6 meses.',
        isCorrect: true,
        correctExplanation:
          'Tiene cantidad (20.000), frecuencia (cada semana) y tiempo (6 meses): es un plan claro para tu ahorro.',
        wrongExplanation:
          'Esta opción tiene números y tiempo definido. Eso la convierte en un plan real, no solo en una idea general.',
      },
      {
        id: 'b',
        label: 'Ahorrar un poco cada mes, si me acuerdo.',
        isCorrect: false,
        correctExplanation:
          '“Un poco” y “si me acuerdo” no te dicen cuánto ahorrarás ni si lo estás logrando.',
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
    text: 'Ok, entonces sí tengo que poner números reales a lo que quiero ahorrar o gastar.',
  },
  {
    speaker: 'MK25',
    text: 'Sí. Un buen presupuesto siempre se apoya en cantidades y tiempos concretos.',
  },
  {
    speaker: 'MK25',
    text: 'Perfecto. Ahora ya sabes cómo convertir ideas generales en planes con números que puedes seguir en tu día a día.',
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
      'Piensa en qué opción tiene más impacto en tu vida a largo plazo, no solo en el momento.',
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
    text: 'Bien. Elegir prioridades te permite usar mejor tu dinero y evitar que se vaya en todo a la vez.',
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
    text: 'Excelente trabajo. Ya sabes:\n• Diferenciar ingresos y gastos\n• Armar planes sencillos con números reales\n• Y elegir qué gastos y ahorros van primero cuando el dinero no alcanza para todo.',
  },
  {
    speaker: 'MK25',
    text: 'Con esto ya están listos para el siguiente paso: organizar su presupuesto completo.',
  },
  {
    speaker: 'MK25',
    text: 'Habla nuevamente con el asesor; él te indicará cómo seguir aplicando lo que aprendiste.',
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
      `${prefix}${current.hint} Recuerda: ingreso es dinero que entra, gasto es dinero que sale.`
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
      <h2 className="mg1-title">Ingreso o gasto</h2>

      <p className="mg1-instructions">
        Selecciona cada frase y dime si es:
        <br />
        [Ingreso] o [Gasto]
      </p>

      <div className="mg1-phrase-box">
        “{current ? current.text : ''}”
      </div>

      <div className="mg1-buttons">
        <button
          type="button"
          className="mg1-button mg1-button--vaga"
          onClick={() => handleAnswer('ingreso')}
        >
          Ingreso
        </button>
        <button
          type="button"
          className="mg1-button mg1-button--clara"
          onClick={() => handleAnswer('gasto')}
        >
          Gasto
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
      // Si estaba mal, vuelve a mostrar la misma situación
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
      <h2 className="mg2-title">Elige el mejor plan</h2>

      <p className="mg2-instructions">
        Ahora vamos a comparar distintos planes para manejar tu dinero.
        <br />
        Elige la opción que tenga números y tiempos más claros.
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
          Caso {index + 1} de {minigame2Questions.length}
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
      : 'No es una mala opción, pero piensa: ';

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
      <h2 className="mg3-title">Prioriza tus gastos</h2>

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
        Elige la opción que consideres más importante sabiendo que no te alcanza para todas.
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
      <div className="budget-console-frame minigame-container">
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
