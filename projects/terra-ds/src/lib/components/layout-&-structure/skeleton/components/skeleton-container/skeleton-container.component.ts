import { NgIf } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'lib-skeleton-container',
  standalone: true,
  templateUrl: './skeleton-container.component.html',
  styleUrls: ['./skeleton-container.component.scss'],
  host: { 'data-terra-ds': '' },
  imports: [NgIf],
})
export class SkeletonContainerComponent {
  @Input() loading = true;
  @Input() gap = '8px';
  @Input() direction: 'column' | 'row' = 'column';
  @Input() fullWidth = false;
  @Input() borderRadius = '8px';

  @HostBinding('class')
  get hostClasses(): string {
    return [
      'lib-skeleton-container',
      `lib-skeleton-container--${this.direction}`,
      this.loading ? 'lib-skeleton-container--loading' : '',
      this.fullWidth ? 'lib-skeleton-container--full-width' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  @HostBinding('style.gap')
  get hostGap(): string {
    return this.gap;
  }

  @HostBinding('style.border-radius')
  get hostBorderRadius(): string {
    return this.borderRadius;
  }
}
