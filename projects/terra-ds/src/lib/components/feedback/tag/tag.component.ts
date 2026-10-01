import { Component, HostBinding, input, output } from '@angular/core';
import { IconComponent } from '../../layout-&-structure/icon/icon.component';
import type { IconNameType } from '../../layout-&-structure/icon/icon.component';

export type TagColor =
  | 'blue'
  | 'purple'
  | 'cyan'
  | 'emerald'
  | 'pink'
  | 'orange'
  | 'red'
  | 'teal'
  | 'yellow'
  | 'neutral'
  | 'green'
  | 'disabled';

@Component({
  selector: 'lib-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  standalone: true,
  imports: [IconComponent],
  host: { 'data-terra-ds': '' },
})
export class TagComponent {
  emphasis = input<'high' | 'low'>('high');
  color = input<TagColor>('blue');
  size = input<'small' | 'large'>('small');
  showAfterIcon = input(false);
  afterIcon = input<IconNameType>('information');
  showCloseButton = input(false);

  closed = output<MouseEvent>();

  get iconPx(): 12 | 16 {
    return this.size() === 'small' ? 12 : 16;
  }

  @HostBinding('class')
  get hostClass(): string {
    return [
      this.emphasis(),
      this.color(),
      this.size() === 'small' ? 'size-small' : 'size-large',
    ].join(' ');
  }

  onCloseClick(event: MouseEvent): void {
    event.stopPropagation();
    this.closed.emit(event);
  }
}
