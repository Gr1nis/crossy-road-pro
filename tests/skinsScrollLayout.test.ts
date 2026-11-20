import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SkinsCollectionModal } from '../src/app/skinsCollectionModal.ts';
import { ALL_SKINS } from '../src/core/types.ts';

describe('Skins & Worlds Modal Horizontal Slider & Clearance Suite', () => {
  const indexPath = path.join(process.cwd(), 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  it('Requirement 1: .modal-card-skins-pc has compact height and headroom preventing off-screen clipping', () => {
    assert.ok(
      indexHtml.includes('max-height: calc(100vh - 80px);'),
      'modal-card-skins-pc must have max-height calc(100vh - 80px) to stay on-screen'
    );
    assert.ok(
      indexHtml.includes('#skins-modal {') && indexHtml.includes('overflow-y: auto;'),
      '#skins-modal must have overflow-y: auto'
    );
    assert.ok(
      indexHtml.includes('margin-top: 36px;'),
      'modal-card-skins-pc must have margin-top: 36px to leave headroom for top 3D title'
    );
  });

  it('Requirement 2: .skins-cards-grid is styled as a horizontal slider (flex-direction: row, nowrap, overflow-x: auto)', () => {
    assert.ok(
      indexHtml.includes('.skins-cards-grid {') &&
      indexHtml.includes('overflow-x: auto;') &&
      indexHtml.includes('flex-wrap: nowrap;') &&
      indexHtml.includes('scroll-snap-type: x mandatory;'),
      'skins-cards-grid must be a horizontal slider (overflow-x: auto, flex-wrap: nowrap, scroll-snap-type: x mandatory)'
    );
    assert.ok(
      indexHtml.includes('.skins-cards-grid::-webkit-scrollbar'),
      'Custom styled horizontal scrollbar must be defined for skins-cards-grid'
    );
  });

  it('Requirement 3: Carousel buttons and keyboard navigation handle both single step and jump navigation', () => {
    const events: string[] = [];
    const elements = new Map<string, HTMLElement>();

    function mockEl(id: string): HTMLElement {
      const el = {
        id,
        classList: {
          contains: () => false,
          add: () => {},
          remove: () => {},
          toggle: () => false,
        },
        setAttribute: () => {},
        style: { setProperty: () => {} },
        innerHTML: '',
        appendChild: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        focus: () => {},
        scrollIntoView: () => { events.push(`scroll-${id}`); },
      } as unknown as HTMLElement;
      elements.set(id, el);
      return el;
    }

    // Mock DOM elements
    ['skins-modal', 'skins-modal-coins', 'skins-modal-close-btn', 'skins-modal-list',
     'skins-tab-btn-characters', 'skins-tab-btn-worlds', 'skins-tab-characters-content',
     'skins-tab-worlds-content', 'skins-worlds-list',
     'skins-carousel-prev', 'skins-carousel-next', 'worlds-carousel-prev', 'worlds-carousel-next'].forEach(mockEl);

    // Provide global document.getElementById
    if (typeof globalThis.document === 'undefined') {
      (globalThis as unknown as { document: unknown }).document = {
        getElementById: (id: string) => elements.get(id) || null,
        createElement: (tag: string) => mockEl(`mock-${tag}-${Math.random()}`),
      };
    }

    const modal = new SkinsCollectionModal({
      onSelectSkin: (id) => events.push(`select-${id}`),
    });

    modal.open(500, ['corgi'], 'corgi');
    assert.strictEqual(modal.getFocusedIndex(), 0, 'Initial focus on corgi (index 0)');

    // Press ArrowRight / KeyD -> advance 1 card
    modal.handleKeyDown({ code: 'ArrowRight', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 1, 'ArrowRight advances by 1 card');

    modal.handleKeyDown({ code: 'KeyD', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 2, 'KeyD advances by 1 card');

    // Press ArrowLeft / KeyA -> retreat 1 card
    modal.handleKeyDown({ code: 'ArrowLeft', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 1, 'ArrowLeft retreats by 1 card');

    modal.handleKeyDown({ code: 'KeyA', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 0, 'KeyA retreats by 1 card');

    // Press ArrowDown / KeyS -> jump 5 cards across slider
    modal.handleKeyDown({ code: 'ArrowDown', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 5, 'ArrowDown must jump 5 cards');

    modal.handleKeyDown({ code: 'KeyS', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 10, 'KeyS must jump 5 cards');

    // Press ArrowUp / KeyW -> jump back 5 cards
    modal.handleKeyDown({ code: 'ArrowUp', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 5, 'ArrowUp must retreat 5 cards');

    modal.handleKeyDown({ code: 'KeyW', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 0, 'KeyW must retreat 5 cards');

    modal.destroy();
  });
});
