import type { Meta, StoryObj } from "@storybook/angular";
import { StepsComponent } from "../steps.component";

const stepsDocsDescription =
	"Organiza e apresenta etapas de um processo de forma clara e sequencial, permitindo acompanhar o progresso e orientar o usuário ao longo de fluxos estruturados. Indica estados como concluído, em andamento ou pendente, facilitando a compreensão do momento atual e dos próximos passos. Aplique Steps para guiar jornadas, reduzir incertezas e tornar processos mais previsíveis, eficientes e fáceis de acompanhar.\n\n**Sempre acima do Título da tela, nunca abaixo.**";

const meta: Meta<StepsComponent> = {
	title: "Terra-DS/Layout & Structure/Steps",
	component: StepsComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: stepsDocsDescription,
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
      <lib-steps
        [total]="total"
        [current]="current"
        [label]="label"
        [showNumber]="showNumber"
      ></lib-steps>
    `,
	}),
	args: {
		total: 6,
		current: 2,
		showNumber: true,
	},
	argTypes: {
		total: {
			control: "number",
			description: "Quantidade total de etapas.",
			table: { type: { summary: "number" }, defaultValue: { summary: "1" } },
		},
		current: {
			control: "number",
			description: "Índice da etapa atual (base 0).",
			table: { type: { summary: "number" }, defaultValue: { summary: "0" } },
		},
		label: {
			control: "object",
			description:
				"Texto do label — exibe o header quando definido. Aceita `string` (fixo) ou `string[]` (um por etapa).",
			table: {
				type: { summary: "string | string[]" },
				defaultValue: { summary: "undefined" },
			},
		},
		showNumber: {
			control: "boolean",
			description:
				'Exibe o contador "atual/total" no header (requer `label` definido).',
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "true" },
			},
		},
	},
};

export default meta;
type Story = StoryObj<StepsComponent>;

// Figma: Show Labels = false (padrão)
export const Default: Story = {};

// Figma: Show Labels = true, Show Number = true
export const WithLabel: Story = {
	args: { label: "Label steps", showNumber: true },
};

// Figma: Show Labels = true, Show Number = false
export const WithLabelOnly: Story = {
	args: { label: "Label steps", showNumber: false },
};

// label por etapa (string[])
export const WithLabelPerStep: Story = {
	args: {
		total: 3,
		current: 1,
		label: ["Etapa 1", "Etapa 2", "Etapa 3"],
	},
};
