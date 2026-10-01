import type { Meta, StoryObj } from '@storybook/angular';
import { TabsComponent, type Tab } from '../tabs.component';

const SAMPLE_TABS: Tab[] = [
  { label: 'Dashboard', icon: 'ChartPieSlice' },
  { label: 'Usuários', icon: 'Users' },
  { label: 'Configurações', icon: 'GearSix' },
  { label: 'Relatórios', icon: 'FileText' },
];

const TABS_WITH_DISABLED: Tab[] = [
  { label: 'Dashboard', icon: 'ChartPieSlice' },
  { label: 'Usuários', icon: 'Users' },
  { label: 'Bloqueado', icon: 'Lock', disabled: true },
  { label: 'Relatórios', icon: 'FileText' },
];

const tabsDocsDescription =
  'Organizar conteúdos relacionados em seções navegáveis, permitindo alternar entre diferentes views sem sair do contexto da página.';

const meta: Meta<TabsComponent> = {
  title: 'Terra-DS/Layout & Structure/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: tabsDocsDescription,
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <lib-tabs
        [tabs]="tabs"
        [selected]="selected"
        (selectedChange)="selected = $event"
      ></lib-tabs>
    `,
  }),
  argTypes: {
    selected: {
      control: { type: 'number', min: 0 },
      table: { defaultValue: { summary: '0' } },
    },
    tabs: {
      control: 'object',
    },
  },
  args: {
    tabs: SAMPLE_TABS,
    selected: 0,
  },
};

export default meta;
type Story = StoryObj<TabsComponent>;

export const Default: Story = {
  name: 'Padrão',
};

export const SegundaSelecionada: Story = {
  name: 'Segunda tab selecionada',
  args: {
    selected: 1,
  },
};

export const ComDesabilitado: Story = {
  name: 'Com tab desabilitada',
  args: {
    tabs: TABS_WITH_DISABLED,
    selected: 0,
  },
};

export const DuasTabs: Story = {
  name: 'Duas tabs',
  args: {
    tabs: [
      { label: 'Visão geral', icon: 'Eye' },
      { label: 'Detalhes', icon: 'ListBullets' },
    ],
    selected: 0,
  },
};

export const CincoTabs: Story = {
  name: 'Cinco tabs',
  args: {
    tabs: [
      { label: 'Home', icon: 'House' },
      { label: 'Perfil', icon: 'User' },
      { label: 'Mensagens', icon: 'ChatCircle' },
      { label: 'Favoritos', icon: 'Heart' },
      { label: 'Ajuda', icon: 'Question' },
    ],
    selected: 0,
  },
};

export const ComConteudo: Story = {
  name: 'Com conteúdo por tab',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      selected: 0,
      tabs: SAMPLE_TABS,
      contents: [
        'Aqui ficam os gráficos e métricas do Dashboard. Visão geral do sistema com KPIs, totais e tendências.',
        'Gestão de usuários: listagem, criação, edição e permissões de acesso ao sistema.',
        'Ajuste as preferências do sistema: notificações, integrações, segurança e personalização.',
        'Relatórios detalhados com filtros por período, exportação em PDF e dados consolidados.',
      ],
    },
    template: `
      <div>
        <lib-tabs
          [tabs]="tabs"
          [selected]="selected"
          (selectedChange)="selected = $event"
        ></lib-tabs>
        <div style="
          margin-top: 0;
          padding: 24px;
          border: 1px solid var(--color-stroke-frame);
          
          border-radius: 0 0 8px 8px;
          color: var(--color-text-essential-heading);
          font-family: 'Geologica', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          min-height: 80px;
        ">
          <strong>{{ tabs[selected].label }}</strong>
          <p style="margin: 8px 0 0;">{{ contents[selected] }}</p>
        </div>
      </div>
    `,
  }),
};
