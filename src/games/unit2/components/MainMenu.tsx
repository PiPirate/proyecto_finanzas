import React from 'react';

interface MainMenuProps {
  onStart: () => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="main-menu">
      {/* ASSET: Fondo del menú principal */}
      <div className="menu-background">
        {/* La imagen de fondo se cargará aquí */}
      </div>

      <div className="menu-content">
        {/* ASSET: Logo del juego */}
        <div className="game-logo">
          <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Mini-Presupuesto</h1>
          <p style={{ textAlign: 'center', opacity: 0.8 }}>Necesidades, Gustos y Ahorro</p>
        </div>

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
              cursor: 'pointer'
            }}
          >
            🎮 Jugar
          </button>
        </div>

        {/* ASSET: Personaje decorativo */}
        <div className="menu-character">
          {/* Imagen del personaje principal en el menú */}
        </div>
      </div>
    </div>
  );
}