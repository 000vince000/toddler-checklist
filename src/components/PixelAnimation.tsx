import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { SPRITE_CONFIGS } from '../utils/SpriteAnimator';

interface PixelSpriteProps {
  spriteSheet: string;
  taskId: string;
}

function PixelSprite({ spriteSheet, taskId }: PixelSpriteProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const frameRef = useRef(0);
  
  useEffect(() => {
    const config = SPRITE_CONFIGS[taskId];
    if (!config) return;

    const texture = new THREE.TextureLoader().load(spriteSheet);
    texture.magFilter = THREE.NearestFilter;
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        spriteSheet: { value: texture },
        frame: { value: 0 },
        totalFrames: { value: config.frames },
        frameSize: { value: new THREE.Vector2(
          1.0 / config.frames,
          1.0
        )}
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D spriteSheet;
        uniform float frame;
        uniform float totalFrames;
        uniform vec2 frameSize;
        varying vec2 vUv;
        
        void main() {
          vec2 adjustedUv = vec2(
            (vUv.x + frame) * frameSize.x,
            vUv.y
          );
          gl_FragColor = texture2D(spriteSheet, adjustedUv);
        }
      `,
      transparent: true
    });

    materialRef.current = material;
    if (meshRef.current) {
      meshRef.current.material = material;
    }
  }, [spriteSheet, taskId]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const config = SPRITE_CONFIGS[taskId];
    if (!config) return;

    const frame = Math.floor((clock.getElapsedTime() * config.fps) % config.frames);
    materialRef.current.uniforms.frame.value = frame;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

interface PixelAnimationProps {
  spriteSheet: string;
  taskId: string;
}

export default function PixelAnimation({ spriteSheet, taskId }: PixelAnimationProps) {
  return (
    <Canvas
      style={{ width: '300px', height: '300px' }}
      camera={{ position: [0, 0, 5] }}
    >
      <PixelSprite spriteSheet={spriteSheet} taskId={taskId} />
    </Canvas>
  );
} 