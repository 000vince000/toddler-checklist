import * as THREE from 'three';

export function createCheckmark() {
  const checkmark = new THREE.Group();

  const material = new THREE.LineBasicMaterial({ color: 0x4CAF50, linewidth: 3 });
  const points = [
    new THREE.Vector3(-0.2, 0, 0),
    new THREE.Vector3(0, -0.2, 0),
    new THREE.Vector3(0.4, 0.2, 0)
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  checkmark.add(line);

  return checkmark;
}

export function createXMark() {
  const xMark = new THREE.Group();

  const material = new THREE.LineBasicMaterial({ color: 0xFF0000, linewidth: 3 });
  
  // First line (\)
  const points1 = [
    new THREE.Vector3(-0.2, 0.2, 0),
    new THREE.Vector3(0.2, -0.2, 0)
  ];
  const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
  const line1 = new THREE.Line(geometry1, material);
  xMark.add(line1);

  // Second line (/)
  const points2 = [
    new THREE.Vector3(-0.2, -0.2, 0),
    new THREE.Vector3(0.2, 0.2, 0)
  ];
  const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
  const line2 = new THREE.Line(geometry2, material);
  xMark.add(line2);

  return xMark;
}

export function createBullseye() {
  const bullseye = new THREE.Group();

  // Outer circle
  const outerGeometry = new THREE.RingGeometry(0.8, 1, 32);
  const outerMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFF0000,
    side: THREE.DoubleSide
  });
  const outerRing = new THREE.Mesh(outerGeometry, outerMaterial);
  bullseye.add(outerRing);

  // Inner circle
  const innerGeometry = new THREE.CircleGeometry(0.4, 32);
  const innerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  const innerCircle = new THREE.Mesh(innerGeometry, innerMaterial);
  bullseye.add(innerCircle);

  bullseye.rotation.x = -Math.PI / 2;
  return bullseye;
} 