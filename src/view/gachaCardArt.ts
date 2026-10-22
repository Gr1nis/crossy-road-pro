import * as THREE from 'three';
import { type SkinId } from '../core/types.ts';
import { SKIN_RARITY_MAP, type SkinRarityValue } from '../core/gachaMachine.ts';
import { createUrbanCharacter } from './urbanCharacters.ts';
import { GACHA_CHARACTER_SKIN_BASE64 } from './gachaSkinsBase64.ts';

export const CARD_NAMES_UPPER: Record<string, string> = {
  corgi: 'CORGI',
  pigeon_pizza: 'PIZZA PIGEON',
  box_cat: 'BOX CAT',
  raccoon_bandit: 'RACCOON',
  capybara_zen: 'CAPYBARA',
};

export const RARITY_CSS_MAP: Record<SkinRarityValue, { label: string; css: string }> = {
  Common: { label: 'COMMON', css: 'rarity-common' },
  Rare: { label: 'RARE', css: 'rarity-rare' },
  Epic: { label: 'EPIC', css: 'rarity-epic' },
  Legendary: { label: 'LEGENDARY', css: 'rarity-legendary' },
};

export const RARITY_GLOW_MAP: Record<SkinRarityValue, string> = {
  Common: '#94a3b8',
  Rare: '#38bdf8',
  Epic: '#c084fc',
  Legendary: '#fbbf24',
};

export const GACHA_CARD_THUMB_CACHE = new Map<string, string>();
for (const [id, url] of Object.entries(GACHA_CHARACTER_SKIN_BASE64)) {
  GACHA_CARD_THUMB_CACHE.set(id, url);
}

function shadeHex(hexStr: string, factor: number): string {
  const c = parseInt(hexStr, 16);
  const r = Math.min(255, Math.floor(((c >> 16) & 255) * factor));
  const g = Math.min(255, Math.floor(((c >> 8) & 255) * factor));
  const b = Math.min(255, Math.floor((c & 255) * factor));
  return '#' + (16777216 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function renderVoxelIsometricSvg(skinId: string): string {
  try {
    const group = createUrbanCharacter(skinId);
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);

    let minPx = Infinity;
    let maxPx = -Infinity;
    let minPy = Infinity;
    let maxPy = -Infinity;

    for (const child of group.children) {
      const m = child as THREE.Mesh;
      const geom = m.geometry as THREE.BoxGeometry;
      const p = geom.parameters;
      const x = m.position.x;
      const y = m.position.y;
      const z = m.position.z;
      const w = p.width;
      const h = p.height;
      const d = p.depth;
      const x0 = x - w / 2;
      const x1 = x + w / 2;
      const y0 = y - h / 2;
      const y1 = y + h / 2;
      const z0 = z - d / 2;
      const z1 = z + d / 2;
      for (const vx of [x0, x1]) {
        for (const vy of [y0, y1]) {
          for (const vz of [z0, z1]) {
            const px = (vx - vz) * cos30;
            const py = (vx + vz) * sin30 - vy;
            if (px < minPx) minPx = px;
            if (px > maxPx) maxPx = px;
            if (py < minPy) minPy = py;
            if (py > maxPy) maxPy = py;
          }
        }
      }
    }

    const spanX = maxPx - minPx;
    const spanY = maxPy - minPy;
    const centerPx = (minPx + maxPx) / 2;
    const centerPy = (minPy + maxPy) / 2;
    const targetSize = 120;
    const scale = Math.min(targetSize / spanX, targetSize / spanY);
    const cx = 80;
    const cy = 82;

    const projX = (vx: number, vz: number): string =>
      (cx + ((vx - vz) * cos30 - centerPx) * scale).toFixed(2);
    const projY = (vx: number, vy: number, vz: number): string =>
      (cy + ((vx + vz) * sin30 - vy - centerPy) * scale).toFixed(2);

    interface FacePolygon {
      depth: number;
      points: string;
      fill: string;
    }

    const faces: FacePolygon[] = [];
    for (const child of group.children) {
      const m = child as THREE.Mesh;
      const geom = m.geometry as THREE.BoxGeometry;
      const p = geom.parameters;
      const mat = m.material as THREE.MeshLambertMaterial;
      const colorHex = mat.color.getHexString();
      const x = m.position.x;
      const y = m.position.y;
      const z = m.position.z;
      const w = p.width;
      const h = p.height;
      const d = p.depth;
      const x0 = x - w / 2;
      const x1 = x + w / 2;
      const y0 = y - h / 2;
      const y1 = y + h / 2;
      const z0 = z - d / 2;
      const z1 = z + d / 2;

      const topCol = shadeHex(colorHex, 1.20);
      const frontCol = shadeHex(colorHex, 1.02);
      const rightCol = shadeHex(colorHex, 0.82);

      // Top face (+Y)
      faces.push({
        depth: x + y + h / 2 + z,
        points: `${projX(x0, z0)},${projY(x0, y1, z0)} ${projX(x1, z0)},${projY(x1, y1, z0)} ${projX(x1, z1)},${projY(x1, y1, z1)} ${projX(x0, z1)},${projY(x0, y1, z1)}`,
        fill: topCol,
      });

      // Right face (+X)
      faces.push({
        depth: x + w / 2 + y + z,
        points: `${projX(x1, z0)},${projY(x1, y1, z0)} ${projX(x1, z1)},${projY(x1, y1, z1)} ${projX(x1, z1)},${projY(x1, y0, z1)} ${projX(x1, z0)},${projY(x1, y0, z0)}`,
        fill: rightCol,
      });

      // Front face (+Z)
      faces.push({
        depth: x + y + z + d / 2,
        points: `${projX(x0, z1)},${projY(x0, y1, z1)} ${projX(x1, z1)},${projY(x1, y1, z1)} ${projX(x1, z1)},${projY(x1, y0, z1)} ${projX(x0, z1)},${projY(x0, y0, z1)}`,
        fill: frontCol,
      });
    }

    faces.sort((a, b) => a.depth - b.depth);
    const polygons = faces.map(
      (f) => `<polygon points="${f.points}" fill="${f.fill}" stroke="${f.fill}" stroke-width="0.5" stroke-linejoin="round"/>`
    );

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">${polygons.join('')}</svg>`;
  } catch {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="%231e293b"/></svg>';
  }
}

export function createFallbackVoxelDataUrl(skinId: string): string {
  const svg = renderVoxelIsometricSvg(skinId);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function preloadGachaCardThumbnails(): void {
  const skins: SkinId[] = ['corgi', 'pigeon_pizza', 'box_cat', 'raccoon_bandit', 'capybara_zen'];
  for (const id of skins) {
    if (!GACHA_CARD_THUMB_CACHE.has(id)) {
      const b64 = GACHA_CHARACTER_SKIN_BASE64[id];
      GACHA_CARD_THUMB_CACHE.set(id, b64 || createFallbackVoxelDataUrl(id));
    }
  }
}

export function getGachaCardThumbUrl(skinId: string): string {
  if (GACHA_CHARACTER_SKIN_BASE64[skinId]) {
    return GACHA_CHARACTER_SKIN_BASE64[skinId];
  }
  let cached = GACHA_CARD_THUMB_CACHE.get(skinId);
  if (!cached) {
    preloadGachaCardThumbnails();
    cached = GACHA_CARD_THUMB_CACHE.get(skinId);
  }
  return cached ?? createFallbackVoxelDataUrl(skinId);
}

export function getGachaCardSvg(skinId: string): string {
  const thumbUrl = getGachaCardThumbUrl(skinId);
  return `<img src="${thumbUrl}" class="gacha-card-char-img" alt="${skinId}">`;
}

export function createGachaCardElement(skinId: SkinId, index: number, isSilhouette = true): HTMLElement {
  const card = document.createElement('div');
  card.className = 'gacha-roulette-card';
  card.setAttribute('data-index', String(index));
  card.setAttribute('data-skin-id', skinId);

  const rarityVal = SKIN_RARITY_MAP[skinId] ?? 'Common';
  const rarityInfo = RARITY_CSS_MAP[rarityVal] ?? RARITY_CSS_MAP.Common;
  const nameUpper = CARD_NAMES_UPPER[skinId] ?? skinId.toUpperCase();
  const thumbUrl = getGachaCardThumbUrl(skinId);

  card.classList.add(`glow-${rarityVal.toLowerCase()}`);
  card.style.setProperty('--rarity-glow', RARITY_GLOW_MAP[rarityVal]);

  const displayedName = isSilhouette ? `??? ${rarityInfo.label}` : nameUpper;
  const silhouetteClass = isSilhouette ? 'card-silhouette' : '';

  card.innerHTML = `
    <div class="gacha-card-name" data-real-name="${nameUpper}">${displayedName}</div>
    <div class="gacha-card-character ${silhouetteClass}">
      <img src="${thumbUrl}" class="gacha-card-char-img" alt="${skinId}">
    </div>
    <div class="gacha-card-rarity ${rarityInfo.css}">${rarityInfo.label}</div>
  `;
  return card;
}

export function revealGachaWinningCard(cardEl: HTMLElement, skinId: string): void {
  cardEl.classList.add('winning-card');
  const charEl = cardEl.querySelector('.gacha-card-character');
  if (charEl) {
    charEl.classList.remove('card-silhouette');
    charEl.classList.add('reveal-pop');
  }
  const nameEl = cardEl.querySelector('.gacha-card-name');
  if (nameEl) {
    const realName = nameEl.getAttribute('data-real-name') || CARD_NAMES_UPPER[skinId] || skinId.toUpperCase();
    nameEl.textContent = realName;
    nameEl.classList.add('name-revealed');
  }
}

export function spawnGachaConfetti(container: HTMLElement): void {
  const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#c084fc', '#4ade80', '#f43f5e', '#ffffff'];
  for (let i = 0; i < 38; i++) {
    const piece = document.createElement('div');
    piece.className = 'gacha-confetti-piece';
    const isSquare = i % 3 === 0;
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const dist = 70 + Math.random() * 160;
    const dx = Math.cos(angle) * dist * 1.5;
    const dy = -Math.abs(Math.sin(angle)) * dist - 30;
    const rot = (Math.random() - 0.5) * 720;

    piece.style.cssText = `
      position: absolute; top: 50%; left: 50%;
      width: ${isSquare ? 8 : 10}px; height: ${isSquare ? 8 : 14}px;
      background: ${colors[i % colors.length]}; border-radius: 2px;
      pointer-events: none; z-index: 22;
      --dx: ${dx.toFixed(1)}px; --dy: ${dy.toFixed(1)}px; --rot: ${rot.toFixed(1)}deg;
    `;
    container.appendChild(piece);
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => preloadGachaCardThumbnails());
  } else {
    preloadGachaCardThumbnails();
  }
}
