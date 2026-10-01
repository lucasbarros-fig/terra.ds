import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
} from '@angular/core';

import { IconButtonComponent } from '../../actions/icon-button/icon-button.component';
import type { IconNameType } from '../icon/icon.component';
import { formatFileItemDate } from './file-item-date';
import type { FileItemState } from './file-item.types';

@Component({
  selector: 'lib-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss'],
  standalone: true,
  imports: [IconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-terra-ds': '',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.aria-invalid]': 'isError() ? "true" : null',
    '[attr.data-selected]': 'isSelected() ? "true" : null',
  },
})
export class FileItemComponent {
  label = input('file_title');
  fileType = input('type');
  size = input('00MB');
  date = input<string | Date>('20/11/26');
  showDate = input(true, { transform: booleanAttribute });
  state = input<FileItemState>('default');
  progress = input(50, { transform: numberAttribute });
  uploadingLabel = input('Enviando');
  errorMessage = input('Falha no envio');
  showSlot = input(false, { transform: booleanAttribute });
  actionAriaLabel = input('');

  actionClicked = output<MouseEvent>();

  protected readonly isDisabled = computed(() => this.state() === 'disabled');
  protected readonly isError = computed(() => this.state() === 'error');
  protected readonly isSelected = computed(() => this.state() === 'selected');
  protected readonly isUploading = computed(() => this.state() === 'uploading');

  protected readonly rootClass = computed(() => {
    const classes = ['lib-file-item'];
    const state = this.state();
    if (state !== 'default') {
      classes.push(`lib-file-item--${state}`);
    }
    return classes.join(' ');
  });

  protected readonly titleText = computed(() => {
    const label = this.label().trim();
    const type = this.fileType().trim();
    if (!label && !type) {
      return '';
    }
    if (!type) {
      return label;
    }
    if (!label) {
      return type;
    }
    return `${label}.${type}`;
  });

  protected readonly captionText = computed(() => {
    if (this.isError()) {
      return this.errorMessage().trim();
    }
    if (this.isUploading()) {
      const progress = Math.min(100, Math.max(0, Number(this.progress()) || 0));
      return `${this.uploadingLabel().trim()} • ${progress}%`;
    }

    const size = this.size().trim();
    if (!this.showDate()) {
      return size;
    }
    const date = formatFileItemDate(this.date());
    if (!size) {
      return date;
    }
    if (!date) {
      return size;
    }
    return `${size} • ${date}`;
  });

  protected readonly actionIcon = computed((): IconNameType => {
    if (this.isDisabled()) {
      return 'LockSimple';
    }
    if (this.isUploading()) {
      return 'Stop';
    }
    return 'Trash';
  });

  protected readonly resolvedActionAriaLabel = computed(() => {
    const custom = this.actionAriaLabel().trim();
    if (custom) {
      return custom;
    }
    if (this.isDisabled()) {
      return 'Arquivo bloqueado';
    }
    if (this.isUploading()) {
      return 'Cancelar envio';
    }
    return 'Remover arquivo';
  });

  protected onActionClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      return;
    }
    this.actionClicked.emit(event);
  }
}
