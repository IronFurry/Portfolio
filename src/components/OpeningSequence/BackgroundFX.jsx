import React from 'react';

/**
 * BackgroundFX Component
 * Renders subtle sci-fi cinematic visual layers:
 * - Film grain noise pattern
 * - CRT scanlines and subtle cathode sweep
 * - Deep radial vignette
 * - Futuristic corner telemetry markers (+)
 */
export const BackgroundFX = ({ isFlickering }) => {
  return (
    <div className={`bg-fx-container ${isFlickering ? 'is-flickering' : ''}`}>
      {/* Deep Radial Vignette */}
      <div className="vignette-overlay" />

      {/* SVG Noise / Film Grain */}
      <div className="film-grain" />

      {/* CRT Scanline Beam */}
      <div className="scanlines" />

      {/* Subtle Digital Grid backdrop */}
      <div className="telemetry-grid" />

      {/* Subtle HUD corner crosshairs */}
      <div className="hud-corner top-left">+</div>
      <div className="hud-corner top-right">+</div>
      <div className="hud-corner bottom-left">+</div>
      <div className="hud-corner bottom-right">+</div>

      {/* Header system badge */}
      <div className="hud-top-meta">
        <span className="meta-tag">[ ARCHIVE_SYS // v4.09.2 ]</span>
        <span className="meta-status">SECURE NODE</span>
      </div>
    </div>
  );
};
