import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ButtonComponent } from '../../actions/button/button.component';
import { IconComponent } from '../../layout-&-structure/icon/icon.component';
import type { IconNameType } from '../../layout-&-structure/icon/icon.component';

/** Não há variante `warning`: texto branco sobre a cor de Warning não atinge 4,5:1. */
export type AlertType = 'neutral' | 'negative' | 'informative';

const ALERT_ICONS: Record<AlertType, IconNameType> = {
  neutral: 'WarningCircle',
  negative: 'WarningCircle',
  informative: 'info',
};

/**
 * Alert — banner persistente que destaca, no topo de uma área, uma situação que pede atenção
 * e oferece a ação principal para resolvê-la.
 * Figma: Terra.ds › Feedback › Alert.
 *
 * - `neutral`: fundo Support Neutral, ação com `lib-button` Branding Filled.
 * - `negative` / `informative`: fundo de feedback, ação com `lib-button` Neutral Filled
 *   com texto e borda brancos (override local, restrito a este componente).
 */
@Component({
  selector: 'lib-alert',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-terra-ds': '',
    '[class]': 'hostClass()',
    '[attr.role]': "type() === 'negative' ? 'alert' : 'status'",
  },
})
export class AlertComponent {
  type = input<AlertType>('neutral');
  title = input('Título do banner');
  description = input('Descrição com o contexto e os itens afetados.');

  showAction = input(true);
  actionLabel = input('Ação principal');

  action = output<MouseEvent>();

  readonly icon = computed(() => ALERT_ICONS[this.type()] ?? ALERT_ICONS.neutral);
  readonly buttonIntent = computed(() => (this.type() === 'neutral' ? 'branding' : 'neutral'));

  readonly hostClass = computed(() => {
    const classes = ['lib-alert', `lib-alert--${this.type()}`];
    if (this.type() !== 'neutral') classes.push('lib-alert--on-color');
    return classes.join(' ');
  });
}
