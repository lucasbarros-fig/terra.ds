import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { AccordionComponent } from "../../accordion/accordion.component";
import { AccordionGroupComponent } from "../accordion-group.component";

const accordionGroupDocsDescription = `

Agrupa múltiplos \`lib-accordion\` com comportamento exclusivo: apenas um item permanece aberto por vez.
Ao abrir outro item, o anterior fecha automaticamente.

`.trim();

const meta: Meta<AccordionGroupComponent> = {
	title: "Terra-DS/Layout & Structure/Accordion Group",
	component: AccordionGroupComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [AccordionComponent, AccordionGroupComponent],
		}),
	],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: accordionGroupDocsDescription,
			},
		},
	},
	render: () => ({
		template: `
			<div style="width: 100%; max-width: 100%; box-sizing: border-box;">
				<lib-accordion-group>
					<lib-accordion label="Dados gerais" icon="IdentificationCard" [open]="true">
						<p style="margin: 0; font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px; color: var(--color-text-essential-body, #d2dadf);">
							Informações básicas do registro.
						</p>
					</lib-accordion>
					<lib-accordion label="Documentos" icon="Files">
						<p style="margin: 0; font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px; color: var(--color-text-essential-body, #d2dadf);">
							Lista de arquivos anexados.
						</p>
					</lib-accordion>
					<lib-accordion label="Histórico" icon="ClockCounterClockwise">
						<p style="margin: 0; font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px; color: var(--color-text-essential-body, #d2dadf);">
							Linha do tempo de alterações.
						</p>
					</lib-accordion>
					<lib-accordion label="Bloqueado" icon="LockKey" [disabled]="true">
						<p style="margin: 0;">Não deve abrir.</p>
					</lib-accordion>
				</lib-accordion-group>
			</div>
		`,
	}),
};

export default meta;
type Story = StoryObj<AccordionGroupComponent>;

export const Default: Story = {
	name: "Default",
};

export const WithStatus: Story = {
	name: "Com status",
	render: () => ({
		template: `
			<div style="width: 100%; max-width: 100%; box-sizing: border-box;">
				<lib-accordion-group>
					<lib-accordion
						label="Documento de identificação RG/CNH"
						icon="IdentificationCard"
						[showStatus]="true"
						statusColor="disabled"
						statusText="Não enviado"
						[disabled]="true"
					></lib-accordion>
					<lib-accordion
						label="Comprovante de estado civil"
						icon="HeartStraight"
						[showStatus]="true"
						statusColor="disabled"
						statusText="Não enviado"
						[disabled]="true"
					></lib-accordion>
					<lib-accordion
						label="Comprovante de endereço"
						icon="MapPinArea"
						[showStatus]="true"
						statusColor="warning"
						statusText="Pendente"
					>
						<p style="margin: 0; font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px; color: var(--color-text-essential-body, #d2dadf);">
							Anexe o comprovante para continuar.
						</p>
					</lib-accordion>
					<lib-accordion label="Outras opções" icon="CirclesFour">
						<p style="margin: 0; font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px; color: var(--color-text-essential-body, #d2dadf);">
							Demais documentos opcionais.
						</p>
					</lib-accordion>
				</lib-accordion-group>
			</div>
		`,
	}),
};
