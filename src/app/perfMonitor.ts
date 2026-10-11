import { PerfMetricsTracker, type PerfSnapshot, type PerfBenchmarkReport } from './perfMetrics.ts';

export class PerfMonitor {
  private readonly tracker = new PerfMetricsTracker();
  private enabled = false;
  private rootEl: HTMLElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;

  // Cached DOM elements to avoid querySelector overhead
  private fpsValEl: HTMLElement | null = null;
  private lowFpsValEl: HTMLElement | null = null;
  private callsValEl: HTMLElement | null = null;
  private trisValEl: HTMLElement | null = null;
  private memValEl: HTMLElement | null = null;
  private breakdownValEl: HTMLElement | null = null;
  private worldValEl: HTMLElement | null = null;
  private benchBtnEl: HTMLElement | null = null;
  private isBenchActive = false;

  private lastDomUpdate = 0;
  private onBenchmarkComplete?: (report: PerfBenchmarkReport) => void;

  constructor() {
    this.createDomElements();
  }

  private createDomElements(): void {
    if (typeof document === 'undefined') return;

    let el = document.getElementById('perf-hud');
    if (!el) {
      el = document.createElement('div');
      el.id = 'perf-hud';
      el.className = 'perf-hud hidden';
      document.body.appendChild(el);
    }
    this.rootEl = el;

    el.innerHTML = `
      <div class="perf-header">
        <span class="perf-title">⚡ PERF TELEMETRY</span>
        <div class="perf-actions">
          <button id="perf-bench-btn" class="perf-btn" title="Стресс-тест на 60 полос">🚀 Тест</button>
          <button id="perf-report-btn" class="perf-btn" title="Показать отчёт (копирование)">📋 Отчёт</button>
          <button id="perf-close-btn" class="perf-btn" title="Скрыть (F3)">✖</button>
        </div>
      </div>
      <div class="perf-main-row">
        <div class="perf-fps-box">
          <span class="perf-fps-num" id="perf-fps-val">60</span>
          <span class="perf-fps-sub" id="perf-low-fps-val">1% Low: 60</span>
        </div>
        <canvas id="perf-sparkline" width="140" height="38" class="perf-canvas"></canvas>
      </div>
      <div class="perf-grid">
        <div class="perf-stat"><span class="perf-k">Calls:</span><span class="perf-v" id="perf-calls-val">0</span></div>
        <div class="perf-stat"><span class="perf-k">Tris:</span><span class="perf-v" id="perf-tris-val">0</span></div>
        <div class="perf-stat"><span class="perf-k">GPU Mem:</span><span class="perf-v" id="perf-mem-val">0</span></div>
        <div class="perf-stat"><span class="perf-k">World:</span><span class="perf-v" id="perf-world-val">0</span></div>
      </div>
      <div class="perf-breakdown" id="perf-breakdown-val">Core: 0ms | Sync: 0ms | GPU: 0ms</div>
    `;

    this.fpsValEl = document.getElementById('perf-fps-val');
    this.lowFpsValEl = document.getElementById('perf-low-fps-val');
    this.callsValEl = document.getElementById('perf-calls-val');
    this.trisValEl = document.getElementById('perf-tris-val');
    this.memValEl = document.getElementById('perf-mem-val');
    this.breakdownValEl = document.getElementById('perf-breakdown-val');
    this.worldValEl = document.getElementById('perf-world-val');
    this.benchBtnEl = document.getElementById('perf-bench-btn');

    this.canvasEl = document.getElementById('perf-sparkline') as HTMLCanvasElement | null;
    if (this.canvasEl) {
      this.canvasCtx = this.canvasEl.getContext('2d');
    }

    document.getElementById('perf-close-btn')?.addEventListener('click', () => {
      this.setEnabled(false);
    });

    document.getElementById('perf-report-btn')?.addEventListener('click', () => {
      const globalDev = (window as Window & { __CROSSY_DEV__?: { openReport?: () => void } }).__CROSSY_DEV__;
      globalDev?.openReport?.();
    });

    this.benchBtnEl?.addEventListener('click', () => {
      const globalDev = (window as Window & { __CROSSY_DEV__?: { startBenchmark?: (r?: number) => void; stopBenchmark?: () => void } }).__CROSSY_DEV__;
      if (this.isBenchActive) {
        globalDev?.stopBenchmark?.();
      } else {
        globalDev?.startBenchmark?.(60);
      }
    });
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enable: boolean): void {
    this.enabled = enable;
    if (!this.rootEl) return;
    if (enable) {
      this.rootEl.classList.remove('hidden');
    } else {
      this.rootEl.classList.add('hidden');
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public recordFrame(snapshot: PerfSnapshot): void {
    this.tracker.record(snapshot);
    if (!this.enabled) return;

    const now = performance.now();
    // Throttle DOM textual updates to ~10Hz (every 100ms) to avoid DOM layout overhead
    if (now - this.lastDomUpdate >= 90) {
      this.lastDomUpdate = now;
      this.updateView();
    }
  }

  private updateView(): void {
    const s = this.tracker.getSummary();
    if (this.fpsValEl) {
      this.fpsValEl.textContent = `${s.fps}`;
      this.fpsValEl.style.color = s.fps >= 55 ? '#4ade80' : s.fps >= 40 ? '#facc15' : '#ef4444';
    }
    if (this.lowFpsValEl) {
      this.lowFpsValEl.textContent = `1% Low: ${s.low1PercentFps} | Avg: ${s.avgFps}`;
      this.lowFpsValEl.style.color = s.low1PercentFps >= 50 ? '#94a3b8' : '#f87171';
    }
    if (this.callsValEl) {
      this.callsValEl.textContent = `${s.calls}`;
      this.callsValEl.style.color = s.calls > 300 ? '#ef4444' : s.calls > 150 ? '#facc15' : '#38bdf8';
    }
    if (this.trisValEl) {
      const kTris = (s.triangles / 1000).toFixed(1);
      this.trisValEl.textContent = `${kTris}k`;
    }
    if (this.memValEl) {
      this.memValEl.textContent = `${s.geometries} geo / ${s.textures} tex`;
    }
    if (this.worldValEl) {
      this.worldValEl.textContent = `Lanes: ${s.lanesCount} | Part: ${s.particlesCount}`;
    }
    if (this.breakdownValEl) {
      this.breakdownValEl.textContent = `Core: ${s.coreMs.toFixed(1)}ms | Sync: ${s.syncMs.toFixed(1)}ms | GPU: ${s.renderMs.toFixed(1)}ms`;
    }

    this.drawSparkline();
  }

  private drawSparkline(): void {
    if (!this.canvasCtx || !this.canvasEl) return;
    const ctx = this.canvasCtx;
    const w = this.canvasEl.width;
    const h = this.canvasEl.height;
    ctx.clearRect(0, 0, w, h);

    // Baseline background grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // 16.6ms green guide line (60 FPS)
    const y60 = h - (16.67 / 40) * h;
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(0, y60);
    ctx.lineTo(w, y60);
    ctx.stroke();

    // 33.3ms red guide line (30 FPS)
    const y30 = h - (33.33 / 40) * h;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.moveTo(0, y30);
    ctx.lineTo(w, y30);
    ctx.stroke();
    ctx.setLineDash([]);

    const history = this.tracker.getHistoryArray();
    if (history.length === 0) return;

    const barWidth = Math.max(1, w / 70);
    const startX = Math.max(0, w - history.length * barWidth);

    for (let i = 0; i < history.length; i++) {
      const ft = history[i];
      const barH = Math.min(h, Math.max(2, (ft / 40) * h));
      const x = startX + i * barWidth;
      const y = h - barH;

      ctx.fillStyle = ft <= 17.5 ? '#4ade80' : ft <= 28 ? '#facc15' : '#ef4444';
      ctx.fillRect(x, y, barWidth - 0.5, barH);
    }
  }

  public getTracker(): PerfMetricsTracker {
    return this.tracker;
  }

  public setBenchmarkState(active: boolean, currentDone: number = 0, totalRows: number = 60): void {
    this.isBenchActive = active;
    if (!this.benchBtnEl) return;
    if (active) {
      this.benchBtnEl.textContent = `⏹️ ${currentDone}/${totalRows}`;
      this.benchBtnEl.style.background = '#f59e0b';
      this.benchBtnEl.style.color = '#0f172a';
      this.benchBtnEl.style.fontWeight = '900';
      this.benchBtnEl.title = 'Остановить бенчмарк и открыть отчёт';
    } else {
      this.benchBtnEl.textContent = '🚀 Тест';
      this.benchBtnEl.style.background = '';
      this.benchBtnEl.style.color = '';
      this.benchBtnEl.style.fontWeight = '';
      this.benchBtnEl.title = `Стресс-тест на ${totalRows} полос`;
    }
  }

  public startBenchmarkSession(initialGeometries: number, startRow: number): void {
    this.tracker.startBenchmark(initialGeometries, startRow);
    this.setBenchmarkState(true, 0, 60);
    this.setEnabled(true);
  }

  public finishBenchmarkSession(
    endGeometries: number,
    endRow: number,
    onComplete?: (report: PerfBenchmarkReport) => void
  ): PerfBenchmarkReport {
    this.setBenchmarkState(false);
    const report = this.tracker.finishBenchmark(endGeometries, endRow);
    this.onBenchmarkComplete = onComplete;
    this.onBenchmarkComplete?.(report);
    return report;
  }
}
