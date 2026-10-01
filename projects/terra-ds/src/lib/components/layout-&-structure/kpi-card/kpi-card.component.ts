import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';

import { StatusComponent } from '../../feedback/status/status.component';
import type { StatusColor } from '../../feedback/status/status.component';
import { IconComponent } from '../icon/icon.component';
import type { IconNameType } from '../icon/icon.component';

/**
 * KPI Card — indicador-chave compacto: ícone + rótulo, valor em destaque e Status com nota de contexto.
 * Figma: Terra.ds › Layout & Structure › KPI Card.
 *
 * Estados: Default, Hovering (`:hover`) e Focus (`:focus-visible`, anel externo), quando `interactive`.
 * Em dashboards pode funcionar como filtro: use `selected` (reflete em `aria-pressed`) e `(cardClick)`.
 */
@Component({
  selector: 'lib-kpi-card',
  standalone: true,
  imports: [StatusComponent, IconComponent],
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-terra-ds': '' },
})
export class KpiCardComponent {
  label = input('Indicador');
  value = input<string | number>('00');
  icon = input<IconNameType>('DiamondsFour');

  statusLabel = input('Status');
  statusColor = input<StatusColor>('neutral');
  note = input('Nota de contexto');

  /** Quando `true`, o card é focável (role="button") e emite `cardClick` por clique, Enter ou Espaço. */
  interactive = input(false);

  /** Estado de seleção quando o card funciona como filtro (`aria-pressed`). `undefined` = não é alternável. */
  selected = input<boolean | undefined>(undefined);

  cardClick = output<MouseEvent | KeyboardEvent>();

  @HostBinding('class')
  get hostClass(): string {
    const classes = ['lib-kpi-card'];
    if (this.interactive()) classes.push('lib-kpi-card--interactive');
    if (this.interactive() && this.selected()) classes.push('lib-kpi-card--selected');
    return classes.join(' ');
  }

  @HostBinding('attr.tabindex')
  get tabIndex(): number | null {
    return this.interactive() ? 0 : null;
  }

  @HostBinding('attr.role')
  get role(): string | null {
    return this.interactive() ? 'button' : null;
  }

  @HostBinding('attr.aria-pressed')
  get ariaPressed(): string | null {
    const selected = this.selected();
    return this.interactive() && selected !== undefined ? String(selected) : null;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.interactive()) this.cardClick.emit(event);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.interactive() || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    this.cardClick.emit(event);
  }
}
