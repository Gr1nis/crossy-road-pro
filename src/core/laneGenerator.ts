import type { Lane } from './types.ts';

export class LaneGenerator {
  constructor(_seed: number = 42) {
    throw new Error('NotImplemented: LaneGenerator');
  }

  generateLane(_index: number): Lane {
    throw new Error('NotImplemented: LaneGenerator.generateLane');
  }

  generateRange(_startIndex: number, _endIndex: number): Lane[] {
    throw new Error('NotImplemented: LaneGenerator.generateRange');
  }
}
