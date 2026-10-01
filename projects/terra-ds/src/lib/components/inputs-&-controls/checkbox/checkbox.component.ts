import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IconComponent } from '../../layout-&-structure/icon/icon.component';
import type { IconColorType } from '../../layout-&-structure/icon/utils/icon-color';

@Component({
  selector: 'lib-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: true,
  host: { 'data-terra-ds': '' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  imports: [IconComponent],
})
export class CheckboxComponent implements ControlValueAccessor, AfterViewInit {
  private static nextId = 0;

  readonly checked = model(false);
  readonly inputId = input('');
  readonly label = input<string>();
  readonly disabled = input(false);
  readonly indeterminate = model(false);

  @ViewChild('inputEl') private inputRef?: ElementRef<HTMLInputElement>;

  protected readonly fallbackId = `lib-checkbox-${CheckboxComponent.nextId++}`;

  private readonly disabledFromForm = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromForm());

  protected get resolvedInputId(): string {
    return this.inputId() || this.fallbackId;
  }

  protected get iconColor(): IconColorType {
    return this.isDisabled() ? 'essential-disabled' : 'essential-contrast';
  }

  protected get showCheckIcon(): boolean {
    return this.checked() && !this.indeterminate();
  }

  protected get showMinusIcon(): boolean {
    return this.indeterminate();
  }

  protected get showFilledBox(): boolean {
    return this.checked() || this.indeterminate();
  }

  private onChange?: (value: boolean) => void;
  private onTouched?: () => void;

  constructor() {
    effect(() => {
      this.indeterminate();
      queueMicrotask(() => this.syncNativeIndeterminate());
    });
  }

  ngAfterViewInit(): void {
    this.syncNativeIndeterminate();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromForm.set(isDisabled);
  }

  protected onInputChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.checked.set(inputEl.checked);

    if (this.indeterminate() && !inputEl.indeterminate) {
      this.indeterminate.set(false);
    }

    this.onChange?.(this.checked());
  }

  protected onFocusOut(): void {
    this.onTouched?.();
  }

  private syncNativeIndeterminate(): void {
    const el = this.inputRef?.nativeElement;
    if (!el) return;
    el.indeterminate = this.indeterminate();
  }
}
