import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { LoadingComponent } from '../loading.component';

const DEMO_ICONS = [
  'DiamondsFour',
];

/** Relativo ao iframe do Storybook (sem `/` inicial) para respeitar `STORYBOOK_BASE` no deploy. */
const DEMO_LOGOS = [
  'assets/images/santander-logo.svg',
  'assets/images/itau-logo.svg',
  'assets/images/porto-logo.svg',
];

const DEMO_TEXTS = [
  'Processando os dados com cuidado...',
  'Buscando as melhores opções...',
  'Consultando as melhores soluções...',
  'Preparando as melhores oportunidade...',
  'Buscando informações essenciais...',
  'Analisando dados financeiros...',
  'Carregando dados do cliente com segurança...',
  'Preparando oportunidades sob medida...',
  'Analisando minuciosamente os dados disponíveis...',
  'Buscando as opções mais vantajosas...',
  'Investigando as soluções mais adequadas...',
  'Assegurando a proteção dos dados...',
];

const loadingDocsDescription =
  'Representa o estado de carregamento de um conjunto de parceiros, indicando que os dados ainda estão sendo processados enquanto mantêm a estrutura da interface.\n\n**Não substituir skeleton quando precisar representar estrutura real.**';

const meta: Meta<LoadingComponent> = {
  title: 'Terra-DS/Layout & Structure/Loading',
  component: LoadingComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: loadingDocsDescription,
      },
    },
    backgrounds: { default: 'dark' },
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <div 
        style="
          display: flex;
          flex-direction: column; 
          align-items: center;
          justify-content: center;
          overflow: hidden;
          height: 400px;
        "
      >
        <lib-loading
          [texts]="texts"
          [logos]="logos"
          [icons]="icons"
          [active]="active"
        ></lib-loading>
      </div>
    `,
  }),
  args: {
    texts: DEMO_TEXTS,
    logos: [],
    icons: DEMO_ICONS,
    active: true,
  },
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Quando `false`, o overlay é removido do DOM via `*ngIf`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    texts: {
      control: 'object',
      description:
        'Array de strings exibidas abaixo do carrossel, trocadas a cada intervalo. Array vazio = sem texto.',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '[]' } },
    },
    icons: {
      control: 'object',
      description:
        'Nomes dos ícones (`lib-icon`) usados no carrossel. Ativado apenas quando `logos` está vazio.',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '[]' } },
    },
    logos: {
      control: 'object',
      description:
        'URLs das imagens do carrossel. Quando preenchido, tem precedência sobre `icons`.',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '[]' } },
    },
  },
};

export default meta;
type Story = StoryObj<LoadingComponent>;

export const Partner: Story = {
  name: 'Partner',
  args: {
    icons: [],
    logos: DEMO_LOGOS,
    texts: DEMO_TEXTS,
    active: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Overlay ativo com carrossel de ícones e três textos rotativos. Use o painel **Controls** para alterar `icons`, `texts` ou desativar via `active`.',
      },
    },
  },
};

export const Icons: Story = {
  name: 'Icons',
  args: {
    icons: DEMO_ICONS,
    logos: [],
    texts: DEMO_TEXTS,
    active: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Apenas o carrossel animado de ícones, sem a faixa de texto rotativo abaixo.',
      },
    },
  },
};

export const WithoutTexts: Story = {
  name: 'No texts',
  args: {
    icons: DEMO_ICONS,
    logos: [],
    texts: [],
    active: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Apenas o carrossel animado de ícones, sem a faixa de texto rotativo abaixo.',
      },
    },
  },
};
