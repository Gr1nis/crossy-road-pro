import {
  checkVehicleCollision,
  findSupportingLog,
  isOutOfBoundsX,
  quantizeLandX,
} from './collision.ts';
import { LaneGenerator } from './laneGenerator.ts';
import { ScoreTracker } from './scoreTracker.ts';
import {
  DeathReason,
  LaneType,
  MoveDirection,
  WORLD_CONFIG,
  type Lane,
  type MoveDirectionValue,
  type PlayerState,
  type StorageAdapter,
} from './types.ts';

const WRAP_LIMIT = WORLD_CONFIG.WRAP_LIMIT;

export class GameEngine {
  private generator: LaneGenerator;
  private lanes = new Map<number, Lane>();
  private scoreTracker: ScoreTracker;
  private player: PlayerState;
  private cameraZ = -1.0;
  private inputQueue: MoveDirectionValue[] = [];

  constructor(seed: number = 42, storage?: StorageAdapter) {
    this.generator = new LaneGenerator(seed);
    this.scoreTracker = new ScoreTracker(storage);
    this.player = this.createInitialPlayer();
    this.ensureLanesAround(0);
  }

  private createInitialPlayer(): PlayerState {
    return {
      row: 0,
      x: 0,
      targetRow: 0,
      targetX: 0,
      startRow: 0,
      startX: 0,
      isHopping: false,
      hopProgress: 0,
      ridingLogId: null,
      isDead: false,
      deathReason: DeathReason.NONE,
      facing: MoveDirection.FORWARD,
    };
  }

  private ensureLanesAround(centerRow: number): void {
    for (let r = centerRow - 8; r <= centerRow + 28; r++) {
      if (!this.lanes.has(r)) {
        this.lanes.set(r, this.generator.generateLane(r));
      }
    }
  }

  getPlayer(): PlayerState {
    return this.player;
  }

  getLane(row: number): Lane {
    let lane = this.lanes.get(row);
    if (!lane) {
      lane = this.generator.generateLane(row);
      this.lanes.set(row, lane);
    }
    return lane;
  }

  getActiveLanes(): Lane[] {
    this.ensureLanesAround(Math.round(this.player.row));
    const list: Lane[] = [];
    const minRow = Math.floor(this.cameraZ) - 6;
    const maxRow = Math.floor(this.player.row) + 24;
    for (let r = minRow; r <= maxRow; r++) {
      list.push(this.getLane(r));
    }
    return list;
  }

  getCameraZ(): number {
    return this.cameraZ;
  }

  getScore(): number {
    return this.scoreTracker.getScore();
  }

  getHighScore(): number {
    return this.scoreTracker.getHighScore();
  }

  queueMove(dir: MoveDirectionValue): boolean {
    if (this.player.isDead) return false;
    if (this.inputQueue.length < 2) {
      this.inputQueue.push(dir);
    }
    if (!this.player.isHopping) {
      return this.tryStartNextHop();
    }
    return true;
  }

  private tryStartNextHop(): boolean {
    if (this.player.isDead || this.player.isHopping) {
      return false;
    }

    while (this.inputQueue.length > 0) {
      const dir = this.inputQueue.shift()!;
      this.player.facing = dir;

      let nextRow = Math.round(this.player.row);
      let nextX = this.player.x;

      if (dir === MoveDirection.FORWARD) nextRow += 1;
      else if (dir === MoveDirection.BACKWARD) nextRow -= 1;
      else if (dir === MoveDirection.LEFT) nextX -= 1;
      else if (dir === MoveDirection.RIGHT) nextX += 1;

      const destLane = this.getLane(nextRow);

      // Quantize X to integer grid whenever landing on non-RIVER lane (GRASS or ROAD)
      if (destLane.type !== LaneType.RIVER) {
        const quantized = Math.round(nextX);
        if (quantized < WORLD_CONFIG.MIN_X || quantized > WORLD_CONFIG.MAX_X) {
          continue; // Blocked by world boundary wall; try next queued command if any
        }
        nextX = quantizeLandX(nextX);
      }

      // Block movement into a static tree obstacle on GRASS
      if (destLane.type === LaneType.GRASS && destLane.obstacles.includes(Math.round(nextX))) {
        continue; // Blocked by tree; try next queued command if any
      }

      this.player.startRow = this.player.row;
      this.player.startX = this.player.x;
      this.player.targetRow = nextRow;
      this.player.targetX = nextX;
      this.player.isHopping = true;
      this.player.hopProgress = 0;

      // If jumping onto or along a RIVER lane, attach ridingLogId to the target log so drift continues mid-hop
      if (destLane.type === LaneType.RIVER) {
        const targetLog = findSupportingLog(nextX, destLane.logs);
        this.player.ridingLogId = targetLog ? targetLog.id : null;
      } else {
        this.player.ridingLogId = null;
      }
      return true;
    }

    return false;
  }

  step(dt: number): void {
    if (this.player.isDead || dt <= 0) return;

    const currentLane = this.getLane(Math.round(this.player.row));

    // 1. Update vehicles & logs across nearby lanes, and move player with log if riding
    const minSimRow = Math.floor(this.cameraZ) - 6;
    const maxSimRow = Math.floor(this.player.row) + 24;

    for (let r = minSimRow; r <= maxSimRow; r++) {
      const lane = this.getLane(r);

      for (const v of lane.vehicles) {
        v.x += v.speed * dt;
        if (v.speed > 0 && v.x > WRAP_LIMIT) v.x = -WRAP_LIMIT;
        else if (v.speed < 0 && v.x < -WRAP_LIMIT) v.x = WRAP_LIMIT;
      }

      for (const log of lane.logs) {
        const dx = log.speed * dt;
        log.x += dx;

        // If player is standing on or hopping onto/along this log, apply identical delta dx
        if (this.player.ridingLogId === log.id) {
          if (this.player.isHopping && lane.index === this.player.targetRow) {
            this.player.startX += dx;
            this.player.targetX += dx;
          } else if (!this.player.isHopping && lane.index === Math.round(this.player.row)) {
            this.player.x += dx;
            this.player.targetX = this.player.x;
          }
        }

        if (log.speed > 0 && log.x > WRAP_LIMIT) log.x = -WRAP_LIMIT;
        else if (log.speed < 0 && log.x < -WRAP_LIMIT) log.x = WRAP_LIMIT;
      }
    }

    // 2. Advance hop animation if hopping
    if (this.player.isHopping) {
      this.player.hopProgress += dt / WORLD_CONFIG.HOP_DURATION;
      if (this.player.hopProgress >= 1) {
        this.player.hopProgress = 0;
        this.player.isHopping = false;
        this.player.row = this.player.targetRow;
        this.player.x = this.player.targetX;

        this.ensureLanesAround(this.player.row);
        this.scoreTracker.updateRow(this.player.row);

        const landedLane = this.getLane(this.player.row);
        if (landedLane.type === LaneType.RIVER) {
          const support = findSupportingLog(this.player.x, landedLane.logs);
          if (support) {
            this.player.ridingLogId = support.id;
          } else {
            this.killPlayer(DeathReason.WATER);
            return;
          }
        } else {
          this.player.x = quantizeLandX(this.player.x);
          this.player.ridingLogId = null;
        }

        // Start buffered move if any
        if (this.inputQueue.length > 0) {
          this.tryStartNextHop();
        }
      } else {
        const t = this.player.hopProgress;
        this.player.row = this.player.startRow + (this.player.targetRow - this.player.startRow) * t;
        this.player.x = this.player.startX + (this.player.targetX - this.player.startX) * t;
      }
    } else if (currentLane.type === LaneType.RIVER) {
      // Ensure player is still supported by a log
      const support = findSupportingLog(this.player.x, currentLane.logs);
      if (!support) {
        this.killPlayer(DeathReason.WATER);
        return;
      }
      this.player.ridingLogId = support.id;
    }

    // 3. Check horizontal out-of-bounds (e.g. carried off-screen by a river log)
    if (isOutOfBoundsX(this.player.x)) {
      this.killPlayer(DeathReason.OUT_OF_BOUNDS);
      return;
    }

    // 4. Check ROAD vehicle collisions
    const activeRow = Math.round(this.player.row);
    const activeLane = this.getLane(activeRow);
    if (activeLane.type === LaneType.ROAD) {
      const hitCar = checkVehicleCollision(this.player.x, activeLane.vehicles);
      if (hitCar) {
        this.killPlayer(DeathReason.CAR);
        return;
      }
    }

    // 5. Update camera scrolling & check bottom camera frustum timeout
    const targetCamZ = this.player.row - 1.0;
    this.cameraZ += WORLD_CONFIG.BASE_CAMERA_SPEED * dt;
    if (targetCamZ > this.cameraZ) {
      this.cameraZ += (targetCamZ - this.cameraZ) * Math.min(1, dt * 8);
    }

    if (this.player.row < this.cameraZ - WORLD_CONFIG.CAMERA_BACK_LIMIT) {
      this.killPlayer(DeathReason.CAMERA_BEHIND);
      return;
    }
  }

  private killPlayer(reason: typeof DeathReason[keyof typeof DeathReason]): void {
    this.player.isDead = true;
    this.player.deathReason = reason;
    this.inputQueue = [];
  }

  reset(newSeed: number = Date.now()): void {
    this.generator = new LaneGenerator(newSeed);
    this.lanes.clear();
    this.scoreTracker.resetCurrentScore();
    this.player = this.createInitialPlayer();
    this.cameraZ = -1.0;
    this.inputQueue = [];
    this.ensureLanesAround(0);
  }
}
