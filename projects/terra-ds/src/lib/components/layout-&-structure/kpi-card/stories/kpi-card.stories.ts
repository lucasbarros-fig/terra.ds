import type { Meta, StoryObj } from "@storybook/angular";
import { action } from "storybook/actions";

import { KpiCardComponent } from "../kpi-card.component";

const meta: Meta<KpiCardComponent> = {
	title: "Terra-DS/Layout & Structure/KPI Card",
	component: KpiCardComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
### \`lib-kpi-card\`

Card compacto alinhado ao Figma (**KPI Card**). Apresenta um indicador-chave: ícone e rótulo, valor em destaque e um Status com nota de contexto (tendência, meta ou prazo).

- **Rótulo**: \`icon\` (20px) + \`label\` (Body Regular 14).
- **Valor**: \`value\` (Heading Bold 24).
- **Contexto**: \`lib-status\` small (\`statusLabel\`, \`statusColor\`) + \`note\` (Caption Medium 12).
- **Estados**: com \`interactive\`, o card é focável (\`role="button"\`), mostra Hovering via \`:hover\` e Focus via \`:focus-visible\` (anel externo de 2px), e emite \`(cardClick)\` em clique, Enter ou Espaço.
- **Filtro**: em dashboards, use \`selected\` (refletido em \`aria-pressed\`) para indicar o filtro ativo.

Mantenha rótulos curtos e sempre acompanhe o valor de contexto — um número sozinho não orienta a decisão.
        `.trim(),
			},
		},
	},
	render: (args) => ({
		props: { ...args, onCardClick: action("cardClick") },
		template: `
			<div style="width: 300px;">
				<lib-kpi-card
					[label]="label"
					[value]="value"
					[icon]="icon"
					[statusLabel]="statusLabel"
					[statusColor]="statusColor"
					[note]="note"
					[interactive]="interactive"
					[selected]="selected"
					(cardClick)="onCardClick($event)"
				></lib-kpi-card>
			</div>
		`,
	}),
	argTypes: {
		statusColor: {
			control: "select",
			options: ["positive", "negative", "informative", "warning", "neutral", "disabled"],
		},
		selected: { control: "boolean" },
	},
	args: {
		label: "Indicador",
		value: "00",
		icon: "DiamondsFour",
		statusLabel: "Status",
		statusColor: "neutral",
		note: "Nota de contexto",
		interactive: false,
		selected: undefined,
	},
};

export default meta;
type Story = StoryObj<KpiCardComponent>;

export const Default: Story = {
	name: "Default",
};

export const Interativo: Story = {
	name: "Interativo (filtro)",
	render: (args) => ({
		props: {
			...args,
			onCardClick: action("cardClick"),
			ativo: false,
			toggle(this: { ativo: boolean }) {
				this.ativo = !this.ativo;
			},
		},
		template: `
			<p style="font: 12px sans-serif; color: var(--color-text-essential-caption); margin: 0 0 16px;">
				Passe o mouse para ver o Hovering; use Tab para ver o Focus; Enter/Espaço ou clique alternam o filtro.
			</p>
			<div style="width: 300px; padding: 12px;">
				<lib-kpi-card
					label="SLA em risco"
					value="3"
					icon="WarningCircle"
					statusLabel="Crítico"
					statusColor="negative"
					note="vencem em menos de 1 h"
					[interactive]="true"
					[selected]="ativo"
					(cardClick)="toggle(); onCardClick($event)"
				></lib-kpi-card>
			</div>
			<p style="font: 12px sans-serif; color: var(--color-text-essential-caption); margin: 12px 0 0;">
				Filtro: <strong>{{ ativo ? 'ativo' : 'inativo' }}</strong>
			</p>
		`,
	}),
	parameters: { layout: "padded" },
};

export const LinhaDeKpis: Story = {
	name: "Linha de KPIs",
	render: (args) => ({
		props: { ...args, onCardClick: action("cardClick") },
		template: `
			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; padding: 12px;">
				<lib-kpi-card label="Minha carteira" value="8" icon="UserCircle"
					statusLabel="8 de 10" statusColor="neutral" note="capacidade do turno"
					[interactive]="true" (cardClick)="onCardClick($event)"></lib-kpi-card>
				<lib-kpi-card label="Fila da equipe" value="15" icon="HourglassMedium"
					statusLabel="5 novas hoje" statusColor="informative" note="aguardando distribuição"
					[interactive]="true" (cardClick)="onCardClick($event)"></lib-kpi-card>
				<lib-kpi-card label="SLA em risco" value="3" icon="WarningCircle"
					statusLabel="Crítico" statusColor="negative" note="vencem em menos de 1 h"
					[interactive]="true" (cardClick)="onCardClick($event)"></lib-kpi-card>
				<lib-kpi-card label="Aprovadas hoje" value="14" icon="CheckCircle"
					statusLabel="+4 em relação a ontem" statusColor="positive" note="R$ 612 mil liberados"
					[interactive]="true" (cardClick)="onCardClick($event)"></lib-kpi-card>
			</div>
		`,
	}),
	parameters: { layout: "padded" },
};
