import { NgClass, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
} from "@angular/core";
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { type HelperColor, HelperComponent } from "../../feedback/helper/helper.component";
import { IconComponent, type IconNameType } from "../../layout-&-structure/icon/icon.component";
import type {
  TooltipArrow,
  TooltipIndicator,
} from "../../layout-&-structure/tooltip/tooltip.component";
import { LabelComponent } from "../label/label.component";

export type InputTextareaVariant = "underline" | "outlined";

@Component({
  selector: "lib-input-textarea",
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    LabelComponent,
    HelperComponent,
    IconComponent,
  ],
  templateUrl: "./input-textarea.component.html",
  styleUrls: [
    "./input-textarea.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-terra-ds": "",
    class: "container-input-textarea",
    "[class.show-focus-ring]": "focusRingViaKeyboard",
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextareaComponent),
      multi: true,
    },
  ],
})
export class InputTextareaComponent implements ControlValueAccessor {
  @Input() label = "";
  @Input() description = "";
  @Input() optional = false;

  @Input() textTooltip = "";
  @Input() tooltipArrow: TooltipArrow = "middle";
  @Input() tooltipIndicator: TooltipIndicator = "right";
  @Input() variant: InputTextareaVariant = "underline";

  @Input() placeholder = "";
  @Input() rows = 3;

  @Input() disabled = false;
  @Input() readonly = false;
  @Input() error = false;

  @Input() helperText = "";
  @Input() helperColor: HelperColor = "negative";

  @Input() iconBefore: IconNameType = "";
  @Input() iconAfter: IconNameType = "";

  protected value = "";

  protected focusRingViaKeyboard = false;

  private focusViaPointer = false;

  private disabledFromForm = false;

  protected onChange?: (value: string) => void;

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
    return this.error ? "negative" : this.helperColor;
  }

  get isDisabled(): boolean {
    return this.disabled || this.disabledFromForm;
  }

  get showFieldSuffix(): boolean {
    return this.isDisabled || !!this.iconAfter;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromForm = isDisabled;
    this.cdr.markForCheck();
  }

  writeValue(value: string | null): void {
    this.value = value ?? "";
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputEvent(event: Event): void {
    const element = event.target as HTMLTextAreaElement;
    this.onInput(element.value);
  }

  onInput(raw: string): void {
    this.value = raw;
    this.onChange?.(raw);
  }

  onBlur(): void {
    this.onTouched?.();
  }
}
