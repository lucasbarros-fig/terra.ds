import { FormControl, ReactiveFormsModule } from "@angular/forms";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { InputQuantityComponent } from "../input-quantity.component";

const meta: Meta<InputQuantityComponent> = {
  title: "Terra-DS/Inputs & Controls/Input quantity",
  component: InputQuantityComponent,
  tags: [
    "autodocs",
  ],
  decorators: [
    moduleMetadata({
      imports: [
        InputQuantityComponent,
        ReactiveFormsModule,
      ],
    }),
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### \`lib-input-quantity\`
Campo numérico com botões de **incrementar** e **decrementar** (\`lib-icon-button\`), alinhado ao padrão visual do \`lib-input-text\`.

- **Valor**: integra com **\`FormControl\` / \`formControlName\`** via \`ControlValueAccessor\` (emite \`number\`).
- **\`min\` / \`max\` / \`step\`**: limites e granularidade do incremento. \`max: null\` = sem limite superior.
- **\`variant\`**: \`underline\` (padrão, borda inferior) ou \`outlined\` (todas as bordas + radius).
- **\`error\`**: borda semântica de erro; helper passa a \`negative\`.
- **\`disabled\` / \`readonly\`**: estados padrão.
- **(valueChange)**: \`@Output\` adicional que emite o valor numérico quando muda.
				`,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      field: new FormControl<number>(0),
    },
    template: `
      <div style="min-width: 240px;">
        <lib-input-quantity
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
          [variant]="variant"
          [min]="min"
          [max]="max"
          [step]="step"
        ></lib-input-quantity>
      </div>
    `,
  }),
  args: {
    label: "Quantidade",
    description: "",
    optional: false,
    textTooltip: "",
    tooltipArrow: "middle",
    tooltipIndicator: "right",
    placeholder: "0",
    disabled: false,
    readonly: false,
    error: false,
    helperText: "",
    helperColor: "neutral",
    variant: "underline",
    min: 0,
    max: null,
    step: 1,
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
    placeholder: {
      control: "text",
      table: {
        type: {
          summary: "string",
        },
        defaultValue: {
          summary: "'0'",
        },
      },
    },
    disabled: {
      control: "boolean",
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
      table: {
        type: {
          summary: "'neutral' | 'informative' | 'warning' | 'positive' | 'negative'",
        },
        defaultValue: {
          summary: "'neutral'",
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
    min: {
      control: "number",
      description: "Valor mínimo permitido.",
      table: {
        type: {
          summary: "number",
        },
        defaultValue: {
          summary: "0",
        },
      },
    },
    max: {
      control: "number",
      description: "Valor máximo permitido. `null` = sem limite.",
      table: {
        type: {
          summary: "number | null",
        },
        defaultValue: {
          summary: "null",
        },
      },
    },
    step: {
      control: "number",
      description: "Granularidade do incremento/decremento.",
      table: {
        type: {
          summary: "number",
        },
        defaultValue: {
          summary: "1",
        },
      },
    },
    valueChange: {
      action: "valueChange",
    },
  },
};

export default meta;
type Story = StoryObj<InputQuantityComponent>;

export const Default: Story = {};

export const ComBordaCompleta: Story = {
  name: "Com borda completa (outlined)",
  args: {
    label: "Quantidade",
    variant: "outlined",
  },
};

export const ComLimites: Story = {
  name: "Com min/max",
  args: {
    label: "Itens no carrinho",
    min: 1,
    max: 10,
    helperText: "Entre 1 e 10 unidades.",
    helperColor: "informative",
  },
  render: (args) => ({
    props: {
      ...args,
      field: new FormControl<number>(1),
    },
    template: `
      <div style="min-width: 240px;">
        <lib-input-quantity
          [formControl]="field"
          [label]="label"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [min]="min"
          [max]="max"
          [step]="step"
          [variant]="variant"
        ></lib-input-quantity>
      </div>
    `,
  }),
};

export const ComStepCinco: Story = {
  name: "Step de 5",
  args: {
    label: "Convidados",
    min: 0,
    max: 100,
    step: 5,
    helperText: "Incrementa de 5 em 5.",
    helperColor: "neutral",
  },
};

export const ComErro: Story = {
  name: "Estado de erro",
  args: {
    label: "Quantidade",
    error: true,
    helperText: "Quantidade inválida.",
  },
};

export const Desabilitado: Story = {
  render: (args) => ({
    props: {
      ...args,
      field: new FormControl<{
        value: number;
        disabled: boolean;
      }>({
        value: 3,
        disabled: true,
      }),
    },
    template: `
      <div style="min-width: 240px;">
        <lib-input-quantity
          [formControl]="field"
          [label]="label"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [variant]="variant"
        ></lib-input-quantity>
      </div>
    `,
  }),
  args: {
    label: "Quantidade",
    helperText: "Control desabilitado via FormControl.",
    helperColor: "neutral",
  },
};
