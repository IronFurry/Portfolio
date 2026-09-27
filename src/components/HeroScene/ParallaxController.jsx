import React, { createContext, useContext, useEffect, useRef } from 'react';

/**
 * Parallax Context
 * Stores raw and smoothed mouse coordinates [-1, 1] without triggering
 * React re-renders on every mouse move.
 */
const ParallaxContext = createContext({
  mouse: { current: { x: 0, y: 0, targetX: 0, targetY: 0 } },
  isReducedMotion: { current: false }
});

export const ParallaxProvider = ({ children }) => {
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isReducedMotion = useRef(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion.current = mediaQuery.matches;

    const handleMotionChange = (e) => {
      isReducedMotion.current = e.matches;
      if (e.matches) {
        mouse.current.targetX = 0;
        mouse.current.targetY = 0;
        mouse.current.x = 0;
        mouse.current.y = 0;
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // Mouse move handler normalized from -1 to 1
    const handleMouseMove = (e) => {
      if (isReducedMotion.current) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current.targetX = x;
      mouse.current.targetY = y;
    };

    // Touch support for mobile/tablets
    const handleTouchMove = (e) => {
      if (isReducedMotion.current || !e.touches[0]) return;
      const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      mouse.current.targetX = x * 0.6;
      mouse.current.targetY = y * 0.6;
    };

    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <ParallaxContext.Provider value={{ mouse, isReducedMotion }}>
      {children}
    </ParallaxContext.Provider>
  );
};

export const useParallax = () => useContext(ParallaxContext);
