import * as THREE from 'three';
import { ALL_SKINS, type BiomeType, type SkinId } from '../core/types.ts';
import { createUrbanCharacter } from './urbanCharacters.ts';
import { createUrbanPallet, createUrbanTrain, createUrbanVehicle } from './urbanVehicles.ts';
import {
  createUrbanBench, createUrbanCoin, createUrbanHedge, createUrbanHydrant,
  createUrbanLampPost, createUrbanRailwaySignal, createUrbanRecordFlag,
  createUrbanRiverbankEdge, createUrbanRoadBarrier, createUrbanRoadMarkings,
  createUrbanTrashCan, createUrbanTreePlanter,
} from './urbanEnvironment.ts';
import { createTownhouseA, createTownhouseB, createTownhouseC } from './urbanBuildings.ts';

export type ModelCategoryKey = 'chars' | 'vehicles' | 'props' | 'nature' | 'buildings';

export interface ModelCatalogItem {
  id: string;
  name: string;
  icon: string;
  cat: ModelCategoryKey;
  desc: string;
  create: (biome?: BiomeType, isGhost?: boolean) => THREE.Group;
}

const SKIN_DESCRIPTIONS: Record<SkinId, string> = {
  corgi: 'Главный маскот игры. Озорной рыже-белый корги с розовыми подушечками лап, торчащими ушками и ошейником с золотым жетоном.',
  pigeon_pizza: 'Городской голубь с переливающейся фиолетово-бирюзовой шеей и аппетитным ломтиком пиццы с пепперони.',
  box_cat: 'Рыжий котик в посылочной коробке со штампом "FRAGILE / DELIVERY", свесивший лапки через бортик.',
  raccoon_bandit: 'Городской енот-воришка в чёрной бандитской маске с кольчатым хвостом и холщовым мешком за спиной.',
  capybara_zen: 'Умиротворённая дзен-капибара в медитативной позе со спелым воксельным мандарином на голове.',
};

export function getCharacterModelItems(): ModelCatalogItem[] {
  return ALL_SKINS.map((skin) => ({
    id: skin.id,
    name: skin.name,
    icon: skin.badge,
    cat: 'chars' as const,
    desc: SKIN_DESCRIPTIONS[skin.id] ?? `Игровой персонаж ${skin.name} (${skin.id}) для Crossy Road 3D.`,
    create: (_biome: BiomeType = 'forest', isGhost = false) => createUrbanCharacter(skin.id, isGhost),
  }));
}

export function getVehicleModelItems(): ModelCatalogItem[] {
  return [
    {
      id: 'taxi',
      name: 'Городское такси',
      icon: '🚕',
      cat: 'vehicles',
      desc: 'Классическое жёлтое такси с шашечками на крыше, детальными фарами, номерами CITY и зеркалами.',
      create: () => createUrbanVehicle('taxi', 1),
    },
    {
      id: 'scooter',
      name: 'Курьерский скутер',
      icon: '🛵',
      cat: 'vehicles',
      desc: 'Манёвренный скутер: за рулём курьер в шлеме и яркой куртке, сзади термосумка FOOD HOT.',
      create: () => createUrbanVehicle('scooter', 1),
    },
    {
      id: 'bus',
      name: 'Рейсовый автобус',
      icon: '🚌',
      cat: 'vehicles',
      desc: 'Трёхосный автобус с двустворчатыми дверями, янтарным табло ROUTE 42, надписью CITY TRANSIT и блоками AC.',
      create: () => createUrbanVehicle('bus', 1),
    },
    {
      id: 'sweeper',
      name: 'Уборочная машина',
      icon: '🚜',
      cat: 'vehicles',
      desc: 'Коммунальная машина с вращающимися коническими щётками, маячком и рельефной надписью STREET SWEEP.',
      create: () => createUrbanVehicle('sweeper', 1),
    },
    {
      id: 'train',
      name: 'Скоростной поезд',
      icon: '🚄',
      cat: 'vehicles',
      desc: 'Высокоскоростной экспресс Сапсан с клиновидным носом, пантографом, вагоном CITY EXPRESS и мощным лучом прожектора.',
      create: () => createUrbanTrain(1),
    },
    {
      id: 'pallet',
      name: 'Речной поддон',
      icon: '🪵',
      cat: 'vehicles',
      desc: 'Деревянный европоддон с опорными брусьями и клеймом PALLET. Плавает по реке с белым пенным следом.',
      create: () => createUrbanPallet({ id: 1, x: 0, length: 2.4, speed: 1 }),
    },
  ];
}

export function getPropModelItems(): ModelCatalogItem[] {
  return [
    {
      id: 'hydrant',
      name: 'Пожарный гидрант',
      icon: '🚒',
      cat: 'props',
      desc: 'Чугунный пожарный гидрант с фланцевым основанием, тремя штуцерами и серебристыми гайками.',
      create: () => createUrbanHydrant(),
    },
    {
      id: 'trash',
      name: 'Мусорный бак',
      icon: '🗑️',
      cat: 'props',
      desc: 'Зелёный городской контейнер для раздельного сбора отходов с белой маркировочной панелью.',
      create: () => createUrbanTrashCan(),
    },
    {
      id: 'bench',
      name: 'Парковая скамейка',
      icon: '🪑',
      cat: 'props',
      desc: 'Деревянная скамейка на чугунных ножках с рейками сиденья и поддерживающей спинкой.',
      create: () => createUrbanBench(),
    },
    {
      id: 'lamp',
      name: 'Фонарный столб',
      icon: '💡',
      cat: 'props',
      desc: 'Высокий чугунный фонарь с квадратным постаментом и светящейся камерой плафона тёплого света.',
      create: () => createUrbanLampPost(),
    },
    {
      id: 'coin',
      name: 'Золотая монета',
      icon: '🪙',
      cat: 'props',
      desc: 'Вращающаяся золотая монетка с выпуклым ободком (+1 к балансу игрока).',
      create: () => createUrbanCoin(),
    },
    {
      id: 'signal',
      name: 'Ж/д светофор',
      icon: '🚦',
      cat: 'props',
      desc: 'Сигнальный железнодорожный фонарь с двумя красными предупреждающими огнями опасности.',
      create: () => createUrbanRailwaySignal().group,
    },
    {
      id: 'flag',
      name: 'Флаг рекорда',
      icon: '🚩',
      cat: 'props',
      desc: 'Постамент рекорда (PB Flag) на обочине с золочёным древком, короной чемпиона и рубинами.',
      create: () => createUrbanRecordFlag(),
    },
    {
      id: 'barrier',
      name: 'Дорожный барьер',
      icon: '🚧',
      cat: 'props',
      desc: 'Металлическое дорожное ограждение с опорными столбиками и светоотражателями.',
      create: (b: BiomeType = 'forest') => createUrbanRoadBarrier(b),
    },
    {
      id: 'markings',
      name: 'Дорожная разметка',
      icon: '➖',
      cat: 'props',
      desc: 'Белая сплошная краевая полоса дорожной разметки проезжей части.',
      create: () => createUrbanRoadMarkings(),
    },
    {
      id: 'riverbank',
      name: 'Береговое укрепление',
      icon: '🌊',
      cat: 'props',
      desc: 'Инженерное укрепление берега реки из просмолённых деревянных свай и каменной кладки.',
      create: (b: BiomeType = 'forest') => createUrbanRiverbankEdge('left', b),
    },
  ];
}

export function getNatureModelItems(): ModelCatalogItem[] {
  return [
    {
      id: 'tree_planter_0',
      name: 'Дерево в кадке (А)',
      icon: '🌲',
      cat: 'nature',
      desc: 'Городское дерево в деревянной кадке. Листва автоматически адаптируется под биом (Лес/Зима/Пустыня/Неон).',
      create: (b: BiomeType = 'forest') => createUrbanTreePlanter(0, b),
    },
    {
      id: 'tree_planter_1',
      name: 'Дерево в кадке (Б)',
      icon: '🌳',
      cat: 'nature',
      desc: 'Раскидистое дерево в кадке с многослойной кроной, реагирующее на атмосферу активного биома.',
      create: (b: BiomeType = 'forest') => createUrbanTreePlanter(1, b),
    },
    {
      id: 'hedge',
      name: 'Живая изгородь',
      icon: '🌿',
      cat: 'nature',
      desc: 'Подстриженный кустарник с акцентными листьями. Меняет цвет при смене климатической зоны.',
      create: (b: BiomeType = 'forest') => createUrbanHedge(0, b),
    },
  ];
}

export function getBuildingModelItems(): ModelCatalogItem[] {
  return [
    {
      id: 'townhouse_cafe',
      name: 'Кафе (Таунхаус А)',
      icon: '☕',
      cat: 'buildings',
      desc: 'Парижский таунхаус цвета ультрамарин: кофейня, полосатая маркиза, вывеска CAFE, мансарда и кашпо.',
      create: (b: BiomeType = 'forest') => createTownhouseA(b),
    },
    {
      id: 'townhouse_bakery',
      name: 'Зимняя пекарня (Таунхаус Б)',
      icon: '🥖',
      cat: 'buildings',
      desc: 'Зимняя кирпичная пекарня по эталонному референсу: зубчатый парапет со снегом, хвойные гирлянды, вывеска BAKERY, арочные окна, рустовка и дымоход с клубящимся дымом.',
      create: (b: BiomeType = 'winter') => createTownhouseB(b),
    },
    {
      id: 'townhouse_books',
      name: 'Книги (Таунхаус В)',
      icon: '📚',
      cat: 'buildings',
      desc: 'Изумрудная лавка: витрина с книжными полками, вывески BOOKS, угловая консоль и черепичная крыша.',
      create: (b: BiomeType = 'forest') => createTownhouseC(b),
    },
  ];
}

export function getModelCatalog(): ModelCatalogItem[] {
  return [
    ...getCharacterModelItems(),
    ...getVehicleModelItems(),
    ...getPropModelItems(),
    ...getNatureModelItems(),
    ...getBuildingModelItems(),
  ];
}

export function getModelDiagnostics(group: THREE.Group): { meshCount: number; dims: string } {
  let meshCount = 0;
  group.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      const vx = (c.userData && typeof c.userData.voxelCount === 'number') ? c.userData.voxelCount : 1;
      meshCount += vx;
    }
  });
  const box = new THREE.Box3().setFromObject(group);
  const w = Math.max(0.01, box.max.x - box.min.x).toFixed(2);
  const h = Math.max(0.01, box.max.y - box.min.y).toFixed(2);
  const d = Math.max(0.01, box.max.z - box.min.z).toFixed(2);
  return { meshCount, dims: `${w} × ${h} × ${d}` };
}

export function verifyModelRegistry(): {
  total: number;
  countsByCategory: Record<string, number>;
  errors: string[];
} {
  const catalog = getModelCatalog();
  const countsByCategory: Record<string, number> = {};
  const errors: string[] = [];

  for (const item of catalog) {
    countsByCategory[item.cat] = (countsByCategory[item.cat] ?? 0) + 1;
    try {
      const mesh = item.create('forest', false);
      if (!mesh || !mesh.isGroup) {
        errors.push(`Model "${item.id}" did not return a THREE.Group`);
        continue;
      }
      const diag = getModelDiagnostics(mesh);
      if (diag.meshCount <= 0) errors.push(`Model "${item.id}" has 0 voxel meshes`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Model "${item.id}" failed: ${msg}`);
    }
  }

  for (const skin of ALL_SKINS) {
    if (!catalog.some((m) => m.id === skin.id && m.cat === 'chars')) {
      errors.push(`Skin "${skin.id}" missing from model catalog!`);
    }
  }

  return { total: catalog.length, countsByCategory, errors };
}
