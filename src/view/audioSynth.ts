interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

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
      const AudioCtx =
        window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
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
      // Warm hollow wooden "tok" (pure sine 380Hz -> 190Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(190 * pitchScale, now + 0.07);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.075);
    } else if (surface === 'road') {
      // Muted neat voxel click without metallic rattle (triangle 320Hz -> 480Hz)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(480 * pitchScale, now + 0.06);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.065);
    } else if (surface === 'rail') {
      // Delicate glass-metallic chime instead of screaming saw (pure sine 880Hz -> 1046Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(1046.5 * pitchScale, now + 0.08);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.085);
    } else {
      // Soft bouncy grass rubber pop (sine 220Hz -> 360Hz with fast decay 0.07s)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(360 * pitchScale, now + 0.065);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.07);
    }

    osc.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playCoin(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Crystalline dual-tone chime (B5 -> E6) with soft anti-click attack and velvety decay
    const notes = [
      { freq: 987.77, start: now, dur: 0.18, gain: 0.12 }, // B5
      { freq: 1318.51, start: now + 0.055, dur: 0.24, gain: 0.14 }, // E6
    ];

    notes.forEach(({ freq, start, dur, gain: noteGain }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(noteGain, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.01);
    });
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

  playTrainWarning(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Vintage railway crossing bell: soft bell sines (660Hz / 880Hz) with exponential decay
    const bells = [
      { freq: 660, gain: 0.14, dur: 0.32 },
      { freq: 880, gain: 0.09, dur: 0.24 },
    ];
    bells.forEach(({ freq, gain: maxGain, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(maxGain, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.01);
    });
  }

  playTrainWhistle(): void {
    this.playTrainWarning();
  }

  playCrash(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Soft low-frequency impulse (110Hz -> 35Hz comic 'thud')
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.002, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);

    // Muted micro-noise puff ('poof-splat')
    const sampleRate = ctx.sampleRate || 44100;
    const bufferSize = Math.floor(sampleRate * 0.06);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const channelData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGainNode ?? ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.065);
  }

  playSplash(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Juicy cartoon water bubble "plop" with smoothed highs
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    // Subtle initial dip then juicy resonant bubble rise (260Hz -> 580Hz)
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.09);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.002, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
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
    this.playRecordFanfare();
  }

  playRecordFanfare(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Triumphant major arpeggio fanfare
    const notes = [
      { freq: 523.25, delay: 0.0, dur: 0.12, type: 'triangle' as OscillatorType, gain: 0.2 },
      { freq: 659.25, delay: 0.08, dur: 0.12, type: 'triangle' as OscillatorType, gain: 0.22 },
      { freq: 783.99, delay: 0.16, dur: 0.12, type: 'triangle' as OscillatorType, gain: 0.22 },
      { freq: 1046.5, delay: 0.24, dur: 0.18, type: 'triangle' as OscillatorType, gain: 0.24 },
      { freq: 1318.51, delay: 0.34, dur: 0.2, type: 'triangle' as OscillatorType, gain: 0.25 },
      { freq: 1567.98, delay: 0.44, dur: 0.45, type: 'triangle' as OscillatorType, gain: 0.26 },
      { freq: 1046.5, delay: 0.44, dur: 0.45, type: 'triangle' as OscillatorType, gain: 0.2 },
    ];
    notes.forEach(({ freq, delay, dur, type, gain: noteGain }) => {
      const t = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(noteGain, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + dur);
      osc.connect(gain);
      gain.connect(this.sfxGainNode ?? ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  }
}
