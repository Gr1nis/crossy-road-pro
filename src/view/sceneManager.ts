import * as THREE from 'three';
import { vehicleScreenRotationY, worldToScreenX } from '../core/collision.ts';
import type { GameEngine } from '../core/gameEngine.ts';
import { Biome, LaneType, MoveDirection, type BiomeType, type Lane, type SkinId } from '../core/types.ts';
import { MeshFactory } from './meshFactory.ts';

interface RenderedLane {
  group: THREE.Group;
  vehicleMeshes: Map<number, THREE.Object3D>;
  logMeshes: Map<number, THREE.Object3D>;
  coinMeshes: Map<number, THREE.Object3D>;
  trainMesh?: THREE.Object3D;
  signalLight?: THREE.Mesh;
  waterRipples?: THREE.Mesh[];
}

interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

interface AmbientParticle {
  mesh: THREE.Mesh;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  phase: number;
  speedY: number;
  swayAmp: number;
}

interface LogImpact {
  age: number;
  tiltDir: number;
}

const BIOME_ATMOSPHERES: Record<
  BiomeType,
  {
    sky: number;
    fogColor: number;
    fogDensity: number;
    ambientColor: number;
    ambientIntensity: number;
    dirColor: number;
    dirIntensity: number;
    particleColor: number;
  }
> = {
  [Biome.FOREST]: {
    sky: 0x87ceeb,
    fogColor: 0x87ceeb,
    fogDensity: 0.012,
    ambientColor: 0xffffff,
    ambientIntensity: 0.68,
    dirColor: 0xfffbeb,
    dirIntensity: 1.1,
    particleColor: 0xbef264,
  },
  [Biome.WINTER]: {
    sky: 0xcbd5e1,
    fogColor: 0xdbeafe,
    fogDensity: 0.018,
    ambientColor: 0xe0f2fe,
    ambientIntensity: 0.78,
    dirColor: 0xf8fafc,
    dirIntensity: 0.95,
    particleColor: 0xffffff,
  },
  [Biome.DESERT]: {
    sky: 0xfde68a,
    fogColor: 0xfcd34d,
    fogDensity: 0.015,
    ambientColor: 0xffedd5,
    ambientIntensity: 0.75,
    dirColor: 0xfef08a,
    dirIntensity: 1.22,
    particleColor: 0xfbbf24,
  },
  [Biome.NEON]: {
    sky: 0x0f172a,
    fogColor: 0x1e1b4b,
    fogDensity: 0.016,
    ambientColor: 0x818cf8,
    ambientIntensity: 0.58,
    dirColor: 0x38bdf8,
    dirIntensity: 0.92,
    particleColor: 0x22d3ee,
  },
};

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private ambientLight: THREE.AmbientLight;
  private dirLight: THREE.DirectionalLight;
  private fog: THREE.FogExp2;
  private playerMesh: THREE.Group;
  private currentSkin: SkinId = 'chicken';
  private renderedLanes = new Map<number, RenderedLane>();
  private shakeIntensity = 0;
  private particles: Particle[] = [];
  private ambientParticles: AmbientParticle[] = [];
  private logImpacts = new Map<number, LogImpact>();
  private prevRidingLogId: number | null = null;
  private lastHoppingState = false;
  private cachedSkyColor = new THREE.Color();
  private cachedFogColor = new THREE.Color();
  private cachedAmbientColor = new THREE.Color();
  private cachedDirColor = new THREE.Color();

  private disposeHierarchy(obj: THREE.Object3D): void {
    obj.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            for (const mat of mesh.material) mat.dispose();
          } else {
            mesh.material.dispose();
          }
        }
      }
    });
  }

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.fog = new THREE.FogExp2(0x87ceeb, 0.012);
    this.scene.fog = this.fog;

    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = Math.max(11, 10.5 / aspect);
    this.camera = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      -30,
      80
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.68);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfffbeb, 1.1);
    this.dirLight.position.set(14, 24, -12);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.set(2048, 2048);
    const d = 18;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight, this.dirLight.target);

    this.playerMesh = MeshFactory.createCharacter('chicken');
    this.scene.add(this.playerMesh);
    this.initAmbientParticles(32);

    window.addEventListener('resize', () => this.onResize());
  }

  triggerShake(intensity: number = 0.45): void {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  spawnHopPuff(x: number, y: number, z: number, color: number, count: number = 6): void {
    const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const mat = new THREE.MeshLambertMaterial({ color });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        worldToScreenX(x) + (Math.random() - 0.5) * 0.35,
        y + 0.05,
        z + (Math.random() - 0.5) * 0.35
      );
      this.scene.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 1.5;
      this.particles.push({
        mesh,
        vx: Math.cos(angle) * speed,
        vy: 1.2 + Math.random() * 2.0,
        vz: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.2,
      });
    }
  }

  spawnDeathFeathers(x: number, y: number, z: number, reason: string): void {
    const isWater = reason === 'WATER';
    const isTrain = reason === 'TRAIN';
    const count = isTrain ? 28 : isWater ? 18 : 20;
    const colors = isWater
      ? [0x38bdf8, 0x0284c7, 0xffffff]
      : [0xffffff, 0xf97316, 0xef4444, 0xfacc15];

    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = isWater ? 0.09 + Math.random() * 0.06 : 0.12 + Math.random() * 0.1;
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshLambertMaterial({ color: c });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        worldToScreenX(x) + (Math.random() - 0.5) * 0.4,
        y + 0.2,
        z + (Math.random() - 0.5) * 0.4
      );
      this.scene.add(mesh);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      const spd = isTrain ? 4.5 + Math.random() * 5.0 : 2.5 + Math.random() * 3.5;

      this.particles.push({
        mesh,
        vx: Math.cos(theta) * Math.sin(phi) * spd,
        vy: Math.cos(phi) * spd + 1.5,
        vz: Math.sin(theta) * Math.sin(phi) * spd,
        life: 0,
        maxLife: 0.55 + Math.random() * 0.35,
      });
    }
  }

  private updateParticles(dt: number): void {
    const gravity = -14.0;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.scene.remove(p.mesh);
        this.disposeHierarchy(p.mesh);
        this.particles.splice(i, 1);
        continue;
      }

      p.vy += gravity * dt;
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;

      const progress = p.life / p.maxLife;
      const scale = Math.max(0.01, 1 - progress);
      p.mesh.scale.set(scale, scale, scale);
    }
  }

  private initAmbientParticles(count: number): void {
    const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xbef264,
        transparent: true,
        opacity: 0.8,
      });
      const mesh = new THREE.Mesh(geo, mat);
      this.scene.add(mesh);
      this.ambientParticles.push({
        mesh,
        offsetX: (Math.random() - 0.5) * 26,
        offsetY: 0.4 + Math.random() * 5.5,
        offsetZ: (Math.random() - 0.5) * 24,
        phase: Math.random() * Math.PI * 2,
        speedY: 0.6 + Math.random() * 1.2,
        swayAmp: 0.4 + Math.random() * 0.8,
      });
    }
  }

  private updateAmbientParticles(dt: number, biome: BiomeType, camZ: number, nowSec: number): void {
    const preset = BIOME_ATMOSPHERES[biome] ?? BIOME_ATMOSPHERES[Biome.FOREST];
    for (const ap of this.ambientParticles) {
      const mat = ap.mesh.material as THREE.MeshBasicMaterial;
      mat.color.setHex(preset.particleColor);

      if (biome === Biome.WINTER) {
        // Falling snow with horizontal wind drift
        ap.offsetY -= ap.speedY * 1.6 * dt;
        if (ap.offsetY < 0.1) ap.offsetY = 6.0;
        const swayX = Math.sin(nowSec * 0.6 + ap.phase) * ap.swayAmp;
        ap.mesh.position.set(ap.offsetX + swayX, ap.offsetY, camZ + 4 + ap.offsetZ);
        ap.mesh.scale.setScalar(0.95);
        mat.opacity = 0.85;
      } else if (biome === Biome.NEON) {
        // Rising digital neon sparks
        ap.offsetY += ap.speedY * 1.2 * dt;
        if (ap.offsetY > 6.0) ap.offsetY = 0.2;
        ap.mesh.position.set(
          ap.offsetX + Math.cos(nowSec * 0.8 + ap.phase) * 0.3,
          ap.offsetY,
          camZ + 4 + ap.offsetZ
        );
        const pulse = 0.6 + 0.4 * Math.sin(nowSec * 2.5 + ap.phase);
        ap.mesh.scale.setScalar(pulse);
        mat.opacity = 0.75;
      } else {
        // Floating fireflies (forest) or warm sand motes (desert)
        const bobY = Math.sin(nowSec * 0.9 + ap.phase) * 0.55;
        const swayX = Math.cos(nowSec * 0.5 + ap.phase) * ap.swayAmp;
        ap.mesh.position.set(
          ap.offsetX + swayX,
          Math.max(0.25, (ap.offsetY % 3.2) + 0.5 + bobY),
          camZ + 4 + ap.offsetZ
        );
        const glow = 0.55 + 0.45 * Math.sin(nowSec * 2.0 + ap.phase);
        ap.mesh.scale.setScalar(glow);
        mat.opacity = 0.45 + glow * 0.45;
      }
    }
  }

  private onResize(): void {
    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = Math.max(11, 10.5 / aspect);
    this.camera.left = -viewSize * aspect;
    this.camera.right = viewSize * aspect;
    this.camera.top = viewSize;
    this.camera.bottom = -viewSize;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private buildLaneGroup(lane: Lane, hasNextRoad: boolean = false): RenderedLane {
    const group = new THREE.Group();
    group.position.z = lane.index;

    const vehicleMeshes = new Map<number, THREE.Object3D>();
    const logMeshes = new Map<number, THREE.Object3D>();
    const coinMeshes = new Map<number, THREE.Object3D>();
    const waterRipples: THREE.Mesh[] = [];
    const biome: BiomeType = lane.biome ?? Biome.FOREST;
    const isEven = lane.index % 2 === 0;

    let stripColor = 0x4ade80;
    let stripHeight = 0.24;

    if (lane.type === LaneType.GRASS) {
      if (biome === Biome.WINTER) {
        stripColor = isEven ? 0xf8fafc : 0xe2e8f0;
      } else if (biome === Biome.DESERT) {
        stripColor = isEven ? 0xfde68a : 0xfcd34d;
      } else if (biome === Biome.NEON) {
        stripColor = isEven ? 0x1e1b4b : 0x311042;
      } else {
        stripColor = isEven ? 0x4ade80 : 0x22c55e;
      }
    } else if (lane.type === LaneType.ROAD) {
      stripColor = biome === Biome.NEON ? 0x0f172a : biome === Biome.DESERT ? 0x57534e : 0x334155;
      stripHeight = 0.16;
    } else if (lane.type === LaneType.RIVER) {
      stripColor =
        biome === Biome.NEON ? 0x4338ca : biome === Biome.WINTER ? 0x0369a1 : biome === Biome.DESERT ? 0x0d9488 : 0x0284c7;
      stripHeight = 0.08;
    } else if (lane.type === LaneType.RAILWAY) {
      stripColor = biome === Biome.NEON ? 0x1e293b : 0x475569;
      stripHeight = 0.2;
    }

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(48, stripHeight, 1),
      new THREE.MeshLambertMaterial({ color: stripColor })
    );
    ground.position.y = -stripHeight / 2;
    ground.receiveShadow = true;
    group.add(ground);

    if (lane.type === LaneType.ROAD) {
      const roadMarkings = MeshFactory.createRoadMarkings();
      group.add(roadMarkings);
      if (hasNextRoad) {
        group.add(MeshFactory.createLaneDivider());
      }
    } else if (lane.type === LaneType.RIVER) {
      // Animated current foam ripples across river surface
      const rippleMat = new THREE.MeshBasicMaterial({
        color: biome === Biome.NEON ? 0x22d3ee : 0xbae6fd,
        transparent: true,
        opacity: 0.55,
      });
      for (let rx = -14; rx <= 14; rx += 4.5) {
        const ripple = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.12), rippleMat);
        ripple.position.set(rx, 0.01, (rx % 2 === 0 ? 1 : -1) * 0.24);
        group.add(ripple);
        waterRipples.push(ripple);
      }

      // Clean low riverbank posts & boulders at border edges (no waterfalls, no z-fighting)
      const leftBank = MeshFactory.createRiverbankEdge('left', biome);
      leftBank.position.set(worldToScreenX(-10.2), 0, 0);
      const rightBank = MeshFactory.createRiverbankEdge('right', biome);
      rightBank.position.set(worldToScreenX(10.2), 0, 0);
      group.add(leftBank, rightBank);
    } else if (lane.type === LaneType.RAILWAY) {
      const railMat = new THREE.MeshLambertMaterial({ color: biome === Biome.NEON ? 0x38bdf8 : 0xcbd5e1 });
      const r1 = new THREE.Mesh(new THREE.BoxGeometry(48, 0.06, 0.08), railMat);
      r1.position.set(0, 0.03, -0.26);
      const r2 = new THREE.Mesh(new THREE.BoxGeometry(48, 0.06, 0.08), railMat);
      r2.position.set(0, 0.03, 0.26);
      group.add(r1, r2);
    }

    const details = lane.obstacleDetails?.length
      ? lane.obstacleDetails
      : lane.obstacles.map((x) => ({ x, kind: 'tree' as const }));

    for (const item of details) {
      const treeX = item.x;
      const mesh = MeshFactory.createObstacle(item.kind, lane.index * 31 + treeX, biome);
      mesh.position.x = worldToScreenX(treeX);
      group.add(mesh);
    }

    for (const coinX of lane.coins ?? []) {
      const coin = MeshFactory.createCoin();
      coin.position.x = worldToScreenX(coinX);
      group.add(coin);
      coinMeshes.set(coinX, coin);
    }

    for (const v of lane.vehicles) {
      const mesh = MeshFactory.createVehicle(v);
      mesh.position.x = worldToScreenX(v.x);
      group.add(mesh);
      vehicleMeshes.set(v.id, mesh);
    }

    for (const log of lane.logs) {
      const mesh = MeshFactory.createLog(log);
      mesh.position.x = worldToScreenX(log.x);
      group.add(mesh);
      logMeshes.set(log.id, mesh);
    }

    let trainMesh: THREE.Object3D | undefined;
    let signalLight: THREE.Mesh | undefined;
    if (lane.type === LaneType.RAILWAY && lane.train) {
      const sig = MeshFactory.createRailwaySignal();
      sig.group.position.set(worldToScreenX(-2.5), 0, -0.38);
      group.add(sig.group);
      signalLight = sig.lightMesh;

      trainMesh = MeshFactory.createTrain(lane.train.length, lane.train.speed);
      trainMesh.position.x = worldToScreenX(lane.train.x);
      trainMesh.visible = lane.train.isPassing;
      group.add(trainMesh);
    }

    return {
      group,
      vehicleMeshes,
      logMeshes,
      coinMeshes,
      trainMesh,
      signalLight,
      waterRipples,
    };
  }

  sync(engine: GameEngine, dt: number = 0.016): void {
    const selectedSkin = engine.getSelectedSkin();
    if (selectedSkin !== this.currentSkin) {
      this.currentSkin = selectedSkin;
      this.scene.remove(this.playerMesh);
      this.playerMesh = MeshFactory.createCharacter(selectedSkin);
      this.scene.add(this.playerMesh);
    }

    const p = engine.getPlayer();
    const currentBiome: BiomeType = engine.getBiome();
    const targetAtmos = BIOME_ATMOSPHERES[currentBiome] ?? BIOME_ATMOSPHERES[Biome.FOREST];
    const lerpFactor = Math.min(1, 1 - Math.exp(-dt * 3.2));

    this.cachedSkyColor.setHex(targetAtmos.sky);
    (this.scene.background as THREE.Color).lerp(this.cachedSkyColor, lerpFactor);
    this.cachedFogColor.setHex(targetAtmos.fogColor);
    this.fog.color.lerp(this.cachedFogColor, lerpFactor);
    this.fog.density += (targetAtmos.fogDensity - this.fog.density) * lerpFactor;
    this.cachedAmbientColor.setHex(targetAtmos.ambientColor);
    this.ambientLight.color.lerp(this.cachedAmbientColor, lerpFactor);
    this.ambientLight.intensity += (targetAtmos.ambientIntensity - this.ambientLight.intensity) * lerpFactor;
    this.cachedDirColor.setHex(targetAtmos.dirColor);
    this.dirLight.color.lerp(this.cachedDirColor, lerpFactor);
    this.dirLight.intensity += (targetAtmos.dirIntensity - this.dirLight.intensity) * lerpFactor;

    const activeLanes = engine.getActiveLanes();
    const activeIndices = new Set<number>();
    const nowSec = performance.now() * 0.004;

    // Update log landing impact timers
    for (const [logId, impact] of this.logImpacts.entries()) {
      impact.age += dt;
      if (impact.age > 1.2) {
        this.logImpacts.delete(logId);
      }
    }

    for (const lane of activeLanes) {
      activeIndices.add(lane.index);
      let rendered = this.renderedLanes.get(lane.index);
      if (!rendered) {
        const nextLane = engine.getLane(lane.index + 1);
        const hasNextRoad = nextLane?.type === LaneType.ROAD;
        rendered = this.buildLaneGroup(lane, hasNextRoad);
        this.scene.add(rendered.group);
        this.renderedLanes.set(lane.index, rendered);
      }

      for (const v of lane.vehicles) {
        const m = rendered.vehicleMeshes.get(v.id);
        if (m) m.position.x = worldToScreenX(v.x);
      }

      if (rendered.waterRipples) {
        const flowDir = -lane.direction;
        for (let i = 0; i < rendered.waterRipples.length; i++) {
          const rp = rendered.waterRipples[i];
          rp.position.x += flowDir * Math.abs(lane.speed) * 0.85 * dt;
          if (rp.position.x > 15) rp.position.x = -15;
          else if (rp.position.x < -15) rp.position.x = 15;
          rp.scale.x = 0.85 + 0.3 * Math.sin(nowSec * 1.8 + i);
        }
      }

      for (const log of lane.logs) {
        const m = rendered.logMeshes.get(log.id);
        if (m) {
          m.position.x = worldToScreenX(log.x);
          const waveBob = Math.sin(nowSec * 0.9 + log.id * 0.7) * 0.024;
          const isRidden = p.ridingLogId === log.id;
          const impact = this.logImpacts.get(log.id);
          let impactDip = 0;
          let impactRoll = Math.sin(nowSec * 0.7 + log.id) * 0.02;
          let impactPitch = 0;
          if (impact) {
            const decay = Math.exp(-impact.age * 6.0);
            impactDip = -0.14 * decay * Math.cos(impact.age * 18.0);
            impactRoll += impact.tiltDir * 0.14 * decay * Math.sin(impact.age * 16.0);
            impactPitch = 0.11 * decay * Math.sin(impact.age * 14.0);
          }
          m.position.y = (isRidden ? -0.06 : 0) + waveBob + impactDip;
          m.rotation.z = impactRoll;
          m.rotation.x = impactPitch;
        }
      }

      for (const [cx, coinMesh] of rendered.coinMeshes.entries()) {
        if (!lane.coins?.includes(cx)) {
          rendered.group.remove(coinMesh);
          this.disposeHierarchy(coinMesh);
          rendered.coinMeshes.delete(cx);
        } else {
          coinMesh.rotation.y = nowSec;
        }
      }

      if (lane.train && rendered.trainMesh && rendered.signalLight) {
        rendered.trainMesh.visible = lane.train.isPassing;
        rendered.trainMesh.position.x = worldToScreenX(lane.train.x);
        const blink = lane.train.isWarning && Math.floor(performance.now() / 120) % 2 === 0;
        (rendered.signalLight.material as THREE.MeshBasicMaterial).color.setHex(
          blink ? 0xef4444 : 0x334155
        );
      }
    }

    for (const [idx, rendered] of this.renderedLanes.entries()) {
      if (!activeIndices.has(idx)) {
        this.scene.remove(rendered.group);
        this.disposeHierarchy(rendered.group);
        this.renderedLanes.delete(idx);
      }
    }

    // Landing detection for surface puff particles & log landing impact wobble
    if (this.lastHoppingState && !p.isHopping && !p.isDead) {
      const landedLane = engine.getLane(p.row);
      const laneBiome = landedLane.biome ?? currentBiome;
      let puffColor = 0xffffff;
      if (landedLane.type === LaneType.GRASS) {
        puffColor =
          laneBiome === Biome.WINTER
            ? 0xffffff
            : laneBiome === Biome.DESERT
              ? 0xfde68a
              : laneBiome === Biome.NEON
                ? 0x22d3ee
                : 0x86efac;
      } else if (landedLane.type === LaneType.ROAD) {
        puffColor = 0x94a3b8;
      } else if (landedLane.type === LaneType.RIVER) {
        puffColor = 0x38bdf8;
        if (p.ridingLogId !== null) {
          const logObj = landedLane.logs.find((l) => l.id === p.ridingLogId);
          const relOffset = logObj ? Math.max(-1, Math.min(1, (p.x - logObj.x) / (logObj.length * 0.5))) : 0;
          this.logImpacts.set(p.ridingLogId, { age: 0, tiltDir: relOffset || 0.5 });
        }
      } else if (landedLane.type === LaneType.RAILWAY) {
        puffColor = 0xd1d5db;
      }
      this.spawnHopPuff(p.x, 0.05, p.row, puffColor, 6);
    }
    this.lastHoppingState = p.isHopping;
    this.prevRidingLogId = p.ridingLogId;

    const hopHeight = p.isHopping ? 4 * 0.75 * p.hopProgress * (1 - p.hopProgress) : 0;
    const activeImpact = p.ridingLogId !== null ? this.logImpacts.get(p.ridingLogId) : undefined;
    const logSpringY = activeImpact
      ? -0.1 * Math.exp(-activeImpact.age * 6.0) * Math.cos(activeImpact.age * 18.0)
      : 0;
    const baseOffsetY = (p.ridingLogId !== null ? 0.08 : 0) + logSpringY;
    this.playerMesh.position.set(worldToScreenX(p.x), baseOffsetY + hopHeight, p.row);

    if (p.facing === MoveDirection.FORWARD) this.playerMesh.rotation.y = 0;
    else if (p.facing === MoveDirection.BACKWARD) this.playerMesh.rotation.y = Math.PI;
    else if (p.facing === MoveDirection.LEFT) this.playerMesh.rotation.y = Math.PI / 2;
    else if (p.facing === MoveDirection.RIGHT) this.playerMesh.rotation.y = -Math.PI / 2;

    if (p.isDead) {
      if (p.deathReason === 'CAR' || p.deathReason === 'TRAIN') {
        this.playerMesh.scale.set(1.4, 0.15, 1.4);
      } else if (p.deathReason === 'WATER') {
        this.playerMesh.position.y = -0.5;
      }
    } else {
      const stretch = p.isHopping ? 1 + Math.sin(p.hopProgress * Math.PI) * 0.22 : 1;
      this.playerMesh.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
    }

    const camZ = engine.getCameraZ();
    this.updateParticles(dt);
    this.updateAmbientParticles(dt, currentBiome, camZ, nowSec);

    let shakeX = 0;
    let shakeZ = 0;
    if (this.shakeIntensity > 0.01) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      shakeZ = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= 0.85;
    } else {
      this.shakeIntensity = 0;
    }

    this.camera.position.set(-7.5 + shakeX, 12.5, camZ - 7.5 + shakeZ);
    this.camera.lookAt(0, 0, camZ + 2.5);
    this.dirLight.position.set(-12, 22, camZ - 6);
    this.dirLight.target.position.set(0, 0, camZ + 3);
    this.renderer.render(this.scene, this.camera);
  }

  clearAll(): void {
    for (const rendered of this.renderedLanes.values()) {
      this.scene.remove(rendered.group);
      this.disposeHierarchy(rendered.group);
    }
    this.renderedLanes.clear();
    this.logImpacts.clear();

    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      this.disposeHierarchy(p.mesh);
    }
    this.particles = [];
  }
}
