// src/games/unit1/Unit1GameScene.jsx
import React, { useCallback, useState, useMemo } from 'react';
import TileMap from '../core/map/TileMap';
import Player from '../core/player/Player';
import usePlayerMovement from '../core/hooks/usePlayerMovement';
import DialogueBox from '../core/dialogue/DialogueBox';

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

import './Unit1GameScene.css';

// Diálogo inicial (habla Carmina)
const introDialogue = [
  'Bueno… aquí estamos. Primera unidad del módulo de finanzas...',
  'La verdad, al igual que tú, siempre he querido aprender a organizar mejor mi dinero...',
  'Pero nunca supe muy bien por dónde empezar.',
  'Aquí vamos a aprender a convertir nuestras ideas sueltas en metas claras y alcanzables.',
  'Para empezar, vamos a hablar con el asesor financiero de aquella mesa. Él nos guiará por todo este proceso.',
  'Acércate a él y haz click en su escritorio para comenzar.',
];

// Diálogo con el asesor (multi-personaje)
const advisorDialogue = [
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
  // Respuesta de Carmina
  {
    speaker: 'Carmina',
    text: 'Suena genial. ¿Cuál es el siguiente paso?',
  },
  // Respuesta final del asesor, ahora en 3 líneas distintas
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

function Unit1GameScene({ onGoalReached }) {
  // 'intro' | 'advisor' | null
  const [dialogueMode, setDialogueMode] = useState('intro');
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const isDialogueVisible = dialogueMode !== null;

  const currentDialogueText = useMemo(() => {
    if (dialogueMode === 'intro') {
      return introDialogue[dialogueIndex] || '';
    }
    if (dialogueMode === 'advisor') {
      const entry = advisorDialogue[dialogueIndex];
      return entry ? entry.text : '';
    }
    return '';
  }, [dialogueMode, dialogueIndex]);

  // Nombre del personaje que habla
  const speakerName = useMemo(() => {
    if (dialogueMode === 'intro') return 'Carmina';
    if (dialogueMode === 'advisor') {
      const entry = advisorDialogue[dialogueIndex];
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
    // si hay diálogo abierto, ignoramos clicks
    if (isDialogueVisible) return;

    // solo reaccionamos a tiles interactivos
    if (value !== 2) return;

    // debe estar cerca (máx 1 tile)
    const dx = Math.abs(x - tilePosition.x);
    const dy = Math.abs(y - tilePosition.y);
    if (Math.max(dx, dy) > 1) return;

    const zoneMeta =
      unit1InteractiveZones.find((z) => z.x === x && z.y === y) || null;

    if (!zoneMeta) return;

    // Por ahora, solo queremos que funcione el asesor
    if (zoneMeta.type !== 'advisor') {
      return;
    }

    // Abrimos diálogo con el asesor (incluye la réplica de Carmina)
    setDialogueMode('advisor');
    setDialogueIndex(0);
  };

  const handleDialogueNext = () => {
    if (dialogueMode === 'intro') {
      if (dialogueIndex < introDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        // terminó intro → cerramos diálogo y permitimos movimiento
        setDialogueMode(null);
        setDialogueIndex(0);
      }
      return;
    }

    if (dialogueMode === 'advisor') {
      if (dialogueIndex < advisorDialogue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        // terminó conversación con el asesor → cerramos diálogo
        setDialogueMode(null);
        setDialogueIndex(0);

        // Aquí luego puedes activar la mesa BUDGET
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

      <DialogueBox
        visible={isDialogueVisible}
        text={currentDialogueText}
        speakingSprite={girlFaceTalking}
        idleSprite={girlFaceNeutral}
        speakerName={speakerName}
        onNext={handleDialogueNext}
      />
    </div>
  );
}

export default Unit1GameScene;
