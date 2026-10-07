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
  createUrbanRoadMarkings,
  createUrbanRock,
  createUrbanTree,
} from './urbanEnvironment.ts';
import { createUrbanPallet, createUrbanTrain, createUrbanVehicle } from './urbanVehicles.ts';

export class MeshFactory {
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

  static createRailwaySignal(): { group: THREE.Group; lightMesh: THREE.Mesh } {
    return createUrbanRailwaySignal();
  }

  static createTrain(length: number, speed: number): THREE.Group {
    return createUrbanTrain(length, speed);
  }

  static createVehicle(v: Vehicle): THREE.Group {
    return createUrbanVehicle(v);
  }

  static createLog(log: LogPlatform): THREE.Group {
    return createUrbanPallet(log);
  }

  static createRiverbankEdge(side: 'left' | 'right', biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanRiverbankEdge(side, biome);
  }

  static createWaterfallEdge(side: 'left' | 'right', biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanRiverbankEdge(side, biome);
  }

  static createRoadMarkings(): THREE.Group {
    return createUrbanRoadMarkings();
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

  static createRoadBarrier(biome: BiomeType = 'forest'): THREE.Group {
    return createUrbanRoadBarrier(biome);
  }

  static createRecordFlag(): THREE.Group {
    return createUrbanRecordFlag();
  }
}
