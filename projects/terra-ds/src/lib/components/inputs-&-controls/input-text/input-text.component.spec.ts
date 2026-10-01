import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextComponent } from './input-text.component';

describe('InputTextComponent', () => {
  let component: InputTextComponent;
  let fixture: ComponentFixture<InputTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputTextComponent],
    });
    fixture = TestBed.createComponent(InputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getNativeInput(): HTMLInputElement | null {
    return fixture.nativeElement.querySelector('.control');
  }

  function getField(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.field');
  }

  function getLabel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('lib-label');
  }

  function getHelper(): HTMLElement | null {
    return fixture.nativeElement.querySelector('lib-helper');
  }

  function getFieldPrefix(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.field-prefix');
  }

  function getFieldSuffix(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.field-suffix');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when label input is provided', () => {
    fixture.componentRef.setInput('label', 'Nome completo');
    fixture.detectChanges();

    const label = getLabel();
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Nome completo');
  });

  it('should not render label when label input is empty', () => {
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();

    expect(getLabel()).toBeNull();
  });

  it('should set placeholder on the native input', () => {
    fixture.componentRef.setInput('placeholder', 'Digite seu nome');
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('placeholder')).toBe('Digite seu nome');
  });

  it('should use "0,00" as default placeholder when type is currency', () => {
    fixture.componentRef.setInput('type', 'currency');
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('placeholder')).toBe('0,00');
  });

  it('should report isDisabled true and add disabled class when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(component.isDisabled).toBe(true);
    const field = getField();
    expect(field?.classList.contains('disabled')).toBe(true);
  });

  it('should set the native input to readonly when readonly input is true', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.readOnly).toBe(true);
  });

  it('should add error class to field when error is true', () => {
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

  it('should display helper text when error is true and helperText is provided', () => {
    fixture.componentRef.setInput('error', true);
    fixture.componentRef.setInput('helperText', 'Campo obrigatório');
    fixture.detectChanges();

    const helper = getHelper();
    expect(helper).toBeTruthy();
    expect(component.helperText()).toBe('Campo obrigatório');
  });

  it('should use negative color for helper when error is true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.componentRef.setInput('helperText', 'Inválido');
    fixture.detectChanges();

    expect(component.resolvedHelperColor).toBe('negative');
  });

  it('should add outlined class when variant is outlined', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();

    const field = getField();
    expect(field?.classList.contains('outlined')).toBe(true);
  });

  it('should not add outlined class when variant is underline', () => {
    fixture.componentRef.setInput('variant', 'underline');
    fixture.detectChanges();

    const field = getField();
    expect(field?.classList.contains('outlined')).toBe(false);
  });

  it('should accept value via writeValue from ControlValueAccessor', () => {
    component.writeValue('Novo valor');
    fixture.detectChanges();

    expect(component['value']).toBe('Novo valor');
  });

  it('should use empty string fallback when writeValue receives null', () => {
    component.writeValue(null);
    fixture.detectChanges();

    expect(component['value']).toBe('');
  });

  it('should use 0 fallback when writeValue receives null and type is currency', () => {
    fixture.componentRef.setInput('type', 'currency');
    fixture.detectChanges();

    component.writeValue(null);
    fixture.detectChanges();

    expect(component['value']).toBe(0);
  });

  it('should call onChange when user types in the input', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);

    component.onInput('texto digitado');

    expect(spy).toHaveBeenCalledWith('texto digitado');
    expect(component['value']).toBe('texto digitado');
  });

  it('should call onTouched when input loses focus', () => {
    const spy = vi.fn();
    component.registerOnTouched(spy);

    component.onBlur();

    expect(spy).toHaveBeenCalled();
  });

  it('should show prefix text when prefix is set', () => {
    fixture.componentRef.setInput('prefix', 'R$');
    fixture.detectChanges();

    const prefix = getFieldPrefix();
    expect(prefix).toBeTruthy();
    expect(prefix?.textContent?.trim()).toBe('R$');
  });

  it('should not render prefix when prefix is empty', () => {
    fixture.componentRef.setInput('prefix', '');
    fixture.detectChanges();

    expect(getFieldPrefix()).toBeNull();
  });

  it('should show lock icon in field suffix when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const suffix = getFieldSuffix();
    expect(suffix).toBeTruthy();
    const lockIcon = suffix?.querySelector('lib-icon');
    expect(lockIcon).toBeTruthy();
  });

  it('should toggle password visibility and update input type', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(component['passwordVisible']).toBe(false);
    expect(component.effectiveInputType).toBe('password');

    component['togglePasswordVisibility']();
    fixture.detectChanges();

    expect(component['passwordVisible']).toBe(true);
    expect(component.effectiveInputType).toBe('text');
  });

  it('should show password toggle button when type is password', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(component.showPasswordToggle).toBe(true);
    expect(component.showFieldSuffix).toBe(true);
  });

  it('should not show password toggle when disabled', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(component.showPasswordToggle).toBe(false);
  });

  it('should not show password toggle when readonly', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.showPasswordToggle).toBe(false);
  });

  it('should set aria-invalid on input when error is true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('should not set aria-invalid when error is false', () => {
    fixture.componentRef.setInput('error', false);
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('aria-invalid')).toBeNull();
  });

  it('should set aria-label when inputAriaLabel is provided', () => {
    fixture.componentRef.setInput('inputAriaLabel', 'Nome do cliente');
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('aria-label')).toBe('Nome do cliente');
  });

  it('should render icon before input when iconBefore is set', () => {
    fixture.componentRef.setInput('iconBefore', 'Search');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('lib-icon');
    expect(icon).toBeTruthy();
  });

  it('should render suffix text when suffix is set', () => {
    fixture.componentRef.setInput('suffix', 'kg');
    fixture.detectChanges();

    const suffixSpan = fixture.nativeElement.querySelector('.field-text-suffix');
    expect(suffixSpan).toBeTruthy();
    expect(suffixSpan?.textContent?.trim()).toBe('kg');
  });

  it('should set disabled via setDisabledState from ControlValueAccessor', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.isDisabled).toBe(true);
    const field = getField();
    expect(field?.classList.contains('disabled')).toBe(true);
  });

  it('should clear value and call onChange when onClear is invoked', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);

    component.writeValue('algum texto');
    expect(component['value']).toBe('algum texto');

    component.onClear();
    fixture.detectChanges();

    expect(component['value']).toBe('');
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should reset to zero when onClear is invoked for currency type', () => {
    fixture.componentRef.setInput('type', 'currency');
    fixture.detectChanges();

    const spy = vi.fn();
    component.registerOnChange(spy);

    component.writeValue(150.5);
    expect(component['value']).toBe(150.5);

    component.onClear();
    fixture.detectChanges();

    expect(component['value']).toBe(0);
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('should not show clear button when value is empty', () => {
    fixture.componentRef.setInput('clearable', true);
    component.writeValue('');
    fixture.detectChanges();

    expect(component.showClearButton).toBe(false);
  });

  it('should show clear button when clearable is true and value is non-empty', () => {
    fixture.componentRef.setInput('clearable', true);
    component.writeValue('algum valor');
    fixture.detectChanges();

    expect(component.showClearButton).toBe(true);
  });

  it('should not show clear button when disabled even if clearable and has value', () => {
    fixture.componentRef.setInput('clearable', true);
    fixture.componentRef.setInput('disabled', true);
    component.writeValue('algum valor');
    fixture.detectChanges();

    expect(component.showClearButton).toBe(false);
  });

  it('financial: writeValue(currency) should mirror BR display', () => {
    fixture.componentRef.setInput('type', 'currency');
    fixture.detectChanges();

    component.writeValue(1234.56);
    fixture.detectChanges();

    expect(component['value']).toBe(1234.56);
    expect(component['currencyDisplay']).toBe('1.234,56');
  });

  it('financial: typing digits should use cash-register mode (1234 → 12,34)', () => {
    fixture.componentRef.setInput('type', 'currency');
    fixture.detectChanges();

    const spy = vi.fn();
    component.registerOnChange(spy);

    component.onCurrencyChange('1234');
    expect(component['currencyDisplay']).toBe('12,34');
    expect(spy).toHaveBeenLastCalledWith(12.34);

    component.onCurrencyChange('1.234');
    expect(component['currencyDisplay']).toBe('12,34');
    expect(spy).toHaveBeenLastCalledWith(12.34);

    component.onCurrencyChange('123456');
    expect(component['currencyDisplay']).toBe('1.234,56');
    expect(spy).toHaveBeenLastCalledWith(1234.56);
  });
});