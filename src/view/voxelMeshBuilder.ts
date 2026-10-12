import * as THREE from 'three';

export interface VoxelBoxSpec {
  w: number;
  h: number;
  d: number;
  x: number;
  y: number;
  z: number;
  color: number;
}

/**
 * VoxelMeshBuilder — Compiles multi-cube voxel structures into a single
 * monolithic BufferGeometry mesh with vertex colors, drastically reducing Draw Calls.
 */
export class VoxelMeshBuilder {
  private readonly boxes: Array<[number, number, number, number, number, number, number]> = [];
  private static readonly geoCache = new Map<string, THREE.BufferGeometry>();
  private static sharedLambertMaterial: THREE.MeshLambertMaterial | null = null;

  public static getSharedMaterial(): THREE.MeshLambertMaterial {
    if (!VoxelMeshBuilder.sharedLambertMaterial) {
      VoxelMeshBuilder.sharedLambertMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });
      VoxelMeshBuilder.sharedLambertMaterial.dispose = () => {};
    }
    return VoxelMeshBuilder.sharedLambertMaterial;
  }

  public addBox(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    colorHex: number
  ): this {
    this.boxes.push([w, h, d, x, y, z, colorHex]);
    return this;
  }

  public get boxCount(): number {
    return this.boxes.length;
  }

  public buildGeometry(): THREE.BufferGeometry {
    const totalBoxes = this.boxes.length;
    if (totalBoxes === 0) {
      return new THREE.BufferGeometry();
    }

    const positions = new Float32Array(totalBoxes * 72);
    const normals = new Float32Array(totalBoxes * 72);
    const colors = new Float32Array(totalBoxes * 72);
    const use32 = totalBoxes * 24 > 65535;
    const indices = use32 ? new Uint32Array(totalBoxes * 36) : new Uint16Array(totalBoxes * 36);

    let pIdx = 0;
    let nIdx = 0;
    let cIdx = 0;
    let iIdx = 0;
    let vOffset = 0;

    for (let i = 0; i < totalBoxes; i++) {
      const b = this.boxes[i];
      const w = b[0], h = b[1], d = b[2];
      const x = b[3], y = b[4], z = b[5];
      const col = b[6];

      const hw = w * 0.5, hh = h * 0.5, hd = d * 0.5;
      const x0 = x - hw, x1 = x + hw;
      const y0 = y - hh, y1 = y + hh;
      const z0 = z - hd, z1 = z + hd;

      const r = ((col >> 16) & 0xff) / 255;
      const g = ((col >> 8) & 0xff) / 255;
      const bCol = (col & 0xff) / 255;

      const faces = [
        // +X (norm: 1, 0, 0)
        [1, 0, 0, x1, y1, z1, x1, y1, z0, x1, y0, z1, x1, y0, z0],
        // -X (norm: -1, 0, 0)
        [-1, 0, 0, x0, y1, z0, x0, y1, z1, x0, y0, z0, x0, y0, z1],
        // +Y (norm: 0, 1, 0)
        [0, 1, 0, x0, y1, z0, x1, y1, z0, x0, y1, z1, x1, y1, z1],
        // -Y (norm: 0, -1, 0)
        [0, -1, 0, x0, y0, z1, x1, y0, z1, x0, y0, z0, x1, y0, z0],
        // +Z (norm: 0, 0, 1)
        [0, 0, 1, x0, y1, z1, x1, y1, z1, x0, y0, z1, x1, y0, z1],
        // -Z (norm: 0, 0, -1)
        [0, 0, -1, x1, y1, z0, x0, y1, z0, x1, y0, z0, x0, y0, z0],
      ];

      for (let f = 0; f < 6; f++) {
        const face = faces[f];
        const nx = face[0], ny = face[1], nz = face[2];
        for (let v = 0; v < 4; v++) {
          positions[pIdx++] = face[3 + v * 3];
          positions[pIdx++] = face[4 + v * 3];
          positions[pIdx++] = face[5 + v * 3];
          normals[nIdx++] = nx;
          normals[nIdx++] = ny;
          normals[nIdx++] = nz;
          colors[cIdx++] = r;
          colors[cIdx++] = g;
          colors[cIdx++] = bCol;
        }
        indices[iIdx++] = vOffset;
        indices[iIdx++] = vOffset + 2;
        indices[iIdx++] = vOffset + 1;
        indices[iIdx++] = vOffset + 2;
        indices[iIdx++] = vOffset + 3;
        indices[iIdx++] = vOffset + 1;
        vOffset += 4;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  }

  public buildMesh(sharedMaterial?: THREE.Material): THREE.Mesh {
    const geo = this.buildGeometry();
    const mat = sharedMaterial ?? VoxelMeshBuilder.getSharedMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { voxelCount: this.boxes.length };
    return mesh;
  }

  public static getOrCreateGeometry(
    key: string,
    populate: (builder: VoxelMeshBuilder) => void
  ): THREE.BufferGeometry {
    let geo = VoxelMeshBuilder.geoCache.get(key);
    if (!geo) {
      const builder = new VoxelMeshBuilder();
      populate(builder);
      geo = builder.buildGeometry();
      geo.userData = { voxelCount: builder.boxCount };
      geo.dispose = () => {};
      VoxelMeshBuilder.geoCache.set(key, geo);
    }
    return geo;
  }

  public static buildCachedMesh(
    key: string,
    populate: (builder: VoxelMeshBuilder) => void,
    sharedMaterial?: THREE.Material
  ): THREE.Mesh {
    const geo = VoxelMeshBuilder.getOrCreateGeometry(key, populate);
    const mat = sharedMaterial ?? VoxelMeshBuilder.getSharedMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { voxelCount: (geo.userData?.voxelCount as number) || 1 };
    return mesh;
  }

  public static clearCache(): void {
    VoxelMeshBuilder.geoCache.clear();
  }
}
