import type { Meta, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { ColorPickerScaleComponent } from '../color-picker-scale.component';
import { ColorPickerComponent } from '../components/color-picker/color-picker.component';

const colorPickerDocsDescription =
  'Permite selecionar cores de forma visual e precisa, combinando diferentes variações de tonalidade, saturação e brilho. Facilita a personalização de elementos na interface ao oferecer controle intuitivo e feedback imediato da cor escolhida.';

const meta: Meta<ColorPickerScaleComponent> = {
  title: 'Terra-DS/Inputs & Controls/Color Picker',
  component: ColorPickerScaleComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: colorPickerDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <lib-color-picker-scale
        [initialColor]="initialColor"
        [displayScale]="displayScale"
        (colors)="colors($event)"
      ></lib-color-picker-scale>
    `,
  }),
  args: {
    initialColor: '',
    displayScale: true,
  },
  argTypes: {
    initialColor: {
      control: 'color',
      description:
        'Cor inicial em **hexadecimal** (ex.: `#ff00aa`). Vazio inicia o picker em branco. Aceita o formato `#rrggbb` (validado por regex no `hexToRgb`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    displayScale: {
      control: 'boolean',
      description:
        'Exibe os chips da escala de cores. Em **false**, apenas paleta + campo hex (payload `scale` inalterado).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    colors: { action: 'colors' },
  },
};

export default meta;
type Story = StoryObj<ColorPickerScaleComponent>;

export const Default: Story = {
  name: 'Default',
  parameters: {
    docs: {
      description: {
        story:
          'Estado inicial sem `initialColor`. Use o **slider** à direita para escolher o matiz e a **paleta** à esquerda para ajustar saturação/brilho. Os eventos disparados aparecem no painel **Actions** do Storybook.',
      },
    },
  },
};

export const WithInitialColor: Story = {
  name: 'With initialColor',
  args: {
    initialColor: '#db0082',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Inicializa com a cor de marca usada no Terra DS (`#db0082`).',
      },
    },
  },
};

export const WithoutDisplayScale: Story = {
  name: 'Without Visual Scale',
  args: {
    displayScale: false,
    initialColor: '#db0082',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mesmo layout do wrapper (`app-color-picker-scale`), com **`displayScale=false`**: paleta, slider e hex permanecem; os chips da escala ficam ocultos. O evento `colors` ainda inclui `scale` completo.',
      },
    },
  },
};

export const PrimitiveColorPicker: Story = {
  name: 'Primitive',
  parameters: {
    docs: {
      description: {
        story:
          'Somente **`app-color-picker`**: paleta + slider, sem card hex nem chips. Útil quando o hex e a escala são tratados fora deste componente.',
      },
    },
  },
  render: () => ({
    moduleMetadata: { imports: [ColorPickerComponent] },
    props: {
      initialColor: '#db0082',
      colors: action('colors'),
    },
    template: `
      <app-color-picker
        [initialColor]="initialColor"
        (colors)="colors($event)"
      ></app-color-picker>
    `,
  }),
};

export const SideBySidePresets: Story = {
  name: 'Examples',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Comparativo lado a lado de instâncias com diferentes `initialColor`, útil para checagem visual de hue/paleta no primeiro render.',
      },
    },
  },
  render: () => ({
    moduleMetadata: { imports: [ColorPickerScaleComponent] },
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(420px, 1fr));gap:24px;font: 500 12px/1.4 DM Sans, sans-serif;">
        <div style="display:flex;flex-direction:column;gap:8px;">
          <strong>#ff0000 — vermelho</strong>
          <app-color-picker-scale initialColor="#ff0000"></app-color-picker-scale>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <strong>#00c853 — verde</strong>
          <app-color-picker-scale initialColor="#00c853"></app-color-picker-scale>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <strong>#1e88e5 — azul</strong>
          <app-color-picker-scale initialColor="#1e88e5"></app-color-picker-scale>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <strong>#db0082 — Terra Pink</strong>
          <app-color-picker-scale initialColor="#db0082"></app-color-picker-scale>
        </div>
      </div>
    `,
  }),
};
