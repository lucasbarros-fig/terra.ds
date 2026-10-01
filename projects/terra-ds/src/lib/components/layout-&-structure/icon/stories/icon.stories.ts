import type { Meta, StoryObj } from '@storybook/angular';
import { IconComponent } from '../icon.component';
import {
  ICON_COLOR_TOKEN_NAMES,
  ICON_SIZES,
  solarisIconTypes,
  type SolarisIconType,
} from '../utils/theme';

const allIconNames: SolarisIconType[] = [...solarisIconTypes];

const defaultArgs: Meta<IconComponent>['args'] = {
  icon: 'Triangle',
  size: 32,
  color: 'inherit',
};

const iconFrameDocsDescription =
  'Padroniza a estrutura e o comportamento de ícones dentro da interface, permitindo aplicar,' +
  ' trocar e escalar ícones de forma consistente sem impactar outros elementos. Atua como um' +
  ' container reutilizável que desacopla o ícone do componente final, garantindo flexibilidade,' +
  ' manutenção simplificada e maior eficiência na construção de interfaces. Aplique Icon Frame' +
  ' para centralizar o uso de ícones, reduzir retrabalho e manter consistência visual em todo o' +
  ' sistema.\n\n**Nunca usar o Icon frame isolado como um button/Icon button.**';

const meta: Meta<IconComponent> = {
  title: 'Terra-DS/Layout & Structure/Icon',
  component: IconComponent,
  tags: ['autodocs'],
  args: { ...defaultArgs },
  parameters: {
    layout: 'centered',
    controls: {
      include: ['icon', 'size', 'color'],
    },
    docs: {
      controls: {
        include: ['icon', 'size', 'color'],
      },
      description: {
        component: iconFrameDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <lib-icon
        [icon]="icon"
        [size]="size"
        [color]="color"
      ></lib-icon>
    `,
  }),
  argTypes: {
    icon: {
      name: 'icon',
      description:
        'Ícone conforme `dist/solaris/fonts/icons/style.css`: `SolarisIconType` (PascalCase) ou kebab minúsculo (`triangle` → Triangle). Catálogo: `data/solaris-types.generated.json` (`npm run sync:icon-types`).',
      control: 'select',
      options: allIconNames,
      table: {
        type: { summary: 'SolarisIconType' },
        defaultValue: { summary: String(defaultArgs.icon) },
      },
    },
    size: {
      description: 'Tamanho em px.',
      control: { type: 'select' },
      options: ICON_SIZES,
      table: {
        defaultValue: { summary: String(defaultArgs.size) },
      },
    },
    color: {
      description:
        'Token DS (`essential-*`, `support-*`, `feedback-*`, `static-*`), `inherit` ou cor CSS livre.',
      control: { type: 'select' },
      options: ['inherit', ...ICON_COLOR_TOKEN_NAMES],
      table: {
        type: { summary: 'IconColor' },
        defaultValue: { summary: String(defaultArgs.color) },
      },
    },
  },
};

export default meta;
type Story = StoryObj<IconComponent>;

const baseArgs = defaultArgs;

export const Size32: Story = {
  args: { ...baseArgs, size: 32 },
};

export const Size24: Story = {
  args: { ...baseArgs, size: 24 },
};

export const Size20: Story = {
  args: { ...baseArgs, size: 20 },
};

export const Size16: Story = {
  args: { ...baseArgs, size: 16 },
};

export const Size12: Story = {
  args: { ...baseArgs, size: 12 },
};

export const Size8: Story = {
  args: { ...baseArgs, size: 8 },
};

/** Token semântico do DS (acompanha tema light/dark via variáveis CSS). */
export const ColorEssentialHigh: Story = {
  args: { ...baseArgs, color: 'essential-high' },
};

/** Token de cor de suporte (paleta brand). */
export const ColorSupportPurple: Story = {
  args: { ...baseArgs, color: 'support-purple' },
};

/** Cor CSS livre (não recomendado fora de casos pontuais). */
export const ColorCustom: Story = {
  args: { ...baseArgs, color: '#7C3AED' },
};
