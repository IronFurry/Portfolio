import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { ParallaxProvider } from './ParallaxController';
import { HeroCamera } from './HeroCamera';
import { SpaceEnvironment } from './SpaceEnvironment';
import { HeroInterface } from './HeroInterface';
import { ArchiveTerminal } from '../ArchiveTerminal/ArchiveTerminal';
import { useSciFiSound } from '../../hooks/useSciFiSound';
import './hero.css';

/**
 * HeroScene Master Component
 * 
 * Full-screen 16:9 cinematic deep-space environment & scroll-driven 3D space journey.
 * Hosts the cinematic hero scene. The artifact archive lives on its own page.
 */
export const HeroScene = ({ onReplayIntro, onNavigateToAbout, onNavigateToArtifacts, onNavigateToFuture, onNavigateToContact }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const { soundEnabled, toggleSound, initAudio, playSound } = useSciFiSound();

  useEffect(() => {
    // Cinematic reveal timer: Screen starts black, slowly emerging into view
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 200);

    // Auto-start cinematic ambient sound
    const soundTimer = setTimeout(() => {
      initAudio();
    }, 400);

    return () => {
      clearTimeout(timer);
      clearTimeout(soundTimer);
    };
  }, [initAudio]);

  // Master Scroll listener mapping scroll position to 3D space travel progress
  useEffect(() => {
    let animId;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // 100% of space travel = 1.0 vh distance (caps camera distance at 70%)
      const journeyDistance = vh * 1.0;

      const rawProgress = scrollY / journeyDistance;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));
      setScrollProgress(clampedProgress);
    };

    const onScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleCardClick = () => {
    playSound?.('boot_ok');
    if (onNavigateToAbout) {
      onNavigateToAbout();
    }
  };

  const handleNavigateSection = (sectionId) => {
    console.log(`>>> [SECTION NAVIGATE] Transitioning to section: ${sectionId}`);
    setActiveSection(sectionId);

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'artifacts') {
      if (onNavigateToArtifacts) {
        // Use App-level navigation (handles page state + DOM-poll scroll)
        onNavigateToArtifacts();
      } else {
        const el = document.getElementById('artifacts');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: window.innerHeight * 2.2, behavior: 'smooth' });
        }
      }
    } else if (sectionId === 'about') {
      handleCardClick();
    } else if (sectionId === 'future') {
      onNavigateToFuture?.();
    } else if (sectionId === 'contact') {
      onNavigateToContact?.();
    } else if (sectionId === 'lab') {
      // Lab is intentionally wired later; keep the nav item inert for now.
      playSound?.('type_char');
    } else {
      handleCardClick();
    }
  };

  return (
    <ParallaxProvider>
      <div className="hero-scene-root">
        {/* Three.js Deep Space Canvas (Fixed background) */}
        <div className="hero-canvas-container">
          <Canvas
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true
            }}
            dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
          >
            <color attach="background" args={['#030405']} />
            <HeroCamera scrollProgress={scrollProgress} isCardExpanded={isCardExpanded} />
            <SpaceEnvironment
              isRevealed={isRevealed}
              scrollProgress={scrollProgress}
              onCardClick={handleCardClick}
              isCardExpanded={isCardExpanded}
            />
          </Canvas>
        </div>

        {/* Viewport 1: Hero Scene HUD Overlay (Fades out smoothly with scrollProgress) */}
        <div className="hero-viewport-section">
          <HeroInterface
            activeSection={activeSection}
            scrollProgress={scrollProgress}
            onNavigateSection={handleNavigateSection}
            onReplayIntro={onReplayIntro}
            onEnterArchive={() => handleNavigateSection('about')}
            soundEnabled={soundEnabled}
            toggleSound={toggleSound}
            playSound={playSound}
          />
        </div>

        {/* Space Journey Scroll Buffer Space (1.0 vh gap) */}
        <div className="space-journey-buffer" style={{ height: '100vh', pointerEvents: 'none' }} />


        {/* Moveable Mac Style Interactive Archive Terminal */}
        <ArchiveTerminal
          onNavigateSection={handleNavigateSection}
          playSound={playSound}
        />

        {/* Initial Cinematic Black Reveal Curtain */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div
              key="curtain"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#030405',
                zIndex: 100,
                pointerEvents: 'none'
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ParallaxProvider>
  );
};
