import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipComponent } from '../../layout-&-structure/tooltip/tooltip.component';
import { LabelComponent } from './label.component';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LabelComponent],
    });
    fixture = TestBed.createComponent(LabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getContainer(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.container-label');
  }

  function getLabel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('label');
  }

  function getOptionalText(): HTMLElement | null {
    return fixture.nativeElement.querySelector('label > small');
  }

  function getDescription(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.container-label > span');
  }

  function getTooltip(): HTMLElement | null {
    return fixture.nativeElement.querySelector('lib-tooltip');
  }

  function getSkeleton(): HTMLElement | null {
    return fixture.nativeElement.querySelector('lib-skeleton');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label container when skeleton is false', () => {
    expect(getContainer()).toBeTruthy();
    expect(getLabel()).toBeTruthy();
  });

  it('should render projected content inside the label', () => {
    expect(getLabel()?.textContent).toBeDefined();
  });

  it('should display "(opcional)" text when optional is true', () => {
    fixture.componentRef.setInput('optional', true);
    fixture.detectChanges();

    const small = getOptionalText();
    expect(small).toBeTruthy();
    expect(small?.textContent?.trim()).toBe('(opcional)');
  });

  it('should not display "(opcional)" text when optional is false', () => {
    fixture.componentRef.setInput('optional', false);
    fixture.detectChanges();

    expect(getOptionalText()).toBeNull();
  });

  it('should render skeleton when skeleton is true', () => {
    fixture.componentRef.setInput('skeleton', true);
    fixture.detectChanges();

    expect(getContainer()).toBeNull();
    expect(getSkeleton()).toBeTruthy();
  });

  it('should render description when description input is provided', () => {
    fixture.componentRef.setInput('description', 'Texto de apoio');
    fixture.detectChanges();

    const span = getDescription();
    expect(span).toBeTruthy();
    expect(span?.textContent?.trim()).toBe('Texto de apoio');
  });

  it('should not render description when description is empty', () => {
    fixture.componentRef.setInput('description', '');
    fixture.detectChanges();

    expect(getDescription()).toBeNull();
  });

  it('should render tooltip when tooltipText is provided', () => {
    fixture.componentRef.setInput('tooltipText', 'Dica útil');
    fixture.detectChanges();

    expect(getTooltip()).toBeTruthy();
  });

  it('should not render tooltip when tooltipText is empty', () => {
    fixture.componentRef.setInput('tooltipText', '');
    fixture.detectChanges();

    expect(getTooltip()).toBeNull();
  });

  it('should render tooltip trigger icon at size 16 via triggerSize input', () => {
    fixture.componentRef.setInput('tooltipText', 'Dica de tamanho');
    fixture.detectChanges();

    const tooltipDebug = fixture.debugElement.query(By.directive(TooltipComponent));
    expect(tooltipDebug).toBeTruthy();

    const tooltipInstance = tooltipDebug.componentInstance as TooltipComponent;
    expect(tooltipInstance.triggerSize).toBe(16);
  });

  it('should render tooltip icon with font-size 16px in the DOM', () => {
    fixture.componentRef.setInput('tooltipText', 'Dica de tamanho');
    fixture.detectChanges();

    const iconEl = fixture.nativeElement.querySelector('lib-tooltip lib-icon i');
    expect(iconEl).toBeTruthy();
    expect(iconEl?.style.fontSize).toBe('16px');
  });

  it('should return true from hasDescription when description is non-empty', () => {
    fixture.componentRef.setInput('description', 'Ajuda');
    fixture.detectChanges();

    expect(component.hasDescription()).toBe(true);
  });

  it('should return false from hasDescription when description is empty', () => {
    fixture.componentRef.setInput('description', '');
    fixture.detectChanges();

    expect(component.hasDescription()).toBe(false);
  });

  it('should return false from hasDescription when description is only whitespace', () => {
    fixture.componentRef.setInput('description', '   ');
    fixture.detectChanges();

    expect(component.hasDescription()).toBe(false);
  });

  it('should return true from hasTooltip when tooltipText is non-empty', () => {
    fixture.componentRef.setInput('tooltipText', 'Info');
    fixture.detectChanges();

    expect(component.hasTooltip()).toBe(true);
  });

  it('should return false from hasTooltip when tooltipText is empty', () => {
    fixture.componentRef.setInput('tooltipText', '');
    fixture.detectChanges();

    expect(component.hasTooltip()).toBe(false);
  });

  it('should not render tooltip when tooltipText is only whitespace', () => {
    fixture.componentRef.setInput('tooltipText', '   ');
    fixture.detectChanges();

    expect(component.hasTooltip()).toBe(false);
    expect(getTooltip()).toBeNull();
  });

  it('should render both tooltip and description simultaneously', () => {
    fixture.componentRef.setInput('tooltipText', 'Dica');
    fixture.componentRef.setInput('description', 'Descrição');
    fixture.detectChanges();

    expect(getTooltip()).toBeTruthy();
    expect(getDescription()).toBeTruthy();
  });

  it('should have default values for optional, skeleton, description, and tooltipText', () => {
    expect(component.optional()).toBe(false);
    expect(component.skeleton()).toBe(false);
    expect(component.description()).toBe('');
    expect(component.tooltipText()).toBe('');
  });

  it('should apply host data attribute for terra-ds', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-terra-ds')).toBe('');
  });
});
