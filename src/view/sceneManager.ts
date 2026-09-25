import * as THREE from 'three';
import { worldToScreenX } from '../core/collision.ts';
import type { GameEngine } from '../core/gameEngine.ts';
import { LaneType, MoveDirection, type Lane } from '../core/types.ts';
import { MeshFactory } from './meshFactory.ts';

interface RenderedLane {
  group: THREE.Group;
  vehicleMeshes: Map<number, THREE.Object3D>;
  logMeshes: Map<number, THREE.Object3D>;
}

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private dirLight: THREE.DirectionalLight;
  private chicken: THREE.Group;
  private renderedLanes = new Map<number, RenderedLane>();

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

    const ambient = new THREE.AmbientLight(0xffffff, 0.68);
    this.scene.add(ambient);

    this.dirLight = new THREE.DirectionalLight(0xfffbeb, 1.1);
    this.dirLight.position.set(14, 24, -12);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 1;
    this.dirLight.shadow.camera.far = 60;
    const d = 18;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);
    this.scene.add(this.dirLight.target);

    this.chicken = MeshFactory.createChicken();
    this.scene.add(this.chicken);

    window.addEventListener('resize', () => this.onResize());
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

    let stripColor = 0x4ade80;
    let stripHeight = 0.24;

    if (lane.type === LaneType.GRASS) {
      stripColor = lane.index % 2 === 0 ? 0x4ade80 : 0x22c55e;
    } else if (lane.type === LaneType.ROAD) {
      stripColor = 0x334155;
      stripHeight = 0.16;
    } else if (lane.type === LaneType.RIVER) {
      stripColor = 0x0284c7;
      stripHeight = 0.08;
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
    }

    for (const treeX of lane.obstacles) {
      const tree = MeshFactory.createTree(lane.index * 31 + treeX);
      tree.position.x = worldToScreenX(treeX);
      group.add(tree);
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

    return { group, vehicleMeshes, logMeshes };
  }

  sync(engine: GameEngine): void {
    const activeLanes = engine.getActiveLanes();
    const activeIndices = new Set<number>();

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
        if (m) m.position.x = worldToScreenX(log.x);
      }
    }

    // Prune old lanes outside camera frustum
    for (const [idx, rendered] of this.renderedLanes.entries()) {
      if (!activeIndices.has(idx)) {
        this.scene.remove(rendered.group);
        this.renderedLanes.delete(idx);
      }
    }

    // Update chicken transform & hop parabola
    const p = engine.getPlayer();
    const hopHeight = p.isHopping ? 4 * 0.75 * p.hopProgress * (1 - p.hopProgress) : 0;
    const baseOffsetY = p.ridingLogId !== null ? 0.12 : 0;

    // Unified coordinate mapping: all entities use worldToScreenX(x) = -x
    this.chicken.position.set(worldToScreenX(p.x), baseOffsetY + hopHeight, p.row);

    if (p.facing === MoveDirection.FORWARD) this.chicken.rotation.y = 0;
    else if (p.facing === MoveDirection.BACKWARD) this.chicken.rotation.y = Math.PI;
    else if (p.facing === MoveDirection.LEFT) this.chicken.rotation.y = Math.PI / 2;
    else if (p.facing === MoveDirection.RIGHT) this.chicken.rotation.y = -Math.PI / 2;

    if (p.isDead) {
      if (p.deathReason === 'CAR') {
        this.chicken.scale.set(1.4, 0.15, 1.4);
      } else if (p.deathReason === 'WATER') {
        this.chicken.position.y = -0.5;
      }
    } else {
      const stretch = p.isHopping ? 1 + Math.sin(p.hopProgress * Math.PI) * 0.22 : 1;
      this.chicken.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
    }

    // Update isometric camera & shadow light tracking
    const camZ = engine.getCameraZ();
    this.camera.position.set(-7.5, 12.5, camZ - 7.5);
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
