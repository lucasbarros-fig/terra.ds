import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import {
  SolarisIconType,
  IconSizeType,
  IconColorType,
  solarisIconInputToStyleCssSuffix,
} from './utils/theme';

import { resolveIconColor } from './utils/theme';

export type IconNameType = SolarisIconType | string;

@Component({
  selector: 'lib-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class IconComponent {
  @Input() icon: IconNameType = 'Triangle';
  @Input() size: IconSizeType = 32;
  @Input() color: IconColorType = 'inherit';

  get resolvedColor(): string {
    return resolveIconColor(this.color);
  }

  get styleCssSuffix(): string {
    return solarisIconInputToStyleCssSuffix(String(this.icon));
  }
}

