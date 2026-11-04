import { ALL_SKINS, WORLD_CONFIG, type SkinId } from './types.ts';
import type { CoinWallet } from './wallet.ts';
import type { SkinInventory } from './skinInventory.ts';

export const SkinRarity = {
  COMMON: 'Common',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
} as const;

export type SkinRarityValue = (typeof SkinRarity)[keyof typeof SkinRarity];

export const GACHA_DUPLICATE_CASHBACK = 40;
export const GACHA_DUPLICATE_WEIGHT_MULTIPLIER = 0.25;

export const SKIN_RARITY_MAP: Record<SkinId, SkinRarityValue> = {
  corgi: SkinRarity.COMMON,
  pigeon_pizza: SkinRarity.COMMON,
  barista_pug: SkinRarity.COMMON,
  skater_ferret: SkinRarity.COMMON,
  box_cat: SkinRarity.RARE,
  subway_rat: SkinRarity.RARE,
  raccoon_bandit: SkinRarity.EPIC,
  raincoat_duck: SkinRarity.EPIC,
  capybara_zen: SkinRarity.LEGENDARY,
  pigeon_king: SkinRarity.LEGENDARY,
  penguin_cocoa: SkinRarity.COMMON,
  snow_hare: SkinRarity.COMMON,
  husky_sweater: SkinRarity.COMMON,
  derpy_snowman: SkinRarity.COMMON,
  arctic_fox: SkinRarity.RARE,
  holiday_elf: SkinRarity.RARE,
  holiday_owl: SkinRarity.RARE,
  gingerbread_man: SkinRarity.EPIC,
  reindeer_glow: SkinRarity.EPIC,
  santa_claus: SkinRarity.LEGENDARY,
};

export const SKIN_RARITY_WEIGHTS: Record<SkinRarityValue, number> = {
  [SkinRarity.COMMON]: 50,
  [SkinRarity.RARE]: 30,
  [SkinRarity.EPIC]: 15,
  [SkinRarity.LEGENDARY]: 5,
};

export const GACHA_SKINS_BY_RARITY: Record<SkinRarityValue, SkinId[]> = {
  [SkinRarity.COMMON]: [],
  [SkinRarity.RARE]: [],
  [SkinRarity.EPIC]: [],
  [SkinRarity.LEGENDARY]: [],
};

export const SKIN_BASE_WEIGHTS: Record<SkinId, number> = {} as Record<SkinId, number>;

for (const skin of ALL_SKINS) {
  const rarity = SKIN_RARITY_MAP[skin.id] ?? SkinRarity.COMMON;
  GACHA_SKINS_BY_RARITY[rarity].push(skin.id);
}

for (const skin of ALL_SKINS) {
  const rarity = SKIN_RARITY_MAP[skin.id] ?? SkinRarity.COMMON;
  const countInTier = GACHA_SKINS_BY_RARITY[rarity].length;
  SKIN_BASE_WEIGHTS[skin.id] = (SKIN_RARITY_WEIGHTS[rarity] ?? 10) / Math.max(1, countInTier);
}

export type UnlockedSource = SkinInventory | ReadonlySet<SkinId> | SkinId[] | ReadonlyArray<SkinId>;

export function extractUnlockedChecker(source?: UnlockedSource): (id: SkinId) => boolean {
  if (!source) return () => false;
  if (typeof (source as SkinInventory).isUnlocked === 'function') {
    return (id: SkinId) => (source as SkinInventory).isUnlocked(id);
  }
  if (source instanceof Set) {
    return (id: SkinId) => (source as Set<SkinId>).has(id);
  }
  if (Array.isArray(source)) {
    return (id: SkinId) => (source as SkinId[]).includes(id);
  }
  return () => false;
}

export interface GachaRollResult {
  success: boolean;
  skinId?: SkinId;
  rarity?: SkinRarityValue;
  isDuplicate?: boolean;
  cashback?: number;
  reason?: string;
  allUnlocked?: boolean;
}

function mulberry32(seed: number): number {
  let s = (Math.floor(seed) + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return (t >>> 0) / 4294967296;
}

/**
 * GachaMachine handles skin rolls based on rarity weights, PRNG, and duplicates cashback.
 * Decoupled from storage, view, and game loop.
 */
export class GachaMachine {
  getSkinRarity(skinId: SkinId): SkinRarityValue {
    return SKIN_RARITY_MAP[skinId] ?? SkinRarity.COMMON;
  }

  getAvailableSkins(inventory: SkinInventory): SkinId[] {
    return ALL_SKINS.map((s) => s.id).filter((id) => !inventory.isUnlocked(id));
  }

  isAllUnlocked(inventory: SkinInventory): boolean {
    return this.getAvailableSkins(inventory).length === 0;
  }

  getDropProbabilities(
    inventoryOrUnlocked?: UnlockedSource,
    availablePool?: SkinId[]
  ): Record<SkinId, number> {
    const candidateIds = availablePool && availablePool.length > 0
      ? availablePool
      : ALL_SKINS.map((s) => s.id);

    const isUnlocked = extractUnlockedChecker(inventoryOrUnlocked);
    const weights = candidateIds.map((id) => {
      let w = SKIN_BASE_WEIGHTS[id] ?? 10;
      if (isUnlocked(id)) {
        w *= GACHA_DUPLICATE_WEIGHT_MULTIPLIER;
      }
      return { id, w };
    });

    const totalWeight = weights.reduce((sum, item) => sum + item.w, 0);
    const result = {} as Record<SkinId, number>;
    for (const item of weights) {
      result[item.id] = totalWeight > 0 ? (item.w / totalWeight) * 100 : 0;
    }
    return result;
  }

  pickSkin(
    seedOrNonce: number,
    availablePool?: SkinId[],
    inventoryOrUnlocked?: UnlockedSource
  ): SkinId {
    if (seedOrNonce === 0) {
      return 'corgi';
    }

    const candidateIds = availablePool && availablePool.length > 0
      ? availablePool
      : ALL_SKINS.map((s) => s.id);

    if (candidateIds.length === 1) return candidateIds[0];

    const isUnlocked = extractUnlockedChecker(inventoryOrUnlocked);

    const rand = !Number.isInteger(seedOrNonce) && seedOrNonce > 0 && seedOrNonce < 1
      ? seedOrNonce
      : mulberry32(seedOrNonce);

    const weights = candidateIds.map((id) => {
      let w = SKIN_BASE_WEIGHTS[id] ?? 10;
      if (isUnlocked(id)) {
        w *= GACHA_DUPLICATE_WEIGHT_MULTIPLIER;
      }
      return { id, w };
    });

    const totalWeight = weights.reduce((sum, item) => sum + item.w, 0);
    let threshold = rand * totalWeight;
    for (const item of weights) {
      threshold -= item.w;
      if (threshold <= 0) {
        return item.id;
      }
    }
    return weights[weights.length - 1].id;
  }

  roll(
    seedOrNonce: number,
    wallet: CoinWallet,
    inventory: SkinInventory,
    forceSkinId?: SkinId,
    pool?: SkinId[]
  ): GachaRollResult {
    if (!wallet.canAfford(WORLD_CONFIG.GACHA_COST)) {
      return { success: false, reason: 'NOT_ENOUGH_COINS' };
    }

    const spent = wallet.spendCoins(WORLD_CONFIG.GACHA_COST);
    if (!spent) {
      return { success: false, reason: 'NOT_ENOUGH_COINS' };
    }

    const chosenSkin: SkinId = forceSkinId ?? this.pickSkin(seedOrNonce, pool, inventory);
    const rarity = this.getSkinRarity(chosenSkin);
    const isDuplicate = inventory.isUnlocked(chosenSkin);

    if (isDuplicate) {
      return {
        success: true,
        skinId: chosenSkin,
        rarity,
        isDuplicate: true,
        cashback: GACHA_DUPLICATE_CASHBACK,
      };
    }

    inventory.unlockSkin(chosenSkin);
    return {
      success: true,
      skinId: chosenSkin,
      rarity,
      isDuplicate: false,
      cashback: 0,
    };
  }

  applyCashback(wallet: CoinWallet, amount: number = GACHA_DUPLICATE_CASHBACK): number {
    if (amount > 0) {
      wallet.addCoins(amount);
      return amount;
    }
    return 0;
  }
}

