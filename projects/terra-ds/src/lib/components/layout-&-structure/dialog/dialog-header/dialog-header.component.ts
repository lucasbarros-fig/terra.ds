import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ButtonComponent } from '../../../actions/button/button.component';
import { IconComponent, type IconNameType } from '../../icon/icon.component';
import type { DialogIntent } from '../dialog.types';

const ICON_BY_INTENT: Record<DialogIntent, IconNameType | null> = {
  neutral: null,
  branding: null,
  positive: 'CheckCircle',
  warning: 'Warning',
  negative: 'Trash',
  informative: 'Info',
};

@Component({
  selector: 'lib-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
  standalone: true,
  host: {
    'data-terra-ds': '',
    '[class]': 'hostClass()',
  },
  imports: [ButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogHeaderComponent {
  intent = input<DialogIntent>('neutral');
  title = input('');
  icon = input<IconNameType | undefined>(undefined);
  showCloseButton = input(true, { transform: booleanAttribute });
  closeButtonLabel = input('Fechar');

  closeClick = output<void>();

  hostClass = computed(() => `intent-${this.intent()}`);
  leadingIcon = computed<IconNameType | null>(
    () => this.icon() ?? ICON_BY_INTENT[this.intent()],
  );

  onClose(): void {
    this.closeClick.emit();
  }
}
