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
  const isMobileLandscape = isMobile && isLandscape;
  const isMobileFullscreen = isMobileLandscape && showControls;

  useEffect(() => {
    if (!isMobile) return;
    const updateVh = () => {
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty(
        '--app-vh',
        `${viewportHeight}px`,
      );
    };

    updateVh();
    window.addEventListener('resize', updateVh);
    window.visualViewport?.addEventListener('resize', updateVh);

    return () => {
      window.removeEventListener('resize', updateVh);
      window.visualViewport?.removeEventListener('resize', updateVh);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobileFullscreen) {
      document.body.classList.remove('mobile-game-active');
      return () => {};
    }

    document.body.classList.add('mobile-game-active');
    return () => {
      document.body.classList.remove('mobile-game-active');
    };
  }, [isMobileFullscreen]);

  return (
    <div
      className={`game-viewport ${
        isMobile ? 'game-viewport--mobile' : ''
      } ${isMobileFullscreen ? 'game-viewport--mobile-fullscreen' : ''}`}
    >
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
