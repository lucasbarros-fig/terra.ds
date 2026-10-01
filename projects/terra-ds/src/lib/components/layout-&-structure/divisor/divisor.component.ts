import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'lib-divisor',
  standalone: true,
  templateUrl: './divisor.component.html',
  styleUrls: ['./divisor.component.scss'],
  host: { 'data-terra-ds': '' },
})
export class DivisorComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @HostBinding('class')
  get hostClasses(): string {
    return [
      'lib-divisor',
      `lib-divisor--${this.orientation}`
    ].join(' ');
  }

}
