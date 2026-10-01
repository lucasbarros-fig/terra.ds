import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MesaDeAnaliseScreenComponent } from "./mesa-de-analise.screen";

const meta: Meta<MesaDeAnaliseScreenComponent> = {
	title: "Telas/Mesa de Análise",
	component: MesaDeAnaliseScreenComponent,
	decorators: [moduleMetadata({ imports: [RouterTestingModule] })],
	parameters: {
		layout: "fullscreen",
		controls: { disable: true },
		docs: {
			description: {
				component: `
Tela de referência **Mesa de Análise** (Crédito Veicular), montada só com componentes do Terra DS — espelha a v3 do Figma (1920×1080, **sem rolagem**).

- **Sidebar** e **Top** · **Alert** de SLA com a ação principal · 4 **KPI Cards** · **Pipeline** com **Card Kanban** · **Banner** (carrossel) e **Metas do mês** com **Goal Progress**.
- Os KPIs **Minha carteira** e **SLA em risco** funcionam como filtro do pipeline (clique ou Enter/Espaço).
- Dados fictícios.
        `.trim(),
			},
		},
	},
};

export default meta;
type Story = StoryObj<MesaDeAnaliseScreenComponent>;

export const Padrao: Story = {
	name: "Padrão",
};
