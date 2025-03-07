import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Cloud({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.4, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

export default function Environment() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.5;
    }
  });

  return (
    <>
      <group ref={cloudsRef}>
        <Cloud position={[-5, 3, -5]} />
        <Cloud position={[0, 4, -4]} />
        <Cloud position={[5, 3, -6]} />
      </group>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
      
      {/* Sun */}
      <mesh position={[-10, 10, -10]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
    </>
  );
} 