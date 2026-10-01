import type { Meta, StoryObj } from "@storybook/angular";
import { HelperComponent, type HelperColor, type HelperType } from "../helper.component";

const HELPER_COLORS: HelperColor[] = [
  "neutral",
  "informative",
  "warning",
  "positive",
  "negative",
];

const HELPER_TYPES: HelperType[] = ["helper", "inline_message"];

const helperDocsDescription =
  'Complementa a interface com informações de apoio, orientações ou mensagens contextuais que auxiliam o usuário durante a interação.' +
  ' Pode ser utilizado para explicar ações, validar entradas ou destacar pontos importantes de forma discreta e objetiva.' +
  ' Aplique Helper para reduzir dúvidas, aumentar a clareza das operações e tornar a experiência mais guiada e eficiente.' +
  '\n\n**Substitui o antigo Inline Mensage.**';

const meta: Meta<HelperComponent> = {
  title: 'Terra-DS/Feedback/Helper',
  component: HelperComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: helperDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: args,
  }),
  argTypes: {
    color: {
      control: 'select',
      options: HELPER_COLORS,
    },
    type: {
      control: 'select',
      options: HELPER_TYPES,
    },
  },
} satisfies Meta<HelperComponent>;

export default meta;
type Story = StoryObj<HelperComponent>;

export const Default: Story = {
  args: {
    text: 'Texto de apoio',
    description: 'Descrição para ajudar no entendimento',
    color: 'neutral',
    type: 'helper',
  },
};

export const HelperNeutral: Story = {
  args: {
    text: 'Texto de apoio',
    description: 'Descrição para ajudar no entendimento',
    color: 'neutral',
    type: 'helper',
  },
};

export const HelperInformative: Story = {
  args: {
    text: 'Texto informativo',
    description: 'Descrição informativa para ajudar no entendimento',
    color: 'informative',
    type: 'helper',
  },
};

export const HelperWarning: Story = {
  args: {
    text: 'Texto de aviso',
    description: 'Descrição de aviso para ajudar no entendimento',
    color: 'warning',
    type: 'helper',
  },
};

export const HelperPositive: Story = {
  args: {
    text: 'Texto positivo',
    description: 'descrição positiva para ajudar no entendimento',
    color: 'positive',
    type: 'helper',
  },
};

export const HelperNegative: Story = {
  args: {
    text: 'Texto negativo',
    description: 'Descrição negativa para ajudar no entendimento',
    color: 'negative',
    type: 'helper',
  },
};

export const InlineMessageNeutral: Story = {
  args: {
    text: 'Título do card',
    description: 'Descrição neutra do card',
    color: 'neutral',
    type: 'inline_message',
  },
};

export const InlineMessageInformative: Story = {
  args: {
    text: 'Título do card',
    description: 'Descrição informativa do card',
    color: 'informative',
    type: 'inline_message',
  },
};

export const InlineMessageWarning: Story = {
  args: {
    text: 'Título do card',
    description: 'Descrição de aviso do card',
    color: 'warning',
    type: 'inline_message',
  },
};

export const InlineMessagePositive: Story = {
  args: {
    text: 'Título do card',
    description: 'Descrição positiva do card',
    color: 'positive',
    type: 'inline_message',
  },
};

export const InlineMessageNegative: Story = {
  args: {
    text: 'Título do card',
    description: 'Descrição negativa do card',
    color: 'negative',
    type: 'inline_message',
  },
};

export const AllHelperColors: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 50%; min-width: 360px">
        <terra-ds-helper
          text="Texto de apoio"
          description="Descrição para ajudar no entendimento"
          color="neutral"
          type="helper"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Texto informativo"
          description="Descrição informativa para ajudar no entendimento"
          color="informative"
          type="helper"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Texto de aviso"
          description="Descrição de aviso para ajudar no entendimento"
          color="warning"
          type="helper"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Texto positivo"
          description="Descrição positiva para ajudar no entendimento"
          color="positive"
          type="helper"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Texto negativo"
          description="Descrição negativa para ajudar no entendimento"
          color="negative"
          type="helper"
        ></terra-ds-helper>
      </div>
    `,
  }),
};

export const AllInlineMessageColors: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 50%; min-width: 360px">
        <terra-ds-helper
          text="Título do card"
          description="descrição neutra do card"
          color="neutral"
          type="inline_message"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Título do card"
          description="descrição informativa do card"
          color="informative"
          type="inline_message"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Título do card"
          description="descrição de aviso do card"
          color="warning"
          type="inline_message"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Título do card"
          description="Descrição positiva do card"
          color="positive"
          type="inline_message"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Título do card"
          description="Descrição negativa do card"
          color="negative"
          type="inline_message"
        ></terra-ds-helper>
      </div>
    `,
  }),
};

export const BothTypes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 50%; min-width: 360px">
        <terra-ds-helper
          text="Texto de apoio"
          description="Descrição para ajudar no entendimento"
          color="neutral"
          type="helper"
        ></terra-ds-helper>
        <terra-ds-helper
          text="Título do card"
          description="Descrição neutra do card"
          color="neutral"
          type="inline_message"
        ></terra-ds-helper>
      </div>
    `,
  }),
};
