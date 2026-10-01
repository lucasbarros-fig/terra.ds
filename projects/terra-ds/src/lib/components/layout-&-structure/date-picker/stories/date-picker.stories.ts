import type { Meta, StoryObj } from "@storybook/angular";

import { DatePickerComponent } from "../date-picker.component";
import type { DatePickerHighlightedDates } from "../date-picker.types";

const datePickerDocsDescription =
	"Selecionar datas ou intervalos de forma guiada, permitindo navegar entre dias, meses e anos sem sair do contexto da interface.";

const meta: Meta<DatePickerComponent> = {
	title: "Terra-DS/Layout & Structure/Date Picker",
	component: DatePickerComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: datePickerDocsDescription,
			},
		},
	},
	argTypes: {
		mode: {
			control: "select",
			options: ["default", "month", "year"],
		},
		size: {
			control: "select",
			options: ["default", "small"],
		},
		showYear: { control: "boolean" },
		allowPast: { control: "boolean" },
		rangeSelection: { control: "boolean" },
		value: { control: "text" },
		valueEnd: { control: "text" },
		minDate: { control: "text" },
		maxDate: { control: "text" },
		highlightedDates: { control: "object" },
		readOnly: { control: "boolean" },
	},
	render: (args) => ({
		props: args,
		template: `
			<lib-date-picker
				[value]="value"
				[valueEnd]="valueEnd"
				[mode]="mode"
				[size]="size"
				[showYear]="showYear"
				[allowPast]="allowPast"
				[rangeSelection]="rangeSelection"
				[minDate]="minDate"
				[maxDate]="maxDate"
				[highlightedDates]="highlightedDates"
				[readOnly]="readOnly"
				(valueChange)="value = $event"
				(valueEndChange)="valueEnd = $event"
			></lib-date-picker>
		`,
	}),
	args: {
		value: "2026-05-13",
		valueEnd: null,
		mode: "default",
		size: "default",
		showYear: true,
		allowPast: true,
		rangeSelection: false,
		minDate: null,
		maxDate: null,
		highlightedDates: [] satisfies DatePickerHighlightedDates,
		readOnly: false,
	},
};

export default meta;
type Story = StoryObj<DatePickerComponent>;

export const Default: Story = {
	name: "Default",
};

export const MonthMode: Story = {
	name: "Month",
	args: {
		mode: "month",
		value: "2026-05",
	},
};

export const YearMode: Story = {
	name: "Year",
	args: {
		mode: "year",
		value: "2026-05",
	},
};

export const SmallWeek: Story = {
	name: "Small",
	args: {
		size: "small",
		value: "2026-05-13",
	},
};

export const SemPassadoBloqueado: Story = {
	name: "Past days not allowed",
	args: {
		allowPast: false,
		value: "2026-05-13",
	},
};

export const Intervalo: Story = {
	name: "Range",
	args: {
		rangeSelection: true,
		value: "2026-05-10",
		valueEnd: "2026-05-18",
	},
};

export const MinMax: Story = {
	name: "Min and Max limits",
	args: {
		minDate: "2026-05-01",
		maxDate: "2026-05-31",
		value: "2026-05-13",
	},
};

export const EventDaysReadOnly: Story = {
	name: "Event days (read-only)",
	args: {
		value: null,
		readOnly: true,
		highlightedDates: [
			{ date: "2026-05-03", description: "Workshop de design" },
			{ date: "2026-05-10", description: "Revisão de sprint" },
			{ date: "2026-05-13", description: "Demo com cliente" },
			{ date: "2026-05-18", description: "Entrega do relatório" },
			{ date: "2026-05-22", description: "Retrospectiva" },
		],
	},
};
