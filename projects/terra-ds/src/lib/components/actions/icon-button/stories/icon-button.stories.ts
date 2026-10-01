import { CommonModule } from "@angular/common";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { solarisIconTypes } from "../../../layout-&-structure";
import {
	IconButtonComponent,
	type IconButtonNativeType,
	type IconButtonSize,
	type IconButtonType,
	type IconButtonVariant,
} from "../icon-button.component";

const TYPES: IconButtonType[] = ["branding", "neutral"];
const VARIANTS: IconButtonVariant[] = ["filled", "ghost", "bare"];
const SIZES: IconButtonSize[] = ["default", "small"];

type IconButtonStoryArgs = IconButtonComponent;

const iconButtonDocsDescription =
	"Permite acionar ações dentro da interface de forma clara e objetiva, sendo essencial para navegação, envio de dados e execução de tarefas. Pode variar em estilo, hierarquia e estado, indicando diferentes níveis de prioridade e interação. Aplique Button para conduzir o usuário, destacar ações importantes e garantir uma experiência mais intuitiva, eficiente e orientada a resultados.";

const meta: Meta<IconButtonStoryArgs> = {
	title: "Terra-DS/Actions/Icon Button",
	component: IconButtonComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [CommonModule, IconButtonComponent],
		}),
	],
	parameters: {
		layout: "centered",
		controls: { expanded: true },
		docs: {
			description: {
				component: iconButtonDocsDescription,
			},
		},
	},
	render: (args) => ({
		props: { ...args },
		template: `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 120px; padding: 24px;">
        <lib-icon-button
          [type]="type"
          [variant]="variant"
          [size]="size"
          [disabled]="disabled"
          [icon]="icon"
          [loading]="loading"
          [ariaLabel]="ariaLabel"
          [nativeType]="nativeType"
        ></lib-icon-button>
      </div>
    `,
	}),
	argTypes: {
		type: {
			control: "select",
			options: TYPES,
			table: { defaultValue: { summary: "'branding'" } },
		},
		variant: {
			control: "select",
			options: VARIANTS,
			table: { defaultValue: { summary: "'filled'" } },
		},
		size: {
			control: "select",
			options: SIZES,
			description:
				"Default: `var(--size-font-heading-20)` (20px). Small: `var(--size-font-body-16)` (16px).",
			table: { defaultValue: { summary: "'default'" } },
		},
		disabled: { control: "boolean" },
		icon: {
			control: "select",
			options: [...solarisIconTypes],
		},
		loading: {
			control: "boolean",
			description:
				"Quando `true`, substitui o ícone pelo `lib-spinner` e bloqueia a interação.",
			table: { defaultValue: { summary: "false" } },
		},
		ariaLabel: { control: "text" },
		nativeType: {
			control: "select",
			options: ["button", "submit", "reset"] satisfies IconButtonNativeType[],
		},
		clicked: { table: { disable: true } },
	} as Meta<IconButtonStoryArgs>["argTypes"],
	args: {
		type: "branding",
		variant: "filled",
		size: "default",
		disabled: false,
		icon: "DiamondsFour",
		loading: false,
		ariaLabel: "Ação",
		nativeType: "button",
	},
};

export default meta;
type Story = StoryObj<IconButtonStoryArgs>;

/** Entrada da página: um botão + Controls abaixo para variar props. */
export const Default: Story = {
	name: "Pré-visualização",
};

const sectionTitleStyle =
	"text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; font-weight: 700; margin: 0 0 12px; color: var(--color-text-essential-caption);";
const rowStyle = "display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end;";
const stackStyle = "display: flex; flex-direction: column; gap: 8px;";
const labelStyle =
	"font-size: 12px; color: var(--color-text-essential-body); margin: 0 0 4px; min-width: 72px;";
const subLabelStyle =
	"font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-text-essential-caption); margin: 0 0 8px;";
const typeHeadingStyle =
	"margin: 0 0 16px; font-size: 14px; font-weight: 700; color: var(--color-text-essential-heading); text-transform: capitalize;";

function variantRowEnabled(type: IconButtonType, size: IconButtonSize): string {
	return `
      <ng-container *ngFor="let v of variants">
        <div style="${stackStyle}">
          <span style="${labelStyle}">{{ v }}</span>
          <lib-icon-button
            type="${type}"
            [variant]="v"
            size="${size}"
            [disabled]="false"
            icon="DiamondsFour"
            [ariaLabel]="'${type} ' + v + ' ${size}'"
          ></lib-icon-button>
        </div>
      </ng-container>
    `;
}

export const BrandingDefaultVariantes: Story = {
	name: "Branding · default · variantes",
	parameters: { layout: "padded", controls: { disable: true } },
	render: () => ({
		props: { variants: VARIANTS },
		template: `
      <div style="max-width: 720px;">
        <p style="${sectionTitleStyle}">Branding · default · filled, ghost e bare</p>
        <div style="${rowStyle}">
          ${variantRowEnabled("branding", "default")}
        </div>
      </div>
    `,
	}),
};

export const NeutralDefaultVariantes: Story = {
	name: "Neutral · default · variantes",
	parameters: { layout: "padded", controls: { disable: true } },
	render: () => ({
		props: { variants: VARIANTS },
		template: `
      <div style="max-width: 720px;">
        <p style="${sectionTitleStyle}">Neutral · default · filled, ghost e bare</p>
        <div style="${rowStyle}">
          ${variantRowEnabled("neutral", "default")}
        </div>
      </div>
    `,
	}),
};

export const BrandingSmallVariantes: Story = {
	name: "Branding · small · variantes",
	parameters: { layout: "padded", controls: { disable: true } },
	render: () => ({
		props: { variants: VARIANTS },
		template: `
      <div style="max-width: 720px;">
        <p style="${sectionTitleStyle}">Branding · small · filled, ghost e bare</p>
        <div style="${rowStyle}">
          ${variantRowEnabled("branding", "small")}
        </div>
      </div>
    `,
	}),
};

export const NeutralSmallVariantes: Story = {
	name: "Neutral · small · variantes",
	parameters: { layout: "padded", controls: { disable: true } },
	render: () => ({
		props: { variants: VARIANTS },
		template: `
      <div style="max-width: 720px;">
        <p style="${sectionTitleStyle}">Neutral · small · filled, ghost e bare</p>
        <div style="${rowStyle}">
          ${variantRowEnabled("neutral", "small")}
        </div>
      </div>
    `,
	}),
};

export const Carregando: Story = {
	name: "Carregando",
	args: { loading: true },
	parameters: {
		docs: {
			description: {
				story:
					"Estado de carregamento: o `lib-spinner` substitui o ícone (não fica lado a lado) e bloqueia cliques.",
			},
		},
	},
};

/** Só disabled: filled / ghost / bare × default e small, por type. */
export const Desabilitado: Story = {
	name: "Desabilitado",
	parameters: { layout: "padded", controls: { disable: true } },
	render: () => ({
		props: { types: TYPES, sizes: SIZES, variants: VARIANTS },
		template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 960px;">
        <p style="${sectionTitleStyle}">Apenas disabled — filled, ghost e bare · tamanhos default e small</p>
        <div *ngFor="let t of types" style="display: flex; flex-direction: column; gap: 24px;">
          <p style="${typeHeadingStyle}">{{ t }}</p>
          <div *ngFor="let s of sizes" style="display: flex; flex-direction: column; gap: 10px;">
            <span style="${subLabelStyle}">Tamanho: {{ s }}</span>
            <div style="${rowStyle}">
              <ng-container *ngFor="let v of variants">
                <div style="${stackStyle}">
                  <span style="${labelStyle}">{{ v }}</span>
                  <lib-icon-button
                    [type]="t"
                    [variant]="v"
                    [size]="s"
                    [disabled]="true"
                    icon="DiamondsFour"
                    [ariaLabel]="t + ' ' + v + ' ' + s + ' desabilitado'"
                  ></lib-icon-button>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    `,
	}),
};
