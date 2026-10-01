import type { Meta, StoryObj } from "@storybook/angular";

import { EmptyStateComponent } from "../empty-state.component";

const meta: Meta<EmptyStateComponent> = {
	title: "Terra-DS/Layout & Structure/Empty State",
	component: EmptyStateComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
### \`lib-empty-state\`

Bloco de **Empty State** alinhado ao Figma (**Empty State**). Ícone, títulos, descrições e botão são **opcionais**: cada parte só entra no DOM quando há conteúdo.

- \`icon\` / \`iconSize\`: área do ícone com moldura (fundo elevado + borda). Sem \`icon\`, a moldura não é renderizada.
- \`title\`: texto em destaque (Body Bold 14).
- \`description\` ou \`descriptions\`: texto secundário (Caption Medium 12). Se \`descriptions\` tiver itens, eles têm precedência; cada string não vazia vira um parágrafo.
- \`buttonLabel\`, \`buttonIcon\`, \`buttonIntent\` (\`branding\` | \`neutral\`), \`buttonDisabled\`: ação primária via \`lib-button\` (\`filled\`). Sem \`buttonLabel\`, o botão não é renderizado.
- \`(buttonClicked)\`: clique no botão (respeita \`disabled\`).
        `.trim(),
			},
		},
	},
	argTypes: {
		buttonIntent: {
			control: "select",
			options: ["neutral", "branding"],
		},
	},
	render: (args) => ({
		props: args,
		template: `
			<lib-empty-state
				[icon]="icon"
				[title]="title"
				[description]="description"
				[buttonLabel]="buttonLabel"
				[buttonIcon]="buttonIcon"
				[buttonIntent]="buttonIntent"
				[buttonDisabled]="buttonDisabled"
				(buttonClicked)="buttonClicked($event)"
			></lib-empty-state>
    `,
	}),
	args: {
		icon: "DiamondsFour",
		title: "Title",
		description: "Description",
		buttonLabel: "Button Text",
		buttonIcon: "DiamondsFour",
		buttonIntent: "neutral",
		buttonDisabled: false,
	},
};

export default meta;
type Story = StoryObj<EmptyStateComponent>;

export const Default: Story = {
	name: "Default",
};

export const TitleOnly: Story = {
	name: "Text Only",
	args: {
		icon: undefined,
		description: "Description",
		buttonLabel: "",
		title: "Title",
	},
};

export const WithoutButton: Story = {
	name: "Without Button",
	args: {
		buttonLabel: "",
	},
};

export const IconAndAction: Story = {
	name: "Icon and Action",
	args: {
		title: "",
		description: "",
	},
};

export const BrandingButton: Story = {
	name: "Branding Button",
	args: {
		buttonIntent: "branding",
	},
};
