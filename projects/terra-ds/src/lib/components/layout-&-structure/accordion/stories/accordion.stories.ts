import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { AccordionComponent } from "../accordion.component";

const accordionDocsDescription = `

Organiza conteúdos em seções expansíveis, permitindo exibir ou ocultar informações sob demanda. É ideal para reduzir
a complexidade visual, otimizar o espaço da interface e facilitar a navegação por conteúdos relacionados sem sobrecarregar
o usuário. Aplique Accordion para estruturar informações extensas, melhorar a escaneabilidade da página e oferecer uma experiência mais organizada e intuitiva.

Para comportamento exclusivo (apenas um aberto por vez), use \`lib-accordion-group\`.

Use \`showStatus\`, \`statusColor\` e \`statusText\` para exibir um Status à direita do título, antes da seta.
`.trim();

const contentParagraph = `
	<p style="margin: 0; font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px; line-height: 21px; color: var(--color-text-essential-body, #d2dadf);">
		Conteúdo expansível do accordion. Use ng-content para projetar qualquer layout.
	</p>
`;

const meta: Meta<AccordionComponent> = {
	title: "Terra-DS/Layout & Structure/Accordion",
	component: AccordionComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [AccordionComponent],
		}),
	],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: accordionDocsDescription,
			},
		},
	},
	argTypes: {
		label: { control: "text" },
		icon: { control: "text" },
		showIcon: { control: "boolean" },
		showStatus: { control: "boolean" },
		statusColor: {
			control: "select",
			options: [
				"positive",
				"negative",
				"informative",
				"warning",
				"neutral",
				"disabled",
			],
		},
		statusText: { control: "text" },
		open: { control: "boolean" },
		disabled: { control: "boolean" },
	},
	args: {
		label: "Title",
		icon: "DiamondsFour",
		showIcon: true,
		showStatus: false,
		statusColor: "disabled",
		statusText: "Não enviado",
		open: false,
		disabled: false,
	},
	render: (args) => ({
		props: { ...args },
		template: `
			<div style="width: 100%; max-width: 100%; box-sizing: border-box;">
				<lib-accordion
					[label]="label"
					[icon]="icon"
					[showIcon]="showIcon"
					[showStatus]="showStatus"
					[statusColor]="statusColor"
					[statusText]="statusText"
					[disabled]="disabled"
					[open]="open"
					(openChange)="open = $event"
				>
					${contentParagraph}
				</lib-accordion>
			</div>
		`,
	}),
};

export default meta;
type Story = StoryObj<AccordionComponent>;

export const Closed: Story = {
	name: "Close",
	args: {
		open: false,
	},
};

export const Open: Story = {
	name: "Open",
	args: {
		open: true,
	},
};

export const Disabled: Story = {
	name: "Disable",
	args: {
		open: false,
		disabled: true,
		icon: "LockKey",
	},
};

export const WithoutIcon: Story = {
	name: "Sem ícone",
	args: {
		showIcon: false,
		open: true,
	},
};

export const WithStatus: Story = {
	name: "Com status",
	args: {
		label: "Documento de identificação RG/CNH",
		icon: "IdentificationCard",
		showStatus: true,
		statusColor: "disabled",
		statusText: "Não enviado",
		open: false,
	},
};
