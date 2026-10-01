import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';

import { ColorSliderComponent } from './color-slider.component';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readResource(url: string): Promise<string> {
  return Promise.resolve(readFileSync(resolve(__dirname, url), 'utf-8'));
}

function mockCanvasElementSize(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
  vi.spyOn(HTMLCanvasElement.prototype, 'clientHeight', 'get').mockReturnValue(24);
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, width: 200, height: 24,
    top: 0, right: 200, bottom: 24, left: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

function mockCanvasGetContext(): Record<string, unknown> {
  const gradient = { addColorStop: vi.fn() };

  const ctx: Record<string, unknown> = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    createLinearGradient: vi.fn(() => gradient),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  };

  const offscreenCtx: Record<string, unknown> = {
    fillRect: vi.fn(),
    createLinearGradient: vi.fn(() => gradient),
    fillStyle: '',
  };

  let callCount = 0;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
  ) {
    callCount++;
    if (callCount === 1) return ctx as unknown as CanvasRenderingContext2D;
    return offscreenCtx as unknown as CanvasRenderingContext2D;
  });

  return ctx;
}

describe('ColorSliderComponent', () => {
  let component: ColorSliderComponent;
  let fixture: ComponentFixture<ColorSliderComponent>;
  let ctx: Record<string, unknown>;

  beforeEach(async () => {
    vi.restoreAllMocks();
    mockCanvasElementSize();
    ctx = mockCanvasGetContext();

    await resolveComponentResources(readResource);

    TestBed.configureTestingModule({
      imports: [ColorSliderComponent],
    });
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a canvas element', () => {
    expect(fixture.nativeElement.querySelector('canvas')).toBeTruthy();
  });

  it('should draw the hue gradient on init', () => {
    expect((ctx['drawImage'] as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
    expect((ctx['clearRect'] as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
  });

  it('should emit rgba color on mousedown', () => {
    const spy = vi.fn();
    component.color.subscribe(spy);

    fixture.nativeElement
      .querySelector('canvas')
      ?.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 12 }));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toMatch(/^rgba\(\d+,\d+,\d+,1\)$/);
  });

  it('should not emit on mousemove without mousedown', () => {
    const spy = vi.fn();
    component.color.subscribe(spy);

    fixture.nativeElement
      .querySelector('canvas')
      ?.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 12 }));

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit while dragging', () => {
    const spy = vi.fn();
    component.color.subscribe(spy);

    const canvas = fixture.nativeElement.querySelector('canvas')!;
    canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 12 }));
    const callsAfterDown = spy.mock.calls.length;

    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 12 }));
    expect(spy.mock.calls.length).toBeGreaterThan(callsAfterDown);
  });

  it('should stop emitting after window mouseup', () => {
    const spy = vi.fn();
    component.color.subscribe(spy);

    const canvas = fixture.nativeElement.querySelector('canvas')!;
    canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 12 }));
    const callsAfterDown = spy.mock.calls.length;

    window.dispatchEvent(new MouseEvent('mouseup'));
    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 12 }));
    expect(spy.mock.calls.length).toBe(callsAfterDown);
  });

  it('should position thumb near left when externalHue is 0', () => {
    fixture.componentRef.setInput('externalHue', 0);
    fixture.detectChanges();

    const arcCalls = (ctx['arc'] as ReturnType<typeof vi.fn>).mock.calls.filter(
      (c: unknown[]) => c.length >= 5,
    );
    expect(arcCalls.length).toBeGreaterThan(0);
    const cx = (arcCalls[arcCalls.length - 1] as number[])[0];
    expect(cx).toBeCloseTo(8, 0);
  });

  it('should position thumb near centre when externalHue is 0.5', () => {
    fixture.componentRef.setInput('externalHue', 0.5);
    fixture.detectChanges();

    const arcCalls = (ctx['arc'] as ReturnType<typeof vi.fn>).mock.calls.filter(
      (c: unknown[]) => c.length >= 5,
    );
    expect(arcCalls.length).toBeGreaterThan(0);
    const cx = (arcCalls[arcCalls.length - 1] as number[])[0];
    expect(cx).toBeCloseTo(100, 0);
  });

  it('should position thumb near right when externalHue is 1', () => {
    fixture.componentRef.setInput('externalHue', 1);
    fixture.detectChanges();

    const arcCalls = (ctx['arc'] as ReturnType<typeof vi.fn>).mock.calls.filter(
      (c: unknown[]) => c.length >= 5,
    );
    expect(arcCalls.length).toBeGreaterThan(0);
    const cx = (arcCalls[arcCalls.length - 1] as number[])[0];
    expect(cx).toBeCloseTo(192, 0);
  });
});
