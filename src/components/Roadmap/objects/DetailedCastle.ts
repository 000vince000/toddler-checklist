import * as THREE from 'three';

export function createDetailedCastle() {
  const castle = new THREE.Group();

  // Add castle base with stone texture
  const textureLoader = new THREE.TextureLoader();
  const stoneTexture = textureLoader.load('/textures/stone.png');
  stoneTexture.wrapS = THREE.RepeatWrapping;
  stoneTexture.wrapT = THREE.RepeatWrapping;
  stoneTexture.repeat.set(2, 2);

  // Main structure with better materials
  const baseMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x8B728E,
    map: stoneTexture,
    bumpMap: stoneTexture,
    bumpScale: 0.1
  });

  // Add more detailed towers
  const mainTower = createDetailedTower(3, 6, 3, baseMaterial);
  mainTower.position.y = 1;
  castle.add(mainTower);

  // Side towers with different heights
  [-2.5, 2.5].forEach(x => {
    const sideTower = createDetailedTower(2, 4, 2, baseMaterial);
    sideTower.position.set(x, 1, 0);
    castle.add(sideTower);
  });

  // Add walls connecting towers
  const wallGeometry = new THREE.BoxGeometry(2, 3, 0.5);
  [-1.25, 1.25].forEach(x => {
    const wall = new THREE.Mesh(wallGeometry, baseMaterial);
    wall.position.set(x, 1.5, 0);
    castle.add(wall);
  });

  // Add decorative elements
  addBanners(castle);
  addTorches(castle);
  addDetailedWindows(castle);

  return castle;
}

function createDetailedTower(width: number, height: number, depth: number, material: THREE.Material) {
  const tower = new THREE.Group();

  // Tower body
  const bodyGeometry = new THREE.BoxGeometry(width, height, depth);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.position.y = height / 2;
  tower.add(body);

  // Detailed roof
  const roofGeometry = new THREE.ConeGeometry(width / 1.5, height / 3, 4);
  const roofMaterial = new THREE.MeshPhongMaterial({ color: 0xB19CD9 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = height + height / 6;
  tower.add(roof);

  // Add crenellations
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const crenellation = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.5, 0.3),
      material
    );
    crenellation.position.set(
      Math.cos(angle) * (width / 2),
      height,
      Math.sin(angle) * (depth / 2)
    );
    tower.add(crenellation);
  }

  return tower;
}

function addFlag(tower: THREE.Group, height: number) {
  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1),
    new THREE.MeshPhongMaterial({ color: 0xCCCCCC })
  );
  flagPole.position.y = height + 1;
  tower.add(flagPole);

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.3),
    new THREE.MeshPhongMaterial({ 
      color: 0xFF4757,
      side: THREE.DoubleSide
    })
  );
  flag.position.set(0.3, height + 1.2, 0);
  tower.add(flag);

  // Animate flag
  const animate = () => {
    flag.rotation.y = Math.sin(Date.now() * 0.003) * 0.2;
    requestAnimationFrame(animate);
  };
  animate();
}

function addWindows(structure: THREE.Mesh) {
  const windowGeometry = new THREE.PlaneGeometry(0.3, 0.5);
  const windowMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFD700,
    emissive: 0xFFD700,
    emissiveIntensity: 0.5
  });

  // Add windows in a pattern
  [-0.5, 0.5].forEach(x => {
    [-0.5, 0.5].forEach(y => {
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(x, y, structure.scale.z / 2 + 0.01);
      structure.add(window);
    });
  });
} 