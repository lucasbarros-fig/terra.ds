import type { FocusableOption, Highlightable } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
  inject,
  input,
  output,
} from '@angular/core';
import { CheckboxComponent } from '../../../../inputs-&-controls/checkbox/checkbox.component';
import { IconComponent } from '../../../icon/icon.component';
import { TERRA_DROPDOWN_HOST } from '../../dropdown.tokens';

@Component({
  selector: 'lib-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet, IconComponent, CheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownItemComponent implements FocusableOption, Highlightable {
  private readonly host = inject(TERRA_DROPDOWN_HOST, { optional: true });
  private readonly cdr = inject(ChangeDetectorRef);

  readonly label = input('');
  readonly icon = input<string | undefined>(undefined);
  readonly trailing = input<string | undefined>(undefined);
  readonly selected = input(false);
  readonly multiple = input(false);
  readonly contentTemplate = input<TemplateRef<unknown> | null>(null);

  /**
   * Kept as `@Input()` (not a signal) to directly satisfy the CDK
   * `FocusableOption.disabled?: boolean` interface without aliasing.
   */
  @Input() disabled = false;

  readonly itemSelect = output<void>();

  @ViewChild('actionBtn', { read: ElementRef, static: true })
  private actionBtn!: ElementRef<HTMLButtonElement>;

  active = false;

  get itemRole(): 'menuitem' | 'option' {
    return this.host?.panelRole === 'listbox' ? 'option' : 'menuitem';
  }

  focus(): void {
    this.actionBtn.nativeElement.focus();
  }

  getLabel(): string {
    return this.label();
  }

  setActiveStyles(): void {
    this.active = true;
    this.cdr.markForCheck();
  }

  setInactiveStyles(): void {
    this.active = false;
    this.cdr.markForCheck();
  }

  onClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.itemSelect.emit();
    if (!this.multiple() && this.host?.closeOnItemClick) {
      this.host.close();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.actionBtn.nativeElement.click();
    }
  }
}
