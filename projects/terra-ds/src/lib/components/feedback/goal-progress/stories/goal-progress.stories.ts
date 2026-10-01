import type { Meta, StoryObj } from "@storybook/angular";

import { GoalProgressComponent } from "../goal-progress.component";

const meta: Meta<GoalProgressComponent> = {
	title: "Terra-DS/Feedback/Goal Progress",
	component: GoalProgressComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
### \`lib-goal-progress\`

Barra de meta alinhada ao Figma (**Goal Progress**). Mostra o avanço de uma meta: rótulo, valor atual vs. meta, barra com marcador da meta e Status com nota de contexto.

- **Topo**: \`label\` (Body Medium 14) e \`valueText\` (Body Regular 14).
- **Trilho** (10px): progresso por \`value\` / \`max\` (default 100); marcador vertical 2×16px na posição de \`target\` (mesma escala de \`max\`, opcional).
- **Status**: \`positive\` (meta atingida ou dentro do limite), \`warning\` (abaixo da meta ou do ritmo) e \`neutral\` (em andamento). \`statusLabel\` é sempre visível — o status nunca é comunicado só por cor.
- **Acessibilidade**: o trilho tem \`role="progressbar"\` com \`aria-valuenow/min/max\`, \`aria-label\` = \`label\` e \`aria-valuetext\` gerado (ex.: "94%, meta 95%, abaixo da meta"). Use \`ariaValueText\` para substituí-lo.
- **Menor é melhor**: \`lowerIsBetter\` ajusta a semântica do \`aria-valuetext\` ("limite" em vez de "meta"). Deixe isso explícito também na \`note\`.
        `.trim(),
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
			<div style="width: 360px;">
				<lib-goal-progress
					[label]="label"
					[valueText]="valueText"
					[value]="value"
					[max]="max"
					[target]="target"
					[status]="status"
					[statusLabel]="statusLabel"
					[note]="note"
					[lowerIsBetter]="lowerIsBetter"
				></lib-goal-progress>
			</div>
		`,
	}),
	argTypes: {
		status: { control: "select", options: ["positive", "warning", "neutral"] },
		value: { control: { type: "range", min: 0, max: 100, step: 1 } },
		target: { control: { type: "number", min: 0, max: 100 } },
	},
	args: {
		label: "Meta",
		valueText: "0 de 0",
		value: 92,
		max: 100,
		target: 100,
		status: "positive",
		statusLabel: "Atingida",
		note: "Nota de contexto",
		lowerIsBetter: false,
	},
};

export default meta;
type Story = StoryObj<GoalProgressComponent>;

export const Positive: Story = {
	name: "Positive",
};

export const Warning: Story = {
	name: "Warning",
	args: { value: 70, status: "warning", statusLabel: "Abaixo da meta" },
};

export const Neutral: Story = {
	name: "Neutral",
	args: { value: 50, status: "neutral", statusLabel: "Em andamento" },
};

export const MetasDoMes: Story = {
	name: "Metas do mês",
	render: () => ({
		template: `
			<div style="display: flex; flex-direction: column; gap: 24px; width: 360px;">
				<lib-goal-progress label="Propostas analisadas" valueText="42 de 60"
					[value]="42" [max]="60" [target]="60"
					status="warning" statusLabel="Abaixo do ritmo"
					note="no ritmo atual: 46 de 60 até dia 30"></lib-goal-progress>
				<lib-goal-progress label="Qualidade da análise" valueText="92% · meta 90%"
					[value]="92" [target]="90"
					status="positive" statusLabel="Atingida"
					note="propostas sem retrabalho"></lib-goal-progress>
				<lib-goal-progress label="SLA cumprido" valueText="94% · meta 95%"
					[value]="94" [target]="95"
					status="warning" statusLabel="Abaixo da meta"
					note="3 propostas em risco hoje"></lib-goal-progress>
				<lib-goal-progress label="Tempo médio de análise" valueText="38 min · limite 45 min"
					[value]="38" [max]="45" [target]="45" [lowerIsBetter]="true"
					status="positive" statusLabel="Dentro do limite"
					note="menor é melhor · 7 min de folga"></lib-goal-progress>
			</div>
		`,
	}),
};
