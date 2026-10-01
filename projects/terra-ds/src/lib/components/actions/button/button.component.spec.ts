import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SpinnerComponent } from '../../layout-&-structure/spinner/spinner.component';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ButtonComponent],
    });
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to branding/filled', () => {
    expect(component.intent()).toBe('branding');
    expect(component.variant()).toBe('filled');
    expect(component.hostClass()).toContain('intent-branding');
    expect(component.hostClass()).toContain('variant-filled');
  });

  it('should expose state classes on the host', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.componentRef.setInput('highlight', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.hostClass()).toContain('is-selected');
    expect(component.hostClass()).toContain('is-highlight');
    expect(component.hostClass()).toContain('is-disabled');
  });

  it('should render the highlight label only when highlight=true', () => {
    fixture.componentRef.setInput('label', 'Salvar');
    fixture.componentRef.setInput('highlight', true);
    fixture.componentRef.setInput('highlightLabel', 'Promo');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const highlight = el.querySelector('.lib-button__highlight-label');
    expect(highlight?.textContent?.trim()).toBe('Promo');
  });

  it('should not emit click when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick(new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit click when enabled', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should expose is-loading on the host and set aria-busy when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(component.hostClass()).toContain('is-loading');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.disabled).toBe(true);
  });

  it('should apply the disabled visuals while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(component.hostClass()).toContain('is-disabled');
  });

  it('should replace the button icon with the spinner while loading, keeping the label', () => {
    fixture.componentRef.setInput('label', 'Salvar');
    fixture.componentRef.setInput('icon', 'DiamondsFour');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button: HTMLElement = fixture.nativeElement.querySelector('button');
    const children = Array.from(button.children);
    const spinnerIndex = children.findIndex((el) => el.classList.contains('lib-button__spinner'));
    const labelIndex = children.findIndex((el) => el.classList.contains('lib-button__label'));

    expect(button.querySelector('.lib-button__icon')).toBeNull();
    expect(spinnerIndex).toBeGreaterThanOrEqual(0);
    expect(spinnerIndex).toBeLessThan(labelIndex);
  });

  it('should show the button icon again when loading ends', () => {
    fixture.componentRef.setInput('icon', 'DiamondsFour');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.lib-button__icon')).not.toBeNull();
    expect(el.querySelector('.lib-button__spinner')).toBeNull();
  });

  it('should render the spinner component sized like the button icon', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('iconSize', 16);
    fixture.detectChanges();

    const spinnerDebugEl = fixture.debugElement.query(By.css('lib-spinner'));
    const spinnerInstance = spinnerDebugEl?.componentInstance as SpinnerComponent;
    expect(spinnerInstance?.size()).toBe(16);
  });

  it('should not render the loading spinner icon when loading is false', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.lib-button__spinner')).toBeNull();
  });

  it('should not emit click when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick(new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });
});
