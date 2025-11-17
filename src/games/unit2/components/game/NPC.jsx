import React, { useState, useEffect } from 'react';

export function NPC({ x, y, icon, sprite, name, isMoving = false, direction = 'down', tileSize = 64 }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // Animación de frames para MK-25 con tiempos variables
  useEffect(() => {
    if (name === 'MK-25' && !isMoving) {
      let timeout;
      
      const scheduleNextFrame = (frameIndex) => {
        const delays = [
          15000, // Frame 0 → Frame 1: 15 segundos
          3000,  // Frame 1 → Frame 2: 3 segundos
          1000,  // Frame 2 → Frame 3: 1 segundo
          1500,  // Frame 3 → Frame 4: 1.5 segundos
          1000,  // Frame 4 → Frame 0: 1 segundo
        ];
        
        const delay = delays[frameIndex];
        
        timeout = setTimeout(() => {
          setCurrentFrame((prev) => {
            const nextFrame = (prev + 1) % 5;
            scheduleNextFrame(nextFrame);
            return nextFrame;
          });
        }, delay);
      };
      
      scheduleNextFrame(currentFrame);
      
      return () => clearTimeout(timeout);
    }
  }, [name, isMoving]);
  
  // Determinar qué sprite usar
  const getSprite = () => {
    if (name === 'MK-25') {
      // Placeholder para sprites de MK-25
      const frames = [
        '/assets/mk25-frame1.png',
        '/assets/mk25-frame2.png',
        '/assets/mk25-frame3.png',
        '/assets/mk25-frame4.png',
        '/assets/mk25-frame5.png'
      ];
      return frames[currentFrame];
    }
    return sprite;
  };
  
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
      {name === 'MK-25' && <div className="npc-glow"></div>}
      
      <div className="npc-sprite" style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {(sprite || name === 'MK-25') ? (
          <img 
            src={getSprite()} 
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))',
              position: 'absolute',
              bottom: '0',
              transform: 'scale(2.04)',
              transformOrigin: 'center bottom',
              imageRendering: 'pixelated',
              zIndex: 1,
            }}
          />
        ) : (
          <span className="npc-icon">{icon}</span>
        )}
      </div>
      <div className="npc-shadow" />
    </div>
  );
}
