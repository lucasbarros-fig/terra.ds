import { NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	booleanAttribute,
} from "@angular/core";
import { IconButtonComponent } from "../../actions/icon-button/icon-button.component";
import { CalendarDayComponent } from "./calendar-day/calendar-day.component";
import { DatePickerFieldSelectComponent } from "./date-picker-field-select/date-picker-field-select.component";
import {
	formatIsoDay,
	formatIsoMonth,
	parseIsoDay,
	parseIsoMonth,
	parseIsoYear,
	parseValueForMode,
	resolveRangeBoundMax,
	resolveRangeBoundMin,
} from "./date-picker.iso";
import type { CalendarDaySelected } from "./calendar-day/calendar-day.types";
import type {
	DatePickerDayCell,
	DatePickerHighlightedDates,
	DatePickerMode,
	DatePickerSize,
} from "./date-picker.types";
import {
	MONTH_PT,
	MONTH_SELECT_LABELS_PT,
	WEEK_HEADER_PT,
	WEEK_LETTER_PT,
	buildMonthGrid,
	clampDayInMonth,
	compareCalendarDay,
	isDayBeforeToday,
	isDayOutsideCalendarMonthDisplay,
	isDayOutsideMinMax,
	isMonthIndexPast,
	isMonthOutsideSelectableRange,
	isSameDay,
	isYearOutsideSelectableRange,
	isYearPast,
	rangeDaySelection,
	startOfToday,
	weekSliceContaining,
} from "./date-picker.utils";

@Component({
	selector: "lib-date-picker",
	templateUrl: "./date-picker.component.html",
	styleUrls: ["./date-picker.component.scss"],
	standalone: true,
	imports: [
		NgFor,
		NgIf,
		NgTemplateOutlet,
		IconButtonComponent,
		DatePickerFieldSelectComponent,
		CalendarDayComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { "data-terra-ds": "" },
})
export class DatePickerComponent implements OnChanges {
	@Input() value: string | null = null;
	@Input() valueEnd: string | null = null;
	@Input() mode: DatePickerMode = "default";
	@Input() size: DatePickerSize = "default";
	@Input({ transform: booleanAttribute }) showYear = true;
	@Input({ transform: booleanAttribute }) allowPast = true;
	@Input({ transform: booleanAttribute }) rangeSelection = false;
	@Input() minDate: string | null = null;
	@Input() maxDate: string | null = null;
	@Input() highlightedDates: DatePickerHighlightedDates = [];
	@Input({ transform: booleanAttribute }) readOnly = false;

	@Output() readonly valueChange = new EventEmitter<string | null>();
	@Output() readonly valueEndChange = new EventEmitter<string | null>();

	viewYear = new Date().getFullYear();
	viewMonth = new Date().getMonth();
	yearBandStart = new Date().getFullYear() - 4;
	weekCursor = startOfToday();
	panelView: DatePickerMode = "default";
	private highlightedDayKeys = new Set<string>();
	private highlightedMonthKeys = new Set<string>();
	private highlightedYearKeys = new Set<number>();
	private highlightedDescriptions = new Map<string, string>();

	constructor(private readonly cdr: ChangeDetectorRef) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (
			changes["highlightedDates"] ||
			changes["value"] ||
			changes["valueEnd"] ||
			changes["rangeSelection"]
		) {
			this.rebuildHighlightSets();
		}
		if (changes["mode"]) {
			this.panelView = this.mode;
		}
		if (
			changes["value"] ||
			changes["valueEnd"] ||
			changes["mode"] ||
			changes["size"] ||
			changes["allowPast"] ||
			changes["rangeSelection"] ||
			changes["minDate"] ||
			changes["maxDate"]
		) {
			this.syncFromValue();
			this.cdr.markForCheck();
		} else if (
			changes["highlightedDates"] && 
			!changes["value"] && 
			!changes["valueEnd"]
		) {
			this.cdr.markForCheck();
		}
		if (changes["readOnly"]) {
			this.cdr.markForCheck();
		}
	}

	@HostBinding("class")
	get hostClass(): string {
		return this.size === "small"
			? "date-picker-host date-picker-host-size-small"
			: "date-picker-host";
	}

	get isCompactWeekHeader(): boolean {
		return this.panelView === "default" && this.size === "small";
	}

	get monthFieldLabel(): string {
		return MONTH_SELECT_LABELS_PT[this.viewMonth] ?? String(this.viewMonth + 1);
	}

	get yearFieldLabel(): string {
		return String(this.viewYear);
	}

	get weekdayHeaders(): readonly string[] {
		return WEEK_HEADER_PT;
	}

	get dayCells(): DatePickerDayCell[] {
		if (this.panelView !== "default" || this.size === "small") return [];
		const cells = buildMonthGrid(this.viewYear, this.viewMonth, 42);
		return cells.map((d) => {
			const outsideDisplayedMonth = isDayOutsideCalendarMonthDisplay(
				d,
				this.viewYear,
				this.viewMonth,
			);
			return this.mapDayToCell(d, {
				context: outsideDisplayedMonth ? "outside" : "current",
				sublabel: "",
			});
		});
	}

	get smallWeekCells(): DatePickerDayCell[] {
		if (this.panelView !== "default" || this.size !== "small") return [];
		const row = weekSliceContaining(this.weekCursor);
		return row.map((d) => {
			const dow = d.getDay();
			return this.mapDayToCell(d, {
				context: "current",
				sublabel: WEEK_LETTER_PT[dow] ?? "",
			});
		});
	}

	get monthCells(): DatePickerDayCell[] {
		if (this.panelView !== "month") return [];
		const sel = this.parseSelectedMonth();
		const today = startOfToday();
		const { min, max } = this.rangeDayBounds();
		const curY = today.getFullYear();
		const curM = today.getMonth();
		return MONTH_PT.map((abbr, mi) => {
			const selected = this.resolveMonthSelected(this.viewYear, mi, sel);
			const isCurrentMonth = this.viewYear === curY && mi === curM;
			const pastBlocked = !this.allowPast && isMonthIndexPast(this.viewYear, mi, today);
			const rangeBlocked = isMonthOutsideSelectableRange(this.viewYear, mi, min, max);
			return {
				key: `${this.viewYear}-${mi}`,
				label: abbr,
				sublabel: "",
				context: isCurrentMonth ? "current" : "outside",
				today: false,
				selected,
				disabled: pastBlocked || rangeBlocked,
				pickDate: new Date(this.viewYear, mi, 1),
			};
		});
	}

	get yearCells(): DatePickerDayCell[] {
		if (this.panelView !== "year") return [];
		const selY = this.parseSelectedYearFromValue();
		const curY = new Date().getFullYear();
		const today = startOfToday();
		const { min, max } = this.rangeDayBounds();
		const out: DatePickerDayCell[] = [];
		for (let i = 0; i < 9; i++) {
			const y = this.yearBandStart + i;
			const selected = this.resolveYearSelected(y, selY);
			const pastBlocked = !this.allowPast && isYearPast(y, today);
			const rangeBlocked = isYearOutsideSelectableRange(y, min, max);
			out.push({
				key: String(y),
				label: String(y),
				sublabel: "",
				context: y === curY ? "current" : "outside",
				today: false,
				selected,
				disabled: pastBlocked || rangeBlocked,
				pickDate: new Date(y, 0, 1),
			});
		}
		return out;
	}

	onPrev(): void {
		if (this.panelView === "default" && this.size === "small") {
			this.weekCursor = new Date(this.weekCursor);
			this.weekCursor.setDate(this.weekCursor.getDate() - 7);
			this.viewYear = this.weekCursor.getFullYear();
			this.viewMonth = this.weekCursor.getMonth();
		} else if (this.panelView === "default") {
			if (this.viewMonth === 0) {
				this.viewMonth = 11;
				this.viewYear -= 1;
			} else {
				this.viewMonth -= 1;
			}
		} else if (this.panelView === "month") {
			this.viewYear -= 1;
		} else {
			const { minBandStart, maxBandStart } = this.yearGridNavBounds();
			const next = this.yearBandStart - 9;
			if (next >= minBandStart && next <= maxBandStart) {
				this.yearBandStart = next;
			}
		}
		this.cdr.markForCheck();
	}

	onNext(): void {
		if (this.panelView === "default" && this.size === "small") {
			this.weekCursor = new Date(this.weekCursor);
			this.weekCursor.setDate(this.weekCursor.getDate() + 7);
			this.viewYear = this.weekCursor.getFullYear();
			this.viewMonth = this.weekCursor.getMonth();
		} else if (this.panelView === "default") {
			if (this.viewMonth === 11) {
				this.viewMonth = 0;
				this.viewYear += 1;
			} else {
				this.viewMonth += 1;
			}
		} else if (this.panelView === "month") {
			this.viewYear += 1;
		} else {
			const { minBandStart, maxBandStart } = this.yearGridNavBounds();
			const next = this.yearBandStart + 9;
			if (next >= minBandStart && next <= maxBandStart) {
				this.yearBandStart = next;
			}
		}
		this.cdr.markForCheck();
	}

	onHeaderMonthActivate(): void {
		this.panelView = "month";
		this.cdr.markForCheck();
	}

	onHeaderYearActivate(): void {
		this.syncYearBandToViewYear();
		this.panelView = "year";
		this.cdr.markForCheck();
	}

	onPickDay(cell: DatePickerDayCell): void {
		if (this.readOnly || this.panelView !== "default" || cell.disabled) return;
		const clicked = cell.pickDate;

		if (!this.rangeSelection) {
			this.valueChange.emit(formatIsoDay(clicked));
			return;
		}

		const start = parseIsoDay(this.value ?? "");
		const end = parseIsoDay(this.valueEnd ?? "");

		if (start === null || (start !== null && end !== null)) {
			this.valueChange.emit(formatIsoDay(clicked));
			this.valueEndChange.emit(null);
			return;
		}

		const a0 = new Date(
			start.getFullYear(),
			start.getMonth(),
			start.getDate(),
		);
		const b0 = new Date(
			clicked.getFullYear(),
			clicked.getMonth(),
			clicked.getDate(),
		);
		let a = a0;
		let b = b0;
		if (compareCalendarDay(b, a) < 0) {
			const t = a;
			a = b;
			b = t;
		}
		this.valueChange.emit(formatIsoDay(a));
		this.valueEndChange.emit(formatIsoDay(b));
	}

	onPickMonth(cell: DatePickerDayCell): void {
		if (cell.disabled) return;
		const m = cell.pickDate.getMonth();
		this.viewMonth = m;
		this.panelView = "default";
		if (this.size === "small") {
			const d = this.weekCursor.getDate();
			this.weekCursor = clampDayInMonth(this.viewYear, m, d);
		}
		if (!this.readOnly && this.mode === "month") {
			this.valueChange.emit(formatIsoMonth(this.viewYear, m));
		}
		this.cdr.markForCheck();
	}

	onPickYear(cell: DatePickerDayCell): void {
		if (cell.disabled) return;
		const y = cell.pickDate.getFullYear();
		this.viewYear = y;
		this.panelView = "month";
		if (!this.readOnly && this.mode === "year") {
			this.valueChange.emit(formatIsoMonth(y, this.viewMonth));
		}
		this.cdr.markForCheck();
	}

	onBodyCellActivate(cell: DatePickerDayCell): void {
		if (this.panelView === "default") {
			this.onPickDay(cell);
			return;
		}
		if (this.panelView === "month") {
			this.onPickMonth(cell);
			return;
		}
		this.onPickYear(cell);
	}

	private parseSelectedDay(): Date | null {
		return parseValueForMode(this.value, "default");
	}

	private parseSelectedMonth(): { y: number; m: number } | null {
		const v = this.value;
		if (v === null || v === "") return null;

		const day = parseIsoDay(v);
		if (day) {
			return { y: day.getFullYear(), m: day.getMonth() };
		}

		const month = parseIsoMonth(v);
		if (month) {
			return { y: month.y, m: month.m };
		}

		return null;
	}

	private parseSelectedYearFromValue(): number | null {
		const v = this.value;
		if (v === null || v === "") return null;
		const pm = parseIsoMonth(v);
		if (pm) return pm.y;
		const y = parseIsoYear(v);
		return y ?? null;
	}

	private rangeDayBounds(): { min: Date; max: Date } {
		return {
			min: resolveRangeBoundMin(this.minDate),
			max: resolveRangeBoundMax(this.maxDate),
		};
	}

	private yearGridNavBounds(): { minBandStart: number; maxBandStart: number } {
		const { min, max } = this.rangeDayBounds();
		const minY = min.getFullYear();
		const maxY = max.getFullYear();
		return {
			minBandStart: minY,
			maxBandStart: Math.max(minY, maxY - 8),
		};
	}

	private clampYearBandStart(): void {
		const { minBandStart, maxBandStart } = this.yearGridNavBounds();
		this.yearBandStart = Math.min(
			Math.max(this.yearBandStart, minBandStart),
			maxBandStart,
		);
	}

	private syncYearBandToViewYear(): void {
		const vy = this.viewYear;
		const bandEnd = this.yearBandStart + 8;
		if (vy < this.yearBandStart || vy > bandEnd) {
			this.yearBandStart = vy - 4;
		}
		this.clampYearBandStart();
	}

	private mapDayToCell(
		d: Date,
		opts: { context: DatePickerDayCell["context"]; sublabel: string },
	): DatePickerDayCell {
		const today = startOfToday();
		const { min, max } = this.rangeDayBounds();
		const selSingle = this.parseSelectedDay();
		const rangeStart = this.rangeSelection ? parseIsoDay(this.value ?? "") : null;
		const rangeEnd = this.rangeSelection ? parseIsoDay(this.valueEnd ?? "") : null;
		const pastBlocked = !this.allowPast && isDayBeforeToday(d, today);
		const rangeBlocked = isDayOutsideMinMax(d, min, max);
		const description = this.dayDescription(d);
		return {
			key: formatIsoDay(d),
			label: String(d.getDate()),
			sublabel: opts.sublabel,
			context: opts.context,
			today: isSameDay(d, today),
			selected: this.resolveDaySelected(d, selSingle, rangeStart, rangeEnd),
			disabled: pastBlocked || rangeBlocked,
			pickDate: d,
			description: description ?? undefined,
		};
	}

	private dayDescription(d: Date): string | undefined {
		return this.highlightedDescriptions.get(formatIsoDay(d));
	}

	private resolveDaySelected(
		d: Date,
		selSingle: Date | null,
		rangeStart: Date | null,
		rangeEnd: Date | null,
	): CalendarDaySelected {
		if (this.rangeSelection) {
			return rangeDaySelection(d, rangeStart, rangeEnd);
		}
		if (selSingle && isSameDay(d, selSingle)) return "single";
		if (this.isHighlightedDay(d)) return "single";
		return "none";
	}

	private isHighlightedDay(d: Date): boolean {
		return this.highlightedDayKeys.has(formatIsoDay(d));
	}

	private isHighlightedMonth(year: number, monthIndex: number): boolean {
		return this.highlightedMonthKeys.has(this.monthHighlightKey(year, monthIndex));
	}

	private isHighlightedYear(year: number): boolean {
		return this.highlightedYearKeys.has(year);
	}

	private monthHighlightKey(year: number, monthIndex: number): string {
		return `${year}-${monthIndex}`;
	}

	private resolveMonthSelected(
		year: number,
		monthIndex: number,
		sel: { y: number; m: number } | null,
	): CalendarDaySelected {
		if (this.mode === "month") {
			const target = sel ?? { y: this.viewYear, m: this.viewMonth };
			if (year === target.y && monthIndex === target.m) return "single";
			if (this.isHighlightedMonth(year, monthIndex)) return "single";
			return "none";
		}

		// Em default/year o painel de mês é navegação: destaca o mês do header.
		// Sem valor (ou após navegar), o destaque acompanha `viewMonth`.
		if (year === this.viewYear && monthIndex === this.viewMonth) return "single";
		return "none";
	}

	private resolveYearSelected(
		year: number,
		selY: number | null,
	): CalendarDaySelected {
		const target = selY ?? this.viewYear;
		if (year === target) return "single";
		if (this.isHighlightedYear(year)) return "single";
		return "none";
	}

	private rebuildHighlightSets(): void {
		const days = new Set<string>();
		const months = new Set<string>();
		const years = new Set<number>();
		const descriptions = new Map<string, string>();

		const registerDay = (d: Date): void => {
			days.add(formatIsoDay(d));
			months.add(this.monthHighlightKey(d.getFullYear(), d.getMonth()));
			years.add(d.getFullYear());
		};

		for (const entry of this.highlightedDates) {
			const day = parseIsoDay(entry.date.trim());
			if (!day) continue;
			registerDay(day);
			const text = entry.description.trim();
			if (text) descriptions.set(formatIsoDay(day), text);
		}

		const valueDay = parseIsoDay(this.value ?? "");
		const endDay = parseIsoDay(this.valueEnd ?? "");
		if (valueDay) registerDay(valueDay);
		if (endDay) registerDay(endDay);

		if (valueDay && endDay && this.rangeSelection) {
			let rangeStart = new Date(
				valueDay.getFullYear(),
				valueDay.getMonth(),
				valueDay.getDate(),
			);
			let rangeEnd = new Date(
				endDay.getFullYear(),
				endDay.getMonth(),
				endDay.getDate(),
			);
			if (compareCalendarDay(rangeEnd, rangeStart) < 0) {
				const t = rangeStart;
				rangeStart = rangeEnd;
				rangeEnd = t;
			}
			const cursor = new Date(
				rangeStart.getFullYear(),
				rangeStart.getMonth(),
				rangeStart.getDate(),
			);
			while (compareCalendarDay(cursor, rangeEnd) <= 0) {
				months.add(this.monthHighlightKey(cursor.getFullYear(), cursor.getMonth()));
				years.add(cursor.getFullYear());
				cursor.setDate(cursor.getDate() + 1);
			}
		}

		const valueMonth = parseIsoMonth(this.value ?? "");
		if (valueMonth) {
			months.add(this.monthHighlightKey(valueMonth.y, valueMonth.m));
			years.add(valueMonth.y);
		}

		const valueYear = parseIsoYear(this.value ?? "");
		if (valueYear !== null) {
			years.add(valueYear);
		}

		this.highlightedDayKeys = days;
		this.highlightedMonthKeys = months;
		this.highlightedYearKeys = years;
		this.highlightedDescriptions = descriptions;
	}

	private firstHighlightedDay(): Date | null {
		for (const entry of this.highlightedDates) {
			const day = parseIsoDay(entry.date.trim());
			if (day) return day;
		}
		return null;
	}

	private syncFromValue(): void {
		const base =
			parseValueForMode(this.value, this.mode) ??
			(this.mode === "default" ? this.firstHighlightedDay() : null) ??
			startOfToday();
		this.viewYear = base.getFullYear();
		this.viewMonth = base.getMonth();
		if (this.panelView === "year") {
			this.syncYearBandToViewYear();
		}
		if (this.panelView === "default" && this.size === "small") {
			const d0 = parseIsoDay(this.value ?? "");
			const ref = d0 ?? startOfToday();
			this.weekCursor = new Date(
				ref.getFullYear(),
				ref.getMonth(),
				ref.getDate(),
			);
		}
	}

	trackDayCell(_index: number, cell: DatePickerDayCell): string {
		return cell.key;
	}
}
