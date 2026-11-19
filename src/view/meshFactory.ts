import * as THREE from 'three';
import type { BiomeType, LogPlatform, ObstacleKind, SkinId, Vehicle } from '../core/types.ts';
import { createUrbanCharacter } from './urbanCharacters.ts';
import {
  createUrbanBush,
  createUrbanCoin,
  createUrbanObstacle,
  createUrbanRailwaySignal,
  createUrbanRecordFlag,
  createUrbanRiverbankEdge,
  createUrbanRoadBarrier,
  createUrbanRock,
  createUrbanTree,
  type RailwaySignalComponents,
} from './urbanEnvironment.ts';
import { createUrbanPallet, createUrbanTrain, createUrbanVehicle } from './urbanVehicles.ts';
import { createUrbanTownhouse } from './urbanBuildings.ts';

export class MeshFactory {
  static createTownhouse(seedVariant: number, biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanTownhouse(seedVariant, biome);
  }

  static createCharacter(skinId: SkinId = 'corgi', isGhost = false): THREE.Group {
    return createUrbanCharacter(skinId, isGhost);
  }

  static createChicken(): THREE.Group {
    return createUrbanCharacter('corgi');
  }

  static createObstacle(
    kind: ObstacleKind,
    seedVariant: number,
    biomeOrSnow: BiomeType | boolean = false
  ): THREE.Group {
    return createUrbanObstacle(kind, seedVariant, biomeOrSnow);
  }

  static createTree(seedVariant: number, biomeOrSnow: BiomeType | boolean = false): THREE.Group {
    return createUrbanTree(seedVariant, biomeOrSnow);
  }

  static createRock(seedVariant: number, biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanRock(seedVariant, biome);
  }

  static createBush(seedVariant: number, biomeOrSnow: BiomeType | boolean = false): THREE.Group {
    return createUrbanBush(seedVariant, biomeOrSnow);
  }

  static createCoin(): THREE.Group {
    return createUrbanCoin();
  }

  static createRailwaySignal(): RailwaySignalComponents {
    return createUrbanRailwaySignal();
  }

  static createTrain(length: number, speed: number): THREE.Group {
    return createUrbanTrain(length, speed);
  }

  static createVehicle(v: Vehicle): THREE.Group {
    return createUrbanVehicle(v);
  }

  static createLog(log: LogPlatform, biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanPallet(log, biome);
  }

  static createRiverbankEdge(side: 'left' | 'right', biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanRiverbankEdge(side, biome);
  }

  static createWaterfallEdge(side: 'left' | 'right', biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanRiverbankEdge(side, biome);
  }

  static createRoadBarrier(biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanRoadBarrier(biome);
  }

  static createRecordFlag(): THREE.Group {
    return createUrbanRecordFlag();
  }
}
