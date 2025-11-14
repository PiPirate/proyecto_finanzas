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

// NUEVO: dos tirillas de rostro
import girlFaceTalking from '../../assets/general/player_face_hablando.png';
import girlFaceNeutral from '../../assets/general/player_face_neutral.png';

import './Unit1GameScene.css';

const introDialogue = [
  'Bueno… aquí estamos. Primera unidad del módulo de finanzas',
  'La verdad, al igual que tú, siempre he querido aprender a organizar mejor mi dinero',
  'pero nunca supe muy bien por dónde empezar.',
  'Aquí vamos a aprender a convertir nuestras ideas sueltas en metas claras y alcanzables.',
  'Para empezar, vamos a hablar con el asesor financiero de aquella mesa. Él nos guiará por todo este proceso.',
  'Acércate a él y haz click en su escritorio para comenzar.',

];

function Unit1GameScene({ onGoalReached }) {
  const [dialogueMode, setDialogueMode] = useState('intro'); // 'intro' | null
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const isDialogueVisible = dialogueMode !== null;

  const currentDialogueText = useMemo(() => {
    if (dialogueMode === 'intro') {
      return introDialogue[dialogueIndex] || '';
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
    if (isDialogueVisible) return;
    if (value !== 2) return;

    const dx = Math.abs(x - tilePosition.x);
    const dy = Math.abs(y - tilePosition.y);
    if (Math.max(dx, dy) > 1) return;

    const zoneMeta =
      unit1InteractiveZones.find((z) => z.x === x && z.y === y) || null;

    if (!zoneMeta) return;

    console.log('Click en zona interactiva:', zoneMeta);
    // aquí luego abriremos diálogos específicos según advisor/budget/piggy
  };

  const handleDialogueNext = () => {
    if (dialogueMode === 'intro') {
      if (dialogueIndex < introDialogue.length - 1) {
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

      <DialogueBox
        visible={isDialogueVisible}
        text={currentDialogueText}
        speakingSprite={girlFaceTalking}
        idleSprite={girlFaceNeutral}
        onNext={handleDialogueNext}
      />
    </div>
  );
}

export default Unit1GameScene;
