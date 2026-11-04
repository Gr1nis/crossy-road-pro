import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_SKINS, type SkinId, type StorageAdapter } from '../src/core/types.ts';
import { GachaMachine, SkinRarity } from '../src/core/gachaMachine.ts';
import { ScoreTracker } from '../src/core/scoreTracker.ts';
import { GameEngine } from '../src/core/gameEngine.ts';
import { preloadGachaCardThumbnails, GACHA_CARD_THUMB_CACHE } from '../src/view/gachaCardArt.ts';

class MemoryStorage implements StorageAdapter {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

describe('Gacha Machine — All 10 Urban Characters Drop Suite', () => {
  it('Property 1 (All 10 skins can drop): pickSkin yields all 10 characters over multiple nonce rolls', () => {
    const gacha = new GachaMachine();
    const droppedSkins = new Set<SkinId>();

    // Roll across nonces (simulating player rolls in gameplay)
    for (let nonce = 1; nonce <= 600; nonce++) {
      const skin = gacha.pickSkin(nonce);
      droppedSkins.add(skin);
    }

    assert.equal(ALL_SKINS.length, 20, 'ALL_SKINS must define exactly 20 characters');

    for (const skin of ALL_SKINS) {
      assert.ok(
        droppedSkins.has(skin.id),
        `Character "${skin.id}" (${skin.name}) must be able to drop from gacha machine!`
      );
    }

    // Explicitly verify the 5 newly added characters
    const newCharacters: SkinId[] = [
      'barista_pug',
      'skater_ferret',
      'subway_rat',
      'raincoat_duck',
      'pigeon_king',
    ];

    for (const id of newCharacters) {
      assert.ok(
        droppedSkins.has(id),
        `Newly added character "${id}" must drop from gacha rolls`
      );
    }
  });

  it('Property 2 (Rarity distribution consistency): all rarities are represented and have proper proportions', () => {
    const gacha = new GachaMachine();
    const rarityCounts: Record<string, number> = {
      [SkinRarity.COMMON]: 0,
      [SkinRarity.RARE]: 0,
      [SkinRarity.EPIC]: 0,
      [SkinRarity.LEGENDARY]: 0,
    };

    const totalRolls = 2000;
    for (let nonce = 1; nonce <= totalRolls; nonce++) {
      const skin = gacha.pickSkin(nonce);
      const rarity = gacha.getSkinRarity(skin);
      rarityCounts[rarity] = (rarityCounts[rarity] || 0) + 1;
    }

    // Common ~50% (40% - 60% tolerance)
    const commonPct = (rarityCounts[SkinRarity.COMMON] / totalRolls) * 100;
    assert.ok(commonPct >= 40 && commonPct <= 60, `Common drops should be ~50%, got ${commonPct}%`);

    // Rare ~30% (22% - 38% tolerance)
    const rarePct = (rarityCounts[SkinRarity.RARE] / totalRolls) * 100;
    assert.ok(rarePct >= 22 && rarePct <= 38, `Rare drops should be ~30%, got ${rarePct}%`);

    // Epic ~15% (10% - 22% tolerance)
    const epicPct = (rarityCounts[SkinRarity.EPIC] / totalRolls) * 100;
    assert.ok(epicPct >= 10 && epicPct <= 22, `Epic drops should be ~15%, got ${epicPct}%`);

    // Legendary ~5% (2% - 10% tolerance)
    const legPct = (rarityCounts[SkinRarity.LEGENDARY] / totalRolls) * 100;
    assert.ok(legPct >= 2 && legPct <= 10, `Legendary drops should be ~5%, got ${legPct}%`);
  });

  it('Property 3 (ScoreTracker gameplay roll progression): naturally rolls and unlocks all 10 skins', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);

    // Initial state: only corgi is unlocked
    assert.deepEqual(tracker.getUnlockedSkins(), ['corgi']);

    // Provide enough coins to roll until all skins are unlocked
    let rolls = 0;
    const maxRolls = 500;
    while (!tracker.isAllSkinsUnlocked() && rolls < maxRolls) {
      tracker.addCoins(100);
      rolls++;
      const res = tracker.rollGacha(rolls);
      assert.equal(res.success, true);
      if (res.isDuplicate) {
        tracker.claimDuplicateCashback(res.cashback ?? 40);
      }
    }

    assert.equal(tracker.isAllSkinsUnlocked(), true, 'Player must be able to unlock all 20 characters');
    assert.equal(tracker.getUnlockedSkins().length, 20, 'All 20 characters unlocked');
  });

  it('Property 4 (Thumbnail preloading): preloadGachaCardThumbnails caches all 10 character thumbnails', () => {
    preloadGachaCardThumbnails();
    for (const skin of ALL_SKINS) {
      assert.ok(
        GACHA_CARD_THUMB_CACHE.has(skin.id),
        `Thumbnail cache must include character "${skin.id}"`
      );
    }
  });

  it('Property 5 (GameEngine live gacha rolls): engine.rollGacha() rolls all 10 characters in live gameplay simulation', () => {
    const storage = new MemoryStorage();
    const engine = new GameEngine(42, storage);

    const droppedSkins = new Set<SkinId>();
    // Provide coins and roll repeatedly
    for (let i = 0; i < 600; i++) {
      engine.addCoins(100);
      const res = engine.rollGacha();
      assert.equal(res.success, true);
      if (res.skinId) {
        droppedSkins.add(res.skinId);
      }
      if (res.isDuplicate && res.cashback) {
        engine.claimDuplicateCashback(res.cashback);
      }
    }

    assert.equal(droppedSkins.size, 20, 'Live GameEngine.rollGacha() must drop all 20 characters');
    const newCharacters: SkinId[] = [
      'barista_pug',
      'skater_ferret',
      'subway_rat',
      'raincoat_duck',
      'pigeon_king',
    ];
    for (const newSkin of newCharacters) {
      assert.ok(droppedSkins.has(newSkin), `New skin "${newSkin}" must drop in live GameEngine rolls`);
    }
  });

  it('Property 6 (Duplicate penalty in getDropProbabilities): unlocked characters have 0.25x weight and ~4x lower drop chance than new characters', () => {
    const gacha = new GachaMachine();

    // 1. Base probabilities (no unlocked skins):
    const baseProbs = gacha.getDropProbabilities();
    assert.equal(Math.round(baseProbs.corgi * 10) / 10, 6.3, 'Common base is 6.3%');
    assert.equal(Math.round(baseProbs.box_cat * 10) / 10, 6.0, 'Rare base is 6.0%');
    assert.equal(Math.round(baseProbs.raccoon_bandit * 10) / 10, 3.8, 'Epic base is 3.8%');
    assert.equal(Math.round(baseProbs.capybara_zen * 10) / 10, 1.7, 'Legendary base is 1.7%');

    // 2. With corgi unlocked:
    const probsWithCorgi = gacha.getDropProbabilities(new Set(['corgi']));
    const ratio = probsWithCorgi.pigeon_pizza / probsWithCorgi.corgi;
    assert.ok(Math.abs(ratio - 4.0) < 0.05, `New character chance must be 4x higher than owned duplicate (got ${ratio.toFixed(2)})`);

    // 3. When all skins are unlocked: relative chances return to base
    const allUnlockedProbs = gacha.getDropProbabilities(new Set(ALL_SKINS.map((s) => s.id)));
    assert.equal(Math.round(allUnlockedProbs.corgi * 10) / 10, 6.3);
    assert.equal(Math.round(allUnlockedProbs.box_cat * 10) / 10, 6.0);
    assert.equal(Math.round(allUnlockedProbs.raccoon_bandit * 10) / 10, 3.8);
    assert.equal(Math.round(allUnlockedProbs.capybara_zen * 10) / 10, 1.7);
  });

  it('Property 7 (Monte Carlo verification): pickSkin favors new skins over owned skins', () => {
    const gacha = new GachaMachine();
    const owned = new Set<SkinId>(['corgi', 'box_cat']);

    let corgiDrops = 0;
    let pizzaDrops = 0;
    const iterations = 5000;

    for (let i = 0; i < iterations; i++) {
      const picked = gacha.pickSkin(Math.random(), undefined, owned);
      if (picked === 'corgi') corgiDrops++;
      if (picked === 'pigeon_pizza') pizzaDrops++;
    }

    // pigeon_pizza (new Common) should drop ~4x more than corgi (owned Common)
    const observedRatio = pizzaDrops / Math.max(1, corgiDrops);
    assert.ok(
      observedRatio >= 2.8 && observedRatio <= 5.6,
      `Observed drop ratio for new vs owned Common should be ~4.0x (got ${observedRatio.toFixed(2)})`
    );
  });
});
