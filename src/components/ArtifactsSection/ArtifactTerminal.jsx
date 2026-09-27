import React from 'react';
import { ArtifactMonitor } from './ArtifactMonitor';
import { ArtifactKeyboard } from './ArtifactKeyboard';

export const ArtifactTerminal = ({
  artifact,
  artifactIndex,
  totalArtifacts,
  isCurrentActive,
  isInfoOpen,
  pressedKey,
  switchingState,
  onKeyTrigger,
  onExploreClick
}) => {
  return (
    <div
      className={`retro-computer ${isCurrentActive ? 'retro-computer-current' : 'retro-computer-preview'} ${isInfoOpen ? 'is-information-open' : ''}`}
      aria-label={`${artifact.name} artifact terminal`}
    >
      <ArtifactMonitor
        artifact={artifact}
        artifactIndex={artifactIndex}
        totalArtifacts={totalArtifacts}
        isCurrentActive={isCurrentActive}
        lastKeyPressed={pressedKey}
        switchingState={switchingState}
        onExploreClick={onExploreClick}
      />

      {isCurrentActive && (
        <ArtifactKeyboard
          pressedKey={pressedKey}
          onKeyTrigger={onKeyTrigger}
        />
      )}
    </div>
  );
};
