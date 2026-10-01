import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent } from '../../../actions/button/button.component';
import { FileItemComponent } from '../file-item.component';

const docsDescription = `
Representa um arquivo selecionado ou enviado, exibindo informações como nome, tipo, status, progresso e ações disponíveis. É utilizado para acompanhar o ciclo de vida do arquivo durante o upload, oferecendo feedback claro sobre o processamento e permitindo interações como remoção ou nova tentativa de envio. Aplique File Item para tornar o gerenciamento de arquivos mais organizado, transparente e intuitivo para o usuário.
`.trim();

const meta: Meta<FileItemComponent> = {
  title: 'Terra-DS/Layout & Structure/File Item',
  component: FileItemComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FileItemComponent, ButtonComponent],
    }),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: docsDescription,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 470px;">
        <lib-file-item
          [label]="label"
          [fileType]="fileType"
          [size]="size"
          [date]="date"
          [showDate]="showDate"
          [state]="state"
          [progress]="progress"
          [uploadingLabel]="uploadingLabel"
          [errorMessage]="errorMessage"
          [showSlot]="showSlot"
          [actionAriaLabel]="actionAriaLabel"
          (actionClicked)="actionClicked($event)"
        ></lib-file-item>
      </div>
    `,
  }),
  args: {
    label: 'file_title',
    fileType: 'type',
    size: '00MB',
    date: '20/11/26',
    showDate: true,
    state: 'default',
    progress: 50,
    uploadingLabel: 'Enviando',
    errorMessage: 'Falha no envio',
    showSlot: false,
    actionAriaLabel: '',
  },
  argTypes: {
    state: {
      control: 'radio',
      options: ['default', 'selected', 'uploading', 'disabled', 'error'],
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    actionClicked: { action: 'actionClicked' },
  },
};

export default meta;
type Story = StoryObj<FileItemComponent>;

export const Default: Story = {
  name: 'Default',
};

export const Selected: Story = {
  name: 'Selected',
  args: {
    state: 'selected',
  },
};

export const Uploading: Story = {
  name: 'Uploading',
  args: {
    state: 'uploading',
    progress: 50,
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    state: 'disabled',
  },
};

export const Error: Story = {
  name: 'Error',
  args: {
    state: 'error',
  },
};

export const WithoutDate: Story = {
  name: 'Without Date',
  args: {
    showDate: false,
  },
};

export const AllStates: Story = {
  name: 'All States',
  render: () => ({
    moduleMetadata: {
      imports: [FileItemComponent],
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 470px;">
        <lib-file-item label="file_title" fileType="type" size="00MB" date="20/11/26" state="default"></lib-file-item>
        <lib-file-item label="file_title" fileType="type" size="00MB" date="20/11/26" state="selected"></lib-file-item>
        <lib-file-item label="file_title" fileType="type" state="uploading" [progress]="50"></lib-file-item>
        <lib-file-item label="file_title" fileType="type" size="00MB" date="20/11/26" state="disabled"></lib-file-item>
        <lib-file-item label="file_title" fileType="type" state="error"></lib-file-item>
      </div>
    `,
  }),
};

export const WithCustomSlot: Story = {
  name: 'With Custom Slot',
  render: () => ({
    moduleMetadata: {
      imports: [FileItemComponent, ButtonComponent],
    },
    template: `
      <div style="max-width: 470px;">
        <lib-file-item
          label="relatorio"
          fileType="pdf"
          size="2.4MB"
          date="31/07/26"
          [showSlot]="true"
        >
          <lib-button
            fileItemSlot
            intent="neutral"
            variant="ghost"
            label="Abrir"
          ></lib-button>
        </lib-file-item>
      </div>
    `,
  }),
};
