import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { TagComponent, type TagColor } from '../tag.component';
import { solarisIconTypes } from '../../../layout-&-structure/icon/utils/theme';

const TAG_EMPHASIS = ['high', 'low'] as const;

const TAG_COLORS: TagColor[] = [
  'blue',
  'purple',
  'cyan',
  'emerald',
  'pink',
  'orange',
  'red',
  'teal',
  'yellow',
  'neutral',
  'green',
  'disabled',
];

type TagStoryArgs = TagComponent & { text: string };

const tagDocsDescription =
  'Organiza e destaca informações de forma compacta, permitindo categorizar, identificar ou agrupar dados com clareza. Pode ser utilizado para representar atributos, filtros ou classificações, facilitando a leitura rápida e a navegação dentro da interface. Aplique Tags para estruturar informações de maneira visual, reduzir complexidade e tornar a experiência mais intuitiva e eficiente.\n\n**Nunca usar para representar um Status.**';

const meta: Meta<TagStoryArgs> = {
  title: 'Terra-DS/Feedback/Tag',
  component: TagComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: tagDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <lib-tag
        [emphasis]="emphasis"
        [color]="color"
        [size]="size"
        [showAfterIcon]="showAfterIcon"
        [afterIcon]="afterIcon"
        [showCloseButton]="showCloseButton"
        (closed)="closed && closed($event)"
      >{{ text }}</lib-tag>
    `,
  }),
  argTypes: {
    emphasis: {
      control: 'select',
      options: [...TAG_EMPHASIS],
      table: { type: { summary: "'high' | 'low'" }, defaultValue: { summary: "'high'" } },
    },
    color: {
      control: 'select',
      options: TAG_COLORS,
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
      table: { type: { summary: "'small' | 'large'" }, defaultValue: { summary: "'small'" } },
    },
    showAfterIcon: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    afterIcon: {
      control: 'select',
      options: [...solarisIconTypes],
      table: { defaultValue: { summary: "'information'" } },
      if: { arg: 'showAfterIcon', truthy: true },
    },
    showCloseButton: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    text: {
      name: 'Texto (ng-content)',
      control: 'text',
      table: { category: 'Conteúdo' },
    },
  } as Record<string, unknown>,
  args: {
    emphasis: 'high',
    color: 'blue',
    size: 'small',
    showAfterIcon: false,
    afterIcon: 'information',
    showCloseButton: false,
    text: 'Tag',
  },
};

export default meta;
type Story = StoryObj<TagStoryArgs>;

export const Default: Story = {
  name: 'Padrão',
  args: { text: 'Em análise', color: 'blue', emphasis: 'high' },
};

export const EnfaseAlta: Story = {
  name: 'Ênfase alta',
  args: { emphasis: 'high', color: 'blue', text: 'Alta' },
};

export const EnfaseBaixa: Story = {
  name: 'Ênfase baixa',
  args: { emphasis: 'low', color: 'blue', text: 'Baixa' },
};

export const Tamanhos: Story = {
  name: 'Tamanhos (small / large)',
  render: () => ({
    moduleMetadata: { imports: [CommonModule, TagComponent] },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: center;">
        <lib-tag emphasis="high" color="blue" size="small">Small</lib-tag>
        <lib-tag emphasis="high" color="blue" size="large">Large</lib-tag>
      </div>
    `,
  }),
};

export const ComIcone: Story = {
  name: 'Com ícone (esquerda)',
  args: {
    emphasis: 'high',
    color: 'blue',
    size: 'small',
    text: 'Em análise',
    showAfterIcon: true,
    afterIcon: 'information',
  },
};

export const ComBotaoFechar: Story = {
  name: 'Com botão fechar (X)',
  args: {
    emphasis: 'high',
    color: 'blue',
    size: 'small',
    text: 'Filtro ativo',
    showCloseButton: true,
  },
};

export const IconeEFecharLow: Story = {
  name: 'Ícone + botão fechar (low)',
  args: {
    emphasis: 'low',
    color: 'blue',
    size: 'small',
    text: 'Selecionado',
    showAfterIcon: true,
    afterIcon: 'check-circle',
    showCloseButton: true,
  },
};

export const IconeEFechar: Story = {
  name: 'Ícone + botão fechar',
  args: {
    emphasis: 'high',
    color: 'purple',
    size: 'large',
    text: 'Selecionado',
    showAfterIcon: true,
    afterIcon: 'check-circle',
    showCloseButton: true,
  },
};

export const GaleriaCores: Story = {
  name: 'Galeria: cores (low e high · small e large)',
  render: () => ({
    moduleMetadata: { imports: [CommonModule, TagComponent] },
    props: { colors: TAG_COLORS },
    template: `
      <div style="display: flex; flex-direction: column; gap: 28px; max-width: 1000px; text-align: left;">
        <div>
          <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; margin: 0 0 10px; color: rgba(255, 255, 255, 0.55);">high · small</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <lib-tag *ngFor="let c of colors" [emphasis]="'high'" [color]="c" size="small">{{ c }}</lib-tag>
          </div>
        </div>
        <div>
          <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; margin: 0 0 10px; color: rgba(255, 255, 255, 0.55);">high · large</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <lib-tag *ngFor="let c of colors" [emphasis]="'high'" [color]="c" size="large">{{ c }}</lib-tag>
          </div>
        </div>
        <div>
          <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; margin: 0 0 10px; color: rgba(255, 255, 255, 0.55);">low · small</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <lib-tag *ngFor="let c of colors" [emphasis]="'low'" [color]="c" size="small">{{ c }}</lib-tag>
          </div>
        </div>
        <div>
          <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; margin: 0 0 10px; color: rgba(255, 255, 255, 0.55);">low · large</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            <lib-tag *ngFor="let c of colors" [emphasis]="'low'" [color]="c" size="large">{{ c }}</lib-tag>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded', controls: { disable: true } },
};
