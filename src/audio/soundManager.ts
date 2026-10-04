export class SoundManager {
  public ctx: AudioContext | null = null;
  public masterGainNode: GainNode | null = null;
  public bgmGainNode: GainNode | null = null;
  public sfxGainNode: GainNode | null = null;
  public bgmFilterNode: BiquadFilterNode | null = null;

  private isMusicPlaying = false;
  private musicTimerId: ReturnType<typeof setInterval> | null = null;
  private musicStep = 0;
  private isPaused = false;
  private isGameOver = false;

  private sfxVolume = 1.0;
  private sfxMuted = false;
  private musicVolume = 0.22;
  private musicMuted = false;
  private masterVolume = 1.0;
  private masterMuted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('crossy_setting_sound');
      if (savedSound !== null) {
        this.sfxMuted = savedSound === 'false';
      }
      const savedMusic = localStorage.getItem('crossy_setting_music');
      if (savedMusic !== null) {
        this.musicMuted = savedMusic === 'false';
      }
      this.setupUserGestureListener();
    }
  }

  private setupUserGestureListener(): void {
    if (typeof window === 'undefined') return;
    const onGesture = () => {
      this.ensureContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (!this.musicMuted && !this.isMusicPlaying && !this.isGameOver) {
        this.startMusic();
      }
      const events = ['click', 'keydown', 'pointerdown', 'touchstart'];
      events.forEach((ev) => window.removeEventListener(ev, onGesture));
    };
    const events = ['click', 'keydown', 'pointerdown', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
  }

  public ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.masterMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(this.sfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      this.sfxGainNode.connect(this.masterGainNode);

      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.setValueAtTime(this.musicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
      this.bgmGainNode.connect(this.masterGainNode);

      this.bgmFilterNode = this.ctx.createBiquadFilter();
      this.bgmFilterNode.type = 'lowpass';
      this.bgmFilterNode.frequency.setValueAtTime(20000, this.ctx.currentTime);
      this.bgmFilterNode.connect(this.bgmGainNode);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(this.sfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setSfxMuted(muted: boolean): void {
    this.sfxMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('crossy_setting_sound', String(!muted));
    }
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(muted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  public isSfxMuted(): boolean {
    return this.sfxMuted;
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmGainNode && this.ctx) {
      const target = this.musicMuted ? 0 : (this.isPaused ? this.musicVolume * 0.75 : this.musicVolume);
      this.bgmGainNode.gain.setValueAtTime(target, this.ctx.currentTime);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setMusicMuted(muted: boolean): void {
    this.musicMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('crossy_setting_music', String(!muted));
    }
    if (this.bgmGainNode && this.ctx) {
      const target = muted ? 0 : (this.isPaused ? this.musicVolume * 0.75 : this.musicVolume);
      this.bgmGainNode.gain.setValueAtTime(target, this.ctx.currentTime);
    }
    if (!muted && !this.isMusicPlaying && !this.isGameOver) {
      this.startMusic();
    }
  }

  public isMusicMuted(): boolean {
    return this.musicMuted;
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.masterMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterMuted(muted: boolean): void {
    this.masterMuted = muted;
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(muted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public isMasterMuted(): boolean {
    return this.masterMuted;
  }

  public isSoundEnabled(): boolean {
    return !this.sfxMuted && this.sfxVolume > 0;
  }

  public get soundEnabled(): boolean {
    return this.isSoundEnabled();
  }

  public set soundEnabled(enabled: boolean) {
    this.setSoundEnabled(enabled);
  }

  public setSoundEnabled(enabled: boolean): void {
    this.setSfxMuted(!enabled);
  }

  public isMusicEnabled(): boolean {
    return !this.musicMuted && this.musicVolume > 0;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.setMusicMuted(!enabled);
  }

  public setPaused(paused: boolean): void {
    if (paused) {
      this.onPause();
    } else {
      this.onResume();
    }
  }

  public pauseMusic(): void {
    this.onPause();
  }

  public resumeMusic(): void {
    this.onResume();
  }

  public isPlayingMusic(): boolean {
    return this.isMusicPlaying;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public onPause(): void {
    this.isPaused = true;
    if (this.ctx && this.bgmFilterNode && this.bgmGainNode) {
      const now = this.ctx.currentTime;
      this.bgmFilterNode.frequency.setTargetAtTime(950, now, 0.1);
      const target = this.musicMuted ? 0 : this.musicVolume * 0.75;
      this.bgmGainNode.gain.setTargetAtTime(target, now, 0.1);
    }
    if (!this.isMusicPlaying && !this.musicMuted) {
      this.startMusic();
    }
  }

  public onResume(): void {
    this.isPaused = false;
    if (this.ctx && this.bgmFilterNode && this.bgmGainNode) {
      const now = this.ctx.currentTime;
      this.bgmFilterNode.frequency.setTargetAtTime(20000, now, 0.1);
      const target = this.musicMuted ? 0 : this.musicVolume;
      this.bgmGainNode.gain.setTargetAtTime(target, now, 0.1);
    }
    if (!this.isMusicPlaying && !this.musicMuted) {
      this.startMusic();
    }
  }

  public onGameOver(): void {
    this.isGameOver = true;
    if (this.ctx && this.bgmGainNode) {
      this.bgmGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    }
  }

  public onReturnToMenu(): void {
    this.isGameOver = false;
    this.isPaused = false;
    if (this.ctx && this.bgmFilterNode && this.bgmGainNode) {
      const now = this.ctx.currentTime;
      this.bgmFilterNode.frequency.setTargetAtTime(20000, now, 0.05);
      const target = this.musicMuted ? 0 : this.musicVolume;
      this.bgmGainNode.gain.setTargetAtTime(target, now, 0.05);
    }
    if (!this.isMusicPlaying && !this.musicMuted) {
      this.startMusic();
    }
  }

  public startMusic(): void {
    if (this.musicMuted || this.isMusicPlaying || this.isGameOver) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    const bassNotes = [
      130.81, 0, 130.81, 164.81,
      174.61, 0, 174.61, 196.0,
      146.83, 0, 146.83, 174.61,
      196.0, 0, 164.81, 146.83,
    ];
    const leadNotes = [
      523.25, 0, 659.25, 587.33,
      523.25, 392.0, 440.0, 0,
      587.33, 0, 659.25, 783.99,
      659.25, 587.33, 523.25, 0,
    ];

    this.musicTimerId = setInterval(() => {
      if (!this.isMusicPlaying || this.musicMuted || !this.bgmFilterNode) return;
      const activeCtx = this.ensureContext();
      if (!activeCtx || activeCtx.state !== 'running') return;

      const step = this.musicStep % 16;
      this.musicStep++;
      const now = activeCtx.currentTime;

      const bassFreq = bassNotes[step];
      if (bassFreq > 0) {
        const bOsc = activeCtx.createOscillator();
        const bGain = activeCtx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bassFreq, now);
        bGain.gain.setValueAtTime(0.055, now);
        bGain.gain.exponentialRampToValueAtTime(0.002, now + 0.18);
        bOsc.connect(bGain);
        bGain.connect(this.bgmFilterNode);
        bOsc.start(now);
        bOsc.stop(now + 0.19);
      }

      const leadFreq = leadNotes[step];
      if (leadFreq > 0) {
        const lOsc = activeCtx.createOscillator();
        const lGain = activeCtx.createGain();
        lOsc.type = 'sine';
        lOsc.frequency.setValueAtTime(leadFreq, now);
        lGain.gain.setValueAtTime(0.038, now);
        lGain.gain.exponentialRampToValueAtTime(0.002, now + 0.16);
        lOsc.connect(lGain);
        lGain.connect(this.bgmFilterNode);
        lOsc.start(now);
        lOsc.stop(now + 0.17);
      }
    }, 220);
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicTimerId !== null) {
      clearInterval(this.musicTimerId);
      this.musicTimerId = null;
    }
  }

  public playHop(comboMultiplier: number = 1, surface: 'grass' | 'road' | 'log' | 'rail' = 'grass'): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const pitchScale = 1 + (Math.max(1, comboMultiplier) - 1) * 0.14;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (surface === 'log') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(220 * pitchScale, now + 0.07);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.075);
    } else if (surface === 'road') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(620 * pitchScale, now + 0.065);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
    } else if (surface === 'rail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(780 * pitchScale, now + 0.08);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.085);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(310 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(560 * pitchScale, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
    }

    osc.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playCoin(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playGacha(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.19);
    });
  }

  public playTrainWhistle(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    [440, 554.37].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.45);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    });
  }

  public playCrash(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.26, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public playSplash(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(95, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  }

  public playSkinVoice(skinId: string = 'chicken'): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const id = skinId.toLowerCase();

    if (id.includes('duck')) {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(410, now + 0.045);
      osc.frequency.exponentialRampToValueAtTime(530, now + 0.09);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.095);
    } else if (id.includes('ninja') || id.includes('shadow')) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.055);
      gain.gain.setValueAtTime(0.085, now);
      gain.gain.exponentialRampToValueAtTime(0.004, now + 0.06);
    } else if (id.includes('penguin') || id.includes('frost')) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.065);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.075);
    } else {
      let hash = 0;
      for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
      const offset = id === 'chicken' ? 1 : 0.85 + ((Math.abs(hash) % 35) / 100);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540 * offset, now);
      osc.frequency.exponentialRampToValueAtTime(790 * offset, now + 0.035);
      osc.frequency.exponentialRampToValueAtTime(610 * offset, now + 0.075);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.08);
    }

    osc.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playGachaRoll(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const ticks = [330, 392, 440, 523.25, 587.33, 659.25];
    ticks.forEach((freq, i) => {
      const t = now + i * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.045);
      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    });
  }

  public playGachaUnlock(isRare: boolean = false): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const notes = isRare
      ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]
      : [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isRare ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(isRare ? 0.15 : 0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(t);
      osc.stop(t + 0.23);
    });
  }

  public playNewHighScore(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const fanfare = [
      { freq: 523.25, delay: 0.0, dur: 0.11 },
      { freq: 659.25, delay: 0.1, dur: 0.11 },
      { freq: 783.99, delay: 0.2, dur: 0.11 },
      { freq: 1046.5, delay: 0.31, dur: 0.34 },
    ];
    fanfare.forEach(({ freq, delay, dur }) => {
      const t = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + dur);
      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    });
  }
}

export { SoundManager as AudioSynth };
export default SoundManager;
