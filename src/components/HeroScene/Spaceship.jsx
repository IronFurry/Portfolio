import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useParallax } from './ParallaxController';

/**
 * Spaceship Component (Layer 6 — Visual Focal Point)
 * 
 * AAA Cinematic Material Separation:
 * - Main Hull: Dark graphite / gunmetal (#2a313b, roughness 0.46, metalness 0.65)
 * - Armor Panels: Varied tonal facets with defined specular highlights
 * - Cockpit: Near-black high-gloss reflective glass (#020617, roughness 0.04, metalness 0.96)
 * - Mechanical Components & Engine Housings: Dark metallic titanium (#1a1f26)
 * - Engine Core: Restrained, subtle cyan/white emissive glow (intensity 0.9)
 * - Accent Panel: Small muted warm orange/brown detail (#a44b20, matte finish)
 * 
 * Cinematic Lighting:
 * - Distant sun directional key highlights
 * - Cool icy-blue rim light across upper edges
 * - Subtle ambient space fill preventing flat black
 * - Restrained micro-LEDs (cockpit HUD glow, wing markers, strobe beacon)
 */
export const Spaceship = ({
  position = [0.45, 0.12, -0.2],
  rotation = [0.35, -0.92, 0.34],
  scale = [1.25, 1.25, 1.25],
  parallaxStrength = 0.35
}) => {
  const groupRef = useRef();
  const innerRef = useRef();
  const beaconRef = useRef();
  const engineLight1Ref = useRef();
  const engineLight2Ref = useRef();

  const { mouse, isReducedMotion } = useParallax();
  const currentOffset = useRef({ x: 0, y: 0 });

  // Load user's authentic Spaceship.glb model
  const { scene } = useGLTF('/Spaceship.glb');

  // Clone scene and apply material separation
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const nodeName = child.name || '';
        const matName = (child.material?.name || '').toLowerCase();

        // 1. Cockpit Canopy (Plane.002 / glass.001) -> Near-black glossy reflective glass
        if (nodeName === 'Plane.002' || matName === 'glass.001') {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#030712'),
            roughness: 0.04,
            metalness: 0.96,
            envMapIntensity: 2.2
          });
        }
        // 2. Accent Panel (Plane.001 / Bosyers) -> Small muted warm orange/brown detail
        else if (nodeName === 'Plane.001' || matName === 'bosyers') {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#9e451b'), // Muted warm terracotta orange
            roughness: 0.55,
            metalness: 0.18,
            flatShading: true
          });
        }
        // 3. Engine Housings & Nozzles (Circle, Circle.001, Circle.002, Circle.003) -> Dark metal
        else if (nodeName.startsWith('Circle') || matName === 'rocket') {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#1a1f26'),
            roughness: 0.42,
            metalness: 0.82,
            emissive: new THREE.Color('#38bdf8'),
            emissiveIntensity: 0.85 // Very subtle, realistic cyan/white glow
          });
        }
        // 4. Main Hull (Plane / Material "glass") -> Star Wars Iconic Off-White / Battle-Grey
        else {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#dce3eb'), // Star Wars X-Wing / Star Destroyer durasteel off-white
            roughness: 0.44,                   // Matte aerospace ceramic/durasteel finish
            metalness: 0.22,
            flatShading: false
          });
        }
      }
    });

    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Anti-collision strobe beacon
    if (beaconRef.current) {
      const cycle = time % 1.6;
      const isFlash = (cycle < 0.07) || (cycle > 0.18 && cycle < 0.25);
      beaconRef.current.intensity = isFlash ? 1.8 : 0.02;
    }

    // 2. Compound engine thrust signature — irregular multi-freq pulse (more realistic)
    const enginePulse =
      Math.sin(time * 22) * 0.14 +
      Math.cos(time * 31) * 0.10 +
      Math.sin(time * 7.4) * 0.06;  // slow swell underneath
    if (engineLight1Ref.current) engineLight1Ref.current.intensity = 1.4 + enginePulse;
    if (engineLight2Ref.current) engineLight2Ref.current.intensity = 1.4 + enginePulse;

    if (!isReducedMotion.current) {
      // 3. Organic idle float — more pronounced, multi-axis
      if (innerRef.current) {
        // Compound float using two incommensurate frequencies (never repeats exactly)
        const idleFloatY =
          Math.sin(time * 0.42) * 0.06 +
          Math.cos(time * 0.27) * 0.022;
        const idlePitch =
          Math.sin(time * 0.31) * 0.018 +
          Math.cos(time * 0.19) * 0.008 +
          mouse.current.y * 0.055;
        const idleRoll =
          Math.cos(time * 0.24) * 0.020 +
          Math.sin(time * 0.38) * 0.010 -
          mouse.current.x * 0.048;
        const idleYaw = -mouse.current.x * 0.065;

        innerRef.current.position.y = idleFloatY;
        innerRef.current.rotation.set(
          rotation[0] + idlePitch,
          rotation[1] + idleYaw,
          rotation[2] + idleRoll
        );
      }

      // 4. Parallax offset (wider range for more cinematic cursor response)
      const targetX = mouse.current.x * parallaxStrength * 5.5;
      const targetY = mouse.current.y * parallaxStrength * 4.0;

      currentOffset.current.x = THREE.MathUtils.damp(currentOffset.current.x, targetX, 2.2, delta);
      currentOffset.current.y = THREE.MathUtils.damp(currentOffset.current.y, targetY, 2.2, delta);

      groupRef.current.position.x = position[0] + currentOffset.current.x;
      groupRef.current.position.y = position[1] + currentOffset.current.y;
      groupRef.current.position.z = position[2];
    }
  });


  return (
    <group ref={groupRef} position={position} scale={scale}>
      <group ref={innerRef} rotation={rotation}>
        {/* Main GLTF Spaceship Hierarchy */}
        <primitive object={clonedScene} />

        {/* ================= REFINED LIGHTING RIG ================= */}

        {/* 1. Cool Icy-Blue Rim Light (Glancing top-left edge & dorsal armor contours) */}
        <directionalLight
          position={[-3.5, 2.8, -1.0]}
          color="#93c5fd"
          intensity={0.85}
        />

        {/* 2. Key Sun Directional Highlight (Revealing cockpit, top hull, and side angles) */}
        <directionalLight
          position={[5.0, 3.5, 3.0]}
          color="#f0f7ff"
          intensity={1.2}
          target-position={[0, 0, 0]}
        />

        {/* 3. Subtle Underbelly Fill Light (Preventing flat black without turning ship silver) */}
        <pointLight
          position={[-0.8, -1.2, 0.4]}
          color="#0f2030"
          intensity={0.3}
          distance={3.5}
        />

        {/* ================= MICRO FUNCTIONAL LIGHTS ================= */}

        {/* Cockpit Flight-Deck HUD Interior Glow */}
        <pointLight
          position={[0, 0.28, 0.42]}
          color="#38bdf8"
          intensity={0.35}
          distance={1.4}
        />

        {/* Dorsal Anti-Collision Strobe Beacon */}
        <mesh position={[0, 0.48, -0.4]}>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <pointLight
          ref={beaconRef}
          position={[0, 0.52, -0.4]}
          color="#ffffff"
          intensity={0.05}
          distance={2.5}
        />

        {/* Starboard Wingtip Navigation Light (Emerald Green Micro-LED) */}
        <mesh position={[0.92, 0.12, -0.2]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <pointLight
          position={[0.95, 0.12, -0.2]}
          color="#10b981"
          intensity={0.35}
          distance={1.4}
        />

        {/* Port Wingtip Navigation Light (Ruby Red Micro-LED) */}
        <mesh position={[-0.92, 0.12, -0.2]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <pointLight
          position={[-0.95, 0.12, -0.2]}
          color="#ef4444"
          intensity={0.35}
          distance={1.4}
        />

        {/* Dual Rear Engine Thruster Glow Points */}
        <pointLight
          ref={engineLight1Ref}
          position={[0.53, 0.17, -1.05]}
          color="#38bdf8"
          intensity={1.1}
          distance={2.4}
        />
        <pointLight
          ref={engineLight2Ref}
          position={[-0.53, 0.17, -1.05]}
          color="#38bdf8"
          intensity={1.1}
          distance={2.4}
        />
      </group>
    </group>
  );
};

useGLTF.preload('/Spaceship.glb');
