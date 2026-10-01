import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TagComponent } from './tag.component';
import type { TagColor } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TagComponent],
    });
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('host class', () => {
    it('should default to emphasis high, color blue, and size small', () => {
      expect(component.emphasis()).toBe('high');
      expect(component.color()).toBe('blue');
      expect(component.size()).toBe('small');
      expect(component.hostClass).toContain('high');
      expect(component.hostClass).toContain('blue');
      expect(component.hostClass).toContain('size-small');
    });

    it('should reflect size large via host class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.hostClass).toContain('size-large');
      expect(component.hostClass).not.toContain('size-small');
    });

    it('should reflect color via host class', () => {
      const colors: TagColor[] = ['red', 'green', 'purple', 'cyan', 'neutral'];
      for (const color of colors) {
        fixture.componentRef.setInput('color', color);
        fixture.detectChanges();
        expect(component.hostClass).toContain(color);
      }
    });

    it('should reflect emphasis low via host class', () => {
      fixture.componentRef.setInput('emphasis', 'low');
      fixture.detectChanges();
      expect(component.hostClass).toContain('low');
      expect(component.hostClass).not.toContain('high');
    });
  });

  describe('close button', () => {
    it('should render close button when showCloseButton is true', () => {
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.tag-close');
      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-label')).toBe('Fechar');
    });

    it('should not render close button when showCloseButton is false', () => {
      fixture.componentRef.setInput('showCloseButton', false);
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.tag-close');
      expect(button).toBeNull();
    });

    it('should emit closed event when close button is clicked', () => {
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();
      const spy = vi.fn();
      component.closed.subscribe(spy);
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.tag-close');
      button.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should stop propagation on close click', () => {
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
      const emitSpy = vi.fn();
      component.closed.subscribe(emitSpy);
      component.onCloseClick(event);
      expect(stopPropagationSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('after icon', () => {
    it('should render after icon when showAfterIcon is true', () => {
      fixture.componentRef.setInput('showAfterIcon', true);
      fixture.componentRef.setInput('afterIcon', 'information');
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector('.tag-icon--leading');
      expect(icon).toBeTruthy();
    });

    it('should not render after icon when showAfterIcon is false', () => {
      fixture.componentRef.setInput('showAfterIcon', false);
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector('.tag-icon--leading');
      expect(icon).toBeNull();
    });
  });

  describe('content projection', () => {
    it('should project content into the label span', () => {
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('.tag-label');
      expect(label).toBeTruthy();
    });
  });

  describe('iconPx', () => {
    it('should return 12 for size small', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.iconPx).toBe(12);
    });

    it('should return 16 for size large', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.iconPx).toBe(16);
    });
  });
});
