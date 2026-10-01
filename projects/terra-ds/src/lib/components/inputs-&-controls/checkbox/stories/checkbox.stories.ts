import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckboxComponent } from '../checkbox.component';

const checkboxDocsDescription =
  'Permite ao usuário selecionar uma ou múltiplas opções de forma independente, sendo ideal para listas, preferências ou configurações. Indica estados como selecionado, não selecionado e intermediário, oferecendo controle claro sobre as escolhas realizadas. Aplique Checkbox para facilitar seleções múltiplas, aumentar a clareza das interações e tornar a experiência mais objetiva e eficiente.\n\n**Não alterar espessura ou cor.**';

const meta: Meta<CheckboxComponent> = {
  title: 'Terra-DS/Inputs & Controls/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: checkboxDocsDescription,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(FormsModule)],
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <lib-checkbox
        [label]="label"
        [inputId]="inputId"
        [checked]="checked"
        [indeterminate]="indeterminate"
        [disabled]="disabled"
        (checkedChange)="checkedChange($event)"
        (indeterminateChange)="indeterminateChange($event)"
      ></lib-checkbox>
    `,
  }),
  args: {
    label: 'Checkbox Label',
    inputId: '',
    checked: false,
    indeterminate: false,
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'Opcional. Texto visível ao lado da caixa + `aria-label` no input. Omitir para não exibir rótulo.',
    },
    inputId: {
      control: 'text',
      description: 'Valor opcional do atributo `id` do `<input>` (senão é gerado automaticamente).',
    },
    checked: {
      control: 'boolean',
      description: '**Obrigatório.** Estado marcado do checkbox.',
      table: { type: { summary: 'boolean' } },
    },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Unchecked: Story = {
  name: 'No check',
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    indeterminate: false,
    disabled: false,
  },
};

export const Indeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
    disabled: false,
  },
};

export const DisabledUnchecked: Story = {
  name: 'Disabled · unchecked',
  args: {
    checked: false,
    indeterminate: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  name: 'Disabled · checked',
  args: {
    checked: true,
    indeterminate: false,
    disabled: true,
  },
};

export const DisabledIndeterminate: Story = {
  name: 'Disabled · indeterminate',
  args: {
    checked: false,
    indeterminate: true,
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  name: 'No label',
  parameters: {
    docs: {
      description: {
        story:
          'Com `label` omitido, só o quadradinho é exibido. O `aria-label` do input também deixa de ser preenchido pelo componente — em produção, avalie nome acessível conforme o caso.',
      },
    },
  },
  args: {
    label: undefined,
    checked: false,
  },
};

export const FocusHint: Story = {
  name: 'Focus (keyboard)',
  parameters: {
    docs: {
      description: {
        story:
          'Use **Tab** para focar o checkbox: o anel usa `--color-state-system-focus` e só aparece com `:focus-visible` no input (não ao clicar com o mouse).',
      },
    },
  },
  args: {
    label: 'Checkbox Label',
    disabled: false,
    checked: false,
  },
};

export const NgModel: Story = {
  name: 'With [(ngModel)]',
  parameters: {
    docs: {
      description: {
        story:
          '`[checked]` é obrigatório no componente; mantém-se sincronizado com o valor do modelo (`accepted`) para o compilador e para o estado inicial.',
      },
    },
  },
  render: () => ({
    moduleMetadata: {
      imports: [FormsModule, CheckboxComponent],
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <lib-checkbox
          [(ngModel)]="accepted"
          [checked]="accepted"
          label="Aceito os termos"
        ></lib-checkbox>
        <span style="font: 500 12px/1.4 DM Sans, sans-serif;color: var(--color-text-essential-caption);">
          Valor do modelo: {{ accepted }}
        </span>
      </div>
    `,
    props: {
      accepted: false,
    },
  }),
};

export const ReactiveForm: Story = {
  name: 'With formControlName',
  parameters: {
    docs: {
      description: {
        story:
          'Uso com **Reactive Forms**: o `lib-checkbox` é vinculado via `formControlName` dentro de um `FormGroup`. O `[checked]` continua sendo passado a partir do valor do controle (`form.value.accepted`) para satisfazer o `@Input({ required: true })` do componente. `disabled` é gerenciado pelo próprio `FormControl` (`disable()`/`enable()`), via `setDisabledState` do `ControlValueAccessor`.',
      },
    },
  },
  render: () => {
    const form = new FormGroup({
      accepted: new FormControl<boolean>(false, { nonNullable: true }),
    });

    return {
      moduleMetadata: {
        imports: [ReactiveFormsModule, CheckboxComponent],
      },
      template: `
        <form [formGroup]="form" style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
          <lib-checkbox
            formControlName="accepted"
            [checked]="!!form.value.accepted"
            label="Aceito os termos"
          ></lib-checkbox>

          <div style="display:flex;gap:8px;">
            <button
              type="button"
              (click)="form.controls.accepted.setValue(!form.value.accepted)"
              style="
                padding:6px 10px;
                border-radius:6px;
                border:1px solid var(--color-icons-essential-medium, hsl(217, 19%, 27%));
                background:transparent;
                color: var(--color-icons-essential-medium, hsl(217, 19%, 27%));
                cursor: pointer;
              "
            >
              Alternar valor
            </button>
            <button
              type="button"
              (click)="form.controls.accepted.disabled ? form.controls.accepted.enable() : form.controls.accepted.disable()"
              style="
                padding:6px 10px;
                border-radius:6px;
                border:1px solid var(--color-icons-essential-medium, hsl(217, 19%, 27%));
                background:transparent;
                color: var(--color-icons-essential-medium, hsl(217, 19%, 27%));
                cursor: pointer;
              "
            >
              Alternar disabled
            </button>
          </div>

          <span style="font: 500 12px/1.4 DM Sans, sans-serif;color: var(--color-text-essential-caption);">
            Valor do controle: {{ form.value.accepted }} ·
            disabled: {{ form.controls.accepted.disabled }}
          </span>
        </form>
      `,
      props: {
        form,
      },
    };
  },
};

export const AllVariations: Story = {
  name: 'All Variations',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Visão geral dos estados neutros e desabilitados, como na grade do arquivo do Figma.',
      },
    },
  },
  render: () => ({
    moduleMetadata: { imports: [CheckboxComponent] },
    template: `
      <div style="
        display:grid;
        grid-template-columns: auto 1fr 1fr;
        gap: 24px 48px;
        align-items:center;
        pointer-events: none;
      ">
        <span style="color: var(--color-text-essential-caption);"></span>
        <span style="font-weight:700;">Neutral</span>
        <span style="font-weight:700;">Disabled</span>

        <span style="color: var(--color-text-essential-caption);">No check</span>
        <lib-checkbox label="Checkbox Label" [checked]="false" [indeterminate]="false" [disabled]="false"></lib-checkbox>
        <lib-checkbox label="Checkbox Label" [checked]="false" [indeterminate]="false" [disabled]="true"></lib-checkbox>

        <span style="color: var(--color-text-essential-caption);">Checked</span>
        <lib-checkbox label="Checkbox Label" [checked]="true" [indeterminate]="false" [disabled]="false"></lib-checkbox>
        <lib-checkbox label="Checkbox Label" [checked]="true" [indeterminate]="false" [disabled]="true"></lib-checkbox>

        <span style="color: var(--color-text-essential-caption);">Indeterminate</span>
        <lib-checkbox label="Checkbox Label" [checked]="false" [indeterminate]="true" [disabled]="false"></lib-checkbox>
        <lib-checkbox label="Checkbox Label" [checked]="false" [indeterminate]="true" [disabled]="true"></lib-checkbox>
      </div>
    `,
  }),
};
