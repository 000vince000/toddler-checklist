import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystem {
  positions: Float32Array;
  velocities: Float32Array;
  colors: Float32Array;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  points: THREE.Points;
}

function createParticleSystem(): ParticleSystem {
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    // Random starting position
    positions[i * 3] = (Math.random() - 0.5) * 2;
    positions[i * 3 + 1] = -2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

    // Random velocity
    velocities[i * 3] = (Math.random() - 0.5) * 0.1;
    velocities[i * 3 + 1] = Math.random() * 0.2;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

    // Random colors
    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);

  return {
    positions,
    velocities,
    colors,
    geometry,
    material,
    points,
  };
}

export default function CelebrationScene() {
  const particleSystemRef = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    particleSystemRef.current = createParticleSystem();
  }, []);

  useFrame(() => {
    if (!particleSystemRef.current) return;

    const { positions, velocities, geometry } = particleSystemRef.current;
    const positionArray = geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      // Update positions
      positionArray[i] += velocities[i];
      positionArray[i + 1] += velocities[i + 1];
      positionArray[i + 2] += velocities[i + 2];

      // Reset particles that fall below
      if (positionArray[i + 1] > 3) {
        positionArray[i + 1] = -2;
        velocities[i + 1] = Math.random() * 0.2;
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {particleSystemRef.current && <primitive object={particleSystemRef.current.points} />}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
} 