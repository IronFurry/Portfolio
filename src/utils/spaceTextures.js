import * as THREE from 'three';

/**
 * Procedural Space Texture Generators
 * Generates realistic high-resolution textures using HTML5 Canvas
 * without external asset dependencies.
 */

// Simple pseudo-random hash & fractal noise
function hash(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return n - Math.floor(n);
}

function noise2D(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function fbm(x, y, octaves = 5) {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise2D(x * freq, y * freq);
    freq *= 2.1;
    amp *= 0.5;
  }
  return val;
}

/**
 * Realistic Dark Moon / Planet Surface Texture
 */
export function createPlanetTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const ny = y / height;
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const idx = (y * width + x) * 4;

      // Base terrain noise
      const n1 = fbm(nx * 8, ny * 8, 5);
      const n2 = fbm(nx * 24 + 10, ny * 24 + 10, 4) * 0.3;
      const combined = n1 * 0.7 + n2;

      // Dark celestial palette (charcoal, slate, deep rock)
      const baseVal = Math.floor(18 + combined * 35);
      const r = Math.min(255, baseVal);
      const g = Math.min(255, Math.floor(baseVal * 1.05));
      const b = Math.min(255, Math.floor(baseVal * 1.15));

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  // Draw some realistic crater depressions
  ctx.putImageData(imgData, 0, 0);

  // Add subtle crater rings
  for (let i = 0; i < 45; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const cr = 4 + Math.random() * 22;

    const grad = ctx.createRadialGradient(cx, cy, cr * 0.2, cx, cy, cr);
    grad.addColorStop(0, 'rgba(10, 14, 20, 0.45)');
    grad.addColorStop(0.7, 'rgba(25, 32, 42, 0.25)');
    grad.addColorStop(0.85, 'rgba(55, 68, 85, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Volumetric Panoramic Nebula Cloud / Dust Smoke Sprite Texture
 * Seamless, panoramic edge falloff to fit the 16:9 viewport perfectly
 */
export function createNebulaCloudTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const ny = y / height;
    // Vertical soft fade (billowing in lower half, fading out towards top and bottom)
    const vertFade = Math.sin(ny * Math.PI);

    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const idx = (y * width + x) * 4;

      // Horizontal smooth panoramic edge fade
      const horizFade = Math.sin(nx * Math.PI);
      const edgeMask = Math.pow(horizFade * vertFade, 1.4);

      // Low-frequency silky turbulence (NO spots, continuous billows)
      const n1 = fbm(nx * 3.5 + 0.2, ny * 2.8 + 0.3, 4);
      const n2 = fbm(nx * 7.0 + 1.5, ny * 5.0 + 0.8, 3) * 0.28;
      const smoke = smoothstep(0.12, 0.88, n1 + n2);

      const alpha = Math.min(255, Math.floor(edgeMask * smoke * 220));

      // Oceanic deep space teal & smoky slate color
      data[idx] = Math.floor(16 + smoke * 30);      // R
      data[idx + 1] = Math.floor(36 + smoke * 58);  // G
      data[idx + 2] = Math.floor(58 + smoke * 88);  // B
      data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Smooth Sun Flare & Anamorphic Beam Sprite Texture
 */
export function createSunFlareTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Organic radiant core — close to circular with subtle coronal flare asymmetry
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      // Slightly elliptical ratio (1.08 : 1.0) with subtle coronal ray waviness
      const angle = Math.atan2(dy, dx);
      const rayMod = 1.0 + Math.sin(angle * 8) * 0.04 + Math.cos(angle * 4) * 0.03;
      const dist = Math.sqrt(dx * dx * 1.06 + dy * dy * 0.94) / rayMod;

      if (dist >= 1.0) {
        data[idx + 3] = 0;
        continue;
      }

      // Brilliant core with soft exponential falloff
      const core = Math.exp(-dist * 4.5);
      const corona = Math.pow(Math.max(0, 1.0 - dist), 2.2) * 0.55;
      const intensity = Math.min(1.0, core * 1.8 + corona);

      data[idx] = Math.floor(255);                                  // R
      data[idx + 1] = Math.floor(235 + (1.0 - dist) * 20);          // G
      data[idx + 2] = Math.floor(215 + (1.0 - dist) * 40);          // B
      data[idx + 3] = Math.floor(intensity * 255);                  // Alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
