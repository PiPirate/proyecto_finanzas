// src/games/unit1/BudgetConsole.jsx
import React, { useEffect, useMemo, useState } from 'react';
import useTypewriterText from '../core/hooks/useTypewriterText';
import './css/BudgetConsole.css';

import minigame1Icon from '../../assets/unit1/icons/minigame1_icon.png';

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

/* ========= MINI-JUEGO 1: COMPONENTE ========= */

function MiniGame1({ onFinished }) {
  // Elegimos 5 frases aleatorias
  const [questions] = useState(() => {
    const pool = [...minigame1PhrasesPool];
    pool.sort(() => Math.random() - 0.5);
    return pool.slice(0, 5);
  });

  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const current = questions[index];

  const handleAnswer = (answerType) => {
    if (showSummary) return;
    if (!current) return;

    const isCorrect = answerType === current.type;

    if (!isCorrect) {
      // Consejo cuando se equivoca
      setFeedback(`Casi... ${current.hint} Recuerda: cantidad, plazo y propósito.`);
      return;
    }

    // Correcto
    const nextIndex = index + 1;

    if (nextIndex >= questions.length) {
      // Terminó las 5 frases → pasamos a los diálogos finales
      setShowSummary(true);
      setFeedback('');
    } else {
      setIndex(nextIndex);
      setFeedback('¡Correcto! Vamos con la siguiente.');
    }
  };

  if (showSummary) {
    return <MiniGame1Summary onFinished={onFinished} />;
  }

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

      <p className="mg1-feedback">{feedback}</p>

      <p className="mg1-progress">
        Frase {index + 1} de {questions.length}
      </p>
    </div>
  );
}

/* ---------- DIÁLOGOS FINALES DENTRO DEL MONITOR ---------- */

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
      // Volvemos a la pantalla del icono
      onFinished();
    }
  };

  // Si habla Carmina → usamos un cuadrito tipo DialogueBox
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

  // Si habla la MK25 → texto integrado en la pantalla del monitor
  return (
    <div className="mg1-summary" onClick={handleClick}>
      <div className="budget-console-header">
        <span className="budget-console-speaker">{line.speaker}</span>
      </div>

      <p className="budget-console-text">{displayedText}</p>

      <span
        className={`budget-console-next ${
          isDone ? 'budget-console-next--visible' : ''
        }`}
      >
        ▼
      </span>
    </div>
  );
}

/* ========= BUDGET CONSOLE PRINCIPAL ========= */

export default function BudgetConsole({ visible, onClose, computerImage }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [miniGame1Active, setMiniGame1Active] = useState(false);

  useEffect(() => {
    if (visible) {
      setLineIndex(0);
      setMiniGame1Active(false);
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

  // Mostrar icono solo cuando terminó el texto de MK25
  // y aún no estamos dentro del minijuego
  const showMinigameIcon =
    isDone && lineIndex === lastIndex && !miniGame1Active;

  const handleOverlayClick = () => {
    // Si estamos en el minijuego, no hacemos nada con los clicks de fondo
    if (miniGame1Active) return;

    // 1) Terminar de escribir si aún está tipeando
    if (!isDone) {
      showAll();
      return;
    }

    // 2) Avanzar en el script de MK25
    if (lineIndex < lastIndex) {
      setLineIndex((prev) => prev + 1);
      return;
    }

    // 3) En la última línea y ya escrita: dejamos que
    //    el usuario interactúe con el icono (no cerramos nada).
  };

  const handleMinigameFinished = () => {
    // Volvemos a la pantalla del icono
    setMiniGame1Active(false);
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
              <MiniGame1 onFinished={handleMinigameFinished} />
            ) : (
              <>
                {/* Script inicial de MK25, solo si aún no mostramos el icono */}
                {!showMinigameIcon && (
                  <>
                    <div className="budget-console-header">
                      <span className="budget-console-speaker">
                        {currentLine.speaker}
                      </span>
                    </div>

                    <p className="budget-console-text">{displayedText}</p>
                  </>
                )}

                {/* Icono del minijuego 1 */}
                {showMinigameIcon && (
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

                {/* OJO: flechita SOLO para personas,
                    así que aquí (MK25) ya no mostramos nada. */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
