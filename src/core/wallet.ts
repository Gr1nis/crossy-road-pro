/**
 * CoinWallet manages player currency balance with strict validation.
 * Decoupled from storage, view, and game loop.
 */
export class CoinWallet {
  private coins: number;

  constructor(initialCoins: number = 0) {
    this.coins = Number.isFinite(initialCoins) && initialCoins >= 0
      ? Math.floor(initialCoins)
      : 0;
  }

  getCoins(): number {
    return this.coins;
  }

  setCoins(amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) {
      return;
    }
    this.coins = Math.floor(amount);
  }

  addCoins(amount: number): number {
    if (!Number.isFinite(amount) || amount <= 0) {
      return this.coins;
    }
    this.coins += Math.floor(amount);
    return this.coins;
  }

  canAfford(amount: number): boolean {
    if (!Number.isFinite(amount) || amount < 0) {
      return false;
    }
    return this.coins >= Math.floor(amount);
  }

  spendCoins(amount: number): boolean {
    if (!this.canAfford(amount)) {
      return false;
    }
    this.coins -= Math.floor(amount);
    return true;
  }
}
