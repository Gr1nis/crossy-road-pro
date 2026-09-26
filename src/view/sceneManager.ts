import * as THREE from 'three';
import { vehicleScreenRotationY, worldToScreenX } from '../core/collision.ts';
import type { GameEngine } from '../core/gameEngine.ts';
import { LaneType, MoveDirection, type Lane, type SkinId } from '../core/types.ts';
import { MeshFactory } from './meshFactory.ts';

interface RenderedLane {
  group: THREE.Group;
  vehicleMeshes: Map<number, THREE.Object3D>;
  logMeshes: Map<number, THREE.Object3D>;
  coinMeshes: Map<number, THREE.Object3D>;
  trainMesh?: THREE.Object3D;
  signalLight?: THREE.Mesh;
}

interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private dirLight: THREE.DirectionalLight;
  private playerMesh: THREE.Group;
  private currentSkin: SkinId = 'chicken';
  private renderedLanes = new Map<number, RenderedLane>();
  private shakeIntensity = 0;
  private particles: Particle[] = [];
  private lastHoppingState = false;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = 11;
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

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.68));

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
        p.mesh.geometry.dispose();
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

  private onResize(): void {
    const aspect = window.innerWidth / window.innerHeight;
    const viewSize = 11;
    this.camera.left = -viewSize * aspect;
    this.camera.right = viewSize * aspect;
    this.camera.top = viewSize;
    this.camera.bottom = -viewSize;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private buildLaneGroup(lane: Lane): RenderedLane {
    const group = new THREE.Group();
    group.position.z = lane.index;

    const vehicleMeshes = new Map<number, THREE.Object3D>();
    const logMeshes = new Map<number, THREE.Object3D>();
    const coinMeshes = new Map<number, THREE.Object3D>();
    const isSnow = Math.floor(Math.max(0, lane.index) / 35) % 3 === 2;

    let stripColor = isSnow ? 0xf1f5f9 : 0x4ade80;
    let stripHeight = 0.24;

    if (lane.type === LaneType.GRASS) {
      if (isSnow) {
        stripColor = lane.index % 2 === 0 ? 0xf8fafc : 0xe2e8f0;
      } else {
        stripColor = lane.index % 2 === 0 ? 0x4ade80 : 0x22c55e;
      }
    } else if (lane.type === LaneType.ROAD) {
      stripColor = 0x334155;
      stripHeight = 0.16;
    } else if (lane.type === LaneType.RIVER) {
      stripColor = 0x0284c7;
      stripHeight = 0.08;
    } else if (lane.type === LaneType.RAILWAY) {
      stripColor = 0x475569;
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
    } else if (lane.type === LaneType.RIVER) {
      // Cascading waterfalls at the left and right borders of the river
      const leftWaterfall = MeshFactory.createWaterfallEdge('left');
      leftWaterfall.position.set(worldToScreenX(-10.2), 0, 0);
      const rightWaterfall = MeshFactory.createWaterfallEdge('right');
      rightWaterfall.position.set(worldToScreenX(10.2), 0, 0);
      group.add(leftWaterfall, rightWaterfall);
    } else if (lane.type === LaneType.RAILWAY) {
      const railMat = new THREE.MeshLambertMaterial({ color: 0xcbd5e1 });
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
      const mesh = MeshFactory.createObstacle(item.kind, lane.index * 31 + treeX, isSnow);
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

    return { group, vehicleMeshes, logMeshes, coinMeshes, trainMesh, signalLight };
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
    const biomePhase = Math.floor(Math.max(0, p.row) / 35) % 3;
    const skyHex = biomePhase === 1 ? 0x1e1b4b : biomePhase === 2 ? 0xcbd5e1 : 0x87ceeb;
    (this.scene.background as THREE.Color).setHex(skyHex);

    const activeLanes = engine.getActiveLanes();
    const activeIndices = new Set<number>();
    const nowSec = performance.now() * 0.004;

    for (const lane of activeLanes) {
      activeIndices.add(lane.index);
      let rendered = this.renderedLanes.get(lane.index);
      if (!rendered) {
        rendered = this.buildLaneGroup(lane);
        this.scene.add(rendered.group);
        this.renderedLanes.set(lane.index, rendered);
      }

      for (const v of lane.vehicles) {
        const m = rendered.vehicleMeshes.get(v.id);
        if (m) m.position.x = worldToScreenX(v.x);
      }

      for (const log of lane.logs) {
        const m = rendered.logMeshes.get(log.id);
        if (m) {
          m.position.x = worldToScreenX(log.x);
          m.position.y = p.ridingLogId === log.id ? -0.06 : 0;
        }
      }

      for (const [cx, coinMesh] of rendered.coinMeshes.entries()) {
        if (!lane.coins?.includes(cx)) {
          rendered.group.remove(coinMesh);
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
        this.renderedLanes.delete(idx);
      }
    }

    // Landing detection for surface puff particles
    if (this.lastHoppingState && !p.isHopping && !p.isDead) {
      const landedLane = engine.getLane(p.row);
      const isSnow = Math.floor(Math.max(0, p.row) / 35) % 3 === 2;
      let puffColor = 0xffffff;
      if (landedLane.type === LaneType.GRASS) {
        puffColor = isSnow ? 0xffffff : 0x86efac;
      } else if (landedLane.type === LaneType.ROAD) {
        puffColor = 0x94a3b8;
      } else if (landedLane.type === LaneType.RIVER) {
        puffColor = 0xfde047; // Wood bark flakes on log
      } else if (landedLane.type === LaneType.RAILWAY) {
        puffColor = 0xd1d5db;
      }
      this.spawnHopPuff(p.x, 0.05, p.row, puffColor, 5);
    }
    this.lastHoppingState = p.isHopping;

    const hopHeight = p.isHopping ? 4 * 0.75 * p.hopProgress * (1 - p.hopProgress) : 0;
    const baseOffsetY = p.ridingLogId !== null ? 0.08 : 0;
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

    this.updateParticles(dt);

    const camZ = engine.getCameraZ();
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
    }
    this.renderedLanes.clear();

    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
    }
    this.particles = [];
  }
}
