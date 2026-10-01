import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IndicatorScrollComponent } from './indicator-scroll.component';

describe('IndicatorScrollComponent', () => {
  let component: IndicatorScrollComponent;
  let fixture: ComponentFixture<IndicatorScrollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorScrollComponent],
    });
    fixture = TestBed.createComponent(IndicatorScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getChip(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.lib-indicator-scroll__chip');
  }

  function getLabel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.lib-indicator-scroll__label');
  }

  function getIcon(): HTMLElement | null {
    return fixture.nativeElement.querySelector('lib-icon');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('type', () => {
    it('should render "Deslize" label when type is mobile', () => {
      fixture.componentRef.setInput('type', 'mobile');
      fixture.detectChanges();

      expect(getLabel()?.textContent?.trim()).toBe('Deslize');
    });

    it('should render "Role" label when type is desktop', () => {
      fixture.componentRef.setInput('type', 'desktop');
      fixture.detectChanges();

      expect(getLabel()?.textContent?.trim()).toBe('Role');
    });

    it('should use HandTap icon when type is mobile', () => {
      fixture.componentRef.setInput('type', 'mobile');
      fixture.detectChanges();

      expect(component.iconName).toBe('HandTap');
    });

    it('should use MouseScroll icon when type is desktop', () => {
      fixture.componentRef.setInput('type', 'desktop');
      fixture.detectChanges();

      expect(component.iconName).toBe('MouseScroll');
    });

    it('should default to mobile variant when no type is provided', () => {
      expect(component.label).toBe('Deslize');
      expect(component.iconName).toBe('HandTap');
    });
  });

  describe('state', () => {
    it('should render chip when state is start', () => {
      fixture.componentRef.setInput('state', 'start');
      fixture.detectChanges();

      expect(getChip()).not.toBeNull();
    });

    it('should render chip when state is continuation-1', () => {
      fixture.componentRef.setInput('state', 'continuation-1');
      fixture.detectChanges();

      expect(getChip()).not.toBeNull();
    });

    it('should render chip when state is continuation-2', () => {
      fixture.componentRef.setInput('state', 'continuation-2');
      fixture.detectChanges();

      expect(getChip()).not.toBeNull();
    });

    it('should render chip when state is continuation-3', () => {
      fixture.componentRef.setInput('state', 'continuation-3');
      fixture.detectChanges();

      expect(getChip()).not.toBeNull();
    });

    it('should apply hidden class to host when state is end', () => {
      fixture.componentRef.setInput('state', 'end');
      fixture.detectChanges();

      const hostEl: HTMLElement = fixture.nativeElement;
      expect(hostEl.classList.contains('lib-indicator-scroll--hidden')).toBe(true);
    });

    it('should not apply hidden class when state is start', () => {
      fixture.componentRef.setInput('state', 'start');
      fixture.detectChanges();

      const hostEl: HTMLElement = fixture.nativeElement;
      expect(hostEl.classList.contains('lib-indicator-scroll--hidden')).toBe(false);
    });

    it('should not apply hidden class when state is continuation-1', () => {
      fixture.componentRef.setInput('state', 'continuation-1');
      fixture.detectChanges();

      const hostEl: HTMLElement = fixture.nativeElement;
      expect(hostEl.classList.contains('lib-indicator-scroll--hidden')).toBe(false);
    });

    it('should default to start state', () => {
      expect(component.state()).toBe('start');
    });
  });

  describe('hostClass', () => {
    it('should include lib-indicator-scroll base class', () => {
      expect(component.hostClass()).toContain('lib-indicator-scroll');
    });

    it('should include hidden modifier class when state is end', () => {
      fixture.componentRef.setInput('state', 'end');
      fixture.detectChanges();

      expect(component.hostClass()).toContain('lib-indicator-scroll--hidden');
    });

    it('should not include hidden modifier class when state is not end', () => {
      fixture.componentRef.setInput('state', 'continuation-3');
      fixture.detectChanges();

      expect(component.hostClass()).not.toContain('lib-indicator-scroll--hidden');
    });
  });

  describe('nudge', () => {
    it('should default to true', () => {
      expect(component.nudge()).toBe(true);
    });

    it('should not include the no-nudge modifier class by default', () => {
      expect(component.hostClass()).not.toContain('lib-indicator-scroll--no-nudge');
    });

    it('should include the no-nudge modifier class when nudge is false', () => {
      fixture.componentRef.setInput('nudge', false);
      fixture.detectChanges();

      expect(component.hostClass()).toContain('lib-indicator-scroll--no-nudge');
    });

    it('should still apply the hidden modifier class when nudge is false and state is end', () => {
      fixture.componentRef.setInput('nudge', false);
      fixture.componentRef.setInput('state', 'end');
      fixture.detectChanges();

      const classes = component.hostClass();
      expect(classes).toContain('lib-indicator-scroll--hidden');
      expect(classes).toContain('lib-indicator-scroll--no-nudge');
    });
  });

  describe('icon rendering', () => {
    it('should render the icon element inside the chip', () => {
      expect(getIcon()).not.toBeNull();
    });
  });
});
