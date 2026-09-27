import React from 'react';
import { ExternalLink, X } from 'lucide-react';

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ArtifactInfo = ({ artifact, isOpen, onClose, playSound }) => {
  if (!isOpen || !artifact) return null;

  return (
    <aside className="artifact-info-panel" role="region" aria-label={`Project information: ${artifact.name}`}>
      <div className="info-panel-header">
        <span className="info-meta-badge">
          {artifact.id} / {artifact.status}
        </span>
        <button
          type="button"
          className="info-close-btn"
          onClick={() => {
            playSound?.('type_char');
            onClose();
          }}
          title="Close information"
        >
          <X size={14} />
          <span>ESC</span>
        </button>
      </div>

      <div className="info-editorial-body">
        <div className="info-title-block">
          <span className="info-kicker">ARTIFACT {artifact.id}</span>
          <h2 className="info-project-name">{artifact.name}</h2>
          <p className="info-subtitle">{artifact.subtitle}</p>
        </div>

        <p className="info-description">{artifact.description}</p>

        <section className="info-section-block">
          <h3 className="info-section-label">// WHY IT EXISTS</h3>
          <p className="info-why-text">{artifact.why}</p>
        </section>

        <section className="info-section-block">
          <h3 className="info-section-label">// SYSTEM STACK</h3>
          <div className="info-tech-chips">
            {artifact.technologies?.map((tech) => (
              <span key={tech} className="tech-chip">{tech}</span>
            ))}
          </div>
        </section>

        <section className="info-section-block">
          <h3 className="info-section-label">// NOTABLE FUNCTIONALITY</h3>
          <ul className="info-functionality-list">
            {artifact.functionality?.map((func, idx) => (
              <li key={idx} className="func-item">
                <span className="func-bullet">→</span>
                <span>{func}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="info-actions-block">
          {artifact.liveUrl && (
            <a
              href={artifact.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="info-action-btn primary-action"
              onClick={() => playSound?.('boot_ok')}
            >
              <span>OPEN LIVE SYSTEM</span>
              <ExternalLink size={14} />
            </a>
          )}
          {artifact.sourceUrl && (
            <a
              href={artifact.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="info-action-btn secondary-action"
              onClick={() => playSound?.('type_char')}
            >
              <GithubIcon size={14} />
              <span>VIEW SOURCE</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
};
