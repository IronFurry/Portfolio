import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useParallax } from './ParallaxController';

/**
 * Nebula Component (Layer 3)
 * Full-viewport cinematic interstellar dust cloud.
 * Three large panoramic planes that collectively fill the entire 16:9 scene
 * with seamlessly blended, deep-space atmospheric haze — no visible edges.
 */
export const Nebula = ({ parallaxStrength = 0.04 }) => {
  const groupRef = useRef();
  const { mouse, isReducedMotion } = useParallax();
  const currentOffset = useRef({ x: 0, y: 0 });

  // Build a seamless cloud texture procedurally (pure canvas, no external file)
  const cloudTexture = useMemo(() => {
    const W = 1024;
    const H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Self-contained noise helpers — no external import needed
    const hashFn = (x, y) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
      return n - Math.floor(n);
    };
    const noiseFn = (x, y) => {
      const ix = Math.floor(x); const iy = Math.floor(y);
      const fx = x - ix; const fy = y - iy;
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      return hashFn(ix, iy) * (1 - ux) * (1 - uy)
           + hashFn(ix + 1, iy) * ux * (1 - uy)
           + hashFn(ix, iy + 1) * (1 - ux) * uy
           + hashFn(ix + 1, iy + 1) * ux * uy;
    };
    const fbmFn = (x, y, oct = 5) => {
      let v = 0; let a = 0.5; let f = 1;
      for (let i = 0; i < oct; i++) { v += a * noiseFn(x * f, y * f); f *= 2.1; a *= 0.48; }
      return v;
    };

    const imgData = ctx.createImageData(W, H);
    const data = imgData.data;

    for (let y = 0; y < H; y++) {
      const ny = y / H;
      const vFade = Math.sin(ny * Math.PI); // Vertical bilateral fade
      for (let x = 0; x < W; x++) {
        const nx = x / W;
        const idx = (y * W + x) * 4;
        const hFade = Math.sin(nx * Math.PI); // Horizontal bilateral fade
        const edgeMask = Math.pow(hFade * vFade, 1.2);

        const n1 = fbmFn(nx * 3.2 + 0.2, ny * 2.6 + 0.3, 4);
        const n2 = fbmFn(nx * 6.5 + 1.5, ny * 4.8 + 0.8, 3) * 0.26;
        const raw = n1 + n2;
        const smoke = Math.max(0, Math.min(1, (raw - 0.12) / 0.76));

        data[idx]     = Math.floor(14 + smoke * 24);
        data[idx + 1] = Math.floor(32 + smoke * 52);
        data[idx + 2] = Math.floor(54 + smoke * 80);
        data[idx + 3] = Math.min(255, Math.floor(edgeMask * smoke * 240));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, []);

  // Three panoramic planes — together they cover the full 16:9 viewport
  const layers = useMemo(() => [
    // 1. Deep background haze — spans full width, center-bottom
    { position: [0, -1.2, -12], scale: [52, 22, 1], rotZ: 0.018, opacity: 0.55, color: new THREE.Color('#0d1f2d') },
    // 2. Mid-ground primary dust cloud — slightly closer, shifted right
    { position: [2.0, -0.8, -6.5], scale: [42, 18, 1], rotZ: -0.03, opacity: 0.60, color: new THREE.Color('#122234') },
    // 3. Foreground accent wisp — upper-mid area
    { position: [-1.5, 0.6, -4.0], scale: [36, 14, 1], rotZ: 0.025, opacity: 0.40, color: new THREE.Color('#0a1820') }
  ], []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      if (child.isMesh) {
        child.rotation.z += Math.sin(time * 0.025 + i * 1.2) * 0.00008;
      }
    });

    if (!isReducedMotion.current) {
      const targetX = mouse.current.x * parallaxStrength * 4;
      const targetY = mouse.current.y * parallaxStrength * 3;
      currentOffset.current.x = THREE.MathUtils.damp(currentOffset.current.x, targetX, 2.4, delta);
      currentOffset.current.y = THREE.MathUtils.damp(currentOffset.current.y, targetY, 2.4, delta);
      groupRef.current.position.x = currentOffset.current.x;
      groupRef.current.position.y = currentOffset.current.y;
    }
  });

  return (
    <group ref={groupRef}>
      {layers.map((l, idx) => (
        <mesh key={idx} position={l.position} scale={l.scale} rotation={[0, 0, l.rotZ]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={cloudTexture}
            color={l.color}
            transparent
            opacity={l.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

