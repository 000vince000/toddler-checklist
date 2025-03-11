import * as THREE from 'three';

export class Bullseye {
  private mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Create concentric circles
    const circles = [
      { radius: 0.8, color: '#FF0000' }, // Outer red circle
      { radius: 0.6, color: '#FFFFFF' }, // White circle
      { radius: 0.4, color: '#FF0000' }, // Inner red circle
      { radius: 0.2, color: '#FFFFFF' }, // Center white circle
    ];

    circles.forEach(({ radius, color }) => {
      const circle = this.createCircle(radius, color);
      this.mesh.add(circle);
    });
  }

  private createCircle(radius: number, color: string): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Draw circle
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const geometry = new THREE.PlaneGeometry(radius, radius);
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
    // Optional: Add subtle pulsing animation
    const scale = 1 + Math.sin(time * 2) * 0.05;
    this.mesh.scale.set(scale, scale, 1);
  }
} 