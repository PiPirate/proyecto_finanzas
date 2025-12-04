// src/games/unit2/components/GameEvaluation.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';

import { TileMap } from '../components/game/TileMap';
import { Player } from '../components/game/Player';
import DialogueBox from '../components/game/DialogueBox';
import { PuzzleGamePanel } from './game/PuzzleGamePanel';
import { gameMap } from '../components/data/gameMap';
import useCameraFollow from '../../core/hooks/useCameraFollow';
import { useDeviceMode } from '../../../hooks/useDeviceMode';

export function GameWorldSimple({ onComplete }) {
  const { isMobile } = useDeviceMode();

  // Estado base
  const [playerPos, setPlayerPos] = useState({ x: 8, y: 10 });
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [gameState, setGameState] = useState('exploring'); // exploring | dialogue | puzzle_game

  const [currentDialogueQueue, setCurrentDialogueQueue] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [facingObjectName, setFacingObjectName] = useState(null);

  const [introShown, setIntroShown] = useState(false);
  const [pendingCompletion, setPendingCompletion] = useState(false); // se pone en true cuando el puzzle terminó bien

  const TILE_SIZE = 64;
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Cámara responsiva EXACTA a GameWorld
  const mapDimensions = useMemo(
    () => ({
      width: gameMap[0].length * TILE_SIZE,
      height: gameMap.length * TILE_SIZE
    }),
    []
  );

  const playerPixelPosition = useMemo(
    () => ({
      x: playerPos.x * TILE_SIZE + TILE_SIZE / 2,
      y: playerPos.y * TILE_SIZE + TILE_SIZE / 2
    }),
    [playerPos]
  );

  const { cameraPosition, viewportRef } = useCameraFollow({
    playerPixelPosition,
    mapDimensions,
    isEnabled: isMobile
  });

  // Objeto interactivo único
  const computerObject = {
    id: 'management_pc',
    name: '💻 Computadora',
    x: 10,
    y: 1
  };

  const introDialogue = [
    {
      speaker: 'system',
      text: 'Dirígete a la computadora para realizar la evaluación final de esta unidad.',
      emotion: 'neutral'
    }
  ];

  // Mostrar intro
  useEffect(() => {
    if (!introShown) {
      const t = setTimeout(() => {
        startDialogueSequence(introDialogue);
        setIntroShown(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [introShown]);

  // Funciones base

  const startDialogueSequence = (dialogues) => {
    setCurrentDialogueQueue(dialogues);
    setCurrentDialogueIndex(0);
    setGameState('dialogue');
  };

  const isWalkable = (x, y) => {
    if (y < 0 || y >= gameMap.length || x < 0 || x >= gameMap[0].length) {
      return false;
    }
    return gameMap[y][x] === 0;
  };

  const getObjectAt = (x, y) => {
    if (
      Math.abs(x - computerObject.x) < 0.6 &&
      Math.abs(y - computerObject.y) < 0.6
    ) {
      return computerObject;
    }
    return null;
  };

  const updateFacingObject = (x, y, dir) => {
    let targetX = x;
    let targetY = y;

    if (dir === 'up') targetY -= 1;
    if (dir === 'down') targetY += 1;
    if (dir === 'left') targetX -= 1;
    if (dir === 'right') targetX += 1;

    const obj = getObjectAt(targetX, targetY);
    const nearby =
      obj &&
      Math.abs(x - obj.x) <= 1 &&
      Math.abs(y - obj.y) <= 1;

    setFacingObjectName(nearby ? obj.name : null);
  };

  const handleMove = useCallback(
    (dir) => {
      if (gameState !== 'exploring') return;

      setDirection(dir);

      const moves = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      };

      const next = {
        x: playerPos.x + moves[dir].x,
        y: playerPos.y + moves[dir].y
      };

      if (isWalkable(next.x, next.y)) {
        setIsMoving(true);
        setPlayerPos(next);
        setTimeout(() => setIsMoving(false), 200);
      }

      updateFacingObject(next.x, next.y, dir);
    },
    [playerPos, gameState]
  );

  const handleInteract = useCallback(() => {
    if (gameState !== 'exploring') return;

    let tx = playerPos.x;
    let ty = playerPos.y;

    if (direction === 'up') ty -= 1;
    if (direction === 'down') ty += 1;
    if (direction === 'left') tx -= 1;
    if (direction === 'right') tx += 1;

    const obj = getObjectAt(tx, ty);

    if (obj && obj.id === 'management_pc') {
      setGameState('puzzle_game');
    }
  }, [playerPos, direction, gameState]);

  const handleDialogueAdvance = () => {
    if (currentDialogueIndex < currentDialogueQueue.length - 1) {
      setCurrentDialogueIndex((p) => p + 1);
      return;
    }

    // Último diálogo de la cola
    setCurrentDialogueQueue([]);
    setCurrentDialogueIndex(0);

    // Si venimos de un puzzle completado, aquí disparamos el onComplete del padre
    if (pendingCompletion && typeof onComplete === 'function') {
      setPendingCompletion(false);
      onComplete();
      // no hace falta setGameState, el padre normalmente va a navegar fuera
    } else {
      setGameState('exploring');
    }
  };

  // Controles teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();

      if (k === 'enter' || k === ' ' || k === 'z') {
        e.preventDefault();
        if (gameState === 'dialogue') handleDialogueAdvance();
        else handleInteract();
        return;
      }

      if (gameState !== 'exploring') return;

      if (k === 'arrowup' || k === 'w') handleMove('up');
      if (k === 'arrowdown' || k === 's') handleMove('down');
      if (k === 'arrowleft' || k === 'a') handleMove('left');
      if (k === 'arrowright' || k === 'd') handleMove('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleInteract, gameState, handleDialogueAdvance]);

  // Touch Controls
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;

    const dx =
      e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy =
      e.changedTouches[0].clientY - touchStartRef.current.y;

    const ax = Math.abs(dx);
    const ay = Math.abs(dy);

    const threshold = 24;

    if (ax < threshold && ay < threshold) {
      if (gameState === 'dialogue') handleDialogueAdvance();
      else handleInteract();
      return;
    }

    if (gameState !== 'exploring') return;

    if (ax > ay) handleMove(dx > 0 ? 'right' : 'left');
    else handleMove(dy > 0 ? 'down' : 'up');
  };

  // Render

  const viewportStyle = isMobile
    ? {
        width: '100%',
        height: '100%',
        minHeight: 'var(--app-vh, 100dvh)',
        overflow: 'hidden'
      }
    : undefined;

  const cameraStyle = isMobile
    ? {
        transform: `translate(${-cameraPosition.x}px, ${-cameraPosition.y}px)`
      }
    : undefined;

  return (
    <div
      className="game-world"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      <div
        className="game-world-container"
        ref={isMobile ? viewportRef : null}
        style={viewportStyle}
      >
        <div className="game-world-layer" style={cameraStyle}>
          <TileMap mapData={gameMap} />

          {/* Computadora Interactiva */}
          <div
            className="interactive-object"
            style={{
              position: 'absolute',
              left: `${computerObject.x * TILE_SIZE}px`,
              top: `${computerObject.y * TILE_SIZE}px`,
              width: TILE_SIZE,
              height: TILE_SIZE,
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            <div className="object-glow" />
            {facingObjectName && (
              <div className="object-label">{facingObjectName}</div>
            )}
          </div>

          {/* Jugador */}
          <Player
            position={playerPos}
            direction={direction}
            isMoving={isMoving}
          />
        </div>

        {gameState === 'puzzle_game' && (
          <PuzzleGamePanel
            onComplete={() => {
              // Puzzle completado con éxito:
              // activamos bandera y mostramos diálogo de cierre.
              setPendingCompletion(true);
              setCurrentDialogueQueue([
                {
                  speaker: 'system',
                  text: '✅ Has completado la evaluación interactiva de esta unidad.',
                  emotion: 'neutral'
                },
                {
                  speaker: 'system',
                  text: 'Tus decisiones en el dungeon mostraron cómo aplicas la regla del equilibrio entre necesidades, gustos y ahorro.',
                  emotion: 'neutral'
                },
                {
                  speaker: 'system',
                  text: 'Ahora regresarás al menú para cerrar esta misión y continuar con otros retos financieros.',
                  emotion: 'neutral'
                }
              ]);
              setCurrentDialogueIndex(0);
              setGameState('dialogue');
            }}
            onClose={() => {
              // Cerrar el panel sin completar: vuelves a explorar
              setGameState('exploring');
            }}
          />
        )}
      </div>

      {/* Diálogo */}
      {gameState === 'dialogue' &&
        currentDialogueQueue[currentDialogueIndex] && (
          <DialogueBox
            text={currentDialogueQueue[currentDialogueIndex].text}
            speakerName="Sistema"
            onNext={handleDialogueAdvance}
          />
        )}

      {/* Hint inferior */}
      {gameState === 'exploring' && facingObjectName && (
        <div className="interaction-bar">
          <div className="interaction-bar-content">
            <span className="interaction-bar-object">
              {facingObjectName}
            </span>
            <span className="interaction-bar-key">▼ Presiona ENTER</span>
          </div>
        </div>
      )}
    </div>
  );
}
