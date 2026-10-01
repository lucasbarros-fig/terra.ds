import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { InputQuantityComponent } from './input-quantity.component';

describe('InputQuantityComponent', () => {
  let component: InputQuantityComponent;
  let fixture: ComponentFixture<InputQuantityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputQuantityComponent],
    });
    fixture = TestBed.createComponent(InputQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default min to 0, step to 1, and max to null', () => {
    expect(component.min()).toBe(0);
    expect(component.step()).toBe(1);
    expect(component.max()).toBeNull();
  });

  it('should increment value and emit valueChange', () => {
    const spy = vi.fn();
    component.valueChange.subscribe(spy);
    component.writeValue(5);

    component.increment();

    expect(component.numericValue).toBe(6);
    expect(spy).toHaveBeenCalledWith(6);
  });

  it('should decrement value and emit valueChange', () => {
    const spy = vi.fn();
    component.valueChange.subscribe(spy);
    component.writeValue(5);

    component.decrement();

    expect(component.numericValue).toBe(4);
    expect(spy).toHaveBeenCalledWith(4);
  });

  it('should not decrement below min', () => {
    component.writeValue(0);

    component.decrement();

    expect(component.numericValue).toBe(0);
    expect(component.canDecrement).toBe(false);
  });

  it('should not increment above max', () => {
    fixture.componentRef.setInput('max', 5);
    component.writeValue(5);

    component.increment();

    expect(component.numericValue).toBe(5);
    expect(component.canIncrement).toBe(false);
  });

  it('should handle direct input typing via onInput', () => {
    const spy = vi.fn();
    component.valueChange.subscribe(spy);

    component.onInput('42');

    expect(component.numericValue).toBe(42);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should strip non-numeric characters on input', () => {
    component.onInput('ab12cd34');

    expect(component.numericValue).toBe(1234);
  });

  it('should clamp value to max on blur when above max', () => {
    fixture.componentRef.setInput('max', 100);
    const spy = vi.fn();
    component.valueChange.subscribe(spy);

    component.onInput('999');
    component.onBlur();

    expect(component.numericValue).toBe(100);
    expect(spy).toHaveBeenCalledWith(100);
  });

  it('should clamp value to min on blur when below min', () => {
    fixture.componentRef.setInput('min', 10);
    const spy = vi.fn();
    component.valueChange.subscribe(spy);

    component.onInput('5');
    component.onBlur();

    expect(component.numericValue).toBe(10);
    expect(spy).toHaveBeenCalledWith(10);
  });

  it('should block all controls when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(component.isDisabled).toBe(true);
    expect(component.canIncrement).toBe(false);
    expect(component.canDecrement).toBe(false);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });

  it('should set value via writeValue (ControlValueAccessor)', () => {
    component.writeValue(10);

    expect(component.numericValue).toBe(10);
  });

  it('should default to min when writeValue receives null', () => {
    component.writeValue(null);

    expect(component.numericValue).toBe(component.min());
  });
});
