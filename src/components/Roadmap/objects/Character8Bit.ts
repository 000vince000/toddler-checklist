import * as THREE from 'three';

interface AnimatedCharacter extends THREE.Group {
  animate: (time: number) => void;
}

export function create8BitCharacter(): AnimatedCharacter {
  const character = new THREE.Group() as AnimatedCharacter;
  const body = new THREE.Group();

  // Body
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.6, 0.2),
    new THREE.MeshPhongMaterial({ color: 0x3366ff }) // Blue shirt
  );
  torso.position.y = 0.3;
  body.add(torso);

  // Head
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.3),
    new THREE.MeshPhongMaterial({ color: 0xffccaa }) // Skin tone
  );
  head.position.y = 0.75;
  body.add(head);

  // Arms
  [-0.25, 0.25].forEach(x => {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.4, 0.15),
      new THREE.MeshPhongMaterial({ color: 0x3366ff })
    );
    arm.position.set(x, 0.4, 0);
    body.add(arm);
  });

  // Legs
  [-0.1, 0.1].forEach(x => {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.3, 0.15),
      new THREE.MeshPhongMaterial({ color: 0x333333 }) // Dark pants
    );
    leg.position.set(x, 0.15, 0);
    body.add(leg);
  });

  character.add(body);

  // Add shadow
  const shadowGeometry = new THREE.CircleGeometry(0.3, 32);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  character.add(shadow);

  // Animation method
  character.animate = (time: number) => {
    // Bobbing motion
    body.position.y = Math.sin(time * 0.1) * 0.05;
    
    // Leg swinging
    const legs = body.children.slice(-2);
    legs.forEach((leg, i) => {
      leg.rotation.x = Math.sin(time * 0.1 + (i * Math.PI)) * 0.2;
    });
    
    // Arm swinging
    const arms = body.children.slice(2, 4);
    arms.forEach((arm, i) => {
      arm.rotation.x = Math.sin(time * 0.1 + (i * Math.PI)) * 0.2;
    });
  };

  return character;
} 