import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { IconButtonComponent } from '../../actions/icon-button/icon-button.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import type { BreadcrumbItem } from '../breadcrumbs/breadcrumbs.component';
import { DivisorComponent } from '../divisor/divisor.component';
import type { IconNameType } from '../icon/icon.component';

export interface TopAction {
  id: string;
  icon: IconNameType;
  /** Nome acessível do botão (`aria-label`). */
  label: string;
  /** Ponto de notificação. Anunciado como "<label>, novas". */
  badge?: boolean;
}

/**
 * Top — barra superior da aplicação.
 * Figma: Terra.ds › Top (2533:4306) · Variation=Desktop (357:2342).
 *
 * Título do módulo + breadcrumb à esquerda; à direita, sobre o fundo diagonal,
 * papel/nome do usuário, avatar, divisor e até 4 ações (`lib-icon-button` ghost).
 * O título não é `<h1>`: a página mantém o seu próprio `h1`.
 */
@Component({
  selector: 'lib-top',
  standalone: true,
  imports: [IconButtonComponent, AvatarComponent, BreadcrumbsComponent, DivisorComponent],
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-terra-ds': '', class: 'lib-top' },
})
export class TopComponent {
  readonly title = input('Title');
  readonly breadcrumbs = input<BreadcrumbItem[]>([]);
  readonly userRole = input('');
  readonly userName = input('');
  readonly userAvatarSrc = input('');
  /** Até 4 ações (as excedentes são ignoradas, como no Figma). */
  readonly actions = input<TopAction[]>([]);

  readonly actionClick = output<TopAction>();

  protected actionLabel(action: TopAction): string {
    return action.badge ? `${action.label}, novas` : action.label;
  }
}
