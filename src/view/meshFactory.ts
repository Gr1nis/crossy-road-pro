import * as THREE from 'three';
import { vehicleScreenRotationY } from '../core/collision.ts';
import type { LogPlatform, Vehicle } from '../core/types.ts';

export class MeshFactory {
  static createChicken(): THREE.Group {
    const group = new THREE.Group();

    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const redMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });
    const orangeMat = new THREE.MeshLambertMaterial({ color: 0xf97316 });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

    // Feet / Legs touching Y = 0
    const legGeo = new THREE.BoxGeometry(0.1, 0.12, 0.14);
    const leftLeg = new THREE.Mesh(legGeo, orangeMat);
    leftLeg.position.set(-0.14, 0.06, 0);
    const rightLeg = new THREE.Mesh(legGeo, orangeMat);
    rightLeg.position.set(0.14, 0.06, 0);
    group.add(leftLeg, rightLeg);

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.56, 0.62), whiteMat);
    body.position.y = 0.38;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Red comb on head
    const comb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.32), redMat);
    comb.position.set(0, 0.74, 0.05);
    comb.castShadow = true;
    group.add(comb);

    // Beak
    const beak = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.2), orangeMat);
    beak.position.set(0, 0.48, 0.38);
    beak.castShadow = true;
    group.add(beak);

    // Wattle under beak
    const wattle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.12), redMat);
    wattle.position.set(0, 0.34, 0.34);
    group.add(wattle);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.06, 0.08, 0.08);
    const leftEye = new THREE.Mesh(eyeGeo, darkMat);
    leftEye.position.set(-0.29, 0.52, 0.18);
    const rightEye = new THREE.Mesh(eyeGeo, darkMat);
    rightEye.position.set(0.29, 0.52, 0.18);
    group.add(leftEye, rightEye);

    return group;
  }

  static createTree(seedVariant: number): THREE.Group {
    const group = new THREE.Group();
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const leavesMat = new THREE.MeshLambertMaterial({
      color: seedVariant % 2 === 0 ? 0x16a34a : 0x15803d,
    });

    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.42), trunkMat);
    trunk.position.y = 0.275;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    const height = 0.9 + (Math.abs(seedVariant) % 3) * 0.28;
    const crown = new THREE.Mesh(new THREE.BoxGeometry(0.82, height, 0.82), leavesMat);
    crown.position.y = 0.55 + height / 2;
    crown.castShadow = true;
    crown.receiveShadow = true;
    group.add(crown);

    return group;
  }

  static createVehicle(v: Vehicle): THREE.Group {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: v.color });
    const cabinMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });

    if (v.type === 'truck') {
      const trailer = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.68, 0.82, 0.78), cabinMat);
      trailer.position.set(-v.length * 0.14, 0.52, 0);
      trailer.castShadow = true;
      trailer.receiveShadow = true;
      group.add(trailer);

      const cab = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.28, 0.68, 0.74), bodyMat);
      cab.position.set(v.length * 0.34, 0.44, 0);
      cab.castShadow = true;
      group.add(cab);
    } else {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(v.length, 0.42, 0.74), bodyMat);
      chassis.position.y = 0.32;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      group.add(chassis);

      const top = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.56, 0.32, 0.64), cabinMat);
      top.position.set(-0.05, 0.66, 0);
      top.castShadow = true;
      group.add(top);
    }

    const wheelGeo = new THREE.BoxGeometry(0.28, 0.24, 0.82);
    const w1 = new THREE.Mesh(wheelGeo, wheelMat);
    w1.position.set(-v.length * 0.3, 0.14, 0);
    const w2 = new THREE.Mesh(wheelGeo, wheelMat);
    w2.position.set(v.length * 0.3, 0.14, 0);
    group.add(w1, w2);

    group.rotation.y = vehicleScreenRotationY(v.speed);

    return group;
  }

  static createLog(log: LogPlatform): THREE.Group {
    const group = new THREE.Group();
    const barkMat = new THREE.MeshLambertMaterial({ color: 0x854d0e });
    const ringMat = new THREE.MeshLambertMaterial({ color: 0xfde047 });

    const mainMesh = new THREE.Mesh(new THREE.BoxGeometry(log.length, 0.32, 0.72), barkMat);
    mainMesh.position.y = -0.04;
    mainMesh.receiveShadow = true;
    mainMesh.castShadow = true;
    group.add(mainMesh);

    const ends = new THREE.Mesh(new THREE.BoxGeometry(log.length + 0.04, 0.22, 0.52), ringMat);
    ends.position.y = -0.04;
    group.add(ends);

    return group;
  }
}
