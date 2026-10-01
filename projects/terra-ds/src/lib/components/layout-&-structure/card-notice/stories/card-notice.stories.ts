import type { Meta, StoryObj } from "@storybook/angular";
import { action } from "storybook/actions";

import { CardNoticeComponent } from "../card-notice.component";

const meta: Meta<CardNoticeComponent> = {
	title: "Terra-DS/Layout & Structure/Card Notice",
	component: CardNoticeComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
### \`lib-card-notice\`

Card compacto alinhado ao Figma (**Card Notice**). Organiza informações essenciais dentro de fluxos de trabalho — propostas, tarefas ou pipelines.

- **Mídia** (195px): \`imageSrc\` / \`imageAlt\`, ou conteúdo projetado com o atributo \`cardNoticeMedia\`. Oculte com \`showMedia\`.
- **Conteúdo**: \`title\` (Body Bold 16) e \`description\` (Body Regular 14, oculte com \`showDescription\`).
- **Tag**: \`lib-tag\` (\`high\`, \`small\`) com \`tagLabel\`, \`tagIcon\` e \`tagColor\`. Oculte com \`showTag\`.
- **Publicação**: \`lib-avatar\` + \`authorName\` (+ \`authorImageSrc\`) e \`date\`. Oculte com \`showPublication\`.
- **Estados**: Hovering via \`:hover\`; Focus via \`:focus-visible\` (anel externo). Com \`interactive\`, o card é focável e emite \`(cardClick)\` em clique, Enter ou Espaço.
        `.trim(),
			},
		},
	},
	render: (args) => ({
		props: { ...args, cardClick: action("cardClick") },
		template: `
			<div style="width: 348px;">
				<lib-card-notice
					[title]="title"
					[description]="description"
					[showDescription]="showDescription"
					[imageSrc]="imageSrc"
					[showMedia]="showMedia"
					[showTag]="showTag"
					[tagLabel]="tagLabel"
					[tagIcon]="tagIcon"
					[tagColor]="tagColor"
					[showPublication]="showPublication"
					[authorName]="authorName"
					[authorImageSrc]="authorImageSrc"
					[date]="date"
					[interactive]="interactive"
					(cardClick)="cardClick($event)"
				></lib-card-notice>
			</div>
		`,
	}),
	argTypes: {
		tagColor: {
			control: "select",
			options: ["neutral", "blue", "purple", "cyan", "emerald", "pink", "orange", "red", "teal", "yellow", "green"],
		},
	},
	args: {
		title: "Title",
		description: "Description",
		showDescription: true,
		imageSrc: "",
		showMedia: true,
		showTag: true,
		tagLabel: "Tag Text",
		tagIcon: "Tag",
		tagColor: "neutral",
		showPublication: true,
		authorName: "Name",
		authorImageSrc: "",
		date: "00 de Jan. de 0000",
		interactive: true,
	},
};

export default meta;
type Story = StoryObj<CardNoticeComponent>;

export const Default: Story = {
	name: "Default",
};

export const Exemplo: Story = {
	name: "Exemplo — Proposta",
	args: {
		title: "Proposta #4821 — Crédito Veicular",
		description: "Aguardando análise documental do cliente",
		tagLabel: "Em análise",
		tagColor: "orange",
		authorName: "Ana Souza",
		date: "28 de Set. de 2026",
	},
};

export const SemMidia: Story = {
	name: "Sem Mídia",
	args: { showMedia: false },
};

export const Minimo: Story = {
	name: "Apenas Título",
	args: { showDescription: false, showTag: false, showPublication: false, showMedia: false },
};

export const Estados: Story = {
	name: "Estados (Default · Hovering · Focus)",
	render: (args) => ({
		props: args,
		template: `
			<p style="font: 12px sans-serif; color: var(--color-text-essential-caption); margin: 0 0 12px;">
				Passe o mouse para ver o Hovering; use Tab para ver o Focus.
			</p>
			<div style="display: flex; gap: 32px; padding: 12px;">
				<div style="width: 348px; flex-shrink: 0;"><lib-card-notice></lib-card-notice></div>
				<div style="width: 348px; flex-shrink: 0;"><lib-card-notice></lib-card-notice></div>
				<div style="width: 348px; flex-shrink: 0;"><lib-card-notice></lib-card-notice></div>
			</div>
		`,
	}),
	parameters: { layout: "padded" },
};
