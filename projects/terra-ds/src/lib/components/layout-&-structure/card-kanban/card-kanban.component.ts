import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';

import { IconButtonComponent } from '../../actions/icon-button/icon-button.component';
import { StatusComponent } from '../../feedback/status/status.component';
import type { StatusColor } from '../../feedback/status/status.component';
import { TagComponent } from '../../feedback/tag/tag.component';
import type { TagColor } from '../../feedback/tag/tag.component';
import { IconComponent } from '../icon/icon.component';
import type { IconNameType } from '../icon/icon.component';

export type CardKanbanType = 'PF' | 'PJ';

interface CardKanbanTypeConfig {
  label: string;
  color: TagColor;
  icon: IconNameType;
}

const TYPE_CONFIG: Record<CardKanbanType, CardKanbanTypeConfig> = {
  PF: { label: 'Pessoa física', color: 'purple', icon: 'User' },
  PJ: { label: 'Pessoa jurídica', color: 'orange', icon: 'BuildingApartment' },
};

/**
 * Card Kanban — card compacto para acompanhar propostas em colunas de um fluxo (kanban).
 * Figma: Terra.ds › Layout & Structure › Card Kanban (Type=PF|PJ × State=Default|Hovering|Focus).
 *
 * Estados: Default, Hovering (`:hover`) e Focus (`:focus-visible`, quando `interactive`).
 * O botão "…" emite `menuClick` sem disparar `cardClick`.
 */
@Component({
  selector: 'lib-card-kanban',
  standalone: true,
  imports: [TagComponent, StatusComponent, IconComponent, IconButtonComponent],
  templateUrl: './card-kanban.component.html',
  styleUrls: ['./card-kanban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-terra-ds': '' },
})
export class CardKanbanComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  type = input<CardKanbanType>('PF');
  proposalId = input('#000000');
  clientName = input('Name');
  product = input('Product');
  /** Valor já formatado (ex.: "R$ 41.200,00"). */
  amount = input('R$ 000.000,00');

  statusLabel = input('Status');
  statusColor = input<StatusColor>('positive');
  /** Ícone semântico ao lado do status. String vazia oculta o ícone. */
  statusIcon = input<IconNameType>('Flag');

  comments = input(0);
  /** Oculta o contador de comentários quando `comments` é 0. */
  hideZeroComments = input(true);

  time = input('00 min');
  /** Contexto acessível do tempo (ex.: "há 4h 18 min na etapa"). */
  timeLabel = input('');

  /** Quando `true`, o card é focável e emite `cardClick` por clique, Enter ou Espaço. */
  interactive = input(true);

  cardClick = output<MouseEvent | KeyboardEvent>();
  menuClick = output<MouseEvent>();

  readonly typeConfig = computed(() => TYPE_CONFIG[this.type()] ?? TYPE_CONFIG.PF);

  readonly showComments = computed(() => !(this.hideZeroComments() && this.comments() === 0));

  readonly commentsLabel = computed(() => {
    const count = this.comments();
    return count === 1 ? '1 comentário' : `${count} comentários`;
  });

  readonly timeText = computed(() => this.timeLabel() || this.time());

  readonly menuAriaLabel = computed(() => `Mais ações da proposta ${this.proposalId()}`);

  /** Nome acessível do card quando ele atua como botão. */
  readonly cardAriaLabel = computed(() => {
    const parts = [
      `Proposta ${this.proposalId()}`,
      this.typeConfig().label,
      this.clientName(),
      this.product(),
      this.amount(),
      this.statusLabel(),
    ];
    if (this.showComments()) parts.push(this.commentsLabel());
    parts.push(this.timeText());
    return parts.filter(Boolean).join(', ');
  });

  @HostBinding('class')
  get hostClass(): string {
    return this.interactive() ? 'lib-card-kanban lib-card-kanban--interactive' : 'lib-card-kanban';
  }

  @HostBinding('attr.tabindex')
  get tabIndex(): number | null {
    return this.interactive() ? 0 : null;
  }

  @HostBinding('attr.role')
  get role(): string | null {
    return this.interactive() ? 'button' : null;
  }

  @HostBinding('attr.aria-label')
  get ariaLabel(): string | null {
    return this.interactive() ? this.cardAriaLabel() : null;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.interactive()) this.cardClick.emit(event);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    // Ignora teclas vindas de controles internos (ex.: botão "…").
    if (!this.interactive() || event.target !== this.host.nativeElement) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.cardClick.emit(event);
  }

  onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
    this.menuClick.emit(event);
  }
}
