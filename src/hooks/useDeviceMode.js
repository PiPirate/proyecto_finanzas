import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 900;

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const computeIsMobile = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width <= MOBILE_BREAKPOINT || (isTouchDevice() && width <= 1100);
};

export function useDeviceMode() {
  const [isMobile, setIsMobile] = useState(computeIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(computeIsMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isDesktop: !isMobile,
  };
}
