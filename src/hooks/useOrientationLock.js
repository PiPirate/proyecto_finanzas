import { useEffect, useState } from 'react';

const getOrientation = () => {
  if (typeof window === 'undefined') return 'landscape';
  if (window.matchMedia('(orientation: portrait)').matches) return 'portrait';
  return 'landscape';
};

export function useOrientationLock() {
  const [orientation, setOrientation] = useState(getOrientation());

  useEffect(() => {
    const handleChange = () => setOrientation(getOrientation());

    const portraitMatcher = window.matchMedia('(orientation: portrait)');
    portraitMatcher.addEventListener('change', handleChange);
    window.addEventListener('resize', handleChange);
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleChange);
    }

    return () => {
      portraitMatcher.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleChange);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleChange);
      }
    };
  }, []);

  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
  };
}
