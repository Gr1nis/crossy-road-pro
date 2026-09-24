export class PRNG {
  constructor(_seed: number = 123456) {
    throw new Error('NotImplemented: PRNG');
  }

  next(): number {
    throw new Error('NotImplemented: PRNG.next');
  }

  nextInt(_min: number, _max: number): number {
    throw new Error('NotImplemented: PRNG.nextInt');
  }

  nextFloat(_min: number, _max: number): number {
    throw new Error('NotImplemented: PRNG.nextFloat');
  }
}
