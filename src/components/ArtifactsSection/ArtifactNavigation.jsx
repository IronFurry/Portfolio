import React from 'react';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export const ArtifactNavigation = ({
  currentIndex,
  totalArtifacts,
  onPrev,
  onNext,
  isInfoOpen,
  onToggleInfo,
  playSound
}) => {
  return (
    <div className="artifacts-nav-container">
      {/* Left Nav Button */}
      <button
        type="button"
        className={`artifact-nav-arrow nav-prev ${currentIndex === 0 ? 'disabled' : ''}`}
        onClick={() => {
          if (currentIndex > 0) {
            playSound?.('type_char');
            onPrev();
          }
        }}
        disabled={currentIndex === 0}
        aria-label="Previous Artifact"
      >
        <ChevronLeft size={18} />
        <span className="nav-arrow-text">PREVIOUS ARTIFACT</span>
      </button>

      {/* Center Index Track Pips & Command Shortcut Hint */}
      <div className="artifacts-track-indicators">
        <div className="track-pips">
          {Array.from({ length: totalArtifacts }).map((_, idx) => (
            <span
              key={idx}
              className={`track-pip ${idx === currentIndex ? 'active' : ''}`}
              title={`Artifact 00${idx + 1}`}
            />
          ))}
        </div>
        <div className="track-hint">
          <span>TYPE ANY KEY TO EXPLORE</span>
          <span className="hint-divider">•</span>
          <span>PRESS <kbd className="kbd-pill">ESC</kbd> TO CLOSE</span>
        </div>
      </div>

      {/* Right Nav Button */}
      <button
        type="button"
        className={`artifact-nav-arrow nav-next ${currentIndex === totalArtifacts - 1 ? 'disabled' : ''}`}
        onClick={() => {
          if (currentIndex < totalArtifacts - 1) {
            playSound?.('type_char');
            onNext();
          }
        }}
        disabled={currentIndex === totalArtifacts - 1}
        aria-label="Next Artifact"
      >
        <span className="nav-arrow-text">NEXT ARTIFACT</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
