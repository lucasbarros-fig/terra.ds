import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  output,
} from "@angular/core";
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { IconButtonComponent } from "../../actions";
import { type HelperColor, HelperComponent } from "../../feedback/helper/helper.component";
import type {
  TooltipArrow,
  TooltipIndicator,
} from "../../layout-&-structure/tooltip/tooltip.component";
import { LabelComponent } from "../label/label.component";

export type InputQuantityVariant = "underline" | "outlined";

@Component({
  selector: "lib-input-quantity",
  standalone: true,
  imports: [
    LabelComponent,
    HelperComponent,
    IconButtonComponent,
  ],
  templateUrl: "./input-quantity.component.html",
  styleUrls: [
    "./input-quantity.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-terra-ds": "",
    class: "container-input-quantity",
    "[class.show-focus-ring]": "focusRingViaKeyboard",
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputQuantityComponent),
      multi: true,
    },
  ],
})
export class InputQuantityComponent implements ControlValueAccessor {
  readonly label = input("");
  readonly description = input("");
  readonly optional = input(false);

  readonly textTooltip = input("");
  readonly tooltipArrow = input<TooltipArrow>("middle");
  readonly tooltipIndicator = input<TooltipIndicator>("right");
  readonly variant = input<InputQuantityVariant>("underline");

  readonly placeholder = input("0");

  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input(false);

  readonly helperText = input("");
  readonly helperColor = input<HelperColor>("negative");

  readonly min = input(0);
  readonly max = input<number | null>(null);
  readonly step = input(1);

  readonly valueChange = output<number>();

  protected value = "0";

  protected focusRingViaKeyboard = false;
  private focusViaPointer = false;
  private disabledFromForm = false;

  protected onChange?: (value: number) => void;

  protected onTouched?: () => void;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener("pointerdown", [
    "$event",
  ])
  protected onHostPointerDown(event: PointerEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) return;
    this.focusViaPointer = true;
    this.focusRingViaKeyboard = false;
    this.cdr.markForCheck();
  }

  @HostListener("document:keydown", [
    "$event",
  ])
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === "Tab") this.focusViaPointer = false;
  }

  @HostListener("focusin", [
    "$event",
  ])
  protected onHostFocusIn(event: FocusEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) return;
    this.focusRingViaKeyboard = !this.focusViaPointer;
    this.focusViaPointer = false;
    this.cdr.markForCheck();
  }

  @HostListener("focusout", [
    "$event",
  ])
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

  get numericValue(): number {
    if (this.value === "" || this.value === "-") return 0;
    const n = Number(this.value);
    return Number.isFinite(n) ? n : 0;
  }

  get canDecrement(): boolean {
    if (this.isDisabled || this.readonly()) return false;
    return this.numericValue - this.step() >= this.min();
  }

  get canIncrement(): boolean {
    if (this.isDisabled || this.readonly()) return false;
    if (this.max() === null) return true;
    return this.numericValue + this.step() <= this.max()!;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromForm = isDisabled;
    this.cdr.markForCheck();
  }

  writeValue(value: number | string | null): void {
    if (value === null || value === undefined || value === "") {
      this.value = String(this.min());
    } else {
      this.value = String(value);
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputEvent(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.onInput(raw);
  }

  onInput(raw: string): void {
    const allowNegative = this.min() < 0;
    const cleaned = allowNegative
      ? raw.replace(/[^\d-]/g, "").replace(/(?!^)-/g, "")
      : raw.replace(/[^\d]/g, "");
    this.value = cleaned;
    this.emitValue(this.numericValue);
  }

  onBlur(): void {
    let v = this.numericValue;
    if (v < this.min()) v = this.min();
    if (this.max() !== null && v > this.max()!) v = this.max()!;
    this.value = String(v);
    this.emitValue(v);
    this.onTouched?.();
    this.cdr.markForCheck();
  }

  increment(): void {
    if (!this.canIncrement) return;
    this.setValue(this.numericValue + this.step());
  }

  decrement(): void {
    if (!this.canDecrement) return;
    this.setValue(this.numericValue - this.step());
  }

  private setValue(v: number): void {
    this.value = String(v);
    this.emitValue(v);
    this.cdr.markForCheck();
  }

  private emitValue(v: number): void {
    this.onChange?.(v);
    this.valueChange.emit(v);
  }
}
