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

for (const skin of ALL_SKINS) {
  const rarity = SKIN_RARITY_MAP[skin.id] ?? SkinRarity.COMMON;
  GACHA_SKINS_BY_RARITY[rarity].push(skin.id);
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

  pickSkin(seedOrNonce: number, availablePool?: SkinId[]): SkinId {
    if (availablePool && availablePool.length > 0) {
      if (availablePool.length === 1) return availablePool[0];
      const rand = !Number.isInteger(seedOrNonce) && seedOrNonce > 0 && seedOrNonce < 1
        ? seedOrNonce
        : mulberry32(seedOrNonce);

      const weights = availablePool.map((id) => SKIN_RARITY_WEIGHTS[this.getSkinRarity(id)] ?? 10);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let threshold = rand * totalWeight;
      for (let i = 0; i < availablePool.length; i++) {
        threshold -= weights[i];
        if (threshold <= 0) {
          return availablePool[i];
        }
      }
      return availablePool[availablePool.length - 1];
    }

    const rand = !Number.isInteger(seedOrNonce) && seedOrNonce > 0 && seedOrNonce < 1
      ? seedOrNonce
      : mulberry32(seedOrNonce);

    const rollPct = rand * 100;
    const selectFromList = (list: SkinId[], minPct: number, maxPct: number): SkinId => {
      if (list.length === 0) return 'corgi';
      if (list.length === 1) return list[0];
      if (Number.isInteger(seedOrNonce)) {
        return list[Math.abs(seedOrNonce) % list.length];
      }
      const range = maxPct - minPct;
      const idx = Math.min(
        list.length - 1,
        Math.floor(((rollPct - minPct) / range) * list.length)
      );
      return list[idx];
    };

    if (rollPct < 50) return selectFromList(GACHA_SKINS_BY_RARITY[SkinRarity.COMMON], 0, 50);
    if (rollPct < 80) return selectFromList(GACHA_SKINS_BY_RARITY[SkinRarity.RARE], 50, 80);
    if (rollPct < 95) return selectFromList(GACHA_SKINS_BY_RARITY[SkinRarity.EPIC], 80, 95);
    return selectFromList(GACHA_SKINS_BY_RARITY[SkinRarity.LEGENDARY], 95, 100);
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

    const chosenSkin: SkinId = forceSkinId ?? this.pickSkin(seedOrNonce, pool);
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

