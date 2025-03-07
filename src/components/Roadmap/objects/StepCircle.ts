import * as THREE from 'three';

export function createStepCircle(isCompleted: boolean, isActive: boolean) {
  const group = new THREE.Group();

  // Create circle platform
  const circleGeometry = new THREE.CircleGeometry(1, 32);
  const circleMaterial = new THREE.MeshPhongMaterial({
    color: isCompleted ? 0x4CAF50 : 0xE0E0E0,
    emissive: isActive ? 0xFFC107 : 0x000000,
    emissiveIntensity: isActive ? 0.5 : 0
  });
  const circle = new THREE.Mesh(circleGeometry, circleMaterial);
  circle.rotation.x = -Math.PI / 2;
  circle.receiveShadow = true;
  group.add(circle);

  // Add completion marker
  if (isCompleted) {
    const checkmark = createCheckmark();
    checkmark.position.y = 0.1;
    group.add(checkmark);
  } else if (!isActive) {
    const xMark = createXMark();
    xMark.position.y = 0.1;
    group.add(xMark);
  }

  return group;
} 