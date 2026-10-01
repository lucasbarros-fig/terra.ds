import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'lib-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  host: { 'data-terra-ds': '' },
})
export class SkeletonComponent {
  @Input() width = '100%';
  @Input() height = '16px';
  @Input() borderRadius = '8px';

  @HostBinding('class')
  get hostClasses(): string {
    return 'lib-skeleton';
  }

  @HostBinding('style.width')
  get hostWidth(): string {
    return this.width;
  }

  @HostBinding('style.height')
  get hostHeight(): string {
    return this.height;
  }

  @HostBinding('style.border-radius')
  get hostBorderRadius(): string {
    return this.borderRadius;
  }
}
