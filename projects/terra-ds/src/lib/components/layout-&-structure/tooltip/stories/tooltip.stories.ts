import type { Meta, StoryObj } from '@storybook/angular';
import { TooltipComponent } from '../tooltip.component';
import { ICON_COLOR_TOKEN_NAMES, solarisIconTypes } from '../../icon/utils/theme';

const ARROW_OPTIONS = ['start', 'middle', 'end'] as const;
const INDICATOR_OPTIONS = ['top', 'bottom', 'right', 'left'] as const;

const STORY_TOOLTIP_TEXT =
  'Aqui estão diversas opções de textos e conteúdos para testar componentes frontend, organizados por cenário de uso (UI, formulários, estados de erro, acessibilidade), garantindo que seu componente seja robusto.';

const STORY_MEDIA_URL =
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExN20xZGltZzk4Y2wxZWhlN2pqM3FiaXBxbXM5bjVobWpvYm9qdjZsbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/139eZBmH1HTyRa/giphy.gif';

const PUBLIC_INPUTS = [
  'arrow',
  'indicator',
  'text',
  'triggerIcon',
  'triggerIconColor',
  'media',
  'mediaAlt',
] as const;

const tooltipDocsDescription =
  'Exibe informações adicionais de forma contextual e temporária ao interagir com um elemento, como ao passar o cursor ou focar. É utilizado para esclarecer ações, descrever funcionalidades ou fornecer orientações rápidas sem ocupar espaço na interface.';

const defaultArgs: Meta<TooltipComponent>['args'] = {
  arrow: 'middle',
  indicator: 'top',
  text: STORY_TOOLTIP_TEXT,
  triggerIcon: 'Info',
  triggerIconColor: 'inherit',
  media: null,
  mediaAlt: '',
};

const meta: Meta<TooltipComponent> = {
  title: 'Terra-DS/Layout & Structure/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],
  args: { ...defaultArgs },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: tooltipDocsDescription,
      },
      controls: { include: [...PUBLIC_INPUTS] },
      story: { iframeHeight: 480, inline: true },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="min-height:340px;display:flex;align-items:center;justify-content:center;padding:32px;">
        <lib-tooltip
          [arrow]="arrow"
          [indicator]="indicator"
          [text]="text"
          [triggerIcon]="triggerIcon"
          [triggerIconColor]="triggerIconColor"
          [media]="media"
          [mediaAlt]="mediaAlt"
        ></lib-tooltip>
      </div>
    `,
  }),
  argTypes: {
    arrow: {
      control: { type: 'select' },
      options: ARROW_OPTIONS,
    },
    indicator: {
      control: { type: 'select' },
      options: INDICATOR_OPTIONS,
    },
    text: {
      control: { type: 'text' },
    },
    media: {
      control: { type: 'text' },
      table: { defaultValue: { summary: 'null' } },
    },
    triggerIcon: {
      control: { type: 'select' },
      options: [...solarisIconTypes],
      table: { defaultValue: { summary: "'Info'" } },
    },
    triggerIconColor: {
      control: { type: 'select' },
      options: ['inherit', ...ICON_COLOR_TOKEN_NAMES],
      table: { defaultValue: { summary: "'inherit'" } },
    },
    mediaAlt: {
      control: { type: 'text' },
    },
    ...({
      onContainerEnter: { table: { disable: true } },
      onContainerLeave: { table: { disable: true } },
      ngOnDestroy: { table: { disable: true } },
      ngAfterContentInit: { table: { disable: true } },
      caretViewBox: { table: { disable: true } },
      caretFillPath: { table: { disable: true } },
      caretStrokePath: { table: { disable: true } },
    } as Record<string, unknown>),
  },
};

export default meta;
type Story = StoryObj<TooltipComponent>;

export const Default: Story = {};

export const ComMidia: Story = {
  name: 'Com mídia',
  args: {
    arrow: 'middle',
    indicator: 'top',
    text: 'Tooltip',
    media: STORY_MEDIA_URL,
    mediaAlt: 'Demonstração',
  },
};

export const TriggerCustomBotao: Story = {
  name: 'Trigger custom (botão)',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="min-height:340px;display:flex;align-items:center;justify-content:center;padding:32px;">
        <lib-tooltip indicator="top" arrow="middle" text="Abre uma modal de mídia.">
          <button type="button" style="padding:6px 12px;border-radius:6px;border:1px solid #2e353a;background:#141619;color:#fff;cursor:pointer;">
            Mídia
          </button>
        </lib-tooltip>
      </div>
    `,
  }),
};

export const TriggerCustomTexto: Story = {
  name: 'Trigger custom (texto)',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="min-height:340px;display:flex;align-items:center;justify-content:center;padding:32px;">
        <span style="display:inline-flex;align-items:center;gap:6px;color:#fff;">
          Saber mais
          <lib-tooltip
            indicator="top"
            arrow="middle"
            text="Texto explicativo do tooltip."
          >
            <span style="text-decoration:underline dotted;cursor:help;">aqui</span>
          </lib-tooltip>
        </span>
      </div>
    `,
  }),
};

export const TriggerCustomComMidia: Story = {
  name: 'Trigger custom + mídia',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { mediaUrl: STORY_MEDIA_URL },
    template: `
      <div style="min-height:420px;display:flex;align-items:center;justify-content:center;padding:32px;">
        <lib-tooltip
          indicator="top"
          arrow="middle"
          text="Tooltip"
          [media]="mediaUrl"
          mediaAlt="Demonstração"
        >
          <button type="button" style="padding:6px 12px;border-radius:6px;border:1px solid #2e353a;background:#141619;color:#fff;cursor:pointer;">
            Mídia
          </button>
        </lib-tooltip>
      </div>
    `,
  }),
};

function indicatorArrowRowStory(
  indicator: 'top' | 'bottom' | 'left' | 'right',
  storyName: string,
): Story {
  return {
    name: storyName,
    parameters: {
      controls: { disable: true },
      docs: { story: { iframeHeight: 520, inline: true } },
    },
    render: () => ({
      template: `
      <div style="min-height:420px;display:grid;grid-template-columns:repeat(3,minmax(260px,1fr));gap:32px;padding:48px;justify-items:center;align-items:center;">
        <lib-tooltip arrow="start" indicator="${indicator}" text="${STORY_TOOLTIP_TEXT}"></lib-tooltip>
        <lib-tooltip arrow="middle" indicator="${indicator}" text="${STORY_TOOLTIP_TEXT}"></lib-tooltip>
        <lib-tooltip arrow="end" indicator="${indicator}" text="${STORY_TOOLTIP_TEXT}"></lib-tooltip>
      </div>
    `,
    }),
  };
}

export const IndicatorLeft = indicatorArrowRowStory(
  'left',
  'Indicator left com arrow start/middle/end',
);

export const IndicatorTop = indicatorArrowRowStory(
  'top',
  'Indicator top com arrow start/middle/end',
);

export const IndicatorBottom = indicatorArrowRowStory(
  'bottom',
  'Indicator bottom com arrow start/middle/end',
);

export const IndicatorRight = indicatorArrowRowStory(
  'right',
  'Indicator right com arrow start/middle/end',
);
