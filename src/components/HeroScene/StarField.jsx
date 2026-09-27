import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useParallax } from './ParallaxController';
import * as THREE from 'three';

export const StarField = ({ count = 3400 }) => {
  const pointsRef = useRef();
  const { isReducedMotion } = useParallax();

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const radius = 30 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      pos[i3 + 1] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

      pos[i3 + 2] =
        -25 - Math.random() * 100;

      const rand = Math.random();

      if (rand > 0.88) {
        tempColor.setRGB(0.85, 0.92, 1.0);
      } else if (rand > 0.76) {
        tempColor.setRGB(1.0, 0.92, 0.78);
      } else {
        const brightness =
          0.72 + Math.random() * 0.28;

        tempColor.setRGB(
          brightness,
          brightness,
          brightness
        );
      }

      col[i3] = tempColor.r;
      col[i3 + 1] = tempColor.g;
      col[i3 + 2] = tempColor.b;

      const sizeRand = Math.random();

      if (sizeRand > 0.985) {
        sz[i] = 2.8 + Math.random() * 2;
      } else if (sizeRand > 0.85) {
        sz[i] = 1.4 + Math.random();
      } else {
        sz[i] =
          0.45 + Math.random() * 0.65;
      }
    }

    return [pos, col, sz];
  }, [count]);

  // Lock starfield to camera transform so stars NEVER rotate or move in screen space
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.position.copy(state.camera.position);
      pointsRef.current.rotation.copy(state.camera.rotation);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />

        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
        />

        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
      </bufferGeometry>

      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uPixelRatio: {
            value: Math.min(
              window.devicePixelRatio || 1,
              2
            )
          }
        }}
        vertexShader={`
          attribute float aSize;
          attribute vec3 aColor;

          varying vec3 vColor;

          uniform float uPixelRatio;

          void main() {

            vColor = aColor;

            vec4 mvPosition =
              modelViewMatrix *
              vec4(position, 1.0);

            gl_PointSize =
              aSize *
              uPixelRatio *
              (28.0 / -mvPosition.z);

            gl_Position =
              projectionMatrix *
              mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;

          void main() {

            vec2 coord =
              gl_PointCoord -
              vec2(0.5);

            float dist =
              length(coord);

            if (dist > 0.5)
              discard;

            float alpha =
              smoothstep(
                0.5,
                0.05,
                dist
              );

            float core =
              smoothstep(
                0.2,
                0.0,
                dist
              ) * 0.45;

            gl_FragColor =
              vec4(
                vColor + core,
                alpha * 0.9
              );
          }
        `}
      />
    </points>
  );
};