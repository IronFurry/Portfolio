import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Compass, Layers, Mail, Volume2, VolumeX } from 'lucide-react';
import { ArchiveTerminal } from '../../components/ArchiveTerminal/ArchiveTerminal';
import { useSciFiSound } from '../../hooks/useSciFiSound';
import './future-page.css';

const TRAJECTORY = [
  {
    index: '01',
    phase: 'NOW',
    title: 'DEEPEN THE CORE',
    text: 'Strengthen the fundamentals behind the interfaces: DSA, computer science, backend systems, AI and the engineering discipline to ship without leaning on the magic of the tools.',
    signals: ['CSE-DS // YEAR 03', 'DSA // ACTIVE FOCUS', 'AI × FULL-STACK × SYSTEMS']
  },
  {
    index: '02',
    phase: 'NEXT',
    title: 'BUILD SYSTEMS THAT MATTER',
    text: 'Turn experiments into durable products. Explore agents, computer vision, intelligent interfaces and other systems where the interesting part is not the demo — it is making the thing actually work.',
    signals: ['PRODUCTS', 'EXPERIMENTS', 'REAL USERS']
  },
  {
    index: '03',
    phase: 'LATER',
    title: 'OWN THE DIRECTION',
    text: 'Eventually, the goal is bigger than collecting technologies or titles: build products, start something of my own, and create software that people genuinely choose to use.',
    signals: ['OWN PRODUCTS', 'START SOMETHING', 'LONG HORIZON']
  }
];

export const FuturePage = ({ onNavigateHome, onNavigateAbout, onNavigateArtifacts, onNavigateContact }) => {
  const { soundEnabled, toggleSound, playSound } = useSciFiSound();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTerminalNav = (sectionId) => {
    if (sectionId === 'home') onNavigateHome?.();
    else if (sectionId === 'about') onNavigateAbout?.();
    else if (sectionId === 'artifacts') onNavigateArtifacts?.();
    else if (sectionId === 'contact') onNavigateContact?.();
  };

  return (
    <div className="future-page-root">
      <div className="future-stars" aria-hidden="true" />
      <div className="future-orbit future-orbit-one" aria-hidden="true" />
      <div className="future-orbit future-orbit-two" aria-hidden="true" />
      <div className="future-scanline" aria-hidden="true" />

      <header className="future-page-header">
        <div className="future-header-badge">
          <span className="hud-square">■</span> AK // ARCHIVE — FUTURE PROJECTION
        </div>

        <div className="future-header-actions">
          <button type="button" className="future-header-btn" onClick={() => { playSound?.('type_char'); onNavigateContact?.(); }}>
            <Mail size={13} />
            <span>CONTACT</span>
          </button>
          <button type="button" className="future-header-btn audio-btn" onClick={() => { playSound?.('type_char'); toggleSound?.(); }}>
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>
          <button type="button" className="future-header-back-btn" onClick={() => { playSound?.('type_char'); onNavigateHome?.(); }}>
            <ArrowLeft size={14} />
            <span>RETURN TO HERO SPACE</span>
          </button>
        </div>
      </header>

      <main className="future-page-main">
        <section className="future-intro">
          <div className="future-kicker"><Compass size={13} /> TRAJECTORY // NOT A SCRIPT</div>
          <h1>WHAT COMES<br /><span>NEXT?</span></h1>
          <p className="future-lead">
            The archive records what has already been built. This page is about the direction behind it —
            what I want to get better at, what I want to build next, and eventually what I want to own.
          </p>
          <div className="future-note">
            <span className="future-note-mark">[ FUTURE_STATE ]</span>
            <span>Not a fixed roadmap. Just the current trajectory.</span>
          </div>
        </section>

        <section className="future-trajectory" aria-label="Future trajectory">
          <div className="future-axis" aria-hidden="true"><span /></div>
          {TRAJECTORY.map((item) => (
            <article className="future-node" key={item.index}>
              <div className="future-node-marker">
                <span>{item.index}</span>
              </div>
              <div className="future-node-content">
                <div className="future-phase">{item.phase}</div>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                <div className="future-signals">
                  {item.signals.map((signal) => <span key={signal}>{signal}</span>)}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="future-end-state">
          <div className="future-end-line" />
          <div>
            <span className="future-end-label">LONG-TERM SIGNAL</span>
            <h2>FROM BUILDING PROJECTS<br />TO BUILDING <em>DIRECTION.</em></h2>
          </div>
          <button type="button" className="future-contact-cta" onClick={() => { playSound?.('boot_ok'); onNavigateContact?.(); }}>
            ESTABLISH CONNECTION <ArrowRight size={15} />
          </button>
        </section>
      </main>

      <ArchiveTerminal onNavigateSection={handleTerminalNav} playSound={playSound} />
    </div>
  );
};
