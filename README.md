# 🐔 Crossy Road 3D — Vibe-Pro Edition

Изометрическая воксельная 3D-аркада на **TypeScript + Three.js + WebAudio API**, разработанная по инженерному пайплайну `vibe-pro` с математически доказанными инвариантами проходимости.

## 🌐 Live Demo (GitHub Pages)

- 🎮 **Играть в браузере:** **[https://gr1nis.github.io/crossy-road-pro/](https://gr1nis.github.io/crossy-road-pro/)**
- 📐 **Инженерный план и архитектура:** **[https://gr1nis.github.io/crossy-road-pro/crossy_road_plan.html](https://gr1nis.github.io/crossy-road-pro/crossy_road_plan.html)**

---

## 🕹 Управление

| Действие | Клавиатура | Экран / Тач |
|---|---|---|
| **Прыжок вперёд** | `W` / `↑` / `Space` | Кнопка `▲` |
| **Шаг назад** | `S` / `↓` | Кнопка `▼` |
| **Шаг влево** | `A` / `←` | Кнопка `◀` |
| **Шаг вправо** | `D` / `→` | Кнопка `▶` |
| **Рестарт после Game Over** | `Space` / `Enter` | Кнопка `Играть снова` |

---

## 🏗 Архитектура и Инварианты

1. **Solvability Invariant (Гарантия проходимости):** Детерминированный ГСЧ (`Mulberry32`) и генератор полос (`GRASS`, `ROAD`, `RIVER`) гарантируют сквозной коридор проходимости и чередование направлений течения рек.
2. **Continuous Log Drift & Quantization:** На реке позиция игрока плавно дрейфует вместе с бревном (`player.x - log.x = const`), а при сходе на берег квантуется к целочисленной сетке `ℤ`.
3. **Score Monotonicity & Storage Resilience:** Монотонный счётчик очков с защитой от повреждённых данных в `LocalStorage`.

## 🚀 Сборка и тесты

```bash
# Пересобрать автономный index.html и dist/bundle.js (Node 22.6+ / Node 24)
node scripts/build.mjs
```
