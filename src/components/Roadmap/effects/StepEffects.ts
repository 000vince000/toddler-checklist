import * as THREE from 'three';

export function createCompletionEffect(position: THREE.Vector3) {
  const particles = new THREE.Group();
  const particleCount = 20;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = position.x;
    positions[i * 3 + 1] = position.y;
    positions[i * 3 + 2] = position.z;

    colors[i * 3] = 1;     // R
    colors[i * 3 + 1] = 1; // G
    colors[i * 3 + 2] = 0; // B

    sizes[i] = 0.1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    map: createParticleTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  particles.add(points);

  // Animation
  const animate = () => {
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += 0.01; // Move up
      positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.01; // Sway
    }
    geometry.attributes.position.needsUpdate = true;
    
    requestAnimationFrame(animate);
  };
  animate();

  return particles;
}

function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 16);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
} 