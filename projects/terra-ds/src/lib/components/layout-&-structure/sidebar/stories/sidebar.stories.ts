import type { Meta, StoryObj } from "@storybook/angular";

import { SidebarComponent } from "../sidebar.component";
import type { SidebarItem } from "../sidebar.component";

const itensPadrao: SidebarItem[] = [
	{ id: "inicio", label: "Início", icon: "HouseLine" },
	{ id: "mesa", label: "Mesa de análise", icon: "kanban" },
	{ id: "propostas", label: "Propostas", icon: "files" },
	{ id: "clientes", label: "Clientes", icon: "users" },
	{ id: "instituicoes", label: "Instituições", icon: "bank" },
	{ id: "relatorios", label: "Relatórios", icon: "ChartBarHorizontal" },
	{ id: "configuracoes", label: "Configurações", icon: "gear" },
];

const meta: Meta<SidebarComponent> = {
	title: "Terra-DS/Layout & Structure/Sidebar",
	component: SidebarComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component: `
### \`lib-sidebar\`

Navegação principal persistente alinhada ao Figma (**Sidebar** · Desktop · Navigation=Default). Organiza o acesso às principais áreas do sistema.

- **Itens** (\`items: SidebarItem[]\`): \`{ id, label, icon, href?, disabled?, badge?, children? }\`. Com \`href\` o item vira link; sem, botão. \`badge\` mostra uma tag (ex.: "Em breve"); \`children\` exibe o indicador \`CaretRight\` (o 2º nível fica com quem consome).
- **Item ativo**: \`[(activeId)]\` — recebe \`aria-current="page"\` e o estado Selected (branding).
- **Recolher**: \`[(collapsed)]\` — 280px ↔ 84px (só ícones; rótulo em tooltip no hover/foco). O botão na borda tem \`aria-label\` "Recolher menu"/"Expandir menu" e \`aria-expanded\`.
- **Grupo**: \`groupLabel\` ("Visão Geral"), oculto quando recolhida.
- **Logo**: marca/símbolo The House por padrão; substitua projetando um elemento com o atributo \`sidebarLogo\`.
- **Evento**: \`(itemSelect)\` emite o \`SidebarItem\` clicado (itens desabilitados não emitem).
        `.trim(),
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
			<div style="display: flex; height: 100vh; min-height: 640px;">
				<lib-sidebar
					[items]="items"
					[groupLabel]="groupLabel"
					[showToggle]="showToggle"
					[(activeId)]="activeId"
					[(collapsed)]="collapsed"
					(itemSelect)="itemSelect($event)"
				></lib-sidebar>
			</div>
		`,
	}),
	argTypes: {
		items: { control: "object", description: "Itens de navegação." },
		activeId: { control: "text", description: "Id do item ativo." },
		collapsed: { control: "boolean", description: "Recolhida (84px, só ícones)." },
		groupLabel: { control: "text", description: "Rótulo do grupo." },
		showToggle: { control: "boolean", description: "Exibe o botão recolher/expandir." },
	},
	args: {
		items: itensPadrao,
		activeId: "mesa",
		collapsed: false,
		groupLabel: "Visão Geral",
		showToggle: true,
	},
};

export default meta;
type Story = StoryObj<SidebarComponent>;

export const Expandida: Story = {
	name: "Expandida",
};

export const Recolhida: Story = {
	name: "Recolhida",
	args: { collapsed: true },
};

export const ComItemDesabilitado: Story = {
	name: "Com item desabilitado",
	args: {
		items: [
			...itensPadrao.slice(0, 5),
			{ id: "relatorios", label: "Relatórios", icon: "ChartBarHorizontal", disabled: true, badge: "Em breve" },
			{ id: "configuracoes", label: "Configurações", icon: "gear", disabled: true },
		],
	},
};
