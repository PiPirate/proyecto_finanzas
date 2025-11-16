import React from 'react';

export default function MainMenu({ onStart }) {
  return (
    <div className="main-menu">
      {/* Fondo del menú */}
      <div className="menu-background"></div>

      <div className="menu-content">

        {/* Logo del juego */}
        <div className="game-logo">
          <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>
            Mini-Presupuesto
          </h1>
          <p style={{ textAlign: 'center', opacity: 0.8 }}>
            Necesidades, Gustos y Ahorro
          </p>
        </div>

        {/* Botón jugar */}
        <div className="menu-buttons">
          <button
            onClick={onStart}
            style={{
              padding: '12px 32px',
              fontSize: '18px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            🎮 Jugar
          </button>
        </div>

        {/* Personaje decorativo */}
        <div className="menu-character"></div>
      </div>
    </div>
  );
}
