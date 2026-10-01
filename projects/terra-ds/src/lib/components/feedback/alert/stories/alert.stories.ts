import type { Meta, StoryObj } from "@storybook/angular";

import { AlertComponent } from "../alert.component";

const meta: Meta<AlertComponent> = {
	title: "Terra-DS/Feedback/Alert",
	component: AlertComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: `
### \`lib-alert\`

Destaca, no topo de uma área, uma situação que pede atenção imediata — como prazos prestes a vencer ou um problema que afeta vários itens — e oferece a **ação principal** para resolvê-la. Alinhado ao Figma (**Alert**).

Diferente do **Toast**, é **persistente** e fica no fluxo da página até a situação mudar. Use **no máximo um Alert por tela**.

- **Tipos** (\`type\`):
  - \`neutral\` (padrão) — atenção geral. Fundo Support Neutral e ação \`lib-button\` Branding Filled.
  - \`negative\` — erro ou risco crítico. Anunciado com \`role="alert"\`.
  - \`informative\` — aviso sem urgência.
  - \`neutral\` e \`informative\` usam \`role="status"\`.
- **Conteúdo**: ícone 24px (WarningCircle; Info no informative), \`title\` (Body Bold 16) e \`description\` (Body Regular 14), em branco.
- **Ação**: \`actionLabel\` + \`(action)\`; oculte com \`showAction\`. Em \`negative\`/\`informative\` a ação é o \`lib-button\` Neutral com texto e borda brancos — um override de estilo **local** ao Alert (o \`lib-button\` global não muda).

> **Não há variante Warning**: texto branco sobre a cor de Warning não atinge o contraste mínimo de 4,5:1 (WCAG AA). Para avisos de atenção, use \`neutral\`.
        `.trim(),
			},
		},
	},
	argTypes: {
		type: { control: "inline-radio", options: ["neutral", "negative", "informative"] },
	},
	args: {
		type: "neutral",
		title: "3 propostas da sua carteira vencem em menos de 1 hora",
		description:
			"#48213 Marcos Vinícius Lima · 18 min · #48207 Fernanda Prado Costa · 42 min · #48215 Luana Martins Ferreira · 51 min",
		showAction: true,
		actionLabel: "Começar pela #48213",
	},
	render: (args) => ({
		props: args,
		template: `
			<lib-alert
				[type]="type"
				[title]="title"
				[description]="description"
				[showAction]="showAction"
				[actionLabel]="actionLabel"
				(action)="action($event)"
			></lib-alert>
		`,
	}),
};

export default meta;
type Story = StoryObj<AlertComponent>;

export const Neutral: Story = {
	name: "Neutral",
};

export const Negative: Story = {
	name: "Negative",
	args: {
		type: "negative",
		title: "Não foi possível sincronizar 12 propostas",
		description: "A integração com o banco parceiro está fora do ar desde 14h32. As propostas ficam salvas e serão reenviadas.",
		actionLabel: "Tentar novamente",
	},
};

export const Informative: Story = {
	name: "Informative",
	args: {
		type: "informative",
		title: "Nova tabela de taxas a partir de 01/10",
		description: "As simulações feitas a partir de amanhã já usam os novos valores de crédito imobiliário e veicular.",
		actionLabel: "Ver tabela",
	},
};

export const SemAcao: Story = {
	name: "Sem ação",
	args: { showAction: false },
};
