import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { type Meta, moduleMetadata, type StoryObj } from "@storybook/angular";
import type { BreadcrumbItem } from "../breadcrumbs.component";
import { BreadcrumbsComponent } from "../breadcrumbs.component";

const sampleTrail: BreadcrumbItem[] = [
	{ label: "Início", link: "/inicio" },
	{ label: "Contas", link: "/contas" },
	{ label: "Detalhe", link: "/contas/detalhe" },
];

const breadcrumbDocsDescription =
  'Exibe o caminho de navegação dentro da estrutura do sistema, permitindo ao usuário entender sua localização atual e retornar facilmente a níveis anteriores. Organiza a hierarquia de páginas de forma clara e progressiva, facilitando a orientação em fluxos mais complexos. Aplique Breadcrumb para melhorar a navegação, reduzir a sensação de perda de contexto e tornar a experiência mais intuitiva e eficiente.\n\n**Sempre refletir o título da tela.**';

const meta: Meta<BreadcrumbsComponent> = {
	title: "Terra-DS/Layout & Structure/Breadcrumb",
	component: BreadcrumbsComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [CommonModule, RouterTestingModule, BreadcrumbsComponent],
		}),
	],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: breadcrumbDocsDescription,
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
      <lib-breadcrumbs
        [breadcrumbItems]="breadcrumbItems"
        [mobile]="mobile"
      ></lib-breadcrumbs>
    `,
	}),
	args: {
		breadcrumbItems: sampleTrail,
		mobile: false,
	},
	argTypes: {
		breadcrumbItems: {
			control: "object",
			description: "Lista de passos da trilha.",
		},
		mobile: {
			control: "boolean",
			description:
				"Layout compacto: reticências + último item quando há mais de um passo.",
		},
	},
};

export default meta;
type Story = StoryObj<BreadcrumbsComponent>;

/** Trilha curta em desktop. */
export const Default: Story = {};

/** Último passo só como rótulo (página atual). */
export const CurrentPageWithoutLink: Story = {
	args: {
		breadcrumbItems: [...sampleTrail.slice(0, 2), { label: "Página atual" }],
	},
	parameters: {
		docs: {
			description: {
				story:
					"O último item sem `link` mantém o destaque de página atual e fica não clicável (`no-link`).",
			},
		},
	},
};

/** Mobile com até 3 itens — exibe a trilha completa. */
export const Mobile: Story = {
	args: {
		mobile: true,
		breadcrumbItems: sampleTrail,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Com `mobile` e até **3** itens, exibe a trilha completa (sem colapso).",
			},
		},
	},
};

/** Mobile com mais de 3 itens — colapsa o meio em `...`. */
export const MobileEllipsis: Story = {
	args: {
		mobile: true,
		breadcrumbItems: [
			{ label: "Nível 1", link: "/n1" },
			{ label: "Nível 2", link: "/n2" },
			{ label: "Nível 3", link: "/n3" },
			{ label: "Atual", link: "/n3/atual" },
		],
	},
	parameters: {
		docs: {
			description: {
				story:
					"Com `mobile` e mais de **3** itens, mantém o primeiro segmento, colapsa o meio em `...` e destaca o último (página atual).",
			},
		},
	},
};

/** Mais de quatro itens no desktop — reticências no meio. */
export const DesktopEllipsis: Story = {
	args: {
		mobile: false,
		breadcrumbItems: [
			{ label: "A", link: "/a" },
			{ label: "B", link: "/b" },
			{ label: "C", link: "/c" },
			{ label: "D", link: "/d" },
			{ label: "E", link: "/e" },
			{ label: "Atual", link: "/e/atual" },
		],
	},
	parameters: {
		docs: {
			description: {
				story:
					"Os quatro primeiros segmentos, `...` e o último item (com link ao último passo).",
			},
		},
	},
};
