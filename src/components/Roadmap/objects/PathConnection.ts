import * as THREE from 'three';

export class PathConnection {
  private mesh: THREE.Group;

  constructor(start: THREE.Vector3, end: THREE.Vector3, isCompleted: boolean) {
    this.mesh = new THREE.Group();
    
    // Create ground block texture
    const texture = this.createGroundTexture(isCompleted);
    
    // Calculate path segments
    const distance = start.distanceTo(end);
    const blockSize = 0.5; // Size of each ground block
    const numBlocks = Math.ceil(distance / blockSize);
    
    // Create path blocks
    for (let i = 0; i < numBlocks; i++) {
      const t = i / (numBlocks - 1);
      const position = new THREE.Vector3().lerpVectors(start, end, t);
      
      const block = this.createGroundBlock(texture);
      block.position.copy(position);
      
      // Rotate block to face direction of path
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      block.rotation.z = angle;
      
      this.mesh.add(block);
    }
  }

  private createGroundTexture(isCompleted: boolean): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    
    // Base color
    ctx.fillStyle = isCompleted ? '#4CAF50' : '#8B4513';
    ctx.fillRect(0, 0, 16, 16);
    
    // Add pixel art details
    ctx.fillStyle = isCompleted ? '#45a049' : '#654321';
    
    // Top edge pattern
    for (let x = 0; x < 16; x += 4) {
      ctx.fillRect(x, 0, 2, 2);
    }
    
    // Bottom edge pattern
    for (let x = 2; x < 16; x += 4) {
      ctx.fillRect(x, 14, 2, 2);
    }
    
    // Optional: Add sparkle effect for completed paths
    if (isCompleted) {
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(4, 4, 2, 2);
      ctx.fillRect(10, 8, 2, 2);
      ctx.globalAlpha = 1;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private createGroundBlock(texture: THREE.Texture): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(0.5, 0.25);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public animate(time: number) {
    // Optional: Add subtle animation for completed paths
    this.mesh.children.forEach((block, index) => {
      block.position.y += Math.sin(time * 2 + index * 0.2) * 0.001;
    });
  }
} 