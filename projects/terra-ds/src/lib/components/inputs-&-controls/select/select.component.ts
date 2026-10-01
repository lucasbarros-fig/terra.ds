import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type HelperColor, HelperComponent } from '../../feedback/helper/helper.component';
import { DropdownItemComponent } from '../../layout-&-structure/dropdown/components';
import { DropdownTriggerDirective } from '../../layout-&-structure/dropdown/directives/dropdown-trigger.directive';
import { DropdownComponent } from '../../layout-&-structure/dropdown/dropdown.component';
import { IconComponent, type IconNameType } from '../../layout-&-structure/icon/icon.component';
import type {
  TooltipArrow,
  TooltipIndicator,
} from '../../layout-&-structure/tooltip/tooltip.component';
import type { InputTextVariant } from '../input-text/input-text.component';
import { LabelComponent } from '../label/label.component';
import { SelectOptionComponent } from './select-option/select-option.component';

export interface SelectOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

@Component({
  selector: 'lib-select',
  standalone: true,
  imports: [
    LabelComponent,
    HelperComponent,
    IconComponent,
    DropdownComponent,
    DropdownItemComponent,
    DropdownTriggerDirective,
    SelectOptionComponent,
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-terra-ds': '',
    class: 'container-select',
    '[class.show-focus-ring]': 'focusRingViaKeyboard()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly description = input('');
  readonly optional = input(false);

  readonly textTooltip = input('');
  readonly tooltipArrow = input<TooltipArrow>('middle');
  readonly tooltipIndicator = input<TooltipIndicator>('right');

  readonly variant = input<InputTextVariant>('underline');
  readonly placeholder = input('');
  readonly options = input<SelectOption[]>([]);

  readonly disabled = input(false);
  readonly error = input(false);

  readonly helperText = input('');
  readonly helperColor = input<HelperColor>('negative');

  readonly iconBefore = input<IconNameType>('');

  readonly selectAriaLabel = input('');

  readonly multiple = input(false);

  readonly searchable = input(false);
  readonly noResultsText = input('Nenhum item encontrado');

  readonly selectionChange = output<unknown>();

  protected readonly isOpen = signal(false);
  protected readonly selectedOption = signal<SelectOption | null>(null);
  protected readonly selectedOptions = signal<unknown[]>([]);
  protected readonly focusRingViaKeyboard = signal(false);
  protected readonly searchQuery = signal('');
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly dropdown = viewChild(DropdownComponent);
  private moveFocusToList = false;

  private readonly disabledFromForm = signal(false);
  private focusViaPointer = false;
  private _pendingPointerFocus = false;

  protected readonly isDisabled = computed(
    () => this.disabled() || this.disabledFromForm(),
  );

  protected readonly hasValue = computed(() => {
    if (this.multiple()) return this.selectedOptions().length > 0;
    return this.selectedOption() !== null;
  });

  protected readonly displayValue = computed(() => {
    if (this.multiple()) {
      const selected = this.selectedOptions();
      if (selected.length === 0) return '';
      return selected.map((value) => this.resolveOptionLabel(value)).join(', ');
    }
    return this.selectedOption()?.label ?? '';
  });

  protected readonly resolvedHelperColor = computed<HelperColor>(() =>
    this.error() ? 'negative' : this.helperColor(),
  );

  readonly selectOptions = contentChildren(SelectOptionComponent);

  protected readonly filteredOptions = computed(() => {
    const query = this.normalizedSearchQuery();
    const options = this.options();
    if (!query) return options;
    return options.filter((option) => this.matchesSearch(option.label, query));
  });

  protected readonly filteredSelectOptions = computed(() => {
    const query = this.normalizedSearchQuery();
    const options = this.selectOptions();
    if (!query) return options;
    return options.filter((option) => this.matchesSearch(option.label(), query));
  });

  protected readonly hasNoFilteredResults = computed(() => {
    if (this.selectOptions().length > 0) {
      return this.filteredSelectOptions().length === 0;
    }
    return this.filteredOptions().length === 0;
  });

  protected readonly searchableFieldValue = computed(() => {
    if (this.isOpen()) return this.searchQuery();
    return this.displayValue();
  });

  protected readonly fieldHasValue = computed(() => {
    if (this.searchable() && this.isOpen()) return this.searchQuery().length > 0;
    return this.hasValue();
  });

  private normalizedSearchQuery(): string {
    return this.searchQuery().trim().toLowerCase();
  }

  protected onChange?: (value: unknown) => void;
  protected onTouched?: () => void;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    effect(() => {
      const isMultiple = this.multiple();
      untracked(() => {
        if (isMultiple) {
          this.selectedOption.set(null);
        } else {
          this.selectedOptions.set([]);
        }
      });
    });

    effect(() => {
      if (!this.searchable() || !this.isOpen() || !this.hasNoFilteredResults()) return;
      untracked(() => void this.liveAnnouncer.announce(this.noResultsText()));
    });
  }

  @HostListener('pointerdown', ['$event'])
  protected onHostPointerDown(event: PointerEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) return;
    this.focusViaPointer = true;
    this.focusRingViaKeyboard.set(false);
  }

  @HostListener('document:pointerdown')
  protected onGlobalPointerDown(): void {
    this._pendingPointerFocus = true;
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') this.focusViaPointer = false;
    this._pendingPointerFocus = false;
  }

  protected onDropdownOpened(): void {
    if (!this.searchable()) return;
    this.searchInput()?.nativeElement.focus();
    if (this.moveFocusToList) {
      this.moveFocusToList = false;
      queueMicrotask(() => this.dropdown()?.focusFirstItem());
    }
  }

  protected onDropdownClosed(): void {
    this.searchQuery.set('');
    this.moveFocusToList = false;
    if (this._pendingPointerFocus) {
      this.focusViaPointer = true;
      this._pendingPointerFocus = false;
    }
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.dropdown()?.openPanel();
  }

  protected onChevronClick(event: MouseEvent): void {
    // Stops the wrapper trigger (toggleOnClick=false) from reopening the panel.
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.dropdown()?.toggle();
  }

  protected onSearchableKeydown(event: KeyboardEvent): void {
    const dropdown = this.dropdown();
    if (!dropdown) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.moveFocusToList = true;
        dropdown.openPanel();
        return;
      }
      if (event.key === 'ArrowDown') dropdown.focusFirstItem();
      else dropdown.focusLastItem();
      return;
    }

    if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      dropdown.close();
    }
  }

  @HostListener('focusin', ['$event'])
  protected onHostFocusIn(event: FocusEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) return;
    this.focusRingViaKeyboard.set(!this.focusViaPointer);
    this.focusViaPointer = false;
  }

  @HostListener('focusout', ['$event'])
  protected onHostFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.el.nativeElement.contains(next)) {
      this.focusRingViaKeyboard.set(false);
      this.onTouched?.();
    }
  }

  protected isSelectedValue(value: unknown): boolean {
    if (this.multiple()) return this.selectedOptions().includes(value);
    return this.selectedOption()?.value === value;
  }

  protected onSelect(option: SelectOption): void {
    if (this.multiple()) {
      const next = this.toggleValue(this.selectedOptions(), option.value);
      this.selectedOptions.set(next);
      this.onChange?.(next);
      this.selectionChange.emit(next);
    } else {
      this.selectedOption.set(option);
      this.onChange?.(option.value);
      this.selectionChange.emit(option.value);
    }
    this.cdr.markForCheck();
  }

  protected onSelectOption(opt: SelectOptionComponent): void {
    const value = opt.value();
    if (this.multiple()) {
      const next = this.toggleValue(this.selectedOptions(), value);
      this.selectedOptions.set(next);
      this.onChange?.(next);
      this.selectionChange.emit(next);
    } else {
      const resolved: SelectOption = {
        label: opt.label(),
        value,
        disabled: opt.disabled(),
      };
      this.selectedOption.set(resolved);
      this.onChange?.(value);
      this.selectionChange.emit(value);
    }
    this.cdr.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromForm.set(isDisabled);
    this.cdr.markForCheck();
  }

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.selectedOptions.set(Array.isArray(value) ? value : []);
      this.selectedOption.set(null);
    } else {
      if (value === null || value === undefined) {
        this.selectedOption.set(null);
      } else {
        const fromOptions = this.options().find((o) => o.value === value) ?? null;
        if (fromOptions) {
          this.selectedOption.set(fromOptions);
        } else {
          const fromSelectOpts = this.selectOptions().find((o) => o.value() === value);
          if (fromSelectOpts) {
            this.selectedOption.set({
              label: fromSelectOpts.label(),
              value: fromSelectOpts.value(),
              disabled: fromSelectOpts.disabled(),
            });
          } else {
            this.selectedOption.set(null);
          }
        }
      }
      this.selectedOptions.set([]);
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private matchesSearch(label: string, query: string): boolean {
    return label.toLowerCase().includes(query);
  }

  private resolveOptionLabel(value: unknown): string {
    const fromOptions = this.options().find((o) => o.value === value);
    if (fromOptions) return fromOptions.label;
    const fromSelectOpts = this.selectOptions().find((o) => o.value() === value);
    if (fromSelectOpts) return fromSelectOpts.label();
    return String(value);
  }

  private toggleValue(current: unknown[], value: unknown): unknown[] {
    const idx = current.indexOf(value);
    return idx >= 0 ? current.filter((v) => v !== value) : [...current, value];
  }
}
