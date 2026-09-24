import type { Lane, MoveDirectionValue, PlayerState, StorageAdapter } from './types.ts';

export class GameEngine {
  constructor(_seed: number = 42, _storage?: StorageAdapter) {
    throw new Error('NotImplemented: GameEngine');
  }

  getPlayer(): PlayerState {
    throw new Error('NotImplemented: GameEngine.getPlayer');
  }

  getLane(_row: number): Lane {
    throw new Error('NotImplemented: GameEngine.getLane');
  }

  getCameraZ(): number {
    throw new Error('NotImplemented: GameEngine.getCameraZ');
  }

  getScore(): number {
    throw new Error('NotImplemented: GameEngine.getScore');
  }

  getHighScore(): number {
    throw new Error('NotImplemented: GameEngine.getHighScore');
  }

  queueMove(_dir: MoveDirectionValue): void {
    throw new Error('NotImplemented: GameEngine.queueMove');
  }

  step(_dt: number): void {
    throw new Error('NotImplemented: GameEngine.step');
  }

  reset(_newSeed?: number): void {
    throw new Error('NotImplemented: GameEngine.reset');
  }
}
