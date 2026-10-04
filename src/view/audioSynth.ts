export class AudioSynth {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicVolume: number = 0.22;
  private isMusicPlaying: boolean = false;
  private musicTimerId: ReturnType<typeof setInterval> | null = null;
  private musicStep: number = 0;
  private isPaused: boolean = false;
  public masterGainNode: GainNode | null = null;
  public bgmGainNode: GainNode | null = null;
  public sfxGainNode: GainNode | null = null;
  public bgmFilterNode: BiquadFilterNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('crossy_setting_sound');
      if (savedSound !== null) {
        this.soundEnabled = savedSound !== 'false';
      }
      const savedMusic = localStorage.getItem('crossy_setting_music');
      if (savedMusic !== null) {
        this.musicEnabled = savedMusic !== 'false';
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
      if (this.musicEnabled && !this.isMusicPlaying) {
        this.startMusic();
      }
      const events = ['click', 'keydown', 'pointerdown', 'touchstart'];
      events.forEach((ev) => window.removeEventListener(ev, onGesture));
    };
    const events = ['click', 'keydown', 'pointerdown', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('crossy_setting_sound', String(enabled));
    }
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(enabled ? 1.0 : 0.0, this.ctx.currentTime);
    }
  }

  isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('crossy_setting_music', String(enabled));
    }
    if (this.bgmGainNode && this.ctx) {
      const target = enabled ? (this.isPaused ? this.musicVolume * 0.75 : this.musicVolume) : 0;
      this.bgmGainNode.gain.setValueAtTime(target, this.ctx.currentTime);
    }
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  private ensureContext(ignoreSoundFlag: boolean = false): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.masterGainNode.connect(this.ctx.destination);

        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(this.soundEnabled ? 1.0 : 0.0, this.ctx.currentTime);
        this.sfxGainNode.connect(this.masterGainNode);

        this.bgmGainNode = this.ctx.createGain();
        this.bgmGainNode.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0.0, this.ctx.currentTime);
        this.bgmGainNode.connect(this.masterGainNode);

        this.bgmFilterNode = this.ctx.createBiquadFilter();
        this.bgmFilterNode.type = 'lowpass';
        this.bgmFilterNode.frequency.setValueAtTime(20000, this.ctx.currentTime);
        this.bgmFilterNode.connect(this.bgmGainNode);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  onPause(): void {
    this.isPaused = true;
    if (this.ctx && this.bgmFilterNode && this.bgmGainNode) {
      const now = this.ctx.currentTime;
      this.bgmFilterNode.frequency.setTargetAtTime(950, now, 0.1);
      const target = this.musicEnabled ? this.musicVolume * 0.75 : 0;
      this.bgmGainNode.gain.setTargetAtTime(target, now, 0.1);
    }
  }

  onResume(): void {
    this.isPaused = false;
    if (this.ctx && this.bgmFilterNode && this.bgmGainNode) {
      const now = this.ctx.currentTime;
      this.bgmFilterNode.frequency.setTargetAtTime(20000, now, 0.1);
      const target = this.musicEnabled ? this.musicVolume : 0;
      this.bgmGainNode.gain.setTargetAtTime(target, now, 0.1);
    }
  }

  startMusic(): void {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    const ctx = this.ensureContext(true);
    if (!ctx) return;

    this.isMusicPlaying = true;
    // Unobtrusive pentatonic chiptune-lite groove (16-step sequence, 220ms per step)
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
      if (!this.isMusicPlaying || !this.musicEnabled) return;
      const activeCtx = this.ensureContext(true);
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
        bGain.gain.setValueAtTime(0.055 * this.musicVolume, now);
        bGain.gain.exponentialRampToValueAtTime(0.002, now + 0.18);
        bOsc.connect(bGain);
        bGain.connect(this.bgmFilterNode ?? activeCtx.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.19);
      }

      const leadFreq = leadNotes[step];
      if (leadFreq > 0) {
        const lOsc = activeCtx.createOscillator();
        const lGain = activeCtx.createGain();
        lOsc.type = 'sine';
        lOsc.frequency.setValueAtTime(leadFreq, now);
        lGain.gain.setValueAtTime(0.038 * this.musicVolume, now);
        lGain.gain.exponentialRampToValueAtTime(0.002, now + 0.16);
        lOsc.connect(lGain);
        lGain.connect(this.bgmFilterNode ?? activeCtx.destination);
        lOsc.start(now);
        lOsc.stop(now + 0.17);
      }
    }, 220);
  }

  stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicTimerId !== null) {
      clearInterval(this.musicTimerId);
      this.musicTimerId = null;
    }
  }

  playHop(comboMultiplier: number = 1, surface: 'grass' | 'road' | 'log' | 'rail' = 'grass'): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const pitchScale = 1 + (Math.max(1, comboMultiplier) - 1) * 0.14;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (surface === 'log') {
      // Warm hollow wooden clack
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(220 * pitchScale, now + 0.07);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.075);
    } else if (surface === 'road') {
      // Crisp asphalt tap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(620 * pitchScale, now + 0.065);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
    } else if (surface === 'rail') {
      // Metallic ping
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(780 * pitchScale, now + 0.08);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.085);
    } else {
      // Soft bouncy grass hop
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

  playCoin(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  playGacha(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

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

  playTrainWhistle(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

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

  playCrash(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

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

  playSplash(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

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

  playSkinVoice(skinId: string = 'chicken'): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const id = skinId.toLowerCase();

    if (id.includes('duck')) {
      // Cyber-Duck: nasal synth quack with digital pitch inflection
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(410, now + 0.045);
      osc.frequency.exponentialRampToValueAtTime(530, now + 0.09);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.095);
      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (id.includes('ninja') || id.includes('shadow')) {
      // Shadow-Ninja: stealthy swift blade/breath accent
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.055);
      gain.gain.setValueAtTime(0.085, now);
      gain.gain.exponentialRampToValueAtTime(0.004, now + 0.06);
      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(now);
      osc.stop(now + 0.065);
    } else if (id.includes('penguin') || id.includes('frost')) {
      // Frost-Penguin: crystalline icy chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.065);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.075);
      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      // Classic Chicken (and custom skins): playful bawk-cluck inflection
      let hash = 0;
      for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
      const offset = id === 'chicken' ? 1 : 0.85 + ((Math.abs(hash) % 35) / 100);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540 * offset, now);
      osc.frequency.exponentialRampToValueAtTime(790 * offset, now + 0.035);
      osc.frequency.exponentialRampToValueAtTime(610 * offset, now + 0.075);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
    }
  }

  playGachaRoll(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

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

  playGachaUnlock(isRare: boolean = false): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

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

  playNewHighScore(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

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
