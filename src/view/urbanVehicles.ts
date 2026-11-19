import * as THREE from 'three';
import { vehicleScreenRotationY } from '../core/collision.ts';
import type { BiomeType, LogPlatform, Vehicle } from '../core/types.ts';
import { VoxelMeshBuilder } from './voxelMeshBuilder.ts';
import { type UrbanVoxelSpec, buildCar, buildTruck } from './urbanVehiclesExpansion.ts';
import { buildScooter, buildTaxi } from './urbanVehiclesExpansionA.ts';
import { buildBus, buildSweeper } from './urbanVehiclesExpansionB.ts';
import { buildPallet, buildTrain } from './urbanVehiclesRailRiver.ts';

export function createUrbanVehicle(
  vOrType: Vehicle | 'taxi' | 'scooter' | 'bus' | 'sweeper' | 'car' | 'truck' | string,
  speed?: number,
  colorOverride?: number
): THREE.Group {
  const group = new THREE.Group();
  let type: string;
  let spd: number;
  let col: number;

  if (typeof vOrType === 'object') {
    spd = vOrType.speed;
    col = vOrType.color;
    if (vOrType.type === 'truck') {
      const variant = Math.abs(vOrType.id) % 3;
      type = variant === 0 ? 'truck' : variant === 1 ? 'bus' : 'sweeper';
    } else {
      const variant = Math.abs(vOrType.id) % 3;
      type = variant === 0 ? 'car' : variant === 1 ? 'taxi' : 'scooter';
    }
  } else {
    spd = speed ?? 1;
    type = vOrType;
    col = colorOverride ?? 0;
  }

  if (type === 'train') {
    return createUrbanTrain(spd);
  }

  const key = `veh_${type}_${col}`;
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (builder) => {
    let specs: UrbanVoxelSpec[];
    switch (type) {
      case 'scooter': specs = buildScooter(col); break;
      case 'bus': specs = buildBus(col); break;
      case 'sweeper': specs = buildSweeper(col); break;
      case 'car': specs = buildCar(col); break;
      case 'truck': specs = buildTruck(col); break;
      case 'taxi':
      default: specs = buildTaxi(col); break;
    }
    for (let i = 0; i < specs.length; i++) {
      const s = specs[i];
      builder.addBox(s[0], s[1], s[2], s[3], s[4], s[5], s[6]);
    }
  });

  group.add(mesh);
  group.rotation.y = vehicleScreenRotationY(spd);
  return group;
}

export function createUrbanTrain(lengthOrSpeed: number = -1, speed?: number): THREE.Group {
  const group = new THREE.Group();
  const actualSpeed = speed !== undefined ? speed : lengthOrSpeed;

  const mesh = VoxelMeshBuilder.buildCachedMesh('urban_train', (builder) => {
    const specs = buildTrain();
    for (let i = 0; i < specs.length; i++) {
      const s = specs[i];
      builder.addBox(s[0], s[1], s[2], s[3], s[4], s[5], s[6]);
    }
  });

  group.add(mesh);
  group.rotation.y = vehicleScreenRotationY(actualSpeed);
  return group;
}

export function createUrbanPallet(log: LogPlatform, biome: BiomeType = 'forest'): THREE.Group {
  const group = new THREE.Group();
  const length = log.length ?? 3;
  const key = `urban_pallet_${length}_${biome}`;

  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (builder) => {
    const specs = buildPallet(length, biome);
    for (let i = 0; i < specs.length; i++) {
      const s = specs[i];
      builder.addBox(s[0], s[1], s[2], s[3], s[4], s[5], s[6]);
    }
  });

  group.add(mesh);
  return group;
}
