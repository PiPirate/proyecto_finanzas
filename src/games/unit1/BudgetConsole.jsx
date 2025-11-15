// src/games/unit1/BudgetConsole.jsx
import React, { useEffect, useMemo, useState } from 'react';
import useTypewriterText from '../core/hooks/useTypewriterText';
import './css/BudgetConsole.css';

import minigame1Icon from '../../assets/unit1/icons/minigame1_icon.png';

// Script del "computador"
const mkConsoleScript = [
  {
    speaker: 'MK23',
    text: 'Bienvenidos, mi nombre es MK23. Mi función es ayudarlos a dejar atrás frases como “quiero ahorrar más” y transformarlas en metas específicas que realmente puedas cumplir.',
  },
  {
    speaker: 'MK23',
    text: 'Para lograrlo vamos a jugar tres mini-juegos cortos. Cada uno les ayudará a entender una parte del proceso.',
  },
  {
    speaker: 'MK23',
    text: 'A continuación, elijan con cuál desean comenzar.',
  },
];

export default function BudgetConsole({ visible, onClose, computerImage }) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setLineIndex(0);
    }
  }, [visible]);

  const currentLine = useMemo(
    () => mkConsoleScript[lineIndex] || mkConsoleScript[mkConsoleScript.length - 1],
    [lineIndex]
  );

  const lastIndex = mkConsoleScript.length - 1;

  const { displayedText, isDone, showAll } = useTypewriterText(
    currentLine.text,
    28
  );

  // Cuando ya terminó de escribirse la última línea
  const showMinigameIcon = isDone && lineIndex === lastIndex;

  const handleClick = () => {
    // 1) Terminar de escribir si aún está tipeando
    if (!isDone) {
      showAll();
      return;
    }

    // 2) Avanzar de línea si no es la última
    if (lineIndex < lastIndex) {
      setLineIndex((prev) => prev + 1);
      return;
    }

    // 3) En la última línea, ya no hacemos nada:
    //    solo dejamos el icono en pantalla.
  };

  if (!visible) return null;

  return (
    <div className="budget-console-overlay" onClick={handleClick}>
      <div className="budget-console-frame">
        <div
          className="budget-console-monitor"
          style={{ backgroundImage: `url(${computerImage})` }}
        >
          <div className="budget-console-screen">
            {/* Si estamos mostrando el icono, ocultamos el nombre y el texto */}
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

            {showMinigameIcon && (
              <div className="budget-console-icon-wrapper">
                <img
                  src={minigame1Icon}
                  alt="Minijuego 1"
                  className="budget-console-icon"
                />
              </div>
            )}

            {/* Flechita solo mientras haya más líneas de diálogo */}
            <span
              className={`budget-console-next ${
                isDone && lineIndex < lastIndex
                  ? 'budget-console-next--visible'
                  : ''
              }`}
            >
              ▼
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
