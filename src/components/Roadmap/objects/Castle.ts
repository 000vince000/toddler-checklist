import * as THREE from 'three';

export class Castle {
  private mesh: THREE.Group;
  private flags: THREE.Mesh[] = [];
  private windows: THREE.Mesh[] = [];

  constructor() {
    this.mesh = new THREE.Group();
    
    // Main castle body
    const body = this.createCastleBody();
    this.mesh.add(body);

    // Towers
    const leftTower = this.createTower();
    leftTower.position.set(-1.5, 0.5, 0);
    this.mesh.add(leftTower);

    const rightTower = this.createTower();
    rightTower.position.set(1.5, 0.5, 0);
    this.mesh.add(rightTower);

    // Main tower
    const mainTower = this.createTower(1.5);
    mainTower.position.set(0, 1, 0);
    this.mesh.add(mainTower);

    // Add windows to main body
    this.addWindows(body);

    // Add battlements
    this.addBattlements();

    // Add moat
    this.addMoat();

    // Door
    const door = this.createDoor();
    door.position.set(0, -0.5, 0.01);
    this.mesh.add(door);
  }

  private createCastleBody(): THREE.Mesh {
    const texture = this.createCastleTexture();
    const geometry = new THREE.PlaneGeometry(4, 2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  private createCastleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Base castle color
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, 64, 32);

    // Stone pattern
    ctx.fillStyle = '#CCCCCC';
    for (let y = 0; y < 32; y += 8) {
      for (let x = y % 16 === 0 ? 0 : 8; x < 64; x += 16) {
        ctx.fillRect(x, y, 8, 4);
      }
    }

    // Battlements at the top
    ctx.fillStyle = '#FFFFFF';
    for (let x = 0; x < 64; x += 8) {
      ctx.fillRect(x, 0, 4, 4);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private createTower(scale: number = 1): THREE.Group {
    const tower = new THREE.Group();

    // Tower body
    const bodyGeometry = new THREE.PlaneGeometry(1 * scale, 2 * scale);
    const bodyMaterial = new THREE.MeshBasicMaterial({
      map: this.createTowerTexture(),
      transparent: true
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    tower.add(body);

    // Tower top (cone)
    const topGeometry = new THREE.PlaneGeometry(1.2 * scale, 1 * scale);
    const topMaterial = new THREE.MeshBasicMaterial({
      map: this.createTowerTopTexture(),
      transparent: true
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 1.2 * scale;
    tower.add(top);

    // Flag
    const flag = this.createFlag();
    flag.position.set(0.3 * scale, 1.8 * scale, 0.1);
    flag.scale.set(scale, scale, 1);
    tower.add(flag);
    this.flags.push(flag);

    return tower;
  }

  private createTowerTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Base tower color
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, 16, 32);

    // Stone pattern
    ctx.fillStyle = '#CCCCCC';
    for (let y = 0; y < 32; y += 4) {
      for (let x = y % 8 === 0 ? 0 : 4; x < 16; x += 8) {
        ctx.fillRect(x, y, 4, 2);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private createTowerTopTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;

    // Draw cone shape
    ctx.fillStyle = '#FF4757';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(16, 16);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private createFlag(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;

    // Flag color
    ctx.fillStyle = '#FF4757';
    ctx.fillRect(0, 0, 16, 8);

    // Flag pattern
    ctx.fillStyle = '#FF6B81';
    ctx.fillRect(2, 2, 12, 4);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const geometry = new THREE.PlaneGeometry(0.8, 0.4);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  private createDoor(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;

    // Door shape
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 16, 24);

    // Door details
    ctx.fillStyle = '#654321';
    ctx.fillRect(2, 2, 12, 20);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(12, 10, 2, 2); // Door handle

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const geometry = new THREE.PlaneGeometry(1, 1.5);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  private addWindows(body: THREE.Mesh) {
    const windowPositions = [
      [-1.2, 0.3],
      [-0.4, 0.3],
      [0.4, 0.3],
      [1.2, 0.3]
    ] as [number, number][];

    windowPositions.forEach(([x, y]) => {
      const window = this.createWindow();
      window.position.set(x, y, 0.01);
      body.add(window);
      this.windows.push(window);
    });
  }

  private createWindow(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;

    // Window frame
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 16, 16);
    
    // Window glass
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(2, 2, 12, 12);
    
    // Window cross
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(7, 2, 2, 12);
    ctx.fillRect(2, 7, 12, 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const geometry = new THREE.PlaneGeometry(0.4, 0.4);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  private addBattlements() {
    const battlementPositions = [
      [-1.8, 1.2], [-1.4, 1.2], [-1.0, 1.2], [-0.6, 1.2], [-0.2, 1.2],
      [0.2, 1.2], [0.6, 1.2], [1.0, 1.2], [1.4, 1.2], [1.8, 1.2]
    ] as [number, number][];

    battlementPositions.forEach(([x, y]) => {
      const battlement = this.createBattlement();
      battlement.position.set(x, y, 0.01);
      this.mesh.add(battlement);
    });
  }

  private createBattlement(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;

    // Battlement shape
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, 8, 8);
    
    // Stone pattern
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, 8, 2);
    ctx.fillRect(0, 6, 8, 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const geometry = new THREE.PlaneGeometry(0.3, 0.3);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  private addMoat() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Water color
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(0, 0, 128, 32);
    
    // Water ripples
    ctx.fillStyle = '#87CEEB';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(16 * i, 16, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const geometry = new THREE.PlaneGeometry(6, 1);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8
    });
    material.map!.repeat.set(2, 1);

    const moat = new THREE.Mesh(geometry, material);
    moat.position.set(0, -1.2, -0.1);
    this.mesh.add(moat);
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public animate(time: number) {
    // Animate flags waving
    this.flags.forEach((flag, index) => {
      flag.position.x = 0.3 + Math.sin(time * 3 + index) * 0.05;
    });

    // Animate windows (subtle glow)
    this.windows.forEach((window, index) => {
      const material = window.material as THREE.MeshBasicMaterial;
      const opacity = 0.7 + Math.sin(time * 2 + index) * 0.3;
      material.opacity = opacity;
    });

    // Add subtle castle movement
    this.mesh.position.y = Math.sin(time) * 0.02;
  }
} 