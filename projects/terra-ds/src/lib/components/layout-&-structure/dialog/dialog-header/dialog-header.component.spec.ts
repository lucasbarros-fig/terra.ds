import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DialogHeaderComponent } from './dialog-header.component';

describe('DialogHeaderComponent', () => {
  let component: DialogHeaderComponent;
  let fixture: ComponentFixture<DialogHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogHeaderComponent],
    });
    fixture = TestBed.createComponent(DialogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getTitleRow(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.header-title-row');
  }

  function getTitle(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.header-title');
  }

  function getCloseButton(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.header-close');
  }

  function getLeadingIcon(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.header-leading-icon');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('title', () => {
    it('should render title text when title is provided', () => {
      fixture.componentRef.setInput('title', 'Meu dialog');
      fixture.detectChanges();

      expect(getTitle()?.textContent?.trim()).toBe('Meu dialog');
    });

    it('should not render title row when title is empty', () => {
      fixture.componentRef.setInput('title', '');
      fixture.detectChanges();

      expect(getTitleRow()).toBeNull();
    });

    it('should render title row when title is provided', () => {
      fixture.componentRef.setInput('title', 'Título');
      fixture.detectChanges();

      expect(getTitleRow()).not.toBeNull();
    });
  });

  describe('showCloseButton', () => {
    it('should render close button when showCloseButton is true', () => {
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();

      expect(getCloseButton()).not.toBeNull();
    });

    it('should not render close button when showCloseButton is false', () => {
      fixture.componentRef.setInput('showCloseButton', false);
      fixture.detectChanges();

      expect(getCloseButton()).toBeNull();
    });
  });

  describe('closeClick', () => {
    it('should emit closeClick when onClose is called', () => {
      const spy = vi.fn();
      component.closeClick.subscribe(spy);

      component.onClose();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('leadingIcon', () => {
    it('should return null for neutral intent', () => {
      fixture.componentRef.setInput('intent', 'neutral');
      fixture.detectChanges();

      expect(component.leadingIcon()).toBeNull();
    });

    it('should return null for branding intent', () => {
      fixture.componentRef.setInput('intent', 'branding');
      fixture.detectChanges();

      expect(component.leadingIcon()).toBeNull();
    });

    it('should return CheckCircle for positive intent', () => {
      fixture.componentRef.setInput('intent', 'positive');
      fixture.detectChanges();

      expect(component.leadingIcon()).toBe('CheckCircle');
    });

    it('should return Warning for warning intent', () => {
      fixture.componentRef.setInput('intent', 'warning');
      fixture.detectChanges();

      expect(component.leadingIcon()).toBe('Warning');
    });

    it('should return Trash for negative intent', () => {
      fixture.componentRef.setInput('intent', 'negative');
      fixture.detectChanges();

      expect(component.leadingIcon()).toBe('Trash');
    });

    it('should return Info for informative intent', () => {
      fixture.componentRef.setInput('intent', 'informative');
      fixture.detectChanges();

      expect(component.leadingIcon()).toBe('Info');
    });

    it('should render leading icon element for positive intent', () => {
      fixture.componentRef.setInput('intent', 'positive');
      fixture.componentRef.setInput('title', 'Positivo');
      fixture.detectChanges();

      expect(getLeadingIcon()).not.toBeNull();
    });

    it('should not render leading icon element for neutral intent', () => {
      fixture.componentRef.setInput('intent', 'neutral');
      fixture.componentRef.setInput('title', 'Neutro');
      fixture.detectChanges();

      expect(getLeadingIcon()).toBeNull();
    });

    it('should override the intent-derived icon when icon input is set', () => {
      fixture.componentRef.setInput('intent', 'positive');
      fixture.componentRef.setInput('icon', 'Star');
      fixture.detectChanges();

      expect(component.leadingIcon()).toBe('Star');
    });

    it('should render a custom icon even for neutral intent, which has no default icon', () => {
      fixture.componentRef.setInput('intent', 'neutral');
      fixture.componentRef.setInput('icon', 'Star');
      fixture.componentRef.setInput('title', 'Neutro');
      fixture.detectChanges();

      expect(getLeadingIcon()).not.toBeNull();
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
