import * as THREE from 'three';
import { worldToScreenX } from '../core/collision.ts';
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

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private dirLight: THREE.DirectionalLight;
  private playerMesh: THREE.Group;
  private ghostMesh: THREE.Group;
  private currentSkin: SkinId = 'chicken';
  private renderedLanes = new Map<number, RenderedLane>();
  private shakeIntensity = 0;

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
    this.ghostMesh = MeshFactory.createCharacter('chicken', true);
    this.ghostMesh.visible = false;
    this.scene.add(this.playerMesh, this.ghostMesh);

    window.addEventListener('resize', () => this.onResize());
  }

  triggerShake(intensity: number = 0.45): void {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
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

    let stripColor = isSnow ? 0xe2e8f0 : lane.index % 2 === 0 ? 0x4ade80 : 0x22c55e;
    let stripHeight = 0.24;

    if (lane.type === LaneType.ROAD) {
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
      const dashGeo = new THREE.BoxGeometry(0.6, 0.02, 0.08);
      const dashMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
      for (let x = -20; x <= 20; x += 2) {
        const dash = new THREE.Mesh(dashGeo, dashMat);
        dash.position.set(worldToScreenX(x), 0.01, 0);
        group.add(dash);
      }
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

  sync(engine: GameEngine): void {
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

    const bestRow = engine.getBestRow();
    if (bestRow > 0) {
      this.ghostMesh.visible = true;
      this.ghostMesh.position.set(worldToScreenX(0), 0.05, bestRow);
    } else {
      this.ghostMesh.visible = false;
    }

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
  }
}
