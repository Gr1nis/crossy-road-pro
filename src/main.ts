import { GameEngine } from './core/gameEngine.ts';
import { DeathReason, MoveDirection } from './core/types.ts';
import { AudioSynth } from './view/audioSynth.ts';
import { SceneManager } from './view/sceneManager.ts';

const container = document.getElementById('game-container')!;
const scoreEl = document.getElementById('score-value')!;
const highScoreEl = document.getElementById('high-score-value')!;
const gameOverModal = document.getElementById('game-over-modal')!;
const deathReasonEl = document.getElementById('death-reason')!;
const restartBtn = document.getElementById('restart-btn')!;

const engine = new GameEngine(Date.now(), window.localStorage);
const sceneManager = new SceneManager(container);
const audio = new AudioSynth();

let wasDead = false;

function triggerMove(dir: typeof MoveDirection[keyof typeof MoveDirection]): void {
  if (engine.getPlayer().isDead) return;
  engine.queueMove(dir);
  audio.playHop();
}

window.addEventListener('keydown', (e) => {
  if (engine.getPlayer().isDead) {
    if (e.code === 'Space' || e.code === 'Enter') {
      restartGame();
    }
    return;
  }

  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp':
    case 'Space':
      e.preventDefault();
      triggerMove(MoveDirection.FORWARD);
      break;
    case 'KeyS':
    case 'ArrowDown':
      e.preventDefault();
      triggerMove(MoveDirection.BACKWARD);
      break;
    case 'KeyA':
    case 'ArrowLeft':
      e.preventDefault();
      triggerMove(MoveDirection.LEFT);
      break;
    case 'KeyD':
    case 'ArrowRight':
      e.preventDefault();
      triggerMove(MoveDirection.RIGHT);
      break;
  }
});

// On-screen mobile/click directional buttons
document.querySelectorAll('[data-move]').forEach((btn) => {
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const dir = (btn as HTMLElement).dataset.move as typeof MoveDirection[keyof typeof MoveDirection];
    triggerMove(dir);
  });
});

function restartGame(): void {
  wasDead = false;
  gameOverModal.classList.add('hidden');
  sceneManager.clearAll();
  engine.reset(Date.now());
}

restartBtn.addEventListener('click', restartGame);

const DEATH_LABELS: Record<string, string> = {
  [DeathReason.CAR]: 'Вас сбил автомобиль на трассе!',
  [DeathReason.WATER]: 'Вы упали в бурную реку!',
  [DeathReason.OUT_OF_BOUNDS]: 'Бревно унесло вас за край карты!',
  [DeathReason.CAMERA_BEHIND]: 'Вы слишком долго стояли на месте!',
};

let lastTime = performance.now();

function animate(now: number): void {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  engine.step(dt);
  sceneManager.sync(engine);

  scoreEl.textContent = String(engine.getScore());
  highScoreEl.textContent = String(engine.getHighScore());

  const p = engine.getPlayer();
  if (p.isDead && !wasDead) {
    wasDead = true;
    if (p.deathReason === DeathReason.WATER) {
      audio.playSplash();
    } else {
      audio.playCrash();
    }
    deathReasonEl.textContent = DEATH_LABELS[p.deathReason] ?? 'Игра окончена';
    gameOverModal.classList.remove('hidden');
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
