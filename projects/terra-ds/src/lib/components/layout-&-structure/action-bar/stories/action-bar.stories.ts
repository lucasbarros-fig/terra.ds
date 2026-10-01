import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../../../actions/button/button.component';
import { ActionBarComponent } from '../action-bar.component';

const actionBarDocsDescription =
  'Concentra ações principais em uma barra fixa na base da interface, facilitando o acesso rápido e contínuo às operações mais importantes. Mantém as ações sempre visíveis, mesmo durante a navegação ou rolagem, garantindo praticidade e eficiência na interação. Aplique Bottom Action Bar para destacar ações prioritárias, reduzir fricção e conduzir o usuário com mais clareza ao longo da jornada.';

const meta: Meta<ActionBarComponent> = {
  title: 'Terra-DS/Layout & Structure/Bottom Action Bar',
  component: ActionBarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ActionBarComponent, ButtonComponent],
    }),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: actionBarDocsDescription,
      },
    },
  },
  argTypes: {
    maxWidth: {
      control: 'text',
      description:
        'Valor CSS para `--action-bar-max-width` (ex.: `960px`, `min(100%, 800px)`). Vazio = defeito.',
    },
  },
  args: {
    maxWidth: '',
  },
};

export default meta;
type Story = StoryObj<ActionBarComponent>;

export const Padrao: Story = {
  name: 'Primário, secundário e terciário',
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;flex-direction:column;width:100%;min-height:220px;margin:0 auto;background:var(--color-theme-base);">
        <div style="flex:1;padding:16px;font:500 13px/1.45 system-ui;color:var(--color-text-essential-body);">
          Com <code>fixedToViewport=false</code> a barra fica dentro deste painel (como no preview do Storybook). Ative <code>fixedToViewport</code> na story «Fixo na viewport» para ver o modo app.
        </div>
        <lib-action-bar [ariaLabel]="ariaLabel" [maxWidth]="maxWidth" [fixedToViewport]="fixedToViewport">
          <div class="left">
          <lib-button
            intent="neutral"
            variant="ghost"
            label="Voltar"
            [showIcon]="false"
          ></lib-button>
          </div>
          <lib-button
            class="right"
            intent="neutral"
            variant="filled"
            label="Guardar rascunho"
            [showIcon]="false"
          ></lib-button>
          <lib-button
            class="right"
            intent="branding"
            variant="filled"
            label="Continuar"
            [showIcon]="false"
          ></lib-button>
        </lib-action-bar>
      </div>
    `,
  }),
};

export const DoisBotoes: Story = {
  name: 'Dois botões (voltar + continuar)',
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;flex-direction:column;width:100%;min-height:220px;margin:0 auto;background:var(--color-theme-base);">
        <div style="flex:1;padding:16px;font:500 13px/1.45 system-ui;color:var(--color-text-essential-body);">
          Com <code>fixedToViewport=false</code> a barra fica dentro deste painel (como no preview do Storybook). Ative <code>fixedToViewport</code> na story «Fixo na viewport» para ver o modo app.
        </div>
        <lib-action-bar [ariaLabel]="ariaLabel" [maxWidth]="maxWidth" [fixedToViewport]="fixedToViewport">
          <div class="left">
            <lib-button
            actionbar-secondary
            intent="neutral"
            variant="ghost"
            label="Voltar"
            [showIcon]="false"
          ></lib-button>
          </div>
          <div class="right">
          <lib-button
            actionbar-primary
            intent="branding"
            variant="filled"
            label="Continuar"
            [showIcon]="false"
          ></lib-button>
          </div>
        </lib-action-bar>
      </div>
    `,
  }),
};

export const SoContinuar: Story = {
  name: '1 Botão (continuar)',
  render: (args) => ({
    props: args,
    template: `
     <div style="display:flex;flex-direction:column;width:100%;min-height:220px;margin:0 auto;background:var(--color-theme-base);">
        <div style="flex:1;padding:16px;font:500 13px/1.45 system-ui;color:var(--color-text-essential-body);">
          Com <code>fixedToViewport=false</code> a barra fica dentro deste painel (como no preview do Storybook). Ative <code>fixedToViewport</code> na story «Fixo na viewport» para ver o modo app.
        </div>
        <lib-action-bar [ariaLabel]="ariaLabel" [maxWidth]="maxWidth" [fixedToViewport]="fixedToViewport">
          <div class="right">
            <lib-button
              actionbar-primary
              intent="branding"
              variant="filled"
              label="Continuar"
              [showIcon]="false"
            ></lib-button>
          </div>
        </lib-action-bar>
      </div>
    `,
  }),
};

export const SoVoltar: Story = {
  name: '1 Botão (voltar)',
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;flex-direction:column;width:100%;min-height:220px;margin:0 auto;background:var(--color-theme-base);">
        <div style="flex:1;padding:16px;font:500 13px/1.45 system-ui;color:var(--color-text-essential-body);">
          Com <code>fixedToViewport=false</code> a barra fica dentro deste painel (como no preview do Storybook). Ative <code>fixedToViewport</code> na story «Fixo na viewport» para ver o modo app.
        </div>
        <lib-action-bar [ariaLabel]="ariaLabel" [maxWidth]="maxWidth" [fixedToViewport]="fixedToViewport">
          <div class="left">
            <lib-button
              actionbar-secondary
              intent="neutral"
              variant="ghost"
              label="Voltar"
              [showIcon]="false"
            ></lib-button>
          </div>
        </lib-action-bar>
      </div>
    `,
  }),
};
