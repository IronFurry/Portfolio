import React from 'react';
import { StarField } from './StarField';
import { Planet } from './Planet';
import { Nebula } from './Nebula';
import { SpaceMist } from './SpaceMist';
import { DistantSun } from './DistantSun';
import { Asteroids } from './Asteroids';
import { Spaceship } from './Spaceship';
import { FloatingCard3D } from './FloatingCard3D';

/**
 * SpaceEnvironment Component
 * Composites the layered 3D deep-space universe with independent depth parallax.
 * Supports scrollProgress (0 to 1) for Phase 1 (Hero exit) & Phase 2/3 (Deep space travel + 3D Floating Card).
 */
export const SpaceEnvironment = ({
  isRevealed = true,
  scrollProgress = 0,
  onCardClick,
  isCardExpanded = false
}) => {
  const p = Math.max(0, Math.min(1, scrollProgress));

  // Opacity of Hero 3D elements (planet, spaceship, asteroids) as scroll progress moves from 0 to 0.4
  const heroElementsOpacity = Math.max(0, 1 - p * 2.5);

  return (
    <group>
      {/* Cold, subtle ambient fill light (fades slightly as we travel deep into space) */}
      <ambientLight color="#081420" intensity={0.4 * (1 - p * 0.5)} />

      {/* Deep space fill light */}
      <directionalLight
        position={[-8, -4, 4]}
        color="#0c1e2e"
        intensity={0.5 * (1 - p * 0.5)}
      />

      {/* Layer 0 & 1: Persistent Multi-depth Starfield for continuous space travel */}
      <StarField count={3400} parallaxStrength={0.025} />

      {/* Layer 2: Planet in far upper-left (fades out as we leave external environment) */}
      {heroElementsOpacity > 0.02 && (
        <group style={{ opacity: heroElementsOpacity }}>
          <Planet position={[-9.8, 5.8, -16.5]} radius={5.1} parallaxStrength={0.065} />
        </group>
      )}

      {/* Layer 3: Nebula interstellar dust */}
      <Nebula parallaxStrength={0.04} />

      {/* Volumetric cosmic mist */}
      <SpaceMist count={220} />

      {/* Layer 4: Distant Sun */}
      <DistantSun position={[12.2, 6.8, -17]} parallaxStrength={0.05} />

      {/* Layer 5: Asteroids (fade out early during travel) */}
      {heroElementsOpacity > 0.05 && (
        <Asteroids parallaxStrength={0.10} />
      )}

      {/* Layer 6: Spaceship focal point (moves out of view / fades during space travel) */}
      {heroElementsOpacity > 0.02 && (
        <group position={[0, -p * 6, 0]}>
          <Spaceship
            position={[0.45, 0.12, -0.2]}
            rotation={[0.35, -0.72, 0.14]}
            scale={[1.25, 1.25, 1.25]}
            parallaxStrength={0.035}
          />
        </group>
      )}

      {/* Phase 3 & 4: Floating Physical 3D Identity Card in Space */}
      <FloatingCard3D
        scrollProgress={scrollProgress}
        onCardClick={onCardClick}
        isExpanded={isCardExpanded}
      />
    </group>
  );
};
