import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { IconComponent, IconNameType } from '../icon/icon.component';

export type AvatarSize = 'small' | 'large';
export type AvatarVariant = 'photo' | 'icon';

@Component({
  selector: 'lib-avatar',
  standalone: true,
  imports: [NgIf, IconComponent],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-terra-ds': '' },
})
export class AvatarComponent {
  @Input() size: AvatarSize = 'small';
  @Input() variant: AvatarVariant = 'icon';
  @Input() iconType: IconNameType = 'User';
  @Input() imageSrc = '';
  @Input() alt = '';

  @HostBinding('class')
  get hostClasses(): string {
    return ['lib-avatar', `lib-avatar--${this.size}`, `lib-avatar--${this.variant}`].join(
      ' ',
    );
  }

  get placeholderIconSize(): 12 | 20 {
    return this.size === 'small' ? 12 : 20;
  }

  get showPhoto(): boolean {
    return this.variant === 'photo' && !!this.imageSrc?.trim();
  }
}
