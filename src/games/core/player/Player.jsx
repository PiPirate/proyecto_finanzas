// src/games/core/player/Player.jsx
import React from 'react';
import './Player.css';

// Props:
// - pixelPosition: { x, y } en píxeles (centro del personaje)
// - tileSize
// - isMoving
// - spriteSheet
// - direction: 'up' | 'down' | 'left' | 'right'
function Player({ pixelPosition, tileSize, isMoving, spriteSheet, direction }) {
  const size = tileSize * 8.5; // ajusta si la quieres más grande/pequeña

  // Por defecto el sprite mira a la izquierda.
  // Si la dirección es 'right', lo espejamos horizontalmente.
  const flipX = direction === 'right' ? -1 : 1;

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    left: `${pixelPosition.x - size / 2}px`,
    top: `${pixelPosition.y - size / 2}px`,
    backgroundImage: spriteSheet ? `url(${spriteSheet})` : 'none',
    transform: `scaleX(${flipX})`,
  };

  const className = isMoving ? 'player player--moving' : 'player';

  return <div className={className} style={style} />;
}

export default Player;
