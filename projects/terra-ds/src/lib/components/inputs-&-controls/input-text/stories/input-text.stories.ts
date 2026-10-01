import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import {
	type SolarisIconType,
	solarisIconTypes,
} from "../../../layout-&-structure/icon/utils/theme";
import { InputTextComponent } from "../input-text.component";

const ICON_HELP =
	"`SolarisIconType` (PascalCase) ou kebab-case (`triangle` → Triangle). Catálogo: `solaris-icon-types.generated.ts` / `npm run sync:icon-types`.";

const iconSelectOptions: ("" | SolarisIconType)[] = ["", ...solarisIconTypes];

const inputDocsDescription =
  "Permite a entrada e edição de dados pelo usuário, sendo essencial para formulários, buscas e configurações. Oferece suporte a diferentes estados, como foco, erro, sucesso e desabilitado, garantindo clareza e controle durante a interação. Aplique Input para capturar informações de forma estruturada, reduzir erros e tornar a experiência mais fluida e eficiente.";

const meta: Meta<InputTextComponent> = {
	/** Sem `&` no path: evita seletores do Docs/iframe malformados (NG05104). */
	title: "Terra-DS/Inputs & Controls/Input",
	component: InputTextComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: [InputTextComponent, ReactiveFormsModule],
		}),
	],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: inputDocsDescription,
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
        <lib-input-text
          [formControl]="field"
          [label]="label"
          [description]="description"
          [optional]="optional"
          [textTooltip]="textTooltip"
          [tooltipArrow]="tooltipArrow"
          [tooltipIndicator]="tooltipIndicator"
          [placeholder]="placeholder"
          [type]="type"
          [disabled]="disabled"
          [readonly]="readonly"
          [error]="error"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [iconBefore]="iconBefore"
          [iconAfter]="iconAfter"
          [mask]="mask"
          [dropSpecialCharacters]="dropSpecialCharacters"
          [prefix]="prefix"
          [suffix]="suffix"
          [clearable]="clearable"
          [variant]="variant"
        ></lib-input-text>
      </div>
    `,
  }),
  args: {
    label: "Nome",
    description: "",
    optional: false,
    textTooltip: "",
    tooltipArrow: "middle",
    tooltipIndicator: "right",
    placeholder: "Digite o nome",
    type: "text",
    disabled: false,
    readonly: false,
    error: false,
    helperText: "",
    helperColor: "neutral",
    iconBefore: "",
    iconAfter: "",
    mask: "",
    dropSpecialCharacters: false,
    clearable: false,
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
      options: [
        "start",
        "middle",
        "end",
      ],
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
      options: [
        "top",
        "bottom",
        "left",
        "right",
      ],
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
    type: {
      control: "select",
      options: [
        "text",
        "password",
        "email",
        "search",
        "tel",
        "url",
      ],
      description:
        "Tipo do `<input>`. Com `password`, o campo ganha botão para alternar entre texto visível e oculto.",
      table: {
        type: {
          summary: "InputTextType",
        },
        defaultValue: {
          summary: "'text'",
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
      options: [
        "neutral",
        "informative",
        "warning",
        "positive",
        "negative",
      ],
      description: "Cor semântica do helper (com `error`, vira `negative`).",
      table: {
        type: {
          summary: "'neutral' | 'informative' | 'warning' | 'positive' | 'negative'",
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
    mask: {
      control: "text",
      description: "Máscara opcional para o campo (vazio = sem máscara).",
      table: {
        type: {
          summary: "string",
        },
        defaultValue: {
          summary: "''",
        },
      },
    },
    dropSpecialCharacters: {
      control: "boolean",
      description:
        "Com `mask`, define o valor emitido ao FormControl. `false` (padrão): string formatada (`123.456.789-00`). `true`: só caracteres significativos (`12345678900`).",
      table: {
        type: {
          summary: "boolean",
        },
        defaultValue: {
          summary: "false",
        },
      },
    },
    clearable: {
      control: "boolean",
      description: "Exibe um ícone de limpar ao preencher o campo.",
      table: {
        type: {
          summary: "boolean",
        },
        defaultValue: {
          summary: "false",
        },
      },
    },
    variant: {
      control: "radio",
      options: [
        "underline",
        "outlined",
      ],
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
type Story = StoryObj<InputTextComponent>;

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
		label: "Telefone",
		optional: true,
		placeholder: "(00) 00000-0000",
		mask: "(00) 00000-0000",
	},
	parameters: {
		docs: {
			description: {
				story:
					'Indicador "(opcional)" no rótulo quando `optional` é verdadeiro.',
			},
		},
	},
};

export const ComHelper: Story = {
	args: {
		label: "Senha",
		placeholder: "••••••••",
		helperText: "Mínimo de 8 caracteres, com letras e números.",
		helperColor: "informative",
		type: "password",
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

export const SenhaComVisibilidade: Story = {
	name: "Senha (mostrar/ocultar)",
	args: {
		label: "Senha",
		type: "password",
		placeholder: "Digite a senha",
		helperText: "Use letras, números e símbolos.",
		helperColor: "neutral",
	},
	parameters: {
		docs: {
			description: {
				story:
					'Com `[type]="password"`, o campo usa máscara e exibe o botão (ícone) para alternar entre texto visível e oculto.',
			},
		},
	},
};

export const ErroComHelper: Story = {
	name: "Erro + helper",
	args: {
		label: "CPF",
		placeholder: "000.000.000-00",
		mask: "000.000.000-00",
		error: true,
		helperText: "CPF inválido. Verifique os dígitos.",
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
		label: "Código do convênio",
		textTooltip: "Código fornecido pelo parceiro no contrato.",
		placeholder: "000000",
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
		label: "Pesquisar",
		placeholder: "Digite para filtrar…",
		iconBefore: "MagnifyingGlass",
		iconAfter: "Wind",
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
				value: "Somente leitura do form",
				disabled: true,
			}),
		},
		template: `
      <div style="min-width: 320px;">
        <lib-input-text
          [formControl]="field"
          [label]="label"
          [description]="description"
          [optional]="optional"
          [textTooltip]="textTooltip"
          [tooltipArrow]="tooltipArrow"
          [tooltipIndicator]="tooltipIndicator"
          [placeholder]="placeholder"
          [type]="type"
          [disabled]="disabled"
          [readonly]="readonly"
          [error]="error"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [iconBefore]="iconBefore"
          [iconAfter]="iconAfter"
          [clearable]="clearable"
        ></lib-input-text>
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
		label: "ID interno",
		placeholder: "Somente leitura",
		readonly: true,
		helperText: "Gerado automaticamente pelo sistema.",
	},
	render: (args) => ({
		props: { ...args, field: new FormControl("USR-92817-A") },
		template: `
      <div style="min-width: 320px;">
        <lib-input-text
          [formControl]="field"
          [label]="label"
          [description]="description"
          [optional]="optional"
          [textTooltip]="textTooltip"
          [tooltipArrow]="tooltipArrow"
          [tooltipIndicator]="tooltipIndicator"
          [placeholder]="placeholder"
          [type]="type"
          [disabled]="disabled"
          [readonly]="readonly"
          [error]="error"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [iconBefore]="iconBefore"
          [iconAfter]="iconAfter"
          [clearable]="clearable"
        ></lib-input-text>
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
				nome: new FormControl(""),
				email: new FormControl(""),
			}),
		},
		template: `
      <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 20px; min-width: 320px;">
        <lib-input-text
          formControlName="nome"
          label="Nome completo"
          placeholder="Seu nome"
          helperText="Como consta no documento."
          helperColor="neutral"
          [clearable]="clearable"
        ></lib-input-text>
        <lib-input-text
          formControlName="email"
          label="E-mail"
          description="Opcional para recuperação de conta"
          placeholder="nome@empresa.com"
          helperText="Enviaremos um link de confirmação."
          helperColor="informative"
          [clearable]="clearable"
        ></lib-input-text>
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

export const ComMascara: Story = {
	args: {
		label: "CPF",
		placeholder: "000.000.000-00",
		mask: "000.000.000-00",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Máscara de entrada via `mask` (ngx-mask). Por padrão, `dropSpecialCharacters` é `false` e o FormControl recebe o valor formatado (ex.: `123.456.789-00`).",
			},
		},
	},
};

export const MascaraSomenteDigitos: Story = {
	name: "Máscara (somente dígitos no FormControl)",
	args: {
		label: "CPF",
		placeholder: "000.000.000-00",
		mask: "000.000.000-00",
		dropSpecialCharacters: true,
	},
	render: () => ({
		props: {
			field: new FormControl(""),
		},
		template: `
      <div style="min-width: 320px; display: flex; flex-direction: column; gap: 16px;">
        <lib-input-text
          [formControl]="field"
          label="CPF"
          placeholder="000.000.000-00"
          mask="000.000.000-00"
          [dropSpecialCharacters]="true"
        ></lib-input-text>
        <p style="font-size:12px; color: #888; margin:0">
          FormControl.value: <strong>{{ field.value }}</strong>
        </p>
      </div>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					"Com `[dropSpecialCharacters]=\"true\"`, o FormControl recebe apenas os caracteres significativos (ex.: `12345678900`), enquanto a exibição continua formatada.",
			},
		},
	},
};

export const ComClearable: Story = {
	args: {
		label: "CPF",
		placeholder: "000.000.000-00",
		mask: "000.000.000-00",
		clearable: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Com `clearable`, aparece ação para limpar o valor quando há texto e o campo não está desabilitado.",
			},
		},
	},
};

export const Moeda: Story = {
	name: "Moeda (currency)",
	render: () => ({
		props: {
			field: new FormControl(1234.56),
		},
		template: `
      <div style="min-width: 320px; display: flex; flex-direction: column; gap: 16px;">
        <lib-input-text
          [formControl]="field"
          label="Valor"
          type="currency"
          [clearable]="true"
        ></lib-input-text>
        <p style="font-size:12px; color: #888; margin:0">
          FormControl.value: <strong>{{ field.value }}</strong>
        </p>
      </div>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					"Máscara BRL financeira (caixa): digitar `1234` → `12,34`. Prefixo `R$` automático, milhar `.` e decimal `,`. O FormControl recebe o number (ex.: `12.34`).",
			},
		},
	},
};

export const ComSufixo: Story = {
	name: "Com sufixo",
	render: () => ({
		props: {
			field: new FormControl("84"),
		},
		template: `
      <div style="min-width: 320px; max-width: 100%;">
        <lib-input-text
          [formControl]="field"
          label="Prazo máximo"
          [optional]="true"
          suffix="meses"
          iconBefore="CalendarBlank"
          placeholder="0"
        ></lib-input-text>
      </div>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					"Use `[suffix]` para exibir unidade ou contexto fixo após o valor digitado (ex.: `meses`, `%`, `km`).",
			},
		},
	},
};

export const ComBordaCompleta: Story = {
	name: "Com borda completa (outlined)",
	args: {
		label: "Nome completo",
		placeholder: "Digite o nome",
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
