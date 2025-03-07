import * as THREE from 'three';

interface CoinBlockOptions {
  isCompleted: boolean;
  isActive: boolean;
  onComplete?: () => void;
}

export class CoinBlock {
  private mesh: THREE.Group;
  private block: THREE.Mesh;
  private questionMark: THREE.Sprite;
  private isAnimating: boolean = false;
  private originalY: number;
  private isCompleted: boolean;
  private isActive: boolean;
  private onComplete?: () => void;

  constructor(options: CoinBlockOptions) {
    this.mesh = new THREE.Group();
    this.isCompleted = options.isCompleted;
    this.isActive = options.isActive;
    this.onComplete = options.onComplete;

    // Create block texture
    const blockTexture = this.createBlockTexture();
    
    // Create block mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      map: blockTexture,
      color: this.isCompleted ? 0x4CAF50 : this.isActive ? 0xFFC107 : 0xE0E0E0
    });
    
    this.block = new THREE.Mesh(geometry, material);
    this.originalY = this.block.position.y;
    this.mesh.add(this.block);

    // Add question mark if not completed
    if (!this.isCompleted) {
      this.questionMark = this.createQuestionMark();
      this.mesh.add(this.questionMark);
    }

    // Add glow effect if active
    if (this.isActive) {
      const glow = this.createGlowEffect();
      this.mesh.add(glow);
    }
  }

  private createBlockTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Draw block base
    ctx.fillStyle = this.isCompleted ? '#4CAF50' : this.isActive ? '#FFC107' : '#E0E0E0';
    ctx.fillRect(0, 0, 32, 32);

    // Draw block edges
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, 32, 4);  // Top edge
    ctx.fillRect(0, 28, 32, 4); // Bottom edge
    ctx.fillRect(0, 0, 4, 32);  // Left edge
    ctx.fillRect(28, 0, 4, 32); // Right edge

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private createQuestionMark(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;

    // Draw question mark
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 8, 8);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.5, 1);
    sprite.position.z = 0.51;
    
    return sprite;
  }

  private createGlowEffect(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2, 2, 1);
    sprite.position.z = -0.1;
    
    return sprite;
  }

  public animate(time: number) {
    if (this.isAnimating) {
      // Bounce animation
      const bounceHeight = Math.sin(time * 10) * 0.2;
      this.block.position.y = this.originalY + bounceHeight;
      
      // Question mark float animation
      if (this.questionMark) {
        this.questionMark.position.y = 0.6 + Math.sin(time * 5) * 0.1;
      }
    }
  }

  public bounce() {
    if (this.isActive && !this.isAnimating) {
      this.isAnimating = true;
      const bounceSound = new Audio('/sounds/coin.mp3');
      bounceSound.play();
      
      setTimeout(() => {
        this.isAnimating = false;
        this.block.position.y = this.originalY;
        if (this.onComplete) this.onComplete();
      }, 500);
    }
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }
} 