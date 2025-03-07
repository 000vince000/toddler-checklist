import * as THREE from 'three';

export function createMarioBackground() {
  const background = new THREE.Group();

  // Create mountains
  const mountains = createPixelMountains();
  mountains.position.z = -5;
  background.add(mountains);

  // Create bushes
  const bushes = createPixelBushes();
  bushes.position.z = -3;
  background.add(bushes);

  // Create ground blocks
  const ground = createGroundBlocks();
  ground.position.z = -1;
  background.add(ground);

  return background;
}

function createPixelMountains() {
  const mountains = new THREE.Group();
  
  // Create mountain texture
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  
  // Draw pixel art mountain
  ctx.fillStyle = '#6B8CFF';
  ctx.beginPath();
  ctx.moveTo(0, 32);
  ctx.lineTo(32, 0);
  ctx.lineTo(64, 32);
  ctx.fill();

  // Add snow caps
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(28, 4);
  ctx.lineTo(32, 0);
  ctx.lineTo(36, 4);
  ctx.lineTo(32, 8);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  // Create multiple mountains
  [-20, -10, 0, 10, 20].forEach(x => {
    const mountainMaterial = new THREE.SpriteMaterial({ map: texture });
    const mountain = new THREE.Sprite(mountainMaterial);
    mountain.position.set(x, 2, 0);
    mountain.scale.set(4, 2, 1);
    mountains.add(mountain);
  });

  return mountains;
}

function createPixelBushes() {
  const bushes = new THREE.Group();
  
  // Create bush texture
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  
  // Draw pixel art bush
  ctx.fillStyle = '#2D5A27';
  ctx.beginPath();
  ctx.arc(16, 8, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8, 8, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(24, 8, 6, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  // Create multiple bushes
  [-15, -5, 5, 15].forEach(x => {
    const bushMaterial = new THREE.SpriteMaterial({ map: texture });
    const bush = new THREE.Sprite(bushMaterial);
    bush.position.set(x, -3, 0);
    bush.scale.set(2, 1, 1);
    bushes.add(bush);
  });

  return bushes;
}

function createGroundBlocks() {
  const ground = new THREE.Group();
  
  // Create ground block texture
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  
  // Draw pixel art ground block
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, 0, 16, 16);
  
  // Add texture details
  ctx.fillStyle = '#654321';
  ctx.fillRect(0, 0, 16, 2);  // Top edge
  ctx.fillRect(0, 14, 16, 2); // Bottom edge
  ctx.fillRect(0, 0, 2, 16);  // Left edge
  ctx.fillRect(14, 0, 2, 16); // Right edge

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  // Create ground plane with repeating texture
  const groundGeometry = new THREE.PlaneGeometry(40, 2);
  const groundMaterial = new THREE.MeshBasicMaterial({ 
    map: texture,
    transparent: false
  });
  groundMaterial.map!.repeat.set(20, 1);
  
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.position.y = -5;
  ground.add(groundMesh);

  return ground;
} 