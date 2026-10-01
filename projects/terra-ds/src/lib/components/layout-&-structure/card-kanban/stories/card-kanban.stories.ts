import type { Meta, StoryObj } from "@storybook/angular";

import { CardKanbanComponent } from "../card-kanban.component";

const meta: Meta<CardKanbanComponent> = {
	title: "Terra-DS/Layout & Structure/Card Kanban",
	component: CardKanbanComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
### \`lib-card-kanban\`

Card compacto alinhado ao Figma (**Card Kanban**). Mostra os dados essenciais de uma proposta dentro de uma coluna de fluxo (kanban).

- **Cabeçalho**: \`lib-tag\` PF (roxa, ícone User) ou PJ (laranja, ícone BuildingApartment) com nome acessível por extenso ("Pessoa física"/"Pessoa jurídica"), \`proposalId\` em destaque e botão "…" (\`lib-icon-button\`, 40×40, \`aria-label="Mais ações da proposta #ID"\`) que emite \`(menuClick)\` sem disparar \`(cardClick)\`.
- **Dados**: \`clientName\`, \`product\`, \`amount\` (string já formatada) e \`lib-status\` (\`statusLabel\` + \`statusColor\`) com ícone semântico \`statusIcon\` (padrão \`Flag\`; string vazia oculta).
- **Rodapé**: \`comments\` (oculto quando 0 com \`hideZeroComments\`) e \`time\`; \`timeLabel\` dá contexto acessível ao tempo (ex.: "há 4h 18 min na etapa").
- **Altura fluida**: textos longos recebem ellipsis e \`title\`.
- **Estados**: Hovering via \`:hover\`; Focus via \`:focus-visible\` (anel externo). Com \`interactive\`, o card tem \`role="button"\`, é focável e emite \`(cardClick)\` em clique, Enter ou Espaço.
        `.trim(),
			},
		},
	},
	render: (args) => ({
		props: args,
		template: `
			<div style="width: 258px;">
				<lib-card-kanban
					[type]="type"
					[proposalId]="proposalId"
					[clientName]="clientName"
					[product]="product"
					[amount]="amount"
					[statusLabel]="statusLabel"
					[statusColor]="statusColor"
					[statusIcon]="statusIcon"
					[comments]="comments"
					[hideZeroComments]="hideZeroComments"
					[time]="time"
					[timeLabel]="timeLabel"
					[interactive]="interactive"
					(cardClick)="cardClick($event)"
					(menuClick)="menuClick($event)"
				></lib-card-kanban>
			</div>
		`,
	}),
	argTypes: {
		type: { control: "inline-radio", options: ["PF", "PJ"] },
		statusColor: {
			control: "select",
			options: ["positive", "negative", "informative", "warning", "neutral", "disabled"],
		},
		cardClick: { action: "cardClick" },
		menuClick: { action: "menuClick" },
	},
	args: {
		type: "PF",
		proposalId: "#000000",
		clientName: "Name",
		product: "Product",
		amount: "R$ 000.000,00",
		statusLabel: "Status",
		statusColor: "positive",
		statusIcon: "Flag",
		comments: 0,
		hideZeroComments: true,
		time: "00 min",
		timeLabel: "",
		interactive: true,
	},
};

export default meta;
type Story = StoryObj<CardKanbanComponent>;

export const PF: Story = {
	name: "PF",
	args: { type: "PF", hideZeroComments: false },
};

export const PJ: Story = {
	name: "PJ",
	args: { type: "PJ", hideZeroComments: false },
};

export const SlaEmRisco: Story = {
	name: "SLA em risco",
	args: {
		type: "PF",
		proposalId: "#48207",
		clientName: "Fernanda Prado Costa",
		product: "Refinanciamento · Onix 2020",
		amount: "R$ 41.200,00",
		statusLabel: "SLA em risco",
		statusColor: "negative",
		comments: 3,
		time: "4h 18 min",
		timeLabel: "há 4h 18 min na etapa",
	},
};

export const Coluna: Story = {
	name: "Coluna",
	parameters: { layout: "padded" },
	render: (args) => ({
		props: args,
		template: `
			<div style="display: flex; flex-direction: column; gap: 12px; width: 258px; padding: 12px;">
				<lib-card-kanban
					type="PF"
					proposalId="#48207"
					clientName="Fernanda Prado Costa"
					product="Refinanciamento · Onix 2020"
					amount="R$ 41.200,00"
					statusLabel="SLA em risco"
					statusColor="negative"
					[comments]="3"
					time="4h 18 min"
					timeLabel="há 4h 18 min na etapa"
					(cardClick)="cardClick($event)"
					(menuClick)="menuClick($event)"
				></lib-card-kanban>
				<lib-card-kanban
					type="PF"
					proposalId="#48202"
					clientName="Rafael Andrade Souza"
					product="Financiamento · T-Cross 2023"
					amount="R$ 124.900,00"
					statusLabel="Pendente CNH"
					statusColor="warning"
					[comments]="2"
					time="2h 05 min"
					timeLabel="há 2h 05 min na etapa"
					(cardClick)="cardClick($event)"
					(menuClick)="menuClick($event)"
				></lib-card-kanban>
			</div>
		`,
	}),
};
