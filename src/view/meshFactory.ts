import * as THREE from 'three';
import { vehicleScreenRotationY, worldToScreenX } from '../core/collision.ts';
import type { LogPlatform, ObstacleKind, SkinId, Vehicle } from '../core/types.ts';

export class MeshFactory {
  static createCharacter(skinId: SkinId = 'chicken', isGhost: boolean = false): THREE.Group {
    const group = new THREE.Group();

    const makeMat = (color: number) =>
      new THREE.MeshLambertMaterial({
        color: isGhost ? 0xfbbf24 : color,
        transparent: isGhost,
        opacity: isGhost ? 0.42 : 1.0,
      });

    const orangeMat = makeMat(0xf97316);
    const darkMat = makeMat(0x1e293b);

    // Legs touching Y = 0
    const legGeo = new THREE.BoxGeometry(0.1, 0.12, 0.14);
    const leftLeg = new THREE.Mesh(legGeo, orangeMat);
    leftLeg.position.set(-0.14, 0.06, 0);
    const rightLeg = new THREE.Mesh(legGeo, orangeMat);
    rightLeg.position.set(0.14, 0.06, 0);
    group.add(leftLeg, rightLeg);

    if (skinId === 'cyber_duck') {
      const yellowMat = makeMat(0xfacc15);
      const visorMat = makeMat(0x06b6d4);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.54, 0.64), yellowMat);
      body.position.y = 0.37;
      body.castShadow = !isGhost;
      group.add(body);

      const bill = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.24), orangeMat);
      bill.position.set(0, 0.44, 0.41);
      group.add(bill);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.18), visorMat);
      visor.position.set(0, 0.55, 0.26);
      group.add(visor);
    } else if (skinId === 'shadow_ninja') {
      const suitMat = makeMat(0x0f172a);
      const bandMat = makeMat(0xef4444);
      const skinToneMat = makeMat(0xfde68a);
      const steelMat = makeMat(0x94a3b8);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.58, 0.58), suitMat);
      body.position.y = 0.39;
      body.castShadow = !isGhost;
      group.add(body);

      const faceSlit = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.06), skinToneMat);
      faceSlit.position.set(0, 0.52, 0.28);
      group.add(faceSlit);

      const headband = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.62), bandMat);
      headband.position.set(0, 0.62, 0);
      group.add(headband);

      const katana = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.08), steelMat);
      katana.position.set(0.18, 0.52, -0.33);
      katana.rotation.z = -0.35;
      group.add(katana);
    } else if (skinId === 'frost_penguin') {
      const navyMat = makeMat(0x1e3a8a);
      const bellyMat = makeMat(0xf8fafc);
      const scarfMat = makeMat(0x38bdf8);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.58, 0.56), navyMat);
      body.position.y = 0.39;
      body.castShadow = !isGhost;
      group.add(body);

      const belly = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.06), bellyMat);
      belly.position.set(0, 0.36, 0.27);
      group.add(belly);

      const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.62), scarfMat);
      scarf.position.set(0, 0.48, 0);
      group.add(scarf);

      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.2), orangeMat);
      beak.position.set(0, 0.53, 0.34);
      group.add(beak);
    } else {
      const whiteMat = makeMat(0xffffff);
      const redMat = makeMat(0xef4444);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.56, 0.62), whiteMat);
      body.position.y = 0.38;
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);

      const comb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.32), redMat);
      comb.position.set(0, 0.74, 0.05);
      group.add(comb);

      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.2), orangeMat);
      beak.position.set(0, 0.48, 0.38);
      group.add(beak);

      const wattle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.12), redMat);
      wattle.position.set(0, 0.34, 0.34);
      group.add(wattle);

      const eyeGeo = new THREE.BoxGeometry(0.06, 0.08, 0.08);
      const leftEye = new THREE.Mesh(eyeGeo, darkMat);
      leftEye.position.set(-0.29, 0.52, 0.18);
      const rightEye = new THREE.Mesh(eyeGeo, darkMat);
      rightEye.position.set(0.29, 0.52, 0.18);
      group.add(leftEye, rightEye);
    }

    return group;
  }

  static createChicken(): THREE.Group {
    return MeshFactory.createCharacter('chicken');
  }

  static createObstacle(kind: ObstacleKind, seedVariant: number, isSnowBiome: boolean = false): THREE.Group {
    if (kind === 'rock') {
      return MeshFactory.createRock(seedVariant);
    }
    if (kind === 'bush') {
      return MeshFactory.createBush(seedVariant, isSnowBiome);
    }
    return MeshFactory.createTree(seedVariant, isSnowBiome);
  }

  static createTree(seedVariant: number, isSnowBiome: boolean = false): THREE.Group {
    const group = new THREE.Group();
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const leavesMat = new THREE.MeshLambertMaterial({
      color: isSnowBiome ? 0xe2e8f0 : seedVariant % 2 === 0 ? 0x16a34a : 0x15803d,
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

  static createRock(seedVariant: number): THREE.Group {
    const group = new THREE.Group();
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
    const topMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.44, 0.72), baseMat);
    base.position.y = 0.22;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const top = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.28, 0.48), topMat);
    top.position.set((seedVariant % 2 === 0 ? 1 : -1) * 0.06, 0.54, 0);
    top.castShadow = true;
    group.add(top);

    return group;
  }

  static createBush(seedVariant: number, isSnowBiome: boolean = false): THREE.Group {
    const group = new THREE.Group();
    const bushMat = new THREE.MeshLambertMaterial({
      color: isSnowBiome ? 0xdbeafe : 0x22c55e,
    });
    const berryMat = new THREE.MeshLambertMaterial({
      color: seedVariant % 2 === 0 ? 0xef4444 : 0xf59e0b,
    });

    const main = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.48, 0.78), bushMat);
    main.position.y = 0.24;
    main.castShadow = true;
    group.add(main);

    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), berryMat);
    b1.position.set(-0.2, 0.46, 0.22);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), berryMat);
    b2.position.set(0.22, 0.42, -0.18);
    group.add(b1, b2);

    return group;
  }

  static createCoin(): THREE.Group {
    const group = new THREE.Group();
    const goldMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    const innerMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });

    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.12), goldMat);
    rim.position.y = 0.36;
    rim.castShadow = true;
    group.add(rim);

    const center = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.15), innerMat);
    center.position.y = 0.36;
    group.add(center);

    return group;
  }

  static createRailwaySignal(): { group: THREE.Group; lightMesh: THREE.Mesh } {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x334155 });

    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.2, 0.14), poleMat);
    pole.position.y = 0.6;
    pole.castShadow = true;
    group.add(pole);

    const box = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.24), poleMat);
    box.position.y = 1.22;
    group.add(box);

    const lightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.28), lightMat);
    lightMesh.position.y = 1.22;
    group.add(lightMesh);

    return { group, lightMesh };
  }

  static createTrain(length: number, speed: number): THREE.Group {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
    const stripeMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.55,
    });

    const carBody = new THREE.Mesh(new THREE.BoxGeometry(length, 0.96, 0.84), bodyMat);
    carBody.position.y = 0.54;
    carBody.castShadow = true;
    group.add(carBody);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(length + 0.04, 0.18, 0.86), stripeMat);
    stripe.position.y = 0.44;
    group.add(stripe);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(length * 0.96, 0.14, 0.72), roofMat);
    roof.position.y = 1.08;
    group.add(roof);

    const headlightBeam = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 0.92), beamMat);
    headlightBeam.position.set(length / 2 + 1.6, 0.22, 0);
    group.add(headlightBeam);

    group.rotation.y = vehicleScreenRotationY(speed);
    return group;
  }

  static createVehicle(v: Vehicle): THREE.Group {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: v.color });
    const cabinMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.28,
    });

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

    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 0.62), beamMat);
    beam.position.set(v.length / 2 + 0.7, 0.08, 0);
    group.add(beam);

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

    // Visual segment notches representing magnet slots on the log
    const notchMat = new THREE.MeshLambertMaterial({ color: 0x582a08 });
    const slotCount = Math.floor(log.length);
    for (let s = -Math.floor(slotCount / 2); s <= Math.floor(slotCount / 2); s++) {
      if (Math.abs(s) > 0.1 && Math.abs(s) < log.length / 2 - 0.2) {
        const notch = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.33, 0.73), notchMat);
        notch.position.set(s, -0.04, 0);
        group.add(notch);
      }
    }

    return group;
  }

  static createWaterfallEdge(side: 'left' | 'right'): THREE.Group {
    const group = new THREE.Group();
    // Rock cliff bank
    const cliffMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const cliff = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.4, 1.0), cliffMat);
    cliff.position.set(0, -1.2, 0);
    cliff.receiveShadow = true;
    group.add(cliff);

    // Falling water column
    const waterFallMat = new THREE.MeshLambertMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.88,
    });
    const fall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, 0.9), waterFallMat);
    const fallOffset = side === 'left' ? -0.22 : 0.22;
    fall.position.set(fallOffset, -1.15, 0);
    group.add(fall);

    // Foam mist crest at the top
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const foamTop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.94), foamMat);
    foamTop.position.set(fallOffset, -0.05, 0);
    group.add(foamTop);

    // Splash bottom block
    const splash = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.96), foamMat);
    splash.position.set(fallOffset, -2.15, 0);
    group.add(splash);

    return group;
  }

  static createRoadMarkings(): THREE.Group {
    const group = new THREE.Group();
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // Amber center dashes

    // Continuous solid white shoulder lines at boundary edges
    const solidEdgeGeo = new THREE.BoxGeometry(0.12, 0.02, 1.0);
    const leftSolid = new THREE.Mesh(solidEdgeGeo, whiteLineMat);
    leftSolid.position.set(worldToScreenX(-9.5), 0.015, 0);
    const rightSolid = new THREE.Mesh(solidEdgeGeo, whiteLineMat);
    rightSolid.position.set(worldToScreenX(9.5), 0.015, 0);
    group.add(leftSolid, rightSolid);

    // Dashed center lane markings
    const dashGeo = new THREE.BoxGeometry(0.65, 0.02, 0.1);
    for (let x = -9; x <= 9; x += 1.8) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.position.set(worldToScreenX(x), 0.015, 0);
      group.add(dash);
    }

    return group;
  }
}
