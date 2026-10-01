import type { Meta, StoryObj } from "@storybook/angular";
import { ICON_COLOR_TOKEN_NAMES } from "../../../layout-&-structure/icon/utils/theme";
import { LabelComponent } from "../label.component";

const tooltipIconColorOptions = ["inherit", ...ICON_COLOR_TOKEN_NAMES] as const;

const meta: Meta<LabelComponent> = {
	title: "Terra-DS/Inputs & Controls/Label",
	component: LabelComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
### \`lib-label\`
Rótulo do Terra DS. Use \`ng-content\` para o texto principal.

- Conteúdo padrão entre as tags: texto do título.
- **description** não vazio → exibe a faixa de apoio abaixo (sem precisar de flag \`isDescription\`).
- **tooltipText** não vazio → renderiza o \`lib-tooltip\` (sem precisar de flag \`tooltip\`).
- Configuração de tooltip: \`tooltipArrow\`, \`tooltipIndicator\`, \`tooltipIcon\`.
        `,
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
      <lib-label
        [optional]="optional"
        [skeleton]="skeleton"
        [description]="description"
        [tooltipText]="tooltipText"
        [tooltipArrow]="tooltipArrow"
        [tooltipIndicator]="tooltipIndicator"
        [tooltipIcon]="tooltipIcon"
        [tooltipIconColor]="tooltipIconColor"
      >
        Label Padrão
      </lib-label>
    `,
	}),
	args: {
		optional: false,
		skeleton: false,
		description: "",
		tooltipText: "",
		tooltipArrow: "start",
		tooltipIndicator: "right",
		tooltipIcon: "Info",
		tooltipIconColor: "inherit",
	},
	argTypes: {
		optional: {
			control: "boolean",
			description: 'Quando `true`, exibe o sufixo "(opcional)" com `<small>`.',
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		skeleton: {
			control: "boolean",
			description:
				"Troca o rótulo por skeleton no padrão Solaris (`lib-skeleton`, shimmer).",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		description: {
			control: "text",
			description:
				"Texto de apoio abaixo do rótulo. Vazio = sem faixa de apoio.",
			table: { type: { summary: "string" }, defaultValue: { summary: "''" } },
		},
		tooltipText: {
			control: "text",
			description: "Texto do tooltip. Vazio = sem tooltip.",
			table: { type: { summary: "string" }, defaultValue: { summary: "''" } },
		},
		tooltipArrow: {
			control: "radio",
			options: ["start", "middle", "end"],
			description: "Posição da seta do tooltip.",
			table: {
				type: { summary: "'start' | 'middle' | 'end'" },
				defaultValue: { summary: "'start'" },
			},
		},
		tooltipIndicator: {
			control: "radio",
			options: ["top", "bottom", "left", "right"],
			description: "Lado em que o tooltip aparece em relação ao gatilho.",
			table: {
				type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
				defaultValue: { summary: "'right'" },
			},
		},
		tooltipIcon: {
			control: "text",
			description:
				"Nome do ícone do gatilho do tooltip (catálogo Solaris). Padrão: `Info`.",
			table: {
				type: { summary: "IconNameType" },
				defaultValue: { summary: "'Info'" },
			},
		},
		tooltipIconColor: {
			control: "select",
			options: tooltipIconColorOptions,
			description:
				"Cor do ícone do gatilho. Aceita um token DS (ex.: `support-blue`), `inherit` ou qualquer cor CSS livre.",
			table: {
				type: { summary: "IconColorType" },
				defaultValue: { summary: "'inherit'" },
			},
		},
	},
};

export default meta;
type Story = StoryObj<LabelComponent>;

export const Default: Story = {};

export const Optional: Story = {
	args: { optional: true },
};

export const SkeletonLoading: Story = {
	args: { skeleton: true },
};

export const WithDescription: Story = {
	args: {
		description: "Texto de apoio abaixo do rótulo",
	},
};

export const WithTooltip: Story = {
	args: {
		tooltipText: "Detalhes adicionais sobre o campo",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Basta preencher `tooltipText` para o tooltip aparecer. Sem flag booleana extra.",
			},
		},
	},
};

export const WithColoredTooltipIcon: Story = {
	args: {
		tooltipText: "Atenção a este campo",
		tooltipIcon: "Warning",
		tooltipIconColor: "feedback-warning",
	},
	parameters: {
		docs: {
			description: {
				story:
					"`tooltipIconColor` aceita tokens DS (ex.: `feedback-warning`, `support-blue`), `inherit` ou cor CSS livre.",
			},
		},
	},
};

export const UsoEmFormulario: Story = {
	name: "Uso em formulário",
	render: () => ({
		moduleMetadata: { imports: [LabelComponent] },
		template: `
      <div style="display: flex; flex-direction: column; align-items: stretch; gap: 8px; min-width: 280px;">
        <lib-label description="Apenas números e hífen">
          Número do cartão
        </lib-label>
        <input
          type="text"
          placeholder="0000-0000-0000-0000"
          style="height: 40px; border-radius: 8px; border: 1px solid #cfd8dc; padding: 0 12px; font: inherit; box-sizing: border-box;" />
      </div>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					"Exemplo de uso do `lib-label` em conjunto com um campo de formulário.",
			},
		},
	},
};
