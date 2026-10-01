import {
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	model,
	output,
	signal,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from "@angular/forms";

import { HelperComponent } from "../../../feedback/helper/helper.component";
import { LabelComponent } from "../../../inputs-&-controls/label/label.component";
import { DropdownComponent } from "../../dropdown/dropdown.component";
import { DropdownTriggerDirective } from "../../dropdown/directives/dropdown-trigger.directive";
import { IconComponent } from "../../icon/icon.component";
import { ClockPickerComponent } from "../clock-picker.component";
import type { ClockTime } from "../clock-picker.utils";

/**
 * Clock Field — campo que abre o Clock Picker num dropdown.
 * Figma: Solaris.ds › Clock Field (baseado no Input Outline, ícone Clock à esquerda).
 *
 * Funciona com `[(value)]` ou com Reactive/Template-driven Forms (`formControl`, `ngModel`).
 */
@Component({
	selector: "lib-clock-field",
	templateUrl: "./clock-field.component.html",
	styleUrls: ["./clock-field.component.scss"],
	standalone: true,
	imports: [
		ClockPickerComponent,
		DropdownComponent,
		DropdownTriggerDirective,
		HelperComponent,
		IconComponent,
		LabelComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ClockFieldComponent),
			multi: true,
		},
	],
	host: { "data-terra-ds": "", class: "clock-field-host" },
})
export class ClockFieldComponent implements ControlValueAccessor {
	readonly value = model<ClockTime | null>(null);

	readonly label = input("Horário");
	readonly showLabel = input(true);
	readonly placeholder = input("hh:mm");
	readonly helperText = input("");
	readonly error = input(false);
	readonly disabled = input(false);
	readonly ariaLabel = input("");

	readonly minuteStep = input(1);
	readonly minTime = input<ClockTime | null>(null);
	readonly maxTime = input<ClockTime | null>(null);
	/** Com rodapé, o valor só muda em "Aplicar". Sem rodapé, muda a cada escolha. */
	readonly showFooter = input(true);

	readonly timeChange = output<ClockTime>();

	protected readonly isOpen = signal(false);
	private readonly formDisabled = signal(false);
	protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
	protected readonly hasValue = computed(() => !!this.value());

	private onChange?: (value: ClockTime | null) => void;
	private onTouched?: () => void;

	protected onPickerChange(time: ClockTime): void {
		this.value.set(time);
		this.onChange?.(time);
		this.timeChange.emit(time);
		if (this.showFooter()) this.close();
	}

	protected close(): void {
		this.isOpen.set(false);
		this.onTouched?.();
	}

	protected onOpenChange(open: boolean): void {
		this.isOpen.set(open);
		if (!open) this.onTouched?.();
	}

	writeValue(value: ClockTime | null): void {
		this.value.set(value ?? null);
	}

	registerOnChange(fn: (value: ClockTime | null) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.formDisabled.set(isDisabled);
	}
}
