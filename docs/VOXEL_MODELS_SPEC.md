# 🏙️ Спецификация 3D-моделей: Сеттинг «Городские животные» (Visual Reference Guide)

> **Назначение файла**: Этот документ является визуальным эталоном референсов (Visual Reference Guide) для людей и автономных субагентов.
>
> ⚠️ **Технический стандарт**: Все модели строго подчиняются [Единой спецификации воксельной сетки (шаг 0.05) и 4 золотым правилам детализации](./VOXEL_GRID_SPECIFICATION.md). Перед моделированием обязательно ознакомьтесь с сеткой и бюджетами!

---

## 🖼️ Визуальные референсы (Reference Sheets)

Все субагенты перед написанием кода обязаны выполнить `view_file` для соответствующего референс-листа:

### ☀️ Летний биом (Summer / Urban Biome)

1. **Окружение, городская мебель и здания (Environment & Townhouses)**:
   - Файл: `docs/references/summer/urban_environment_voxels.jpg`
   - Содержит: Фасады зданий-таунхаусов (A: Кафе, B: Пекарня, C: Книжный), парковую скамейку, светящийся фонарный столб, пожарный гидрант, уличную урну, дерево в деревянной кадке, стриженую изгородь, деревянный европаллет на воде.

2. **Персонажи и транспорт (Characters & Vehicles)**:
   - Файл: `docs/references/summer/urban_characters_vehicles.jpg`
   - Содержит: Корги, Пицца-Голубя, Кота в коробке, Енота-воришку, Дзен-Капибару, Желтое такси, Курьерский скутер с термосумкой, Автобус, Уборочную машину со щетками, Скоростной поезд метро.

3. **Turnaround 3-View референс-листы уличной мебели и инфраструктуры**:
   - `docs/references/summer/14_park_bench_turnaround.jpg` — Парковая деревянная скамейка (Park Wooden Bench: 45° изометрия, вид сбоку, вид спереди).
   - `docs/references/summer/15_street_lamp_turnaround.jpg` — Фонарный столб со светящимся плафоном (City Street Lamp Post: 45° изометрия, вид сбоку, вид спереди).
   - `docs/references/summer/16_fire_hydrant_turnaround.jpg` — Чугунный пожарный гидрант (Cast-Iron Fire Hydrant: 45° изометрия, вид сбоку, вид спереди).
   - `docs/references/summer/17_trash_can_turnaround.jpg` — Уличная зеленая урна (Green Street Trash Can: 45° изометрия, вид сбоку, вид спереди).
   - `docs/references/summer/18_tree_planter_turnaround.jpg` — Дерево в деревянной кадке (Square Tree in Planter Box: 45° изометрия, вид сбоку, вид спереди).
   - `docs/references/summer/19_cubic_hedge_turnaround.jpg` — Стриженая изгородь (Neat Trimmed Cubic Bush Hedge: 45° изометрия, вид сбоку, вид спереди).
   - `docs/references/summer/20_euro_pallet_turnaround.jpg` — Деревянный европаллет на воде (Wooden Euro-Pallet on Water: 45° изометрия, вид сбоку, вид сверху).

4. **Turnaround 3-View референс-листы модульных зданий-кулис**:
   - `docs/references/summer/11_townhouse_cafe_turnaround.jpg` — Modular Townhouse A: Синее кафе с мансардой (45° изометрия, вид сбоку, вид спереди).
   - `docs/references/summer/12_townhouse_bakery_turnaround.jpg` — Modular Townhouse B: Красная кирпичная пекарня (45° изометрия, вид сбоку, вид спереди).
   - `docs/references/summer/13_townhouse_books_turnaround.jpg` — Modular Townhouse C: Зеленый книжный магазин (45° изометрия, вид сбоку, вид спереди).

### ❄️ Снежный биом (Snow / Winter Biome)

1. **Общий референс зимнего окружения (Winter Environment & Townhouses)**:
   - Файл: `docs/references/snow/winter_environment_voxels.png`
   - Содержит: Заснеженные фасады таунхаусов (Кафе, Пекарня, Альпийский книжный), заснеженную ель в кадке, фонарный столб с шапкой снега, заснеженную скамейку, заснеженную изгородь, гидрант, урну, воксельного снеговика, кристаллическую льдину на воде.

2. **Turnaround 3-View референс-листы зданий и окружения снежного биома**:
   - `docs/references/snow/21_winter_townhouse_cafe_turnaround.jpg` — Заснеженное кафе с мансардой и дымоходом (Winter Townhouse Cafe).
   - `docs/references/snow/22_winter_brick_bakery_turnaround.jpg` — Зимняя кирпичная пекарня с зубцами и гирляндами (Winter Brick Bakery).
   - `docs/references/snow/23_winter_alpine_bookstore_turnaround.jpg` — Альпийский книжный домик с каменным дымоходом (Snowy Alpine Bookstore).
   - `docs/references/snow/24_snowy_pine_planter_turnaround.jpg` — Заснеженная ель в кедровой кадке (Snowy Pine in Planter).
   - `docs/references/snow/25_winter_street_lamp_turnaround.jpg` — Зимний чугунный фонарь со снежной шапкой (Winter Street Lamp Post).
   - `docs/references/snow/26_snowy_park_bench_turnaround.jpg` — Заснеженная парковая скамейка (Snow-Covered Park Bench).
   - `docs/references/snow/27_snowy_cubic_hedge_turnaround.jpg` — Стриженая изгородь со снежным покровом (Snowy Cubic Hedge).
   - `docs/references/snow/28_snowy_fire_hydrant_turnaround.jpg` — Заснеженный пожарный гидрант (Snowy Cast-Iron Fire Hydrant).
   - `docs/references/snow/29_snowy_trash_can_turnaround.jpg` — Зеленый уличный контейнер со снегом (Snowy Green Street Trash Can).
   - `docs/references/snow/30_voxel_snowman_turnaround.jpg` — Воксельный снеговик в красном шарфе с морковкой (Voxel Snowman with Scarf).
   - `docs/references/snow/31_floating_ice_floe_turnaround.jpg` — Кристаллическая льдина с волновым следом (Floating Crystal Ice Floe).

---

## 📊 Матрица готовности ассетов

| № | Название ассета | Категория | Референс на картинке | Статус | Файл исходного кода |
|---|-----------------|-----------|----------------------|:------:|---------------------|
| 1 | **Корги** (Маскот) | Персонаж | (1) CORGI | ✅ Готово | `src/view/urbanCharacters.ts` |
| 2 | **Пицца-Голубь** | Персонаж | (2) PIGEON | ✅ Готово | `src/view/urbanCharacters.ts` |
| 3 | **Кот в коробке** | Персонаж | (3) GINGER CAT | ✅ Готово | `src/view/urbanCharacters.ts` |
| 4 | **Енот-воришка** | Персонаж | (4) RACCOON | ✅ Готово | `src/view/urbanCharacters.ts` |
| 5 | **Дзен-Капибара** | Персонаж | (5) ZEN CAPYBARA | ✅ Готово | `src/view/urbanCharacters.ts` |
| 6 | **Желтое такси** | Транспорт | (6) TAXI CAB | ✅ Готово | `src/view/urbanVehicles.ts` |
| 7 | **Курьерский скутер** | Транспорт | (7) FOOD SCOOTER | ✅ Готово | `src/view/urbanVehicles.ts` |
| 8 | **Городской автобус** | Транспорт | (8) CITY BUS | ✅ Готово | `src/view/urbanVehicles.ts` |
| 9 | **Уборочная машина** | Транспорт | (9) STREET SWEEPER | ✅ Готово | `src/view/urbanVehicles.ts` |
| 10 | **Поезд-экспресс** | Транспорт | (10) BULLET TRAIN | ✅ Готово | `src/view/urbanVehicles.ts` |
| 11 | **Пожарный гидрант** | Препятствие | CAST-IRON FIRE HYDRANT (`docs/references/summer/16_fire_hydrant_turnaround.jpg`) | ✅ Готово | `src/view/urbanEnvironment.ts` |
| 12 | **Дерево в кадке** | Препятствие (`tree`) | SQUARE TREE IN PLANTER (`docs/references/summer/18_tree_planter_turnaround.jpg`) | ✅ Готово | `src/view/urbanEnvironment.ts` |
| 13 | **Парковый фонарь** | Препятствие (`tree`) | CITY STREET LAMP POST (`docs/references/summer/15_street_lamp_turnaround.jpg`) | ✅ Готово | `src/view/urbanEnvironment.ts` |
| 14 | **Стриженая изгородь** | Препятствие (`bush`) | TRIMMED CUBIC HEDGE (`docs/references/summer/19_cubic_hedge_turnaround.jpg`) | ✅ Готово | `src/view/urbanEnvironment.ts` |
| 15 | **Парковая скамейка** | Препятствие (`bush`) | PARK WOODEN BENCH (`docs/references/summer/14_park_bench_turnaround.jpg`) | ✅ Готово | `src/view/urbanEnvironment.ts` |
| 16 | **Уличная урна** | Препятствие (`rock`) | GREEN STREET TRASH CAN (`docs/references/summer/17_trash_can_turnaround.jpg`) | ✅ Готово | `src/view/urbanEnvironment.ts` |
| 17 | **Бетонный боллард** | Препятствие (`rock`) | CONCRETE BOLLARD | ⏳ В плане | `src/view/urbanEnvironment.ts` |
| 18 | **Европаллет** | Водная платформа | WOODEN EURO-PALLET (`docs/references/summer/20_euro_pallet_turnaround.jpg`) | ✅ Готово | `src/view/urbanVehicles.ts` |
| 19 | **Таунхаус A (Синее кафе)** | Боковые кулисы | `docs/references/summer/11_townhouse_cafe_turnaround.jpg` | ✅ Готово | `src/view/urbanBuildings.ts` |
| 20 | **Таунхаус B (Красная пекарня)** | Боковые кулисы | `docs/references/summer/12_townhouse_bakery_turnaround.jpg` | ✅ Готово | `src/view/urbanBuildings.ts` |
| 21 | **Таунхаус C (Зеленый книжный)** | Боковые кулисы | `docs/references/summer/13_townhouse_books_turnaround.jpg` | ✅ Готово | `src/view/urbanBuildings.ts` |
| 22 | **Тротуар и бордюр** | Полоса дороги/пешеход | SIDEWALK & CURB | ⏳ В плане | `src/view/sceneManager.ts` |
| 23 | **Набережная канала** | Полоса воды | CANAL EMBANKMENT | ⏳ В плане | `src/view/sceneManager.ts` |

### ❄️ Снежный биом (Snow Biome Assets)
| № | Название ассета | Категория | Референс на картинке | Статус | Файл исходного кода |
|---|-----------------|-----------|----------------------|:------:|---------------------|
| 24 | **Зимнее кафе** | Боковые кулисы | `docs/references/snow/21_winter_townhouse_cafe_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanBuildings.ts` |
| 25 | **Зимняя пекарня** | Боковые кулисы | `docs/references/snow/22_winter_brick_bakery_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanBuildings.ts` |
| 26 | **Зимний книжный магазин** | Боковые кулисы | `docs/references/snow/23_winter_alpine_bookstore_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanBuildings.ts` |
| 27 | **Заснеженная ель в кадке** | Препятствие (`tree`) | `docs/references/snow/24_snowy_pine_planter_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanEnvironment.ts` |
| 28 | **Зимний фонарный столб** | Препятствие (`tree`) | `docs/references/snow/25_winter_street_lamp_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanEnvironment.ts` |
| 29 | **Заснеженная скамейка** | Препятствие (`bush`) | `docs/references/snow/26_snowy_park_bench_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanEnvironment.ts` |
| 30 | **Заснеженная изгородь** | Препятствие (`bush`) | `docs/references/snow/27_snowy_cubic_hedge_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanEnvironment.ts` |
| 31 | **Зимний гидрант** | Препятствие (`rock`) | `docs/references/snow/28_snowy_fire_hydrant_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanEnvironment.ts` |
| 32 | **Зимняя урна** | Препятствие (`rock`) | `docs/references/snow/29_snowy_trash_can_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanEnvironment.ts` |
| 33 | **Воксельный снеговик** | Препятствие / Декор | `docs/references/snow/30_voxel_snowman_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanEnvironment.ts` |
| 34 | **Кристаллическая льдина** | Водная платформа | `docs/references/snow/31_floating_ice_floe_turnaround.jpg` | ⏳ Референс готов | `src/view/urbanVehicles.ts` |


---

## 🛠️ Спецификации моделей для реализации (Новые модели)

При реализации моделей субагенты ориентируются на изображение `docs/references/summer/urban_environment_voxels.jpg` и следующие технические параметры:

### 1. Модульные здания-таунхаусы для боковых кулис (`urbanBuildings.ts`)
*Назначение*: Заменяют процедурный хвойный лес на обочинах ($|x| \in [10, 15]$ и $[-15, -10]$).
- **Townhouse A (Синее кафе)** (`docs/references/summer/11_townhouse_cafe_turnaround.jpg`):
  - 2 этажа, ширина 1.6, глубина 1.4, высота 3.8.
  - Первый этаж: синий фасад, полосатый красно-белый козырек (awning), светящаяся вывеска `CAFE`, входная дверь с витриной.
  - Второй этаж: 2 окна с белыми рамами и карнизами, цветочные ящики.
  - Крыша: мансардная черепичная крыша с люкарнами (dormers) и дымоходом.
- **Townhouse B (Красная пекарня)** (`docs/references/summer/12_townhouse_bakery_turnaround.jpg`):
  - 2.5 этажа, ширина 1.6, глубина 1.4, высота 4.1.
  - Красно-желтая кирпичная кладка, вывеска `BAKERY`, полосатый тент, арочные окна с сандриками, плоская крыша с балюстрадой.
- **Townhouse C (Зеленый книжный магазин)** (`docs/references/summer/13_townhouse_books_turnaround.jpg`):
  - 2 этажа, ширина 1.5, глубина 1.4, высота 3.6.
  - Оливково-зеленый фасад, зеленая маркиза, книжная витрина, вертикальная вывеска `BOOKS`, двускатная черепичная крыша.

### 2. Уличная мебель и препятствия (`urbanEnvironment.ts`)
- **Городской фонарный столб (City Lamp Post)**:
  - Высота: 1.8. Основание: чугунное черное `0.24×0.32×0.24`, столб `0.10×1.30×0.10`, плафон `0.30×0.36×0.30` со светящимся вокселем `0.22×0.26×0.22` (цвет `0xfef08a`, `MeshBasicMaterial`).
- **Парковая деревянная скамейка (Park Bench)**:
  - Размеры: `0.90×0.55×0.45`. Черные чугунные ножки `0.08×0.24×0.40`, деревянные рейки сиденья и спинки (цвет `0x854d0e`), подлокотники.
- **Уличная зеленая урна (Trash Can)**:
  - Размеры: `0.48×0.62×0.48`. Зеленый пластиковый корпус `0.46×0.50×0.46`, рельефная крышка с ручкой, надпись/логотип утилизации, колесики.
- **Дерево в кадке (Tree in Planter Box)**:
  - Кадка: деревянный куб `0.60×0.40×0.60` с окантовкой темного дерева. Ствол: `0.14×0.45×0.14`. Крона: стильная кубическая или ярусная стриженая листва `0.75×0.85×0.75`.
- **Стриженая изгородь (Trimmed Cubic Hedge)**:
  - Размеры: `0.85×0.52×0.65`. Плотный ровный зеленый блок с легкой фактурной накладкой вокселей.
- **Настоящий деревянный европаллет (Euro-Pallet)**:
  - Размеры: `0.80×0.18×0.80` (на полосу шириной под бревно).
  - 4 верхние продольные доски `0.80×0.04×0.14` с просветами `0.06`, 3 поперечных бруса `0.08×0.08×0.80`, 9 опорных бобышек на дне. Плавает в воде с эффектом плавучести.


---

## 🤖 Инструкция для автономных субагентов (Subagent Workflow)

При делегировании задачи субагенту (например, через `invoke_subagent`):

### Шаг 1: Визуальный осмотр референса
Субагент вызывает инструмент:
```json
{
  "AbsolutePath": "/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/docs/references/summer/urban_environment_voxels.jpg"
}
```
(или соответствующий файл из `docs/references/snow/` для зимнего биома).
Субагент анализирует форму, пропорции вокселей, ключевые узнаваемые черты (например, полосатый тент кафе, плафон фонаря, доски паллета, снежные шапки).

### Шаг 2: Использование палитры и кеша геометрий
- Все материалы и цвета берутся строго из [`src/view/voxelPalette.ts`](../src/view/voxelPalette.ts) (`VoxelPalette.getMaterial(...)` или `VOXEL_PALETTE`).
- Повторяющиеся геометрии боксов должны запрашиваться через кеш геометрий, избегая создания избыточных `new THREE.BoxGeometry` при каждом спавне.

### Шаг 3: Сохранение архитектурных инвариантов
- Слой `src/view/` рендерит визуал, но коллизии и физика по-прежнему определяются `src/core/types.ts`.
- Высота препятствий и хитбоксы соответствуют сетке $1\times 1$.
- `npm test` должен оставаться **100% GREEN** (все тесты обязаны проходить).

---

## 🚀 Команды для запуска задач субагентам

Примеры промптов для запуска параллельных субагентов:

* **Субагент A (Городская мебель и препятствия)**:
  > «Посмотри референс `docs/references/summer/urban_environment_voxels.jpg`. Реализуй в `src/view/urbanEnvironment.ts` городскую мебель: скамейку (PARK WOODEN BENCH), фонарный столб (CITY STREET LAMP POST), урну (GREEN STREET TRASH CAN), стриженую изгородь (CUBIC HEDGE) и дерево в кадке (TREE IN PLANTER). Замени ими дикие кактусы, валуны и ягодные кусты.»

* **Субагент B (Городские здания-кулисы)**:
  > «Посмотри референс `docs/references/summer/urban_environment_voxels.jpg`. Создай модуль `src/view/urbanBuildings.ts` с процедурными таунхаусами (MODULAR TOWNHOUSES A, B, C) и подключи их в `src/view/sceneManager.ts` для замены хвойного леса по бокам дороги.»

* **Субагент C (Европаллеты и набережная канала)**:
  > «Посмотри референс `docs/references/summer/urban_environment_voxels.jpg`. В `src/view/urbanVehicles.ts` переделай `createUrbanPallet` в настоящий дощатый европоддон WOODEN EURO-PALLET с балками и просветами, а в `src/view/sceneManager.ts` добавь гранитный/бетонный парапет набережной.»
