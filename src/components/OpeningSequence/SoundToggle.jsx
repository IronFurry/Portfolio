import React from 'react';
import { Volume2, VolumeX, RotateCcw, FastForward } from 'lucide-react';

export const SoundToggle = ({
  soundEnabled,
  toggleSound,
  playSound,
  onRestart,
  onSkip,
  isCompleted
}) => {
  const handleToggle = () => {
    toggleSound();
    if (!soundEnabled && playSound) {
      setTimeout(() => playSound('boot_ok'), 50);
    }
  };

  return (
    <div className="hud-controls-topright">
      <button
        type="button"
        className={`hud-btn ${soundEnabled ? 'sound-active' : ''}`}
        onClick={handleToggle}
        title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
      >
        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        <span className="btn-label">{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
      </button>

      {!isCompleted && (
        <button
          type="button"
          className="hud-btn skip-btn"
          onClick={onSkip}
          title="Skip Intro Sequence"
          aria-label="Skip Intro Sequence"
        >
          <FastForward size={14} />
          <span className="btn-label">SKIP</span>
        </button>
      )}

      <button
        type="button"
        className="hud-btn restart-btn"
        onClick={onRestart}
        title="Replay Opening Sequence"
        aria-label="Replay Opening Sequence"
      >
        <RotateCcw size={14} />
        <span className="btn-label">REPLAY</span>
      </button>
    </div>
  );
};
