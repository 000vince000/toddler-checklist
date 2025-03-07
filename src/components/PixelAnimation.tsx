import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box } from '@mui/material';

interface PixelAnimationProps {
  spriteSheet: string;
  width?: number;
  height?: number;
}

export default function PixelAnimation({ spriteSheet, width = 300, height = 300 }: PixelAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createCurlyHairSegment = (x: number, y: number, rotation: number) => {
    const curve = new THREE.EllipseCurve(
      x, y,
      0.05, 0.05,
      0, Math.PI * 2,
      false,
      rotation
    );
    const points = curve.getPoints(16);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x8B4513 });
    return new THREE.Line(geometry, material);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up orthographic camera for 2D view - adjusted for larger view
    const aspectRatio = width / height;
    const camera = new THREE.OrthographicCamera(
      -aspectRatio/2, aspectRatio/2,
      1/2, -1/2,
      0.1, 1000
    );
    camera.position.z = 1;
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create 8-bit style character
    const character = new THREE.Group();

    // Fuller, more natural hair
    const hairGroup = new THREE.Group();
    
    // Main hair mass
    const mainHairGeometry = new THREE.PlaneGeometry(0.3, 0.2);
    const hairMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const mainHair = new THREE.Mesh(mainHairGeometry, hairMaterial);
    mainHair.position.y = 0.4;
    hairGroup.add(mainHair);

    // Side hair pieces
    const sideHairGeometry = new THREE.PlaneGeometry(0.1, 0.25);
    const leftSideHair = new THREE.Mesh(sideHairGeometry, hairMaterial);
    leftSideHair.position.set(-0.12, 0.35, -0.01);
    hairGroup.add(leftSideHair);

    const rightSideHair = new THREE.Mesh(sideHairGeometry, hairMaterial);
    rightSideHair.position.set(0.12, 0.35, -0.01);
    hairGroup.add(rightSideHair);

    // Bangs
    const bangsGeometry = new THREE.PlaneGeometry(0.25, 0.08);
    const bangs = new THREE.Mesh(bangsGeometry, hairMaterial);
    bangs.position.set(0, 0.43, 0.01);
    hairGroup.add(bangs);

    character.add(hairGroup);

    // Head (round-ish using multiple squares)
    const headGeometry = new THREE.PlaneGeometry(0.22, 0.22);
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0xffccaa });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.3;
    character.add(head);

    // Ears
    const earGeometry = new THREE.PlaneGeometry(0.06, 0.08);
    const earMaterial = new THREE.MeshBasicMaterial({ color: 0xffccaa });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.15, 0.32, 0.02);
    character.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.15, 0.32, 0.02);
    character.add(rightEar);

    // Nose
    const noseGeometry = new THREE.PlaneGeometry(0.03, 0.03);
    const noseMaterial = new THREE.MeshBasicMaterial({ color: 0xffb399 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 0.28, 0.01);
    character.add(nose);

    // Eyebrows
    const eyebrowGeometry = new THREE.PlaneGeometry(0.04, 0.01);
    const eyebrowMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    
    const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
    leftEyebrow.position.set(-0.05, 0.35, 0.01);
    leftEyebrow.rotation.z = -0.1;
    character.add(leftEyebrow);
    
    const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
    rightEyebrow.position.set(0.05, 0.35, 0.01);
    rightEyebrow.rotation.z = 0.1;
    character.add(rightEyebrow);

    // Eyes
    const eyeGeometry = new THREE.PlaneGeometry(0.03, 0.03);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.05, 0.32, 0.01);
    character.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.05, 0.32, 0.01);
    character.add(rightEye);

    // Mouth (happy)
    const mouthGeometry = new THREE.PlaneGeometry(0.06, 0.01);
    const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xff9999 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 0.24, 0.01);
    character.add(mouth);

    // Enhanced diaper with pattern
    const diaperGroup = new THREE.Group();
    
    // Main diaper
    const diaperGeometry = new THREE.PlaneGeometry(0.25, 0.15);
    const diaperMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const diaper = new THREE.Mesh(diaperGeometry, diaperMaterial);
    diaperGroup.add(diaper);

    // Diaper pattern (stripes)
    for (let i = 0; i < 3; i++) {
      const stripeGeometry = new THREE.PlaneGeometry(0.23, 0.02);
      const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xb3d9ff });
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.position.y = -0.04 + i * 0.04;
      stripe.position.z = 0.01;
      diaperGroup.add(stripe);
    }

    // Diaper tabs
    const tabGeometry = new THREE.PlaneGeometry(0.04, 0.04);
    const tabMaterial = new THREE.MeshBasicMaterial({ color: 0xb3d9ff });
    
    const leftTab = new THREE.Mesh(tabGeometry, tabMaterial);
    leftTab.position.set(-0.13, 0, 0.01);
    diaperGroup.add(leftTab);
    
    const rightTab = new THREE.Mesh(tabGeometry, tabMaterial);
    rightTab.position.set(0.13, 0, 0.01);
    diaperGroup.add(rightTab);

    diaperGroup.position.y = -0.1;
    character.add(diaperGroup);

    // Arms with rounded edges
    const armGeometry = new THREE.PlaneGeometry(0.08, 0.2);
    const armMaterial = new THREE.MeshBasicMaterial({ color: 0xffccaa });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.x = -0.2;
    leftArm.position.y = 0.1;
    character.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.x = 0.2;
    rightArm.position.y = 0.1;
    character.add(rightArm);

    // Legs with rounded edges
    const legGeometry = new THREE.PlaneGeometry(0.1, 0.2);
    const legMaterial = new THREE.MeshBasicMaterial({ color: 0xffccaa });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.1, -0.25, 0);
    character.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.1, -0.25, 0);
    character.add(rightLeg);

    // T-shirt adjustments
    const shirtGeometry = new THREE.PlaneGeometry(0.3, 0.25);
    const shirtMaterial = new THREE.MeshBasicMaterial({ color: 0xff4757 });
    const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
    shirt.position.set(0, 0.075, 0); // Adjusted down slightly

    // Add a simple pattern to the shirt
    const patternGeometry = new THREE.PlaneGeometry(0.1, 0.1);
    const patternMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b81 });
    const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
    pattern.position.set(0, 0.05, 0.01);
    pattern.rotation.z = Math.PI / 4; // 45-degree rotation for a diamond shape
    shirt.add(pattern);

    character.add(shirt);

    // Tummy adjustments
    const tummyGeometry = new THREE.PlaneGeometry(0.25, 0.15);
    const tummyMaterial = new THREE.MeshBasicMaterial({ color: 0xffccaa });
    const tummy = new THREE.Mesh(tummyGeometry, tummyMaterial);
    tummy.position.set(0, 0, -0.01); // Moved up to meet shirt exactly

    // Update the tummy mark to be smaller and add drop shadow
    const tummyMarkGeometry = new THREE.PlaneGeometry(0.04, 0.04); // Smaller size
    const tummyMarkMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xf0b8a5,  // Slightly darker than skin tone
      transparent: true,
      opacity: 0.7
    });
    const tummyMark = new THREE.Mesh(tummyMarkGeometry, tummyMarkMaterial);
    tummyMark.position.set(0, -0.06, 0.01); // Adjusted position

    // Add drop shadow for tummy mark
    const shadowGeometry = new THREE.PlaneGeometry(0.04, 0.04);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.1
    });
    const tummyMarkShadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    tummyMarkShadow.position.set(0.002, -0.062, 0); // Slightly offset from the mark
    tummy.add(tummyMarkShadow);
    tummy.add(tummyMark);

    character.add(tummy);

    scene.add(character);
    characterRef.current = character;

    // Animation
    let diaperChangePhase = 0;
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !characterRef.current) return;

      const taskType = spriteSheet.split('/').pop()?.split('.')[0];
      const time = Date.now() * 0.001;
      
      switch(taskType) {
        case 'diaper':
          // Multi-phase diaper change animation
          diaperChangePhase = (Math.floor(time * 2) % 6);
          
          // Reset positions
          leftArm.rotation.z = 0;
          rightArm.rotation.z = 0;
          characterRef.current.position.y = 0;
          characterRef.current.scale.y = 1;
          diaperGroup.position.y = -0.1;
          tummy.visible = false;
          tummyMark.visible = false;
          tummyMarkShadow.visible = false;
          
          switch(diaperChangePhase) {
            case 0: // Standing
              tummy.visible = false;
              tummyMark.visible = false;
              tummyMarkShadow.visible = false;
              break;
            case 1: // Squatting
              characterRef.current.position.y = -0.2;
              characterRef.current.scale.y = 0.8;
              tummy.visible = false;
              tummyMark.visible = false;
              tummyMarkShadow.visible = false;
              break;
            case 2: // Arms reaching down, diaper lowered
              leftArm.rotation.z = Math.PI / 3;
              rightArm.rotation.z = -Math.PI / 3;
              characterRef.current.position.y = -0.2;
              characterRef.current.scale.y = 0.8;
              diaperGroup.position.y = -0.3;
              tummy.visible = true;
              tummyMark.visible = true;
              tummyMarkShadow.visible = true;
              tummy.position.y = -0.1; // Adjusted to maintain connection with shirt
              break;
            case 3: // Pulling diaper up
              leftArm.rotation.z = Math.PI / 4;
              rightArm.rotation.z = -Math.PI / 4;
              characterRef.current.position.y = -0.15;
              characterRef.current.scale.y = 0.85;
              diaperGroup.position.y = -0.2;
              tummy.visible = true;
              tummyMark.visible = true;
              tummyMarkShadow.visible = true;
              tummyMark.material.opacity = 0.3;
              tummyMarkShadow.material.opacity = 0.05;
              tummy.position.y = -0.05; // Adjusted to maintain connection with shirt
              break;
            case 4: // Final adjustment
              leftArm.rotation.z = Math.PI / 6;
              rightArm.rotation.z = -Math.PI / 6;
              characterRef.current.position.y = -0.1;
              diaperGroup.position.y = -0.1;
              tummy.visible = false;
              tummyMark.visible = false;
              tummyMarkShadow.visible = false;
              break;
            case 5: // Happy bounce
              characterRef.current.position.y = -0.05 + Math.sin(time * 8) * 0.05;
              tummy.visible = false;
              tummyMark.visible = false;
              tummyMarkShadow.visible = false;
              break;
          }
          
          // Make mouth smile more during the action
          mouth.scale.x = 1 + Math.sin(time * 2) * 0.2;
          mouth.scale.y = 1 + Math.abs(Math.sin(time * 2)) * 0.2;
          
          // Animate eyebrows
          leftEyebrow.rotation.z = -0.1 - Math.sin(time * 2) * 0.1;
          rightEyebrow.rotation.z = 0.1 + Math.sin(time * 2) * 0.1;
          break;

        case 'dress':
          // Arms up animation with happy expression
          leftArm.rotation.z = Math.sin(time * 2) * 0.5;
          rightArm.rotation.z = -Math.sin(time * 2) * 0.5;
          mouth.scale.x = 1 + Math.sin(time * 2) * 0.1;
          break;

        default:
          // Default bobbing animation with slight arm swing
          characterRef.current.position.y = Math.sin(time * 2) * 0.05;
          leftArm.rotation.z = Math.sin(time * 2) * 0.1;
          rightArm.rotation.z = -Math.sin(time * 2) * 0.1;
          mouth.scale.x = 1 + Math.sin(time * 2) * 0.1;
      }

      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        containerRef.current?.removeChild(rendererRef.current.domElement);
      }
    };
  }, [spriteSheet, width, height]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        '& canvas': {
          maxWidth: '100%',
          maxHeight: '100%'
        }
      }}
    >
      {error && (
        <Box
          sx={{
            position: 'absolute',
            color: 'error.main',
            textAlign: 'center',
            p: 2
          }}
        >
          Using placeholder animation (sprite sheet not found: {spriteSheet})
        </Box>
      )}
    </Box>
  );
} 