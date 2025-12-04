// src/games/core/hooks/usePlayerMovement.js
import { useState, useEffect, useRef } from 'react';

export default function usePlayerMovement({
  initialTilePosition,
  tileSize,
  mapMatrix,
  blockingTileTypes = [1],
  interactiveTileTypes = [2],
  moveDuration = 260,
  onStep,
  canMove = true,
}) {
  const [tilePosition, setTilePosition] = useState(initialTilePosition);
  const [pixelPosition, setPixelPosition] = useState({
    x: initialTilePosition.x * tileSize + tileSize / 2,
    y: initialTilePosition.y * tileSize + tileSize / 2,
  });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState('down');

  const tilePosRef = useRef(tilePosition);
  const pixelPosRef = useRef(pixelPosition);
  const movingRef = useRef(false);

  // dirección que se está manteniendo presionada (w/a/s/d)
  const heldDirectionRef = useRef(null);

  useEffect(() => {
    tilePosRef.current = tilePosition;
  }, [tilePosition]);

  useEffect(() => {
    pixelPosRef.current = pixelPosition;
  }, [pixelPosition]);

  useEffect(() => {
    // mapea dirección a desplazamiento en tiles
    const getDeltaFromDirection = (dir) => {
      switch (dir) {
        case 'up':
          return { dx: 0, dy: -1 };
        case 'down':
          return { dx: 0, dy: 1 };
        case 'left':
          return { dx: -1, dy: 0 };
        case 'right':
          return { dx: 1, dy: 0 };
        default:
          return { dx: 0, dy: 0 };
      }
    };

    const attemptMove = (dir) => {
      if (!canMove) return;
      if (movingRef.current) return;

      const { dx, dy } = getDeltaFromDirection(dir);
      const { x, y } = tilePosRef.current;
      const targetX = x + dx;
      const targetY = y + dy;

      // límites del mapa
      if (
        targetY < 0 ||
        targetY >= mapMatrix.length ||
        targetX < 0 ||
        targetX >= mapMatrix[0].length
      ) {
        setDirection(dir);
        return;
      }

      const tileValue = mapMatrix[targetY][targetX];

      // colisión
      if (blockingTileTypes.includes(tileValue)) {
        setDirection(dir);
        return;
      }

      const startPixel = pixelPosRef.current;
      const endPixel = {
        x: targetX * tileSize + tileSize / 2,
        y: targetY * tileSize + tileSize / 2,
      };

      movingRef.current = true;
      setIsMoving(true);
      setDirection(dir);

      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / moveDuration, 1);

        const nx = startPixel.x + (endPixel.x - startPixel.x) * t;
        const ny = startPixel.y + (endPixel.y - startPixel.y) * t;

        setPixelPosition({ x: nx, y: ny });

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          movingRef.current = false;
          setIsMoving(false);
          setTilePosition({ x: targetX, y: targetY });

          if (interactiveTileTypes.includes(tileValue) && onStep) {
            onStep({
              tilePosition: { x: targetX, y: targetY },
              tile: tileValue,
              isInteractive: true,
            });
          } else if (onStep) {
            onStep({
              tilePosition: { x: targetX, y: targetY },
              tile: tileValue,
              isInteractive: false,
            });
          }

          // movimiento continuo: si la tecla sigue presionada,
          // vuelve a intentar moverse en la misma dirección
          if (heldDirectionRef.current === dir && canMove) {
            requestAnimationFrame(() => attemptMove(dir));
          }
        }
      };

      requestAnimationFrame(step);
    };

    const handleKeyDown = (e) => {
      if (!canMove) return;

      const key = e.key.toLowerCase();

      // bloqueamos las flechas para que no muevan la página
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        return;
      }

      let newDirection = null;

      if (key === 'w') {
        newDirection = 'up';
      } else if (key === 's') {
        newDirection = 'down';
      } else if (key === 'a') {
        newDirection = 'left';
      } else if (key === 'd') {
        newDirection = 'right';
      } else {
        return; // cualquier otra tecla se ignora
      }

      e.preventDefault();

      // guardamos la dirección que está sostenida
      heldDirectionRef.current = newDirection;

      // si no se está moviendo, iniciamos el movimiento
      if (!movingRef.current) {
        attemptMove(newDirection);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      let dirReleased = null;

      if (key === 'w') dirReleased = 'up';
      else if (key === 's') dirReleased = 'down';
      else if (key === 'a') dirReleased = 'left';
      else if (key === 'd') dirReleased = 'right';

      if (dirReleased && heldDirectionRef.current === dirReleased) {
        heldDirectionRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    mapMatrix,
    tileSize,
    moveDuration,
    blockingTileTypes,
    interactiveTileTypes,
    onStep,
    canMove,
  ]);

  return {
    tilePosition,
    pixelPosition,
    isMoving,
    direction,
  };
}
