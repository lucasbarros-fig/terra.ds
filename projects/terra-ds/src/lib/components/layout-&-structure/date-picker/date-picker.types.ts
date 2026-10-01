import type {
	CalendarDayContext,
	CalendarDaySelected,
} from "./calendar-day/calendar-day.types";

export type DatePickerMode = "default" | "month" | "year";

export type DatePickerSize = "default" | "small";

export interface DatePickerHighlightedDate {
	readonly date: string;
	readonly description: string;
}

export type DatePickerHighlightedDates = readonly DatePickerHighlightedDate[];

export interface DatePickerFieldOption {
	readonly value: string;
	readonly label: string;
	readonly disabled?: boolean;
}

export interface DatePickerDayCell {
	readonly key: string;
	readonly label: string;
	readonly sublabel: string;
	readonly context: CalendarDayContext;
	readonly today: boolean;
	readonly selected: CalendarDaySelected;
	readonly disabled: boolean;
	readonly pickDate: Date;
	readonly description?: string;
}
