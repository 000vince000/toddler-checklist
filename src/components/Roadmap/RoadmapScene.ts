import * as THREE from 'three';
import { CoinBlock } from './objects/CoinBlock';
import { createRoadmapCharacter } from './objects/RoadmapCharacter';
import { createMarioBackground } from './objects/BackgroundElements';
import { PathConnection } from './objects/PathConnection';
import { Castle } from './objects/Castle';
import { Bullseye } from './objects/Bullseye';

interface Task {
  id: string;
  status: 'checked' | 'unchecked';
}

interface AnimatableCharacter extends THREE.Group {
  animate: (time: number, walking: boolean, jumping: boolean) => void;
}

export class RoadmapScene {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private clouds: THREE.Group;
  private background: THREE.Group;
  private gameObjects: THREE.Group;
  private clock: THREE.Clock;
  private character: AnimatableCharacter;
  private tasks: Map<string, CoinBlock> = new Map();
  private taskPositions: Map<string, THREE.Vector3> = new Map();
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private paths: PathConnection[] = [];
  private castle: Castle | null = null;
  private bullseye: Bullseye;
  private startPosition: THREE.Vector3;

  constructor(container: HTMLElement) {
    try {
      console.log('RoadmapScene constructor starting:', {
        containerWidth: container.clientWidth,
        containerHeight: container.clientHeight
      });
      this.clock = new THREE.Clock();
      
      // Setup scene
      this.scene = new THREE.Scene();
      console.log('Scene created');
      
      // Setup orthographic camera for 2D view
      const aspect = container.clientWidth / container.clientHeight;
      this.camera = new THREE.OrthographicCamera(
        -12 * aspect, 12 * aspect,
        20, -20, // Increased vertical range
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

      // Add bullseye at bottom center
      this.bullseye = new Bullseye();
      const bullseyeMesh = this.bullseye.getMesh();
      this.startPosition = new THREE.Vector3(0, -15, 0.1); // Bottom center
      bullseyeMesh.position.copy(this.startPosition);
      bullseyeMesh.scale.set(2, 2, 1);
      this.scene.add(bullseyeMesh);

      // Add character at bullseye
      this.character = createRoadmapCharacter() as AnimatableCharacter;
      this.character.scale.set(4, 4, 1);
      this.character.position.copy(this.startPosition);
      this.character.position.y += 3;
      this.character.position.z = 5;
      this.scene.add(this.character);

      // Setup raycaster for click detection
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      // Start animation loop
      this.animate();

      // After scene setup
      console.log('Scene setup complete, dimensions:', {
        width: container.clientWidth,
        height: container.clientHeight,
        cameraTop: this.camera.top,
        cameraBottom: this.camera.bottom
      });

      // After background setup
      console.log('Background layers:', this.background.children.map(child => ({
        position: child.position,
        scale: child.scale
      })));

      // After castle is added
      if (this.castle) {
        const castleWorldPos = this.castle.getMesh().getWorldPosition(new THREE.Vector3());
        console.log('Castle world position after add:', castleWorldPos.toArray());
        console.log('Castle local position:', this.castle.getMesh().position.toArray());
      }

      console.log('RoadmapScene constructor complete');
    } catch (error) {
      console.error('Error in RoadmapScene constructor:', error);
      throw error;
    }
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
        Math.random() * 10 + 10,
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
    const layers = [
      { z: -5, color: 0x87CEEB, scale: 0.8 }, // Far mountains
      { z: -3, color: 0x4CAF50, scale: 0.9 }, // Hills
      { z: -1, color: 0x8BC34A, scale: 1.0 }  // Ground
    ];

    layers.forEach(layer => {
      const geometry = new THREE.PlaneGeometry(100, 50); // Increased height
      const material = new THREE.MeshBasicMaterial({ color: layer.color });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.z = layer.z;
      mesh.position.y = -15;
      mesh.scale.set(layer.scale, layer.scale, 1);
      
      this.background.add(mesh);
    });
  }

  public addTask(task: Task, index: number, isActive: boolean) {
    const totalTasks = 6;
    const amplitude = 2;

    // Dynamically compute vertical spacing so tasks fill the space between bullseye and castle
    const bottomY = this.startPosition.y + 2; // first task sits 2 units above bullseye
    const castleY = 10;                      // fixed castle height, moved down
    const marginFromCastle = 2;              // keep last task a bit below castle
    const verticalSpacing = (castleY - marginFromCastle - bottomY) / (totalTasks - 1);

    // Calculate positions in a vertical zigzag
    const progress = index / (totalTasks - 1);
    let x, y;
    
    x = Math.sin(progress * Math.PI * 2) * amplitude;
    y = bottomY + index * verticalSpacing;

    console.log('RoadmapScene: adding task', {
      taskId: task.id,
      index,
      position: { x, y },
      isActive
    });

    // Create and position the task
    const coinBlock = new CoinBlock({
      isCompleted: task.status === 'checked',
      isActive
    });
    const mesh = coinBlock.getMesh();
    mesh.position.set(x, y, 0);
    this.gameObjects.add(mesh);
    this.tasks.set(task.id, coinBlock);
    this.taskPositions.set(task.id, new THREE.Vector3(x, y, 0));

    // After computing position, if this is the last task, place the castle at fixed height
    if (index === totalTasks - 1) {
      this.castle = new Castle();
      const castleMesh = this.castle.getMesh();
      castleMesh.position.set(0, castleY, 0.2);
      castleMesh.scale.set(2, 2, 2);
      this.gameObjects.add(castleMesh);
    }

    // Create path to previous task
    if (index > 0) {
      const prevTask = Array.from(this.tasks.entries())[index - 1];
      if (prevTask) {
        const path = new PathConnection(
          this.taskPositions.get(prevTask[0])!,
          new THREE.Vector3(x, y, 0),
          prevTask[1].getStatus() === 'checked'
        );
        this.paths.push(path);
        this.gameObjects.add(path.getMesh());
      }
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

  public updateTaskStatus(taskId: string, status: 'checked' | 'unchecked') {
    console.log('RoadmapScene: updateTaskStatus called', { taskId, status });
    const task = this.tasks.get(taskId);
    if (!task) {
      console.log('RoadmapScene: task not found', { taskId });
      return;
    }

    // Update task status
    task.setStatus(status);
    console.log('RoadmapScene: task status updated');

    // Find the next unchecked task
    const taskArray = Array.from(this.tasks.entries());
    const nextTask = taskArray.find(([_, task]) => task.getStatus() === 'unchecked');
    console.log('RoadmapScene: next task found', { nextTaskId: nextTask?.[0] });

    if (nextTask) {
      // Get the position of the next task
      const nextPosition = this.taskPositions.get(nextTask[0]);
      console.log('RoadmapScene: next task position', nextPosition);
      if (nextPosition) {
        // Animate character movement
        this.animateCharacterMovement(nextPosition);
      }
    } else if (status === 'checked' && this.castle) {
      // If all tasks are completed, move to castle
      const castlePosition = this.castle.getMesh().position.clone();
      castlePosition.y -= 2; // Adjust to stand in front of castle
      console.log('RoadmapScene: moving to castle', castlePosition);
      this.animateCharacterMovement(castlePosition);
    } else {
      // If no unchecked tasks found and not all completed, reset to start
      this.resetCharacterPosition();
    }
  }

  public resetCharacterPosition() {
    console.log('RoadmapScene: resetting character position to start');
    const startPos = this.startPosition.clone();
    startPos.y += 3; // Match the offset in constructor
    startPos.z = 5; // Ensure character is in front
    this.animateCharacterMovement(startPos);
  }

  public resetAllTasks() {
    console.log('RoadmapScene: resetAllTasks called');
    this.tasks.forEach(task => task.setStatus('unchecked'));
    // Optionally reset path visuals here (omitted for brevity)
    this.resetCharacterPosition();
  }

  public animateCharacterMovement(targetPosition: THREE.Vector3) {
    console.log('RoadmapScene: animating character movement', {
      from: this.character.position.toArray(),
      to: targetPosition.toArray()
    });
    const startPosition = this.character.position.clone();
    const distance = startPosition.distanceTo(targetPosition);
    const duration = 1.0; // seconds
    const startTime = this.clock.getElapsedTime();
    
    // Store animation data
    this.character.userData.animation = {
      startPosition,
      targetPosition,
      startTime,
      duration,
      isMoving: true
    };
  }

  private updateCharacterAnimation() {
    const animation = this.character.userData.animation;
    if (!animation || !animation.isMoving) return;

    const currentTime = this.clock.getElapsedTime();
    const elapsed = currentTime - animation.startTime;
    const progress = Math.min(elapsed / animation.duration, 1);

    if (progress < 1) {
      // Update position
      this.character.position.lerpVectors(
        animation.startPosition,
        animation.targetPosition,
        progress
      );

      // Update character animation state
      const walking = true;
      const jumping = progress < 0.5; // Jump in first half of movement
      this.character.animate(currentTime, walking, jumping);
    } else {
      // Animation complete
      this.character.position.copy(animation.targetPosition);
      this.character.animate(currentTime, false, false);
      animation.isMoving = false;
      console.log('RoadmapScene: character movement complete', {
        finalPosition: this.character.position.toArray()
      });
    }
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();

    // Update clouds
    this.clouds.children.forEach(cloud => {
      const speed = cloud.userData.speed || 0.5;
      const initialX = cloud.userData.initialX || 0;
      cloud.position.x = initialX + Math.sin(time * speed) * 2;
    });

    // Update character animation
    this.updateCharacterAnimation();

    // Update paths
    this.paths.forEach(path => path.animate(time));

    // Update castle if it exists
    if (this.castle) {
      this.castle.animate(time);
    }

    this.renderer.render(this.scene, this.camera);
  };

  // Public methods for scene management
  public resize(width: number, height: number) {
    const aspect = width / height;
    this.camera.left = -12 * aspect;
    this.camera.right = 12 * aspect;
    this.camera.top = 20;
    this.camera.bottom = -20;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    this.renderer.dispose();
  }

  public getInitialCharacterPosition(): THREE.Vector3 {
    const pos = this.startPosition.clone();
    pos.y += 3; // Match the offset in constructor
    pos.z = 5;  // Match the z position in constructor
    return pos;
  }
} 