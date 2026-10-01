import { Meta, StoryObj } from '@storybook/angular';

import { AvatarComponent } from '../avatar.component';

const avatarDocsDescription =
  'Representa visualmente um usuário, entidade ou perfil dentro da interface, facilitando a identificação rápida e a personalização da experiência. Pode exibir imagens, iniciais ou ícones como fallback, adaptando-se a diferentes contextos de uso. Aplique Avatar para humanizar a interface, reforçar identidade e tornar a navegação mais intuitiva e reconhecível.\n\n**Não deve ser usado como Partner.**';

const SAMPLE_IMG =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop';

const meta: Meta<AvatarComponent> = {
  title: 'Terra-DS/Layout & Structure/Avatar',
  component: AvatarComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: avatarDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-avatar
        [size]="size"
        [variant]="variant"
        [iconType]="iconType"
        [imageSrc]="imageSrc"
        [alt]="alt"
      ></lib-avatar>
    `,
  }),
  args: {
    size: 'small',
    variant: 'icon',
    iconType: 'User',
    imageSrc: '',
    alt: '',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Small = 32px, Large = 48px.',
      table: {
        type: { summary: "'small' | 'large'" },
        defaultValue: { summary: "'small'" },
      },
    },
    variant: {
      control: 'select',
      options: ['photo', 'icon'],
      description: '`photo` usa `imageSrc`; `icon` usa `iconType` no placeholder.',
      table: {
        type: { summary: "'photo' | 'icon'" },
        defaultValue: { summary: "'icon'" },
      },
    },
    iconType: {
      control: 'select',
      options: [
        'User',
        'Users',
        'Buildings',
        'Briefcase',
        'Gear',
        'Heart',
        'House',
        'Star',
      ],
      description:
        'Ícone Solaris quando `variant` é `icon` (qualquer nome do catálogo também pode ser passado no código).',
      table: {
        type: { summary: 'IconNameType' },
        defaultValue: { summary: "'User'" },
      },
      if: { arg: 'variant', eq: 'icon' },
    },
    imageSrc: {
      control: 'text',
      description: 'Obrigatório para exibir foto quando `variant` é `photo`.',
    },
    alt: {
      control: 'text',
      description: 'Texto alternativo da imagem.',
    },
  },
};

export default meta;
type Story = StoryObj<AvatarComponent>;

export const IconSmall: Story = {
  args: { variant: 'icon', size: 'small' },
  parameters: {
    docs: {
      description: {
        story: 'Variante **icon** (ícone User), tamanho Small (32px).',
      },
    },
  },
};

export const IconLarge: Story = {
  args: { variant: 'icon', size: 'large' },
  parameters: {
    docs: {
      description: {
        story: 'Variante **icon**, tamanho Large (48px).',
      },
    },
  },
};

export const PhotoSmall: Story = {
  args: {
    variant: 'photo',
    size: 'small',
    imageSrc: SAMPLE_IMG,
    alt: 'Retrato de exemplo',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante **Custom** com imagem preenchida (Filled), Small.',
      },
    },
  },
};

export const PhotoLarge: Story = {
  args: {
    variant: 'photo',
    size: 'large',
    imageSrc: SAMPLE_IMG,
    alt: 'Retrato de exemplo',
  },
  parameters: {
    docs: {
      description: {
        story: 'Foto **Filled**, Large.',
      },
    },
  },
};

export const GradeDocumentacao: Story = {
  render: () => ({
    moduleMetadata: { imports: [AvatarComponent] },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, auto); gap: 24px 48px; align-items: end; justify-items: center;">
        <span style="font-weight: 700; font-size: 14px;">Custom</span>
        <span style="font-weight: 700; font-size: 14px;">Ícone</span>

        <lib-avatar variant="photo" size="small" imageSrc="${SAMPLE_IMG}" alt=""></lib-avatar>
        <lib-avatar variant="icon" size="small"></lib-avatar>

        <lib-avatar variant="photo" size="large" imageSrc="${SAMPLE_IMG}" alt=""></lib-avatar>
        <lib-avatar variant="icon" size="large"></lib-avatar>
      </div>
      <p style="margin-top: 16px; font-size: 12px; opacity: 0.8;">Linha 1: Small · Linha 2: Large</p>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Visão geral dos dois tipos (foto e placeholder) e dois tamanhos.',
      },
    },
  },
};
