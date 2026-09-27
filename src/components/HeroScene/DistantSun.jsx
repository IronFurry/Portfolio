import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useParallax } from './ParallaxController';
import { createSunFlareTexture } from '../../utils/spaceTextures';

/**
 * DistantSun Component (Layer 4)
 * Refined distant star:
 * - Reduced bloom and glare by ~65% so it doesn't overpower the scene
 * - Piercing, elegant distant star with thin, soft horizontal anamorphic streak
 * - Strong directional key light illuminating the spaceship and environment
 * - Parallax movement (0.05)
 */
export const DistantSun = ({
  position = [12.2, 6.8, -17],
  parallaxStrength = 0.05
}) => {
  const groupRef = useRef();
  const { mouse, isReducedMotion } = useParallax();
  const currentOffset = useRef({ x: 0, y: 0 });

  // Generate organic radiant flare texture
  const flareTexture = useMemo(() => createSunFlareTexture(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!isReducedMotion.current) {
      const targetX = mouse.current.x * parallaxStrength * 4;
      const targetY = mouse.current.y * parallaxStrength * 3;

      currentOffset.current.x = THREE.MathUtils.damp(
        currentOffset.current.x,
        targetX,
        2.2,
        delta
      );
      currentOffset.current.y = THREE.MathUtils.damp(
        currentOffset.current.y,
        targetY,
        2.2,
        delta
      );

      groupRef.current.position.x = position[0] + currentOffset.current.x;
      groupRef.current.position.y = position[1] + currentOffset.current.y;
      groupRef.current.position.z = position[2];
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Strong Primary Key Directional Light illuminating the spaceship & planet rim */}
      <directionalLight
        color="#e6f2fe"
        intensity={3.8}
        position={[0, 0, 0]}
        target-position={[-8, -4, 10]}
      />

      {/* Controlled Star Core Point Light */}
      <pointLight
        color="#ffffff"
        intensity={2.8}
        distance={45}
        decay={1.2}
      />

      {/* 1. Controlled Radiant Star Core (Reduced scale: ~65% smaller, elegant & distant) */}
      <mesh scale={[8.5, 7.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={flareTexture}
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Tight Pinpoint Star Center */}
      <mesh scale={[3.8, 3.5, 1]} position={[0, 0, 0.02]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={flareTexture}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Subtle, Thin Anamorphic Horizontal Flare Streak */}
      <mesh scale={[32, 0.75, 1]} position={[0, 0, -0.05]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={flareTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
