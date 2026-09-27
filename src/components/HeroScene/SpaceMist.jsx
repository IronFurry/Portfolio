import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SpaceMist Component
 * Volumetric, slow-drifting cosmic fog mist floating through empty 3D space.
 * Adds rich depth, atmosphere, and cinematic ethereal mist around the environment.
 */
export const SpaceMist = ({ count = 220 }) => {
  const pointsRef = useRef();
  const materialRef = useRef();

  // Procedural mist particle parameters
  const [positions, colors, sizes, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    const spd = new Float32Array(count);

    const tempColor = new THREE.Color();

    // Palette of ethereal cosmic mist tones (soft cyan, deep teal, icy indigo, silver-white)
    const mistPalette = [
      new THREE.Color('#1a384c'),
      new THREE.Color('#224864'),
      new THREE.Color('#152838'),
      new THREE.Color('#325a78'),
      new THREE.Color('#1e3042')
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Volumetric distribution through empty space
      pos[i3] = (Math.random() - 0.5) * 36;       // X spread
      pos[i3 + 1] = (Math.random() - 0.5) * 22;   // Y spread
      pos[i3 + 2] = -18 + (Math.random() - 0.5) * 24; // Z depth [-30, 6]

      // Pick mist color
      const colorChoice = mistPalette[Math.floor(Math.random() * mistPalette.length)];
      tempColor.copy(colorChoice);
      // Slight random brightness variation
      const lumVar = 0.85 + Math.random() * 0.3;
      col[i3] = tempColor.r * lumVar;
      col[i3 + 1] = tempColor.g * lumVar;
      col[i3 + 2] = tempColor.b * lumVar;

      // Wide, soft misty cloud particle sizes
      sz[i] = 7.0 + Math.random() * 14.0;

      // Random movement phase and drift speeds
      ph[i] = Math.random() * Math.PI * 2;
      spd[i] = 0.15 + Math.random() * 0.35;
    }

    return [pos, col, sz, ph, spd];
  }, [count]);

  // Shader material for ultra-soft, volumetric misty puffs
  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) }
    },
    vertexShader: `
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;
      attribute vec3 aColor;

      varying vec3 vColor;
      varying float vAlpha;

      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vColor = aColor;

        // Gentle organic mist breathing and slow wave drift
        vec3 p = position;
        p.x += sin(uTime * aSpeed * 0.2 + aPhase) * 0.6;
        p.y += cos(uTime * aSpeed * 0.15 + aPhase * 1.5) * 0.4;
        p.z += sin(uTime * aSpeed * 0.1 + aPhase * 0.7) * 0.3;

        // Subtle alpha breathing
        vAlpha = 0.12 + 0.08 * sin(uTime * 0.3 + aPhase);

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

        // Scale mist particle size based on depth
        gl_PointSize = aSize * uPixelRatio * (28.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        // Ultra-soft volumetric Gaussian radial falloff for mist
        float softMask = exp(-dist * dist * 10.0);
        float edgeFade = smoothstep(0.5, 0.0, dist);

        float finalAlpha = softMask * edgeFade * vAlpha;

        gl_FragColor = vec4(vColor * 1.2, finalAlpha);
      }
    `
  }), []);

  // Update time uniform for slow organic drifting
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        args={[shader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
