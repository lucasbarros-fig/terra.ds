import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { InputTextareaComponent } from './input-textarea.component';

describe('InputTextareaComponent', () => {
  let component: InputTextareaComponent;
  let fixture: ComponentFixture<InputTextareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputTextareaComponent],
    });
    fixture = TestBed.createComponent(InputTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('defaults', () => {
    it('should default label to empty, rows to 3, variant to underline', () => {
      expect(component.label).toBe('');
      expect(component.rows).toBe(3);
      expect(component.variant).toBe('underline');
      expect(component.placeholder).toBe('');
      expect(component.disabled).toBe(false);
      expect(component.readonly).toBe(false);
      expect(component.error).toBe(false);
    });

    it('should default helperColor to negative', () => {
      expect(component.helperColor).toBe('negative');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should update value via writeValue', () => {
      component.writeValue('initial text');
      expect(component['value']).toBe('initial text');
    });

    it('should handle writeValue with null', () => {
      component.writeValue(null);
      expect(component['value']).toBe('');
    });

    it('should call onChange when onInput is invoked', () => {
      const spy = vi.fn();
      component.registerOnChange(spy);
      component.onInput('typed text');
      expect(spy).toHaveBeenCalledWith('typed text');
      expect(component['value']).toBe('typed text');
    });

    it('should call onTouched on blur', () => {
      const spy = vi.fn();
      component.registerOnTouched(spy);
      component.onBlur();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled', () => {
    it('should mark isDisabled true when disabled input is set', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.isDisabled).toBe(true);
    });

    it('should mark isDisabled true via setDisabledState (form disabled)', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);
    });

    it('should disable the textarea element when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const textarea: HTMLTextAreaElement | null = fixture.nativeElement.querySelector('textarea');
      expect(textarea?.disabled).toBe(true);
    });

    it('should show the disabled class on the field', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const field: HTMLElement | null = fixture.nativeElement.querySelector('.field');
      expect(field?.classList.contains('disabled')).toBe(true);
    });

    it('should display Lock icon in suffix when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const suffix = fixture.nativeElement.querySelector('.field-suffix');
      expect(suffix).toBeTruthy();
    });

    it('should not show suffix when enabled and no iconAfter', () => {
      expect(component.showFieldSuffix).toBe(false);
      expect(fixture.nativeElement.querySelector('.field-suffix')).toBeFalsy();
    });
  });

  describe('readonly', () => {
    it('should set readonly attribute on textarea', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      const textarea: HTMLTextAreaElement | null = fixture.nativeElement.querySelector('textarea');
      expect(textarea?.readOnly).toBe(true);
    });
  });

  describe('error', () => {
    it('should add error class to the field', () => {
      fixture.componentRef.setInput('error', true);
      fixture.detectChanges();
      const field: HTMLElement | null = fixture.nativeElement.querySelector('.field');
      expect(field?.classList.contains('error')).toBe(true);
    });

    it('should set aria-invalid on textarea when error', () => {
      fixture.componentRef.setInput('error', true);
      fixture.detectChanges();
      const textarea: HTMLTextAreaElement | null = fixture.nativeElement.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    });

    it('should return negative helperColor when error is true', () => {
      fixture.componentRef.setInput('error', true);
      fixture.detectChanges();
      expect(component.resolvedHelperColor).toBe('negative');
    });

    it('should return configured helperColor when no error', () => {
      fixture.componentRef.setInput('helperColor', 'positive');
      fixture.detectChanges();
      expect(component.resolvedHelperColor).toBe('positive');
    });
  });

  describe('placeholder', () => {
    it('should set placeholder on the textarea', () => {
      fixture.componentRef.setInput('placeholder', 'Digite aqui...');
      fixture.detectChanges();
      const textarea: HTMLTextAreaElement | null = fixture.nativeElement.querySelector('textarea');
      expect(textarea?.getAttribute('placeholder')).toBe('Digite aqui...');
    });
  });

  describe('rows', () => {
    it('should set rows attribute on textarea', () => {
      fixture.componentRef.setInput('rows', 5);
      fixture.detectChanges();
      const textarea: HTMLTextAreaElement | null = fixture.nativeElement.querySelector('textarea');
      expect(textarea?.getAttribute('rows')).toBe('5');
    });
  });

  describe('variant', () => {
    it('should add outlined class when variant is outlined', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.detectChanges();
      const field: HTMLElement | null = fixture.nativeElement.querySelector('.field');
      expect(field?.classList.contains('outlined')).toBe(true);
    });

    it('should not add outlined class when variant is underline', () => {
      const field: HTMLElement | null = fixture.nativeElement.querySelector('.field');
      expect(field?.classList.contains('outlined')).toBe(false);
    });
  });

  describe('DOM structure', () => {
    it('should render a textarea element', () => {
      const textarea = fixture.nativeElement.querySelector('textarea');
      expect(textarea).toBeTruthy();
    });

    it('should not render label when label is empty', () => {
      const label = fixture.nativeElement.querySelector('lib-label');
      expect(label).toBeFalsy();
    });

    it('should render label when label is provided', () => {
      fixture.componentRef.setInput('label', 'Description');
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('lib-label');
      expect(label).toBeTruthy();
    });

    it('should render helper text when helperText is provided', () => {
      fixture.componentRef.setInput('helperText', 'Campo obrigatório');
      fixture.detectChanges();
      const helper = fixture.nativeElement.querySelector('lib-helper');
      expect(helper).toBeTruthy();
    });
  });
});
