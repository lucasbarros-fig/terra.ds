import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';

import { TagComponent } from '../../feedback/tag/tag.component';
import { IconComponent } from '../icon/icon.component';
import type { IconNameType } from '../icon/icon.component';

export interface SidebarItem {
  id: string;
  label: string;
  icon: IconNameType;
  /** Quando informado, o item é renderizado como link (`<a href>`). */
  href?: string;
  disabled?: boolean;
  /** Rótulo de tag exibido ao lado do item (ex.: "Em breve"), só na versão expandida. */
  badge?: string;
  /**
   * Subitens. Nesta versão o item pai mostra o indicador (CaretRight) e emite `itemSelect`;
   * a navegação de segundo nível (Figma: Navigation=Sub) fica a cargo de quem consome.
   */
  children?: SidebarItem[];
}

let nextSidebarId = 0;

/**
 * Sidebar — navegação principal persistente.
 * Figma: Terra.ds › Sidebar (377:1692) · Variation=Desktop, Navigation=Default,
 * Colapse=No (280px) e Colapse=Yes (84px, só ícones). Item: `_Button Side` (350:3101).
 *
 * Estados do item: Default, Hovering (`:hover`), Pressing (`:active`), Focus (`:focus-visible`),
 * Selected (`activeId`) e Disabled. Recolhida, o rótulo aparece como tooltip no hover/foco.
 * O logo padrão (marca / símbolo The House) pode ser trocado projetando `[sidebarLogo]`.
 */
@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [NgTemplateOutlet, IconComponent, TagComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-terra-ds': '',
    class: 'lib-sidebar',
    '[class.lib-sidebar--collapsed]': 'collapsed()',
  },
})
export class SidebarComponent {
  readonly items = input<SidebarItem[]>([]);
  /** Rótulo do grupo de navegação (oculto quando recolhida). Vazio para não exibir. */
  readonly groupLabel = input('Visão Geral');
  readonly ariaLabel = input('Menu principal');
  /** Mostra o botão de recolher/expandir na borda. */
  readonly showToggle = input(true);

  /** Id do item ativo (`aria-current="page"`). Atualizado ao selecionar um item. */
  readonly activeId = model<string | null>(null);
  /** Figma: Colapse=Yes. Suporta `[(collapsed)]`. */
  readonly collapsed = model(false);

  readonly itemSelect = output<SidebarItem>();

  protected readonly groupLabelId = `lib-sidebar-group-${nextSidebarId++}`;

  protected readonly toggleLabel = computed(() =>
    this.collapsed() ? 'Expandir menu' : 'Recolher menu',
  );

  protected toggle(): void {
    this.collapsed.set(!this.collapsed());
  }

  protected select(item: SidebarItem): void {
    if (item.disabled) return;
    this.activeId.set(item.id);
    this.itemSelect.emit(item);
  }
}
