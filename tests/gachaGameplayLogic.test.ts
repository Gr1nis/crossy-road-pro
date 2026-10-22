import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ALL_SKINS, type SkinId, WORLD_CONFIG, type StorageAdapter } from '../src/core/types.ts';
import { CoinWallet } from '../src/core/wallet.ts';
import { SkinInventory } from '../src/core/skinInventory.ts';
import {
  GachaMachine,
  SKIN_RARITY_MAP,
  GACHA_DUPLICATE_CASHBACK,
} from '../src/core/gachaMachine.ts';
import { ScoreTracker } from '../src/core/scoreTracker.ts';
import {
  createGachaCardElement,
  revealGachaWinningCard,
  CARD_NAMES_UPPER,
} from '../src/view/gachaCardArt.ts';

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

describe('Gacha Machine Stage 3 — Silhouettes, Fair Pool & Continuous Conveyor Suite', () => {
  it('Requirement 1 (Core Pool Filtering): getAvailableSkins excludes already unlocked skins', () => {
    const gacha = new GachaMachine();
    const inventory = new SkinInventory(['corgi']);

    const available = gacha.getAvailableSkins(inventory);
    assert.equal(available.length, 4, 'Should have 4 locked skins remaining');
    assert.ok(!available.includes('corgi'), 'Unlocked corgi must NOT be in available pool');
    assert.deepEqual(available, ['pigeon_pizza', 'box_cat', 'raccoon_bandit', 'capybara_zen']);

    // Progressively unlock skins
    inventory.unlockSkin('box_cat');
    const availableAfter = gacha.getAvailableSkins(inventory);
    assert.equal(availableAfter.length, 3);
    assert.ok(!availableAfter.includes('box_cat'), 'box_cat must now be excluded from pool');

    inventory.unlockSkin('pigeon_pizza');
    inventory.unlockSkin('raccoon_bandit');
    inventory.unlockSkin('capybara_zen');
    assert.equal(gacha.getAvailableSkins(inventory).length, 0, 'Pool must be empty when all unlocked');
    assert.equal(gacha.isAllUnlocked(inventory), true, 'isAllUnlocked must report true');
  });

  it('Requirement 2 (Fair Weighted Selection): pickSkin strictly draws from provided pool', () => {
    const gacha = new GachaMachine();
    const restrictedPool: SkinId[] = ['box_cat', 'capybara_zen'];

    for (let seed = 1; seed <= 50; seed++) {
      const picked = gacha.pickSkin(seed * 7, restrictedPool);
      assert.ok(
        restrictedPool.includes(picked),
        `pickSkin with restrictedPool must only return members of pool, got: ${picked}`
      );
    }

    // Single item pool must return that single skin
    const singlePool: SkinId[] = ['capybara_zen'];
    assert.equal(gacha.pickSkin(42, singlePool), 'capybara_zen');
  });

  it('Requirement 3 (Full Collection Invariant): roll succeeds with duplicate cashback even when all skins unlocked', () => {
    const gacha = new GachaMachine();
    const wallet = new CoinWallet(500);
    const allIds = ALL_SKINS.map((s) => s.id);
    const inventory = new SkinInventory(allIds as SkinId[]);

    assert.equal(gacha.isAllUnlocked(inventory), true);

    const result = gacha.roll(1, wallet, inventory);
    assert.equal(result.success, true);
    assert.equal(result.isDuplicate, true);
    assert.equal(result.cashback, 40);
    assert.equal(wallet.getCoins(), 400, 'During spin, player wallet drops by full 100 coins (500 - 100 = 400)');
    gacha.applyCashback(wallet, result.cashback);
    assert.equal(wallet.getCoins(), 440, 'After spin finishes, +40 cashback is credited (400 + 40 = 440)');
  });

  it('Requirement 4 (Insufficient Coins Invariant): roll fails if wallet < 100 coins', () => {
    const gacha = new GachaMachine();
    const wallet = new CoinWallet(50);
    const inventory = new SkinInventory(['corgi']);

    const result = gacha.roll(1, wallet, inventory);
    assert.equal(result.success, false);
    assert.equal(result.reason, 'NOT_ENOUGH_COINS');
    assert.equal(wallet.getCoins(), 50);
  });

  it('Requirement 5 (Duplicate Cashback Handling): forced duplicate grants +40 cashback delayed after spin', () => {
    const gacha = new GachaMachine();
    const wallet = new CoinWallet(200);
    const inventory = new SkinInventory(['corgi']);

    // Force duplicate corgi
    const result = gacha.roll(1, wallet, inventory, 'corgi');
    assert.equal(result.success, true);
    assert.equal(result.skinId, 'corgi');
    assert.equal(result.isDuplicate, true);
    assert.equal(result.cashback, GACHA_DUPLICATE_CASHBACK);
    // 200 - 100 = 100 during spin
    assert.equal(wallet.getCoins(), 100, 'Wallet drops by full 100 during spin');
    gacha.applyCashback(wallet, result.cashback);
    // 100 + 40 = 140 after spin
    assert.equal(wallet.getCoins(), 140, 'Cashback +40 credited after spin completes');
  });

  it('Requirement 6 (ScoreTracker Full Pool & Duplicate Cashback): rolls can yield duplicates with delayed cashback, and roll never blocks when full collection', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);
    tracker.addCoins(1000);

    const initialUnlocked = tracker.getUnlockedSkins();
    assert.deepEqual(initialUnlocked, ['corgi']);

    // Roll duplicate corgi
    const dupRes = tracker.rollGacha(0, 'corgi');
    assert.equal(dupRes.success, true);
    assert.equal(dupRes.isDuplicate, true);
    assert.equal(dupRes.cashback, 40);
    assert.equal(tracker.getCoins(), 900, 'Initial roll deducts full 100 coins (1000 - 100 = 900)');
    tracker.claimDuplicateCashback(dupRes.cashback);
    assert.equal(tracker.getCoins(), 940, 'Cashback credited separately (900 + 40 = 940)');

    // Unlock remaining skins
    tracker.rollGacha(0, 'box_cat');
    tracker.rollGacha(0, 'pigeon_pizza');
    tracker.rollGacha(0, 'raccoon_bandit');
    tracker.rollGacha(0, 'capybara_zen');

    assert.equal(tracker.getUnlockedSkins().length, 5);
    assert.equal(tracker.isAllSkinsUnlocked(), true);

    // Roll when all 5 skins are already unlocked: must succeed with duplicate cashback
    const extraRoll = tracker.rollGacha(1);
    assert.equal(extraRoll.success, true);
    assert.equal(extraRoll.isDuplicate, true);
    assert.equal(extraRoll.cashback, 40);
    const coinsBefore = tracker.getCoins();
    tracker.claimDuplicateCashback(extraRoll.cashback);
    assert.equal(tracker.getCoins(), coinsBefore + 40);
  });

  it('Requirement 7 (Card Art - Silhouettes vs Full Color): createGachaCardElement supports both silhouettes and full color cards', () => {
    // Simulated DOM environment
    const originalDocument = globalThis.document;
    const mockElements: any[] = [];

    (globalThis as any).document = {
      createElement: (tag: string) => {
        const attrs: Record<string, string> = {};
        const styles: Record<string, string> = {};
        const classes = new Set<string>();
        let _className = '';
        const el: any = {
          tagName: tag.toUpperCase(),
          get className() { return _className; },
          set className(v: string) {
            _className = v;
            classes.clear();
            v.split(/\s+/).filter(Boolean).forEach((c) => classes.add(c));
          },
          innerHTML: '',
          setAttribute: (k: string, v: string) => { attrs[k] = v; },
          getAttribute: (k: string) => attrs[k] ?? null,
          classList: {
            add: (...cls: string[]) => cls.forEach((c) => classes.add(c)),
            remove: (...cls: string[]) => cls.forEach((c) => classes.delete(c)),
            contains: (c: string) => classes.has(c),
          },
          style: {
            setProperty: (k: string, v: string) => { styles[k] = v; },
            getPropertyValue: (k: string) => styles[k] ?? '',
          },
          querySelector: (sel: string) => {
            if (sel === '.gacha-card-character') return el._charChild;
            if (sel === '.gacha-card-name') return el._nameChild;
            return null;
          },
        };
        mockElements.push(el);
        return el;
      },
    };

    try {
      // 1. Locked skin: silhouette
      const lockedCard = createGachaCardElement('capybara_zen', 7, true);
      assert.ok(lockedCard.classList.contains('gacha-roulette-card'));
      assert.ok(lockedCard.classList.contains('glow-legendary'), 'Must have glow-legendary rarity class');
      assert.equal(lockedCard.getAttribute('data-skin-id'), 'capybara_zen');
      assert.equal(lockedCard.getAttribute('data-index'), '7');
      assert.ok(lockedCard.innerHTML.includes('card-silhouette'), 'Inner SVG must have card-silhouette class');
      assert.ok(lockedCard.innerHTML.includes('??? LEGENDARY'), 'Displayed name must be masked with ??? and rarity');
      assert.ok(lockedCard.innerHTML.includes('data-real-name="CAPYBARA"'), 'data-real-name must store authentic name');

      // 2. Unlocked/owned skin: full color
      const ownedCard = createGachaCardElement('corgi', 2, false);
      assert.ok(ownedCard.classList.contains('gacha-roulette-card'));
      assert.ok(ownedCard.classList.contains('glow-common'), 'Must have glow-common rarity class');
      assert.equal(ownedCard.getAttribute('data-skin-id'), 'corgi');
      assert.ok(!ownedCard.innerHTML.includes('card-silhouette'), 'Owned skin card must NOT have card-silhouette class');
      assert.ok(ownedCard.innerHTML.includes('>CORGI<'), 'Displayed name must show real name CORGI, not masked');
    } finally {
      (globalThis as any).document = originalDocument;
    }
  });

  it('Requirement 8 (Reveal on Win): revealGachaWinningCard removes silhouette and unveils real name', () => {
    const originalDocument = globalThis.document;
    const charElClasses = new Set<string>(['card-silhouette']);
    const cardElClasses = new Set<string>(['gacha-roulette-card', 'glow-epic']);
    const nameElClasses = new Set<string>();

    const mockCharEl: any = {
      classList: {
        remove: (c: string) => charElClasses.delete(c),
        add: (c: string) => charElClasses.add(c),
        contains: (c: string) => charElClasses.has(c),
      },
    };
    const mockNameEl: any = {
      textContent: '??? EPIC',
      getAttribute: (k: string) => (k === 'data-real-name' ? 'RACCOON' : null),
      classList: {
        add: (c: string) => nameElClasses.add(c),
        contains: (c: string) => nameElClasses.has(c),
      },
    };

    const mockCardEl: any = {
      classList: {
        add: (c: string) => cardElClasses.add(c),
        contains: (c: string) => cardElClasses.has(c),
      },
      querySelector: (sel: string) => {
        if (sel === '.gacha-card-character') return mockCharEl;
        if (sel === '.gacha-card-name') return mockNameEl;
        return null;
      },
    };

    (globalThis as any).document = { createElement: () => ({}) };

    try {
      revealGachaWinningCard(mockCardEl, 'raccoon_bandit');

      assert.ok(cardElClasses.has('winning-card'), 'Winning card class must be added');
      assert.ok(!charElClasses.has('card-silhouette'), 'Silhouette class must be stripped on win');
      assert.ok(charElClasses.has('reveal-pop'), 'reveal-pop animation class must be attached');
      assert.equal(mockNameEl.textContent, 'RACCOON', 'Real character name must be unveiled');
      assert.ok(nameElClasses.has('name-revealed'), 'name-revealed animation class must be attached');
    } finally {
      (globalThis as any).document = originalDocument;
    }
  });

  it('Requirement 9 (Core/View Architectural Purity): src/core/gachaMachine.ts has zero DOM / Three.js imports', () => {
    const corePath = path.join(process.cwd(), 'src', 'core', 'gachaMachine.ts');
    const content = fs.readFileSync(corePath, 'utf8');

    assert.ok(!content.includes('three'), 'src/core/ must NEVER import Three.js');
    assert.ok(!content.includes('THREE'), 'src/core/ must NEVER reference THREE namespace');
    assert.ok(!content.includes('document.'), 'src/core/ must NEVER reference document');
    assert.ok(!content.includes('window.'), 'src/core/ must NEVER reference window');
    assert.ok(!content.includes('HTMLElement'), 'src/core/ must NEVER reference HTMLElement');
  });

  it('Requirement 10 (File Length Architectural Gate): all touched files are <= 300 lines', () => {
    const files = [
      'src/core/gachaMachine.ts',
      'src/view/gachaCardArt.ts',
      'src/app/gachaRouletteAnim.ts',
      'src/app/gachaMachineModal.ts',
    ];

    for (const rel of files) {
      const fullPath = path.join(process.cwd(), rel);
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n').length;
      assert.ok(
        lines <= 300,
        `File ${rel} has ${lines} lines, which exceeds the max 300 lines architectural rule!`
      );
    }
  });
});
