import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import './floating-card.css';

/**
 * FloatingCard3D Component
 * 
 * 16:9 Horizontal 3D physical object floating in deep space.
 * Position, scale, tilt, and opacity are mapped to scrollProgress (0 to 1).
 * Capped at 70% scale (0.7 max scale distance).
 */
export const FloatingCard3D = ({ scrollProgress = 0, onCardClick }) => {
  const groupRef = useRef();
  const currentPos = useRef(new THREE.Vector3(0.6, 0.4, -14));
  const currentRot = useRef(new THREE.Euler(0.12, -0.18, 0.04));

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Map scrollProgress (0 to 1) to 3D position & rotation
    const p = Math.max(0, Math.min(1, scrollProgress));

    // Target 3D coordinates based on scroll progress:
    // At 0%: far back [0.6, 0.4, -14]
    // At 100%: right in front of camera [0, 0, 0]
    const targetX = THREE.MathUtils.lerp(0.6, 0, p);
    const targetY = THREE.MathUtils.lerp(0.4, 0, p);
    const targetZ = THREE.MathUtils.lerp(-14, 0, p);

    const targetRotX = THREE.MathUtils.lerp(0.12, 0, p);
    const targetRotY = THREE.MathUtils.lerp(-0.18, 0, p);
    const targetRotZ = THREE.MathUtils.lerp(0.04, 0, p);

    // Idle floating wobble active when card is near (p > 0.85)
    const idleY = p > 0.85 ? Math.sin(time * 1.5) * 0.04 : 0;
    const idleRotZ = p > 0.85 ? Math.cos(time * 1.2) * 0.02 : 0;

    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX, 5, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY + idleY, 5, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, 5, delta);

    currentRot.current.x = THREE.MathUtils.damp(currentRot.current.x, targetRotX, 5, delta);
    currentRot.current.y = THREE.MathUtils.damp(currentRot.current.y, targetRotY, 5, delta);
    currentRot.current.z = THREE.MathUtils.damp(currentRot.current.z, targetRotZ + idleRotZ, 5, delta);

    groupRef.current.position.copy(currentPos.current);
    groupRef.current.rotation.copy(currentRot.current);
  });

  const p = Math.max(0, Math.min(1, scrollProgress));

  // Opacity: 0 at <30%, fades in from 30% -> 65%
  const opacity = p < 0.3 ? 0 : Math.min(1, (p - 0.3) / 0.35);

  // Scale: capped at 70% (0.7 max scale distance)
  const cardScale = THREE.MathUtils.lerp(0.15, 0.4, Math.max(0, (p - 0.25) / 0.75));

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} scale={[cardScale, cardScale, cardScale]}>
      {/* 16:9 3D Mesh Backdrop plane for physical depth */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[5.2, 2.92]} />
        <meshBasicMaterial color="#06090e" transparent opacity={opacity * 0.96} />
      </mesh>

      {/* Drei HTML 3D Surface */}
      <Html
        transform
        occlude={false}
        distanceFactor={2.4}
        style={{
          opacity: opacity,
          pointerEvents: p > 0.75 ? 'auto' : 'none'
        }}
      >
        <div
          className={`floating-3d-card-body aspect-16-9 ${p > 0.85 ? 'interactive-ready' : ''}`}
          onClick={() => {
            if (p > 0.75 && onCardClick) {
              onCardClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Access Identity Record 001"
        >
          <div className="card-corner corner-tl">┌</div>
          <div className="card-corner corner-tr">┐</div>
          <div className="card-corner corner-bl">└</div>
          <div className="card-corner corner-br">┘</div>

          {/* 16:9 Card Layout */}
          <div className="card-top-bar">
            <div className="card-header-tag">
              <span className="dot-cyan">■</span> IDENTITY RECORD
            </div>
            <div className="card-id-number">001</div>
          </div>

          <div className="card-middle-content">
            <div className="card-subject-name">ARYAN KATE</div>
            <div className="card-subject-role">ENGINEER · BUILDER · EXPERIMENTER</div>
          </div>

          <div className="card-bottom-bar">
            {p > 0.75 ? (
              <div className="card-access-prompt">
                <span className="arrow-prefix">&gt;</span> [ ACCESS RECORD ]
              </div>
            ) : (
              <div className="card-distance-prompt">APPROACHING RECORD...</div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};
