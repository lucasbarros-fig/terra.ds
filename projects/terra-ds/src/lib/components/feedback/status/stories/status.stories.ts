import { Meta, StoryObj } from '@storybook/angular';
import { StatusComponent } from '../status.component';

const statusDocsDescription =
  'Comunica de forma rápida e visual a condição de um item, processo ou informação dentro do sistema.' +
  ' Utiliza variações de cor e estilo para indicar estados como sucesso, erro, alerta ou inativo,' +
  ' facilitando a leitura e a tomada de decisão. Aplique Status para destacar informações críticas,' +
  ' reduzir ambiguidades e tornar a experiência mais clara e eficiente para o usuário.' +
  '\n\n**Nunca usar para representar uma Tag.**';

const meta: Meta<StatusComponent> = {
  title: 'Terra-DS/Feedback/Status',
  component: StatusComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: statusDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-status [status]="status" [size]="size" [text]="text" ></lib-status>
    `,
  }),
  args: {
    status: 'positive',
    size: 'small',
    text: 'Status',
  },
  argTypes: {
    status: {
      control: 'select',
      options: [
        'positive',
        'negative',
        'informative',
        'warning',
        'neutral',
        'disabled',
      ],
      description: 'Estado semântico que define a cor do indicador.',
      table: {
        type: {
          summary:
            "'positive' | 'negative' | 'informative' | 'warning' | 'neutral' | 'disabled'",
        },
        defaultValue: { summary: "'positive'" },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'large'],
      description: 'Tamanho (classes aplicadas ao container interno).',
      table: {
        type: { summary: "'small' | 'large'" },
        defaultValue: { summary: "'small'" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<StatusComponent>;

export const Default: Story = {};

export const Positive: Story = {
  args: { status: 'positive', text: 'Positivo' },
  parameters: {
    docs: { description: { story: 'Uso: operação concluída, conexão ativa, saldo positivo.' } },
  },
};

export const Negative: Story = {
  args: { status: 'negative', text: 'Negativo' },
  parameters: {
    docs: { description: { story: 'Uso: erro, falha, saldo negativo, ação bloqueada.' } },
  },
};

export const Informative: Story = {
  args: { status: 'informative', text: 'Informativo' },
  parameters: {
    docs: { description: { story: 'Uso: informação neutra, aviso de sistema, em processamento.' } },
  },
};

export const Warning: Story = {
  args: { status: 'warning', text: 'Atenção' },
  parameters: {
    docs: { description: { story: 'Uso: alerta que requer atenção mas não bloqueia o fluxo.' } },
  },
};

export const Neutral: Story = {
  args: { status: 'neutral', text: 'Neutro' },
  parameters: {
    docs: { description: { story: 'Uso: estado indeterminado, inativo ou sem classificação.' } },
  },
};

export const Disabled: Story = {
  args: { status: 'disabled', text: 'Desabilitado' },
  parameters: {
    docs: { description: { story: 'Uso: funcionalidade desabilitada ou item não disponível.' } },
  },
};


export const AllStatuses: Story = {
  render: () => ({
    moduleMetadata: { imports: [StatusComponent] },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
        <lib-status status="positive"    size="small" text="Positivo"></lib-status>
        <lib-status status="negative"    size="small" text="Negativo"></lib-status>
        <lib-status status="informative" size="small" text="Informativo"></lib-status>
        <lib-status status="warning"     size="small" text="Atenção"></lib-status>
        <lib-status status="neutral"     size="small" text="Neutro"></lib-status>
        <lib-status status="disabled"    size="small" text="Desabilitado"></lib-status>
      </div>
    `,
  }),
  parameters: {
    docs: { description: { story: 'Todas as variantes de cor lado a lado.' } },
  },
};

export const AllStatusesLarge: Story = {
  render: () => ({
    moduleMetadata: { imports: [StatusComponent] },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
        <lib-status status="positive"    size="large" text="Positivo"></lib-status>
        <lib-status status="negative"    size="large" text="Negativo"></lib-status>
        <lib-status status="informative" size="large" text="Informativo"></lib-status>
        <lib-status status="warning"     size="large" text="Atenção"></lib-status>
        <lib-status status="neutral"     size="large" text="Neutro"></lib-status>
        <lib-status status="disabled"    size="large" text="Desabilitado"></lib-status>
      </div>
    `,
  }),
  parameters: {
    docs: { description: { story: 'Todas as variantes no tamanho `large`.' } },
  },
};
