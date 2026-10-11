import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerfMetricsTracker, type PerfSnapshot, formatPerfReportMarkdown } from '../src/app/perfMetrics.ts';

describe('PerfMetricsTracker — Real-Time Framerate, 1% Low & Benchmark Suite', () => {
  function makeSnapshot(frameTimeMs: number, calls = 100, geos = 40): PerfSnapshot {
    return {
      frameTimeMs,
      coreMs: 0.5,
      syncMs: 1.2,
      renderMs: Math.max(0.1, frameTimeMs - 1.7),
      calls,
      triangles: 5000,
      geometries: geos,
      textures: 3,
      lanesCount: 35,
      particlesCount: 20,
      score: 10,
    };
  }

  it('Default summary returns steady 60 FPS when empty', () => {
    const tracker = new PerfMetricsTracker();
    const summary = tracker.getSummary();
    assert.equal(summary.fps, 60);
    assert.equal(summary.avgFps, 60);
    assert.equal(summary.low1PercentFps, 60);
  });

  it('Tracks rolling FPS correctly over steady 60 FPS frames (16.6ms)', () => {
    const tracker = new PerfMetricsTracker();
    for (let i = 0; i < 60; i++) {
      tracker.record(makeSnapshot(16.67));
    }
    const summary = tracker.getSummary();
    assert.equal(summary.avgFps, 60);
    assert.equal(summary.low1PercentFps, 60);
  });

  it('Detects frame spikes and accurately reflects 1% Low FPS drop', () => {
    const tracker = new PerfMetricsTracker();
    // 95 smooth frames at 16.67ms (60 FPS)
    for (let i = 0; i < 95; i++) {
      tracker.record(makeSnapshot(16.67));
    }
    // 5 laggy frames at 50ms (20 FPS)
    for (let i = 0; i < 5; i++) {
      tracker.record(makeSnapshot(50.0));
    }

    const summary = tracker.getSummary();
    // 1% Low FPS should clearly be depressed due to the 50ms spikes
    assert.ok(summary.low1PercentFps <= 25, `Expected 1% low <= 25, got ${summary.low1PercentFps}`);
    assert.ok(summary.recentSpikesCount >= 5, `Expected at least 5 spikes, got ${summary.recentSpikesCount}`);
  });

  it('Ring buffer wraps around properly without exceeding capacity', () => {
    const tracker = new PerfMetricsTracker();
    for (let i = 0; i < 200; i++) {
      tracker.record(makeSnapshot(16.0 + (i % 3)));
    }
    const history = tracker.getHistoryArray();
    assert.equal(history.length, 120);
  });

  it('Aggregates full benchmark session and detects peak draw calls and geometry deltas', () => {
    const tracker = new PerfMetricsTracker();
    tracker.startBenchmark(50, 0);

    for (let i = 0; i < 100; i++) {
      tracker.record(makeSnapshot(16.67, 120 + i, 50 + Math.floor(i / 10)));
    }

    const report = tracker.finishBenchmark(60, 100);
    assert.equal(report.totalFrames, 100);
    assert.equal(report.rowsTraversed, 100);
    assert.equal(report.startGeometries, 50);
    assert.equal(report.endGeometries, 60);
    assert.equal(report.geometriesDelta, 10);
    assert.equal(report.peakDrawCalls, 219);
    assert.ok(report.avgFps >= 58 && report.avgFps <= 62);
    assert.ok(report.low1PercentFps >= 50);
    assert.equal(report.avgCoreMs, 0.5);
    assert.equal(report.avgSyncMs, 1.2);
    assert.ok(report.avgRenderMs >= 14 && report.avgRenderMs <= 16);
    assert.equal(report.peakTriangles, 5000);
  });

  it('Formats benchmark report into human-readable markdown with key metrics', () => {
    const tracker = new PerfMetricsTracker();
    tracker.startBenchmark(30, 0);
    for (let i = 0; i < 50; i++) {
      tracker.record(makeSnapshot(16.67, 150, 32));
    }
    const report = tracker.finishBenchmark(32, 50);
    const md = formatPerfReportMarkdown(report);

    assert.ok(md.includes('Crossy Road Pro — Результаты стресс-теста'));
    assert.ok(md.includes('Средний FPS'));
    assert.ok(md.includes('Draw Calls'));
    assert.ok(md.includes('GameEngine Core'));
    assert.ok(md.includes('GPU Render'));
  });
});
