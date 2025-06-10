import * as THREE from 'three';

export function createMarioBackground() {
  const background = new THREE.Group();

  // Create mountains
  const mountains = createPixelMountains();
  mountains.position.z = -2;
  background.add(mountains);

  // Removed bushes for a cleaner background
  // (If needed later, we can add decorative elements elsewhere.)

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
  ctx.fillStyle = '#3F57B4';
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