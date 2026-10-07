import { ALL_SKINS, type SkinId } from './types.ts';

const DEFAULT_SKIN: SkinId = 'corgi';
const VALID_SKIN_IDS: ReadonlySet<SkinId> = new Set(ALL_SKINS.map((s) => s.id));

/**
 * SkinInventory manages unlocked skins and the currently equipped skin.
 * Decoupled from storage, view, and game loop.
 */
export class SkinInventory {
  private unlocked: Set<SkinId>;
  private selected: SkinId;

  constructor(
    initialUnlocked: SkinId[] = [DEFAULT_SKIN],
    initialSelected: SkinId = DEFAULT_SKIN
  ) {
    this.unlocked = new Set<SkinId>();
    this.unlocked.add(DEFAULT_SKIN);

    if (Array.isArray(initialUnlocked)) {
      for (const skin of initialUnlocked) {
        if (VALID_SKIN_IDS.has(skin)) {
          this.unlocked.add(skin);
        }
      }
    }

    if (VALID_SKIN_IDS.has(initialSelected) && this.unlocked.has(initialSelected)) {
      this.selected = initialSelected;
    } else {
      this.selected = DEFAULT_SKIN;
    }
  }

  getUnlockedSkins(): SkinId[] {
    return Array.from(this.unlocked);
  }

  isUnlocked(skinId: SkinId): boolean {
    return this.unlocked.has(skinId);
  }

  getSelectedSkin(): SkinId {
    return this.selected;
  }

  selectSkin(skinId: SkinId): boolean {
    if (!this.unlocked.has(skinId)) {
      return false;
    }
    this.selected = skinId;
    return true;
  }

  unlockSkin(skinId: SkinId): boolean {
    if (!VALID_SKIN_IDS.has(skinId) || this.unlocked.has(skinId)) {
      return false;
    }
    this.unlocked.add(skinId);
    return true;
  }
}
