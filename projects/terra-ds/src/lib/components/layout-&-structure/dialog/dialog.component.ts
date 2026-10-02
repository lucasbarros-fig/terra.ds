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
  /**
   * `text` (padrão): modais de texto/confirmação — no máximo 448px no desktop e 358px no mobile.
   * `content`: modais com conteúdo rico (prévias, vídeo), limitados só pela tela.
   */
  size = input<'text' | 'content'>('text');
  open = input(false, { transform: booleanAttribute });
  showBackdrop = input(true, { transform: booleanAttribute });
  closeOnBackdropClick = input(true, { transform: booleanAttribute });
  ariaLabel = input<string | undefined>(undefined);
  ariaLabelledBy = input<string | undefined>(undefined);
  testId = input<string | undefined>(undefined);

  backdropClick = output<void>();

  hostClass = computed(() => `intent-${this.intent()} size-${this.size()}`);

  onBackdropMouseDown(event: MouseEvent): void {
    if (!this.closeOnBackdropClick()) return;
    if (event.target === event.currentTarget) {
      this.backdropClick.emit();
    }
  }
}
