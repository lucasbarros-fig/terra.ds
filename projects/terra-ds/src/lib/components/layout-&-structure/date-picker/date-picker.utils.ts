import type { CalendarDaySelected } from "./calendar-day/calendar-day.types";

export const MONTH_PT = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez",
] as const;

export const WEEK_HEADER_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

export const WEEK_LETTER_PT = ["D", "S", "T", "Q", "Q", "S", "S"] as const;

export const MONTH_SELECT_LABELS_PT: readonly string[] = Array.from(
	{ length: 12 },
	(_, i) => {
		const full = new Date(2000, i, 1).toLocaleString("pt-BR", { month: "long" });
		return full.charAt(0).toUpperCase() + full.slice(1);
	},
);

export function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function startOfToday(): Date {
	const n = new Date();
	return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function buildMonthGrid(
	year: number,
	month: number,
	totalCells: number,
): Date[] {
	const first = new Date(year, month, 1);
	const lead = first.getDay();
	const start = new Date(year, month, 1 - lead);
	const out: Date[] = [];
	for (let i = 0; i < totalCells; i++) {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		out.push(d);
	}
	return out;
}

export function weekSliceContaining(date: Date): Date[] {
	const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const lead = d0.getDay();
	const start = new Date(d0);
	start.setDate(d0.getDate() - lead);
	const out: Date[] = [];
	for (let i = 0; i < 7; i++) {
		const x = new Date(start);
		x.setDate(start.getDate() + i);
		out.push(x);
	}
	return out;
}

export function rangeInclusive(from: number, to: number): number[] {
	if (to < from) return [];
	return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

export type YearDropdownBounds = { minYear: number; maxYear: number };

export function yearDropdownRange(
	center: number,
	yearBounds?: YearDropdownBounds,
): number[] {
	const nominalFrom = Math.max(1900, center - 40);
	const nominalTo = Math.min(2100, center + 20);
	if (!yearBounds) return rangeInclusive(nominalFrom, nominalTo);
	const lo = Math.min(yearBounds.minYear, yearBounds.maxYear);
	const hi = Math.max(yearBounds.minYear, yearBounds.maxYear);
	const from = Math.max(nominalFrom, lo);
	const to = Math.min(nominalTo, hi);
	if (from <= to) return rangeInclusive(from, to);
	return rangeInclusive(lo, hi);
}

export function clampDayInMonth(year: number, month: number, day: number): Date {
	const last = new Date(year, month + 1, 0).getDate();
	return new Date(year, month, Math.min(Math.max(1, day), last));
}

export function compareCalendarDay(a: Date, b: Date): number {
	const ay = a.getFullYear();
	const am = a.getMonth();
	const ad = a.getDate();
	const by = b.getFullYear();
	const bm = b.getMonth();
	const bd = b.getDate();
	if (ay !== by) return ay < by ? -1 : 1;
	if (am !== bm) return am < bm ? -1 : 1;
	if (ad !== bd) return ad < bd ? -1 : 1;
	return 0;
}

export function isDayBeforeToday(d: Date, todayStart: Date): boolean {
	return compareCalendarDay(d, todayStart) < 0;
}

export function isMonthIndexPast(
	year: number,
	monthIndex: number,
	todayStart: Date,
): boolean {
	const ty = todayStart.getFullYear();
	const tm = todayStart.getMonth();
	if (year < ty) return true;
	if (year > ty) return false;
	return monthIndex < tm;
}

export function isYearPast(y: number, todayStart: Date): boolean {
	return y < todayStart.getFullYear();
}

export function rangeDaySelection(
	d: Date,
	start: Date | null,
	end: Date | null,
): CalendarDaySelected {
	if (!start) return "none";
	let ds = new Date(start.getFullYear(), start.getMonth(), start.getDate());
	if (!end) {
		return compareCalendarDay(d, ds) === 0 ? "single" : "none";
	}
	let de = new Date(end.getFullYear(), end.getMonth(), end.getDate());
	if (compareCalendarDay(ds, de) > 0) {
		const t = ds;
		ds = de;
		de = t;
	}
	const c0 = compareCalendarDay(d, ds);
	const c1 = compareCalendarDay(d, de);
	if (c0 < 0 || c1 > 0) return "none";
	if (c0 === 0 && c1 === 0) return "single";
	if (c0 === 0) return "start";
	if (c1 === 0) return "end";
	return "middle";
}

export function isDayOutsideCalendarMonthDisplay(
	d: Date,
	viewYear: number,
	viewMonth: number,
): boolean {
	return d.getFullYear() !== viewYear || d.getMonth() !== viewMonth;
}

export function isDayOutsideMinMax(d: Date, minD: Date, maxD: Date): boolean {
	return compareCalendarDay(d, minD) < 0 || compareCalendarDay(d, maxD) > 0;
}

export function isMonthOutsideSelectableRange(
	year: number,
	monthIndex: number,
	minD: Date,
	maxD: Date,
): boolean {
	const last = new Date(year, monthIndex + 1, 0);
	const first = new Date(year, monthIndex, 1);
	if (compareCalendarDay(last, minD) < 0) return true;
	if (compareCalendarDay(first, maxD) > 0) return true;
	return false;
}

export function isYearOutsideSelectableRange(
	y: number,
	minD: Date,
	maxD: Date,
): boolean {
	const dec31 = new Date(y, 11, 31);
	const jan1 = new Date(y, 0, 1);
	if (compareCalendarDay(dec31, minD) < 0) return true;
	if (compareCalendarDay(jan1, maxD) > 0) return true;
	return false;
}
