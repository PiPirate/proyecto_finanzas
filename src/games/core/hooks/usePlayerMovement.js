// src/games/core/hooks/usePlayerMovement.js
import { useState, useEffect, useRef } from 'react';

// Convierte posición en tiles a coordenadas en píxeles (centro del tile)
function tileToPixel(tilePos, tileSize) {
  return {
    x: (tilePos.x + 0.5) * tileSize,
    y: (tilePos.y + 0.5) * tileSize,
  };
}

// options = {
//   initialTilePosition: { x, y },
//   tileSize,
//   mapMatrix,
//   blockingTileTypes: [1],
//   interactiveTileTypes: [2],
//   moveDuration: 260, // ms por tile
//   onStep: ({ tilePosition, tile, isInteractive, direction }) => {}
// }
export default function usePlayerMovement(options) {
  const {
    initialTilePosition,
    tileSize,
    mapMatrix,
    blockingTileTypes = [1],
    interactiveTileTypes = [2],
    moveDuration = 260,
    onStep,
  } = options;

  const [tilePosition, setTilePosition] = useState(initialTilePosition);
  const [pixelPosition, setPixelPosition] = useState(
    tileToPixel(initialTilePosition, tileSize)
  );
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState('down'); // 'up' | 'down' | 'left' | 'right'

  const animationFrameRef = useRef(null);

  // Limpiar animación si el componente se desmonta
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animación suave entre dos posiciones en píxeles
  const startAnimation = (fromPixel, toPixel) => {
    setIsMoving(true);
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / moveDuration, 1);

      const x = fromPixel.x + (toPixel.x - fromPixel.x) * t;
      const y = fromPixel.y + (toPixel.y - fromPixel.y) * t;

      setPixelPosition({ x, y });

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsMoving(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    function handleKeyDown(event) {
      if (isMoving) return; // si está en medio de un movimiento, espera a que termine

      let dx = 0;
      let dy = 0;
      let newDirection = direction;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dy = -1;
          newDirection = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          dy = 1;
          newDirection = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dx = -1;
          newDirection = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          dx = 1;
          newDirection = 'right';
          break;
        default:
          return;
      }

      event.preventDefault();

      const rows = mapMatrix.length;
      const cols = mapMatrix[0].length;

      const newX = tilePosition.x + dx;
      const newY = tilePosition.y + dy;

      // límites del mapa
      if (newX < 0 || newY < 0 || newX >= cols || newY >= rows) {
        return;
      }

      const tile = mapMatrix[newY][newX];

      // colisión
      if (blockingTileTypes.includes(tile)) {
        return;
      }

      const newTilePos = { x: newX, y: newY };
      const isInteractive = interactiveTileTypes.includes(tile);

      setDirection(newDirection);
      setTilePosition(newTilePos);

      if (typeof onStep === 'function') {
        onStep({
          tilePosition: newTilePos,
          tile,
          isInteractive,
          direction: newDirection,
        });
      }

      const fromPixel = tileToPixel(tilePosition, tileSize);
      const toPixel = tileToPixel(newTilePos, tileSize);
      startAnimation(fromPixel, toPixel);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    mapMatrix,
    blockingTileTypes,
    interactiveTileTypes,
    onStep,
    isMoving,
    tilePosition,
    direction,
    tileSize,
  ]);

  return {
    tilePosition,
    pixelPosition,
    isMoving,
    direction,
  };
}
