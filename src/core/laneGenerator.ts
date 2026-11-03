import { PRNG } from './prng.ts';
import {
  Biome,
  BIOME_INTERVAL,
  BIOME_ORDER,
  getBiomeForScore,
  LaneType,
  WORLD_CONFIG,
  type BiomeType,
  type Lane,
  type LaneTypeValue,
  type LogPlatform,
  type ObstacleDetail,
  type ObstacleKind,
  type TrainState,
  type Vehicle,
} from './types.ts';

export { Biome, BIOME_INTERVAL, BIOME_ORDER, getBiomeForScore, type BiomeType };

const VEHICLE_COLORS = [0xef4444, 0x3b82f6, 0xf59e0b, 0x10b981, 0xa855f7, 0xec4899];
const OBSTACLE_KINDS: ObstacleKind[] = ['tree', 'rock', 'bush'];
const DEFAULT_RIVER_LOG_COUNT = 5;

export class LaneGenerator {
  private readonly baseSeed: number;
  private readonly laneTypeCache = new Map<number, LaneTypeValue>();

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

  getBiome(scoreOrIndex: number): BiomeType {
    return getBiomeForScore(scoreOrIndex);
  }

  getDifficultyFactor(scoreOrIndex: number): number {
    const effective = Math.max(0, scoreOrIndex);
    return 1 + Math.min(effective * 0.006, 0.9);
  }

  getLaneType(index: number): LaneTypeValue {
    if (index <= 2) return LaneType.GRASS;
    const cached = this.laneTypeCache.get(index);
    if (cached) return cached;

    // Populate deterministically in sequential order
    for (let i = 3; i <= index; i++) {
      if (this.laneTypeCache.has(i)) continue;
      const prev1 = this.getLaneType(i - 1);
      const prev2 = this.getLaneType(i - 2);
      const prev3 = this.getLaneType(i - 3);
      const prev4 = this.getLaneType(i - 4);

      let type: LaneTypeValue;
      if (prev1 === LaneType.ROAD && prev2 === LaneType.ROAD && prev3 === LaneType.ROAD) {
        // Enforce safe rest strip after 3 consecutive roads
        type = LaneType.GRASS;
      } else if (prev1 === LaneType.RIVER && prev2 === LaneType.RIVER) {
        // Enforce safe ground after 2 consecutive rivers
        type = LaneType.GRASS;
      } else if (
        prev1 !== LaneType.GRASS &&
        prev2 !== LaneType.GRASS &&
        prev3 !== LaneType.GRASS &&
        prev4 !== LaneType.GRASS
      ) {
        // Enforce pacing: no more than 4 consecutive hazard lanes
        type = LaneType.GRASS;
      } else {
        const rng = this.rowPrng(i);
        const roll = rng.next();
        const canRailway = prev1 !== LaneType.RAILWAY && prev1 !== LaneType.RIVER;

        if (canRailway) {
          if (roll < 0.36) {
            type = LaneType.GRASS;
          } else if (roll < 0.68) {
            type = LaneType.ROAD;
          } else if (roll < 0.86) {
            type = LaneType.RIVER;
          } else {
            type = LaneType.RAILWAY;
          }
        } else {
          // Railway barred; redistribute remaining probability cleanly
          if (roll < 0.42) {
            type = LaneType.GRASS;
          } else if (roll < 0.78) {
            type = LaneType.ROAD;
          } else {
            type = LaneType.RIVER;
          }
        }
      }
      this.laneTypeCache.set(i, type);
    }

    return this.laneTypeCache.get(index) ?? LaneType.GRASS;
  }

  generateLane(index: number, score?: number): Lane {
    const rng = this.rowPrng(index);
    const effectiveScore = score !== undefined ? Math.max(0, score) : Math.max(0, index);
    const biome = getBiomeForScore(effectiveScore);

    const type = this.getLaneType(index);
    if (index > 2) {
      rng.next(); // Align PRNG sequence for deterministic per-lane entity generation
    }

    const direction: 1 | -1 = index % 2 === 0 ? 1 : -1;
    const difficultyFactor = this.getDifficultyFactor(effectiveScore);
    const speed = rng.nextFloat(2.0, 3.0) * difficultyFactor * direction;

    const obstacles: number[] = [];
    const obstacleDetails: ObstacleDetail[] = [];
    const coins: number[] = [];
    const vehicles: Vehicle[] = [];
    const logs: LogPlatform[] = [];
    let train: TrainState | undefined;

    if (type === LaneType.GRASS) {
      const safeCurrent = this.getSafeCorridorX(index);
      const safePrev = this.getSafeCorridorX(index - 1);
      const totalCols = WORLD_CONFIG.MAX_X - WORLD_CONFIG.MIN_X + 1;
      const maxObstacles = totalCols - 5; // Guarantees >= 5 free columns (>= 4 required)

      for (let x: number = WORLD_CONFIG.MIN_X; x <= WORLD_CONFIG.MAX_X; x++) {
        if (index <= 2 && Math.abs(x) <= 2) continue;
        if (x === safeCurrent || x === safePrev || x === 0) continue;
        if (obstacles.length >= maxObstacles) continue;

        const treeChance =
          index <= 0 ? 0.35 : Math.min(0.4, 0.26 + Math.min(effectiveScore, 140) * 0.001);
        if (rng.next() < treeChance) {
          obstacles.push(x);
          const kind = OBSTACLE_KINDS[rng.nextInt(0, OBSTACLE_KINDS.length - 1)];
          obstacleDetails.push({ x, kind });
        }
      }
    } else if (type === LaneType.ROAD) {
      const isTruckLane = rng.next() < 0.32;
      const baseCount = isTruckLane ? rng.nextInt(2, 3) : rng.nextInt(3, 4);
      const densityBonus = Math.min(isTruckLane ? 2 : 3, Math.floor(effectiveScore / 35));
      const count = isTruckLane
        ? Math.min(5, baseCount + densityBonus)
        : Math.min(7, baseCount + densityBonus);
      const vehicleLen = isTruckLane ? 2.3 : 1.35;
      const ringSpan = WORLD_CONFIG.WRAP_LIMIT * 2;
      const spacing = ringSpan / count;
      // Bound jitter so bumper-to-bumper clear gap is always >= 2.2 units for guaranteed passability
      const maxJitter = Math.min(0.45, Math.max(0.1, (spacing - vehicleLen - 2.2) / 2));

      for (let i = 0; i < count; i++) {
        const offset =
          -WORLD_CONFIG.WRAP_LIMIT + (i + 0.5) * spacing + rng.nextFloat(-maxJitter, maxJitter);
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
      const logCount = DEFAULT_RIVER_LOG_COUNT;
      const logLen = rng.nextFloat(2.8, 3.8);
      const ringSpan = WORLD_CONFIG.WRAP_LIMIT * 2;
      const spacing = ringSpan / logCount;
      const riverSpeed =
        rng.nextFloat(1.2, 2.0) * (1 + Math.min(effectiveScore * 0.004, 0.45)) * direction;

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
      const trainSpeedFactor = 1 + Math.min(effectiveScore * 0.005, 0.6);
      const periodScale = 1 + Math.min(effectiveScore * 0.004, 0.4);
      const period = Math.max(3.5, rng.nextFloat(5.4, 7.2) / periodScale);
      const trainSpeed = 32.0 * trainSpeedFactor * direction;
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

    // Spawn coins on unblocked tiles for rows > 0 (balanced arcade rarity)
    if (index > 0 && type !== LaneType.RIVER && rng.next() < 0.22) {
      const candidateX = rng.nextInt(-6, 6);
      if (!obstacles.includes(candidateX)) {
        coins.push(candidateX);
      }
    }

    return {
      index,
      type,
      biome,
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

  generateRange(startIndex: number, endIndex: number, score?: number): Lane[] {
    const result: Lane[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push(this.generateLane(i, score));
    }
    return result;
  }
}
