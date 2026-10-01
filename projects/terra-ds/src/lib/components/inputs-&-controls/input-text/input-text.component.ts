import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  type OnChanges,
  type SimpleChanges,
} from "@angular/core";
import {
  type ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { IconButtonComponent } from "../../actions";
import {
  type HelperColor,
  HelperComponent,
} from "../../feedback/helper/helper.component";
import {
  IconComponent,
  type IconNameType,
} from "../../layout-&-structure/icon/icon.component";
import type {
  TooltipArrow,
  TooltipIndicator,
} from "../../layout-&-structure/tooltip/tooltip.component";
import { LabelComponent } from "../label/label.component";
import {
  currencyFromFinancialInput,
  formatCurrencyDisplay,
} from "./input-text.currency";

export type InputTextVariant = "underline" | "outlined";

export type InputTextType =
  | "text"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "currency";

const PASSWORD_TOGGLE_ARIA_SHOW = "Mostrar senha";
const PASSWORD_TOGGLE_ARIA_HIDE = "Ocultar senha";

@Component({
  selector: "lib-input-text",
  standalone: true,
  imports: [
    LabelComponent,
    HelperComponent,
    IconComponent,
    FormsModule,
    NgxMaskDirective,
    IconButtonComponent,
  ],
  templateUrl: "./input-text.component.html",
  styleUrls: ["./input-text.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-terra-ds": "",
    class: "container-input-text",
    "[class.show-focus-ring]": "focusRingViaKeyboard",
    "(pointerdown)": "onHostPointerDown($event)",
    "(document:keydown)": "onDocumentKeydown($event)",
    "(focusin)": "onHostFocusIn($event)",
    "(focusout)": "onHostFocusOut($event)",
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
    provideNgxMask(),
  ],
})
export class InputTextComponent implements ControlValueAccessor, OnChanges {
  readonly label = input("");
  readonly description = input("");
  readonly optional = input(false);

  readonly textTooltip = input("");
  readonly tooltipArrow = input<TooltipArrow>("middle");
  readonly tooltipIndicator = input<TooltipIndicator>("right");
  readonly mask = input("");
  readonly dropSpecialCharacters = input(false);
  readonly prefix = input("");
  readonly suffix = input("");
  readonly variant = input<InputTextVariant>("underline");

  readonly placeholder = input("");

  readonly type = input<InputTextType>("text");

  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input(false);
  readonly clearable = input(false);

  readonly helperText = input("");
  readonly helperColor = input<HelperColor>("negative");

  readonly iconBefore = input<IconNameType>("");
  readonly iconAfter = input<IconNameType>("");

  readonly inputAriaLabel = input("");

  protected value: string | number = "";

  /** Display financeiro pt-BR (`12,34`). CVA continua com number. */
  protected currencyDisplay = "";

  private isWritingValue = false;

  protected passwordVisible = false;

  protected focusRingViaKeyboard = false;

  private focusViaPointer = false;

  private disabledFromForm = false;

  protected onChange?: (value: string | number) => void;

  protected onTouched?: () => void;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly el = inject(ElementRef<HTMLElement>);

  protected onHostPointerDown(event: PointerEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) return;
    this.focusViaPointer = true;
    this.focusRingViaKeyboard = false;
    this.cdr.markForCheck();
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === "Tab") this.focusViaPointer = false;
  }

  protected onHostFocusIn(event: FocusEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) return;
    this.focusRingViaKeyboard = !this.focusViaPointer;
    this.focusViaPointer = false;
    this.cdr.markForCheck();
  }

  protected onHostFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.el.nativeElement.contains(next)) {
      this.focusRingViaKeyboard = false;
      this.cdr.markForCheck();
    }
  }

  get resolvedHelperColor(): HelperColor {
    return this.error() ? "negative" : this.helperColor();
  }

  get isDisabled(): boolean {
    return this.disabled() || this.disabledFromForm;
  }

  get showClearButton(): boolean {
    if (this.type() === "currency") {
      return this.clearable() && !!this.value && !this.isDisabled;
    }
    return this.clearable() && String(this.value).length > 0 && !this.isDisabled;
  }

  get showPasswordToggle(): boolean {
    return this.type() === "password" && !this.isDisabled && !this.readonly();
  }

  get effectiveInputType(): "text" | "password" | "email" | "tel" | "url" {
    const currentType = this.type();
    if (currentType === "password") {
      return this.passwordVisible ? "text" : "password";
    }
    if (currentType === "currency") return "text";
    return currentType as "text" | "email" | "tel" | "url";
  }

  get effectivePrefix(): string {
    if (this.type() === "currency") return this.prefix() || "R$";
    return this.prefix();
  }

  get passwordToggleIcon(): IconNameType {
    return this.passwordVisible ? "Eye" : "EyeClosed";
  }

  get passwordToggleAriaLabel(): string {
    return this.passwordVisible ? PASSWORD_TOGGLE_ARIA_HIDE : PASSWORD_TOGGLE_ARIA_SHOW;
  }

  get showFieldSuffix(): boolean {
    return (
      this.showClearButton ||
      this.showPasswordToggle ||
      this.isDisabled ||
      (!this.showClearButton && !!this.iconAfter())
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["type"] && this.type() !== "password") {
      this.passwordVisible = false;
    }
    if (changes["type"] && this.type() === "currency") {
      const numeric =
        typeof this.value === "number" ? this.value : Number(this.value) || 0;
      this.value = numeric;
      this.currencyDisplay = formatCurrencyDisplay(numeric);
    }
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.cdr.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromForm = isDisabled;
    this.cdr.markForCheck();
  }

  writeValue(value: string | number | null): void {
    const nextValue = value ?? (this.type() === "currency" ? 0 : "");
    this.isWritingValue = true;
    this.value = nextValue;
    if (this.type() === "currency") {
      const numeric =
        typeof nextValue === "number" ? nextValue : Number(nextValue) || 0;
      this.value = numeric;
      this.currencyDisplay = formatCurrencyDisplay(numeric);
    }
    this.cdr.markForCheck();
    this.finishWritingValue();
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onCurrencyChange(raw: string | number): void {
    if (this.isWritingValue) return;
    const { display, value } = currencyFromFinancialInput(raw);
    this.value = value;
    this.currencyDisplay = display;
    this.onChange?.(value);
    this.cdr.markForCheck();
  }

  onInput(raw: string): void {
    if (this.isWritingValue) return;
    this.value = raw;
    this.onChange?.(raw);
  }

  onBlur(): void {
    this.onTouched?.();
  }

  onClear(): void {
    this.value = this.type() === "currency" ? 0 : "";
    if (this.type() === "currency") {
      this.currencyDisplay = formatCurrencyDisplay(0);
    }
    this.onChange?.(this.value);
    this.cdr.markForCheck();
  }

  private finishWritingValue(): void {
    setTimeout(() => {
      this.isWritingValue = false;
    });
  }
}