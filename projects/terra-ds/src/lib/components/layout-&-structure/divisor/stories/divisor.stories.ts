import { Meta, StoryObj } from '@storybook/angular';

import { DivisorComponent } from '../divisor.component';

const divisorDocsDescription =
  'Organiza e separa conteúdos dentro da interface, criando hierarquia visual e melhorando a leitura das informações. Pode ser utilizado para dividir seções, agrupar elementos relacionados ou estruturar layouts de forma mais clara.\n\n**Não alterar espessura ou cor.**';

const meta: Meta<DivisorComponent> = {
  title: 'Terra-DS/Layout & Structure/Divider',
  component: DivisorComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: divisorDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 360px;">
        <lib-divisor [orientation]="orientation"></lib-divisor>
      </div>
    `,
  }),
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description:
        'Direção do traço: `horizontal` (linha em largura total do contêiner) ou `vertical` (entre colunas, costuma funcionar melhor dentro de um flex row com altura definida).',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<DivisorComponent>;

/** Traço horizontal padrão, largura do contêiner. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Variante padrão. Útil entre seções empilhadas ou após um título.',
      },
    },
  },
};

/** Traço vertical em linha ao lado de duas áreas de conteúdo. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DivisorComponent] },
    template: `
      <div style="display: flex; flex-direction: row; align-items: stretch; gap: 12px; height: 120px; width: min(100%, 400px);">
        <section style="flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.04); border-radius: 8px;">
          Área à esquerda
        </section>
        <lib-divisor style="flex-shrink: 0;" [orientation]="orientation"></lib-divisor>
        <section style="flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.04); border-radius: 8px;">
          Área à direita
        </section>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`align-items: stretch` no flex pai faz o divisor crescer na altura comum das colunas.',
      },
    },
  },
};

/** Divisor horizontal entre dois blocos, como entre itens ou seções em lista. */
export const EntreBlocosHorizontal: Story = {
  render: () => ({
    moduleMetadata: { imports: [DivisorComponent] },
    template: `
      <article style="max-width: 400px; display: flex; flex-direction: column; gap: 0;">
        <header style="padding: 16px;">
          <strong>Seção anterior</strong>
          <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.72); font-size: 14px;">
            Conteúdo da primeira parte do layout.
          </p>
        </header>
        <lib-divisor></lib-divisor>
        <section style="padding: 16px;">
          <strong>Próxima seção</strong>
          <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.72); font-size: 14px;">
            Conteúdo após o divisor.
          </p>
        </section>
      </article>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de hierarquia: o divisor apenas separa dois blocos; mantenha o espaçamento em volta no layout pai quando necessário.',
      },
    },
  },
};
