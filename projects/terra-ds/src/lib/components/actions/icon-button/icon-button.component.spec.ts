import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  let component: IconButtonComponent;
  let fixture: ComponentFixture<IconButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconButtonComponent],
    });
    fixture = TestBed.createComponent(IconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to branding/filled/default/DiamondsFour/button', () => {
    expect(component.type()).toBe('branding');
    expect(component.variant()).toBe('filled');
    expect(component.size()).toBe('default');
    expect(component.disabled()).toBe(false);
    expect(component.icon()).toBe('DiamondsFour');
    expect(component.nativeType()).toBe('button');
    expect(component.ariaLabel()).toBe('');
    expect(component.loading()).toBe(false);
  });

  describe('rootClass', () => {
    it('should include type, variant, and size classes', () => {
      expect(component.rootClass()).toContain('icon-button-root');
      expect(component.rootClass()).toContain('type-branding');
      expect(component.rootClass()).toContain('variant-filled');
      expect(component.rootClass()).toContain('size-default');
    });

    it('should not include is-disabled when enabled', () => {
      expect(component.rootClass()).not.toContain('is-disabled');
    });

    it('should include is-disabled when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.rootClass()).toContain('is-disabled');
    });

    it('should reflect type changes', () => {
      fixture.componentRef.setInput('type', 'neutral');
      fixture.detectChanges();
      expect(component.rootClass()).toContain('type-neutral');
      expect(component.rootClass()).not.toContain('type-branding');
    });

    it('should reflect variant changes', () => {
      fixture.componentRef.setInput('variant', 'bare');
      fixture.detectChanges();
      expect(component.rootClass()).toContain('variant-bare');
      expect(component.rootClass()).not.toContain('variant-filled');
    });

    it('should reflect size changes', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.rootClass()).toContain('size-small');
      expect(component.rootClass()).not.toContain('size-default');
    });

    it('should include is-loading and is-disabled when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(component.rootClass()).toContain('is-loading');
      expect(component.rootClass()).toContain('is-disabled');
    });

    it('should not include is-loading when not loading', () => {
      expect(component.rootClass()).not.toContain('is-loading');
    });
  });

  describe('iconSizeBinding', () => {
    it('should return 20 when size is default', () => {
      expect(component.iconSizeBinding()).toBe(20);
    });

    it('should return 16 when size is small', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.iconSizeBinding()).toBe(16);
    });
  });

  describe('onClick', () => {
    it('should emit clicked when enabled', () => {
      const spy = vi.fn();
      component.clicked.subscribe(spy);
      const event = new MouseEvent('click');
      component.onClick(event);
      expect(spy).toHaveBeenCalledWith(event);
    });

    it('should not emit clicked when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const spy = vi.fn();
      component.clicked.subscribe(spy);
      component.onClick(new MouseEvent('click'));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should prevent default and stop propagation when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const event = new MouseEvent('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      const stopImmediatePropagationSpy = vi.spyOn(event, 'stopImmediatePropagation');
      component.onClick(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopImmediatePropagationSpy).toHaveBeenCalled();
    });

    it('should not emit clicked when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      const spy = vi.fn();
      component.clicked.subscribe(spy);
      component.onClick(new MouseEvent('click'));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    it('should render a button with correct nativeType', () => {
      const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.type).toBe('button');
    });

    it('should set nativeType to submit when configured', () => {
      fixture.componentRef.setInput('nativeType', 'submit');
      fixture.detectChanges();
      const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
      expect(button?.type).toBe('submit');
    });

    it('should set aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Fechar');
      fixture.detectChanges();
      const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
      expect(button?.getAttribute('aria-label')).toBe('Fechar');
    });

    it('should not set aria-label when empty', () => {
      fixture.componentRef.setInput('ariaLabel', '');
      fixture.detectChanges();
      const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
      expect(button?.getAttribute('aria-label')).toBeNull();
    });

    it('should disable the button element when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
      expect(button?.disabled).toBe(true);
    });

    it('should render the icon and not the spinner when not loading', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('lib-icon.icon-button-icon')).toBeTruthy();
      expect(el.querySelector('lib-spinner')).toBeNull();
    });

    it('should replace the icon with the spinner when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('lib-spinner.icon-button-icon')).toBeTruthy();
      expect(el.querySelector('lib-icon')).toBeNull();
    });

    it('should disable the button element and set aria-busy when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
      expect(button?.disabled).toBe(true);
      expect(button?.getAttribute('aria-busy')).toBe('true');
    });

    it('should not set aria-busy when not loading', () => {
      const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
      expect(button?.getAttribute('aria-busy')).toBeNull();
    });
  });
});
