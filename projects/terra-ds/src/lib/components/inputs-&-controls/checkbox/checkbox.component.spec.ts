import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckboxComponent],
    });
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getNativeInput(): HTMLInputElement | null {
    return fixture.nativeElement.querySelector('.checkbox-native');
  }

  function getCheckboxBox(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.checkbox-box');
  }

  function getCheckboxContainer(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.checkbox');
  }

  function getLabel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.checkbox-label');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria-checked to "true" when checked', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('aria-checked')).toBe('true');
  });

  it('should set aria-checked to "false" when unchecked', () => {
    fixture.componentRef.setInput('checked', false);
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('aria-checked')).toBe('false');
  });

  it('should set aria-checked to "mixed" when indeterminate', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('aria-checked')).toBe('mixed');
  });

  it('should reflect the label as aria-label on the native input', () => {
    fixture.componentRef.setInput('label', 'Aceito os termos');
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.getAttribute('aria-label')).toBe('Aceito os termos');
  });

  it('should render the label when label input is provided', () => {
    fixture.componentRef.setInput('label', 'Aceito os termos');
    fixture.detectChanges();

    const label = getLabel();
    expect(label?.textContent).toContain('Aceito os termos');
  });

  it('should not render the label when label input is not provided', () => {
    fixture.componentRef.setInput('label', undefined);
    fixture.detectChanges();

    const label = getLabel();
    expect(label).toBeNull();
  });

  it('should set showCheckIcon to true when checked and not indeterminate', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.componentRef.setInput('indeterminate', false);
    fixture.detectChanges();

    expect(component['showCheckIcon']).toBe(true);
    expect(component['showMinusIcon']).toBe(false);
  });

  it('should set showMinusIcon to true when indeterminate', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    expect(component['showMinusIcon']).toBe(true);
  });

  it('should add the disabled class when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const container = getCheckboxContainer();
    expect(container?.classList.contains('disabled')).toBe(true);
  });

  it('should not add the disabled class when disabled is false', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();

    const container = getCheckboxContainer();
    expect(container?.classList.contains('disabled')).toBe(false);
  });

  it('should add the filled class when checked', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const box = getCheckboxBox();
    expect(box?.classList.contains('filled')).toBe(true);
  });

  it('should add the filled class when indeterminate', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    const box = getCheckboxBox();
    expect(box?.classList.contains('filled')).toBe(true);
  });

  it('should not add the filled class when unchecked and not indeterminate', () => {
    fixture.componentRef.setInput('checked', false);
    fixture.componentRef.setInput('indeterminate', false);
    fixture.detectChanges();

    const box = getCheckboxBox();
    expect(box?.classList.contains('filled')).toBe(false);
  });

  it('should set the native input disabled attribute when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.disabled).toBe(true);
  });

  it('should emit checkedChange when the native input changes to checked', () => {
    fixture.componentRef.setInput('checked', false);
    fixture.detectChanges();

    const spy = vi.fn();
    component.checked.subscribe(spy);

    const input = getNativeInput();
    Object.defineProperty(input, 'checked', { value: true });
    input?.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit checkedChange when the native input changes to unchecked', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const spy = vi.fn();
    component.checked.subscribe(spy);

    const input = getNativeInput();
    Object.defineProperty(input, 'checked', { value: false });
    input?.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should emit indeterminateChange false when clicking indeterminate checkbox', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    const spy = vi.fn();
    component.indeterminate.subscribe(spy);

    const input = getNativeInput();
    Object.defineProperty(input, 'checked', { value: true });
    input?.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should update checked via writeValue from ControlValueAccessor', () => {
    component.writeValue(true);
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
    const input = getNativeInput();
    expect(input?.checked).toBe(true);
  });

  it('should set disabled via setDisabledState from ControlValueAccessor', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.isDisabled()).toBe(true);
    const container = getCheckboxContainer();
    expect(container?.classList.contains('disabled')).toBe(true);
  });

  it('should use fallbackId when inputId is not provided', () => {
    fixture.componentRef.setInput('inputId', '');
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.id).toBeTruthy();
    expect(input?.id).toContain('lib-checkbox-');
  });

  it('should use inputId when provided', () => {
    fixture.componentRef.setInput('inputId', 'my-checkbox');
    fixture.detectChanges();

    const input = getNativeInput();
    expect(input?.id).toBe('my-checkbox');
  });

  it('should call onTouched on focus out', () => {
    const touchedSpy = vi.fn();
    component.registerOnTouched(touchedSpy);

    const input = getNativeInput();
    input?.dispatchEvent(new Event('blur'));

    expect(touchedSpy).toHaveBeenCalled();
  });

  it('should set iconColor to essential-disabled when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(component['iconColor']).toBe('essential-disabled');
  });

  it('should set iconColor to essential-contrast when enabled', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();

    expect(component['iconColor']).toBe('essential-contrast');
  });
});
