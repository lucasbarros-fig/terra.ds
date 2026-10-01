import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../../../actions/button/button.component';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { DialogComponent } from '../dialog.component';
import { DialogFooterComponent } from '../dialog-footer/dialog-footer.component';
import { DialogHeaderComponent } from '../dialog-header/dialog-header.component';
import type { DialogFooterActionsLayout, DialogIntent } from '../dialog.types';
import type { IconNameType } from '../../icon/icon.component';

const DIALOG_STORY_COMPOSITIONS = [
  'full',
  'title-footer',
  'header-body',
  'body-only',
] as const;
type DialogStoryComposition = (typeof DIALOG_STORY_COMPOSITIONS)[number];

const DIALOG_STORY_FOOTER_PRESETS = [
  'default',
  'custom',
  'default-plus-slot',
] as const;
type DialogStoryFooterPreset = (typeof DIALOG_STORY_FOOTER_PRESETS)[number];

@Component({
  selector: 'lib-story-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    DialogHeaderComponent,
    DialogBodyComponent,
    DialogFooterComponent,
    ButtonComponent,
  ],
  template: `
    <div style="min-height: 360px; position: relative; padding: 8px 0;">
      <div style="margin-bottom: 16px;">
        <lib-button
          label="Abrir Dialog"
          intent="branding"
          [showIcon]="false"
          (clicked)="open = true"
        ></lib-button>
      </div>

      <lib-dialog
        [intent]="intent"
        [open]="open"
        [showBackdrop]="showBackdrop"
        [closeOnBackdropClick]="closeOnBackdropClick"
        ariaLabel="Dialog example"
        (backdropClick)="open = false"
      >
        @if (showHeader) {
          <lib-dialog-header
            [intent]="intent"
            [title]="title"
            [icon]="headerIcon"
            [showCloseButton]="showCloseButton"
            (closeClick)="open = false"
          ></lib-dialog-header>
        }

        @if (showBody) {
          <lib-dialog-body>
            <p style="margin: 0 0 12px;">
              Body do Dialog.
            </p>
            <p style="margin: 0;">
              Use o botão <strong>Abrir Dialog</strong> ou o control <strong>open</strong> para controlar a exibição.
            </p>
          </lib-dialog-body>
        }

        @if (showFooter) {
          <lib-dialog-footer
            [actionsLayout]="footerActionsLayout"
            [showDefaultActions]="footerPreset !== 'custom'"
            [intent]="intent"
            [cancelIcon]="cancelIcon"
            [confirmIcon]="confirmIcon"
            [cancelLoading]="cancelLoading"
            [confirmLoading]="confirmLoading"
            (cancelClick)="open = false"
            (confirmClick)="open = false"
          >
            @if (footerPreset === 'default-plus-slot') {
              <p style="margin: 0 0 12px; font-size: 13px; color: var(--color-text-essential-caption, #6b7280);">
                Conteúdo adicional (renderizado acima das opções default).
              </p>
            }
            @if (footerPreset === 'custom') {
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <lib-button
                  label="Custom action A"
                  intent="neutral"
                  variant="ghost"
                  [showIcon]="false"
                  (clicked)="open = false"
                ></lib-button>
                <lib-button
                  label="Custom action B"
                  intent="branding"
                  variant="filled"
                  [intent]="intent"
                  [showIcon]="false"
                  (clicked)="open = false"
                ></lib-button>
              </div>
            }
          </lib-dialog-footer>
        }
      </lib-dialog>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LibDialogStoryHostComponent {
  @Input() intent: DialogIntent = 'branding';
  @Input() composition: DialogStoryComposition = 'full';
  @Input() footerPreset: DialogStoryFooterPreset = 'default';
  @Input() title = 'Dialog title';
  @Input() headerIcon?: IconNameType;
  @Input() showBackdrop = true;
  @Input() closeOnBackdropClick = true;
  @Input() showCloseButton = true;
  @Input() footerActionsLayout: DialogFooterActionsLayout = 'horizontal';
  @Input() open = false;
  @Input() cancelIcon?: IconNameType;
  @Input() confirmIcon?: IconNameType;
  @Input() cancelLoading = false;
  @Input() confirmLoading = false;

  get showHeader(): boolean {
    return this.composition !== 'body-only';
  }

  get showBody(): boolean {
    return this.composition !== 'title-footer';
  }

  get showFooter(): boolean {
    return (
      this.composition === 'full' || this.composition === 'title-footer'
    );
  }
}

const dialogDocsDescription =
  'Organiza interações entre o sistema e o usuário em uma camada dedicada, permitindo apresentar informações, solicitar ações ou conduzir decisões de forma clara e estruturada. Pode assumir diferentes comportamentos, como o formato modal, que bloqueia a interface para exigir atenção total, ou variações não bloqueantes, adaptando-se ao nível de prioridade da ação. Aplique Dialog para guiar interações importantes, reduzir ambiguidades e garantir mais controle, clareza e consistência na experiência.';

const meta: Meta<LibDialogStoryHostComponent> = {
  title: 'Terra-DS/Layout & Structure/Dialog',
  component: LibDialogStoryHostComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: dialogDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [LibDialogStoryHostComponent],
    },
    template: `<lib-story-dialog
      [intent]="intent"
      [composition]="composition"
      [footerPreset]="footerPreset"
      [title]="title"
      [headerIcon]="headerIcon"
      [showBackdrop]="showBackdrop"
      [closeOnBackdropClick]="closeOnBackdropClick"
      [showCloseButton]="showCloseButton"
      [footerActionsLayout]="footerActionsLayout"
      [cancelIcon]="cancelIcon"
      [confirmIcon]="confirmIcon"
      [cancelLoading]="cancelLoading"
      [confirmLoading]="confirmLoading"
      [open]="open"
    ></lib-story-dialog>`,
  }),
  args: {
    intent: 'branding',
    composition: 'full',
    footerPreset: 'default',
    title: 'Dialog title',
    showBackdrop: true,
    closeOnBackdropClick: true,
    showCloseButton: true,
    footerActionsLayout: 'horizontal',
    cancelLoading: false,
    confirmLoading: false,
    open: false,
  },
  argTypes: {
    intent: {
      control: 'select',
      options: [
        'branding',
        'neutral',
        'positive',
        'warning',
        'negative',
        'informative',
      ] satisfies DialogIntent[],
    },
    composition: {
      control: 'select',
      options: [...DIALOG_STORY_COMPOSITIONS],
    },
    footerPreset: {
      control: 'select',
      options: [...DIALOG_STORY_FOOTER_PRESETS],
      description:
        "Only when the footer is visible (`full` or `title-footer`). `custom` hides the default buttons.",
    },
    footerActionsLayout: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    open: {
      control: 'boolean',
      description: 'Panel visibility (`lib-dialog`).',
    },
    cancelLoading: {
      control: 'boolean',
      description:
        'Shows a spinner in the default cancel action and blocks its click while the async action runs.',
    },
    confirmLoading: {
      control: 'boolean',
      description:
        'Shows a spinner in the default confirm action and blocks its click while the async action runs.',
    },
    headerIcon: {
      control: 'text',
      description:
        'Overrides the icon shown in `lib-dialog-header` (`icon` input). When empty, falls back to the icon derived from `intent`.',
    },
  },
};

export default meta;
type Story = StoryObj<LibDialogStoryHostComponent>;

export const Default: Story = {
  name: 'Default',
};

export const TitleFooterOnly: Story = {
  name: 'Header and Footer',
  args: {
    composition: 'title-footer',
    footerPreset: 'default',
    title: 'Confirmar esta ação?',
    intent: 'informative',
  },
};

export const HeaderBodyOnly: Story = {
  name: 'Header and Body',
  args: {
    composition: 'header-body',
    title: 'Informação',
    intent: 'branding',
  },
};

export const BodyOnly: Story = {
  name: 'Body only',
  args: {
    composition: 'body-only',
    intent: 'branding',
  },
};

export const FooterCustomContentOnly: Story = {
  name: 'Footer Content',
  args: {
    composition: 'full',
    footerPreset: 'custom',
    intent: 'branding',
  },
};

export const FooterVerticalLayout: Story = {
  name: 'Footer Vertical Layout',
  args: {
    footerActionsLayout: 'vertical',
    composition: 'full',
    footerPreset: 'default',
    intent: 'branding',
  },
};

export const FooterDefaultActionIcons: Story = {
  name: 'Footer — default actions with icons',
  args: {
    cancelIcon: 'X',
    confirmIcon: 'CheckCircle',
    composition: 'full',
    footerPreset: 'default',
    open: true,
  },
};

export const FooterConfirmLoading: Story = {
  name: 'Footer — confirm loading',
  args: {
    composition: 'full',
    footerPreset: 'default',
    intent: 'branding',
    title: 'Salvando alterações',
    confirmLoading: true,
    open: true,
  },
};

export const FooterCancelLoading: Story = {
  name: 'Footer — cancel loading',
  args: {
    composition: 'full',
    footerPreset: 'default',
    intent: 'branding',
    title: 'Cancelando operação',
    cancelLoading: true,
    open: true,
  },
};

export const IntentBranding: Story = {
  name: 'Intent — branding',
  args: {
    intent: 'branding',
    composition: 'full',
    footerPreset: 'default',
    title: 'Branding',
  },
};

export const IntentNeutral: Story = {
  name: 'Intent — neutral',
  args: {
    intent: 'neutral',
    composition: 'full',
    footerPreset: 'default',
    title: 'Neutral',
  },
};

export const IntentPositive: Story = {
  name: 'Intent — positive',
  args: {
    intent: 'positive',
    composition: 'full',
    footerPreset: 'default',
    title: 'Positive',
  },
};

export const IntentWarning: Story = {
  name: 'Intent — warning',
  args: {
    intent: 'warning',
    composition: 'full',
    footerPreset: 'default',
    title: 'Warning',
  },
};

export const IntentNegative: Story = {
  name: 'Intent — negative',
  args: {
    intent: 'negative',
    composition: 'full',
    footerPreset: 'default',
    title: 'Negative',
  },
};

export const IntentInformative: Story = {
  name: 'Intent — informative',
  args: {
    intent: 'informative',
    composition: 'full',
    footerPreset: 'default',
    title: 'Informative',
  },
};

export const HeaderCustomIcon: Story = {
  name: 'Header — custom icon',
  args: {
    intent: 'negative',
    composition: 'header-body',
    title: 'Excluir conta',
    headerIcon: 'ShieldWarning',
    open: true,
  },
};
