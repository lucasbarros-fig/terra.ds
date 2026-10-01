import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogComponent],
    });
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getDialogRoot(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.dialog-root');
  }

  function getDialogBackdrop(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.dialog-backdrop');
  }

  function getDialogPanel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.dialog-panel');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    it('should not render dialog root when open is false', () => {
      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      expect(getDialogRoot()).toBeNull();
    });

    it('should render dialog root when open is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(getDialogRoot()).not.toBeNull();
    });
  });

  describe('showBackdrop', () => {
    it('should render backdrop when showBackdrop is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', true);
      fixture.detectChanges();

      expect(getDialogBackdrop()).not.toBeNull();
    });

    it('should not render backdrop when showBackdrop is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();

      expect(getDialogBackdrop()).toBeNull();
    });

    it('should add dialog-root-no-backdrop class when showBackdrop is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();

      expect(getDialogRoot()?.classList.contains('dialog-root-no-backdrop')).toBe(true);
    });

    it('should not add dialog-root-no-backdrop class when showBackdrop is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', true);
      fixture.detectChanges();

      expect(getDialogRoot()?.classList.contains('dialog-root-no-backdrop')).toBe(false);
    });
  });

  describe('backdropClick', () => {
    it('should emit backdropClick when clicking backdrop and closeOnBackdropClick is true', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.backdropClick.subscribe(spy);

      const sharedTarget = {};
      const mockEvent = { target: sharedTarget, currentTarget: sharedTarget } as unknown as MouseEvent;
      component.onBackdropMouseDown(mockEvent);

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit backdropClick when closeOnBackdropClick is false', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', false);
      fixture.detectChanges();

      const spy = vi.fn();
      component.backdropClick.subscribe(spy);

      const target = {};
      const mockEvent = { target, currentTarget: target } as unknown as MouseEvent;
      component.onBackdropMouseDown(mockEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit backdropClick when event target differs from currentTarget', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.backdropClick.subscribe(spy);

      const mockEvent = {
        target: {},
        currentTarget: {},
      } as unknown as MouseEvent;
      component.onBackdropMouseDown(mockEvent);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ARIA attributes', () => {
    it('should set aria-label on the dialog panel', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('ariaLabel', 'My dialog');
      fixture.detectChanges();

      expect(getDialogPanel()?.getAttribute('aria-label')).toBe('My dialog');
    });

    it('should not set aria-label when not provided', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('ariaLabel', undefined);
      fixture.detectChanges();

      expect(getDialogPanel()?.getAttribute('aria-label')).toBeNull();
    });

    it('should set aria-labelledby on the dialog panel', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('ariaLabelledBy', 'header-id');
      fixture.detectChanges();

      expect(getDialogPanel()?.getAttribute('aria-labelledby')).toBe('header-id');
    });

    it('should set role="dialog" on the dialog panel', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(getDialogPanel()?.getAttribute('role')).toBe('dialog');
    });

    it('should set aria-modal="true" when showBackdrop is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', true);
      fixture.detectChanges();

      expect(getDialogPanel()?.getAttribute('aria-modal')).toBe('true');
    });

    it('should not set aria-modal when showBackdrop is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();

      expect(getDialogPanel()?.getAttribute('aria-modal')).toBeNull();
    });
  });

  describe('testId', () => {
    it('should set data-testid attribute when testId is provided', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('testId', 'my-dialog');
      fixture.detectChanges();

      expect(getDialogRoot()?.getAttribute('data-testid')).toBe('my-dialog');
    });

    it('should not set data-testid when testId is not provided', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('testId', undefined);
      fixture.detectChanges();

      expect(getDialogRoot()?.getAttribute('data-testid')).toBeNull();
    });
  });

  describe('hostClass', () => {
    it('should apply intent class to host element', () => {
      fixture.componentRef.setInput('intent', 'branding');
      fixture.detectChanges();

      expect(component.hostClass()).toBe('intent-branding');
    });

    it('should update host class when intent changes', () => {
      fixture.componentRef.setInput('intent', 'negative');
      fixture.detectChanges();

      expect(component.hostClass()).toBe('intent-negative');
    });
  });
});
