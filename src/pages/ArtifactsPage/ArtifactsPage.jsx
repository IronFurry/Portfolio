import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, User } from 'lucide-react';
import { ArtifactsSection } from '../../components/ArtifactsSection/ArtifactsSection';
import { ArchiveTerminal } from '../../components/ArchiveTerminal/ArchiveTerminal';
import { useSciFiSound } from '../../hooks/useSciFiSound';
import './artifacts-page.css';

export const ArtifactsPage = ({ onNavigateHome, onNavigateAbout, onNavigateFuture, onNavigateContact }) => {
  const { soundEnabled, toggleSound, playSound } = useSciFiSound();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTerminalNav = (sectionId) => {
    if (sectionId === 'home') onNavigateHome?.();
    else if (sectionId === 'about') onNavigateAbout?.();
    else if (sectionId === 'future') onNavigateFuture?.();
    else if (sectionId === 'contact') onNavigateContact?.();
  };

  return (
    <div className="artifacts-page-root">
      {/* Top Header Navigation Bar */}
      <header className="artifacts-page-header">
        <div className="artifacts-header-badge">
          <span className="hud-square">■</span> AK // ARCHIVE — ARTIFACT RECORD
        </div>

        <div className="artifacts-header-actions">
          {/* About shortcut */}
          <button
            type="button"
            className="artifacts-header-btn"
            onClick={() => {
              playSound?.('type_char');
              onNavigateAbout?.();
            }}
          >
            <User size={13} />
            <span>ABOUT</span>
          </button>

          <button
            type="button"
            className="artifacts-header-btn"
            onClick={() => {
              playSound?.('type_char');
              onNavigateFuture?.();
            }}
          >
            <ArrowRight size={13} />
            <span>FUTURE</span>
          </button>

          <button
            type="button"
            className="artifacts-header-btn"
            onClick={() => {
              playSound?.('type_char');
              onNavigateContact?.();
            }}
          >
            <span>CONTACT</span>
          </button>

          {/* Audio toggle */}
          <button
            type="button"
            className="artifacts-header-btn audio-btn"
            onClick={() => {
              playSound?.('type_char');
              toggleSound?.();
            }}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>

          {/* Return to hero */}
          <button
            type="button"
            className="artifacts-header-back-btn"
            onClick={() => {
              playSound?.('type_char');
              onNavigateHome?.();
            }}
          >
            <ArrowLeft size={14} />
            <span>RETURN TO HERO SPACE</span>
          </button>
        </div>
      </header>

      {/* Artifacts Section — full page experience */}
      <ArtifactsSection playSound={playSound} pageMode />

      {/* Draggable Archive Terminal */}
      <ArchiveTerminal
        onNavigateSection={handleTerminalNav}
        playSound={playSound}
      />
    </div>
  );
};
