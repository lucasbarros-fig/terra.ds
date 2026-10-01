import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { action } from "storybook/actions";

import { ClockFieldComponent } from "../clock-field/clock-field.component";
import { ClockPickerComponent } from "../clock-picker.component";

const meta: Meta<ClockPickerComponent> = {
	title: "Terra-DS/Layout & Structure/Clock Picker",
	component: ClockPickerComponent,
	tags: ["autodocs"],
	decorators: [moduleMetadata({ imports: [ClockFieldComponent, ReactiveFormsModule] })],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
### \`lib-clock-picker\` e \`lib-clock-field\`

Seleção de horário (24h) em **colunas de hora e minuto**, alinhada ao Figma (**Clock Picker** / **Clock Field**) e irmã visual do Date Picker.

**\`lib-clock-picker\`** (painel)
- \`value\` (\`"HH:mm"\` ou \`null\`) e \`(valueChange)\`.
- \`size\`: \`default\` (5 itens por coluna, com painel) ou \`small\` (3 itens, sem fundo/borda — como o Date Picker Small).
- \`minuteStep\` (ex.: 5, 15), \`minTime\` / \`maxTime\` para bloquear horários fora do intervalo.
- \`showHeader\` + \`title\`; \`showFooter\` com **Cancelar** / **Aplicar**. Com rodapé, a escolha é um rascunho até **Aplicar** (\`(applied)\`, \`(cancelled)\`); sem rodapé, \`(valueChange)\` dispara a cada clique.
- Teclado: Tab entre colunas, ↑/↓ para mudar o valor, Home/End para o primeiro/último.

**\`lib-clock-field\`** (campo)
- Campo no estilo Input Outline com ícone **Clock à esquerda**; abre o painel num dropdown.
- \`[(value)]\` ou \`formControl\` / \`ngModel\`; \`label\`, \`placeholder\`, \`helperText\`, \`error\`, \`disabled\`.
- Repassa \`minuteStep\`, \`minTime\`, \`maxTime\` e \`showFooter\` para o painel.
        `.trim(),
			},
		},
	},
	argTypes: {
		size: { control: "inline-radio", options: ["default", "small"] },
		minuteStep: { control: "select", options: [1, 5, 10, 15, 30] },
	},
	args: {
		value: "09:30",
		size: "default",
		minuteStep: 1,
		minTime: null,
		maxTime: null,
		showHeader: true,
		title: "Horário",
		showFooter: true,
	},
	render: (args) => ({
		props: { ...args, valueChange: action("valueChange"), applied: action("applied"), cancelled: action("cancelled") },
		template: `
			<lib-clock-picker
				[value]="value"
				[size]="size"
				[minuteStep]="minuteStep"
				[minTime]="minTime"
				[maxTime]="maxTime"
				[showHeader]="showHeader"
				[title]="title"
				[showFooter]="showFooter"
				(valueChange)="valueChange($event)"
				(applied)="applied($event)"
				(cancelled)="cancelled()"
			></lib-clock-picker>
		`,
	}),
};

export default meta;
type Story = StoryObj<ClockPickerComponent>;

export const Default: Story = {
	name: "Painel — Default",
};

export const Small: Story = {
	name: "Painel — Small",
	args: { size: "small" },
};

export const SemRodape: Story = {
	name: "Painel — Sem rodapé (seleção imediata)",
	args: { showFooter: false, showHeader: false },
};

export const Intervalo: Story = {
	name: "Painel — Passo de 15 min, 08:00 às 18:00",
	args: { value: "10:15", minuteStep: 15, minTime: "08:00", maxTime: "18:00" },
};

export const Campo: Story = {
	name: "Clock Field",
	parameters: { controls: { disable: true } },
	render: () => ({
		props: { time: null },
		template: `
			<div style="min-height: 420px;">
				<lib-clock-field [(value)]="time"></lib-clock-field>
				<p style="font: 12px sans-serif; color: var(--color-text-essential-caption); margin-top: 12px;">
					Valor: {{ time ?? "—" }}
				</p>
			</div>
		`,
	}),
};

export const CampoEstados: Story = {
	name: "Clock Field — Estados",
	parameters: { controls: { disable: true } },
	render: () => ({
		template: `
			<div style="display: grid; grid-template-columns: repeat(2, 272px); gap: 24px;">
				<lib-clock-field></lib-clock-field>
				<lib-clock-field value="09:30"></lib-clock-field>
				<lib-clock-field value="09:30" [error]="true" helperText="Horário fora do expediente"></lib-clock-field>
				<lib-clock-field value="09:30" [disabled]="true"></lib-clock-field>
			</div>
		`,
	}),
};

export const CampoFormulario: Story = {
	name: "Clock Field — Reactive Forms",
	parameters: { controls: { disable: true } },
	render: () => {
		const control = new FormControl<string | null>("14:00");
		return {
			props: { control },
			template: `
				<div style="min-height: 420px;">
					<lib-clock-field
						label="Início da reunião"
						[formControl]="control"
						[minuteStep]="15"
						minTime="08:00"
						maxTime="18:00"
						helperText="Entre 08:00 e 18:00, a cada 15 min"
					></lib-clock-field>
					<p style="font: 12px sans-serif; color: var(--color-text-essential-caption); margin-top: 12px;">
						control.value: {{ control.value ?? "—" }}
					</p>
				</div>
			`,
		};
	},
};
