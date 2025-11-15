// src/games/unit1/Unit1GameScene.jsx
import React, { useCallback, useState, useMemo } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';
import DialogueBox from '../core/dialogue/DialogueBox';
import BudgetConsole from './BudgetConsole';

import {
  unit1MapMatrix,
  unit1TileSize,
  unit1PlayerStart,
  unit1InteractiveZones,
} from '../../data/games/unit1Map';

import hallImage from '../../assets/unit1/mapa_banco.png';
import girlSpriteSheet from '../../assets/general/la socia caminando.png';

// Rostros
import girlFaceTalking from '../../assets/general/player_face_hablando.png';
import girlFaceNeutral from '../../assets/general/player_face_neutral.png';

// Monitor neutro
import budgetComputerImage from '../../assets/unit1/null_desktop.png';

import './css/Unit1GameScene.css';

// Diálogo inicial (habla Carmina)
const introDialogue = [
  'Bueno… aquí estamos. Primera unidad del módulo de finanzas...',
  'La verdad, al igual que tú, siempre he querido aprender a organizar mejor mi dinero...',
  'Pero nunca supe muy bien por dónde empezar.',
  'Aquí vamos a aprender a convertir nuestras ideas sueltas en metas claras y alcanzables.',
  'Para empezar, vamos a hablar con el asesor financiero de aquella mesa. Él nos guiará por todo este proceso.',
  'Acércate a él y haz click en su escritorio para comenzar.',
];

// Diálogo principal con el asesor (multi-personaje)
const advisorMainDialogue = [
  {
    speaker: 'Asesor',
    text: 'Bienvenidos. Me alegra que hayan decidido empezar a organizar su dinero.',
  },
  {
    speaker: 'Asesor',
    text: 'Antes de comenzar, quiero que piensen en algo: todos tenemos deseos, sueños o planes...',
  },
  {
    speaker: 'Asesor',
    text: 'Pero si no los convertimos en metas concretas, se vuelven difíciles de alcanzar.',
  },
  {
    speaker: 'Asesor',
    text: 'Así que en esta unidad aprenderán a darle forma a esas ideas..',
  },
  {
    speaker: 'Asesor',
    text: 'convertir lo que “quieres algún día” en objetivos medibles, con números, fechas y pasos realistas.',
  },
  {
    speaker: 'Asesor',
    text: 'Luego aprenderán a crear un presupuesto simple para que sepan cómo distribuir su dinero.',
  },
  {
    speaker: 'Asesor',
    text: 'Y por último verán cómo una buena estrategia de ahorro hace que ese objetivo deje de ser un sueño y empiece a ser algo totalmente posible.',
  },
  {
    speaker: 'Carmina',
    text: 'Suena genial. ¿Cuál es el siguiente paso?',
  },
  {
    speaker: 'Asesor',
    text: 'Primero vamos a transformar una meta vaga en una meta clara.',
  },
  {
    speaker: 'Asesor',
    text: 'Para eso deben ir a la mesa de presupuesto inicial de al lado y darle click.',
  },
  {
    speaker: 'Asesor',
    text: 'Allí podrán experimentar de forma visual cómo se estructura un objetivo.',
  },
];

// Diálogo corto del asesor después de la primera vez
const advisorRepeatDialogue = [
  {
    speaker: 'Asesor',
    text: 'Espero que ya hayan pasado por la mesa de presupuesto.',
  },
];

function Unit1GameScene({ onGoalReached }) {
  // 'intro' | 'advisorMain' | 'advisorRepeat' | null
  const [dialogueMode, setDialogueMode] = useState('intro');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [advisorMainDone, setAdvisorMainDone] = useState(false);

  // NUEVO: estado para el menú de presupuesto
  const [isBudgetConsoleOpen, setIsBudgetConsoleOpen] = useState(false);

  const isDialogueVisible = dialogueMode !== null || isBudgetConsoleOpen;

  const currentDialogueText = useMemo(() => {
    if (dialogueMode === 'intro') {
      return introDialogue[dialogueIndex] || '';
    }

    if (dialogueMode === 'advisorMain') {
      const entry = advisorMainDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }

    if (dialogueMode === 'advisorRepeat') {
      const entry = advisorRepeatDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }

    return '';
  }, [dialogueMode, dialogueIndex]);

  const speakerName = useMemo(() => {
    if (dialogueMode === 'intro') return 'Carmina';

    if (dialogueMode === 'advisorMain') {
      const entry = advisorMainDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    if (dialogueMode === 'advisorRepeat') {
      const entry = advisorRepeatDialogue[dialogueIndex];
      return entry ? entry.speaker : '';
    }

    return '';
  }, [dialogueMode, dialogueIndex]);

  const canMove = !isDialogueVisible;

  const handleStep = useCallback(() => {
    // triggers al pisar, si quieres luego
  }, []);

  const {
    tilePosition,
    pixelPosition,
    isMoving,
    direction,
  } = usePlayerMovement({
    initialTilePosition: unit1PlayerStart,
    tileSize: unit1TileSize,
    mapMatrix: unit1MapMatrix,
    blockingTileTypes: [1, 2],
    interactiveTileTypes: [],
    moveDuration: 260,
    onStep: handleStep,
    canMove,
  });

  const handleTileClick = ({ x, y, value }) => {
    // si hay diálogo o menú abierto, ignoramos clicks
    if (isDialogueVisible) return;

    if (value !== 2) return;

    const dx = Math.abs(x - tilePosition.x);
    const dy = Math.abs(y - tilePosition.y);
    if (Math.max(dx, dy) > 1) return;

    const zoneMeta =
      unit1InteractiveZones.find((z) => z.x === x && z.y === y) || null;

    if (!zoneMeta) return;

    // Asesor
    if (zoneMeta.type === 'advisor') {
      if (!advisorMainDone) {
        setDialogueMode('advisorMain');
        setDialogueIndex(0);
      } else {
        setDialogueMode('advisorRepeat');
        setDialogueIndex(0);
      }
      return;
    }

    // Mesa de presupuesto
    if (zoneMeta.type === 'budget-station') {
      // Solo permitimos usarla si ya hablamos con el asesor
      if (!advisorMainDone) return;

      setIsBudgetConsoleOpen(true);
      return;
    }

    // Otros tipos por ahora los ignoramos
  };

  const handleDialogueNext = () => {
    if (dialogueMode === 'intro') {
      if (dialogueIndex < introDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
      }
      return;
    }

    if (dialogueMode === 'advisorMain') {
      if (dialogueIndex < advisorMainDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
        setAdvisorMainDone(true); // ya hicimos la charla principal
      }
      return;
    }

    if (dialogueMode === 'advisorRepeat') {
      if (dialogueIndex < advisorRepeatDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setDialogueMode(null);
        setDialogueIndex(0);
      }
    }
  };

  return (
    <div className="unit1-game-container">
      <TileMap
        mapMatrix={unit1MapMatrix}
        tileSize={unit1TileSize}
        mapImage={hallImage}
        onTileClick={handleTileClick}
      >
        <Player
          pixelPosition={pixelPosition}
          tileSize={unit1TileSize}
          isMoving={isMoving}
          spriteSheet={girlSpriteSheet}
          direction={direction}
        />
      </TileMap>

      {/* Cuadro de diálogo normal (Carmina/Asesor) */}
      <DialogueBox
        visible={dialogueMode !== null}
        text={currentDialogueText}
        speakingSprite={girlFaceTalking}
        idleSprite={girlFaceNeutral}
        speakerName={speakerName}
        onNext={handleDialogueNext}
      />

      {/* Menú de la mesa de presupuesto (monitor MK23) */}
      <BudgetConsole
        visible={isBudgetConsoleOpen}
        onClose={() => setIsBudgetConsoleOpen(false)}
        computerImage={budgetComputerImage}
      />
    </div>
  );
}

export default Unit1GameScene;
