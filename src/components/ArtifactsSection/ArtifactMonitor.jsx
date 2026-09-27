import React from 'react';

export const ArtifactMonitor = ({
  artifact,
  totalArtifacts,
  isCurrentActive = false,
  lastKeyPressed,
  switchingState,
  onExploreClick
}) => {
  const previewUrl = artifact?.previewUrl;
  const previewImage = artifact?.previewImage;

  return (
    <div className={`retro-monitor ${isCurrentActive ? 'retro-monitor-current' : 'retro-monitor-flanking'}`}>
      <div className="monitor-top-bezel">
        <span className="monitor-brand">AK</span>
        <span className="monitor-model">ARCHIVE // CRT-01</span>
        <span className={`monitor-led ${isCurrentActive ? 'is-on' : ''}`} />
      </div>

      <div className="monitor-glass-frame">
        <div className="monitor-screen">
          {previewUrl ? (
            <iframe
              className="project-preview-frame"
              src={previewUrl}
              title={`${artifact.name} project preview`}
              loading="lazy"
              tabIndex={isCurrentActive ? 0 : -1}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : previewImage ? (
            <img
              className="project-preview-image"
              src={previewImage}
              alt={`${artifact.name} project preview`}
              draggable="false"
            />
          ) : (
            <div className="project-preview-fallback">
              <div className="preview-index">{artifact.id}</div>
              <div className="preview-title">{artifact.name}</div>
              <div className="preview-subtitle">{artifact.subtitle}</div>
            </div>
          )}

          <div className="crt-vignette" />
          <div className="crt-scanlines" />
          <div className="crt-glass" />

          {switchingState && isCurrentActive && (
            <div className="crt-switch-flash" aria-hidden="true" />
          )}

          {lastKeyPressed && isCurrentActive && (
            <div className="crt-key-feedback" aria-hidden="true">
              <span>&gt;</span> {lastKeyPressed === ' ' ? 'SPACE' : lastKeyPressed.toUpperCase()}
            </div>
          )}

          {isCurrentActive && !lastKeyPressed && !switchingState && (
            <button
              type="button"
              className="monitor-explore-hit"
              onClick={onExploreClick}
              aria-label={`Explore ${artifact.name}`}
            >
              <span>TYPE TO EXPLORE</span>
            </button>
          )}
        </div>
      </div>

      <div className="monitor-controls">
        <span className="monitor-control-line" />
        <span className="monitor-control" />
        <span className="monitor-control" />
        <span className="monitor-control power-control" />
      </div>

      <div className="monitor-base">
        <span className="monitor-base-label">
          {artifact.id} / {String(totalArtifacts).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
};
