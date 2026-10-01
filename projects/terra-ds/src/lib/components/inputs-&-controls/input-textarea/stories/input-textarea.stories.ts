import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import {
	type SolarisIconType,
	solarisIconTypes,
} from "../../../layout-&-structure/icon/utils/theme";
import { InputTextareaComponent } from "../input-textarea.component";

const ICON_HELP =
	"`SolarisIconType` (PascalCase) ou kebab-case (`triangle` → Triangle). Catálogo: `solaris-icon-types.generated.ts` / `npm run sync:icon-types`.";

const iconSelectOptions: ("" | SolarisIconType)[] = ["", ...solarisIconTypes];

const meta: Meta<InputTextareaComponent> = {
	title: "Terra-DS/Inputs & Controls/Input textarea",
	component: InputTextareaComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [InputTextareaComponent, ReactiveFormsModule],
		}),
	],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
### \`lib-input-textarea\`
Campo de texto multilinha alinhado ao **Input text** do Terra DS (rótulo, helper, ícones, variantes e \`ControlValueAccessor\`).

- **Tooltip no rótulo**: preencha \`textTooltip\` (vazio = sem tooltip).
- **Valor**: integra com **\`FormControl\` / \`formControlName\`** via \`ControlValueAccessor\` (use \`ReactiveFormsModule\`).
- **\`disabled\`**: soma o estado do control (\`.disable()\`) com o input \`[disabled]\`.
- **\`error\`**: borda semântica de erro; se houver \`helperText\`, a cor do helper passa a \`negative\`.
- **\`iconBefore\` / \`iconAfter\`**: ícones opcionais dentro do campo (vazio = oculto).
- **\`variant\`**: \`underline\` ou \`outlined\` (igual ao input text).
- **Layout**: área do campo com **padding 16px** e **altura mínima** maior que o input de linha única, conforme o componente Text Area no Figma.
        `,
			},
		},
	},
	render: (args) => ({
		props: {
			...args,
			field: new FormControl(""),
		},
		template: `
      <div style="min-width: 320px; max-width: 100%;">
        <lib-input-textarea
          [formControl]="field"
          [label]="label"
          [description]="description"
          [optional]="optional"
          [textTooltip]="textTooltip"
          [tooltipArrow]="tooltipArrow"
          [tooltipIndicator]="tooltipIndicator"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [error]="error"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [iconBefore]="iconBefore"
          [iconAfter]="iconAfter"
          [variant]="variant"
        ></lib-input-textarea>
      </div>
    `,
	}),
	args: {
		label: "Observações",
		description: "",
		optional: false,
		textTooltip: "",
		tooltipArrow: "middle",
		tooltipIndicator: "right",
		placeholder: "Digite aqui…",
		disabled: false,
		readonly: false,
		error: false,
		helperText: "",
		helperColor: "neutral",
		iconBefore: "",
		iconAfter: "",
		variant: "underline",
	},
	argTypes: {
		label: {
			control: "text",
			description: "Texto do rótulo. Vazio = sem `lib-label`.",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: {
					summary: "''",
				},
			},
		},
		description: {
			control: "text",
			description: "Apoio abaixo do rótulo (`lib-label`).",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: {
					summary: "''",
				},
			},
		},
		optional: {
			control: "boolean",
			description: 'Exibe "(opcional)" no rótulo.',
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: {
					summary: "false",
				},
			},
		},
		textTooltip: {
			control: "text",
			description: "Conteúdo do tooltip no rótulo. Vazio = sem tooltip.",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: {
					summary: "''",
				},
			},
		},
		tooltipArrow: {
			control: "radio",
			options: ["start", "middle", "end"],
			description: "Posição da seta do tooltip em relação ao conteúdo.",
			table: {
				type: {
					summary: "'start' | 'middle' | 'end'",
				},
				defaultValue: {
					summary: "'start'",
				},
			},
		},
		tooltipIndicator: {
			control: "radio",
			options: ["top", "bottom", "left", "right"],
			description: "Lado em que o tooltip abre em relação ao ícone de ajuda.",
			table: {
				type: {
					summary: "'top' | 'bottom' | 'left' | 'right'",
				},
				defaultValue: {
					summary: "'right'",
				},
			},
		},
		placeholder: {
			control: "text",
			description: "Texto exibido quando o campo está vazio.",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: {
					summary: "''",
				},
			},
		},
		disabled: {
			control: "boolean",
			description: "Desativa o campo (além de `FormControl.disable()`).",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: {
					summary: "false",
				},
			},
		},
		readonly: {
			control: "boolean",
			description:
				"Campo não editável, mas ainda focável e enviado no formulário (diferente de `disabled`).",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: {
					summary: "false",
				},
			},
		},
		error: {
			control: "boolean",
			description: "Estado de erro visual + `aria-invalid`.",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: {
					summary: "false",
				},
			},
		},
		helperText: {
			control: "text",
			description: "Texto do `lib-helper` abaixo do campo.",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: {
					summary: "''",
				},
			},
		},
		helperColor: {
			control: "select",
			options: ["neutral", "informative", "warning", "positive", "negative"],
			description: "Cor semântica do helper (com `error`, vira `negative`).",
			table: {
				type: {
					summary:
						"'neutral' | 'informative' | 'warning' | 'positive' | 'negative'",
				},
				defaultValue: {
					summary: "'neutral'",
				},
			},
		},
		iconBefore: {
			name: "Ícone antes",
			control: "select",
			options: iconSelectOptions,
			description: `Ícone à esquerda do valor. ${ICON_HELP}`,
			table: {
				type: {
					summary: "IconNameType",
				},
				defaultValue: {
					summary: "''",
				},
			},
		},
		iconAfter: {
			name: "Ícone depois",
			control: "select",
			options: iconSelectOptions,
			description: `Ícone à direita do valor. ${ICON_HELP}`,
			table: {
				type: {
					summary: "IconNameType",
				},
				defaultValue: {
					summary: "''",
				},
			},
		},
		variant: {
			control: "radio",
			options: ["underline", "outlined"],
			description:
				"Estilo de borda: `underline` (apenas inferior) ou `outlined` (todas as bordas + radius).",
			table: {
				type: {
					summary: "'underline' | 'outlined'",
				},
				defaultValue: {
					summary: "'underline'",
				},
			},
		},
	},
};

export default meta;
type Story = StoryObj<InputTextareaComponent>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Estado base: `FormControl` vazio, rótulo e placeholder. Use os controls para explorar props.",
			},
		},
	},
};

export const Opcional: Story = {
	args: {
		label: "Comentário adicional",
		optional: true,
		placeholder: "Detalhes opcionais sobre o pedido…",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Indicador “(opcional)” no rótulo quando `optional` é verdadeiro.",
			},
		},
	},
};

export const ComHelper: Story = {
	args: {
		label: "Descrição do incidente",
		placeholder: "Descreva o que ocorreu…",
		helperText:
			"Seja objetivo: data, horário e ambiente ajudam no atendimento.",
		helperColor: "informative",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Mensagem abaixo do campo com cor semântica (`helperText` + `helperColor`).",
			},
		},
	},
};

export const ErroComHelper: Story = {
	name: "Erro + helper",
	args: {
		label: "Justificativa",
		placeholder: "Mínimo 50 caracteres…",
		error: true,
		helperText: "O texto é obrigatório e deve ter pelo menos 50 caracteres.",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Com `error`, o campo ganha borda de erro e o helper passa a usar tom `negative`.",
			},
		},
	},
};

export const ComTooltip: Story = {
	args: {
		label: "Notas internas",
		textTooltip: "Visível apenas para a equipe; não é enviado ao cliente.",
		placeholder: "Registre contexto para o próximo atendente…",
	},
	parameters: {
		docs: {
			description: {
				story: "Tooltip no rótulo quando `textTooltip` está preenchido.",
			},
		},
	},
};

export const ComIcones: Story = {
	name: "Com ícones antes e depois",
	args: {
		label: "Resumo",
		placeholder: "Escreva um resumo executivo…",
		iconBefore: "Article",
		iconAfter: "Sparkle",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use os controls **Ícone antes** / **Ícone depois** ou esta story como exemplo. Valor vazio no select = sem ícone.",
			},
		},
	},
};

export const Desabilitado: Story = {
	render: (args) => ({
		props: {
			...args,
			field: new FormControl({
				value: "Conteúdo fixo do formulário",
				disabled: true,
			}),
		},
		template: `
      <div style="min-width: 320px;">
        <lib-input-textarea
          [formControl]="field"
          [label]="label"
          [description]="description"
          [optional]="optional"
          [textTooltip]="textTooltip"
          [tooltipArrow]="tooltipArrow"
          [tooltipIndicator]="tooltipIndicator"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [error]="error"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [iconBefore]="iconBefore"
          [iconAfter]="iconAfter"
          [variant]="variant"
        ></lib-input-textarea>
      </div>
    `,
	}),
	args: {
		label: "Campo desativado",
		placeholder: "Não editável",
		iconBefore: "DiamondsFour",
	},
	parameters: {
		docs: {
			description: {
				story:
					"`FormControl` criado com `{ disabled: true }`. O estado desabilitado do formulário combina com o input `[disabled]`.",
			},
		},
	},
};

export const SomenteLeitura: Story = {
	name: "Somente leitura",
	args: {
		label: "Política (somente leitura)",
		placeholder: "Somente leitura",
		readonly: true,
		helperText: "Texto definido pelo compliance; não pode ser alterado aqui.",
	},
	render: (args) => ({
		props: {
			...args,
			field: new FormControl(
				"Os dados pessoais são tratados conforme a LGPD e a política interna de privacidade vigente.",
			),
		},
		template: `
      <div style="min-width: 320px;">
        <lib-input-textarea
          [formControl]="field"
          [label]="label"
          [description]="description"
          [optional]="optional"
          [textTooltip]="textTooltip"
          [tooltipArrow]="tooltipArrow"
          [tooltipIndicator]="tooltipIndicator"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [error]="error"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [iconBefore]="iconBefore"
          [iconAfter]="iconAfter"
          [variant]="variant"
        ></lib-input-textarea>
      </div>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					"`readonly` no template: valor visível e selecionável, sem edição (diferente de desabilitado).",
			},
		},
	},
};

export const FormGroupExemplo: Story = {
	name: "FormGroup (vários campos)",
	render: () => ({
		props: {
			form: new FormGroup({
				resumo: new FormControl(""),
				detalhes: new FormControl(""),
			}),
		},
		template: `
      <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 20px; min-width: 320px;">
        <lib-input-textarea
          formControlName="resumo"
          label="Resumo"
          placeholder="Uma linha ou poucas frases…"
          helperText="Aparece em listagens e notificações."
          helperColor="neutral"
        ></lib-input-textarea>
        <lib-input-textarea
          formControlName="detalhes"
          label="Detalhes"
          description="Opcional"
          placeholder="Contexto completo para a equipe…"
          helperText="Quanto mais contexto, melhor o handoff."
          helperColor="informative"
        ></lib-input-textarea>
      </form>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					"Exemplo mínimo com `[formGroup]` e `formControlName` — padrão recomendado em telas.",
			},
		},
	},
};

export const ComBordaCompleta: Story = {
	name: "Com borda completa (outlined)",
	args: {
		label: "Mensagem",
		placeholder: "Digite a mensagem…",
		variant: "outlined",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Variante visual `outlined`: borda em todo o perímetro e cantos arredondados.",
			},
		},
	},
};
