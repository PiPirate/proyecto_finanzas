import React, { useEffect, useRef } from 'react';
import './MobileControls.css';

const defaultDirectionKeys = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
};

function dispatchKeyEvent(type, key) {
  const event = new KeyboardEvent(type, { key, bubbles: true });
  window.dispatchEvent(event);
}

export default function MobileControls({
  directionKeys = defaultDirectionKeys,
  actionKeys = ['Enter', ' ', 'z'],
}) {
  const holdIntervalRef = useRef(null);
  const activeDirectionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  const startDirection = (dirKey) => {
    if (!dirKey) return;
    activeDirectionRef.current = dirKey;
    dispatchKeyEvent('keydown', dirKey);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      dispatchKeyEvent('keydown', dirKey);
    }, 180);
  };

  const stopDirection = () => {
    if (!activeDirectionRef.current) return;
    dispatchKeyEvent('keyup', activeDirectionRef.current);
    clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = null;
    activeDirectionRef.current = null;
  };

  const handleAction = () => {
    actionKeys.forEach((key) => dispatchKeyEvent('keydown', key));
    setTimeout(() => {
      actionKeys.forEach((key) => dispatchKeyEvent('keyup', key));
    }, 80);
  };

  const bindPress = (dir) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      startDirection(directionKeys[dir]);
    },
    onPointerUp: (e) => {
      e.preventDefault();
      stopDirection();
    },
    onPointerLeave: () => {
      stopDirection();
    },
  });

  return (
    <div className="mobile-controls">
      <div className="mobile-controls__dpad" role="group" aria-label="Controles de movimiento">
        <button className="mobile-controls__btn mobile-controls__btn--up" {...bindPress('up')}>
          ▲
        </button>
        <div className="mobile-controls__row">
          <button className="mobile-controls__btn" {...bindPress('left')}>
            ◀
          </button>
          <button className="mobile-controls__btn" {...bindPress('down')}>
            ▼
          </button>
          <button className="mobile-controls__btn" {...bindPress('right')}>
            ▶
          </button>
        </div>
      </div>

      <button
        className="mobile-controls__action"
        onPointerDown={(e) => {
          e.preventDefault();
          handleAction();
        }}
        onPointerUp={(e) => e.preventDefault()}
      >
        Acción
      </button>
    </div>
  );
}
