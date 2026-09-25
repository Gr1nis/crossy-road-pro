import { PRNG } from './prng.ts';
import {
  LaneType,
  WORLD_CONFIG,
  type Lane,
  type LaneTypeValue,
  type LogPlatform,
  type ObstacleDetail,
  type ObstacleKind,
  type TrainState,
  type Vehicle,
} from './types.ts';

const VEHICLE_COLORS = [0xef4444, 0x3b82f6, 0xf59e0b, 0x10b981, 0xa855f7, 0xec4899];
const OBSTACLE_KINDS: ObstacleKind[] = ['tree', 'rock', 'bush'];

export class LaneGenerator {
  private readonly baseSeed: number;

  constructor(seed: number = 42) {
    this.baseSeed = seed >>> 0;
  }

  private rowPrng(index: number): PRNG {
    const hashed = (this.baseSeed ^ Math.imul(index + 10007, 0x9e3779b9)) >>> 0;
    return new PRNG(hashed);
  }

  private getSafeCorridorX(index: number): number {
    if (index <= 2) return 0;
    const rng = this.rowPrng(Math.floor(index / 2));
    return rng.nextInt(-5, 5);
  }

  generateLane(index: number): Lane {
    const rng = this.rowPrng(index);

    let type: LaneTypeValue = LaneType.GRASS;
    if (index > 2) {
      const roll = rng.next();
      if (roll < 0.36) {
        type = LaneType.GRASS;
      } else if (roll < 0.68) {
        type = LaneType.ROAD;
      } else if (roll < 0.88) {
        type = LaneType.RIVER;
      } else {
        type = LaneType.RAILWAY;
      }
    }

    const direction: 1 | -1 = index % 2 === 0 ? 1 : -1;
    const difficultyFactor = 1 + Math.min(Math.max(0, index) * 0.01, 1.1);
    const speed = rng.nextFloat(1.8, 3.4) * difficultyFactor * direction;

    const obstacles: number[] = [];
    const obstacleDetails: ObstacleDetail[] = [];
    const coins: number[] = [];
    const vehicles: Vehicle[] = [];
    const logs: LogPlatform[] = [];
    let train: TrainState | undefined;

    if (type === LaneType.GRASS) {
      const safeCurrent = this.getSafeCorridorX(index);
      const safePrev = this.getSafeCorridorX(index - 1);

      for (let x = WORLD_CONFIG.MIN_X; x <= WORLD_CONFIG.MAX_X; x++) {
        if (index <= 2 && Math.abs(x) <= 2) continue;
        if (x === safeCurrent || x === safePrev || x === 0) continue;

        const treeChance = index <= 0 ? 0.35 : 0.28;
        if (rng.next() < treeChance) {
          obstacles.push(x);
          const kind = OBSTACLE_KINDS[rng.nextInt(0, OBSTACLE_KINDS.length - 1)];
          obstacleDetails.push({ x, kind });
        }
      }
    } else if (type === LaneType.ROAD) {
      const isTruckLane = rng.next() < 0.32;
      const count = isTruckLane ? rng.nextInt(3, 4) : rng.nextInt(4, 6);
      const vehicleLen = isTruckLane ? 2.3 : 1.35;
      const ringSpan = WORLD_CONFIG.WRAP_LIMIT * 2;
      const spacing = ringSpan / count;

      for (let i = 0; i < count; i++) {
        const offset = -WORLD_CONFIG.WRAP_LIMIT + (i + 0.5) * spacing + rng.nextFloat(-0.8, 0.8);
        vehicles.push({
          id: index * 100 + i + 1,
          x: offset,
          length: vehicleLen,
          speed,
          type: isTruckLane ? 'truck' : 'car',
          color: VEHICLE_COLORS[rng.nextInt(0, VEHICLE_COLORS.length - 1)],
        });
      }
    } else if (type === LaneType.RIVER) {
      const logCount = 5;
      const logLen = rng.nextFloat(2.8, 3.8);
      const ringSpan = WORLD_CONFIG.WRAP_LIMIT * 2;
      const spacing = ringSpan / logCount;
      const riverSpeed = rng.nextFloat(1.3, 2.5) * difficultyFactor * direction;

      for (let i = 0; i < logCount; i++) {
        const offset = -WORLD_CONFIG.WRAP_LIMIT + (i + 0.5) * spacing + rng.nextFloat(-0.6, 0.6);
        logs.push({
          id: index * 100 + i + 1,
          x: offset,
          length: logLen,
          speed: riverSpeed,
        });
      }
    } else if (type === LaneType.RAILWAY) {
      const period = rng.nextFloat(5.0, 7.5);
      const trainSpeed = 32.0 * direction;
      train = {
        timer: rng.nextFloat(0, period * 0.7),
        period,
        warningDuration: 1.2,
        isWarning: false,
        isPassing: false,
        x: -direction * (WORLD_CONFIG.WRAP_LIMIT + 10),
        length: 14.0,
        speed: trainSpeed,
      };
    }

    // Spawn coins on unblocked tiles for rows > 0
    if (index > 0 && type !== LaneType.RIVER && rng.next() < 0.55) {
      const candidateX = rng.nextInt(-6, 6);
      if (!obstacles.includes(candidateX)) {
        coins.push(candidateX);
      }
    }

    return {
      index,
      type,
      obstacles,
      obstacleDetails,
      coins,
      vehicles,
      logs,
      train,
      direction,
      speed,
    };
  }

  generateRange(startIndex: number, endIndex: number): Lane[] {
    const result: Lane[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push(this.generateLane(i));
    }
    return result;
  }
}
