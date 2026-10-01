import type { DatePickerMode } from "./date-picker.types";

export function formatIsoDay(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function formatIsoMonth(year: number, monthIndex: number): string {
	const m = String(monthIndex + 1).padStart(2, "0");
	return `${year}-${m}`;
}

export function formatIsoYear(year: number): string {
	return String(year);
}

export function parseIsoDay(value: string): Date | null {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
	if (!m) return null;
	const y = Number(m[1]);
	const mo = Number(m[2]) - 1;
	const da = Number(m[3]);
	const dt = new Date(y, mo, da);
	if (
		dt.getFullYear() !== y ||
		dt.getMonth() !== mo ||
		dt.getDate() !== da
	) {
		return null;
	}
	return dt;
}

export function parseIsoMonth(value: string): { y: number; m: number } | null {
	const m = /^(\d{4})-(\d{2})$/.exec(value.trim());
	if (!m) return null;
	const y = Number(m[1]);
	const mo = Number(m[2]) - 1;
	if (mo < 0 || mo > 11) return null;
	return { y, m: mo };
}

export function parseIsoYear(value: string): number | null {
	const m = /^(\d{4})$/.exec(value.trim());
	if (!m) return null;
	const y = Number(m[1]);
	if (y < 1 || y > 9999) return null;
	return y;
}

export function parseValueForMode(
	value: string | null,
	mode: DatePickerMode,
): Date | null {
	if (value === null || value === "") return null;
	if (mode === "default") return parseIsoDay(value);
	if (mode === "month") {
		const p = parseIsoMonth(value);
		return p ? new Date(p.y, p.m, 1) : null;
	}
	const pm = parseIsoMonth(value);
	if (pm) return new Date(pm.y, pm.m, 1);
	const y = parseIsoYear(value);
	return y !== null ? new Date(y, 0, 1) : null;
}

export const DATE_PICKER_DEFAULT_MIN = "1900-01-01";

export const DATE_PICKER_DEFAULT_MAX = "2100-12-31";

export function resolveRangeBoundMin(minDate: string | null | undefined): Date {
	const s = minDate?.trim();
	const p = s ? parseIsoDay(s) : parseIsoDay(DATE_PICKER_DEFAULT_MIN);
	return p ?? parseIsoDay(DATE_PICKER_DEFAULT_MIN)!;
}

export function resolveRangeBoundMax(maxDate: string | null | undefined): Date {
	const s = maxDate?.trim();
	const p = s ? parseIsoDay(s) : parseIsoDay(DATE_PICKER_DEFAULT_MAX);
	return p ?? parseIsoDay(DATE_PICKER_DEFAULT_MAX)!;
}
