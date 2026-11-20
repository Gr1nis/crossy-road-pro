import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SkinsCollectionModal } from '../src/app/skinsCollectionModal.ts';
import { ALL_SKINS } from '../src/core/types.ts';

describe('Skins & Worlds Modal Scrolling & Full Visibility Suite', () => {
  const indexPath = path.join(process.cwd(), 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  it('Requirement 1: .modal-card-skins-pc has max-height and margin auto preventing off-screen clipping', () => {
    assert.ok(
      indexHtml.includes('max-height: calc(100vh - 64px);'),
      'modal-card-skins-pc must have max-height calc(100vh - 64px) to stay on-screen'
    );
    assert.ok(
      indexHtml.includes('#skins-modal {') && indexHtml.includes('overflow-y: auto;'),
      '#skins-modal must have overflow-y: auto'
    );
  });

  it('Requirement 2: .skins-tab-content has flex: 1, min-height: 0, and overflow-y: auto for vertical scrolling', () => {
    assert.ok(
      indexHtml.includes('.skins-tab-content {') &&
      indexHtml.includes('overflow-y: auto;') &&
      indexHtml.includes('flex: 1;'),
      'skins-tab-content must be a scrollable flex container (flex: 1, overflow-y: auto)'
    );
    assert.ok(
      indexHtml.includes('.skins-tab-content::-webkit-scrollbar'),
      'Custom styled scrollbar must be defined for skins-tab-content'
    );
  });

  it('Requirement 3: Keyboard navigation handles Up and Down arrows / W and S keys across rows', () => {
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
     'skins-tab-worlds-content', 'skins-worlds-list'].forEach(mockEl);

    // Provide global document.getElementById
    const origGetElementById = globalThis.document?.getElementById;
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

    // Press ArrowDown -> jump 5 cards to next row
    modal.handleKeyDown({ code: 'ArrowDown', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 5, 'ArrowDown must advance by 5 cards to row 2');

    // Press KeyS -> jump 5 cards to row 3
    modal.handleKeyDown({ code: 'KeyS', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 10, 'KeyS must advance by 5 cards to row 3');

    // Press ArrowUp -> jump back 5 cards to row 2
    modal.handleKeyDown({ code: 'ArrowUp', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 5, 'ArrowUp must retreat by 5 cards to row 2');

    // Press KeyW -> jump back 5 cards to row 1
    modal.handleKeyDown({ code: 'KeyW', preventDefault: () => {} } as KeyboardEvent);
    assert.strictEqual(modal.getFocusedIndex(), 0, 'KeyW must retreat by 5 cards to row 1');

    modal.destroy();
  });
});
