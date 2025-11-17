import React, { useState, useEffect } from 'react';

// Assets importados desde Figma
import mk25Frame1 from '../../assets/asesor1.png';
import mk25Frame2 from '../../assets/asesor2.png';
import mk25Frame3 from '../../assets/asesor3.png';
import mk25Frame4 from '../../assets/asesor4.png';
import mk25Frame5 from '../../assets/asesor5.png';

export function NPC({
  x,
  y,
  icon,
  sprite,
  name,
  isMoving = false,
  direction = 'down',
  tileSize = 64
}) {
  const [currentFrame, setCurrentFrame] = useState(0);

  /* ----------------------------------------------------
     Animación especial SOLO para MK-25 (cuando NO se mueve)
     Con tiempos variables entre frame → frame.
  ------------------------------------------------------- */
  useEffect(() => {
    if (name === 'MK-25' && !isMoving) {
      let timeout;

      const scheduleNextFrame = (frameIndex) => {
        const delays = [
          15000, // frame 0 → 1 (pausa larga)
          3000,  // frame 1 → 2
          1000,  // frame 2 → 3
          1500,  // frame 3 → 4
          1000,  // frame 4 → 0
        ];

        const delay = delays[frameIndex];

        timeout = setTimeout(() => {
          setCurrentFrame(prev => {
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

  // Selecciona el frame actual
  const getSprite = () => {
    if (name === 'MK-25') {
      const frames = [mk25Frame1, mk25Frame2, mk25Frame3, mk25Frame4, mk25Frame5];
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
        zIndex: 15
      }}
    >

      {/* Brillo verde solo para MK-25 */}
      {name === 'MK-25' && <div className="npc-glow"></div>}

      <div
        className="npc-sprite"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {(sprite || name === 'MK-25') ? (
          <img
            src={getSprite()}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              position: 'absolute',
              bottom: '0',
              transform: 'scale(2.04)',
              transformOrigin: 'center bottom',
              imageRendering: 'pixelated',
              zIndex: 1
            }}
          />
        ) : (
          <span className="npc-icon">{icon}</span>
        )}
      </div>

      {/* Sombra debajo del NPC */}
      <div className="npc-shadow" />
    </div>
  );
}
