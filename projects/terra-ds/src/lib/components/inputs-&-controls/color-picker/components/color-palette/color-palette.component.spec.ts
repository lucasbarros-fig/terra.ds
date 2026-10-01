import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';

import { ColorPaletteComponent } from './color-palette.component';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readResource(url: string): Promise<string> {
  return Promise.resolve(readFileSync(resolve(__dirname, url), 'utf-8'));
}

function mockCanvasElementSize(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
  vi.spyOn(HTMLCanvasElement.prototype, 'clientHeight', 'get').mockReturnValue(200);
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, width: 200, height: 200,
    top: 0, right: 200, bottom: 200, left: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

function mockPaletteCanvasGetContext(): {
  paletteCtx: Record<string, unknown>;
  offscreenCtx: Record<string, unknown>;
} {
  const whiteGrad = { addColorStop: vi.fn() };
  const blackGrad = { addColorStop: vi.fn() };
  const imageData = { data: new Uint8ClampedArray([100, 150, 200, 255]) };

  const paletteCtx: Record<string, unknown> = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    createLinearGradient: vi.fn(
      (x0: number, _y0: number, x1: number, _y1: number) =>
        x1 > x0 ? whiteGrad : blackGrad,
    ),
    getImageData: vi.fn(() => imageData),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  };

  const offscreenCtx: Record<string, unknown> = {
    fillRect: vi.fn(),
    createLinearGradient: vi.fn(() => whiteGrad),
    getImageData: vi.fn(() => imageData),
    fillStyle: '',
  };

  let callCount = 0;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
  ) {
    callCount++;
    if (callCount === 1) return paletteCtx as unknown as CanvasRenderingContext2D;
    return offscreenCtx as unknown as CanvasRenderingContext2D;
  });

  return { paletteCtx, offscreenCtx };
}

describe('ColorPaletteComponent', () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;
  let paletteCtx: Record<string, unknown>;

  beforeEach(async () => {
    vi.restoreAllMocks();
    mockCanvasElementSize();
    const mocks = mockPaletteCanvasGetContext();
    paletteCtx = mocks.paletteCtx;

    await resolveComponentResources(readResource);

    TestBed.configureTestingModule({
      imports: [ColorPaletteComponent],
    });
    fixture = TestBed.createComponent(ColorPaletteComponent);
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

  it('should draw the saturation/value gradient on init', () => {
    expect((paletteCtx['drawImage'] as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
    expect((paletteCtx['clearRect'] as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
  });

  it('should emit rgba color on mousedown', () => {
    const spy = vi.fn();
    component.color.subscribe(spy);

    fixture.nativeElement
      .querySelector('canvas')
      ?.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toMatch(/^rgba\(\d+,\d+,\d+,1\)$/);
  });

  it('should not emit on mousemove without mousedown', () => {
    const spy = vi.fn();
    component.color.subscribe(spy);

    fixture.nativeElement
      .querySelector('canvas')
      ?.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit while dragging', () => {
    const spy = vi.fn();
    component.color.subscribe(spy);

    const canvas = fixture.nativeElement.querySelector('canvas')!;
    canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));
    const callsAfterDown = spy.mock.calls.length;

    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }));
    expect(spy.mock.calls.length).toBeGreaterThan(callsAfterDown);
  });

  it('should stop emitting after window mouseup', () => {
    const spy = vi.fn();
    component.color.subscribe(spy);

    const canvas = fixture.nativeElement.querySelector('canvas')!;
    canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));
    const callsAfterDown = spy.mock.calls.length;

    window.dispatchEvent(new MouseEvent('mouseup'));
    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }));
    expect(spy.mock.calls.length).toBe(callsAfterDown);
  });
});
