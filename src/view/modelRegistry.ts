import * as THREE from 'three';
import { ALL_SKINS, type BiomeType, type SkinId } from '../core/types.ts';
import { createUrbanCharacter } from './urbanCharacters.ts';
import {
  createUrbanPallet,
  createUrbanTrain,
  createUrbanVehicle,
} from './urbanVehicles.ts';
import {
  createUrbanBench,
  createUrbanCoin,
  createUrbanHedge,
  createUrbanHydrant,
  createUrbanLampPost,
  createUrbanRailwaySignal,
  createUrbanRecordFlag,
  createUrbanRiverbankEdge,
  createUrbanRoadBarrier,
  createUrbanRoadMarkings,
  createUrbanTrashCan,
  createUrbanTreePlanter,
} from './urbanEnvironment.ts';
import {
  createTownhouseA,
  createTownhouseB,
  createTownhouseC,
} from './urbanBuildings.ts';

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
  corgi:
    'Главный маскот игры. Озорной рыже-белый корги с розовыми подушечками лап, торчащими лисьими ушками, ошейником с золотым жетоном и пушистым хвостиком.',
  pigeon_pizza:
    'Городской голубь с переливающейся фиолетово-бирюзовой шеей, несущий в клюве аппетитный треугольный ломтик пиццы с хрустящей корочкой и пепперони.',
  box_cat:
    'Рыжий полосатый котик, уютно сидящий в картонной посылочной коробке со штампом "FRAGILE / DELIVERY" и свесивший белые лапки через передний бортик.',
  raccoon_bandit:
    'Ловкий городской енот-воришка в чёрной бандитской маске с пышным полосатым кольчатым хвостом и холщовым мешком с добычей за спиной.',
  capybara_zen:
    'Умиротворённая дзен-капибара в медитативной позе со спокойными прикрытыми глазками и сочным воксельным мандарином с зелёным листком на голове.',
};

export function getCharacterModelItems(): ModelCatalogItem[] {
  return ALL_SKINS.map((skin) => ({
    id: skin.id,
    name: skin.name,
    icon: skin.badge,
    cat: 'chars' as const,
    desc:
      SKIN_DESCRIPTIONS[skin.id] ??
      `Игровой персонаж ${skin.name} (${skin.id}) для Crossy Road 3D.`,
    create: (_biome: BiomeType = 'forest', isGhost = false) =>
      createUrbanCharacter(skin.id, isGhost),
  }));
}

export function getVehicleModelItems(): ModelCatalogItem[] {
  return [
    {
      id: 'taxi',
      name: 'Городское такси',
      icon: '🚕',
      cat: 'vehicles',
      desc: 'Классическое жёлтое городское такси с шашечками на крыше и крыльях, детализированными фарами, номерными знаками CITY и зеркалами заднего вида.',
      create: () => createUrbanVehicle('taxi', 1),
    },
    {
      id: 'scooter',
      name: 'Курьерский скутер',
      icon: '🛵',
      cat: 'vehicles',
      desc: 'Манёвренный скутер экспресс-доставки. За рулём сидит курьер в защитном шлеме и яркой куртке, а сзади установлена термосумка с логотипом FOOD HOT.',
      create: () => createUrbanVehicle('scooter', 1),
    },
    {
      id: 'bus',
      name: 'Рейсовый автобус',
      icon: '🚌',
      cat: 'vehicles',
      desc: 'Трёхосный пассажирский городской автобус с двустворчатыми дверями, светящимся янтарным LED-табло ROUTE 42, надписью CITY TRANSIT и блоками кондиционеров.',
      create: () => createUrbanVehicle('bus', 1),
    },
    {
      id: 'sweeper',
      name: 'Уборочная машина',
      icon: '🚜',
      cat: 'vehicles',
      desc: 'Коммунальная машина со вращающимися коническими щётками, проблесковым маячком, диагональной полосой безопасности и рельефной надписью STREET SWEEP.',
      create: () => createUrbanVehicle('sweeper', 1),
    },
    {
      id: 'train',
      name: 'Скоростной поезд',
      icon: '🚄',
      cat: 'vehicles',
      desc: 'Высокоскоростной пассажирский экспресс Сапсан с клиновидным носом, пантографом с изоляторами, вагоном CITY EXPRESS и мощным лучом освещения пути.',
      create: () => createUrbanTrain(1),
    },
    {
      id: 'pallet',
      name: 'Речной поддон',
      icon: '🪵',
      cat: 'vehicles',
      desc: 'Деревянный европоддон с опорными брусьями и фирменным клеймом PALLET. Плавает по реке, создавая белый пенный след на воде.',
      create: () =>
        createUrbanPallet({
          id: 1,
          x: 0,
          length: 2.4,
          speed: 1,
        }),
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
      desc: 'Чугунный уличный пожарный гидрант с фланцевым основанием, тремя штуцерами и серебристыми соединительными гайками.',
      create: () => createUrbanHydrant(),
    },
    {
      id: 'trash',
      name: 'Мусорный бак',
      icon: '🗑️',
      cat: 'props',
      desc: 'Зелёный городской контейнер для раздельного сбора отходов с белой маркировочной панелью и ручками.',
      create: () => createUrbanTrashCan(),
    },
    {
      id: 'bench',
      name: 'Парковая скамейка',
      icon: '🪑',
      cat: 'props',
      desc: 'Уютная деревянная скамейка на чугунных ножках с анатомическими рейками сиденья и поддерживающей спинкой.',
      create: () => createUrbanBench(),
    },
    {
      id: 'lamp',
      name: 'Фонарный столб',
      icon: '💡',
      cat: 'props',
      desc: 'Высокий чугунный уличный фонарь с квадратным постаментом и светящейся камерой плафона тёплого света.',
      create: () => createUrbanLampPost(),
    },
    {
      id: 'coin',
      name: 'Золотая монета',
      icon: '🪙',
      cat: 'props',
      desc: 'Вращающаяся золотая монетка с выпуклым ободком и гравировкой. Собирается персонажем для пополнения кошелька (+1).',
      create: () => createUrbanCoin(),
    },
    {
      id: 'signal',
      name: 'Ж/д светофор',
      icon: '🚦',
      cat: 'props',
      desc: 'Сигнальный переездный железнодорожный фонарь с двумя красными предупреждающими огнями опасности.',
      create: () => createUrbanRailwaySignal().group,
    },
    {
      id: 'flag',
      name: 'Флаг рекорда',
      icon: '🚩',
      cat: 'props',
      desc: 'Постамент личного рекорда игрока (PB Flag) на обочине с золочёным древком, короной чемпиона и рубиновыми камнями.',
      create: () => createUrbanRecordFlag(),
    },
    {
      id: 'barrier',
      name: 'Дорожный барьер',
      icon: '🚧',
      cat: 'props',
      desc: 'Защитное металлическое дорожное ограждение с опорными столбиками и светоотражающими элементами.',
      create: (b: BiomeType = 'forest') => createUrbanRoadBarrier(b),
    },
    {
      id: 'markings',
      name: 'Дорожная разметка',
      icon: '➖',
      cat: 'props',
      desc: 'Белая сплошная краевая полоса дорожной разметки, отделяющая проезжую часть от обочины.',
      create: () => createUrbanRoadMarkings(),
    },
    {
      id: 'riverbank',
      name: 'Береговое укрепление',
      icon: '🌊',
      cat: 'props',
      desc: 'Инженерное укрепление берега реки из просмолённых деревянных свай и каменной булыжной кладки.',
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
      desc: 'Городское дерево в деревянной кадке с геометрической кроной. Цвет листвы автоматически адаптируется под выбранный биом (Лес/Зима/Пустыня/Неон).',
      create: (b: BiomeType = 'forest') => createUrbanTreePlanter(0, b),
    },
    {
      id: 'tree_planter_1',
      name: 'Дерево в кадке (Б)',
      icon: '🌳',
      cat: 'nature',
      desc: 'Раскидистое городское дерево в кадке с многослойной кроной. Реагирует на погодные условия и атмосферу биома.',
      create: (b: BiomeType = 'forest') => createUrbanTreePlanter(1, b),
    },
    {
      id: 'hedge',
      name: 'Живая изгородь',
      icon: '🌿',
      cat: 'nature',
      desc: 'Аккуратно подстриженный кустарник прямоугольной формы с контрастными акцентными листьями. Меняет цвет при смене климатической зоны.',
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
      desc: 'Парижский двухэтажный таунхаус цвета ультрамарин: кофейня на первом этаже, полосатая красно-белая маркиза, вывеска CAFE, мансардная крыша и цветочные кашпо.',
      create: () => createTownhouseA(),
    },
    {
      id: 'townhouse_bakery',
      name: 'Пекарня (Таунхаус Б)',
      icon: '🥖',
      cat: 'buildings',
      desc: 'Классический особняк из красного обожжённого кирпича: угловые жёлтые рустовые камни, вывеска BAKERY, три арочных окна и ступенчатая балюстрада с двумя дымоходами.',
      create: () => createTownhouseB(),
    },
    {
      id: 'townhouse_books',
      name: 'Книги (Таунхаус В)',
      icon: '📚',
      cat: 'buildings',
      desc: 'Изумрудная книжная лавка: витрина с книжными полками, вывески BOOKS, угловая вертикальная консоль, терракотовая черепичная крыша и сдвоенные печные трубы.',
      create: () => createTownhouseC(),
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

export function getModelDiagnostics(group: THREE.Group): {
  meshCount: number;
  dims: string;
} {
  let meshCount = 0;
  group.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      meshCount++;
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
      if (diag.meshCount <= 0) {
        errors.push(`Model "${item.id}" has 0 voxel meshes`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Model "${item.id}" failed during instantiation: ${msg}`);
    }
  }

  // Ensure every registered character skin in ALL_SKINS has an entry
  for (const skin of ALL_SKINS) {
    const found = catalog.find((m) => m.id === skin.id && m.cat === 'chars');
    if (!found) {
      errors.push(`Skin "${skin.id}" from ALL_SKINS is missing from model catalog!`);
    }
  }

  return {
    total: catalog.length,
    countsByCategory,
    errors,
  };
}
