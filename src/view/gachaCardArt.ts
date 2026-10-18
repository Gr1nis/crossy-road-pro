function hexShade(hex: string, factor: number): string {
  const c = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.floor(((c >> 16) & 255) * factor));
  const g = Math.min(255, Math.floor(((c >> 8) & 255) * factor));
  const b = Math.min(255, Math.floor((c & 255) * factor));
  return '#' + (16777216 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function isoBox(
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  color: string
): string {
  const topCol = hexShade(color, 1.18);
  const leftCol = hexShade(color, 0.92);
  const rightCol = hexShade(color, 0.75);
  const sx = 60 + (x - z) * 7.5;
  const sy = 66 + (x + z) * 3.8 - y * 7.5;
  const pTop = `${sx.toFixed(1)},${sy.toFixed(1)} ${(sx + w * 7.5).toFixed(1)},${(sy + w * 3.8).toFixed(1)} ${(sx + (w - d) * 7.5).toFixed(1)},${(sy + (w + d) * 3.8).toFixed(1)} ${(sx - d * 7.5).toFixed(1)},${(sy + d * 3.8).toFixed(1)}`;
  const pLeft = `${(sx - d * 7.5).toFixed(1)},${(sy + d * 3.8).toFixed(1)} ${(sx + (w - d) * 7.5).toFixed(1)},${(sy + (w + d) * 3.8).toFixed(1)} ${(sx + (w - d) * 7.5).toFixed(1)},${(sy + (w + d) * 3.8 + h * 7.5).toFixed(1)} ${(sx - d * 7.5).toFixed(1)},${(sy + d * 3.8 + h * 7.5).toFixed(1)}`;
  const pRight = `${(sx + (w - d) * 7.5).toFixed(1)},${(sy + (w + d) * 3.8).toFixed(1)} ${(sx + w * 7.5).toFixed(1)},${(sy + w * 3.8).toFixed(1)} ${(sx + w * 7.5).toFixed(1)},${(sy + w * 3.8 + h * 7.5).toFixed(1)} ${(sx + (w - d) * 7.5).toFixed(1)},${(sy + (w + d) * 3.8 + h * 7.5).toFixed(1)}`;
  return `<polygon points="${pTop}" fill="${topCol}"/><polygon points="${pLeft}" fill="${leftCol}"/><polygon points="${pRight}" fill="${rightCol}"/>`;
}

function buildCorgiSvg(): string {
  const b: string[] = [];
  b.push(isoBox(-0.6, 2.2, -2.5, 1.2, 1.2, 1.0, '#ea580c'));
  b.push(isoBox(-1.5, 0.0, -1.8, 0.9, 1.2, 0.9, '#ffffff'));
  b.push(isoBox(0.6, 0.0, -1.8, 0.9, 1.2, 0.9, '#ffffff'));
  b.push(isoBox(-1.8, 0.8, -2.0, 3.6, 2.6, 4.4, '#ea580c'));
  b.push(isoBox(-1.3, 0.8, 1.5, 2.6, 2.2, 1.0, '#ffffff'));
  b.push(isoBox(-1.5, 0.0, 1.5, 0.9, 1.2, 0.9, '#ffffff'));
  b.push(isoBox(0.6, 0.0, 1.5, 0.9, 1.2, 0.9, '#ffffff'));
  b.push(isoBox(-1.6, 3.2, 1.2, 3.2, 0.4, 1.6, '#dc2626'));
  b.push(isoBox(-0.3, 2.9, 2.8, 0.6, 0.5, 0.2, '#facc15'));
  b.push(isoBox(-1.7, 3.4, 0.8, 3.4, 2.8, 3.0, '#ea580c'));
  b.push(isoBox(-1.0, 3.2, 2.8, 2.0, 1.6, 1.6, '#ffffff'));
  b.push(isoBox(-0.4, 4.2, 3.8, 0.8, 0.6, 0.5, '#0f172a'));
  b.push(isoBox(-0.1, 3.2, 3.7, 0.5, 0.4, 0.6, '#f472b6'));
  b.push(isoBox(-0.5, 4.4, 2.2, 1.0, 2.0, 1.6, '#ffffff'));
  b.push(isoBox(-1.2, 4.6, 2.6, 0.5, 0.6, 0.4, '#0f172a'));
  b.push(isoBox(0.7, 4.6, 2.6, 0.5, 0.6, 0.4, '#0f172a'));
  b.push(isoBox(-1.6, 6.0, 1.4, 1.0, 1.8, 0.8, '#ea580c'));
  b.push(isoBox(-1.4, 6.2, 1.8, 0.6, 1.4, 0.4, '#f472b6'));
  b.push(isoBox(0.6, 6.0, 1.4, 1.0, 1.8, 0.8, '#ea580c'));
  b.push(isoBox(0.8, 6.2, 1.8, 0.6, 1.4, 0.4, '#f472b6'));
  return wrapSvg(b.join(''), 36, 12);
}

function buildBoxCatSvg(): string {
  const b: string[] = [];
  b.push(isoBox(-2.5, 0.2, -2.5, 5.0, 3.6, 5.0, '#b45309'));
  b.push(isoBox(-2.2, 3.6, -2.2, 4.4, 0.2, 4.4, '#451a03'));
  b.push(isoBox(-2.8, 3.6, -0.8, 0.6, 1.4, 3.2, '#d97706'));
  b.push(isoBox(2.2, 3.6, -0.8, 0.6, 1.4, 3.2, '#d97706'));
  b.push(isoBox(-0.8, 3.6, 2.2, 3.2, 1.4, 0.6, '#d97706'));
  b.push(isoBox(-1.6, 3.6, 0.2, 3.2, 2.8, 3.0, '#64748b'));
  b.push(isoBox(-1.0, 3.4, 2.2, 2.0, 1.4, 1.2, '#f8fafc'));
  b.push(isoBox(-0.3, 4.2, 3.0, 0.6, 0.4, 0.4, '#f472b6'));
  b.push(isoBox(-1.2, 4.8, 2.4, 0.5, 0.6, 0.4, '#10b981'));
  b.push(isoBox(0.7, 4.8, 2.4, 0.5, 0.6, 0.4, '#10b981'));
  b.push(isoBox(-1.6, 6.2, 1.0, 0.9, 1.4, 0.8, '#64748b'));
  b.push(isoBox(-1.4, 6.4, 1.4, 0.5, 1.0, 0.4, '#f472b6'));
  b.push(isoBox(0.7, 6.2, 1.0, 0.9, 1.4, 0.8, '#64748b'));
  b.push(isoBox(0.9, 6.4, 1.4, 0.5, 1.0, 0.4, '#f472b6'));
  b.push(isoBox(-1.6, 3.4, 2.4, 0.9, 0.7, 0.8, '#ffffff'));
  b.push(isoBox(0.7, 3.4, 2.4, 0.9, 0.7, 0.8, '#ffffff'));
  return wrapSvg(b.join(''), 40, 13);
}

function buildPigeonSvg(): string {
  const b: string[] = [];
  b.push(isoBox(-1.0, 0.0, 0.0, 0.6, 1.0, 0.6, '#f97316'));
  b.push(isoBox(0.4, 0.0, 0.0, 0.6, 1.0, 0.6, '#f97316'));
  b.push(isoBox(-1.7, 0.8, -2.0, 3.4, 3.2, 4.0, '#64748b'));
  b.push(isoBox(-1.9, 1.4, -1.2, 0.5, 2.0, 2.8, '#475569'));
  b.push(isoBox(1.4, 1.4, -1.2, 0.5, 2.0, 2.8, '#475569'));
  b.push(isoBox(-0.6, 1.6, -3.2, 1.2, 0.6, 1.6, '#334155'));
  b.push(isoBox(-1.3, 3.8, 0.6, 2.6, 1.0, 2.4, '#a855f7'));
  b.push(isoBox(-1.2, 4.6, 0.8, 2.4, 2.2, 2.4, '#64748b'));
  b.push(isoBox(-1.0, 5.2, 2.4, 0.4, 0.5, 0.4, '#0f172a'));
  b.push(isoBox(0.6, 5.2, 2.4, 0.4, 0.5, 0.4, '#0f172a'));
  b.push(isoBox(-0.4, 4.6, 2.8, 0.8, 0.8, 1.2, '#facc15'));
  b.push(isoBox(-1.6, 3.6, 2.8, 3.2, 0.3, 2.6, '#fde047'));
  b.push(isoBox(-1.6, 3.6, 2.4, 3.2, 0.4, 0.5, '#b45309'));
  b.push(isoBox(-0.8, 3.9, 3.4, 0.6, 0.1, 0.6, '#ef4444'));
  b.push(isoBox(0.4, 3.9, 3.8, 0.6, 0.1, 0.6, '#ef4444'));
  return wrapSvg(b.join(''), 36, 12);
}

function buildRaccoonSvg(): string {
  const b: string[] = [];
  b.push(isoBox(-0.7, 1.4, -4.2, 1.4, 1.4, 1.4, '#1e293b'));
  b.push(isoBox(-0.6, 1.6, -3.0, 1.2, 1.2, 1.4, '#94a3b8'));
  b.push(isoBox(-1.4, 0.0, -1.6, 0.8, 1.0, 0.8, '#1e293b'));
  b.push(isoBox(0.6, 0.0, -1.6, 0.8, 1.0, 0.8, '#1e293b'));
  b.push(isoBox(-1.7, 0.6, -2.0, 3.4, 2.8, 4.2, '#475569'));
  b.push(isoBox(-1.4, 0.0, 1.4, 0.8, 1.0, 0.8, '#1e293b'));
  b.push(isoBox(0.6, 0.0, 1.4, 0.8, 1.0, 0.8, '#1e293b'));
  b.push(isoBox(-1.7, 3.2, 0.8, 3.4, 2.8, 2.8, '#475569'));
  b.push(isoBox(-1.8, 3.8, 2.4, 3.6, 1.2, 1.0, '#0f172a'));
  b.push(isoBox(-1.1, 5.0, 2.4, 0.8, 0.4, 0.6, '#ffffff'));
  b.push(isoBox(0.3, 5.0, 2.4, 0.8, 0.4, 0.6, '#ffffff'));
  b.push(isoBox(-1.1, 4.0, 2.8, 0.4, 0.6, 0.4, '#f8fafc'));
  b.push(isoBox(0.7, 4.0, 2.8, 0.4, 0.6, 0.4, '#f8fafc'));
  b.push(isoBox(-1.0, 3.2, 2.8, 2.0, 1.0, 1.4, '#ffffff'));
  b.push(isoBox(-0.3, 3.8, 3.8, 0.6, 0.5, 0.4, '#020617'));
  b.push(isoBox(-1.6, 5.8, 1.2, 0.9, 1.2, 0.8, '#334155'));
  b.push(isoBox(-1.4, 6.0, 1.4, 0.5, 0.8, 0.4, '#ffffff'));
  b.push(isoBox(0.7, 5.8, 1.2, 0.9, 1.2, 0.8, '#334155'));
  b.push(isoBox(0.9, 6.0, 1.4, 0.5, 0.8, 0.4, '#ffffff'));
  return wrapSvg(b.join(''), 38, 12);
}

function buildCapybaraSvg(): string {
  const b: string[] = [];
  b.push(isoBox(-1.8, 0.0, -2.0, 1.0, 1.0, 1.0, '#78350f'));
  b.push(isoBox(0.8, 0.0, -2.0, 1.0, 1.0, 1.0, '#78350f'));
  b.push(isoBox(-2.2, 0.6, -2.6, 4.4, 3.4, 5.2, '#b45309'));
  b.push(isoBox(-1.8, 0.0, 1.6, 1.0, 1.0, 1.0, '#78350f'));
  b.push(isoBox(0.8, 0.0, 1.6, 1.0, 1.0, 1.0, '#78350f'));
  b.push(isoBox(-1.8, 3.0, 0.8, 3.6, 2.8, 3.6, '#b45309'));
  b.push(isoBox(-1.5, 2.8, 3.4, 3.0, 2.2, 1.6, '#78350f'));
  b.push(isoBox(-1.3, 4.4, 3.2, 0.6, 0.3, 0.4, '#451a03'));
  b.push(isoBox(0.7, 4.4, 3.2, 0.6, 0.3, 0.4, '#451a03'));
  b.push(isoBox(-1.8, 5.2, 1.2, 0.6, 0.8, 0.6, '#78350f'));
  b.push(isoBox(1.2, 5.2, 1.2, 0.6, 0.8, 0.6, '#78350f'));
  b.push(isoBox(-0.8, 5.8, 1.8, 1.6, 1.4, 1.6, '#f97316'));
  b.push(isoBox(-0.2, 7.2, 2.0, 0.5, 0.4, 0.5, '#22c55e'));
  return wrapSvg(b.join(''), 42, 13);
}

function wrapSvg(shapes: string, shadowRx: number, shadowRy: number): string {
  return `<svg viewBox="0 0 120 110" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="94" rx="${shadowRx}" ry="${shadowRy}" fill="rgba(0,0,0,0.35)"/>${shapes}</svg>`;
}

const GACHA_CARD_SVG_MAP: Record<string, string> = {
  corgi: buildCorgiSvg(),
  box_cat: buildBoxCatSvg(),
  pigeon_pizza: buildPigeonSvg(),
  raccoon_bandit: buildRaccoonSvg(),
  capybara_zen: buildCapybaraSvg(),
};

export function getGachaCardSvg(skinId: string): string {
  return GACHA_CARD_SVG_MAP[skinId] ?? GACHA_CARD_SVG_MAP.corgi;
}
