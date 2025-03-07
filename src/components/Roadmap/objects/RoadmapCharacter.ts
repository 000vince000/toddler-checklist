import * as THREE from 'three';

interface AnimatedCharacter extends THREE.Group {
  animate: (time: number, isWalking: boolean, isCelebrating: boolean) => void;
}

export function createRoadmapCharacter(): AnimatedCharacter {
  const character = new THREE.Group() as AnimatedCharacter;
  
  // Create all the character parts (similar to PixelAnimation)
  const body = new THREE.Group();

  // Hair
  const hairGroup = new THREE.Group();
  const mainHair = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.2),
    new THREE.MeshBasicMaterial({ color: 0x8B4513 })
  );
  mainHair.position.y = 0.4;
  hairGroup.add(mainHair);

  // Add side hair and bangs
  [-0.12, 0.12].forEach(x => {
    const sideHair = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, 0.25),
      new THREE.MeshBasicMaterial({ color: 0x8B4513 })
    );
    sideHair.position.set(x, 0.35, -0.01);
    hairGroup.add(sideHair);
  });

  const bangs = new THREE.Mesh(
    new THREE.PlaneGeometry(0.25, 0.08),
    new THREE.MeshBasicMaterial({ color: 0x8B4513 })
  );
  bangs.position.set(0, 0.43, 0.01);
  hairGroup.add(bangs);

  character.add(hairGroup);

  // Head and face
  const head = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.22),
    new THREE.MeshBasicMaterial({ color: 0xffccaa })
  );
  head.position.y = 0.3;
  character.add(head);

  // Add eyes, mouth, etc. (similar to PixelAnimation)
  // ... (skipping for brevity, but would include all facial features)

  // T-shirt
  const shirt = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.25),
    new THREE.MeshBasicMaterial({ color: 0xff4757 })
  );
  shirt.position.set(0, 0.075, 0);
  character.add(shirt);

  // Diaper
  const diaperGroup = createDiaper();
  diaperGroup.position.y = -0.1;
  character.add(diaperGroup);

  // Arms and legs (store references for animation)
  const arms = {
    left: new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffccaa })
    ),
    right: new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffccaa })
    )
  };
  arms.left.position.set(-0.2, 0.1, 0);
  arms.right.position.set(0.2, 0.1, 0);
  character.add(arms.left, arms.right);

  const legs = {
    left: new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffccaa })
    ),
    right: new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffccaa })
    )
  };
  legs.left.position.set(-0.1, -0.25, 0);
  legs.right.position.set(0.1, -0.25, 0);
  character.add(legs.left, legs.right);

  // Animation method
  character.animate = (time: number, isWalking: boolean, isCelebrating: boolean) => {
    if (isCelebrating) {
      // Celebration animation
      character.position.y = Math.sin(time * 10) * 0.1;
      arms.left.rotation.z = Math.sin(time * 10) * 0.5;
      arms.right.rotation.z = -Math.sin(time * 10) * 0.5;
      character.rotation.y = Math.sin(time * 5) * 0.2;
    } else if (isWalking) {
      // Walking animation
      const walkSpeed = 8;
      arms.left.rotation.z = Math.sin(time * walkSpeed) * 0.4;
      arms.right.rotation.z = -Math.sin(time * walkSpeed) * 0.4;
      legs.left.rotation.z = Math.sin(time * walkSpeed) * 0.4;
      legs.right.rotation.z = -Math.sin(time * walkSpeed) * 0.4;
      character.position.y = Math.abs(Math.sin(time * walkSpeed * 2)) * 0.05;
    } else {
      // Idle animation
      character.position.y = Math.sin(time * 2) * 0.03;
      arms.left.rotation.z = Math.sin(time * 2) * 0.1;
      arms.right.rotation.z = -Math.sin(time * 2) * 0.1;
    }
  };

  return character;
}

function createDiaper(): THREE.Group {
  const diaperGroup = new THREE.Group();
  
  // Main diaper
  const diaper = new THREE.Mesh(
    new THREE.PlaneGeometry(0.25, 0.15),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  diaperGroup.add(diaper);

  // Diaper pattern
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(0.23, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xb3d9ff })
    );
    stripe.position.set(0, -0.04 + i * 0.04, 0.01);
    diaperGroup.add(stripe);
  }

  // Diaper tabs
  [-0.13, 0.13].forEach(x => {
    const tab = new THREE.Mesh(
      new THREE.PlaneGeometry(0.04, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xb3d9ff })
    );
    tab.position.set(x, 0, 0.01);
    diaperGroup.add(tab);
  });

  return diaperGroup;
} 