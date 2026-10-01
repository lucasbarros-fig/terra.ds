import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    });
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the indicator arc over a full ring track', () => {
    const svg: SVGElement | null = fixture.nativeElement.querySelector('svg.lib-spinner');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 20 20');
    expect(svg?.querySelector('.lib-spinner__indicator')).toBeTruthy();

    // O track é um anel de 2px (r=9 + stroke 2 cobre o raio 8..10 do arco), não um disco preenchido.
    const track = svg?.querySelector('.lib-spinner__track');
    expect(track?.getAttribute('r')).toBe('9');
    expect(track?.getAttribute('stroke-width')).toBe('2');
    expect(track?.getAttribute('fill')).toBe('none');
  });

  it('should default to 20px', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.style.getPropertyValue('--lib-spinner-size')).toBe('20px');
  });

  it('should apply the size input to the host', () => {
    fixture.componentRef.setInput('size', 32);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.style.getPropertyValue('--lib-spinner-size')).toBe('32px');
  });

  it('should be decorative when no ariaLabel is provided', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.getAttribute('role')).toBeNull();
  });

  it('should be announced when an ariaLabel is provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Carregando');
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.getAttribute('role')).toBe('status');
    expect(host.getAttribute('aria-label')).toBe('Carregando');
    expect(host.getAttribute('aria-hidden')).toBeNull();
  });
});
