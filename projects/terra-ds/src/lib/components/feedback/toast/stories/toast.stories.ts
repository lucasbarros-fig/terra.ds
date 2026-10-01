import type { Meta, StoryObj } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../actions/button/button.component";
import { ToastComponent } from "../toast.component";

const toastDocsDescription =
  "Comunica mensagens rápidas e temporárias ao usuário, sem interromper o fluxo da navegação. É utilizado para indicar resultados de ações, como sucesso, erro, alerta ou informações relevantes, garantindo feedback imediato de forma leve e não intrusiva. Aplique Toast para manter o usuário informado em tempo real, reforçar ações realizadas e tornar a experiência mais fluida e eficiente.\n\n**Frases curtas, nunca quebrar texto em duas linhas.**";

const meta: Meta<ToastComponent> = {
	title: "Terra-DS/Feedback/Toast",
	component: ToastComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: toastDocsDescription,
			},
		},
	},
	render: (args) => ({
		moduleMetadata: { imports: [ToastComponent, ButtonComponent, CommonModule] },
		props: {
			...args,
			_visible: false,
		},
		template: `
      <lib-button intent="branding" label="Mostrar Toast" (clicked)="_visible = true"></lib-button>
      <lib-toast
        *ngIf="_visible"
        [state]="state"
        [label]="label"
        [stateLabel]="stateLabel"
        (closed)="_visible = false; closed()"
      ></lib-toast>
    `,
	}),
	args: {
		state: "success",
		label: "Operação realizada com sucesso.",
		stateLabel: "",
	},
	argTypes: {
		state: {
			control: "select",
			options: ["success", "error", "warning", "informative"],
			description:
				"Variante semântica que define a cor do badge e o rótulo padrão.",
			table: {
				type: { summary: "'success' | 'error' | 'warning' | 'informative'" },
				defaultValue: { summary: "'success'" },
			},
		},
		label: {
			control: "text",
			description: "Mensagem exibida no corpo do toast.",
			table: { type: { summary: "string" }, defaultValue: { summary: "''" } },
		},
		stateLabel: {
			control: "text",
			description:
				'Substitui o rótulo gerado pelo estado (ex: "Sucesso", "Erro"). Deixe vazio para usar o padrão.',
			table: { type: { summary: "string" }, defaultValue: { summary: "''" } },
		},
		closed: {
			action: "closed",
			description: "Evento emitido ao clicar no botão de fechar.",
			table: { type: { summary: "EventEmitter<void>" } },
		},
	},
};

export default meta;
type Story = StoryObj<ToastComponent>;

// ─── Individual states ─────────────────────────────────────────────────────

export const Default: Story = {};

export const Success: Story = {
	args: { state: "success", label: "Dados salvos com sucesso." },
	parameters: {
		docs: {
			description: {
				story:
					"Uso: confirmação de operação bem-sucedida (salvar, enviar, concluir).",
			},
		},
	},
};

export const ErrorToast: Story = {
	args: { state: "error", label: "Não foi possível processar a solicitação." },
	parameters: {
		docs: {
			description: {
				story: "Uso: falha em operação, erro de servidor ou dados inválidos.",
			},
		},
	},
};

export const Warning: Story = {
	args: {
		state: "warning",
		label: "Verifique as informações antes de continuar.",
	},
	parameters: {
		docs: {
			description: {
				story: "Uso: alertas que requerem atenção mas não bloqueiam o fluxo.",
			},
		},
	},
};

export const Informative: Story = {
	args: { state: "informative", label: "Uma nova versão está disponível." },
	parameters: {
		docs: {
			description: {
				story:
					"Uso: notificações neutras, atualizações de sistema, mensagens contextuais.",
			},
		},
	},
};

export const CustomStateLabel: Story = {
	name: "Rótulo personalizado",
	args: {
		state: "success",
		label: "Contrato assinado.",
		stateLabel: "Assinado",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use `stateLabel` para substituir o rótulo padrão gerado pelo estado.",
			},
		},
	},
};

// ─── Composite ─────────────────────────────────────────────────────────────

export const AllStates: Story = {
	name: "Todos os estados",
	render: () => ({
		moduleMetadata: { imports: [ToastComponent, ButtonComponent, CommonModule] },
		props: {
			_current: null as null | { state: string; label: string; intent: string },
			_items: [
				{
					state: "success",
					label: "Dados salvos com sucesso.",
					btn: "Sucesso",
					intent: "positive",
				},
				{
					state: "error",
					label: "Não foi possível processar a solicitação.",
					btn: "Erro",
					intent: "negative",
				},
				{
					state: "warning",
					label: "Verifique as informações antes de continuar.",
					btn: "Atenção",
					intent: "warning",
				},
				{
					state: "informative",
					label: "Uma nova versão está disponível.",
					btn: "Informativo",
					intent: "informative",
				},
			],
		},
		template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
        <lib-button
          *ngFor="let item of _items"
          [intent]="item.intent"
          [label]="item.btn"
          (clicked)="_current = item"
        ></lib-button>
      </div>
      <lib-toast
        *ngIf="_current"
        [state]="_current.state"
        [label]="_current.label"
        (closed)="_current = null"
      ></lib-toast>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					"Dispara cada variante do Toast via botão dedicado para comparação visual.",
			},
		},
	},
};
