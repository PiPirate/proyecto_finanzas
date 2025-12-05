import React from 'react';
import playerIdleSprite from '../../assets/SociaStatic.png';
import playerWalkLeftSprite from '../../assets/SociaIzquierda2.png';
import playerWalkDownFrame1 from '../../assets/SociaIzquierda1.png';
import playerWalkDownFrame2 from '../../assets/SociaIzquierda2.png';
import playerWalkUpFrame1 from '../../assets/SociaDerecha2.png';
import playerWalkUpFrame2 from '../../assets/SociaDerecha1.png';

export function Player({ position, direction, isMoving }) {
  const TILE_SIZE = 64;
  const [walkFrame, setWalkFrame] = React.useState(0);
  const [showingIdleSprite, setShowingIdleSprite] = React.useState(true);
  const idleTimeoutRef = React.useRef(null);

  // Alternar frame cada vez que cambia la posición (cada celda)
  React.useEffect(() => {
    if (isMoving && (direction === 'down' || direction === 'up')) {
      setWalkFrame((prev) => (prev + 1) % 2);
    }
  }, [position.x, position.y, isMoving, direction]);

  // Controlar el delay antes de volver al sprite idle
  React.useEffect(() => {
    if (isMoving) {
      // Cuando se mueve, mostrar el sprite de caminar
      setShowingIdleSprite(false);
      // Limpiar cualquier timeout pendiente
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    } else {
      // Cuando se detiene, esperar 400ms antes de volver a idle
      idleTimeoutRef.current = setTimeout(() => {
        setShowingIdleSprite(true);
      }, 400);
    }

    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [isMoving]);

  // Determinar qué sprite usar según la dirección
  const getPlayerSprite = () => {
    // Si debe mostrar idle, mostrar el sprite estático
    if (showingIdleSprite && !isMoving) {
      return playerIdleSprite;
    }

    if (direction === 'left') {
      return playerWalkLeftSprite;
    }
    // Para right, volteamos el sprite de left
    if (direction === 'right') {
      return playerWalkLeftSprite;
    }
    // Para down, usamos los frames de caminar hacia adelante
    if (direction === 'down') {
      return walkFrame === 0 ? playerWalkDownFrame1 : playerWalkDownFrame2;
    }
    // Para up, usamos los frames de caminar hacia atrás
    if (direction === 'up') {
      return walkFrame === 0 ? playerWalkUpFrame1 : playerWalkUpFrame2;
    }
    // Fallback al sprite estático
    return playerIdleSprite;
  };

  return (
    <div
      className={`player player--${direction} ${isMoving ? 'player--moving' : 'player--idle'}`}
      style={{
        position: 'absolute',
        left: `${position.x * TILE_SIZE}px`,
        top: `${position.y * TILE_SIZE}px`,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
        transition: 'left 0.14s ease, top 0.14s ease', // 30% más rápido que 0.2s
        zIndex: 20, // Mayor que el NPC (15) para aparecer encima
      }}
    >
      {/* Sprite del jugador estático */}
    <img
      src={getPlayerSprite()}
      alt="player"
      style={{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
        objectFit: 'contain',
        position: 'absolute',
        bottom: '0',

        /* Mantiene escala correcta y voltea sin romper el tile */
        transform: `
          scale(2.04) 
          scaleX(${direction === 'right' ? -1 : 1})
        `,
        transformOrigin: 'center bottom',

        filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))',
      }}
    />


      {/* Sombra del personaje */}
      <div className="player-shadow" />
    </div>
  );
}