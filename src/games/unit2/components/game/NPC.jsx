
import mk25Frame1 from '../../assets/asesor1.png';
import mk25Frame2 from '../../assets/asesor2.png';
import mk25Frame3 from '../../assets/asesor3.png';
import mk25Frame4 from '../../assets/asesor4.png';
import mk25Frame5 from '../../assets/asesor5.png';

import React, { useState, useEffect } from 'react';

export function NPC({ x, y, icon, sprite, name, isMoving = false, direction = 'down', tileSize = 64 }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // Animación de frames para MK-25 con tiempos variables
useEffect(() => {
  if (name !== 'MK-25' || isMoving) return;

  // Delays por frame
  const delays = [15000, 3000, 1000, 1500, 1000];
  let frame = currentFrame;

  // Ejecuta el primer ciclo
  let timeout = setTimeout(function tick() {
    frame = (frame + 1) % 5;
    setCurrentFrame(frame);

    timeout = setTimeout(tick, delays[frame]);
  }, delays[frame]);

  return () => clearTimeout(timeout);
}, [name, isMoving]);

  
  // Determinar qué sprite usar
  const getSprite = () => {
    if (name === 'MK-25') {
      // Placeholder para sprites de MK-25
      const frames = [
        mk25Frame1,
        mk25Frame2,
        mk25Frame3,
        mk25Frame4,
        mk25Frame5,
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
