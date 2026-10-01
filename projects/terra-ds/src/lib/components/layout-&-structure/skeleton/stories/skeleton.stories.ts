import type { Meta, StoryObj } from '@storybook/angular';
import { SkeletonComponent } from '../skeleton.component';
import { SkeletonContainerComponent } from '../components';

const skeletonDocsDescription =
  'Representar visualmente o carregamento de conteúdo, mantendo a estrutura da interface enquanto os dados ainda não estão disponíveis.\n\n**Para indicar erro ou estado vazio.**';

const meta: Meta<SkeletonComponent> = {
  title: 'Terra-DS/Layout & Structure/Skeleton',
  component: SkeletonComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: skeletonDocsDescription,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SkeletonComponent>;

export const Default: Story = {
  render: () => ({
    template: `<lib-skeleton></lib-skeleton>`,
    moduleMetadata: { imports: [SkeletonComponent] },
  }),
};

export const CustomSize: Story = {
  render: () => ({
    template: `<lib-skeleton height="48px" width="240px" borderRadius="12px"></lib-skeleton>`,
    moduleMetadata: { imports: [SkeletonComponent] },
  }),
};

export const Circle: Story = {
  render: () => ({
    template: `<lib-skeleton width="48px" height="48px" borderRadius="50%"></lib-skeleton>`,
    moduleMetadata: { imports: [SkeletonComponent] },
  }),
};

export const CardLayout: Story = {
  name: 'Container — Card Layout',
  argTypes: {
    loading: { control: 'boolean', description: 'Alterna entre skeleton e conteúdo real' },
  } as Record<string, unknown>,
  args: { loading: true } as Record<string, unknown>,
  render: (args) => ({
    props: args,
    template: `
      <lib-skeleton-container [loading]="loading" gap="12px" direction="column" style="max-width: 320px;">
        <div skeleton style="display: flex; flex-direction: column; gap: 12px;">
          <lib-skeleton width="100%" height="160px" borderRadius="8px"></lib-skeleton>
          <lib-skeleton width="60%" height="20px"></lib-skeleton>
          <lib-skeleton width="100%" height="14px"></lib-skeleton>
          <lib-skeleton width="80%" height="14px"></lib-skeleton>
          <div style="display: flex; gap: 8px;">
            <lib-skeleton width="48px" height="48px" borderRadius="50%"></lib-skeleton>
            <lib-skeleton width="120px" height="48px" borderRadius="8px"></lib-skeleton>
          </div>
        </div>
        <div style="padding: 16px; background: var(--color-theme-upper); border-radius: 8px; color: var(--color-text-essential-heading);">
          Conteúdo real carregado com sucesso!
        </div>
      </lib-skeleton-container>
    `,
    moduleMetadata: { imports: [SkeletonComponent, SkeletonContainerComponent] },
  }),
};

export const RowLayout: Story = {
  name: 'Container — Row Layout',
  argTypes: {
    loading: { control: 'boolean', description: 'Alterna entre skeleton e conteúdo real' },
  } as Record<string, unknown>,
  args: { loading: true } as Record<string, unknown>,
  render: (args) => ({
    props: args,
    template: `
      <lib-skeleton-container [loading]="loading" gap="12px" direction="row">
        <div skeleton style="display: flex; gap: 12px;">
          <lib-skeleton width="80px" height="80px" borderRadius="8px"></lib-skeleton>
          <lib-skeleton width="80px" height="80px" borderRadius="8px"></lib-skeleton>
          <lib-skeleton width="80px" height="80px" borderRadius="8px"></lib-skeleton>
        </div>
        <div style="display: flex; gap: 12px; color: var(--color-text-essential-heading); align-items: center;">
          <div style="width: 80px; height: 80px; background: var(--color-theme-upper); border-radius: 8px; display: flex; align-items: center; justify-content: center;">A</div>
          <div style="width: 80px; height: 80px; background: var(--color-theme-upper); border-radius: 8px; display: flex; align-items: center; justify-content: center;">B</div>
          <div style="width: 80px; height: 80px; background: var(--color-theme-upper); border-radius: 8px; display: flex; align-items: center; justify-content: center;">C</div>
        </div>
      </lib-skeleton-container>
    `,
    moduleMetadata: { imports: [SkeletonComponent, SkeletonContainerComponent] },
  }),
};

export const ListLayout: Story = {
  name: 'Container — List Layout',
  argTypes: {
    loading: { control: 'boolean', description: 'Alterna entre skeleton e conteúdo real' },
  } as Record<string, unknown>,
  args: { loading: true } as Record<string, unknown>,
  render: (args) => ({
    props: args,
    template: `
      <lib-skeleton-container [loading]="loading" gap="16px" direction="column">
        <div skeleton style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; gap: 12px; align-items: center;" *ngFor="let i of [1,2,3]">
            <lib-skeleton width="40px" height="40px" borderRadius="50%"></lib-skeleton>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
              <lib-skeleton width="40%" height="14px"></lib-skeleton>
              <lib-skeleton width="70%" height="12px"></lib-skeleton>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px;" *ngFor="let i of [1,2,3]">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="width: 40px; height: 40px; background: var(--color-theme-upper); border-radius: 50%; flex-shrink: 0;"></div>
            <div>
              <div style="font-size: 14px; font-weight: 600; color: var(--color-text-essential-heading);">Usuário {{ i }}</div>
              <div style="font-size: 12px; color: var(--color-text-essential-caption);">usuário{{ i }}&#64;email.com</div>
            </div>
          </div>
        </div>
      </lib-skeleton-container>
    `,
    moduleMetadata: { imports: [SkeletonComponent, SkeletonContainerComponent] },
  }),
};
