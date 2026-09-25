import { PRNG } from './prng.ts';
import {
  LaneType,
  WORLD_CONFIG,
  type Lane,
  type LaneTypeValue,
  type LogPlatform,
  type Vehicle,
} from './types.ts';

const VEHICLE_COLORS = [0xef4444, 0x3b82f6, 0xf59e0b, 0x10b981, 0xa855f7, 0xec4899];

export class LaneGenerator {
  private readonly baseSeed: number;
  private nextEntityId = 1;

  constructor(seed: number = 42) {
    this.baseSeed = seed >>> 0;
  }

  private rowPrng(index: number): PRNG {
    const hashed = (this.baseSeed ^ Math.imul(index + 10007, 0x9e3779b9)) >>> 0;
    return new PRNG(hashed);
  }

  /**
   * Computes a deterministic safe corridor column X for a given row so that
   * adjacent GRASS lanes always share at least 2 unblocked columns.
   */
  private getSafeCorridorX(index: number): number {
    if (index <= 2) return 0;
    const rng = this.rowPrng(Math.floor(index / 2));
    return rng.nextInt(-5, 5);
  }

  generateLane(index: number): Lane {
    const rng = this.rowPrng(index);

    // Safe Spawn Zone: rows -3..2 are always GRASS
    let type: LaneTypeValue = LaneType.GRASS;
    if (index > 2) {
      const roll = rng.next();
      if (roll < 0.38) {
        type = LaneType.GRASS;
      } else if (roll < 0.75) {
        type = LaneType.ROAD;
      } else {
        type = LaneType.RIVER;
      }
    }

    // Alternating direction for consecutive lanes (especially critical for RIVER)
    const direction: 1 | -1 = index % 2 === 0 ? 1 : -1;
    const difficultyFactor = 1 + Math.min(Math.max(0, index) * 0.01, 1.1);
    const speed = rng.nextFloat(1.8, 3.4) * difficultyFactor * direction;

    const obstacles: number[] = [];
    const vehicles: Vehicle[] = [];
    const logs: LogPlatform[] = [];

    if (type === LaneType.GRASS) {
      const safeCurrent = this.getSafeCorridorX(index);
      const safePrev = this.getSafeCorridorX(index - 1);

      for (let x = WORLD_CONFIG.MIN_X; x <= WORLD_CONFIG.MAX_X; x++) {
        // Keep central spawn area clear on rows -3..2
        if (index <= 2 && Math.abs(x) <= 2) continue;
        // Keep safe corridor columns clear so adjacent GRASS rows always share passable columns
        if (x === safeCurrent || x === safePrev || x === 0) continue;

        const treeChance = index <= 0 ? 0.35 : 0.28;
        if (rng.next() < treeChance) {
          obstacles.push(x);
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
    }

    return {
      index,
      type,
      obstacles,
      vehicles,
      logs,
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
