import React from 'react';

export default function NPC({ 
  x, 
  y, 
  icon, 
  name, 
  isMoving = false, 
  direction = 'down', 
  tileSize = 64 
}) {
  return (
    <div
      className={`npc ${isMoving ? 'npc--moving' : 'npc--idle'} npc--${direction}`}
      style={{
        position: 'absolute',
        left: `${x * tileSize}px`,
        top: `${y * tileSize}px`,
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        transition: 'left 0.3s ease-out, top 0.3s ease-out',
        zIndex: 15,
      }}
    >
      <div className="npc-sprite">
        <span className="npc-icon">{icon}</span>
      </div>

      <div className="npc-shadow" />

      <div className="npc-name-tag">{name}</div>
    </div>
  );
}
