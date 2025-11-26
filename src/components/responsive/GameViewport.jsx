import React, { useEffect } from 'react';
import { useDeviceMode } from '../../hooks/useDeviceMode';
import { useOrientationLock } from '../../hooks/useOrientationLock';
import MobileControls from './MobileControls';
import './GameViewport.css';

export default function GameViewport({
  children,
  showControls = true,
  directionKeys,
  actionKeys,
}) {
  const { isMobile } = useDeviceMode();
  const { isLandscape } = useOrientationLock();

  useEffect(() => {
    if (!isMobile) return;
    const updateVh = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty('--app-vh', `${viewportHeight}px`);
    };

    updateVh();
    window.addEventListener('resize', updateVh);
    window.visualViewport?.addEventListener('resize', updateVh);

    return () => {
      window.removeEventListener('resize', updateVh);
      window.visualViewport?.removeEventListener('resize', updateVh);
    };
  }, [isMobile]);

  return (
    <div className={`game-viewport ${isMobile ? 'game-viewport--mobile' : ''}`}>
      {isMobile && !isLandscape && (
        <div className="game-viewport__orientation-block">
          <div className="game-viewport__orientation-card">
            <p>Por favor, rota tu teléfono a posición horizontal para jugar.</p>
          </div>
        </div>
      )}

      <div className="game-viewport__content">{children}</div>

      {isMobile && isLandscape && showControls && (
        <MobileControls directionKeys={directionKeys} actionKeys={actionKeys} />
      )}
    </div>
  );
}
