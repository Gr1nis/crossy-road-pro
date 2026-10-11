export interface PerfSnapshot {
  frameTimeMs: number;
  coreMs: number;
  syncMs: number;
  renderMs: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  lanesCount: number;
  particlesCount: number;
  score: number;
}

export interface PerfMetricsSummary {
  fps: number;
  avgFps: number;
  low1PercentFps: number;
  minFps: number;
  frameTimeMs: number;
  coreMs: number;
  syncMs: number;
  renderMs: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  lanesCount: number;
  particlesCount: number;
  score: number;
  recentSpikesCount: number;
}

export interface PerfBenchmarkReport {
  totalFrames: number;
  totalDurationSec: number;
  avgFps: number;
  low1PercentFps: number;
  minFps: number;
  maxFrameTimeMs: number;
  avgDrawCalls: number;
  peakDrawCalls: number;
  startGeometries: number;
  peakGeometries: number;
  endGeometries: number;
  geometriesDelta: number;
  rowsTraversed: number;
  verdict: string;
}

const RING_BUFFER_CAPACITY = 120;
const SPIKE_THRESHOLD_MS = 25.0; // Over 25ms means under 40 FPS

export class PerfMetricsTracker {
  private readonly history = new Float32Array(RING_BUFFER_CAPACITY);
  private head = 0;
  private count = 0;
  private latestSnapshot: PerfSnapshot | null = null;
  private spikeCounter = 0;

  // Benchmark session state
  private isBenchmarking = false;
  private benchStartRow = 0;
  private benchInitialGeos = 0;
  private benchFrames = 0;
  private benchDurationMs = 0;
  private benchMaxFrameTime = 0;
  private benchPeakCalls = 0;
  private benchPeakGeos = 0;
  private benchTotalCalls = 0;
  private readonly benchAllFrameTimes: number[] = [];

  public record(snapshot: PerfSnapshot): void {
    this.latestSnapshot = snapshot;
    const ft = Math.max(0.1, snapshot.frameTimeMs);

    this.history[this.head] = ft;
    this.head = (this.head + 1) % RING_BUFFER_CAPACITY;
    if (this.count < RING_BUFFER_CAPACITY) {
      this.count++;
    }

    if (ft >= SPIKE_THRESHOLD_MS) {
      this.spikeCounter++;
    }

    if (this.isBenchmarking) {
      this.benchFrames++;
      this.benchDurationMs += ft;
      this.benchAllFrameTimes.push(ft);
      if (ft > this.benchMaxFrameTime) this.benchMaxFrameTime = ft;
      if (snapshot.calls > this.benchPeakCalls) this.benchPeakCalls = snapshot.calls;
      if (snapshot.geometries > this.benchPeakGeos) this.benchPeakGeos = snapshot.geometries;
      this.benchTotalCalls += snapshot.calls;
    }
  }

  public getHistoryArray(): number[] {
    const res: number[] = [];
    if (this.count === 0) return res;
    const start = this.count < RING_BUFFER_CAPACITY ? 0 : this.head;
    for (let i = 0; i < this.count; i++) {
      const idx = (start + i) % RING_BUFFER_CAPACITY;
      res.push(this.history[idx]);
    }
    return res;
  }

  public getSummary(): PerfMetricsSummary {
    const snap = this.latestSnapshot ?? {
      frameTimeMs: 16.67,
      coreMs: 0,
      syncMs: 0,
      renderMs: 0,
      calls: 0,
      triangles: 0,
      geometries: 0,
      textures: 0,
      lanesCount: 0,
      particlesCount: 0,
      score: 0,
    };

    if (this.count === 0) {
      return {
        fps: 60,
        avgFps: 60,
        low1PercentFps: 60,
        minFps: 60,
        ...snap,
        recentSpikesCount: 0,
      };
    }

    const currentFps = Math.min(144, Math.round(1000 / snap.frameTimeMs));
    const samples = this.getHistoryArray();
    let sum = 0;
    let maxFt = 0;

    for (let i = 0; i < samples.length; i++) {
      const v = samples[i];
      sum += v;
      if (v > maxFt) maxFt = v;
    }

    const avgFt = sum / samples.length;
    const avgFps = Math.round(1000 / avgFt);
    const minFps = Math.max(1, Math.round(1000 / maxFt));

    // Calculate 1% low FPS: average of the worst 1% (or worst 1 frame if sample is small)
    const sorted = samples.slice().sort((a, b) => b - a); // slowest first
    const worstCount = Math.max(1, Math.ceil(sorted.length * 0.02)); // worst 2% of ring buffer
    let worstSum = 0;
    for (let i = 0; i < worstCount; i++) {
      worstSum += sorted[i];
    }
    const worstAvg = worstSum / worstCount;
    const low1PercentFps = Math.max(1, Math.round(1000 / worstAvg));

    return {
      fps: currentFps,
      avgFps,
      low1PercentFps,
      minFps,
      ...snap,
      recentSpikesCount: this.spikeCounter,
    };
  }

  public startBenchmark(initialGeometries: number, startRow: number): void {
    this.isBenchmarking = true;
    this.benchStartRow = startRow;
    this.benchInitialGeos = initialGeometries;
    this.benchFrames = 0;
    this.benchDurationMs = 0;
    this.benchMaxFrameTime = 0;
    this.benchPeakCalls = 0;
    this.benchPeakGeos = initialGeometries;
    this.benchTotalCalls = 0;
    this.benchAllFrameTimes.length = 0;
  }

  public finishBenchmark(endGeometries: number, endRow: number): PerfBenchmarkReport {
    this.isBenchmarking = false;
    const totalFrames = Math.max(1, this.benchFrames);
    const durationSec = Math.max(0.01, this.benchDurationMs / 1000);
    const avgFps = Math.round(totalFrames / durationSec);

    const sorted = this.benchAllFrameTimes.slice().sort((a, b) => b - a);
    const worstCount = Math.max(1, Math.ceil(sorted.length * 0.01));
    let worstSum = 0;
    for (let i = 0; i < worstCount; i++) {
      worstSum += sorted[i];
    }
    const worstAvg = worstCount > 0 ? worstSum / worstCount : 16.6;
    const low1PercentFps = Math.max(1, Math.round(1000 / worstAvg));
    const minFps = sorted.length > 0 ? Math.max(1, Math.round(1000 / sorted[0])) : avgFps;

    const avgCalls = Math.round(this.benchTotalCalls / totalFrames);
    const geosDelta = endGeometries - this.benchInitialGeos;
    const rowsTraversed = Math.max(0, endRow - this.benchStartRow);

    let verdict = 'Отличная производительность (60+ FPS)';
    if (avgFps < 45 || low1PercentFps < 30) {
      verdict = 'Критичные просадки FPS! Требуется InstancedMesh для деревьев и объектов';
    } else if (this.benchPeakCalls > 250) {
      verdict = `Слишком много Draw Calls (пик ${this.benchPeakCalls})! Объединяйте меши в InstancedMesh`;
    } else if (geosDelta > 30) {
      verdict = `Обнаружена утечка геометрии (+${geosDelta} объектов)! Проверьте dispose()`;
    } else if (low1PercentFps < 50) {
      verdict = 'Хороший средний FPS, но есть микрофризы (1% Low). Оптимизируйте генерацию полос';
    }

    return {
      totalFrames,
      totalDurationSec: Number(durationSec.toFixed(2)),
      avgFps,
      low1PercentFps,
      minFps,
      maxFrameTimeMs: Number(this.benchMaxFrameTime.toFixed(1)),
      avgDrawCalls: avgCalls,
      peakDrawCalls: this.benchPeakCalls,
      startGeometries: this.benchInitialGeos,
      peakGeometries: this.benchPeakGeos,
      endGeometries,
      geometriesDelta: geosDelta,
      rowsTraversed,
      verdict,
    };
  }

  public isBenchmarkRunning(): boolean {
    return this.isBenchmarking;
  }

  public getBenchmarkProgress(currentRow: number, targetRows: number): number {
    if (!this.isBenchmarking || targetRows <= 0) return 0;
    const walked = Math.max(0, currentRow - this.benchStartRow);
    return Math.min(1, walked / targetRows);
  }
}
