import { RouterTestingModule } from "@angular/router/testing";
import { type Meta, moduleMetadata, type StoryObj } from "@storybook/angular";

import { TopComponent } from "../top.component";
import type { TopAction } from "../top.component";

const acoesPadrao: TopAction[] = [
	{ id: "escola", icon: "GraduationCap", label: "Escola" },
	{ id: "loja", icon: "storefront", label: "Loja" },
	{ id: "notificacoes", icon: "BellSimple", label: "Notificações", badge: true },
	{ id: "configuracoes", icon: "GearSix", label: "Configurações" },
];

const meta: Meta<TopComponent> = {
	title: "Terra-DS/Layout & Structure/Top",
	component: TopComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [RouterTestingModule],
		}),
	],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component: `
### \`lib-top\`

Barra superior alinhada ao Figma (**Top** · Variation=Desktop). Reúne o contexto da página, a identificação do usuário e as ações recorrentes.

- **Título** (\`title\`, Heading Bold 20) — não é \`h1\`: a página mantém o próprio \`h1\`.
- **Breadcrumb** (\`breadcrumbs: BreadcrumbItem[]\`) via \`lib-breadcrumbs\` (requer Router).
- **Usuário**: \`userRole\` (Caption 12), \`userName\` (Body Bold 16) e \`lib-avatar\` large (\`userAvatarSrc\` opcional), sobre o fundo em diagonal.
- **Ações** (\`actions: TopAction[]\`, até 4): \`lib-icon-button\` neutral/ghost com \`aria-label\` = \`label\`. Com \`badge\`, exibe o ponto de notificação e anuncia "<label>, novas".
- **Evento**: \`(actionClick)\` emite a \`TopAction\` clicada.
        `.trim(),
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
			<lib-top
				[title]="title"
				[breadcrumbs]="breadcrumbs"
				[userRole]="userRole"
				[userName]="userName"
				[userAvatarSrc]="userAvatarSrc"
				[actions]="actions"
				(actionClick)="actionClick($event)"
			></lib-top>
		`,
	}),
	argTypes: {
		breadcrumbs: { control: "object", description: "Trilha do breadcrumb." },
		actions: { control: "object", description: "Até 4 ações." },
	},
	args: {
		title: "Crédito Veicular",
		breadcrumbs: [{ label: "Mesa de análise" }],
		userRole: "Business Banker",
		userName: "Ana Beatriz Souza",
		userAvatarSrc: "",
		actions: acoesPadrao,
	},
};

export default meta;
type Story = StoryObj<TopComponent>;

export const Default: Story = {
	name: "Default",
};

export const SemAcoes: Story = {
	name: "Sem ações",
	args: { actions: [] },
};
