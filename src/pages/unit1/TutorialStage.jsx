import React, { useEffect, useState } from 'react';
import '../css/TutorialStage.css';

import mapImg from '../../assets/unit1/mapa-bosque.jpg';
import playerImg from '../../assets/unit1/player.png';

export default function TutorialStage({ onComplete }) {
  const [player, setPlayer] = useState({ x: 300, y: 500 });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayer((prev) => {
        const speed = 8;
        let { x, y } = prev;

        if (e.key === 'w' || e.key === 'ArrowUp') y -= speed;
        if (e.key === 's' || e.key === 'ArrowDown') y += speed;
        if (e.key === 'a' || e.key === 'ArrowLeft') x -= speed;
        if (e.key === 'd' || e.key === 'ArrowRight') x += speed;

        // Limites del mapa (ajusta a tu imagen)
        x = Math.max(40, Math.min(560, x));
        y = Math.max(50, Math.min(550, y));

        // Zona final arriba
        if (y < 120 && !completed) {
          setCompleted(true);
        }

        return { x, y };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [completed]);

  return (
    <div className="tutorial-map-container">

      {/* MAPA */}
      <img src={mapImg} className="tutorial-map" alt="Mapa del bosque" />

      {/* PERSONAJE */}
      <img
        src={playerImg}
        className="tutorial-player"
        style={{ left: player.x, top: player.y }}
        alt="Jugador"
      />

      {/* MENSAJE SI COMPLETÓ */}
      {completed && (
        <div className="tutorial-success">
          ¡Llegaste al final del camino! 🎉
          <button className="tutorial-continue-btn" onClick={onComplete}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
