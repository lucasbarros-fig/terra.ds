import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import {
  ToggleGroupComponent,
  type ToggleGroupOption,
  type ToggleGroupOptionIcon,
  type ToggleGroupOptionIconText,
  type ToggleGroupOptionText,
} from './toggle-group.component';

const ICON_OPTION: ToggleGroupOptionIcon = {
  id: 'align-left',
  content: 'icon',
  icon: 'TextAlignLeft',
  ariaLabel: 'Alinhar à esquerda',
};

const TEXT_OPTION: ToggleGroupOptionText = {
  id: 'option-a',
  content: 'text',
  label: 'Opção A',
};

const ICON_TEXT_OPTION: ToggleGroupOptionIconText = {
  id: 'option-b',
  content: 'icon-text',
  icon: 'Star',
  label: 'Opção B',
};

const DISABLED_OPTION: ToggleGroupOptionText = {
  id: 'option-c',
  content: 'text',
  label: 'Opção C',
  disabled: true,
};

const ALL_OPTIONS: readonly ToggleGroupOption[] = [
  ICON_OPTION,
  TEXT_OPTION,
  ICON_TEXT_OPTION,
  DISABLED_OPTION,
];

describe('ToggleGroupComponent', () => {
  let component: ToggleGroupComponent;
  let fixture: ComponentFixture<ToggleGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToggleGroupComponent],
    });
    fixture = TestBed.createComponent(ToggleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default inputs to empty values and disabled=false', () => {
    expect(component.ariaLabel).toBe('');
    expect(component.options).toEqual([]);
    expect(component.selectedIds).toEqual([]);
    expect(component.disabled).toBe(false);
  });

  describe('isSelected', () => {
    it('should return true when id is in selectedIds', () => {
      fixture.componentRef.setInput('selectedIds', ['align-left']);
      fixture.detectChanges();

      expect(component.isSelected('align-left')).toBe(true);
    });

    it('should return false when id is not in selectedIds', () => {
      fixture.componentRef.setInput('selectedIds', ['align-left']);
      fixture.detectChanges();

      expect(component.isSelected('option-a')).toBe(false);
    });
  });

  describe('tabindexFor', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', ALL_OPTIONS);
      fixture.detectChanges();
    });

    it('should return -1 when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.tabindexFor(ICON_OPTION)).toBe(-1);
    });

    it('should return -1 when option is disabled', () => {
      expect(component.tabindexFor(DISABLED_OPTION)).toBe(-1);
    });

    it('should return 0 for selected option when selection exists', () => {
      fixture.componentRef.setInput('selectedIds', ['align-left']);
      fixture.detectChanges();

      expect(component.tabindexFor(ICON_OPTION)).toBe(0);
      expect(component.tabindexFor(TEXT_OPTION)).toBe(-1);
    });

    it('should return 0 for first active option when nothing is selected', () => {
      fixture.componentRef.setInput('selectedIds', []);
      fixture.detectChanges();

      expect(component.tabindexFor(ICON_OPTION)).toBe(0);
      expect(component.tabindexFor(TEXT_OPTION)).toBe(-1);
    });
  });

  describe('iconColorFor', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', ALL_OPTIONS);
      fixture.detectChanges();
    });

    it('should return essential-disabled when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.iconColorFor(ICON_OPTION)).toBe('essential-disabled');
    });

    it('should return essential-disabled when option is disabled', () => {
      expect(component.iconColorFor(DISABLED_OPTION)).toBe('essential-disabled');
    });

    it('should return essential-high when option is selected', () => {
      fixture.componentRef.setInput('selectedIds', ['align-left']);
      fixture.detectChanges();

      expect(component.iconColorFor(ICON_OPTION)).toBe('essential-high');
    });

    it('should return essential-medium when option is not selected', () => {
      fixture.componentRef.setInput('selectedIds', []);
      fixture.detectChanges();

      expect(component.iconColorFor(ICON_OPTION)).toBe('essential-medium');
    });
  });

  describe('onOptionClick', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', ALL_OPTIONS);
      fixture.detectChanges();
    });

    it('should emit [option.id] via selectedIdsChange when option clicked', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      component.onOptionClick(TEXT_OPTION);

      expect(spy).toHaveBeenCalledWith(['option-a']);
    });

    it('should not emit when component is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      component.onOptionClick(TEXT_OPTION);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit when option is disabled', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      component.onOptionClick(DISABLED_OPTION);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onOptionKeydown', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', [
        ICON_OPTION,
        TEXT_OPTION,
        ICON_TEXT_OPTION,
      ]);
      fixture.detectChanges();
    });

    it('should select option on Space key', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.onOptionKeydown(event, TEXT_OPTION);

      expect(spy).toHaveBeenCalledWith(['option-a']);
    });

    it('should select option on Enter key', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onOptionKeydown(event, ICON_OPTION);

      expect(spy).toHaveBeenCalledWith(['align-left']);
    });

    it('should advance to next option on ArrowRight', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onOptionKeydown(event, ICON_OPTION);

      expect(spy).toHaveBeenCalledWith(['option-a']);
    });

    it('should advance to next option on ArrowDown', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onOptionKeydown(event, ICON_OPTION);

      expect(spy).toHaveBeenCalledWith(['option-a']);
    });

    it('should go back to previous option on ArrowLeft', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onOptionKeydown(event, TEXT_OPTION);

      expect(spy).toHaveBeenCalledWith(['align-left']);
    });

    it('should go back to previous option on ArrowUp', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onOptionKeydown(event, ICON_TEXT_OPTION);

      expect(spy).toHaveBeenCalledWith(['option-a']);
    });

    it('should wrap around from last to first on ArrowRight', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onOptionKeydown(event, ICON_TEXT_OPTION);

      expect(spy).toHaveBeenCalledWith(['align-left']);
    });

    it('should wrap around from first to last on ArrowLeft', () => {
      const spy = vi.fn();
      component.selectedIdsChange.subscribe(spy);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onOptionKeydown(event, ICON_OPTION);

      expect(spy).toHaveBeenCalledWith(['option-b']);
    });
  });

  describe('showsIcon and showsLabel', () => {
    it('should show icon for icon content type', () => {
      expect(component.showsIcon(ICON_OPTION)).toBe(true);
      expect(component.showsLabel(ICON_OPTION)).toBe(false);
    });

    it('should show label for text content type', () => {
      expect(component.showsIcon(TEXT_OPTION)).toBe(false);
      expect(component.showsLabel(TEXT_OPTION)).toBe(true);
    });

    it('should show both icon and label for icon-text content type', () => {
      expect(component.showsIcon(ICON_TEXT_OPTION)).toBe(true);
      expect(component.showsLabel(ICON_TEXT_OPTION)).toBe(true);
    });
  });

  describe('optionAriaLabel', () => {
    it('should return the ariaLabel for icon-only options', () => {
      expect(component.optionAriaLabel(ICON_OPTION)).toBe('Alinhar à esquerda');
    });

    it('should return explicit ariaLabel for text options when set', () => {
      const opt: ToggleGroupOptionText = { id: 'x', content: 'text', label: 'X', ariaLabel: 'Opção X' };
      expect(component.optionAriaLabel(opt)).toBe('Opção X');
    });

    it('should return null for text options without explicit ariaLabel', () => {
      expect(component.optionAriaLabel(TEXT_OPTION)).toBeNull();
    });
  });

  describe('DOM', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', [ICON_OPTION, TEXT_OPTION, DISABLED_OPTION]);
      fixture.componentRef.setInput('selectedIds', ['align-left']);
      fixture.detectChanges();
    });

    it('should render a radiogroup with correct aria-label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Alinhamento');
      fixture.detectChanges();

      const group: HTMLElement | null = fixture.nativeElement.querySelector('[role="radiogroup"]');
      expect(group).toBeTruthy();
      expect(group?.getAttribute('aria-label')).toBe('Alinhamento');
    });

    it('should render correct number of option buttons', () => {
      const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button[role="radio"]');
      expect(buttons.length).toBe(3);
    });

    it('should set aria-checked on selected button', () => {
      const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button[role="radio"]');
      expect(buttons[0].getAttribute('aria-checked')).toBe('true');
      expect(buttons[1].getAttribute('aria-checked')).toBe('false');
    });

    it('should disable the button when option is disabled', () => {
      const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button[role="radio"]');
      expect(buttons[2].hasAttribute('disabled')).toBe(true);
    });
  });
});
