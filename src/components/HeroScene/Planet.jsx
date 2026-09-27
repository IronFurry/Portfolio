import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useParallax } from './ParallaxController';
import { createPlanetTexture } from '../../utils/spaceTextures';

/**
 * Planet Component (Layer 2)
 * High-fidelity dark planet in the upper-left matching the reference image.
 * Features:
 * - Cratered, geological dark terrain texture
 * - Razor-sharp atmospheric crescent rim facing the distant sun
 * - Only the crescent enters the upper-left viewport frame
 * - Parallax movement (0.07)
 */
export const Planet = ({
  position = [-9.8, 5.8, -16.5],
  radius = 5.1,
  parallaxStrength = 0.065
}) => {
  const groupRef = useRef();
  const planetMeshRef = useRef();
  const { mouse, isReducedMotion } = useParallax();
  const currentOffset = useRef({ x: 0, y: 0 });

  // Generate realistic dark lunar/cratered surface texture
  const surfaceTexture = useMemo(() => createPlanetTexture(), []);

  // Custom planet shader combining realistic surface texture + sunlit atmospheric rim
  const planetShader = useMemo(() => ({
    uniforms: {
      uTexture: { value: surfaceTexture },
      uSunDirection: { value: new THREE.Vector3(1.4, 0.7, 0.8).normalize() },
      uRimColor: { value: new THREE.Color('#93c5fd') },      // Ice blue rim
      uHazeColor: { value: new THREE.Color('#38bdf8') },     // Cyan atmospheric haze
      uAmbientColor: { value: new THREE.Color('#030508') }    // Deep space black side
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec3 uSunDirection;
      uniform vec3 uRimColor;
      uniform vec3 uHazeColor;
      uniform vec3 uAmbientColor;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(-vPosition);

        // Sample cratered dark rock texture
        vec4 texColor = texture2D(uTexture, vUv);

        // Sunlight illumination factor
        float NdotL = dot(normal, uSunDirection);
        float sunIntensity = smoothstep(-0.05, 0.45, NdotL);

        // Atmospheric Fresnel rim lighting
        float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
        float rimSharp = pow(fresnel, 4.2);
        float rimSoft = pow(fresnel, 2.5) * 0.4;

        // Rim ONLY appears on the sunlit limb!
        float sunFacingRim = smoothstep(-0.1, 0.5, NdotL);

        vec3 rim = (uRimColor * rimSharp + uHazeColor * rimSoft) * sunFacingRim * 2.2;

        // Composite: textured terrain + rim lighting + dark ambient shadow
        vec3 finalColor = mix(uAmbientColor, texColor.rgb, sunIntensity * 0.85) + rim;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), [surfaceTexture]);

  // Subtle outer crescent haze
  const outerHazeShader = useMemo(() => ({
    uniforms: {
      uSunDirection: { value: new THREE.Vector3(1.4, 0.7, 0.8).normalize() },
      uColor: { value: new THREE.Color('#60a5fa') }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDirection;
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(-vPosition);

        float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
        float intensity = pow(fresnel, 5.0) * 0.6;

        float sunFacing = smoothstep(-0.05, 0.6, dot(normal, uSunDirection));
        gl_FragColor = vec4(uColor, intensity * sunFacing);
      }
    `
  }), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow planetary axial rotation
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += delta * 0.008;
    }

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
      {/* Main Textured Planet Sphere */}
      <mesh ref={planetMeshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial args={[planetShader]} />
      </mesh>

      {/* Thin Atmospheric Crescent Haze */}
      <mesh scale={1.015}>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          args={[outerHazeShader]}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};
