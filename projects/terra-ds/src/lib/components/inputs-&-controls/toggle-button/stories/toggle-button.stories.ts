import type { Meta, StoryObj } from '@storybook/angular';
import { solarisIconTypes, ICON_COLOR_TOKEN_NAMES } from '../../../layout-&-structure/icon/utils/theme';
import { ToggleButtonComponent } from '../toggle-button.component';

const toggleButtonDocsDescription = `
**Toggle** — Permite alternar rapidamente entre dois estados, como ativo e inativo, representando mudanças diretas de configuração ou comportamento. Oferece feedback visual imediato ao usuário, tornando a interação simples e intuitiva.

**Toggle Button** — Representa uma variação de botão com comportamento de alternância, permitindo ativar ou desativar um estado ao ser acionado. Pode ser utilizado de forma isolada ou como parte de um conjunto, mantendo consistência visual com outros botões da interface.

**Não use como um Checkbox.**
`.trim();

const meta: Meta<ToggleButtonComponent> = {
  title: "Terra-DS/Inputs & Controls/Toggle Button",
  component: ToggleButtonComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: toggleButtonDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <lib-toggle-button
        [label]="label"
        [checked]="checked"
        [disabled]="disabled"
        [isTooltip]="isTooltip"
        [tooltip]="tooltip"
        [tooltipIndicator]="tooltipIndicator"
        [tooltipArrow]="tooltipArrow"
        [triggerIcon]="triggerIcon"
        [triggerIconColor]="triggerIconColor"
        (checkedChange)="checked = $event"
      ></lib-toggle-button>
    `,
  }),
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    isTooltip: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    tooltip: { control: 'text' },
    tooltipIndicator: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    tooltipArrow: {
      control: 'select',
      options: ['start', 'middle', 'end'],
    },
    triggerIcon: {
      control: 'select',
      options: [...solarisIconTypes],
      table: { defaultValue: { summary: "'Info'" } },
    },
    triggerIconColor: {
      control: 'select',
      options: ['inherit', ...ICON_COLOR_TOKEN_NAMES],
      table: { defaultValue: { summary: "'inherit'" } },
    },
  },
  args: {
    label: 'Ativar notificações',
    checked: false,
    disabled: false,
    isTooltip: false,
    tooltip: '',
    tooltipIndicator: 'top',
    tooltipArrow: 'middle',
    triggerIcon: 'Info',
    triggerIconColor: 'inherit',
  },
};

export default meta;
type Story = StoryObj<ToggleButtonComponent>;

export const Default: Story = {
  name: 'Padrão (off)',
};

export const Ativado: Story = {
  name: 'Ativado (on)',
  args: { checked: true },
};

export const ComTooltip: Story = {
  name: 'Com tooltip',
  args: {
    label: 'Notificações por e-mail',
    isTooltip: true,
    tooltip:
      'Ao ativar, você recebe alertas importantes sobre sua conta e transações.',
  },
  parameters: {
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
};

export const Desabilitado: Story = {
  name: 'Desabilitado (off)',
  args: { disabled: true },
};

export const DesabilitadoAtivado: Story = {
  name: 'Desabilitado (on)',
  args: { checked: true, disabled: true },
};

export const Galeria: Story = {
  name: 'Galeria de estados',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      checked1: false,
      checked2: true,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <lib-toggle-button
          label="Default (off)"
          [checked]="checked1"
          (checkedChange)="checked1 = $event"
        ></lib-toggle-button>
        <lib-toggle-button
          label="Ativado (on)"
          [checked]="checked2"
          (checkedChange)="checked2 = $event"
        ></lib-toggle-button>
        <lib-toggle-button
          label="Desabilitado (off)"
          [checked]="false"
          [disabled]="true"
        ></lib-toggle-button>
        <lib-toggle-button
          label="Desabilitado (on)"
          [checked]="true"
          [disabled]="true"
        ></lib-toggle-button>
      </div>
    `,
  }),
};
