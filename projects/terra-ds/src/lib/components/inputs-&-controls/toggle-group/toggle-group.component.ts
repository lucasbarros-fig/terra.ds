import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  IconComponent,
  type IconNameType,
} from '../../layout-&-structure/icon/icon.component';
import type { IconColorType } from '../../layout-&-structure/icon/utils/theme';

export type ToggleGroupOptionBase = {
  id: string;
  disabled?: boolean;
};

export type ToggleGroupOptionIcon = ToggleGroupOptionBase & {
  content: 'icon';
  icon: IconNameType;
  ariaLabel: string;
};

export type ToggleGroupOptionText = ToggleGroupOptionBase & {
  content: 'text';
  label: string;
  ariaLabel?: string;
};

export type ToggleGroupOptionIconText = ToggleGroupOptionBase & {
  content: 'icon-text';
  icon: IconNameType;
  label: string;
  ariaLabel?: string;
};

export type ToggleGroupOption =
  | ToggleGroupOptionIcon
  | ToggleGroupOptionText
  | ToggleGroupOptionIconText;

@Component({
  selector: 'lib-toggle-group',
  templateUrl: './toggle-group.component.html',
  styleUrls: ['./toggle-group.component.scss'],
  standalone: true,
  host: { 'data-terra-ds': '' },
  imports: [NgFor, NgIf, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleGroupComponent {
  @Input() ariaLabel = '';
  @Input() options: readonly ToggleGroupOption[] = [];
  @Input() selectedIds: readonly string[] = [];
  @Input() disabled = false;

  @Output() readonly selectedIdsChange = new EventEmitter<string[]>();

  @ViewChildren('toggleBtn') private buttonRefs!: QueryList<ElementRef<HTMLButtonElement>>;

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  tabindexFor(opt: ToggleGroupOption): number {
    if (this.disabled || opt.disabled) return -1;

    const hasSelection = this.selectedIds.length > 0;
    if (hasSelection) return this.isSelected(opt.id) ? 0 : -1;

    const firstActive = this.options.find((o) => !o.disabled);
    return firstActive?.id === opt.id ? 0 : -1;
  }

  iconColorFor(option: ToggleGroupOption): IconColorType {
    if (this.disabled || option.disabled) return 'essential-disabled';
    return this.isSelected(option.id) ? 'essential-high' : 'essential-medium';
  }

  showsIcon(option: ToggleGroupOption): boolean {
    return option.content === 'icon' || option.content === 'icon-text';
  }

  showsLabel(option: ToggleGroupOption): boolean {
    return option.content === 'text' || option.content === 'icon-text';
  }

  optionIcon(option: ToggleGroupOption): IconNameType {
    if (option.content === 'icon' || option.content === 'icon-text') {
      return option.icon;
    }
    return 'List';
  }

  optionLabel(option: ToggleGroupOption): string {
    if (option.content === 'text' || option.content === 'icon-text') {
      return option.label;
    }
    return '';
  }

  optionAriaLabel(option: ToggleGroupOption): string | null {
    if (option.content === 'icon') return option.ariaLabel;
    if (option.ariaLabel) return option.ariaLabel;
    return null;
  }

  onOptionClick(option: ToggleGroupOption): void {
    if (this.disabled || option.disabled) return;

    this.selectedIdsChange.emit([option.id]);
  }

  onOptionKeydown(event: KeyboardEvent, option: ToggleGroupOption): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.onOptionClick(option);
      return;
    }

    const isNext = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const isPrev = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!isNext && !isPrev) return;

    event.preventDefault();

    const activeOptions = this.options.filter((o) => !o.disabled);
    const currentIndex = activeOptions.findIndex((o) => o.id === option.id);
    if (currentIndex === -1) return;

    const nextIndex = isNext
      ? (currentIndex + 1) % activeOptions.length
      : (currentIndex - 1 + activeOptions.length) % activeOptions.length;

    const nextOption = activeOptions[nextIndex];
    this.selectedIdsChange.emit([nextOption.id]);
    this.focusButton(nextOption.id);
  }

  private focusButton(id: string): void {
    const index = this.options.findIndex((o) => o.id === id);
    this.buttonRefs?.get(index)?.nativeElement?.focus();
  }
}