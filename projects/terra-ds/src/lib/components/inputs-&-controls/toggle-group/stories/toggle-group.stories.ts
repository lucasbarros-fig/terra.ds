import {
  Component,
  Input,
  type OnChanges,
  type OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';

import {
  ToggleGroupComponent,
  type ToggleGroupOption,
} from '../toggle-group.component';

const DEMO_OPTIONS_ICON: ToggleGroupOption[] = [
  { id: 'list',    content: 'icon', icon: 'List',     ariaLabel: 'Vista em lista' },
  { id: 'grid',    content: 'icon', icon: 'GridFour', ariaLabel: 'Vista em grelha' },
  { id: 'columns', content: 'icon', icon: 'Columns',  ariaLabel: 'Vista em colunas' },
];

const DEMO_OPTIONS_TEXT: ToggleGroupOption[] = [
  { id: 'dia',    content: 'text', label: 'Dia' },
  { id: 'semana', content: 'text', label: 'Semana' },
  { id: 'mes',    content: 'text', label: 'Mês' },
];

const DEMO_OPTIONS_ICON_TEXT: ToggleGroupOption[] = [
  { id: 'list',    content: 'icon-text', icon: 'List',     label: 'Lista' },
  { id: 'grid',    content: 'icon-text', icon: 'GridFour', label: 'Grelha' },
  { id: 'columns', content: 'icon-text', icon: 'Columns',  label: 'Colunas' },
];

const DEMO_OPTIONS_MIXED: ToggleGroupOption[] = [
  { id: 'list', content: 'icon',      icon: 'List',     ariaLabel: 'Só ícone' },
  { id: 'tab',  content: 'text',      label: 'Só texto' },
  { id: 'grid', content: 'icon-text', icon: 'GridFour', label: 'Ícone + texto' },
];

function applySelectedIdsFromStorybookChange(
  localSelectedIds: string[],
  change: SimpleChange | undefined,
): string[] {
  if (!change) return localSelectedIds;
  const next = change.currentValue;
  if (!Array.isArray(next)) return localSelectedIds;
  if (change.isFirstChange()) return [...next];
  const prev = change.previousValue;
  const sameAsPrevious =
    Array.isArray(prev) &&
    prev.length === next.length &&
    prev.every((id, i) => id === next[i]);
  if (sameAsPrevious) return localSelectedIds;
  return [...next];
}

@Component({
  selector: 'lib-story-toggle-group-wrapper',
  standalone: true,
  imports: [ToggleGroupComponent],
  template: `
    <lib-toggle-group
      [ariaLabel]="ariaLabel"
      [options]="options"
      [selectedIds]="localSelectedIds"
      [disabled]="disabled"
      (selectedIdsChange)="localSelectedIds = $event"
    ></lib-toggle-group>
  `,
})
class ToggleGroupWrapperComponent implements OnChanges, OnInit {
  @Input() ariaLabel = '';
  @Input() options: readonly ToggleGroupOption[] = [];
  @Input() selectedIds: readonly string[] = [];
  @Input() disabled = false;

  localSelectedIds: string[] = [];

  ngOnInit(): void {
    this.localSelectedIds = [...this.selectedIds];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIds']) {
      this.localSelectedIds = applySelectedIdsFromStorybookChange(
        this.localSelectedIds,
        changes['selectedIds'],
      );
    }
  }
}

const toggleGroupDocsDescription = `
**Toggle** — Permite alternar rapidamente entre dois estados, como ativo e inativo, representando mudanças diretas de configuração ou comportamento. Oferece feedback visual imediato ao usuário, tornando a interação simples e intuitiva.

**Toggle Group** — Organiza múltiplos toggles em um conjunto, permitindo selecionar uma ou mais opções dentro de um mesmo contexto. Pode funcionar com seleção única ou múltipla, facilitando a escolha entre alternativas de forma estruturada e visualmente consistente.

**Não use como um Checkbox.**
`.trim();

const meta: Meta<ToggleGroupWrapperComponent> = {
  title: 'Terra-DS/Inputs & Controls/Toggle Group',
  component: ToggleGroupWrapperComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: {
      description: {
        component: toggleGroupDocsDescription,
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Rótulo do grupo para leitores de ecrã.',
      table: { category: 'Acessibilidade' },
    },
    options: {
      control: 'object',
      description: 'Lista de opções (discriminada por `content`: `icon` | `text` | `icon-text`).',
      table: { category: 'Dados' },
    },
    selectedIds: {
      control: 'object',
      description: 'Ids das opções selecionadas (estado inicial).',
      table: { category: 'Dados' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desativa o grupo inteiro.',
      table: { category: 'Estado' },
    },
  },
  args: {
    ariaLabel:   'Alternar vista do conteúdo',
    options:     DEMO_OPTIONS_ICON,
    selectedIds: ['list'],
    disabled:    false,
  },
};

export default meta;
type Story = StoryObj<ToggleGroupWrapperComponent>;

export const Icones: Story = {
  name: 'Ícones',
  parameters: {
    docs: { description: { story: 'Opções compostas apenas por ícone. Cada opção exige `ariaLabel`.' } },
  },
  args: {
    ariaLabel:   'Alternar vista do conteúdo',
    options:     DEMO_OPTIONS_ICON,
    selectedIds: ['list'],
    disabled:    false,
  },
};

export const SoTexto: Story = {
  name: 'Só texto',
  parameters: {
    docs: { description: { story: 'Opções compostas apenas por rótulo de texto.' } },
  },
  args: {
    ariaLabel:     'Período',
    options:       DEMO_OPTIONS_TEXT,
    selectedIds:   ['semana'],
    disabled:      false,
  },
};

export const IconeETexto: Story = {
  name: 'Ícone + texto',
  parameters: {
    docs: { description: { story: 'Opções com ícone e rótulo de texto em simultâneo.' } },
  },
  args: {
    ariaLabel:     'Alternar vista do conteúdo',
    options:       DEMO_OPTIONS_ICON_TEXT,
    selectedIds:   ['grid'],
    disabled:      false,
  },
};

export const Misto: Story = {
  name: 'Misto (ícone, texto, ícone+texto)',
  parameters: {
    docs: { description: { story: 'Demonstra que o grupo suporta os três tipos de opção lado a lado.' } },
  },
  args: {
    ariaLabel:     'Tipos de opção',
    options:       DEMO_OPTIONS_MIXED,
    selectedIds:   ['tab'],
    disabled:      false,
  },
};

export const Desabilitado: Story = {
  name: 'Desabilitado',
  parameters: {
    docs: {
      description: {
        story: 'Com `disabled=true`, todos os botões ficam inoperáveis. Os itens selecionados mantêm o fundo de seleção; ícones e texto usam tokens de desabilitado.',
      },
    },
  },
  args: {
    ariaLabel:     'Alternar vista do conteúdo',
    options:       DEMO_OPTIONS_ICON,
    selectedIds:   ['grid'],
    disabled:      true,
  },
};
