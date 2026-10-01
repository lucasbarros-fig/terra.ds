import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../../../actions/button/button.component';
import { StatusComponent } from '../../../feedback/status/status.component';
import { type SolarisIconType, solarisIconTypes } from '../../../layout-&-structure';
import { SelectOptionComponent } from '../select-option/select-option.component';
import { SelectComponent, type SelectOption } from '../select.component';

const SAMPLE_OPTIONS: SelectOption[] = [
  { label: 'Pix', value: 'pix' },
  { label: 'Cartão de crédito', value: 'credit_card' },
  { label: 'Cartão de débito', value: 'debit_card' },
  { label: 'Boleto bancário', value: 'boleto' },
  { label: 'Transferência (TED/DOC)', value: 'ted_doc', disabled: true },
];

const BANK_OPTIONS: SelectOption[] = [
  { label: 'Itaú Unibanco', value: 'itau' },
  { label: 'Bradesco', value: 'bradesco' },
  { label: 'Banco do Brasil', value: 'bb' },
  { label: 'Caixa Econômica Federal', value: 'cef' },
  { label: 'Santander', value: 'santander' },
  { label: 'Nubank', value: 'nubank' },
];

const ICON_HELP =
  '`SolarisIconType` (PascalCase) ou kebab-case (`triangle` → Triangle). Catálogo: `solaris-icon-types.generated.ts` / `npm run sync:icon-types`';

const iconSelectOptions: ('' | SolarisIconType)[] = ['', ...solarisIconTypes];

const meta: Meta<SelectComponent> = {
  title: 'Terra-DS/Inputs & Controls/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        SelectComponent,
        SelectOptionComponent,
        ReactiveFormsModule,
        ButtonComponent,
        StatusComponent,
        JsonPipe,
      ],
    }),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### \`lib-select\`
Campo de seleção alinhado ao componente Input Text do Terra DS.

- **Dropdown**: usa \`lib-dropdown\` internamente com lista de opções via \`[options]\` ou \`<lib-select-option>\`.
- **Valor**: integra com **\`FormControl\` / \`formControlName\`** via \`ControlValueAccessor\`.
- **Placeholder**: exibido enquanto nenhum item está selecionado.
- **\`disabled\`**: soma o estado do control (\`.disable()\`) com o input \`[disabled]\`.
- **\`error\`**: borda semântica de erro; se houver \`helperText\`, a cor do helper passa a \`negative\`.
- **\`options\`**: array de \`{ label, value, disabled? }\` (API legada, mantida).
- **\`<lib-select-option>\`**: API declarativa para conteúdo customizado via \`ng-content\`.
- **\`multiple\`**: habilita seleção múltipla com checkbox por item e emissão de array.
- **\`searchable\`**: o trigger vira um input de texto; digitar filtra as opções pelo \`label\` e o clique continua abrindo o dropdown.
- **\`noResultsText\`**: mensagem exibida (e anunciada a leitores de tela) quando a busca não encontra opções (padrão: \`Nenhum item encontrado\`).
- **\`variant\`**: estilo de borda: \`underline\` (apenas inferior) ou \`outlined\` (todas as bordas + radius).
- **\`iconBefore\`**: ícone à esquerda do valor.
        `,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      field: new FormControl(null),
    },
    template: `
      <div style="min-width: 320px; max-width: 100%;">
        <lib-select
          [formControl]="field"
          [label]="label"
          [description]="description"
          [optional]="optional"
          [textTooltip]="textTooltip"
          [tooltipArrow]="tooltipArrow"
          [tooltipIndicator]="tooltipIndicator"
          [placeholder]="placeholder"
          [options]="options"
          [disabled]="disabled"
          [error]="error"
          [helperText]="helperText"
          [helperColor]="helperColor"
          [variant]="variant"
          [iconBefore]="iconBefore"
          [multiple]="multiple"
          [searchable]="searchable"
          [noResultsText]="noResultsText"
          [selectAriaLabel]="selectAriaLabel"
        ></lib-select>
      </div>
    `,
  }),
  args: {
    label: 'Forma de pagamento',
    description: '',
    optional: false,
    textTooltip: '',
    tooltipArrow: 'middle',
    tooltipIndicator: 'right',
    placeholder: 'Selecione uma opção',
    options: SAMPLE_OPTIONS,
    disabled: false,
    error: false,
    helperText: '',
    helperColor: 'neutral',
    variant: 'underline',
    iconBefore: 'DiamondsFour',
    multiple: false,
    searchable: false,
    noResultsText: 'Nenhum item encontrado',
    selectAriaLabel: '',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Texto do rótulo. Vazio = sem `lib-label`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
    description: {
      control: 'text',
      description: 'Apoio abaixo do rótulo (`lib-label`).',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
    optional: {
      control: 'boolean',
      description: 'Exibe "(opcional)" no rótulo.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    textTooltip: {
      control: 'text',
      description: 'Conteúdo do tooltip no rótulo. Vazio = sem tooltip.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
    tooltipArrow: {
      control: 'radio',
      options: ['start', 'middle', 'end'],
      description: 'Posição da seta do tooltip em relação ao conteúdo.',
      table: {
        type: { summary: "'start' | 'middle' | 'end'" },
        defaultValue: { summary: "'middle'" },
      },
    },
    tooltipIndicator: {
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Lado em que o tooltip abre em relação ao ícone de ajuda.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: "'right'" },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Texto exibido quando nenhuma opção está selecionada.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
    options: {
      control: 'object',
      description: 'Lista de opções: `{ label: string, value: unknown, disabled?: boolean }[]`.',
      table: {
        type: { summary: 'SelectOption[]' },
        defaultValue: { summary: '[]' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Desativa o campo (além de `FormControl.disable()`).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'boolean',
      description: 'Estado de erro visual + `aria-invalid`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    helperText: {
      control: 'text',
      description: 'Texto do `lib-helper` abaixo do campo.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
    helperColor: {
      control: 'select',
      options: ['neutral', 'informative', 'warning', 'positive', 'negative'],
      description: 'Cor semântica do helper (com `error`, vira `negative`).',
      table: {
        type: {
          summary: "'neutral' | 'informative' | 'warning' | 'positive' | 'negative'",
        },
        defaultValue: { summary: "'neutral'" },
      },
    },
    variant: {
      control: 'radio',
      options: ['underline', 'outlined'],
      description:
        'Estilo de borda: `underline` (apenas inferior) ou `outlined` (todas as bordas + radius).',
      table: {
        type: { summary: "'underline' | 'outlined'" },
        defaultValue: { summary: "'underline'" },
      },
    },
    iconBefore: {
      name: 'Ícone antes',
      control: 'select',
      options: iconSelectOptions,
      description: `Ícone à esquerda do valor. ${ICON_HELP}`,
      table: {
        type: { summary: 'IconNameType' },
        defaultValue: { summary: "''" },
      },
    },
    multiple: {
      control: 'boolean',
      description:
        'Habilita seleção múltipla: exibe checkbox por item, mantém o dropdown aberto ao selecionar e o valor do `ControlValueAccessor` passa a ser um array. Com 2+ itens, o campo mostra "N selecionados".',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    searchable: {
      control: 'boolean',
      description:
        'Transforma o trigger em um input de texto. Digitar filtra as opções pelo `label` (case-insensitive); o clique continua abrindo o dropdown.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    noResultsText: {
      control: 'text',
      description:
        'Mensagem exibida no painel quando a busca não encontra opções. Também é anunciada a leitores de tela via `LiveAnnouncer`.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Nenhum item encontrado'" },
      },
    },
    selectAriaLabel: {
      control: 'text',
      description: '`aria-label` do gatilho quando não há `label` visível. Fallback: `label`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
    selectionChange: {
      action: 'selectionChange',
      description:
        'Emite o valor selecionado (single) ou o array de valores (multiple) a cada alteração.',
      table: { type: { summary: 'EventEmitter<unknown>' } },
    },
  },
};

export default meta;
type Story = StoryObj<SelectComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Estado base: `FormControl` vazio, rótulo e placeholder. Use os controls para explorar props.',
      },
    },
  },
};

export const Opcional: Story = {
  args: {
    label: 'Banco',
    optional: true,
    placeholder: 'Selecione o banco',
    options: BANK_OPTIONS,
  },
  parameters: {
    docs: {
      description: {
        story: 'Indicador "(opcional)" no rótulo quando `optional` é verdadeiro.',
      },
    },
  },
};

export const ErroComHelper: Story = {
  name: 'Erro + helper',
  args: {
    label: 'Forma de pagamento',
    placeholder: 'Selecione uma opção',
    error: true,
    helperText: 'Selecione uma forma de pagamento para continuar.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Com `error`, o campo ganha borda de erro e o helper passa a usar tom `negative`.',
      },
    },
  },
};

export const ComHelper: Story = {
  args: {
    label: 'Banco',
    placeholder: 'Selecione o banco',
    options: BANK_OPTIONS,
    helperText: 'Informe o banco da conta que receberá o valor.',
    helperColor: 'informative',
  },
  parameters: {
    docs: {
      description: {
        story: 'Mensagem abaixo do campo com cor semântica (`helperText` + `helperColor`).',
      },
    },
  },
};

export const ComTooltip: Story = {
  args: {
    label: 'Tipo de conta',
    textTooltip: 'Selecione o tipo de conta bancária cadastrada.',
    placeholder: 'Selecione o tipo',
    options: [
      { label: 'Conta corrente', value: 'checking' },
      { label: 'Conta poupança', value: 'savings' },
      { label: 'Conta salário', value: 'salary' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Tooltip no rótulo quando `textTooltip` está preenchido.',
      },
    },
  },
};

export const Desabilitado: Story = {
  render: (args) => ({
    props: {
      ...args,
      field: new FormControl({ value: 'pix', disabled: true }),
      options: SAMPLE_OPTIONS,
    },
    template: `
      <div style="min-width: 320px;">
        <lib-select
          [formControl]="field"
          label="Forma de pagamento"
          placeholder="Selecione uma opção"
          [options]="options"
        ></lib-select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`FormControl` criado com `{ disabled: true }`. O campo desabilitado exibe cadeado e não pode ser interagido.',
      },
    },
  },
};

export const ComIcone: Story = {
  name: 'Com ícone à esquerda',
  args: {
    label: 'Banco',
    placeholder: 'Selecione o banco',
    options: BANK_OPTIONS,
    iconBefore: 'Bank',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `iconBefore` para exibir um ícone na frente do campo, no mesmo padrão visual do `lib-input-text`.',
      },
    },
  },
};

export const ComBordaCompleta: Story = {
  name: 'Com borda completa (outlined)',
  args: {
    label: 'Forma de pagamento',
    placeholder: 'Selecione uma opção',
    variant: 'outlined',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante visual `outlined`: borda em todo o perímetro e cantos arredondados.',
      },
    },
  },
};

export const OpcaoCustomizadaComStatus: Story = {
  name: 'Opção customizada com lib-status',
  render: () => {
    const STATUS_OPTIONS = [
      { value: 'approved', status: 'positive' as const, text: 'Aprovado' },
      { value: 'pending', status: 'warning' as const, text: 'Pendente' },
      { value: 'rejected', status: 'negative' as const, text: 'Reprovado' },
      { value: 'inactive', status: 'disabled' as const, text: 'Inativo' },
    ];

    return {
      props: {
        field: new FormControl(null),
        statusOptions: STATUS_OPTIONS,
      },
      template: `
        <div style="min-width: 280px;">
          <lib-select
            [formControl]="field"
            label="Status da proposta"
            placeholder="Selecione o status"
          >
            @for (opt of statusOptions; track opt.value) {
              <lib-select-option [value]="opt.value" [label]="opt.text">
                <lib-status [status]="opt.status" size="small" [text]="opt.text"></lib-status>
              </lib-select-option>
            }
          </lib-select>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstra a API declarativa \`<lib-select-option>\` com projeção de conteúdo.
Cada opção renderiza um \`<lib-status>\` como label, mantendo o valor e o label textual
para type-ahead e acessibilidade via \`[label]="opt.text"\`.
        `,
      },
    },
  },
};

export const MultiSelect: Story = {
  name: 'Seleção múltipla',
  render: () => {
    const form = new FormGroup({
      categorias: new FormControl<string[]>([]),
    });

    return {
      props: {
        form,
        tagOptions: [
          { label: 'Crédito', value: 'credit' },
          { label: 'Consórcio', value: 'consortium' },
          { label: 'Financiamento', value: 'financing' },
          { label: 'Investimentos', value: 'investments' },
          { label: 'Seguros', value: 'insurance' },
        ],
      },
      template: `
        <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 20px; width: 320px;">
          <lib-select
            style="width: 320px;"
            formControlName="categorias"
            label="Categorias"
            placeholder="Selecione as categorias"
            [options]="tagOptions"
            [multiple]="true"
          ></lib-select>

          <pre style="margin: 0; padding: 12px; background: var(--color-theme-upper);
            color: var(--color-text-essential-heading); border-radius: 6px; font-size: 12px;">
            {{ form.value | json }}
          </pre>
        </form>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story: `
Modo \`[multiple]="true"\`: cada item exibe um checkbox à esquerda.
O dropdown permanece aberto após cada seleção.
O \`ControlValueAccessor\` emite um array com os valores selecionados.
Quando 1 item está selecionado, o trigger exibe o label. Com 2+, exibe "N selecionados".
        `,
      },
    },
  },
};

export const MultiSelectCustomizado: Story = {
  name: 'Seleção múltipla + customizável (status)',
  render: () => {
    const form = new FormGroup({
      status: new FormControl<string[]>([]),
    });

    const STATUS_OPTIONS = [
      { value: 'approved', status: 'positive' as const, text: 'Aprovado' },
      { value: 'pending', status: 'warning' as const, text: 'Pendente' },
      { value: 'analyzing', status: 'informative' as const, text: 'Em análise' },
      { value: 'rejected', status: 'negative' as const, text: 'Reprovado' },
      { value: 'inactive', status: 'disabled' as const, text: 'Inativo' },
    ];

    return {
      props: {
        form,
        statusOptions: STATUS_OPTIONS,
      },
      template: `
        <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 20px; width: 320px;">
          <lib-select
            style="width: 320px;"
            formControlName="status"
            label="Status da proposta"
            placeholder="Selecione os status"
            [multiple]="true"
            iconBefore="Spinner"
          >
            @for (opt of statusOptions; track opt.value) {
              <lib-select-option [value]="opt.value" [label]="opt.text">
                <lib-status [status]="opt.status" size="large" [text]="opt.text"></lib-status>
              </lib-select-option>
            }
          </lib-select>

          <pre style="margin: 0; padding: 12px; background: var(--color-theme-upper);
            color: var(--color-text-essential-heading); border-radius: 6px; font-size: 12px;">
            {{ form.value | json }}
          </pre>
        </form>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story: `
Combina \`[multiple]="true"\` com a API declarativa \`<lib-select-option>\`.
Cada opção projeta um \`<lib-status>\` como conteúdo, enquanto \`[label]="opt.text"\`
mantém o texto para o type-ahead e a acessibilidade. Cada item exibe um checkbox à
esquerda, o dropdown permanece aberto entre seleções e o \`FormControl\` recebe o
array de valores escolhidos.
        `,
      },
    },
  },
};

export const Searchable: Story = {
  name: 'Com busca',
  args: {
    label: 'Banco',
    placeholder: 'Selecione o banco',
    options: BANK_OPTIONS,
    searchable: true,
    iconBefore: 'Bank',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Com `[searchable]="true"`, o próprio campo vira um input de texto. Clicar abre o dropdown; digitar filtra as opções pelo `label`. Ao fechar, o campo volta a mostrar o valor selecionado.',
      },
    },
  },
};

export const SearchableMultiple: Story = {
  name: 'Busca + seleção múltipla',
  render: () => {
    const form = new FormGroup({
      bancos: new FormControl<string[]>([]),
    });

    return {
      props: {
        form,
        bankOptions: BANK_OPTIONS,
      },
      template: `
        <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 20px; width: 320px;">
          <lib-select
            style="width: 320px;"
            formControlName="bancos"
            label="Bancos"
            placeholder="Selecione os bancos"
            [options]="bankOptions"
            [multiple]="true"
            [searchable]="true"
            iconBefore="Bank"
          ></lib-select>

          <pre style="margin: 0; padding: 12px; background: var(--color-theme-upper);
            color: var(--color-text-essential-heading); border-radius: 6px; font-size: 12px;">
            {{ form.value | json }}
          </pre>
        </form>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'Combina `[searchable]` com `[multiple]`: o campo continua um input, o filtro permanece enquanto o painel fica aberto entre seleções.',
      },
    },
  },
};

export const SearchableEmpty: Story = {
  name: 'Busca sem resultado',
  args: {
    label: 'Banco',
    placeholder: 'Selecione o banco',
    options: BANK_OPTIONS,
    searchable: true,
    iconBefore: 'Bank',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Digite no campo um termo que não exista. O painel exibe a mensagem de `noResultsText` (fora da lista de opções) e a anuncia a leitores de tela.',
      },
    },
  },
};

export const FormGroupExemplo: Story = {
  args: {
    multiple: true,
  },

  name: 'FormGroup (vários campos)',

  render: () => {
    const form = new FormGroup({
      banco: new FormControl(null),
      pagamento: new FormControl(null),
    });

    return {
      props: {
        form,
        bankOptions: BANK_OPTIONS,
        paymentOptions: SAMPLE_OPTIONS,
        resetForm: () => form.patchValue({ banco: null, pagamento: null }, { emitEvent: false }),
      },
      template: `
        <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 20px; min-width: 320px;">
          <lib-select
            formControlName="banco"
            label="Banco"
            placeholder="Selecione o banco"
            [options]="bankOptions"
            helperText="Banco onde a conta está cadastrada."
            helperColor="neutral"
          ></lib-select>
          <lib-select
            formControlName="pagamento"
            label="Forma de pagamento"
            placeholder="Selecione uma opção"
            [options]="paymentOptions"
          ></lib-select>

          <lib-button
            label="Resetar formulário"
            intent="neutral"
            variant="filled"
            (clicked)="resetForm()"
          ></lib-button>

          <pre style="margin: 0; padding: 12px; background: var(--color-theme-upper);
            color: var(--color-text-essential-heading); border-radius: 6px; font-size: 12px;">
            {{ form.value | json }}
          </pre>
        </form>
      `,
    };
  },

  parameters: {
    docs: {
      description: {
        story:
          'Exemplo com `[formGroup]` e `formControlName`. O botão **Resetar formulário** chama `form.patchValue({ … null }, { emitEvent: false })` e ambos os selects voltam ao placeholder.',
      },
    },
  },
};
