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

  useEffect(() => {
    tilePosRef.current = tilePosition;
  }, [tilePosition]);

  useEffect(() => {
    pixelPosRef.current = pixelPosition;
  }, [pixelPosition]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!canMove) return;
      if (movingRef.current) return;

      let dx = 0;
      let dy = 0;
      let newDirection = direction;

      if (e.key === 'ArrowUp' || e.key === 'w') {
        dy = -1;
        newDirection = 'up';
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        dy = 1;
        newDirection = 'down';
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        dx = -1;
        newDirection = 'left';
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        dx = 1;
        newDirection = 'right';
      } else {
        return;
      }

      e.preventDefault();

      const { x, y } = tilePosRef.current;
      const targetX = x + dx;
      const targetY = y + dy;

      if (
        targetY < 0 ||
        targetY >= mapMatrix.length ||
        targetX < 0 ||
        targetX >= mapMatrix[0].length
      ) {
        setDirection(newDirection);
        return;
      }

      const tileValue = mapMatrix[targetY][targetX];

      if (blockingTileTypes.includes(tileValue)) {
        setDirection(newDirection);
        return;
      }

      const startPixel = pixelPosRef.current;
      const endPixel = {
        x: targetX * tileSize + tileSize / 2,
        y: targetY * tileSize + tileSize / 2,
      };

      movingRef.current = true;
      setIsMoving(true);
      setDirection(newDirection);

      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / moveDuration, 1);

        const nx = startPixel.x + (endPixel.x - startPixel.x) * t;
        const ny = startPixel.y + (endPixel.y - startPixel.y) * t;

        setPixelPosition({ x: nx, y: ny });

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          setTilePosition({ x: targetX, y: targetY });
          movingRef.current = false;
          setIsMoving(false);

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
        }
      }

      requestAnimationFrame(step);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    mapMatrix,
    tileSize,
    moveDuration,
    blockingTileTypes,
    interactiveTileTypes,
    onStep,
    direction,
    canMove,
  ]);

  return {
    tilePosition,
    pixelPosition,
    isMoving,
    direction,
  };
}
