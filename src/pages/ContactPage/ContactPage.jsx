import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, GitBranch , Mail, Volume2, VolumeX } from 'lucide-react';
import { ArchiveTerminal } from '../../components/ArchiveTerminal/ArchiveTerminal';
import { useSciFiSound } from '../../hooks/useSciFiSound';
import './contact-page.css';

const GITHUB_URL = 'https://github.com/IronFurry';

export const ContactPage = ({ onNavigateHome, onNavigateAbout, onNavigateArtifacts, onNavigateFuture }) => {
  const { soundEnabled, toggleSound, playSound } = useSciFiSound();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTerminalNav = (sectionId) => {
    if (sectionId === 'home') onNavigateHome?.();
    else if (sectionId === 'about') onNavigateAbout?.();
    else if (sectionId === 'artifacts') onNavigateArtifacts?.();
    else if (sectionId === 'future') onNavigateFuture?.();
  };

  return (
    <div className="contact-page-root">
      <div className="contact-grid-bg" aria-hidden="true" />
      <div className="contact-scanline" aria-hidden="true" />

      <header className="contact-page-header">
        <div className="contact-header-badge">
          <span className="hud-square">■</span> AK // ARCHIVE — COMMUNICATION CHANNEL
        </div>
        <div className="contact-header-actions">
          <button type="button" className="contact-header-btn" onClick={() => { playSound?.('type_char'); onNavigateFuture?.(); }}>
            FUTURE <ArrowRight size={12} />
          </button>
          <button type="button" className="contact-header-btn audio-btn" onClick={() => { playSound?.('type_char'); toggleSound?.(); }}>
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>
          <button type="button" className="contact-header-back-btn" onClick={() => { playSound?.('type_char'); onNavigateHome?.(); }}>
            <ArrowLeft size={14} />
            <span>RETURN TO HERO SPACE</span>
          </button>
        </div>
      </header>

      <main className="contact-page-main">
        <section className="contact-copy">
          <div className="contact-kicker"><span className="contact-live-dot" /> CHANNEL STATUS // OPEN</div>
          <h1>LET'S<br /><span>BUILD.</span></h1>
          <p>
            If you are building something interesting, want to collaborate, have an opportunity worth discussing,
            or simply want to exchange ideas — send a transmission.
          </p>
          <div className="contact-meta-line">
            <span>RESPONSE MODE</span>
            <strong>HUMAN / DIRECT</strong>
          </div>
        </section>

        <section className="contact-channel-panel">
          <div className="contact-panel-top">
            <span>AVAILABLE CHANNELS</span>
            <span>01 — 02</span>
          </div>

          <a className="contact-channel github-channel" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <div className="contact-channel-icon"><GitBranch  size={20} /></div>
            <div className="contact-channel-copy">
              <span className="channel-label">SOURCE NETWORK</span>
              <h2>GITHUB</h2>
              <p>Projects, experiments, code and things currently being built.</p>
            </div>
            <ArrowRight className="channel-arrow" size={18} />
          </a>

          <div className="contact-channel direct-channel">
  <div className="contact-channel-icon">
    <Mail size={20} />
  </div>

  <div className="contact-channel-copy">
    <span className="channel-label">DIRECT CHANNEL</span>
    <h2>EMAIL</h2>

    <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=aryanknitin21@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="contact-email-link"
>
      aryanknitin21@gmail.com
    </a>

    <span className="channel-subline">
         &nbsp;&nbsp; AVAILABLE FOR BUILDING, COLLABORATION &amp; INTERESTING PROBLEMS
    </span>
  </div>
  
</div>
<div className="contact-channel linkedin-channel">
  <div className="contact-channel-icon">
    <span style={{ fontWeight: 700, fontSize: '16px' }}>in</span>
  </div>

  <div className="contact-channel-copy">
    <span className="channel-label">PROFESSIONAL CHANNEL</span>
    <h2>LINKEDIN</h2>

    <a
      href="https://www.linkedin.com/in/aryan-kate-654638331/"
      target="_blank"
      rel="noopener noreferrer"
      className="contact-email-link"
    >
      Aryan Kate
    </a>

    <span className="channel-subline">
     &nbsp; PROFESSIONAL NETWORK &amp; COLLABORATION
    </span>
  </div>
</div>
        </section>

        <section className="contact-transmission">
          <div className="transmission-line" />
          <div>
            <span className="transmission-label">TRANSMISSION PROMPT</span>
            <h2>No formal brief required.<br />Just tell me <em>what you're building.</em></h2>
          </div>
          <button type="button" className="contact-artifacts-btn" onClick={() => { playSound?.('boot_ok'); onNavigateArtifacts?.(); }}>
            INSPECT MY WORK <ArrowRight size={15} />
          </button>
        </section>
      </main>

      <ArchiveTerminal onNavigateSection={handleTerminalNav} playSound={playSound} />
    </div>
  );
};
