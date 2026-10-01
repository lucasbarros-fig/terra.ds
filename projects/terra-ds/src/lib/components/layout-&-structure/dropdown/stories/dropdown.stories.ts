import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { ButtonComponent } from "../../../actions/button/button.component";
import { ToggleButtonComponent } from "../../../inputs-&-controls/toggle-button/toggle-button.component";
import { IconComponent } from "../../icon/icon.component";
import {
	DropdownComponent,
	type TerraDropdownPlacement,
} from "../dropdown.component";
import { TERRA_DROPDOWN_IMPORTS } from "../index";

const PLACEMENTS: TerraDropdownPlacement[] = [
	"bottom-start",
	"bottom-center",
	"bottom-end",
	"top-start",
	"top-center",
	"top-end",
];

const dropdownDocsDescription =
	'Exibe uma lista de opções de forma contextual e temporária, permitindo ao usuário selecionar uma ou mais ações sem sair do fluxo atual. É acionado por um elemento de interface e apresenta escolhas relacionadas àquele contexto específico.';

const meta: Meta<DropdownComponent> = {
	title: "Terra-DS/Layout & Structure/Dropdown",
	component: DropdownComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [
				...TERRA_DROPDOWN_IMPORTS,
				IconComponent,
				ButtonComponent,
				ToggleButtonComponent,
			],
		}),
		(story) => ({
			...story(),
			template: `
        <div style="padding:150px 80px;min-height:180px;box-sizing:border-box;background:var(--color-theme-base);display:flex;align-items:flex-start;justify-content:center;">
          ${story().template}
        </div>
      `,
		}),
	],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component: dropdownDocsDescription,
			},
		},
	},
	argTypes: {
		placement: {
			control: "select",
			options: PLACEMENTS,
			description: "Posição preferida do painel em relação ao trigger.",
			table: {
				type: { summary: "TerraDropdownPlacement" },
				defaultValue: { summary: "'bottom-start'" },
			},
		},
		maxHeight: {
			control: "text",
			description: "Altura máxima do painel antes de ativar o scroll interno.",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "'280px'" },
			},
		},
		panelMinWidth: {
			control: "text",
			description: "Largura mínima do painel (CSS). Ignorado quando `matchTriggerWidth` é verdadeiro.",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "'191px'" },
			},
		},
		matchTriggerWidth: {
			control: "boolean",
			description: "Faz o painel ter no mínimo a largura do elemento trigger.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		closeOnItemClick: {
			control: "boolean",
			description: "Fecha o painel automaticamente ao selecionar um item.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "true" },
			},
		},
	},
	args: {
		placement: "bottom-start",
		maxHeight: "280px",
		panelMinWidth: "191px",
		closeOnItemClick: true,
	},
};

export default meta;
type Story = StoryObj<DropdownComponent>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: "Estado base com quatro itens, sendo um desabilitado. Use os controls para ajustar posicionamento e comportamento.",
			},
		},
	},
	render: (args) => ({
		props: {
			...args,
			onEditar: () => { /* tracked via Storybook actions */ },
		},
		template: `
      <lib-dropdown [placement]="placement" [maxHeight]="maxHeight"
                    [panelMinWidth]="panelMinWidth" [closeOnItemClick]="closeOnItemClick">
        <lib-button libDropdownTrigger type="button" [label]="'Abrir menu'" [intent]="'neutral'"></lib-button>
        <lib-dropdown-item label="Editar" (select)="onEditar()"></lib-dropdown-item>
        <lib-dropdown-item label="Duplicar"></lib-dropdown-item>
        <lib-dropdown-item label="Arquivar"></lib-dropdown-item>
        <lib-dropdown-item label="Indisponível" [disabled]="true"></lib-dropdown-item>
      </lib-dropdown>
    `,
	}),
};

export const ComGrupos: Story = {
	name: "Com cabeçalho de grupo",
	parameters: {
		docs: {
			description: {
				story: "Use `lib-dropdown-group-header` para separar itens em seções nomeadas dentro do painel.",
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
      <lib-dropdown [placement]="placement" [maxHeight]="maxHeight"
                    [panelMinWidth]="panelMinWidth" [closeOnItemClick]="closeOnItemClick">
        <lib-button libDropdownTrigger type="button" [label]="'Mais ações'" [intent]="'neutral'"></lib-button>
        <lib-dropdown-group-header label="Conta"></lib-dropdown-group-header>
        <lib-dropdown-item label="Definições"></lib-dropdown-item>
        <lib-dropdown-item label="Terminar sessão"></lib-dropdown-item>
      </lib-dropdown>
    `,
	}),
};

export const ComIcones: Story = {
	name: "Com ícones (16px)",
	parameters: {
		docs: {
			description: {
				story: "Passe `icon` (nome PascalCase do Solaris Icons) em cada `lib-dropdown-item` para exibir um ícone de 16px à esquerda do rótulo.",
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
      <lib-dropdown [placement]="placement" [maxHeight]="maxHeight"
                    [panelMinWidth]="panelMinWidth" [closeOnItemClick]="closeOnItemClick">
        <lib-button libDropdownTrigger type="button" [label]="'Exportar'" [intent]="'neutral'"></lib-button>
        <lib-dropdown-item label="PDF" icon="FilePdf"></lib-dropdown-item>
        <lib-dropdown-item label="CSV" icon="FileCsv"></lib-dropdown-item>
        <lib-dropdown-item label="Excel" icon="FileXls"></lib-dropdown-item>
      </lib-dropdown>
    `,
	}),
};

export const ReferenciaFigmaMenuConta: Story = {
	name: "Referência Figma Menu",
	args: { panelMinWidth: "191px", placement: "bottom-end", maxHeight: "360px" },
	parameters: {
		docs: {
			description: {
				story: "Réplica do dropdown de configurações",
			},
		},
	},
	render: (args) => ({
		props: {
			...args,
			temaEscuroChecked: true,
		},
		template: `
      <lib-dropdown [placement]="placement" [maxHeight]="maxHeight"
                    [panelMinWidth]="panelMinWidth" [closeOnItemClick]="closeOnItemClick">
        <lib-button libDropdownTrigger type="button" [label]="'Configurações'" [intent]="'neutral'" icon aria-haspopup="menu" aria-expanded="false">
        </lib-button>

        <lib-dropdown-group-header label="Sistema"></lib-dropdown-group-header>

        <div
          style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 4px 4px;padding:8px;border-radius:8px;box-sizing:border-box;width:100%;font:500 14px/21px 'DM Sans',sans-serif;color:var(--color-text-essential-heading);"
        >
          <lib-icon icon="Moon" [size]="16" color="inherit"></lib-icon>
          <lib-toggle-button
            [label]="'Escuro'"
            [checked]="temaEscuroChecked"
            (checkedChange)="temaEscuroChecked = $event"
          ></lib-toggle-button>
        </div>

        <lib-dropdown-group-header label="Configurações"></lib-dropdown-group-header>
        <lib-dropdown-item label="Conta e Segurança" icon="UserCircle"></lib-dropdown-item>

        <lib-dropdown-group-header label="Outros"></lib-dropdown-group-header>
        <lib-dropdown-item label="Plano" icon="Medal"></lib-dropdown-item>
        <lib-dropdown-item label="Personalizar Loja" icon="Storefront"></lib-dropdown-item>

        <lib-dropdown-group-header label="Outros"></lib-dropdown-group-header>
        <lib-dropdown-item label="Termos e Condições" icon="Notebook"></lib-dropdown-item>
        <lib-dropdown-item label="Central de ajuda" icon="Question"></lib-dropdown-item>
        <lib-dropdown-item label="Sair" icon="SignOut"></lib-dropdown-item>
      </lib-dropdown>
    `,
	}),
};

export const ListaLongaComScroll: Story = {
	name: "Lista longa (scroll)",
	args: { maxHeight: "180px" },
	parameters: {
		docs: {
			description: {
				story: "Quando o conteúdo ultrapassa `maxHeight`, o painel exibe scroll interno. Aqui o limite é reduzido para 180px para demonstrar o comportamento.",
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
      <lib-dropdown [placement]="placement" [maxHeight]="maxHeight"
                    [panelMinWidth]="panelMinWidth" [closeOnItemClick]="closeOnItemClick">
        <lib-button libDropdownTrigger type="button" [label]="'12 opções'" [intent]="'neutral'"></lib-button>
        <lib-dropdown-item label="Opção 1"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 2"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 3"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 4"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 5"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 6"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 7"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 8"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 9"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 10"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 11"></lib-dropdown-item>
        <lib-dropdown-item label="Opção 12"></lib-dropdown-item>
      </lib-dropdown>
    `,
	}),
};

export const Desabilitado: Story = {
	name: "Com itens desabilitados",
	parameters: {
		docs: {
			description: {
				story: "Itens com `[disabled]=\"true\"` ficam opacos, não recebem foco e são ignorados pela navegação via teclado.",
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
      <lib-dropdown [placement]="placement" [maxHeight]="maxHeight"
                    [panelMinWidth]="panelMinWidth" [closeOnItemClick]="closeOnItemClick">
        <lib-button libDropdownTrigger type="button" [label]="'Status'" [intent]="'neutral'"></lib-button>
        <lib-dropdown-item label="Ativo"></lib-dropdown-item>
        <lib-dropdown-item label="Pausado" [disabled]="true"></lib-dropdown-item>
        <lib-dropdown-item label="Arquivado"></lib-dropdown-item>
      </lib-dropdown>
    `,
	}),
};
