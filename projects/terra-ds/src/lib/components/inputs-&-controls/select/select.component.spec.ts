import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, type SelectOption } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  const mockOptions: SelectOption[] = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c', disabled: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponent],
    });
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getField(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.field');
  }

  function getHelper(): HTMLElement | null {
    return fixture.nativeElement.querySelector('lib-helper');
  }

  function getLabel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('lib-label');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholder when no option is selected', () => {
    fixture.componentRef.setInput('placeholder', 'Choose an option');
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    const control = fixture.nativeElement.querySelector('.control');
    expect(control?.textContent?.trim()).toBe('Choose an option');
  });

  it('should display the selected option label', () => {
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    component.writeValue('a');
    fixture.detectChanges();

    const control = fixture.nativeElement.querySelector('.control');
    expect(control?.textContent?.trim()).toBe('Option A');
    expect(component.displayValue()).toBe('Option A');
    expect(component.hasValue()).toBe(true);
  });

  it('should emit selectionChange when onSelect is called', () => {
    const spy = vi.fn();
    component.selectionChange.subscribe(spy);
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    component['onSelect'](mockOptions[0]);

    expect(spy).toHaveBeenCalledWith('a');
  });

  it('should call onChange when onSelect is called', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    component['onSelect'](mockOptions[1]);

    expect(spy).toHaveBeenCalledWith('b');
  });

  it('should set selectedOption to null when writeValue receives null', () => {
    fixture.componentRef.setInput('options', mockOptions);
    component.writeValue('a');
    fixture.detectChanges();

    expect(component['selectedOption']()?.value).toBe('a');

    component.writeValue(null);
    fixture.detectChanges();

    expect(component['selectedOption']()).toBeNull();
    expect(component.displayValue()).toBe('');
    expect(component.hasValue()).toBe(false);
  });

  it('should set selectedOption to null when writeValue receives undefined', () => {
    fixture.componentRef.setInput('options', mockOptions);
    component.writeValue('a');
    fixture.detectChanges();

    component.writeValue(undefined);
    fixture.detectChanges();

    expect(component['selectedOption']()).toBeNull();
  });

  it('should add error class to field when error input is true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();

    const field = getField();
    expect(field?.classList.contains('error')).toBe(true);
  });

  it('should not add error class to field when error is false', () => {
    fixture.componentRef.setInput('error', false);
    fixture.detectChanges();

    const field = getField();
    expect(field?.classList.contains('error')).toBe(false);
  });

  it('should add disabled class to field when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const field = getField();
    expect(field?.classList.contains('disabled')).toBe(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('should render helper text when helperText is provided', () => {
    fixture.componentRef.setInput('helperText', 'Este campo é obrigatório');
    fixture.detectChanges();

    const helper = getHelper();
    expect(helper).toBeTruthy();
    expect(component.helperText()).toBe('Este campo é obrigatório');
  });

  it('should use negative helper color when error is true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.componentRef.setInput('helperText', 'Inválido');
    fixture.detectChanges();

    expect(component.resolvedHelperColor()).toBe('negative');
  });

  it('should use provided helper color when error is false', () => {
    fixture.componentRef.setInput('error', false);
    fixture.componentRef.setInput('helperText', 'Info');
    fixture.componentRef.setInput('helperColor', 'warning');
    fixture.detectChanges();

    expect(component.resolvedHelperColor()).toBe('warning');
  });

  it('should call onTouched when focus leaves the host', () => {
    const spy = vi.fn();
    component.registerOnTouched(spy);

    component['onHostFocusOut'](new FocusEvent('focusout', { relatedTarget: document.body }));

    expect(spy).toHaveBeenCalled();
  });

  it('should not call onTouched when focus moves within the host', () => {
    const spy = vi.fn();
    component.registerOnTouched(spy);

    const button = getField();
    component['onHostFocusOut'](new FocusEvent('focusout', { relatedTarget: button }));

    expect(spy).not.toHaveBeenCalled();
  });

  it('should set aria-invalid when error is true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();

    const field = getField();
    expect(field?.getAttribute('aria-invalid')).toBe('true');
  });

  it('should not set aria-invalid when error is false', () => {
    fixture.componentRef.setInput('error', false);
    fixture.detectChanges();

    const field = getField();
    expect(field?.getAttribute('aria-invalid')).toBeNull();
  });

  it('should set disabled state from ControlValueAccessor', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.isDisabled()).toBe(true);
    const field = getField();
    expect(field?.classList.contains('disabled')).toBe(true);
  });

  it('should render label when label input is provided', () => {
    fixture.componentRef.setInput('label', 'Escolha uma opção');
    fixture.detectChanges();

    const label = getLabel();
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Escolha uma opção');
  });

  it('should render icon when iconBefore is set', () => {
    fixture.componentRef.setInput('iconBefore', 'Search');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('lib-icon');
    expect(icon).toBeTruthy();
  });

  it('should set aria-label from selectAriaLabel', () => {
    fixture.componentRef.setInput('selectAriaLabel', 'Selecione uma fruta');
    fixture.detectChanges();

    const field = getField();
    expect(field?.getAttribute('aria-label')).toBe('Selecione uma fruta');
  });

  it('should fallback aria-label to label when selectAriaLabel is not provided', () => {
    fixture.componentRef.setInput('label', 'Fruta');
    fixture.detectChanges();

    const field = getField();
    expect(field?.getAttribute('aria-label')).toBe('Fruta');
  });

  it('should not set aria-label when neither selectAriaLabel nor label is provided', () => {
    fixture.componentRef.setInput('selectAriaLabel', '');
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();

    const field = getField();
    expect(field?.getAttribute('aria-label')).toBeNull();
  });

  it('should apply outlined class when variant is outlined', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();

    const field = getField();
    expect(field?.classList.contains('outlined')).toBe(true);
  });

  it('should not apply outlined class when variant is underline', () => {
    fixture.componentRef.setInput('variant', 'underline');
    fixture.detectChanges();

    const field = getField();
    expect(field?.classList.contains('outlined')).toBe(false);
  });

  it('should add has-value class when an option is selected', () => {
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    component.writeValue('a');
    fixture.detectChanges();

    const field = getField();
    expect(field?.classList.contains('has-value')).toBe(true);
  });

  it('should show lock icon when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const lockIcon = fixture.nativeElement.querySelector('lib-icon');
    expect(lockIcon).toBeTruthy();
  });

  it('should keep searchable off by default and expose all options', () => {
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    expect(component.searchable()).toBe(false);
    expect(component.noResultsText()).toBe('Nenhum item encontrado');
    expect(fixture.nativeElement.querySelector('input.select.control')).toBeNull();
    expect(getField()?.tagName).toBe('BUTTON');
    expect(component.filteredOptions()).toEqual(mockOptions);
  });

  it('should render the trigger as a text input when searchable', () => {
    fixture.componentRef.setInput('searchable', true);
    fixture.componentRef.setInput('placeholder', 'Selecione');
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input.select.control') as HTMLInputElement | null;
    expect(input).toBeTruthy();
    expect(getField()?.tagName).toBe('DIV');
    expect(input?.placeholder).toBe('Selecione');
  });

  it('should filter options by label in a case-insensitive way', () => {
    fixture.componentRef.setInput('searchable', true);
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    component.searchQuery.set('option a');
    fixture.detectChanges();

    expect(component.filteredOptions()).toEqual([mockOptions[0]]);
    expect(component.hasNoFilteredResults()).toBe(false);
  });

  it('should show empty-state flag when the query matches no option', () => {
    fixture.componentRef.setInput('searchable', true);
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    component.searchQuery.set('xyz');
    fixture.detectChanges();

    expect(component.filteredOptions()).toEqual([]);
    expect(component.hasNoFilteredResults()).toBe(true);
  });

  describe('panel interaction', () => {
    function getSearchInput(): HTMLInputElement {
      return fixture.nativeElement.querySelector('input.select.control');
    }

    function getPanel(): HTMLElement | null {
      return document.querySelector('.terra-dropdown__panel');
    }

    function getPanelLabels(): string[] {
      return Array.from(
        document.querySelectorAll('.terra-dropdown__panel .terra-dropdown-item'),
      ).map((el) => el.textContent?.trim() ?? '');
    }

    function setupSearchable(inputs: Record<string, unknown> = {}): void {
      fixture.componentRef.setInput('searchable', true);
      fixture.componentRef.setInput('options', mockOptions);
      for (const [key, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(key, value);
      }
      fixture.detectChanges();
    }

    function typeInSearch(value: string): void {
      const input = getSearchInput();
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    function click(el: Element | null): void {
      (el as HTMLElement).click();
      fixture.detectChanges();
    }

    function keydown(el: Element, key: string): void {
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      fixture.detectChanges();
    }

    it('should open the panel and list only matching options while typing', () => {
      setupSearchable();

      typeInSearch('option a');

      expect(component.isOpen()).toBe(true);
      expect(getPanelLabels()).toEqual(['Option A']);
    });

    it('should show the no-results message outside the option list', () => {
      setupSearchable();

      typeInSearch('xyz');

      const empty = getPanel()?.querySelector('.select-empty');
      expect(getPanelLabels()).toEqual([]);
      expect(empty?.textContent?.trim()).toBe('Nenhum item encontrado');
      expect(empty?.getAttribute('aria-hidden')).toBe('true');
      expect(empty?.hasAttribute('role')).toBe(false);
    });

    it('should use a custom noResultsText', () => {
      setupSearchable({ noResultsText: 'Nada por aqui' });

      typeInSearch('xyz');

      expect(getPanel()?.querySelector('.select-empty')?.textContent?.trim()).toBe(
        'Nada por aqui',
      );
    });

    it('should announce the no-results message once per empty result', () => {
      const announce = vi
        .spyOn(TestBed.inject(LiveAnnouncer), 'announce')
        .mockResolvedValue(undefined);
      setupSearchable();

      typeInSearch('option');
      typeInSearch('xy');
      typeInSearch('xyz');

      expect(announce).toHaveBeenCalledTimes(1);
      expect(announce).toHaveBeenCalledWith('Nenhum item encontrado');
    });

    it('should select a filtered option, close the panel and show its label', () => {
      const spy = vi.fn();
      component.registerOnChange(spy);
      setupSearchable();

      typeInSearch('option b');
      click(document.querySelector('.terra-dropdown__panel .terra-dropdown-item'));

      expect(spy).toHaveBeenCalledWith('b');
      expect(component.isOpen()).toBe(false);
      expect(component.searchQuery()).toBe('');
      expect(getSearchInput().value).toBe('Option B');
    });

    it('should close on Escape, keep focus in the field and clear the query', () => {
      setupSearchable();
      const input = getSearchInput();
      input.focus();

      typeInSearch('option a');
      keydown(input, 'Escape');

      expect(component.isOpen()).toBe(false);
      expect(getPanel()).toBeNull();
      expect(component.searchQuery()).toBe('');
      expect(document.activeElement).toBe(input);

      click(input);

      expect(component.isOpen()).toBe(true);
      expect(input.value).toBe('');
      expect(getPanelLabels()).toEqual(['Option A', 'Option B', 'Option C']);
    });

    it('should clear the query when the panel is closed through the chevron', () => {
      setupSearchable();
      const chevron = fixture.nativeElement.querySelector('.chevron-btn');

      typeInSearch('option b');
      click(chevron);

      expect(component.isOpen()).toBe(false);
      expect(component.searchQuery()).toBe('');

      click(chevron);

      expect(component.isOpen()).toBe(true);
      expect(getSearchInput().value).toBe('');
      expect(getPanelLabels()).toHaveLength(3);
    });

    it('should keep the same placeholder while the panel is open', () => {
      setupSearchable({ placeholder: 'Selecione o banco' });

      click(getSearchInput());

      expect(component.isOpen()).toBe(true);
      expect(getSearchInput().placeholder).toBe('Selecione o banco');
    });

    it('should keep the panel open when the field is clicked again', () => {
      setupSearchable({ iconBefore: 'Search' });

      click(getSearchInput());
      expect(component.isOpen()).toBe(true);

      click(fixture.nativeElement.querySelector('.field > lib-icon'));
      expect(component.isOpen()).toBe(true);
    });

    it('should not open when disabled and the field area is clicked', () => {
      setupSearchable({ iconBefore: 'Search', disabled: true });

      click(fixture.nativeElement.querySelector('.field > lib-icon'));

      expect(component.isOpen()).toBe(false);
      expect(getPanel()).toBeNull();
    });

    it('should open and move focus to the first option on ArrowDown when closed', async () => {
      setupSearchable();
      const input = getSearchInput();
      input.focus();

      keydown(input, 'ArrowDown');
      await Promise.resolve();

      expect(component.isOpen()).toBe(true);
      expect(document.activeElement?.textContent?.trim()).toBe('Option A');
    });

    it('should move focus to the last enabled option on ArrowUp when open', () => {
      setupSearchable();
      const input = getSearchInput();

      click(input);
      keydown(input, 'ArrowUp');

      expect(document.activeElement?.textContent?.trim()).toBe('Option B');
    });

    it('should expose combobox ARIA on the input instead of the wrapper', () => {
      setupSearchable();
      const input = getSearchInput();
      const wrapper: HTMLElement = fixture.nativeElement.querySelector('.select-trigger');

      expect(input.getAttribute('role')).toBe('combobox');
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(input.getAttribute('aria-controls')).toBeNull();
      expect(wrapper.hasAttribute('aria-expanded')).toBe(false);
      expect(wrapper.hasAttribute('aria-haspopup')).toBe(false);
      expect(wrapper.hasAttribute('aria-controls')).toBe(false);

      click(input);

      expect(input.getAttribute('aria-expanded')).toBe('true');
      expect(input.getAttribute('aria-controls')).toBe(getPanel()?.id);
    });

    it('should expose listbox ARIA on the button when not searchable', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();
      const button = getField() as HTMLButtonElement;

      expect(button.getAttribute('aria-haspopup')).toBe('listbox');
      expect(button.getAttribute('aria-expanded')).toBe('false');

      click(button);

      expect(component.isOpen()).toBe(true);
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(button.getAttribute('aria-controls')).toBe(getPanel()?.id);
    });
  });
});
