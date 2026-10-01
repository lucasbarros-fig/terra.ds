import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LabelComponent } from '../label/label.component';
import type { IconNameType } from '../../layout-&-structure/icon/icon.component';
import type { IconColorType } from '../../layout-&-structure/icon/utils/theme';
import {
  TooltipComponent,
  type TooltipArrow,
  type TooltipIndicator,
} from '../../layout-&-structure/tooltip/tooltip.component';

@Component({
  selector: 'lib-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
  standalone: true,
  imports: [NgIf, LabelComponent, TooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonComponent {
  @Input() label = '';
  @Input() checked = false;
  @Input() disabled = false;

  @Input() isTooltip = false;
  @Input() tooltip: string | null | undefined = undefined;
  @Input() tooltipIndicator: TooltipIndicator = 'top';
  @Input() tooltipArrow: TooltipArrow = 'middle';
  @Input() triggerIcon: IconNameType = 'Info';
  @Input() triggerIconColor: IconColorType = 'inherit';

  @Output() readonly checkedChange = new EventEmitter<boolean>();

  toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  get showTooltipTrigger(): boolean {
    return this.isTooltip && !!(this.tooltip && String(this.tooltip).trim());
  }
}
