import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from './ParallaxController';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * HeroInterface Component
 * Futuristic sci-fi HUD overlay for the primary Hero viewport.
 * Phase 1: All Hero UI smoothly fades out as scrollProgress moves 0 -> 0.35.
 */
export const HeroInterface = ({
  activeSection = 'home',
  scrollProgress = 0,
  onNavigateSection,
  onEnterArchive,
  soundEnabled,
  toggleSound,
  playSound
}) => {
  const { mouse, isReducedMotion } = useParallax();
  const headingRef = useRef();
  const subtextRef = useRef();
  const hudRef = useRef();

  // Calculate UI fade opacity based on scroll progress (1 -> 0)
  const heroUIOpacity = Math.max(0, 1 - scrollProgress * 3.0);

  // Subtle UI micro-parallax loop
  useEffect(() => {
    let animId;
    const updateUIParallax = () => {
      if (!isReducedMotion.current) {
        const mx = mouse.current.x;
        const my = mouse.current.y;

        if (headingRef.current) {
          headingRef.current.style.transform = `translate3d(${mx * -12}px, ${my * -8}px, 0)`;
        }
        if (subtextRef.current) {
          subtextRef.current.style.transform = `translate3d(${mx * -8}px, ${my * -6}px, 0)`;
        }
        if (hudRef.current) {
          hudRef.current.style.transform = `translate3d(${mx * -4}px, ${my * -3}px, 0)`;
        }
      }
      animId = requestAnimationFrame(updateUIParallax);
    };

    animId = requestAnimationFrame(updateUIParallax);
    return () => cancelAnimationFrame(animId);
  }, [mouse, isReducedMotion]);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'artifacts', label: 'ARTIFACTS' },
    { id: 'lab', label: 'LAB' },
    { id: 'future', label: 'FUTURE' },
    { id: 'contact', label: 'CONTACT' }
  ];

  return (
    <div
      className="hero-ui-root"
      ref={hudRef}
      style={{
        opacity: heroUIOpacity,
        pointerEvents: heroUIOpacity < 0.1 ? 'none' : 'auto',
        transition: 'opacity 0.1s linear'
      }}
    >
      {/* Film Grain & Cinematic Vignette */}
      <div className="hero-film-grain" />
      <div className="hero-vignette" />
      <div className="hero-scanlines" />

      {/* Top Left System Badge & Nav Shortcuts */}
      <motion.header
        className="hud-top-left"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="system-title">
          <span className="hud-square">■</span> AK // ARCHIVE
        </div>
        <div className="system-subtitle">SYSTEM 01.0</div>

        {/* Section Shortcut Links */}
        <nav className="hud-nav-links" aria-label="Archive Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`hud-nav-btn ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => {
                playSound?.('type_char');
                onNavigateSection?.(item.id);
              }}
            >
              <span className="nav-prefix">&gt;</span> {item.label}
            </button>
          ))}
        </nav>
      </motion.header>

      {/* Top Right Active Status Telemetry Box & Audio Toggle */}
      <motion.div
        className="hud-top-right"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {toggleSound && (
          <button
            type="button"
            className="hud-mini-btn audio-btn-top"
            onClick={() => {
              playSound?.('type_char');
              toggleSound();
            }}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>
        )}

        <div className="telemetry-bracket-box">
          <span className="bracket corner-tl">┌</span>
          <span className="bracket corner-tr">┐</span>
          <span className="bracket corner-bl">└</span>
          <span className="bracket corner-br">┘</span>

          <div className="telemetry-table">
            <div className="telemetry-row">
              <span className="row-key">ARCHIVE STATUS</span>
              <span className="row-val status-online">
                ONLINE <span className="green-pulse-dot" />
              </span>
            </div>
            <div className="telemetry-row">
              <span className="row-key">SECTION</span>
              <span className="row-val">/{activeSection.toUpperCase()}</span>
            </div>
            <div className="telemetry-row">
              <span className="row-key">PROJECTS</span>
              <span className="row-val">04</span>
            </div>
            <div className="telemetry-row">
              <span className="row-key">EXPERIMENTS</span>
              <span className="row-val">07</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area — Hero Title & manifesto */}
      <main className="hud-center-left" id="home">
        {/* Status Line */}
        <motion.div
          className="signal-detected-line"
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hud-square">■</span>
          <span className="detected-text">SIGNAL DETECTED ...</span>
          <span className="detected-divider" />
        </motion.div>

        {/* Hero Name Title */}
        <div ref={headingRef} className="parallax-heading-box">
          <motion.h1
            className="hero-name-title"
            initial={{ opacity: 0, y: 35, x: -25 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.9, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
          >
            ARYAN KATE
          </motion.h1>

          <motion.div
            className="hero-role-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.15, ease: [0.16, 1, 0.3, 1] }}
          >
            ENGINEER · BUILDER · EXPERIMENTER
          </motion.div>
        </div>

        {/* Manifesto Statement & Enter Action */}
        <div ref={subtextRef} className="parallax-subtext-box">
          <motion.p
            className="hero-manifesto"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
          >
            I build things, break things,<br />
            and figure out what's possible.
          </motion.p>

          {/* Enter Archive Button */}
          <motion.div
            className="hero-enter-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              className="hud-bracket-btn"
              onClick={() => {
                playSound?.('boot_ok');
                onNavigateSection?.('about');
              }}
            >
              <span className="bracket corner-tl">┌</span>
              <span className="bracket corner-tr">┐</span>
              <span className="bracket corner-bl">└</span>
              <span className="bracket corner-br">┘</span>

              <span className="btn-content">
                <span className="btn-arrow-prefix">&gt;</span> ENTER ARCHIVE
                <span className="btn-long-arrow">──────→</span>
              </span>
            </button>
          </motion.div>
        </div>
      </main>

      {/* Bottom Left Scroll Indicator */}
      <motion.div
        className="hud-bottom-left"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="scroll-hint-bracket">
          <span className="bracket-top">┌</span>
          <span className="bracket-stem">│</span>
        </div>
        <span className="scroll-hint-text">
          {activeSection === 'home' ? 'SCROLL DOWN TO TRAVEL THROUGH SPACE' : `ACTIVE SECTION: /${activeSection.toUpperCase()}`}
        </span>
      </motion.div>
    </div>
  );
};
