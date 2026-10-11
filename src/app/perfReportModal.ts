import { type PerfBenchmarkReport, formatPerfReportMarkdown } from './perfMetrics.ts';

export class PerfReportModal {
  private rootEl: HTMLElement | null = null;
  private cardEl: HTMLElement | null = null;
  private copyBtn: HTMLButtonElement | null = null;
  private closeBtn: HTMLButtonElement | null = null;
  private textAreaEl: HTMLTextAreaElement | null = null;
  private currentMarkdown = '';

  constructor() {
    this.createDom();
  }

  private createDom(): void {
    if (typeof document === 'undefined') return;

    let el = document.getElementById('perf-report-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'perf-report-modal';
      el.className = 'modal hidden';
      document.body.appendChild(el);
    }
    el.style.zIndex = '2000';
    this.rootEl = el;

    el.innerHTML = `
      <div class="modal-card" style="max-width: 520px; width: 92%; padding: 22px; max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h2 style="color: #38bdf8; font-size: 20px; font-weight: 900; margin: 0;">📊 ОТЧЁТ БЕНЧМАРКА</h2>
          <span id="perf-modal-rows-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(56, 189, 248, 0.3);">300 полос</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;" id="perf-modal-kpi-grid">
          <!-- KPI Cards populated dynamically -->
        </div>

        <div id="perf-modal-verdict-box" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 10px 14px; margin-bottom: 14px; font-size: 12px; color: #f8fafc;">
          <!-- Verdict -->
        </div>

        <div style="margin-bottom: 14px;">
          <label style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">Готовый Markdown-отчёт для отправки в чат:</label>
          <textarea id="perf-report-textarea" readonly style="width: 100%; height: 130px; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; padding: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: #cbd5e1; resize: none; user-select: all; outline: none;"></textarea>
        </div>

        <div style="display: flex; gap: 10px;">
          <button id="perf-report-copy-btn" class="menu-btn menu-btn-primary" style="flex: 2; font-size: 14px; padding: 12px; background: #0284c7; border-color: #38bdf8; color: #fff;">📋 Скопировать отчёт</button>
          <button id="perf-report-close-btn" class="menu-btn menu-btn-secondary" style="flex: 1; font-size: 14px; padding: 12px;">Закрыть</button>
        </div>
      </div>
    `;

    this.cardEl = el.querySelector('.modal-card');
    this.copyBtn = document.getElementById('perf-report-copy-btn') as HTMLButtonElement | null;
    this.closeBtn = document.getElementById('perf-report-close-btn') as HTMLButtonElement | null;
    this.textAreaEl = document.getElementById('perf-report-textarea') as HTMLTextAreaElement | null;

    this.copyBtn?.addEventListener('click', () => this.handleCopy());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.rootEl?.addEventListener('click', (e) => {
      if (e.target === this.rootEl) this.close();
    });
  }

  public show(report: PerfBenchmarkReport): void {
    if (!this.rootEl) return;
    this.currentMarkdown = formatPerfReportMarkdown(report);

    const badgeEl = document.getElementById('perf-modal-rows-badge');
    if (badgeEl) badgeEl.textContent = `${report.rowsTraversed} полос (${report.totalDurationSec}с)`;

    const kpiGrid = document.getElementById('perf-modal-kpi-grid');
    if (kpiGrid) {
      const callsColor = report.peakDrawCalls > 300 ? '#ef4444' : report.peakDrawCalls > 150 ? '#facc15' : '#4ade80';
      const fpsColor = report.low1PercentFps < 35 ? '#ef4444' : report.low1PercentFps < 50 ? '#facc15' : '#4ade80';
      const kTris = (report.peakTriangles / 1000).toFixed(1);

      kpiGrid.innerHTML = `
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 8px 12px;">
          <div style="font-size: 10px; color: #94a3b8; font-weight: 800;">КАДРОВАЯ ЧАСТОТА</div>
          <div style="font-size: 18px; font-weight: 900; color: ${fpsColor};">${report.avgFps} FPS</div>
          <div style="font-size: 10px; color: #94a3b8;">1% Low: <b style="color: #fff;">${report.low1PercentFps}</b> | Мин: ${report.minFps}</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 8px 12px;">
          <div style="font-size: 10px; color: #94a3b8; font-weight: 800;">DRAW CALLS (ВЫЗОВЫ)</div>
          <div style="font-size: 18px; font-weight: 900; color: ${callsColor};">${report.avgDrawCalls} <span style="font-size: 12px; font-weight: 600;">(пик ${report.peakDrawCalls})</span></div>
          <div style="font-size: 10px; color: #94a3b8;">Полигоны: <b style="color: #fff;">~${kTris}k</b></div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 8px 12px;">
          <div style="font-size: 10px; color: #94a3b8; font-weight: 800;">ВРЕМЯ КАДРА (CPU / GPU)</div>
          <div style="font-size: 12px; font-weight: 800; color: #38bdf8;">GPU: ${report.avgRenderMs} ms</div>
          <div style="font-size: 10px; color: #94a3b8;">Core: ${report.avgCoreMs}ms | Sync: ${report.avgSyncMs}ms</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 8px 12px;">
          <div style="font-size: 10px; color: #94a3b8; font-weight: 800;">ПАМЯТЬ WEBGL</div>
          <div style="font-size: 12px; font-weight: 800; color: ${report.geometriesDelta > 30 ? '#ef4444' : '#4ade80'};">Геометрии: ${report.startGeometries} ➔ ${report.endGeometries}</div>
          <div style="font-size: 10px; color: #94a3b8;">Дельта: <b style="color: #fff;">${report.geometriesDelta >= 0 ? '+' : ''}${report.geometriesDelta}</b> ${report.geometriesDelta > 30 ? '(утечка!)' : '(чисто)'}</div>
        </div>
      `;
    }

    const verdictEl = document.getElementById('perf-modal-verdict-box');
    if (verdictEl) {
      verdictEl.innerHTML = `<b>💡 Диагностика:</b> ${report.verdict}`;
    }

    if (this.textAreaEl) {
      this.textAreaEl.value = this.currentMarkdown;
    }

    if (this.copyBtn) {
      this.copyBtn.textContent = '📋 Скопировать отчёт';
      this.copyBtn.style.background = '#0284c7';
    }

    this.rootEl.style.zIndex = '2000';
    this.rootEl.style.display = 'flex';
    this.rootEl.classList.remove('hidden');
  }

  public handleCopy(): boolean {
    if (!this.currentMarkdown) return false;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(this.currentMarkdown);
    } else if (this.textAreaEl) {
      this.textAreaEl.select();
      document.execCommand('copy');
    }

    if (this.copyBtn) {
      this.copyBtn.textContent = '✅ Скопировано в буфер!';
      this.copyBtn.style.background = '#16a34a';
      setTimeout(() => {
        if (this.copyBtn) {
          this.copyBtn.textContent = '📋 Скопировать отчёт';
          this.copyBtn.style.background = '#0284c7';
        }
      }, 2500);
    }
    return true;
  }

  public close(): void {
    if (this.rootEl) {
      this.rootEl.style.display = 'none';
      this.rootEl.classList.add('hidden');
    }
  }

  public isOpen(): boolean {
    return Boolean(this.rootEl && !this.rootEl.classList.contains('hidden'));
  }
}
