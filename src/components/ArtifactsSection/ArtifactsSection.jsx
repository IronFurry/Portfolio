import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ARTIFACTS_DATA } from './ArtifactData';
import { ArtifactTerminal } from './ArtifactTerminal';
import { ArtifactInfo } from './ArtifactInfo';
import { useSciFiSound } from '../../hooks/useSciFiSound';
import './artifacts-section.css';

export const ArtifactsSection = ({ playSound, pageMode = false }) => {
  const { soundEnabled, toggleSound } = useSciFiSound();
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressedKey, setPressedKey] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [switchingState, setSwitchingState] = useState(false);
  const keyTimerRef = useRef(null);
  const lastActiveIndexRef = useRef(0);

  const isSectionActive = useCallback(() => {
    if (pageMode) return true;
    const el = sectionRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return visible > window.innerHeight * 0.25;
  }, [pageMode]);

  const changeArtifact = useCallback((nextIndex) => {
    const clamped = Math.max(0, Math.min(ARTIFACTS_DATA.length - 1, nextIndex));
    setActiveIndex(prev => {
      if (prev === clamped) return prev;
      lastActiveIndexRef.current = clamped;
      return clamped;
    });
    setIsInfoOpen(false);
    setSwitchingState(true);
    window.setTimeout(() => setSwitchingState(false), 280);
  }, []);

  // The archive is a dedicated page: navigation is driven by the physical keyboard and arrow keys.
  useEffect(() => {
    if (pageMode) return;

    let raf = 0;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const progress = Math.max(0, Math.min(0.999999, -rect.top / total));
      const nextIndex = Math.floor(progress * ARTIFACTS_DATA.length);

      if (nextIndex !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setIsInfoOpen(false);
        setSwitchingState(true);
        window.setTimeout(() => setSwitchingState(false), 280);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pageMode]);

  const handleKeyDown = useCallback((e) => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    if (['input', 'textarea', 'select'].includes(activeTag) || document.activeElement?.isContentEditable) {
      return;
    }

    if (!isSectionActive()) return;

    const key = e.key;

    // Navigation keys only move the archive when the user is looking at this section.
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault();
      changeArtifact(activeIndex + 1);
      playSound?.('type_char');
      return;
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault();
      changeArtifact(activeIndex - 1);
      playSound?.('type_char');
      return;
    }

    setPressedKey(key);
    clearTimeout(keyTimerRef.current);
    keyTimerRef.current = window.setTimeout(() => setPressedKey(null), 180);

    playSound?.('type_char');

    if (key === 'Escape') {
      setIsInfoOpen(false);
      return;
    }

    if (key === 'Enter') {
      const artifact = ARTIFACTS_DATA[activeIndex];
      if (isInfoOpen && artifact?.liveUrl) {
        window.open(artifact.liveUrl, '_blank', 'noopener,noreferrer');
      } else {
        setIsInfoOpen(true);
      }
      return;
    }

    // Any other key wakes the archive and reveals the current artifact information.
    setIsInfoOpen(true);
  }, [activeIndex, changeArtifact, isInfoOpen, isSectionActive, playSound]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(keyTimerRef.current);
    };
  }, [handleKeyDown]);

  const handleKeyTrigger = (key) => {
    if (key === 'ArrowRight') return changeArtifact(activeIndex + 1);
    if (key === 'ArrowLeft') return changeArtifact(activeIndex - 1);

    setPressedKey(key);
    clearTimeout(keyTimerRef.current);
    keyTimerRef.current = window.setTimeout(() => setPressedKey(null), 180);
    playSound?.('type_char');

    if (key === 'Escape' || key === 'ESC') {
      setIsInfoOpen(false);
      return;
    }

    if (key === 'Enter' || key === 'ENTER') {
      const artifact = ARTIFACTS_DATA[activeIndex];
      if (isInfoOpen && artifact?.liveUrl) {
        window.open(artifact.liveUrl, '_blank', 'noopener,noreferrer');
      } else {
        setIsInfoOpen(true);
      }
      return;
    }

    setIsInfoOpen(true);
  };

  const currentArtifact = ARTIFACTS_DATA[activeIndex];
  const prevArtifact = activeIndex > 0 ? ARTIFACTS_DATA[activeIndex - 1] : null;
  const nextArtifact = activeIndex < ARTIFACTS_DATA.length - 1 ? ARTIFACTS_DATA[activeIndex + 1] : null;

  return (
    <section
      id="artifacts"
      ref={sectionRef}
      className={`artifacts-section-root${pageMode ? ' artifacts-page-mode' : ''}`}
    >
      <div className="artifacts-sticky-stage">
        <div className="archive-bg-typography" aria-hidden="true">
          <span>ARCHIVE</span>
          <span>ARCHIVE</span>
        </div>

        <header className="archive-section-header">
          <div className="hdr-tag">// ARTIFACT ARCHIVE</div>
          <h2 className="hdr-title">THE WORK</h2>
          <div className="hdr-subtitle">A PHYSICAL INDEX OF THINGS I'VE BUILT</div>
          <button
            type="button"
            className="artifacts-audio-btn"
            onClick={() => {
              playSound?.('type_char');
              toggleSound?.();
            }}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>
        </header>

        <div className={`workstation-arena ${isInfoOpen ? 'info-active' : ''}`}>
          {prevArtifact && (
            <div className="flanking-workstation workstation-prev" aria-hidden="true">
              <ArtifactTerminal
                artifact={prevArtifact}
                artifactIndex={activeIndex - 1}
                totalArtifacts={ARTIFACTS_DATA.length}
                isCurrentActive={false}
                isInfoOpen={false}
                pressedKey={null}
                switchingState={false}
              />
            </div>
          )}

          <div className="centered-workstation">
            <ArtifactTerminal
              artifact={currentArtifact}
              artifactIndex={activeIndex}
              totalArtifacts={ARTIFACTS_DATA.length}
              isCurrentActive
              isInfoOpen={isInfoOpen}
              pressedKey={pressedKey}
              switchingState={switchingState}
              onKeyTrigger={handleKeyTrigger}
              onExploreClick={() => setIsInfoOpen(true)}
            />
          </div>

          {nextArtifact && (
            <div className="flanking-workstation workstation-next" aria-hidden="true">
              <ArtifactTerminal
                artifact={nextArtifact}
                artifactIndex={activeIndex + 1}
                totalArtifacts={ARTIFACTS_DATA.length}
                isCurrentActive={false}
                isInfoOpen={false}
                pressedKey={null}
                switchingState={false}
              />
            </div>
          )}

          <ArtifactInfo
            artifact={currentArtifact}
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
            playSound={playSound}
          />
        </div>

        <div className="archive-bottom-status">
          <span>{String(activeIndex + 1).padStart(3, '0')} / {String(ARTIFACTS_DATA.length).padStart(3, '0')}</span>
          <span className="archive-status-line" />
          <span>{isInfoOpen ? 'INSPECTION MODE' : 'TYPE ANY KEY TO INSPECT'}</span>
          <span className="archive-status-line" />
          <span>SCROLL TO MOVE</span>
        </div>
      </div>
    </section>
  );
};
