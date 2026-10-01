import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from '../../actions/button/button.component';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    });
    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should render the icon when icon is set', () => {
      fixture.componentRef.setInput('icon', 'DiamondsFour');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.icon-display')).toBeTruthy();
    });

    it('should render the title when title is set', () => {
      fixture.componentRef.setInput('title', 'Título');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const titleEl = el.querySelector('.title-text');
      expect(titleEl).toBeTruthy();
      expect(titleEl?.textContent?.trim()).toBe('Título');
    });

    it('should render the description when description is set', () => {
      fixture.componentRef.setInput('description', 'Descrição');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const descEl = el.querySelector('.description-text');
      expect(descEl).toBeTruthy();
      expect(descEl?.textContent?.trim()).toBe('Descrição');
    });

    it('should render the button when buttonLabel is set', () => {
      fixture.componentRef.setInput('buttonLabel', 'Ação');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('lib-button')).toBeTruthy();
    });
  });

  describe('hasTextBlock', () => {
    it('should return true when title is provided', () => {
      fixture.componentRef.setInput('title', 'Título');
      fixture.detectChanges();

      expect(component.hasTextBlock).toBe(true);
    });

    it('should return true when description is provided', () => {
      fixture.componentRef.setInput('description', 'Descrição');
      fixture.detectChanges();

      expect(component.hasTextBlock).toBe(true);
    });

    it('should return false when both title and description are undefined', () => {
      expect(component.hasTextBlock).toBe(false);
    });

    it('should return false when title is an empty string', () => {
      fixture.componentRef.setInput('title', '');
      fixture.detectChanges();

      expect(component.hasTextBlock).toBe(false);
    });

    it('should return false when title is only whitespace', () => {
      fixture.componentRef.setInput('title', '   ');
      fixture.detectChanges();

      expect(component.hasTextBlock).toBe(false);
    });

    it('should return true when description is only whitespace (getter uses Boolean, not trim)', () => {
      fixture.componentRef.setInput('description', '   ');
      fixture.detectChanges();

      expect(component.hasTextBlock).toBe(true);
    });
  });

  describe('hasAnyContent', () => {
    it('should return true when icon is set', () => {
      fixture.componentRef.setInput('icon', 'DiamondsFour');
      fixture.detectChanges();

      expect(component.hasAnyContent).toBe(true);
    });

    it('should return false when all inputs are empty or undefined', () => {
      fixture.componentRef.setInput('title', '');
      fixture.componentRef.setInput('description', '');
      fixture.componentRef.setInput('buttonLabel', '');
      fixture.detectChanges();

      expect(component.hasAnyContent).toBe(false);
    });

    it('should return true when title is set (via hasTextBlock)', () => {
      fixture.componentRef.setInput('title', 'Título');
      fixture.detectChanges();

      expect(component.hasAnyContent).toBe(true);
    });

    it('should return true when description is set (via hasTextBlock)', () => {
      fixture.componentRef.setInput('description', 'Descrição');
      fixture.detectChanges();

      expect(component.hasAnyContent).toBe(true);
    });

    it('should return true when buttonLabel is set', () => {
      fixture.componentRef.setInput('buttonLabel', 'Ação');
      fixture.detectChanges();

      expect(component.hasAnyContent).toBe(true);
    });

    it('should return false when all inputs are undefined', () => {
      expect(component.hasAnyContent).toBe(false);
    });

    it('should not render the container when hasAnyContent is false', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.empty-state-container')).toBeNull();
    });
  });

  describe('container visibility', () => {
    it('should render the container when hasAnyContent is true', () => {
      fixture.componentRef.setInput('title', 'Título');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.empty-state-container')).toBeTruthy();
    });
  });

  describe('description whitespace edge case', () => {
    it('should not render description paragraph when description is only whitespace (template uses trim)', () => {
      fixture.componentRef.setInput('description', '   ');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.description-text')).toBeNull();
      expect(component.hasTextBlock).toBe(true);
    });
  });

  describe('buttonClicked', () => {
    it('should emit when the button is clicked', () => {
      fixture.componentRef.setInput('buttonLabel', 'Ação');
      fixture.detectChanges();

      const spy = vi.fn();
      component.buttonClicked.subscribe(spy);

      const buttonDebugEl = fixture.debugElement.query(By.css('lib-button'));
      buttonDebugEl?.triggerEventHandler('clicked', new MouseEvent('click'));

      expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe('button rendering', () => {
    it('should not render the button when buttonLabel is undefined', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('lib-button')).toBeNull();
    });

    it('should not render the button when buttonLabel is an empty string', () => {
      fixture.componentRef.setInput('buttonLabel', '');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('lib-button')).toBeNull();
    });

    it('should not render the button when buttonLabel is only whitespace', () => {
      fixture.componentRef.setInput('buttonLabel', '   ');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('lib-button')).toBeNull();
    });
  });

  describe('buttonDisabled', () => {
    it('should pass disabled=true to the button when buttonDisabled is true', () => {
      fixture.componentRef.setInput('buttonLabel', 'Ação');
      fixture.componentRef.setInput('buttonDisabled', true);
      fixture.detectChanges();

      const buttonDebugEl = fixture.debugElement.query(By.css('lib-button'));
      const buttonInstance = buttonDebugEl?.componentInstance as ButtonComponent;
      expect(buttonInstance?.disabled()).toBe(true);
    });

    it('should pass disabled=false to the button when buttonDisabled is false', () => {
      fixture.componentRef.setInput('buttonLabel', 'Ação');
      fixture.componentRef.setInput('buttonDisabled', false);
      fixture.detectChanges();

      const buttonDebugEl = fixture.debugElement.query(By.css('lib-button'));
      const buttonInstance = buttonDebugEl?.componentInstance as ButtonComponent;
      expect(buttonInstance?.disabled()).toBe(false);
    });

    it('should not emit buttonClicked when button is disabled', () => {
      fixture.componentRef.setInput('buttonLabel', 'Ação');
      fixture.componentRef.setInput('buttonDisabled', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.buttonClicked.subscribe(spy);

      const buttonDebugEl = fixture.debugElement.query(By.css('lib-button'));
      const buttonInstance = buttonDebugEl?.componentInstance as ButtonComponent;
      buttonInstance.onClick(new MouseEvent('click'));

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
