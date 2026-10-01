import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../actions/button/button.component';
import type { IconNameType } from '../icon/icon.component';
import type { DrawerPosition } from './drawer.types';

const DRAWER_EXIT_DURATION_MS = 320;

@Component({
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  standalone: true,
  host: {
    'data-terra-ds': '',
    '[class]': 'hostClass()',
  },
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  readonly position = input<DrawerPosition>('right');
  readonly open = input(false, { transform: booleanAttribute });
  readonly showBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnBackdropClick = input(true, { transform: booleanAttribute });

  readonly title = input('');
  readonly description = input('');
  readonly prefix = input('');
  readonly suffix = input('');

  readonly showCloseButton = input(true, { transform: booleanAttribute });
  readonly closeButtonLabel = input('Fechar');

  readonly showFooter = input(true, { transform: booleanAttribute });
  readonly showCustomFooter = input(false, { transform: booleanAttribute });

  readonly showPrimaryAction = input(true, { transform: booleanAttribute });
  readonly primaryActionLabel = input('Confirmar');
  readonly primaryActionIcon = input<IconNameType>();
  readonly primaryActionDisabled = input(false, { transform: booleanAttribute });
  readonly primaryActionLoading = input(false, { transform: booleanAttribute });

  readonly showSecondaryAction = input(true, { transform: booleanAttribute });
  readonly secondaryActionLabel = input('Cancelar');
  readonly secondaryActionIcon = input<IconNameType>();
  readonly secondaryActionDisabled = input(false, { transform: booleanAttribute });
  readonly secondaryActionLoading = input(false, { transform: booleanAttribute });

  readonly showOptionalAction = input(false, { transform: booleanAttribute });
  readonly optionalActionLabel = input('Ação');
  readonly optionalActionIcon = input<IconNameType>();
  readonly optionalActionDisabled = input(false, { transform: booleanAttribute });
  readonly optionalActionLoading = input(false, { transform: booleanAttribute });

  readonly ariaLabel = input<string>();
  readonly ariaLabelledBy = input<string>();
  readonly testId = input<string>();

  readonly backdropClick = output<void>();
  readonly closeClick = output<void>();
  readonly primaryActionClick = output<MouseEvent>();
  readonly secondaryActionClick = output<MouseEvent>();
  readonly optionalActionClick = output<MouseEvent>();

  readonly isRendered = signal(false);
  readonly isClosing = signal(false);

  readonly hostClass = computed(() => `position-${this.position()}`);

  readonly hasFooterActions = computed(
    () =>
      this.showCustomFooter() ||
      this.showOptionalAction() ||
      this.showSecondaryAction() ||
      this.showPrimaryAction(),
  );

  constructor() {
    effect(() => {
      const value = this.open();

      if (value) {
        this.isRendered.set(true);
        this.isClosing.set(false);
        return;
      }

      if (!this.isRendered()) return;

      if (this.shouldSkipAnimation()) {
        this.isRendered.set(false);
        this.isClosing.set(false);
        return;
      }

      this.isClosing.set(true);
      setTimeout(() => this.finalizeClose(), DRAWER_EXIT_DURATION_MS);
    });
  }

  onBackdropMouseDown(event: MouseEvent): void {
    if (this.isClosing()) return;
    if (!this.closeOnBackdropClick()) return;
    if (event.target === event.currentTarget) {
      this.backdropClick.emit();
    }
  }

  onClose(): void {
    this.closeClick.emit();
  }

  onPrimaryActionClick(event: MouseEvent): void {
    this.primaryActionClick.emit(event);
  }

  onSecondaryActionClick(event: MouseEvent): void {
    this.secondaryActionClick.emit(event);
  }

  onOptionalActionClick(event: MouseEvent): void {
    this.optionalActionClick.emit(event);
  }

  private finalizeClose(): void {
    if (!this.isClosing()) return;

    this.isRendered.set(false);
    this.isClosing.set(false);
  }

  private shouldSkipAnimation(): boolean {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }
}
