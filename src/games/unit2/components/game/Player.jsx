import React from 'react';

export function Player({ position, direction, isMoving }) {
  const TILE_SIZE = 64;

  return (
    <div
      className={`player player--${direction} ${isMoving ? 'player--moving' : 'player--idle'}`}
      style={{
        position: 'absolute',
        left: `${position.x * TILE_SIZE}px`,
        top: `${position.y * TILE_SIZE}px`,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
        transition: 'left 0.2s ease, top 0.2s ease',
        zIndex: 10,
      }}
    >
      <div
        className="player-sprite"
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'var(--player-sprite)',
          backgroundSize: 'cover',
          imageRendering: 'pixelated',
        }}
      />

      <div className="player-shadow" />
    </div>
  );
}
