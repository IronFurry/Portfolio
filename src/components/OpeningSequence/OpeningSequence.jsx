import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundFX } from './BackgroundFX';
import { BootSequence } from './BootSequence';
import { IdentityReveal } from './IdentityReveal';
import { ArchiveInvitation } from './ArchiveInvitation';
import { SoundToggle } from './SoundToggle';
import { useSciFiSound } from '../../hooks/useSciFiSound';
import './OpeningSequence.css';

/**
 * OpeningSequence Master Component
 * 
 * Manages the cinematic 7-10s futuristic archive boot experience.
 * Stages:
 * 1. 'boot': BootSequence terminal logs
 * 2. 'identity': IdentityReveal searching -> ARYAN KATE reveal
 * 3. 'invitation': ArchiveInvitation centered minimalist invitation
 * 4. 'entering': Handoff state (black screen with "ENTERING ARCHIVE...")
 * 
 * Prop:
 * - onEnterArchive: callback invoked when the user confirms entrance
 */
export const OpeningSequence = ({ onEnterArchive }) => {
  const [sceneStage, setSceneStage] = useState('boot'); // 'boot' | 'identity' | 'invitation' | 'entering'
  const [isFlickering, setIsFlickering] = useState(false);
  const [isFastForward, setIsFastForward] = useState(false);
  const { soundEnabled, toggleSound, playSound, initAudio } = useSciFiSound();

  // Trigger occasional micro sci-fi screen flicker
  const triggerFlicker = useCallback(() => {
    setIsFlickering(true);
    setTimeout(() => setIsFlickering(false), 80);
  }, []);

  // Handlers for scene transitions
  const handleBootComplete = useCallback(() => {
    triggerFlicker();
    setSceneStage('identity');
  }, [triggerFlicker]);

  const handleIdentityComplete = useCallback(() => {
    triggerFlicker();
    setSceneStage('invitation');
  }, [triggerFlicker]);

  const handleConfirmEnter = useCallback(() => {
    triggerFlicker();
    setSceneStage('entering');
    if (onEnterArchive) {
      onEnterArchive();
    }
  }, [onEnterArchive, triggerFlicker]);

  const handleRestart = useCallback(() => {
    initAudio();
    setIsFastForward(false);
    triggerFlicker();
    setSceneStage('boot');
  }, [initAudio, triggerFlicker]);

  const handleSkip = useCallback(() => {
    initAudio();
    triggerFlicker();
    setSceneStage('invitation');
  }, [initAudio, triggerFlicker]);

  // Global keybindings (R to restart, S to skip intro)
  useEffect(() => {
    const handleGlobalKey = (e) => {
      // Ignore if inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'r' || e.key === 'R') {
        handleRestart();
      } else if (e.key === 's' || e.key === 'S') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [handleRestart, handleSkip]);

  return (
    <div className="opening-sequence-container">
      {/* Visual background layers (noise, CRT scanlines, telemetry grid) */}
      <BackgroundFX isFlickering={isFlickering} />

      {/* Top right HUD controls (audio toggle, replay, skip) */}
      <SoundToggle
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        playSound={playSound}
        onRestart={handleRestart}
        onSkip={handleSkip}
        isCompleted={sceneStage === 'entering'}
      />

      {/* Main Scene Transitions */}
      <main className="sequence-viewport">
        <AnimatePresence mode="wait">
          {sceneStage === 'boot' && (
            <BootSequence
              key="boot"
              onBootComplete={handleBootComplete}
              playSound={playSound}
              isFastForward={isFastForward}
            />
          )}

          {sceneStage === 'identity' && (
            <IdentityReveal
              key="identity"
              onIdentityComplete={handleIdentityComplete}
              playSound={playSound}
              isFastForward={isFastForward}
            />
          )}

          {sceneStage === 'invitation' && (
            <ArchiveInvitation
              key="invitation"
              onConfirmEnter={handleConfirmEnter}
              playSound={playSound}
            />
          )}

          {sceneStage === 'entering' && (
            <motion.div
              key="entering"
              className="entering-archive-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="entering-content">
                <span className="entering-symbol">&gt;</span>
                <span className="entering-text">ENTERING ARCHIVE...</span>
                <div className="entering-progress-bar">
                  <motion.div
                    className="entering-progress-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom telemetry status bar */}
      <footer className="hud-bottom-meta">
        <span className="meta-left">LATENCY: 12ms // LOC: 77.01°N 15.65°E</span>
        <span className="meta-right">PRESS [R] REPLAY • [S] SKIP</span>
      </footer>
    </div>
  );
};
