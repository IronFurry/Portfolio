import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useParallax } from './ParallaxController';

/**
 * HeroCamera Component
 * 
 * Provides a scroll-driven cinematic floating camera:
 * - Camera position.z travels forward into deep space as user scrolls (7.8 -> 2.4)
 * - Scroll position directly dictates camera position (stopping/reversing with scroll)
 * - Subtle damped mouse parallax remains for cinematic stability
 */
export const HeroCamera = ({ scrollProgress = 0, isCardExpanded = false }) => {
  const cameraRef = useRef();
  const { mouse, isReducedMotion } = useParallax();

  // Smoothed camera target coordinates
  const currentPos = useRef(new THREE.Vector3(0, 0, 7.8));
  const targetPos = useRef(new THREE.Vector3(0, 0, 7.8));
  const currentLookAt = useRef(new THREE.Vector3(0.5, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0.5, 0, 0));

  useFrame((state, delta) => {
    if (!cameraRef.current) return;
    const time = state.clock.getElapsedTime();

    const p = Math.max(0, Math.min(1, scrollProgress));

    // Map scrollProgress to camera Z travel:
    // 0% -> Z = 7.8 (Hero framing)
    // 100% -> Z = 3.4 (70% max scrolled/zoomed distance)
    const baseZ = THREE.MathUtils.lerp(7.8, 3.4, p);
    const baseX = THREE.MathUtils.lerp(0, 0, p);
    const baseY = THREE.MathUtils.lerp(0, 0, p);

    const lookX = THREE.MathUtils.lerp(0.5, 0, p);
    const lookY = THREE.MathUtils.lerp(0, 0, p);
    const lookZ = THREE.MathUtils.lerp(0, 0, p);

    if (isReducedMotion.current) {
      cameraRef.current.position.set(baseX, baseY, baseZ);
      cameraRef.current.lookAt(lookX, lookY, lookZ);
      return;
    }

    // Smooth mouse parallax (reduced when focused on card at p > 0.8)
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, mouse.current.targetX, 3.5, delta);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, mouse.current.targetY, 3.5, delta);

    const parallaxFactor = (1 - p * 0.7);
    const parallaxX = mouse.current.x * 0.35 * parallaxFactor;
    const parallaxY = mouse.current.y * 0.25 * parallaxFactor;

    // Organic idle camera breathing (only slight)
    const idleX = Math.sin(time * 0.22) * 0.08 * parallaxFactor;
    const idleY = Math.cos(time * 0.31) * 0.06 * parallaxFactor;

    targetPos.current.set(
      baseX + idleX + parallaxX,
      baseY + idleY + parallaxY,
      baseZ
    );

    // Smooth camera damping towards targetPos
    currentPos.current.lerp(targetPos.current, 0.08);
    cameraRef.current.position.copy(currentPos.current);

    // Subtle camera look-at targeting
    targetLookAt.current.set(
      lookX + mouse.current.x * 0.1,
      lookY + mouse.current.y * 0.08,
      lookZ
    );
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    cameraRef.current.lookAt(currentLookAt.current);

    cameraRef.current.rotation.z = 0;
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 7.8]}
      fov={48}
      near={0.1}
      far={1000}
    />
  );
};
