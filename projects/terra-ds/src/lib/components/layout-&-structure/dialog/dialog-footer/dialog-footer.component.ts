import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ButtonComponent } from '../../../actions/button/button.component';
import type { IconNameType } from '../../icon/icon.component';
import type { DialogFooterActionsLayout, DialogIntent } from '../dialog.types';

@Component({
  selector: 'lib-dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
  standalone: true,
  host: { 'data-terra-ds': '' },
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFooterComponent {
  actionsLayout = input<DialogFooterActionsLayout>('horizontal');
  intent = input<DialogIntent>('branding');

  showDefaultActions = input(true, { transform: booleanAttribute });

  showCancelButton = input(true, { transform: booleanAttribute });
  cancelLabel = input('Cancelar');
  cancelIcon = input<IconNameType | undefined>(undefined);
  cancelDisabled = input(false, { transform: booleanAttribute });
  cancelLoading = input(false, { transform: booleanAttribute });

  showConfirmButton = input(true, { transform: booleanAttribute });
  confirmLabel = input('Confirmar');
  confirmIcon = input<IconNameType | undefined>(undefined);
  confirmDisabled = input(false, { transform: booleanAttribute });
  confirmLoading = input(false, { transform: booleanAttribute });

  cancelClick = output<MouseEvent>();
  confirmClick = output<MouseEvent>();

  showCancelIcon = computed(() => this.hasIconName(this.cancelIcon()));
  showConfirmIcon = computed(() => this.hasIconName(this.confirmIcon()));

  onCancelClick(event: MouseEvent): void {
    this.cancelClick.emit(event);
  }

  onConfirmClick(event: MouseEvent): void {
    this.confirmClick.emit(event);
  }

  private hasIconName(name: IconNameType | string | undefined): boolean {
    return name !== null && name !== undefined && String(name).trim() !== '';
  }
}
