import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useParallax } from './ParallaxController';

/**
 * Asteroids Component — Massive Cinematic Rock Field
 * Large dramatic formations filling the bottom ~40% of the frame.
 * Matches reference: dense bottom-left shelf, large bottom-right spire,
 * scattered mid-field debris, and drifting foreground chunks.
 */
export const Asteroids = ({ parallaxStrength = 0.10 }) => {
  const groupRef = useRef();
  const { mouse, isReducedMotion } = useParallax();
  const currentOffset = useRef({ x: 0, y: 0 });

  // Generate varied craggy rock geometries
  const rockGeometries = useMemo(() => {
    const makeCrag = (radius, detail, roughness) => {
      const geo = new THREE.DodecahedronGeometry(radius, detail);
      const pos = geo.attributes.position;
      const vec = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        vec.fromBufferAttribute(pos, i);
        const n1 = Math.sin(vec.x * 1.8) * Math.cos(vec.y * 1.8) * Math.sin(vec.z * 1.8);
        const n2 = Math.sin(vec.x * 3.8 + 1.1) * Math.cos(vec.z * 3.8 + 0.7) * 0.5;
        const n3 = Math.sin(vec.y * 6.2 + 2.3) * 0.25;
        vec.multiplyScalar(1.0 + (n1 + n2 + n3) * roughness);
        pos.setXYZ(i, vec.x, vec.y, vec.z);
      }
      geo.computeVertexNormals();
      return geo;
    };
    return [
      makeCrag(3.8, 3, 0.30),  // [0] giant anchor boulder
      makeCrag(2.6, 3, 0.34),  // [1] large crag
      makeCrag(1.9, 2, 0.38),  // [2] medium rock
      makeCrag(1.2, 2, 0.40),  // [3] small rock
      makeCrag(0.7, 1, 0.42),  // [4] pebble
      makeCrag(0.42, 1, 0.44), // [5] micro debris
      makeCrag(4.8, 3, 0.26),  // [6] massive spire (bottom-right)
    ];
  }, []);

  // Cinematic dark rock — receives subtle rim highlight from the distant sun
  const rockMaterial = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#0c1218',
      roughness: 0.88,
      metalness: 0.08,
      flatShading: true,
    }), []);

  // Rim-highlighted rock for boulders closest to the sun
  const rimRockMaterial = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#10181f',
      roughness: 0.82,
      metalness: 0.12,
      flatShading: true,
    }), []);

  const rocks = useMemo(() => [
    // ═══ BOTTOM-LEFT: Dense layered shelf ═══
    { g: 6, pos: [-9.5, -6.5,  1.2], rot: [0.4,  0.6, -0.2], rs: [0.002, 0.003,  0.001], sc: [1.0, 0.85, 1.1],  mat: 'rim' },
    { g: 0, pos: [-6.8, -6.0,  0.8], rot: [0.6,  0.3, -0.3], rs: [0.003, 0.004,  0.002], sc: [1.1, 0.90, 1.0],  mat: 'rim' },
    { g: 1, pos: [-4.5, -5.8,  0.6], rot: [0.3, -0.4,  0.2], rs: [0.004, 0.003,  0.003], sc: [0.95,0.80, 0.95], mat: 'base' },
    { g: 2, pos: [-2.8, -5.5,  0.4], rot: [0.5,  0.5,  0.4], rs: [0.005, 0.004, -0.003], sc: [0.80,0.75, 0.80], mat: 'base' },
    { g: 1, pos: [-7.4, -5.2,  1.4], rot: [0.2, -0.6,  0.1], rs: [0.003,-0.004,  0.002], sc: [0.85,0.70, 0.90], mat: 'base' },
    { g: 2, pos: [-5.5, -5.0,  1.6], rot: [-0.3, 0.3,  0.5], rs: [-0.004,0.005,  0.003], sc: [0.70,0.65, 0.70], mat: 'base' },

    // ═══ BOTTOM-RIGHT: Massive dramatic spire ═══
    { g: 6, pos: [10.5, -6.8,  1.0], rot: [-0.2, 0.5,  0.3], rs: [0.002, 0.003, -0.002], sc: [1.0, 1.10, 1.0],  mat: 'rim' },
    { g: 0, pos: [ 7.8, -6.2,  0.7], rot: [0.4, -0.3,  0.2], rs: [0.003,-0.004,  0.002], sc: [1.05,0.90, 1.0],  mat: 'rim' },
    { g: 1, pos: [ 5.8, -5.8,  0.5], rot: [0.2,  0.4,  0.1], rs: [0.004, 0.003, -0.003], sc: [0.90,0.80, 0.90], mat: 'base' },
    { g: 2, pos: [ 4.2, -5.5,  0.3], rot: [-0.4, 0.5,  0.3], rs: [-0.005,0.004,  0.003], sc: [0.80,0.72, 0.80], mat: 'base' },
    { g: 0, pos: [ 8.9, -5.2,  1.5], rot: [0.5, -0.5,  0.0], rs: [0.003, 0.002, -0.004], sc: [0.75,0.65, 0.75], mat: 'base' },

    // ═══ BOTTOM CENTRE: Scattered field bridging the gap ═══
    { g: 2, pos: [-0.8, -5.8,  0.2], rot: [0.3,  0.2,  0.5], rs: [0.006, 0.005,  0.004], sc: [0.70,0.65, 0.70], mat: 'base' },
    { g: 3, pos: [ 1.5, -5.6,  0.1], rot: [-0.2, 0.4, -0.3], rs: [-0.005,0.006,  0.004], sc: [0.60,0.55, 0.60], mat: 'base' },
    { g: 3, pos: [ 3.0, -5.4,  0.3], rot: [0.4, -0.3,  0.2], rs: [0.007,-0.005,  0.003], sc: [0.55,0.50, 0.55], mat: 'base' },

    // ═══ MIDFIELD: Drifting foreground chunks ═══
    { g: 4, pos: [ 4.2, -3.0, -3.2], rot: [0.2,  0.3,  0.1], rs: [0.012, 0.010, -0.008], sc: [0.52,0.52, 0.52], mat: 'base' },
    { g: 4, pos: [ 1.2, -3.6, -4.0], rot: [0.5, -0.2,  0.4], rs: [-0.010,0.014,  0.008], sc: [0.45,0.45, 0.45], mat: 'base' },
    { g: 5, pos: [-2.2, -2.8, -3.8], rot: [-0.3, 0.4,  0.3], rs: [0.015,-0.012,  0.010], sc: [0.38,0.38, 0.38], mat: 'base' },
    { g: 5, pos: [ 6.5, -2.4, -5.0], rot: [0.1,  0.6, -0.2], rs: [0.012, 0.008,  0.014], sc: [0.32,0.32, 0.32], mat: 'base' },
    { g: 5, pos: [-5.0, -2.2, -4.5], rot: [0.4, -0.3,  0.5], rs: [-0.014,0.012, -0.010], sc: [0.28,0.28, 0.28], mat: 'base' },
  ], []);

  const rockRefs = useRef([]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow tumbling on individual rocks
    rockRefs.current.forEach((mesh, idx) => {
      if (mesh && rocks[idx]) {
        const r = rocks[idx];
        mesh.rotation.x += r.rs[0] * delta;
        mesh.rotation.y += r.rs[1] * delta;
        mesh.rotation.z += r.rs[2] * delta;
      }
    });

    if (!isReducedMotion.current) {
      const targetX = mouse.current.x * parallaxStrength * 4;
      const targetY = mouse.current.y * parallaxStrength * 3;
      currentOffset.current.x = THREE.MathUtils.damp(currentOffset.current.x, targetX, 2.8, delta);
      currentOffset.current.y = THREE.MathUtils.damp(currentOffset.current.y, targetY, 2.8, delta);
      groupRef.current.position.x = currentOffset.current.x;
      groupRef.current.position.y = currentOffset.current.y;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Subtle sun rim-light for boulder surfaces facing upper-right */}
      <directionalLight
        position={[12, 8, -10]}
        color="#4a7fa8"
        intensity={0.9}
      />
      {/* Soft underlight — prevents pure black silhouettes */}
      <ambientLight color="#060c12" intensity={0.6} />

      {rocks.map((rock, idx) => (
        <mesh
          key={idx}
          ref={el => (rockRefs.current[idx] = el)}
          geometry={rockGeometries[rock.g]}
          material={rock.mat === 'rim' ? rimRockMaterial : rockMaterial}
          position={rock.pos}
          rotation={rock.rot}
          scale={rock.sc}
          castShadow
        />
      ))}
    </group>
  );
};
