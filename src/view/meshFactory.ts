import * as THREE from 'three';
import { vehicleScreenRotationY, worldToScreenX } from '../core/collision.ts';
import type { BiomeType, LogPlatform, ObstacleKind, SkinId, Vehicle } from '../core/types.ts';

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

    // Detailed feet and legs touching Y = 0
    const legGeo = new THREE.BoxGeometry(0.1, 0.14, 0.12);
    const footGeo = new THREE.BoxGeometry(0.14, 0.04, 0.22);
    const leftLeg = new THREE.Mesh(legGeo, orangeMat);
    leftLeg.position.set(-0.14, 0.07, 0);
    const rightLeg = new THREE.Mesh(legGeo, orangeMat);
    rightLeg.position.set(0.14, 0.07, 0);
    const leftFoot = new THREE.Mesh(footGeo, orangeMat);
    leftFoot.position.set(-0.14, 0.02, 0.04);
    const rightFoot = new THREE.Mesh(footGeo, orangeMat);
    rightFoot.position.set(0.14, 0.02, 0.04);
    group.add(leftLeg, rightLeg, leftFoot, rightFoot);

    if (skinId === 'cyber_duck') {
      const yellowMat = makeMat(0xfacc15);
      const visorMat = makeMat(0x06b6d4);
      const chromeMat = makeMat(0x94a3b8);
      const neonPinkMat = makeMat(0xec4899);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.54, 0.64), yellowMat);
      body.position.y = 0.37;
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);

      // Cyber wings & jetpack thrusters
      const wingGeo = new THREE.BoxGeometry(0.08, 0.28, 0.38);
      const leftWing = new THREE.Mesh(wingGeo, yellowMat);
      leftWing.position.set(-0.33, 0.36, -0.02);
      const rightWing = new THREE.Mesh(wingGeo, yellowMat);
      rightWing.position.set(0.33, 0.36, -0.02);
      const jetpack = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.3, 0.14), chromeMat);
      jetpack.position.set(0, 0.38, -0.36);
      const thrusterCore = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.06), neonPinkMat);
      thrusterCore.position.set(0, 0.38, -0.44);
      group.add(leftWing, rightWing, jetpack, thrusterCore);

      const bill = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.24), orangeMat);
      bill.position.set(0, 0.44, 0.41);
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.2), visorMat);
      visor.position.set(0, 0.55, 0.26);
      const antenna = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.06), chromeMat);
      antenna.position.set(0, 0.72, -0.05);
      const antennaTip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.1), neonPinkMat);
      antennaTip.position.set(0, 0.82, -0.05);
      group.add(bill, visor, antenna, antennaTip);
    } else if (skinId === 'shadow_ninja') {
      const suitMat = makeMat(0x0f172a);
      const armorMat = makeMat(0x1e293b);
      const bandMat = makeMat(0xef4444);
      const skinToneMat = makeMat(0xfde68a);
      const steelMat = makeMat(0xcbd5e1);
      const goldMat = makeMat(0xf59e0b);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.58, 0.58), suitMat);
      body.position.y = 0.39;
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);

      const chestArmor = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.24, 0.6), armorMat);
      chestArmor.position.set(0, 0.34, 0);
      const faceSlit = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.06), skinToneMat);
      faceSlit.position.set(0, 0.52, 0.28);
      const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.08), suitMat);
      leftEye.position.set(-0.12, 0.52, 0.29);
      const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.08), suitMat);
      rightEye.position.set(0.12, 0.52, 0.29);
      const headband = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.62), bandMat);
      headband.position.set(0, 0.62, 0);
      const bandTail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.12), bandMat);
      bandTail.position.set(-0.14, 0.56, -0.35);

      const katanaBlade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.74, 0.08), steelMat);
      katanaBlade.position.set(0.18, 0.52, -0.33);
      katanaBlade.rotation.z = -0.35;
      const katanaHilt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.14), goldMat);
      katanaHilt.position.set(0.06, 0.78, -0.33);
      group.add(chestArmor, faceSlit, leftEye, rightEye, headband, bandTail, katanaBlade, katanaHilt);
    } else if (skinId === 'frost_penguin') {
      const navyMat = makeMat(0x1e3a8a);
      const bellyMat = makeMat(0xf8fafc);
      const scarfMat = makeMat(0x38bdf8);
      const earmuffMat = makeMat(0xef4444);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.58, 0.56), navyMat);
      body.position.y = 0.39;
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);

      const belly = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.06), bellyMat);
      belly.position.set(0, 0.36, 0.27);
      const flipperGeo = new THREE.BoxGeometry(0.08, 0.32, 0.26);
      const leftFlipper = new THREE.Mesh(flipperGeo, navyMat);
      leftFlipper.position.set(-0.32, 0.36, 0);
      const rightFlipper = new THREE.Mesh(flipperGeo, navyMat);
      rightFlipper.position.set(0.32, 0.36, 0);
      const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.62), scarfMat);
      scarf.position.set(0, 0.48, 0);
      const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.08), scarfMat);
      scarfTail.position.set(0.14, 0.36, 0.31);
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.2), orangeMat);
      beak.position.set(0, 0.53, 0.34);
      const muffLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.16), earmuffMat);
      muffLeft.position.set(-0.31, 0.58, 0.04);
      const muffRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.16), earmuffMat);
      muffRight.position.set(0.31, 0.58, 0.04);
      group.add(belly, leftFlipper, rightFlipper, scarf, scarfTail, beak, muffLeft, muffRight);
    } else {
      const whiteMat = makeMat(0xffffff);
      const redMat = makeMat(0xef4444);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.56, 0.62), whiteMat);
      body.position.y = 0.38;
      body.castShadow = !isGhost;
      body.receiveShadow = !isGhost;
      group.add(body);

      const wingGeo = new THREE.BoxGeometry(0.08, 0.28, 0.36);
      const leftWing = new THREE.Mesh(wingGeo, whiteMat);
      leftWing.position.set(-0.32, 0.36, -0.02);
      const rightWing = new THREE.Mesh(wingGeo, whiteMat);
      rightWing.position.set(0.32, 0.36, -0.02);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.14), whiteMat);
      tail.position.set(0, 0.44, -0.36);

      const comb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.32), redMat);
      comb.position.set(0, 0.74, 0.05);
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.2), orangeMat);
      beak.position.set(0, 0.48, 0.38);
      const wattle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.12), redMat);
      wattle.position.set(0, 0.34, 0.34);

      const eyeGeo = new THREE.BoxGeometry(0.06, 0.08, 0.08);
      const leftEye = new THREE.Mesh(eyeGeo, darkMat);
      leftEye.position.set(-0.29, 0.52, 0.18);
      const rightEye = new THREE.Mesh(eyeGeo, darkMat);
      rightEye.position.set(0.29, 0.52, 0.18);
      group.add(leftWing, rightWing, tail, comb, beak, wattle, leftEye, rightEye);
    }

    return group;
  }

  static createChicken(): THREE.Group {
    return MeshFactory.createCharacter('chicken');
  }

  static createObstacle(
    kind: ObstacleKind,
    seedVariant: number,
    biomeOrSnow: BiomeType | boolean = false
  ): THREE.Group {
    const biome: BiomeType =
      typeof biomeOrSnow === 'boolean' ? (biomeOrSnow ? 'winter' : 'forest') : biomeOrSnow;
    if (kind === 'rock') {
      return MeshFactory.createRock(seedVariant, biome);
    }
    if (kind === 'bush') {
      return MeshFactory.createBush(seedVariant, biome);
    }
    return MeshFactory.createTree(seedVariant, biome);
  }

  static createTree(seedVariant: number, biomeOrSnow: BiomeType | boolean = false): THREE.Group {
    const group = new THREE.Group();
    const biome: BiomeType =
      typeof biomeOrSnow === 'boolean' ? (biomeOrSnow ? 'winter' : 'forest') : biomeOrSnow;
    const absSeed = Math.abs(seedVariant);

    if (biome === 'desert') {
      // Voxel Saguaro Cactus with arms & desert blossom
      const cactusMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
      const flowerMat = new THREE.MeshLambertMaterial({ color: 0xf43f5e });
      const stem = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.35, 0.36), cactusMat);
      stem.position.y = 0.675;
      stem.castShadow = true;
      stem.receiveShadow = true;
      const armLeftH = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.22), cactusMat);
      armLeftH.position.set(-0.26, 0.65, 0);
      const armLeftV = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.22), cactusMat);
      armLeftV.position.set(-0.34, 0.86, 0);
      const armRightH = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.22), cactusMat);
      armRightH.position.set(0.26, 0.82, 0);
      const armRightV = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.38, 0.22), cactusMat);
      armRightV.position.set(0.34, 1.0, 0);
      const flower = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.16), flowerMat);
      flower.position.set(0, 1.4, 0);
      group.add(stem, armLeftH, armLeftV, armRightH, armRightV, flower);
      return group;
    }

    const trunkMat = new THREE.MeshLambertMaterial({
      color: biome === 'neon' ? 0x1e1b4b : 0x78350f,
    });
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.56, 0.36), trunkMat);
    trunk.position.y = 0.28;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    const isPine = absSeed % 2 === 1 || biome === 'winter';
    const leafColor =
      biome === 'winter'
        ? 0x0f766e
        : biome === 'neon'
          ? absSeed % 2 === 0
            ? 0x06b6d4
            : 0xd946ef
          : absSeed % 3 === 0
            ? 0x16a34a
            : absSeed % 3 === 1
              ? 0x15803d
              : 0x22c55e;
    const leavesMat = new THREE.MeshLambertMaterial({ color: leafColor });

    if (isPine) {
      // Multi-tiered conifer pine tree
      const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.46, 0.86), leavesMat);
      t1.position.y = 0.72;
      const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.44, 0.66), leavesMat);
      t2.position.y = 1.1;
      const t3 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.42), leavesMat);
      t3.position.y = 1.44;
      t1.castShadow = t2.castShadow = t3.castShadow = true;
      group.add(t1, t2, t3);
      if (biome === 'winter') {
        const snowMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
        const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.08, 0.88), snowMat);
        s1.position.y = 0.96;
        const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.44), snowMat);
        s2.position.y = 1.65;
        group.add(s1, s2);
      }
    } else {
      // Detailed blocky oak / cyber tree with crown & side foliage clusters
      const height = 0.85 + (absSeed % 3) * 0.22;
      const crown = new THREE.Mesh(new THREE.BoxGeometry(0.82, height, 0.82), leavesMat);
      crown.position.y = 0.54 + height / 2;
      crown.castShadow = true;
      crown.receiveShadow = true;
      const topCap = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.24, 0.56), leavesMat);
      topCap.position.y = 0.54 + height + 0.1;
      topCap.castShadow = true;
      group.add(crown, topCap);
    }

    return group;
  }

  static createRock(seedVariant: number, biome: BiomeType = 'forest'): THREE.Group {
    const group = new THREE.Group();
    const baseMat = new THREE.MeshLambertMaterial({
      color: biome === 'desert' ? 0xb45309 : biome === 'neon' ? 0x312e81 : 0x64748b,
    });
    const topMat = new THREE.MeshLambertMaterial({
      color: biome === 'winter' ? 0xf1f5f9 : biome === 'desert' ? 0xd97706 : biome === 'neon' ? 0x22d3ee : 0x94a3b8,
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.44, 0.72), baseMat);
    base.position.y = 0.22;
    base.castShadow = true;
    base.receiveShadow = true;
    const sideShard = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.3, 0.34), baseMat);
    sideShard.position.set(seedVariant % 2 === 0 ? -0.26 : 0.26, 0.15, 0.18);
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.28, 0.48), topMat);
    top.position.set((seedVariant % 2 === 0 ? 1 : -1) * 0.06, 0.54, 0);
    top.castShadow = true;
    group.add(base, sideShard, top);

    return group;
  }

  static createBush(seedVariant: number, biomeOrSnow: BiomeType | boolean = false): THREE.Group {
    const group = new THREE.Group();
    const biome: BiomeType =
      typeof biomeOrSnow === 'boolean' ? (biomeOrSnow ? 'winter' : 'forest') : biomeOrSnow;
    const bushMat = new THREE.MeshLambertMaterial({
      color:
        biome === 'winter'
          ? 0xdbeafe
          : biome === 'desert'
            ? 0xa16207
            : biome === 'neon'
              ? 0x7e22ce
              : 0x22c55e,
    });
    const berryMat = new THREE.MeshLambertMaterial({
      color: biome === 'neon' ? 0x06b6d4 : seedVariant % 2 === 0 ? 0xef4444 : 0xf59e0b,
    });

    const main = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.46, 0.78), bushMat);
    main.position.y = 0.23;
    main.castShadow = true;
    const crown = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.22, 0.54), bushMat);
    crown.position.y = 0.52;
    crown.castShadow = true;
    group.add(main, crown);

    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), berryMat);
    b1.position.set(-0.22, 0.46, 0.22);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), berryMat);
    b2.position.set(0.22, 0.42, -0.18);
    const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), berryMat);
    b3.position.set(0.05, 0.62, 0.12);
    group.add(b1, b2, b3);

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
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const chromeMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const headLightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.28,
    });

    const variant = Math.abs(v.id) % 3;

    if (v.type === 'truck') {
      const cab = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.28, 0.7, 0.74), bodyMat);
      cab.position.set(v.length * 0.34, 0.45, 0);
      cab.castShadow = true;
      const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.66), glassMat);
      windshield.position.set(v.length * 0.45, 0.58, 0);
      const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.52), chromeMat);
      grille.position.set(v.length * 0.48, 0.3, 0);
      const exhaust = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.88, 0.08), chromeMat);
      exhaust.position.set(v.length * 0.2, 0.58, -0.36);
      group.add(cab, windshield, grille, exhaust);

      if (variant === 1) {
        // Tanker Truck with cylindrical voxel fuel tank & hazard bands
        const baseBed = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.68, 0.14, 0.76), chromeMat);
        baseBed.position.set(-v.length * 0.14, 0.22, 0);
        const tankMain = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.64, 0.56, 0.68), cabinMat);
        tankMain.position.set(-v.length * 0.14, 0.56, 0);
        tankMain.castShadow = true;
        const tankTop = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.58, 0.14, 0.44), bodyMat);
        tankTop.position.set(-v.length * 0.14, 0.88, 0);
        group.add(baseBed, tankMain, tankTop);
      } else if (variant === 2) {
        // Timber / Flatbed Hauler carrying stacked voxel logs
        const flatbed = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.68, 0.16, 0.78), chromeMat);
        flatbed.position.set(-v.length * 0.14, 0.24, 0);
        const logMat = new THREE.MeshLambertMaterial({ color: 0x854d0e });
        const l1 = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.62, 0.24, 0.28), logMat);
        l1.position.set(-v.length * 0.14, 0.44, -0.18);
        const l2 = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.62, 0.24, 0.28), logMat);
        l2.position.set(-v.length * 0.14, 0.44, 0.18);
        const l3 = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.58, 0.24, 0.3), logMat);
        l3.position.set(-v.length * 0.14, 0.68, 0);
        l1.castShadow = l2.castShadow = l3.castShadow = true;
        group.add(flatbed, l1, l2, l3);
      } else {
        // Classic Box Delivery Trailer with side trim stripe
        const trailer = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.68, 0.84, 0.78), cabinMat);
        trailer.position.set(-v.length * 0.14, 0.53, 0);
        trailer.castShadow = true;
        trailer.receiveShadow = true;
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.69, 0.14, 0.8), bodyMat);
        stripe.position.set(-v.length * 0.14, 0.48, 0);
        group.add(trailer, stripe);
      }
    } else {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(v.length, 0.38, 0.74), bodyMat);
      chassis.position.y = 0.3;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      group.add(chassis);

      if (variant === 0) {
        // Sports Coupe with low aerodynamic cabin, racing stripe & rear spoiler
        const top = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.48, 0.26, 0.64), glassMat);
        top.position.set(-0.04, 0.6, 0);
        const roofCap = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.38, 0.06, 0.6), bodyMat);
        roofCap.position.set(-0.04, 0.75, 0);
        const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.72), chromeMat);
        spoiler.position.set(-v.length * 0.44, 0.55, 0);
        group.add(top, roofCap, spoiler);
      } else if (variant === 1) {
        // Off-Road SUV with tall boxy cabin, roof rack & rear spare wheel
        const suvTop = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.68, 0.34, 0.68), bodyMat);
        suvTop.position.set(-0.08, 0.64, 0);
        suvTop.castShadow = true;
        const suvGlass = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.7, 0.2, 0.7), glassMat);
        suvGlass.position.set(-0.06, 0.63, 0);
        const roofRack = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.46, 0.08, 0.52), chromeMat);
        roofRack.position.set(-0.1, 0.84, 0);
        const spareTire = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.28), wheelMat);
        spareTire.position.set(-v.length * 0.52, 0.44, 0);
        group.add(suvTop, suvGlass, roofRack, spareTire);
      } else {
        // Sedan / Cruiser with distinct cabin & roof beacon
        const top = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.56, 0.32, 0.64), cabinMat);
        top.position.set(-0.05, 0.64, 0);
        top.castShadow = true;
        const windows = new THREE.Mesh(new THREE.BoxGeometry(v.length * 0.58, 0.18, 0.66), glassMat);
        windows.position.set(-0.05, 0.62, 0);
        const lightBar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.38), tailLightMat);
        lightBar.position.set(-0.05, 0.84, 0);
        group.add(top, windows, lightBar);
      }
    }

    // Headlights, taillights, and light beam
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.58), headLightMat);
    hl.position.set(v.length / 2 + 0.01, 0.32, 0);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.58), tailLightMat);
    tl.position.set(-v.length / 2 - 0.01, 0.32, 0);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 0.62), beamMat);
    beam.position.set(v.length / 2 + 0.7, 0.08, 0);
    group.add(hl, tl, beam);

    const wheelGeo = new THREE.BoxGeometry(0.28, 0.24, 0.82);
    const hubGeo = new THREE.BoxGeometry(0.14, 0.12, 0.86);
    const wheelOffsets = v.type === 'truck' ? [-0.36, -0.1, 0.32] : [-0.3, 0.3];
    for (const factor of wheelOffsets) {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(v.length * factor, 0.14, 0);
      const hub = new THREE.Mesh(hubGeo, chromeMat);
      hub.position.set(v.length * factor, 0.14, 0);
      group.add(w, hub);
    }

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

  static createRiverbankEdge(side: 'left' | 'right', biome: BiomeType = 'forest'): THREE.Group {
    const group = new THREE.Group();

    // Wood mooring pylon / bollard material based on biome
    const woodColor =
      biome === 'winter'
        ? 0x475569
        : biome === 'desert'
          ? 0x92400e
          : biome === 'neon'
            ? 0x1e1b4b
            : 0x78350f;

    const capColor =
      biome === 'winter'
        ? 0xf1f5f9
        : biome === 'desert'
          ? 0xd97706
          : biome === 'neon'
            ? 0x06b6d4
            : 0x451a03;

    const rockColor =
      biome === 'winter'
        ? 0x94a3b8
        : biome === 'desert'
          ? 0xb45309
          : biome === 'neon'
            ? 0x312e81
            : 0x64748b;

    const woodMat = new THREE.MeshLambertMaterial({ color: woodColor });
    const capMat = new THREE.MeshLambertMaterial({ color: capColor });
    const rockMat = new THREE.MeshLambertMaterial({ color: rockColor });

    // Mooring pylon (аккуратная деревянная причальная свая)
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.44, 0.28), woodMat);
    pylon.position.set(0, 0.16, -0.22);
    pylon.castShadow = true;
    pylon.receiveShadow = true;
    group.add(pylon);

    // Decorative top cap / iron ring
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.32), capMat);
    cap.position.set(0, 0.4, -0.22);
    cap.castShadow = true;
    group.add(cap);

    // Low riverbank boulder (аккуратный гладкий валун) beside the post
    const boulder = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.32), rockMat);
    const boulderOffsetX = side === 'left' ? 0.2 : -0.2;
    boulder.position.set(boulderOffsetX, 0.07, 0.2);
    boulder.castShadow = true;
    boulder.receiveShadow = true;
    group.add(boulder);

    // Subtle accent shard on the boulder
    const shard = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.16), capMat);
    shard.position.set(boulderOffsetX + (side === 'left' ? 0.03 : -0.03), 0.17, 0.22);
    group.add(shard);

    return group;
  }

  static createWaterfallEdge(side: 'left' | 'right', biome: BiomeType = 'forest'): THREE.Group {
    return MeshFactory.createRiverbankEdge(side, biome);
  }

  static createRoadMarkings(): THREE.Group {
    const group = new THREE.Group();
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });

    // Clean solid shoulder lines at boundary edges
    const solidEdgeGeo = new THREE.BoxGeometry(0.12, 0.02, 1.0);
    const leftSolid = new THREE.Mesh(solidEdgeGeo, whiteLineMat);
    leftSolid.position.set(worldToScreenX(-9.5), 0.015, 0);
    const rightSolid = new THREE.Mesh(solidEdgeGeo, whiteLineMat);
    rightSolid.position.set(worldToScreenX(9.5), 0.015, 0);
    group.add(leftSolid, rightSolid);

    return group;
  }

  static createLaneDivider(): THREE.Group {
    const group = new THREE.Group();
    const dividerMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const dashGeo = new THREE.BoxGeometry(0.65, 0.02, 0.08);

    for (let x = -8.5; x <= 8.5; x += 1.6) {
      const dash = new THREE.Mesh(dashGeo, dividerMat);
      dash.position.set(x, 0.015, 0.5);
      group.add(dash);
    }

    return group;
  }
}
