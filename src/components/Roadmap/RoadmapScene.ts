import * as THREE from 'three';
import { CoinBlock } from './objects/CoinBlock';
import { createRoadmapCharacter } from './objects/RoadmapCharacter';
import { createMarioBackground } from './objects/BackgroundElements';
import { PathConnection } from './objects/PathConnection';
import { Castle } from './objects/Castle';

interface Task {
  id: string;
  status: 'checked' | 'unchecked';
}

export class RoadmapScene {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private clouds: THREE.Group;
  private background: THREE.Group;
  private gameObjects: THREE.Group;
  private clock: THREE.Clock;
  private character: THREE.Group;
  private tasks: Map<string, CoinBlock> = new Map();
  private taskPositions: Map<string, THREE.Vector3> = new Map();
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private paths: PathConnection[] = [];
  private castle: Castle | null = null;

  constructor(container: HTMLElement) {
    this.clock = new THREE.Clock();
    
    // Setup scene
    this.scene = new THREE.Scene();
    
    // Setup orthographic camera for 2D view
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.OrthographicCamera(
      -12 * aspect, 12 * aspect,
      12, -12,
      0.1, 1000
    );
    this.camera.position.set(0, 0, 10);

    // Setup renderer with pixel art crisp edges
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(1); // For pixel art clarity
    container.appendChild(this.renderer.domElement);

    // Create layer groups with proper z-depth
    this.clouds = new THREE.Group();
    this.clouds.position.z = 5;
    
    this.background = new THREE.Group();
    this.background.position.z = 0;
    
    this.gameObjects = new THREE.Group();
    this.gameObjects.position.z = 2;

    this.scene.add(this.clouds);
    this.scene.add(this.background);
    this.scene.add(this.gameObjects);

    // Initialize scene
    this.createSkyGradient();
    this.createClouds();
    this.createParallaxBackground();

    // Add background
    const backgroundElement = createMarioBackground();
    this.scene.add(backgroundElement);

    // Add character
    this.character = createRoadmapCharacter();
    this.scene.add(this.character);

    // Setup raycaster for click detection
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Start animation loop
    this.animate();
  }

  private createSkyGradient() {
    // Create sky gradient using a custom shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      void main() {
        vec3 topColor = vec3(0.4, 0.6, 1.0);    // Light blue
        vec3 bottomColor = vec3(0.8, 0.9, 1.0);  // Very light blue
        vec3 color = mix(bottomColor, topColor, vUv.y);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const skyMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.FrontSide
    });

    const skyGeometry = new THREE.PlaneGeometry(100, 100);
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.position.z = -10;
    this.background.add(sky);
  }

  private createClouds() {
    // Create pixel art cloud texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    
    // Draw pixel art cloud
    ctx.fillStyle = 'white';
    ctx.fillRect(8, 8, 16, 8);
    ctx.fillRect(4, 4, 24, 4);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    // Create multiple clouds at different positions
    for (let i = 0; i < 10; i++) {
      const cloudMaterial = new THREE.SpriteMaterial({ map: texture });
      const cloud = new THREE.Sprite(cloudMaterial);
      
      cloud.position.set(
        Math.random() * 40 - 20,
        Math.random() * 10,
        0
      );
      cloud.scale.set(2, 1, 1);
      
      // Store initial x position for animation
      cloud.userData.initialX = cloud.position.x;
      cloud.userData.speed = Math.random() * 0.5 + 0.5;
      
      this.clouds.add(cloud);
    }
  }

  private createParallaxBackground() {
    // Create three layers of background elements
    const layers = [
      { z: -5, color: 0x87CEEB, scale: 0.8 }, // Far mountains
      { z: -3, color: 0x4CAF50, scale: 0.9 }, // Hills
      { z: -1, color: 0x8BC34A, scale: 1.0 }  // Ground
    ];

    layers.forEach(layer => {
      const geometry = new THREE.PlaneGeometry(100, 20);
      const material = new THREE.MeshBasicMaterial({ color: layer.color });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.z = layer.z;
      mesh.position.y = -5;
      mesh.scale.set(layer.scale, layer.scale, 1);
      
      this.background.add(mesh);
    });
  }

  public addTask(task: Task, index: number, isActive: boolean) {
    // Calculate task position using total number of tasks instead of current map size
    const totalTasks = 6; // Since we know we have 6 tasks
    const spacing = 3; // Increase spacing between blocks
    
    // Calculate x position to spread tasks evenly
    const x = -8 + (index * spacing);
    // Create a gentle arc for the y positions
    const y = -1 + Math.sin((index / (totalTasks - 1)) * Math.PI) * 2;
    
    const position = new THREE.Vector3(x, y, 0);

    console.log(`Adding task ${task.id} at position:`, position);

    // Create coin block
    const block = new CoinBlock({
      isCompleted: task.status === 'checked',
      isActive,
      onComplete: () => {
        console.log('Task completed:', task.id);
      }
    });

    // Position the block
    const blockMesh = block.getMesh();
    blockMesh.position.copy(position);
    blockMesh.scale.set(1.5, 1.5, 1); // Make blocks bigger
    this.scene.add(blockMesh);

    // Store references
    this.tasks.set(task.id, block);
    this.taskPositions.set(task.id, position);

    // If this is the active task, position character here
    if (isActive) {
      this.character.position.copy(position);
      this.character.position.y += 1.5; // Adjust for bigger blocks
    }

    // Add path connection to previous task
    if (index > 0) {
      const prevTaskId = Array.from(this.taskPositions.keys())[index - 1];
      const prevPosition = this.taskPositions.get(prevTaskId)!;
      const isCompleted = task.status === 'checked';
      
      const path = new PathConnection(prevPosition, position, isCompleted);
      const pathMesh = path.getMesh();
      pathMesh.position.z = 0.1;
      this.scene.add(pathMesh);
      this.paths.push(path);
    }

    // Add castle after last task
    if (index === totalTasks - 1) {
      console.log('Adding castle at the end');
      this.castle = new Castle();
      const castleMesh = this.castle.getMesh();
      
      // Adjust castle position relative to last task
      const castlePosition = new THREE.Vector3(
        position.x + 4,  // 4 units after last task
        position.y + 1,  // Slightly higher than last task
        0.2
      );
      castleMesh.position.copy(castlePosition);
      castleMesh.scale.set(2, 2, 1); // Make castle bigger
      this.scene.add(castleMesh);

      // Add final path to castle
      const pathToCastle = new PathConnection(
        position,
        new THREE.Vector3(castlePosition.x - 2, castlePosition.y - 1, 0),
        task.status === 'checked'
      );
      const pathMesh = pathToCastle.getMesh();
      pathMesh.position.z = 0.1;
      this.scene.add(pathMesh);
      this.paths.push(pathToCastle);
    }
  }

  public getClickedTaskId(event: MouseEvent): string | null {
    // Convert mouse position to normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      // Find the clicked block
      for (const [taskId, block] of this.tasks) {
        if (block.getMesh().children.includes(intersects[0].object)) {
          return taskId;
        }
      }
    }

    return null;
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    
    const delta = this.clock.getDelta();
    
    // Animate clouds
    this.clouds.children.forEach(cloud => {
      cloud.position.x += cloud.userData.speed * delta;
      if (cloud.position.x > 20) {
        cloud.position.x = -20;
      }
    });

    // Animate blocks
    this.tasks.forEach(block => block.animate(Date.now() * 0.001));

    // Animate character
    if ('animate' in this.character) {
      this.character.animate(Date.now() * 0.001, false, false);
    }

    // Animate paths
    const time = Date.now() * 0.001;
    this.paths.forEach(path => path.animate(time));

    // Animate castle
    if (this.castle) {
      this.castle.animate(Date.now() * 0.001);
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Public methods for scene management
  public resize(width: number, height: number) {
    const aspect = width / height;
    this.camera.left = -12 * aspect;
    this.camera.right = 12 * aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    this.renderer.dispose();
  }
} 