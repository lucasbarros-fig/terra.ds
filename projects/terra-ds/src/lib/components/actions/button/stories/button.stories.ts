import { CommonModule } from "@angular/common";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import {
	ICON_SIZES,
	solarisIconTypes,
} from "../../../layout-&-structure/icon/utils/theme";
import {
	ButtonComponent,
	type ButtonIntent,
	type ButtonVariant,
} from "../button.component";

const INTENTS: ButtonIntent[] = [
	"branding",
	"neutral",
	"positive",
	"warning",
	"negative",
	"informative",
];

const VARIANTS: ButtonVariant[] = ["filled", "ghost", "bare"];

type ButtonStoryArgs = ButtonComponent;

const buttonDocsDescription =
	"Permite acionar ações dentro da interface de forma clara e objetiva, sendo essencial para navegação, envio de dados e execução de tarefas. Pode variar em estilo, hierarquia e estado, indicando diferentes níveis de prioridade e interação. Aplique Button para conduzir o usuário, destacar ações importantes e garantir uma experiência mais intuitiva, eficiente e orientada a resultados.";

const meta: Meta<ButtonStoryArgs> = {
	title: "Terra-DS/Actions/Button",
	component: ButtonComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [CommonModule, ButtonComponent],
		}),
	],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: buttonDocsDescription,
			},
		},
	},
	render: (args) => ({
		props: { ...args },
		template: `
      <lib-button
        [intent]="intent"
        [variant]="variant"
        [label]="label"
        [showIcon]="showIcon"
        [icon]="icon"
        [iconSize]="iconSize"
        [selected]="selected"
        [highlight]="highlight"
        [highlightLabel]="highlightLabel"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [ariaLabel]="ariaLabel"
        [nativeType]="nativeType"
        [loading]="loading"
      ></lib-button>
    `,
	}),
	argTypes: {
		intent: {
			control: "select",
			options: INTENTS,
			description: "Paleta semântica.",
			table: { defaultValue: { summary: "'branding'" } },
		},
		variant: {
			control: "select",
			options: VARIANTS,
			description: "Estilo visual.",
			table: { defaultValue: { summary: "'filled'" } },
		},
		label: {
			control: "text",
			description: "Texto do botão.",
		},
		showIcon: { control: "boolean" },
		icon: {
			control: "select",
			options: [...solarisIconTypes],
		},
		iconSize: {
			control: "select",
			options: [...ICON_SIZES],
		},
		selected: { control: "boolean" },
		highlight: { control: "boolean" },
		highlightLabel: { control: "text" },
		disabled: { control: "boolean" },
		fullWidth: {
			control: "boolean",
			description:
				"Quando `true`, o botão ocupa 100% da largura do container pai.",
			table: { defaultValue: { summary: "false" } },
		},
		ariaLabel: { control: "text" },
		nativeType: {
			control: "select",
			options: ["button", "submit", "reset"],
		},
		loading: {
			control: "boolean",
			description:
				"Quando `true`, exibe o `lib-spinner` antes do ícone/label e bloqueia a interação, sem aplicar o visual de desabilitado.",
			table: { defaultValue: { summary: "false" } },
		},
		clicked: { table: { disable: true } },
	} as Meta<ButtonStoryArgs>["argTypes"],
	args: {
		intent: "branding",
		variant: "filled",
		label: "Button Text",
		showIcon: true,
		icon: "DiamondsFour",
		iconSize: 20,
		selected: false,
		highlight: false,
		highlightLabel: "Highlight",
		disabled: false,
		fullWidth: false,
		nativeType: "button",
		loading: false,
	},
};

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Default: Story = {
	name: "Padrão",
};

export const SemIcone: Story = {
	name: "Sem ícone",
	args: { showIcon: false, label: "Sem ícone" },
};

export const Selecionado: Story = {
	name: "Selecionado",
	args: { selected: true },
};

export const Destacado: Story = {
	name: "Highlight",
	args: { highlight: true, highlightLabel: "Highlight" },
};

export const Desabilitado: Story = {
	name: "Desabilitado",
	args: { disabled: true },
};

export const Carregando: Story = {
	name: "Loading",
	args: { loading: true },
	parameters: {
		docs: {
			description: {
				story:
					"Estado de carregamento: exibe o spinner antes do conteúdo do botão (ícone + label, quando presentes) e bloqueia cliques, mantendo a cor original do `intent`.",
			},
		},
	},
};

export const CarregandoComIcone: Story = {
	name: "Loading com ícone before",
	args: { loading: true, icon: "DiamondsFour", label: "Salvando" },
};

export const LarguraTotal: Story = {
	name: "Largura total (fullWidth)",
	parameters: { layout: "padded" },
	args: { fullWidth: true, label: "Botão de largura total" },
	render: (args) => ({
		props: { ...args },
		template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 320px; padding: 16px; border: 1px dashed var(--color-stroke-frame); border-radius: 8px;">
        <p style="margin: 0; font-size: 12px; color: var(--color-text-essential-caption);">
          Container de 320px — o botão preenche 100% da largura disponível.
        </p>
        <lib-button
          [intent]="intent"
          [variant]="variant"
          [label]="label"
          [showIcon]="showIcon"
          [icon]="icon"
          [iconSize]="iconSize"
          [selected]="selected"
          [highlight]="highlight"
          [highlightLabel]="highlightLabel"
          [disabled]="disabled"
          [fullWidth]="fullWidth"
          [ariaLabel]="ariaLabel"
          [nativeType]="nativeType"
        ></lib-button>
      </div>
    `,
	}),
};

export const GaleriaIntencoesEEstilos: Story = {
	name: "Galeria: intenções × estilos",
	parameters: { layout: "padded", controls: { disable: true } },
	render: () => ({
		props: { intents: INTENTS, variants: VARIANTS },
		template: `
      <div style="display: flex; flex-direction: column; gap: 28px; max-width: 1100px;">
        <div *ngFor="let i of intents">
          <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; margin: 0 0 10px; color: var(--color-text-essential-caption);">
            {{ i }}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
            <lib-button
              *ngFor="let v of variants"
              [intent]="i"
              [variant]="v"
              [label]="v"
							[icon]="'DiamondsFour'"
              [iconSize]="20"
            ></lib-button>
          </div>
        </div>
      </div>
    `,
	}),
};

export const GaleriaEstados: Story = {
	name: "Galeria: estados",
	parameters: { layout: "padded", controls: { disable: true } },
	render: () => ({
		props: { variants: VARIANTS },
		template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1000px;">
        <div *ngFor="let v of variants" style="display: flex; flex-direction: column; gap: 16px;">
          <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; margin: 0; color: var(--color-text-essential-caption);">
            branding · {{ v }}
          </p>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 11px; color: var(--color-text-essential-caption);">Ativos</span>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
              <lib-button intent="branding" [variant]="v" label="Default" [icon]="'DiamondsFour'"></lib-button>
          
              <lib-button intent="branding" [variant]="v" label="Highlight" [highlight]="true" [icon]="'DiamondsFour'"></lib-button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 11px; color: var(--color-text-essential-caption);">Desabilitados</span>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
              <lib-button intent="branding" [variant]="v" label="Default" [disabled]="true" [icon]="'DiamondsFour'"></lib-button>
             
              <lib-button intent="branding" [variant]="v" label="Highlight" [highlight]="true" [disabled]="true" [icon]="'DiamondsFour'"></lib-button>
            </div>
          </div>
        </div>
      </div>
    `,
	}),
};
