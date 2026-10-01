/** Horário no formato `HH:mm` (24h). */
export type ClockTime = string;

export type ClockPickerSize = "default" | "small";

export interface ClockParts {
	hour: number;
	minute: number;
}

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function pad2(value: number): string {
	return String(value).padStart(2, "0");
}

export function parseClockTime(value: string | null | undefined): ClockParts | null {
	const match = TIME_RE.exec((value ?? "").trim());
	if (!match) return null;
	return { hour: Number(match[1]), minute: Number(match[2]) };
}

export function formatClockTime(parts: ClockParts): ClockTime {
	return `${pad2(parts.hour)}:${pad2(parts.minute)}`;
}

export function toMinutes(parts: ClockParts): number {
	return parts.hour * 60 + parts.minute;
}

/** Minutos 0–59 no passo informado (passos inválidos caem para 1). */
export function buildMinuteOptions(step: number): number[] {
	const safeStep = Number.isInteger(step) && step >= 1 && step <= 30 ? step : 1;
	const minutes: number[] = [];
	for (let m = 0; m < 60; m += safeStep) minutes.push(m);
	return minutes;
}
