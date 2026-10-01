import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { DialogIntent } from './dialog.types';

@Component({
  selector: 'lib-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  host: {
    'data-terra-ds': '',
    '[class]': 'hostClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  intent = input<DialogIntent>('neutral');
  open = input(false, { transform: booleanAttribute });
  showBackdrop = input(true, { transform: booleanAttribute });
  closeOnBackdropClick = input(true, { transform: booleanAttribute });
  ariaLabel = input<string | undefined>(undefined);
  ariaLabelledBy = input<string | undefined>(undefined);
  testId = input<string | undefined>(undefined);

  backdropClick = output<void>();

  hostClass = computed(() => `intent-${this.intent()}`);

  onBackdropMouseDown(event: MouseEvent): void {
    if (!this.closeOnBackdropClick()) return;
    if (event.target === event.currentTarget) {
      this.backdropClick.emit();
    }
  }
}
