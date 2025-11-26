import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TileMap } from '../components/game/TileMap';
import { Player } from '../components/game/Player';
import DialogueBox from '../components/game/DialogueBox';
import { PuzzleGamePanel } from './game/PuzzleGamePanel';
import { gameMap} from '../components/data/gameMap';
import useCameraFollow from '../../core/hooks/useCameraFollow';
import { useDeviceMode } from '../../../hooks/useDeviceMode';

export function GameWorldSimple({ onComplete }) {
  const [playerPos, setPlayerPos] = useState({ x: 8, y: 10 });
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [gameState, setGameState] = useState('exploring');
  const [currentDialogueQueue, setCurrentDialogueQueue] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [facingObjectName, setFacingObjectName] = useState(null);
  const [canMove, setCanMove] = useState(true);
  const [introShown, setIntroShown] = useState(false);
  const { isMobile } = useDeviceMode();

  const TILE_SIZE = 64;
  const MOVE_COOLDOWN = 200;

  const mapDimensions = useMemo(
    () => ({
      width: gameMap[0].length * TILE_SIZE,
      height: gameMap.length * TILE_SIZE,
    }),
    [TILE_SIZE],
  );

  const playerPixelPosition = useMemo(
    () => ({
      x: playerPos.x * TILE_SIZE + TILE_SIZE / 2,
      y: playerPos.y * TILE_SIZE + TILE_SIZE / 2,
    }),
    [TILE_SIZE, playerPos.x, playerPos.y],
  );

  const { cameraPosition, viewportRef } = useCameraFollow({
    playerPixelPosition,
    mapDimensions,
    isEnabled: isMobile,
  });
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Objeto interactivo simplificado - solo la computadora
  const computerObject = {
    id: 'management_pc',
    name: '💻 Computadora',
    x: 10,
    y: 1,
  };

  // Diálogo inicial
  const introDialogue = [
    {
      speaker: 'system',
      text: 'Dirígete a la computadora en tu habitación para poner a prueba tu conocimiento',
      emotion: 'neutral',
    }
  ];

  // Mostrar intro automáticamente al inicio
  useEffect(() => {
    if (!introShown) {
      setTimeout(() => {
        startDialogueSequence(introDialogue);
        setIntroShown(true);
      }, 500);
    }
  }, []);

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
    if (Math.abs(computerObject.x - x) < 0.6 && Math.abs(computerObject.y - y) < 0.6) {
      return computerObject;
    }
    return null;
  };

  const handleMove = useCallback((newDir) => {
    if (gameState !== 'exploring' || !canMove) return;

    setDirection(newDir);

    let newX = playerPos.x;
    let newY = playerPos.y;

    switch (newDir) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
    }

    if (isWalkable(newX, newY)) {
      setIsMoving(true);
      setPlayerPos({ x: newX, y: newY });
      setTimeout(() => setIsMoving(false), 200);
      setCanMove(false);
      setTimeout(() => setCanMove(true), MOVE_COOLDOWN);
    }
    
    // Detectar objeto enfrentado después del movimiento
    updateFacingObject(newX, newY, newDir);
  }, [playerPos, gameState, canMove]);
  
  const updateFacingObject = (x, y, dir) => {
    let targetX = x;
    let targetY = y;
    
    switch (dir) {
      case 'up':
        targetY -= 1;
        break;
      case 'down':
        targetY += 1;
        break;
      case 'left':
        targetX -= 1;
        break;
      case 'right':
        targetX += 1;
        break;
    }
    
    const obj = getObjectAt(targetX, targetY);
    const isNearby = obj ? Math.abs(x - obj.x) <= 1 && Math.abs(y - obj.y) <= 1 : false;
    
    if (obj && isNearby) {
      setFacingObjectName(obj.name);
    } else {
      setFacingObjectName(null);
    }
  };

  const handleInteract = useCallback(() => {
    if (gameState !== 'exploring') return;

    let interactX = playerPos.x;
    let interactY = playerPos.y;

    switch (direction) {
      case 'up':
        interactY -= 1;
        break;
      case 'down':
        interactY += 1;
        break;
      case 'left':
        interactX -= 1;
        break;
      case 'right':
        interactX += 1;
        break;
    }

    const obj = getObjectAt(interactX, interactY);

    if (obj && obj.id === 'management_pc') {
      // Abrir directamente el puzzle game
      setGameState('puzzle_game');
    }
  }, [playerPos, direction, gameState]);

  const handleTouchStart = (event) => {
    if (!isMobile) return;
    if (gameState !== 'exploring' && gameState !== 'dialogue') return;

    const touch = event.touches?.[0];
    if (!touch) return;

    event.preventDefault();
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    if (!isMobile) return;
    if (gameState !== 'exploring' && gameState !== 'dialogue') return;

    const touch = event.changedTouches?.[0];
    if (!touch) return;

    event.preventDefault();

    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 24;

    if (absX < threshold && absY < threshold) {
      if (gameState === 'dialogue') {
        handleDialogueAdvance();
      } else {
        handleInteract();
      }
      return;
    }

    if (absX > absY) {
      handleMove(dx > 0 ? 'right' : 'left');
    } else {
      handleMove(dy > 0 ? 'down' : 'up');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (key === 'enter' || key === ' ' || key === 'z') {
        e.preventDefault();
        if (gameState === 'dialogue') {
          handleDialogueAdvance();
        } else {
          handleInteract();
        }
        return;
      }

      if (gameState !== 'exploring') return;

      switch (key) {
        case 'arrowup':
        case 'w':
          e.preventDefault();
          handleMove('up');
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          handleMove('down');
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          handleMove('left');
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          handleMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleInteract, gameState, currentDialogueIndex, currentDialogueQueue]);

  const handleDialogueAdvance = () => {
    if (currentDialogueIndex < currentDialogueQueue.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    } else {
      setGameState('exploring');
      setCurrentDialogueQueue([]);
      setCurrentDialogueIndex(0);
    }
  };

  const viewportStyle = isMobile
    ? {
      width: '100%',
      height: '100%',
      minHeight: 'var(--app-vh, 100dvh)',
      overflow: 'hidden',
    }
    : undefined;

  const cameraStyle = isMobile
    ? {
      transform: `translate(${-cameraPosition.x}px, ${-cameraPosition.y}px)`,
    }
    : undefined;

  return (
    <div
      className="game-world"
      style={{ position: 'relative' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={(e) => {
        if (isMobile && gameState === 'exploring') e.preventDefault();
      }}
    >

      <div
        className="game-world-container"
        ref={isMobile ? viewportRef : null}
        style={viewportStyle}
      >
        <div className="game-world-layer" style={cameraStyle}>
          <TileMap mapData={gameMap} />

          {/* Objeto interactivo - Computadora */}
          {(() => {
            const obj = computerObject;
            const isNearby = Math.abs(playerPos.x - obj.x) <= 1 && Math.abs(playerPos.y - obj.y) <= 1;

            let targetX = playerPos.x;
            let targetY = playerPos.y;

            switch (direction) {
              case 'up':
                targetY -= 1;
                break;
              case 'down':
                targetY += 1;
                break;
              case 'left':
                targetX -= 1;
                break;
              case 'right':
                targetX += 1;
                break;
            }

            const facingObject = Math.abs(targetX - obj.x) < 0.6 && Math.abs(targetY - obj.y) < 0.6;

            return (
              <div
                key={obj.id}
                className={`interactive-object ${isNearby && facingObject ? 'interactive-object--highlighted' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${obj.x * TILE_SIZE}px`,
                  top: `${obj.y * TILE_SIZE}px`,
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`,
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              >
                <div className="object-glow"></div>

                {isNearby && facingObject && (
                  <div className="object-label">{obj.name}</div>
                )}
              </div>
            );
          })()}

          <Player position={playerPos} direction={direction} isMoving={isMoving} />

          {/* Puzzle Game */}
          {gameState === 'puzzle_game' && (
            <PuzzleGamePanel
              onComplete={() => {
                setGameState('exploring');
                if (onComplete) {
                  onComplete();
                }
              }}
              onClose={() => {
                setGameState('exploring');
              }}
            />
          )}
        </div>
      </div>

      {/* Diálogos */}
      {gameState === 'dialogue' && currentDialogueQueue && currentDialogueQueue[currentDialogueIndex] && (() => {
        const dialogue = currentDialogueQueue[currentDialogueIndex];
        const speakerName = dialogue.speaker === 'system' ? 'Sistema' : 'Instructor';
        
        return (
          <DialogueBox 
            text={dialogue.text}
            speakerName={speakerName}
            onNext={handleDialogueAdvance}
            speakingSprite={undefined}
            idleSprite={undefined}
          />
        );
      })()}

      {/* Barra de instrucciones inferior */}
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
