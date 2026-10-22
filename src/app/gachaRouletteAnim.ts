export interface RouletteAnimCallbacks {
  onTick: (pitch: number) => void;
  onSpinFinished: (targetIndex: number) => void;
}

/**
 * GachaRouletteAnim manages the physics, timing, and RAF loops
 * for continuous ambient conveyor scrolling and deceleration spin.
 */
export class GachaRouletteAnim {
  private readonly trackEl: HTMLElement | null;
  private readonly viewportEl: HTMLElement | null;
  private readonly callbacks: RouletteAnimCallbacks;

  private animFrameId: number | null = null;
  private ambientAnimId: number | null = null;
  private ambientLastTime = 0;
  private ambientOffset = 0;
  private ambientRepeatWidth = 1312;
  private readonly AMBIENT_SPEED = 48; // px / second

  constructor(
    trackEl: HTMLElement | null,
    viewportEl: HTMLElement | null,
    callbacks: RouletteAnimCallbacks
  ) {
    this.trackEl = trackEl;
    this.viewportEl = viewportEl;
    this.callbacks = callbacks;
  }

  public setRepeatWidth(width: number): void {
    this.ambientRepeatWidth = width;
  }

  public resetAmbientOffset(): void {
    this.ambientOffset = 0;
  }

  public setPosition(x: number): void {
    if (this.trackEl) {
      this.trackEl.style.transform = `translateX(${x.toFixed(2)}px)`;
    }
  }

  public startAmbient(): void {
    this.stopAmbient();
    if (!this.trackEl || typeof requestAnimationFrame === 'undefined') return;

    this.ambientLastTime = performance.now();
    const animate = (now: number) => {
      if (!this.trackEl) {
        this.ambientAnimId = null;
        return;
      }
      const dt = Math.min(0.1, (now - this.ambientLastTime) / 1000);
      this.ambientLastTime = now;
      this.ambientOffset += this.AMBIENT_SPEED * dt;

      const L = this.ambientRepeatWidth || 1312;
      const currentX = -(this.ambientOffset % L);
      this.trackEl.style.transform = `translateX(${currentX.toFixed(2)}px)`;

      this.ambientAnimId = requestAnimationFrame(animate);
    };

    this.ambientAnimId = requestAnimationFrame(animate);
  }

  public stopAmbient(): void {
    if (this.ambientAnimId !== null) {
      if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(this.ambientAnimId);
      this.ambientAnimId = null;
    }
  }

  public isSpinning(): boolean {
    return this.animFrameId !== null;
  }

  public startSpin(
    targetIndex: number,
    totalCards: number,
    cardPitch: number = 164,
    duration: number = 3800
  ): void {
    this.stopAmbient();
    this.stopSpin();
    if (!this.trackEl) return;
    if (typeof requestAnimationFrame === 'undefined') {
      this.callbacks.onSpinFinished(targetIndex);
      return;
    }

    const viewportW = this.viewportEl?.clientWidth || 780;
    const startX = 0;
    const targetX = viewportW / 2 - (targetIndex * cardPitch + 75);

    this.trackEl.style.transform = `translateX(${startX}px)`;

    const startTime = performance.now();
    let lastTickedCard = -1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const tau = Math.min(1.0, elapsed / duration);
      // Quartic ease out: fast initial spin, silky smooth gradual deceleration
      const progress = 1.0 - Math.pow(1.0 - tau, 4);
      const currentX = startX + (targetX - startX) * progress;

      if (this.trackEl) {
        this.trackEl.style.transform = `translateX(${currentX.toFixed(2)}px)`;
      }

      // Ratchet tick sounds as cards cross center marker
      const centerPos = viewportW / 2 - currentX;
      const currentIdx = Math.floor(centerPos / cardPitch);
      if (currentIdx !== lastTickedCard && currentIdx >= 0 && currentIdx <= totalCards) {
        lastTickedCard = currentIdx;
        const pitch = 0.8 + 0.6 * (1.0 - progress);
        this.callbacks.onTick(pitch);
      }

      if (tau < 1.0) {
        this.animFrameId = requestAnimationFrame(animate);
      } else {
        this.animFrameId = null;
        if (this.trackEl) {
          this.trackEl.style.transform = `translateX(${targetX}px)`;
        }
        this.callbacks.onSpinFinished(targetIndex);
      }
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  public stopSpin(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public stopAll(): void {
    this.stopAmbient();
    this.stopSpin();
  }
}
