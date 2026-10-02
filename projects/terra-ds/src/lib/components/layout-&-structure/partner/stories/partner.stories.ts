import { Meta, StoryObj } from '@storybook/angular';

import { PARTNER_NAMES, PartnerComponent } from '../partner.component';

const docs =
  'Logo dos bancos e instituições parceiras, no padrão do Figma (Terra.ds › Identity › Partners). ' +
  'Use para identificar o parceiro em ofertas, propostas, simulações e listas.\n\n' +
  '- **Style**: `fill` (logo sobre a cor da marca), `solid` (logo colorido, sem fundo) e `contrast` (logo branco, para fundos escuros ou coloridos).\n' +
  '- **Type**: `default` (logotipo completo) ou `minimal` (só o símbolo, ideal em tamanhos pequenos).\n' +
  '- `partner` aceita a chave (`itau`) ou o nome de exibição (`Itaú`, `C6 Bank`). Parceiro sem logo no Terra mostra as iniciais.\n\n' +
  '**Não use Avatar para parceiros.**';

const meta: Meta<PartnerComponent> = {
  title: 'Terra-DS/Layout & Structure/Partner',
  component: PartnerComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: docs } } },
  render: (args) => ({
    props: args,
    template: `<lib-partner [partner]="partner" [partnerStyle]="partnerStyle" [type]="type" [shape]="shape" [size]="size"></lib-partner>`,
  }),
  args: { partner: 'itau', partnerStyle: 'fill', type: 'minimal', shape: 'rounded', size: 64 },
  argTypes: {
    partner: { control: 'select', options: [...PARTNER_NAMES, 'Banco Exemplo'], description: 'Chave ou nome do parceiro.' },
    partnerStyle: { control: 'inline-radio', options: ['fill', 'solid', 'contrast'], table: { defaultValue: { summary: "'fill'" } } },
    type: { control: 'inline-radio', options: ['default', 'minimal'], table: { defaultValue: { summary: "'minimal'" } } },
    shape: { control: 'inline-radio', options: ['circle', 'rounded', 'square'], table: { defaultValue: { summary: "'rounded'" } } },
    size: { control: { type: 'range', min: 16, max: 128, step: 4 }, description: 'Lado em px.', table: { defaultValue: { summary: '40' } } },
  },
};

export default meta;
type Story = StoryObj<PartnerComponent>;

export const Playground: Story = {};

export const Contrast: Story = {
  args: { partnerStyle: 'contrast', partner: 'santander' },
  parameters: { backgrounds: { default: 'dark' } },
  render: (args) => ({
    props: args,
    template: `<div style="display:inline-flex;padding:16px;border-radius:12px;background:var(--color-branding-surface-primary-base)">
      <lib-partner [partner]="partner" partnerStyle="contrast" [type]="type" [size]="size"></lib-partner></div>`,
  }),
};

export const Fallback: Story = {
  name: 'Sem logo (iniciais)',
  args: { partner: 'Banco Exemplo' },
};

export const Todos: Story = {
  name: 'Todos os parceiros',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { parceiros: PARTNER_NAMES, estilos: ['fill', 'solid', 'contrast'], tipos: ['minimal', 'default'] },
    template: `
      <table style="border-collapse:separate;border-spacing:12px 8px;font:12px var(--font-family-primary, sans-serif);color:var(--color-text-essential-body)">
        <tr><th></th>
          @for (t of tipos; track t) { @for (e of estilos; track e) { <th style="font-weight:500;text-align:center">{{ e }} / {{ t }}</th> } }
        </tr>
        @for (p of parceiros; track p) {
          <tr><td style="font-weight:500">{{ p }}</td>
            @for (t of tipos; track t) { @for (e of estilos; track e) {
              <td style="text-align:center;padding:6px;border-radius:8px" [style.background]="e === 'contrast' ? 'var(--color-branding-surface-primary-base)' : 'transparent'">
                <lib-partner [partner]="p" [partnerStyle]="e" [type]="t" [size]="48"></lib-partner>
              </td>
            } }
          </tr>
        }
      </table>`,
  }),
};
