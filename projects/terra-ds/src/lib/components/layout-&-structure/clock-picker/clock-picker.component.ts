import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	computed,
	effect,
	input,
	output,
	signal,
	untracked,
	viewChildren,
} from "@angular/core";

import { NgTemplateOutlet } from "@angular/common";

import { ButtonComponent } from "../../actions/button/button.component";
import {
	buildMinuteOptions,
	formatClockTime,
	pad2,
	parseClockTime,
	toMinutes,
} from "./clock-picker.utils";
import type { ClockParts, ClockPickerSize, ClockTime } from "./clock-picker.utils";

export type { ClockParts, ClockPickerSize, ClockTime } from "./clock-picker.utils";

interface ClockOption {
	value: number;
	label: string;
	disabled: boolean;
}

type ClockColumn = "hour" | "minute";

const HOURS = Array.from({ length: 24 }, (_, h) => h);

/**
 * Clock Picker — painel de seleção de horário com colunas de hora e minuto (24h).
 * Figma: Solaris.ds › Clock Picker (irmão do Date Picker).
 *
 * Com `showFooter`, a seleção é um rascunho até "Aplicar"; sem rodapé, `valueChange`
 * é emitido a cada escolha.
 */
@Component({
	selector: "lib-clock-picker",
	templateUrl: "./clock-picker.component.html",
	styleUrls: ["./clock-picker.component.scss"],
	standalone: true,
	imports: [NgTemplateOutlet, ButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		"data-terra-ds": "",
		class: "clock-picker-host",
		"[class.clock-picker-host-size-small]": "size() === 'small'",
		"[class.clock-picker-host-embedded]": "embedded()",
	},
})
export class ClockPickerComponent implements AfterViewInit {
	readonly value = input<ClockTime | null>(null);
	readonly size = input<ClockPickerSize>("default");
	readonly minuteStep = input(1);
	readonly minTime = input<ClockTime | null>(null);
	readonly maxTime = input<ClockTime | null>(null);

	readonly showHeader = input(true);
	readonly title = input("Horário");
	readonly hourLabel = input("Hora");
	readonly minuteLabel = input("Minuto");

	readonly showFooter = input(true);
	readonly cancelLabel = input("Cancelar");
	readonly applyLabel = input("Aplicar");

	/** Remove fundo, borda e raio do painel — uso interno quando o painel já está num overlay. */
	readonly embedded = input(false);

	readonly valueChange = output<ClockTime>();
	readonly applied = output<ClockTime>();
	readonly cancelled = output<void>();

	protected readonly draftHour = signal<number | null>(null);
	protected readonly draftMinute = signal<number | null>(null);

	/** [0] = coluna de horas, [1] = coluna de minutos (mesmo template). */
	private readonly lists = viewChildren<ElementRef<HTMLElement>>("list");

	private readonly minParts = computed(() => parseClockTime(this.minTime()));
	private readonly maxParts = computed(() => parseClockTime(this.maxTime()));

	protected readonly hourOptions = computed<ClockOption[]>(() => {
		const min = this.minParts();
		const max = this.maxParts();
		return HOURS.map((hour) => ({
			value: hour,
			label: pad2(hour),
			disabled: (!!min && hour < min.hour) || (!!max && hour > max.hour),
		}));
	});

	protected readonly minuteOptions = computed<ClockOption[]>(() => {
		const hour = this.draftHour();
		const min = this.minParts();
		const max = this.maxParts();
		return buildMinuteOptions(this.minuteStep()).map((minute) => ({
			value: minute,
			label: pad2(minute),
			disabled: hour !== null && this.isOutOfRange({ hour, minute }, min, max),
		}));
	});

	protected readonly canApply = computed(() => this.draftHour() !== null && this.draftMinute() !== null);

	constructor() {
		effect(() => {
			const parts = parseClockTime(this.value());
			untracked(() => this.resetDraft(parts));
		});
	}

	ngAfterViewInit(): void {
		this.scrollSelectedIntoView("hour");
		this.scrollSelectedIntoView("minute");
	}

	protected selectHour(option: ClockOption): void {
		if (option.disabled) return;
		this.draftHour.set(option.value);
		// Ao trocar a hora, o minuto atual pode sair do intervalo permitido.
		const minute = this.draftMinute();
		if (minute !== null && this.isOutOfRange({ hour: option.value, minute }, this.minParts(), this.maxParts())) {
			this.draftMinute.set(this.minuteOptions().find((o) => !o.disabled)?.value ?? null);
		}
		this.commitIfInstant();
	}

	protected selectMinute(option: ClockOption): void {
		if (option.disabled) return;
		this.draftMinute.set(option.value);
		this.commitIfInstant();
	}

	protected onApply(): void {
		const parts = this.draftParts();
		if (!parts) return;
		const time = formatClockTime(parts);
		this.valueChange.emit(time);
		this.applied.emit(time);
	}

	protected onCancel(): void {
		this.resetDraft(parseClockTime(this.value()));
		this.cancelled.emit();
	}

	protected onColumnKeydown(event: KeyboardEvent, column: ClockColumn): void {
		const options = column === "hour" ? this.hourOptions() : this.minuteOptions();
		const current = column === "hour" ? this.draftHour() : this.draftMinute();
		const enabled = options.filter((o) => !o.disabled);
		if (enabled.length === 0) return;

		const index = enabled.findIndex((o) => o.value === current);
		let next: ClockOption | undefined;
		switch (event.key) {
			case "ArrowDown":
				next = enabled[Math.min(index + 1, enabled.length - 1)];
				break;
			case "ArrowUp":
				next = enabled[index <= 0 ? 0 : index - 1];
				break;
			case "Home":
				next = enabled[0];
				break;
			case "End":
				next = enabled[enabled.length - 1];
				break;
			default:
				return;
		}
		// Evita que o dropdown pai trate as setas.
		event.preventDefault();
		event.stopPropagation();
		if (column === "hour") this.selectHour(next);
		else this.selectMinute(next);
		this.scrollSelectedIntoView(column);
	}

	protected optionId(column: ClockColumn, value: number): string {
		return `${this.idPrefix}-${column}-${value}`;
	}

	private readonly idPrefix = `clock-picker-${Math.random().toString(36).slice(2, 8)}`;

	private draftParts(): ClockParts | null {
		const hour = this.draftHour();
		const minute = this.draftMinute();
		return hour === null || minute === null ? null : { hour, minute };
	}

	private commitIfInstant(): void {
		if (this.showFooter()) return;
		const hour = this.draftHour();
		if (hour === null) return;
		if (this.draftMinute() === null) this.draftMinute.set(this.minuteOptions().find((o) => !o.disabled)?.value ?? 0);
		const parts = this.draftParts();
		if (parts) this.valueChange.emit(formatClockTime(parts));
	}

	private resetDraft(parts: ClockParts | null): void {
		this.draftHour.set(parts?.hour ?? null);
		// Se o minuto não existir no passo configurado, mantém a hora e limpa o minuto.
		const minuteExists = !!parts && buildMinuteOptions(this.minuteStep()).includes(parts.minute);
		this.draftMinute.set(minuteExists ? parts!.minute : null);
		queueMicrotask(() => {
			this.scrollSelectedIntoView("hour");
			this.scrollSelectedIntoView("minute");
		});
	}

	private scrollSelectedIntoView(column: ClockColumn): void {
		const list = this.lists()[column === "hour" ? 0 : 1]?.nativeElement;
		const selected = list?.querySelector<HTMLElement>(".clock-picker-item.is-selected");
		if (!list || !selected) return;
		// scrollTop direto para não rolar a página ou o overlay.
		list.scrollTop = selected.offsetTop - (list.clientHeight - selected.offsetHeight) / 2;
		if (list.contains(document.activeElement)) selected.focus({ preventScroll: true });
	}

	private isOutOfRange(parts: ClockParts, min: ClockParts | null, max: ClockParts | null): boolean {
		const total = toMinutes(parts);
		return (!!min && total < toMinutes(min)) || (!!max && total > toMinutes(max));
	}
}
