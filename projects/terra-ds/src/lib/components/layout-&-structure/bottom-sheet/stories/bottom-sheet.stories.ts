import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../../../actions/button/button.component';
import { BottomSheetComponent } from '../bottom-sheet.component';
import type { BottomSheetAction } from '../bottom-sheet.types';

const bottomSheetDocsDescription =
  'Painel deslizante ancorado na base da tela, usado para exibir ações ou conteúdo contextual sem tirar o usuário do fluxo atual. Ideal para experiências mobile, apresenta o conteúdo de forma progressiva a partir da borda inferior, com backdrop opcional, arraste do handle para fechar (drag-to-close) e ações configuráveis via `actions`. Aplique o Bottom Sheet para confirmar ações, exibir detalhes ou coletar entradas rápidas mantendo o contexto da tela.\n\n**Priorize o uso em telas mobile.**';

@Component({
  selector: 'lib-story-bottom-sheet',
  standalone: true,
  imports: [BottomSheetComponent, ButtonComponent],
  template: `
    <div style="min-height: 480px; position: relative; background: var(--color-theme-upper); padding: 16px;">
      <lib-button
        label="Abrir Bottom Sheet"
        intent="branding"
        [showIcon]="false"
        (clicked)="open.set(true)"
      ></lib-button>

      <lib-bottom-sheet
        [open]="open()"
        [title]="title"
        [description]="description"
        [actions]="actions"
        [showBackdrop]="showBackdrop"
        [closeOnBackdropClick]="closeOnBackdropClick"
        [maxHeightPercent]="maxHeightPercent"
        ariaLabel="Exemplo de Bottom Sheet"
        (closed)="open.set(false)"
      >
        <div style="color: var(--color-theme-upper); font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px;color: var(--color-text-essential-body)">
          <p style="margin: 0 0 8px;">Conteúdo projetado via <code>ng-content</code>.</p>
          <p style="margin: 0;">Arraste o handle para baixo para fechar o painel.</p>
        </div>
      </lib-bottom-sheet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LibBottomSheetStoryHostComponent {
  @Input() title = 'Título do Bottom Sheet';
  @Input() description = '';
  @Input() actions: BottomSheetAction[] = [];
  @Input() showBackdrop = true;
  @Input() closeOnBackdropClick = true;
  @Input() maxHeightPercent?: number;

  readonly open = signal(false);
}

const meta: Meta<LibBottomSheetStoryHostComponent> = {
  title: 'Terra-DS/Layout & Structure/Bottom Sheet',
  component: LibBottomSheetStoryHostComponent,
  tags: ['autodocs'],
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        component: bottomSheetDocsDescription,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Texto do título exibido no header. O header aparece quando há título ou descrição.',
    },
    description: {
      control: 'text',
      description: 'Texto descritivo exibido abaixo do título. Exibido apenas quando preenchido.',
    },
    actions: {
      control: 'object',
      description:
        'Lista de ações do footer. Cada item aceita `label`, `icon`, `disabled`, `loading`, `intent`, `action` e `closeOnClick` opcional.',
    },
    showBackdrop: {
      control: 'boolean',
      description: 'Exibe o fundo escurecido (overlay) atrás do painel.',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Emite `closed` ao clicar no backdrop.',
    },
    maxHeightPercent: {
      control: { type: 'number', min: 1, max: 100, step: 5 },
      description:
        'Altura do painel em % da viewport (ex.: 75 → 75dvh). Omita para manter o padrão: altura pelo conteúdo, até 400px.',
    },
  },
};

export default meta;
type Story = StoryObj<LibBottomSheetStoryHostComponent>;

export const FullLayout: Story = {
  name: 'Layout Completo (Figma)',
  args: {
    title: 'Confirmar ação',
    description: 'Tem certeza que deseja prosseguir com esta operação?',
    actions: [{ label: 'Confirmar' }, { label: 'Cancelar' }],
    showBackdrop: true,
    closeOnBackdropClick: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Layout completo com header, descrição e ambas as ações. Ao clicar, o painel fecha com animação via `(closed)`.',
      },
    },
  },
};

export const CustomHeightPercent: Story = {
  name: 'Altura Personalizada',
  args: {
    title: 'Painel maior',
    description: 'Este bottom sheet ocupa até 75% da altura da tela.',
    actions: [{ label: 'Confirmar' }, { label: 'Cancelar' }],
    showBackdrop: true,
    maxHeightPercent: 75  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `maxHeightPercent` quando o painel precisar ocupar uma fração fixa da tela (ex.: 75 → 75% da viewport). Sem essa prop, a altura segue o conteúdo, limitada a 400px.',
      },
    },
  },
};

export const WithoutDescription: Story = {
  name: 'Sem Descrição',
  args: {
    title: 'Sem descrição',
    actions: [{ label: 'Confirmar' }, { label: 'Cancelar' }],
    showBackdrop: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sem `description`, o painel exibe apenas o título e as ações. A visibilidade da descrição é derivada da presença do texto.',
      },
    },
  },
};

export const WithoutActions: Story = {
  name: 'Sem Ações',
  args: {
    title: 'Somente conteúdo',
    description: 'Este bottom sheet não tem botões de ação.',
    actions: [],
    showBackdrop: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Com `actions` vazio, o footer não é renderizado e o painel foca no conteúdo projetado.',
      },
    },
  },
};

export const ThreeActions: Story = {
  name: 'Três Ações',
  args: {
    title: 'Salvar alterações',
    description: 'Escolha como deseja prosseguir.',
    actions: [
      { label: 'Confirmar' },
      { label: 'Salvar rascunho', intent: 'neutral' },
      { label: 'Cancelar' },
    ],
    showBackdrop: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'O footer suporta N ações via `actions`. O primeiro botão usa `branding` por padrão; os demais usam `neutral`, salvo override com `intent`.',
      },
    },
  },
};

export const WithDisabledAction: Story = {
  name: 'Ação Desabilitada',
  args: {
    title: 'Confirmar operação',
    description: 'A ação primária está desabilitada até que a condição seja atendida.',
    actions: [
      { label: 'Confirmar', disabled: true },
      { label: 'Cancelar' },
    ],
    showBackdrop: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Defina `disabled: true` em qualquer item de `actions` para impedir o clique.',
      },
    },
  },
};

export const WithLoadingAction: Story = {
  name: 'Ação em Loading',
  args: {
    title: 'Salvando alterações',
    description: 'A ação primária exibe o spinner enquanto a requisição é processada.',
    actions: [
      { label: 'Confirmar', loading: true },
      { label: 'Cancelar' },
    ],
    showBackdrop: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Defina `loading: true` em qualquer item de `actions` para exibir o spinner do botão. Enquanto carrega, o botão fica bloqueado: a `action` não é executada e o painel não fecha.',
      },
    },
  },
};

@Component({
  selector: 'lib-story-bottom-sheet-async',
  standalone: true,
  imports: [BottomSheetComponent, ButtonComponent],
  template: `
    <div style="min-height: 480px; position: relative; background: var(--color-theme-upper); padding: 16px;">
      <lib-button
        label="Abrir Bottom Sheet"
        intent="branding"
        [showIcon]="false"
        (clicked)="open.set(true)"
      ></lib-button>

      @if (statusMessage()) {
        <p
          style="
            margin: 12px 0 0;
            color: #fff;
            font-family: var(--font-family-primary, 'DM Sans', sans-serif);
            font-size: 14px;
          "
        >
          {{ statusMessage() }}
        </p>
      }

      <lib-bottom-sheet
        [open]="open()"
        title="Salvar alterações"
        description="Ao confirmar, simulamos uma requisição assíncrona antes de fechar."
        [actions]="actions()"
        showBackdrop
        closeOnBackdropClick
        ariaLabel="Exemplo de ação assíncrona"
        (closed)="open.set(false)"
      >
        <div style="color: var(--color-theme-upper); font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px;">
          <p style="margin: 0;">
            Use <code>closeOnClick: false</code> na action e feche com <code>open.set(false)</code> após concluir.
          </p>
        </div>
      </lib-bottom-sheet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LibBottomSheetAsyncStoryHostComponent {
  readonly open = signal(false);
  readonly isSaving = signal(false);
  readonly statusMessage = signal('');

  readonly actions = computed<BottomSheetAction[]>(() => [
    {
      label: 'Confirmar',
      loading: this.isSaving(),
      closeOnClick: false,
      action: () => this.save(),
    },
    { label: 'Cancelar', disabled: this.isSaving() },
  ]);

  private save(): void {
    this.isSaving.set(true);
    window.setTimeout(() => {
      this.isSaving.set(false);
      this.statusMessage.set('Alterações salvas com sucesso.');
      this.open.set(false);
    }, 1500);
  }
}

export const WithAsyncAction: StoryObj<LibBottomSheetAsyncStoryHostComponent> = {
  name: 'Ação Assíncrona',
  render: () => ({
    moduleMetadata: { imports: [LibBottomSheetAsyncStoryHostComponent] },
    template: '<lib-story-bottom-sheet-async />',
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Com `closeOnClick: false`, a action executa sem fechar o painel. Use `loading` durante a requisição — o botão exibe o spinner e bloqueia novos cliques — e chame `open.set(false)` ao finalizar.',
      },
    },
  },
};

@Component({
  selector: 'lib-story-bottom-sheet-validation',
  standalone: true,
  imports: [BottomSheetComponent, ButtonComponent],
  template: `
    <div style="min-height: 480px; position: relative; background: var(--color-theme-upper); padding: 16px;">
      <lib-button
        label="Abrir Bottom Sheet"
        intent="branding"
        [showIcon]="false"
        (clicked)="open.set(true)"
      ></lib-button>

      <lib-bottom-sheet
        [open]="open()"
        title="Aceitar termos"
        description="Marque a opção abaixo para habilitar a confirmação."
        [actions]="actions()"
        showBackdrop
        closeOnBackdropClick
        ariaLabel="Exemplo de validação"
        (closed)="open.set(false); accepted.set(false)"
      >
        <label
          style="
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--color-theme-upper);
            font-family: var(--font-family-primary, 'DM Sans', sans-serif);
            font-size: 14px;
            cursor: pointer;
          "
        >
          <input type="checkbox" [checked]="accepted()" (change)="accepted.set($any($event.target).checked)" />
          Li e aceito os termos
        </label>
      </lib-bottom-sheet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LibBottomSheetValidationStoryHostComponent {
  readonly open = signal(false);
  readonly accepted = signal(false);

  readonly actions = computed<BottomSheetAction[]>(() => [
    { label: 'Confirmar', disabled: !this.accepted() },
    { label: 'Cancelar' },
  ]);
}

export const WithDynamicDisabledAction: StoryObj<LibBottomSheetValidationStoryHostComponent> = {
  name: 'Ação Habilitada Dinamicamente',
  render: () => ({
    moduleMetadata: { imports: [LibBottomSheetValidationStoryHostComponent] },
    template: '<lib-story-bottom-sheet-validation />',
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Exemplo de `actions` reativo via `computed`: Confirmar usa `disabled: !accepted()` e só dispara a action quando habilitado.',
      },
    },
  },
};

@Component({
  selector: 'lib-story-bottom-sheet-with-actions',
  standalone: true,
  imports: [BottomSheetComponent, ButtonComponent],
  template: `
    <div style="min-height: 480px; position: relative; background: var(--color-theme-upper); padding: 16px;">
      <lib-button
        label="Abrir Bottom Sheet"
        intent="branding"
        [showIcon]="false"
        (clicked)="open.set(true)"
      ></lib-button>

      @if (lastAction()) {
        <p style="margin: 12px 0 0; color: #fff; font-family: var(--font-family-primary, 'DM Sans', sans-serif); font-size: 14px;">
          Última ação: {{ lastAction() }}
        </p>
      }

      <lib-bottom-sheet
        [open]="open()"
        title="Declarando actions"
        description="Cada botão declara sua lógica diretamente no array."
        [actions]="actions()"
        showBackdrop
        closeOnBackdropClick
        ariaLabel="Exemplo de actions declarativas"
        (closed)="open.set(false)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LibBottomSheetWithActionsStoryHostComponent {
  readonly open = signal(false);
  readonly lastAction = signal('');

  readonly actions = computed<BottomSheetAction[]>(() => [
    {
      label: 'Confirmar',
      action: () => this.lastAction.set('Confirmar'),
    },
    {
      label: 'Cancelar',
      action: () => this.lastAction.set('Cancelar'),
    },
  ]);
}

export const WithDeclarativeActions: StoryObj<LibBottomSheetWithActionsStoryHostComponent> = {
  name: 'Actions Declarativas',
  render: () => ({
    moduleMetadata: { imports: [LibBottomSheetWithActionsStoryHostComponent] },
    template: '<lib-story-bottom-sheet-with-actions />',
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Padrão recomendado: declare `action` diretamente em cada item de `actions`. O painel fecha com animação após a execução (padrão `closeOnClick`).',
      },
    },
  },
};
