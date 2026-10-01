import { Component, HostBinding, input } from '@angular/core';

export type StatusColor =
  | 'positive'
  | 'negative'
  | 'informative'
  | 'warning'
  | 'neutral'
  | 'disabled';

@Component({
  selector: 'lib-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  standalone: true,
  host: { 'data-terra-ds': '' },
})
export class StatusComponent {
  status = input<StatusColor>('positive');
  size = input<'small' | 'large'>('small');
  text = input('');

  @HostBinding('class') get hostClasses(): string {
    return `status-${this.status()} ${this.size()}`;
  }
}
