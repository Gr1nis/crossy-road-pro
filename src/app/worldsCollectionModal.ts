import { SKINS_MENU_ICONS } from '../view/skinsIconsBase64.ts';

export interface WorldDefinition {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color?: string;
  glow?: string;
}

export const ALL_WORLDS: WorldDefinition[] = [
  {
    id: 'auto',
    name: 'Динамический цикл',
    icon: '🔄',
    desc: 'Смена каждые 25 очков',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.45)',
  },
  {
    id: 'forest',
    name: 'Лесной мегаполис',
    icon: '🌲',
    desc: 'Классический парк и город',
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.45)',
  },
  {
    id: 'winter',
    name: 'Снежный город',
    icon: '❄️',
    desc: 'Зимний мегаполис и сугробы',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
  },
  {
    id: 'desert',
    name: 'Пустынный каньон',
    icon: '🏜️',
    desc: 'Золотые пески и скалы',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.45)',
  },
  {
    id: 'neon',
    name: 'Киберпанк неон',
    icon: '🌆',
    desc: 'Ночные неоновые трассы',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.45)',
  },
];

export class WorldsViewManager {
  public render(
    container: HTMLElement,
    currentBiome: string | null,
    onSelect: (id: string) => void
  ): void {
    if (!container || typeof document === 'undefined') return;
    container.innerHTML = '';

    ALL_WORLDS.forEach((world) => {
      const isSelected = (!currentBiome || currentBiome === 'auto')
        ? world.id === 'auto'
        : world.id === currentBiome;

      const card = document.createElement('div');
      const cardClasses = ['skin-card', 'world-card'];
      if (isSelected) cardClasses.push('active');
      card.className = cardClasses.join(' ');
      card.setAttribute('data-world-id', world.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${world.name}: ${world.desc}`);
      if (world.color) card.style.setProperty('--rarity-color', world.color);
      if (world.glow) card.style.setProperty('--rarity-glow', world.glow);

      const btnHtml = isSelected
        ? `<button type="button" class="skin-card-btn btn-active" style="background-image: url('${SKINS_MENU_ICONS.btnGreen}');" aria-label="Мир уже выбран"><span class="skin-card-btn-text">ВЫБРАН</span></button>`
        : `<button type="button" class="skin-card-btn btn-select" style="background-image: url('${SKINS_MENU_ICONS.btnGold}');" aria-label="Выбрать мир"><span class="skin-card-btn-text">ВЫБРАТЬ</span></button>`;

      card.innerHTML = `
        <div class="skin-card-rarity">${world.desc}</div>
        <div class="skin-card-preview">
          <span style="font-size: 54px; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)); user-select: none;" role="img" aria-label="${world.name}">${world.icon}</span>
        </div>
        <div class="skin-card-name">${world.name}</div>
        ${btnHtml}
      `;

      card.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        onSelect(world.id);
      });

      container.appendChild(card);
    });
  }
}
