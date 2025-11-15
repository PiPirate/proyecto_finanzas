import React from 'react';

interface PlayerProps {
  position: { x: number; y: number };
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
}

export function Player({ position, direction, isMoving }: PlayerProps) {
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
      {/* ASSET: Sprite sheet del personaje (caminar + idle) */}
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

      {/* Sombra del personaje */}
      <div className="player-shadow" />
    </div>
  );
}
