import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DialogFooterComponent } from './dialog-footer.component';

describe('DialogFooterComponent', () => {
  let component: DialogFooterComponent;
  let fixture: ComponentFixture<DialogFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogFooterComponent],
    });
    fixture = TestBed.createComponent(DialogFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getFooterActions(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.footer-actions');
  }

  function getCancelItem(): HTMLElement | null {
    return fixture.nativeElement.querySelectorAll('.footer-action-item')[0] ?? null;
  }

  function getConfirmItem(): HTMLElement | null {
    return fixture.nativeElement.querySelectorAll('.footer-action-item')[1] ?? null;
  }

  function getFooterInner(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.footer-inner');
  }

  function getCancelNativeButton(): HTMLButtonElement | null {
    return getCancelItem()?.querySelector('button') ?? null;
  }

  function getConfirmNativeButton(): HTMLButtonElement | null {
    return getConfirmItem()?.querySelector('button') ?? null;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showDefaultActions', () => {
    it('should render default actions when showDefaultActions is true', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.detectChanges();

      expect(getFooterActions()).not.toBeNull();
    });

    it('should not render default actions when showDefaultActions is false', () => {
      fixture.componentRef.setInput('showDefaultActions', false);
      fixture.detectChanges();

      expect(getFooterActions()).toBeNull();
    });
  });

  describe('showCancelButton', () => {
    it('should render cancel button item when showCancelButton is true', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('showCancelButton', true);
      fixture.detectChanges();

      expect(getCancelItem()).not.toBeNull();
    });

    it('should not render cancel button item when showCancelButton is false', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('showCancelButton', false);
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('.footer-action-item');
      expect(items.length).toBeLessThan(2);
    });
  });

  describe('showConfirmButton', () => {
    it('should render confirm button item when showConfirmButton is true', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('showConfirmButton', true);
      fixture.detectChanges();

      expect(getConfirmItem()).not.toBeNull();
    });

    it('should not render confirm button item when showConfirmButton is false', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('showCancelButton', false);
      fixture.componentRef.setInput('showConfirmButton', false);
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('.footer-action-item');
      expect(items.length).toBe(0);
    });
  });

  describe('cancelClick', () => {
    it('should emit cancelClick when onCancelClick is called', () => {
      const spy = vi.fn();
      component.cancelClick.subscribe(spy);

      const event = new MouseEvent('click');
      component.onCancelClick(event);

      expect(spy).toHaveBeenCalledWith(event);
    });
  });

  describe('confirmClick', () => {
    it('should emit confirmClick when onConfirmClick is called', () => {
      const spy = vi.fn();
      component.confirmClick.subscribe(spy);

      const event = new MouseEvent('click');
      component.onConfirmClick(event);

      expect(spy).toHaveBeenCalledWith(event);
    });
  });

  describe('cancelLoading', () => {
    it('should not render the cancel spinner by default', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.detectChanges();

      expect(getCancelItem()?.querySelector('lib-spinner')).toBeNull();
      expect(getCancelNativeButton()?.getAttribute('aria-busy')).toBeNull();
    });

    it('should render the cancel spinner and disable the button when cancelLoading is true', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('cancelLoading', true);
      fixture.detectChanges();

      expect(getCancelItem()?.querySelector('lib-spinner')).not.toBeNull();
      expect(getCancelNativeButton()?.getAttribute('aria-busy')).toBe('true');
      expect(getCancelNativeButton()?.disabled).toBe(true);
    });

    it('should not emit cancelClick while cancelLoading is true', () => {
      const spy = vi.fn();
      component.cancelClick.subscribe(spy);

      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('cancelLoading', true);
      fixture.detectChanges();

      getCancelNativeButton()?.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('confirmLoading', () => {
    it('should not render the confirm spinner by default', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.detectChanges();

      expect(getConfirmItem()?.querySelector('lib-spinner')).toBeNull();
      expect(getConfirmNativeButton()?.getAttribute('aria-busy')).toBeNull();
    });

    it('should render the confirm spinner and disable the button when confirmLoading is true', () => {
      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('confirmLoading', true);
      fixture.detectChanges();

      expect(getConfirmItem()?.querySelector('lib-spinner')).not.toBeNull();
      expect(getConfirmNativeButton()?.getAttribute('aria-busy')).toBe('true');
      expect(getConfirmNativeButton()?.disabled).toBe(true);
    });

    it('should not emit confirmClick while confirmLoading is true', () => {
      const spy = vi.fn();
      component.confirmClick.subscribe(spy);

      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('confirmLoading', true);
      fixture.detectChanges();

      getConfirmNativeButton()?.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should keep the cancel button interactive while confirmLoading is true', () => {
      const spy = vi.fn();
      component.cancelClick.subscribe(spy);

      fixture.componentRef.setInput('showDefaultActions', true);
      fixture.componentRef.setInput('confirmLoading', true);
      fixture.detectChanges();

      getCancelNativeButton()?.click();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('actionsLayout', () => {
    it('should apply horizontal layout class when actionsLayout is horizontal', () => {
      fixture.componentRef.setInput('actionsLayout', 'horizontal');
      fixture.detectChanges();

      expect(getFooterInner()?.classList.contains('footer-inner-layout-horizontal')).toBe(true);
      expect(getFooterInner()?.classList.contains('footer-inner-layout-vertical')).toBe(false);
    });

    it('should apply vertical layout class when actionsLayout is vertical', () => {
      fixture.componentRef.setInput('actionsLayout', 'vertical');
      fixture.detectChanges();

      expect(getFooterInner()?.classList.contains('footer-inner-layout-vertical')).toBe(true);
      expect(getFooterInner()?.classList.contains('footer-inner-layout-horizontal')).toBe(false);
    });
  });

  describe('showCancelIcon / showConfirmIcon', () => {
    it('should set showCancelIcon to false when cancelIcon is undefined', () => {
      fixture.componentRef.setInput('cancelIcon', undefined);
      fixture.detectChanges();

      expect(component.showCancelIcon()).toBe(false);
    });

    it('should set showCancelIcon to true when cancelIcon is provided', () => {
      fixture.componentRef.setInput('cancelIcon', 'X');
      fixture.detectChanges();

      expect(component.showCancelIcon()).toBe(true);
    });

    it('should set showConfirmIcon to false when confirmIcon is undefined', () => {
      fixture.componentRef.setInput('confirmIcon', undefined);
      fixture.detectChanges();

      expect(component.showConfirmIcon()).toBe(false);
    });

    it('should set showConfirmIcon to true when confirmIcon is provided', () => {
      fixture.componentRef.setInput('confirmIcon', 'CheckCircle');
      fixture.detectChanges();

      expect(component.showConfirmIcon()).toBe(true);
    });
  });
});
