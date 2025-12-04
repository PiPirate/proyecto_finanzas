import { useState, useEffect, useRef } from 'react';

export function usePlayerMovement(initialPosition, mapData, options = {}) {
  const [position, setPosition] = useState(initialPosition);
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);

  const keyState = useRef(new Set());

  const MOVE_COOLDOWN = options.moveCooldown ?? 160;

  const isWalkable = (x, y) => {
    if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[0].length) return false;
    return mapData[y][x] === 0;
  };

  const movePlayer = (dir) => {
    let { x, y } = position;

    switch (dir) {
      case 'up':    y -= 1; break;
      case 'down':  y += 1; break;
      case 'left':  x -= 1; break;
      case 'right': x += 1; break;
    }

    if (isWalkable(x, y)) {
      setIsMoving(true);
      setDirection(dir);
      setPosition({ x, y });

      setTimeout(() => setIsMoving(false), MOVE_COOLDOWN);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      keyState.current.add(key);

      const keys = keyState.current;

      // DIAGONALES (W+A, W+D, S+A, S+D)
      if ((keys.has('w') || keys.has('arrowup')) && (keys.has('a') || keys.has('arrowleft'))) {
        e.preventDefault();
        movePlayer('up');
        setTimeout(() => movePlayer('left'), 30);
        return;
      }

      if ((keys.has('w') || keys.has('arrowup')) && (keys.has('d') || keys.has('arrowright'))) {
        e.preventDefault();
        movePlayer('up');
        setTimeout(() => movePlayer('right'), 30);
        return;
      }

      if ((keys.has('s') || keys.has('arrowdown')) && (keys.has('a') || keys.has('arrowleft'))) {
        e.preventDefault();
        movePlayer('down');
        setTimeout(() => movePlayer('left'), 30);
        return;
      }

      if ((keys.has('s') || keys.has('arrowdown')) && (keys.has('d') || keys.has('arrowright'))) {
        e.preventDefault();
        movePlayer('down');
        setTimeout(() => movePlayer('right'), 30);
        return;
      }

      // Movimiento normal
      switch (key) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          movePlayer('up');
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    const handleKeyUp = (e) => {
      keyState.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [position]);

  return { position, direction, isMoving };
}
