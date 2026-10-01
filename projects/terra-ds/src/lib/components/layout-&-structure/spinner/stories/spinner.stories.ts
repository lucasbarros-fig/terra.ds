import type { Meta, StoryObj } from "@storybook/angular";
import { ICON_SIZES } from "../../icon/utils/theme";
import { SpinnerComponent } from "../spinner.component";

const spinnerDocsDescription =
	"Indica que uma ação ou carregamento está em andamento, fornecendo um feedback visual imediato enquanto o sistema processa uma solicitação. Deve ser utilizado em operações de curta duração para comunicar que o usuário deve aguardar a conclusão da tarefa, reduzindo a sensação de inatividade da interface.";

const meta: Meta<SpinnerComponent> = {
	title: "Terra-DS/Layout & Structure/Spinner",
	component: SpinnerComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: spinnerDocsDescription,
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `<lib-spinner [size]="size" [ariaLabel]="ariaLabel"></lib-spinner>`,
	}),
	argTypes: {
		size: {
			control: "select",
			options: [...ICON_SIZES],
			description: "Diâmetro do spinner, em pixels.",
			table: { defaultValue: { summary: "20" } },
		},
		ariaLabel: {
			control: "text",
			description:
				"Quando informado, o spinner é anunciado por leitores de tela (`role=\"status\"`). Sem valor, ele é tratado como decorativo.",
		},
	} as Meta<SpinnerComponent>["argTypes"],
	args: {
		size: 20,
	},
};

export default meta;
type Story = StoryObj<SpinnerComponent>;

export const Default: Story = {
	name: "Padrão",
};

export const ComRotuloAcessivel: Story = {
	name: "Com rótulo acessível",
	args: { ariaLabel: "Carregando" },
};

export const Tamanhos: Story = {
	name: "Galeria: tamanhos",
	parameters: { controls: { disable: true } },
	render: () => ({
		props: { sizes: [...ICON_SIZES] },
		moduleMetadata: { imports: [SpinnerComponent] },
		template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        @for (s of sizes; track s) {
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <lib-spinner [size]="s"></lib-spinner>
            <span style="font-size: 11px; color: var(--color-text-essential-caption);">{{ s }}px</span>
          </div>
        }
      </div>
    `,
	}),
};
