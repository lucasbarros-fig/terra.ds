import { Meta, StoryObj } from '@storybook/angular';

import { IndicatorScrollComponent } from '../indicator-scroll.component';

const docsDescription =
  'Sinaliza a existência de conteúdo horizontal rolável, orientando o usuário de forma intuitiva sobre a possibilidade de deslizar ou rolar áreas com conteúdo que excede a área visível.\n\n' +
  '**O componente é presentacional:** o estado (`state`) e o posicionamento são responsabilidade do consumidor.\n\n' +
  '- **Mobile** (`type="mobile"`): ícone HandTap + texto "Deslize"\n' +
  '- **Desktop** (`type="desktop"`): ícone MouseScroll + texto "Role"\n' +
  '- **Estado `end`**: oculta o indicador (`opacity: 0; pointer-events: none`), preservando o espaço no layout.\n' +
  '- **`nudge`** (default `true`): aplica um bounce sutil (`translateY`, 4x) para chamar atenção pro indicador. Some automaticamente com `prefers-reduced-motion: reduce`, ou pode ser desligado via `nudge=false`.';

const meta: Meta<IndicatorScrollComponent> = {
  title: 'Terra-DS/Layout & Structure/Indicator Scroll',
  component: IndicatorScrollComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: docsDescription,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-indicator-scroll
        [type]="type"
        [state]="state"
        [nudge]="nudge"
      ></lib-indicator-scroll>
    `,
  }),
  args: {
    type: 'mobile',
    state: 'start',
    nudge: true,
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['mobile', 'desktop'],
      description:
        '`mobile` exibe o ícone HandTap + "Deslize"; `desktop` exibe o ícone MouseScroll + "Role".',
      table: {
        type: { summary: "'mobile' | 'desktop'" },
        defaultValue: { summary: "'mobile'" },
      },
    },
    state: {
      control: 'select',
      options: ['start', 'continuation-1', 'continuation-2', 'continuation-3', 'end'],
      description:
        'Estado atual do scroll. `end` oculta o indicador (`opacity: 0; pointer-events: none`). Os estados `continuation-*` são visualmente idênticos ao `start` — a diferença é semântica, para uso futuro (ex: gradiente de opacidade).',
      table: {
        type: {
          summary: "'start' | 'continuation-1' | 'continuation-2' | 'continuation-3' | 'end'",
        },
        defaultValue: { summary: "'start'" },
      },
    },
    nudge: {
      control: 'boolean',
      description:
        'Aplica um bounce sutil (4x) para chamar atenção pro indicador. Desliga automaticamente com `prefers-reduced-motion: reduce` ou quando `state="end"`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<IndicatorScrollComponent>;

/** Variante padrão: mobile com estado inicial. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Configuração padrão: `type="mobile"` com `state="start"`. O indicador é visível e exibe o ícone HandTap + "Deslize".',
      },
    },
  },
};

/** Variante desktop: ícone MouseScroll + texto "Role". */
export const Desktop: Story = {
  args: {
    type: 'desktop',
    state: 'start',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`type="desktop"` exibe o ícone MouseScroll e o texto "Role", indicando ao usuário que pode usar o scroll do mouse ou teclado.',
      },
    },
  },
};

/** Sem o bounce de nudge — indicador estático. */
export const SemNudge: Story = {
  args: {
    type: 'mobile',
    state: 'start',
    nudge: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`nudge=false` remove o bounce de chamada de atenção, deixando o indicador estático. Útil quando o consumidor já tem outro reforço visual de que há conteúdo rolável.',
      },
    },
  },
};

/** Todos os estados disponíveis, lado a lado. */
export const TodosOsEstados: Story = {
  render: () => ({
    moduleMetadata: { imports: [IndicatorScrollComponent] },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-size: 12px; min-width: 120px; opacity: 0.6;">start</span>
          <lib-indicator-scroll type="mobile" state="start"></lib-indicator-scroll>
          <lib-indicator-scroll type="desktop" state="start"></lib-indicator-scroll>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-size: 12px; min-width: 120px; opacity: 0.6;">continuation-1</span>
          <lib-indicator-scroll type="mobile" state="continuation-1"></lib-indicator-scroll>
          <lib-indicator-scroll type="desktop" state="continuation-1"></lib-indicator-scroll>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-size: 12px; min-width: 120px; opacity: 0.6;">continuation-2</span>
          <lib-indicator-scroll type="mobile" state="continuation-2"></lib-indicator-scroll>
          <lib-indicator-scroll type="desktop" state="continuation-2"></lib-indicator-scroll>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-size: 12px; min-width: 120px; opacity: 0.6;">continuation-3</span>
          <lib-indicator-scroll type="mobile" state="continuation-3"></lib-indicator-scroll>
          <lib-indicator-scroll type="desktop" state="continuation-3"></lib-indicator-scroll>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-size: 12px; min-width: 120px; opacity: 0.6;">end (oculto)</span>
          <lib-indicator-scroll type="mobile" state="end"></lib-indicator-scroll>
          <lib-indicator-scroll type="desktop" state="end"></lib-indicator-scroll>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Todos os estados (`start`, `continuation-1`, `continuation-2`, `continuation-3`, `end`) para ambas as variantes. No estado `end` o componente fica com `opacity: 0`, preservando o espaço no layout sem causar reflow.',
      },
    },
  },
};

/** Demonstração sobre uma área com rolagem horizontal. */
export const AreaComScrollHorizontal: Story = {
  render: () => ({
    moduleMetadata: { imports: [IndicatorScrollComponent] },
    template: `
      <div style="position: relative; width: 340px; display: inline-block;">
        <div
          style="
            overflow-x: auto;
            border: 1px solid var(--color-stroke-frame, #2e353a);
            border-radius: 8px;
            padding: 16px;
          "
        >
          <div style="display: flex; gap: 12px; width: max-content;">
            @for (item of items; track item) {
              <div style="
                width: 120px;
                height: 80px;
                border-radius: 6px;
                background: var(--color-theme-upper, #2d2d2d);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                flex-shrink: 0;
              ">{{ item }}</div>
            }
          </div>
        </div>
        <div style="
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        ">
          <lib-indicator-scroll type="mobile" state="start"></lib-indicator-scroll>
        </div>
      </div>
    `,
    props: {
      items: ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'],
    },
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstração do componente posicionado sobre uma área com rolagem horizontal. O consumidor é responsável pelo posicionamento e pela alternância de estado conforme o scroll (`scrollLeft` / `scrollWidth`).',
      },
    },
  },
};
