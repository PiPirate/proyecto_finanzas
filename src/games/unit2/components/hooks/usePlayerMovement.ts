import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export function usePlayerMovement(initialPosition: Position, mapData: number[][]) {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);

  const isValidMove = (x: number, y: number): boolean => {
    if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[0].length) {
      return false;
    }
    return mapData[y][x] === 0; // 0 = caminable, 1 = bloqueado
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let newX = position.x;
      let newY = position.y;
      let newDirection = direction;

      switch (key) {
        case 'arrowup':
        case 'w':
          newY -= 1;
          newDirection = 'up';
          break;
        case 'arrowdown':
        case 's':
          newY += 1;
          newDirection = 'down';
          break;
        case 'arrowleft':
        case 'a':
          newX -= 1;
          newDirection = 'left';
          break;
        case 'arrowright':
        case 'd':
          newX += 1;
          newDirection = 'right';
          break;
        default:
          return;
      }

      if (isValidMove(newX, newY)) {
        setIsMoving(true);
        setDirection(newDirection);
        setPosition({ x: newX, y: newY });

        // Reset moving state después de la animación
        setTimeout(() => setIsMoving(false), 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, direction, mapData]);

  return { position, direction, isMoving };
}
