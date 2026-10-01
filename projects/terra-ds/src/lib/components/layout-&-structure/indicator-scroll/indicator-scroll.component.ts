import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

export type IndicatorScrollType = 'mobile' | 'desktop';
export type IndicatorScrollState =
  | 'start'
  | 'continuation-1'
  | 'continuation-2'
  | 'continuation-3'
  | 'end';

@Component({
  selector: 'lib-indicator-scroll',
  templateUrl: './indicator-scroll.component.html',
  styleUrls: ['./indicator-scroll.component.scss'],
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-terra-ds': '',
    '[class]': 'hostClass()',
  },
})
export class IndicatorScrollComponent {
  type = input<IndicatorScrollType>('mobile');
  state = input<IndicatorScrollState>('start');
  nudge = input<boolean>(true);

  hostClass = computed(() => {
    const classes = ['lib-indicator-scroll'];
    if (this.state() === 'end') {
      classes.push('lib-indicator-scroll--hidden');
    }
    if (!this.nudge()) {
      classes.push('lib-indicator-scroll--no-nudge');
    }
    return classes.join(' ');
  });

  get iconName(): string {
    return this.type() === 'desktop' ? 'MouseScroll' : 'HandTap';
  }

  get label(): string {
    return this.type() === 'desktop' ? 'Role' : 'Deslize';
  }
}
