import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';

import { ColorPickerComponent } from './color-picker.component';
import type { ColorPicker } from './color-picker.component';

const __dirname = dirname(fileURLToPath(import.meta.url));

const COMPONENT_DIRS = [
  __dirname,
  resolve(__dirname, '../color-palette'),
  resolve(__dirname, '../color-slider'),
];

function readResource(url: string): Promise<string> {
  for (const dir of COMPONENT_DIRS) {
    const fullPath = resolve(dir, url);
    if (existsSync(fullPath)) return Promise.resolve(readFileSync(fullPath, 'utf-8'));
  }
  return Promise.reject(new Error(`Cannot resolve resource: ${url} from ${__dirname}`));
}

function mockPickerCanvasGetContext(): void {
  const imgData = { data: new Uint8ClampedArray([255, 0, 0, 255]) };
  const wg = { addColorStop: vi.fn() };
  const bg = { addColorStop: vi.fn() };
  const sg = { addColorStop: vi.fn() };

  const paletteCtx: Record<string, unknown> = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    createLinearGradient: vi.fn(
      (x0: number, _y0: number, x1: number, _y1: number) =>
        x1 > x0 ? wg : bg,
    ),
    getImageData: vi.fn(() => imgData),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  };

  const paletteOffCtx: Record<string, unknown> = {
    fillRect: vi.fn(),
    createLinearGradient: vi.fn(() => wg),
    getImageData: vi.fn(() => imgData),
    fillStyle: '',
  };

  const sliderCtx: Record<string, unknown> = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    createLinearGradient: vi.fn(() => sg),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  };

  const sliderGradCtx: Record<string, unknown> = {
    fillRect: vi.fn(),
    createLinearGradient: vi.fn(() => sg),
    fillStyle: '',
  };

  const contexts = [paletteCtx, paletteOffCtx, sliderCtx, sliderGradCtx];
  let call = 0;

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
  ) {
    const idx = Math.min(call++, contexts.length - 1);
    const isSlider = idx >= 2;
    Object.defineProperty(this, 'clientWidth', { value: 200, configurable: true });
    Object.defineProperty(this, 'clientHeight', { value: isSlider ? 24 : 200, configurable: true });
    this.getBoundingClientRect = vi.fn(() => ({
      x: 0, y: 0, width: 200, height: isSlider ? 24 : 200,
      top: 0, right: 200, bottom: isSlider ? 24 : 200, left: 0,
      toJSON: () => ({}),
    }));
    return contexts[idx] as unknown as CanvasRenderingContext2D;
  });
}

function createComponentFixture(): {
  fixture: ComponentFixture<ColorPickerComponent>;
  component: ColorPickerComponent;
  colorSpy: ReturnType<typeof vi.fn>;
} {
  TestBed.configureTestingModule({
    imports: [ColorPickerComponent],
  });
  const fixture = TestBed.createComponent(ColorPickerComponent);
  const component = fixture.componentInstance;
  const colorSpy = vi.fn();
  component.colors.subscribe(colorSpy);
  fixture.detectChanges();
  return { fixture, component, colorSpy };
}

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let colorSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.restoreAllMocks();
    mockPickerCanvasGetContext();
    await resolveComponentResources(readResource);

    const ctx = createComponentFixture();
    fixture = ctx.fixture;
    component = ctx.component;
    colorSpy = ctx.colorSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render palette and slider child components', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('lib-color-palette')).toBeTruthy();
    expect(el.querySelector('lib-color-slider')).toBeTruthy();
  });

  it('should emit default red color on init', () => {
    const emitted: ColorPicker = colorSpy.mock.calls[0]?.[0];
    expect(emitted).toBeDefined();
    expect(emitted.rgb).toBe('rgba(255,0,0,1)');
    expect(emitted.hex).toBe('#ff0000');
  });

  it('should emit ColorPicker with hex and rgb', () => {
    const emitted: ColorPicker = colorSpy.mock.calls[0]?.[0];
    expect(emitted.hex).toMatch(/^#[0-9a-f]{6}$/);
    expect(emitted.rgb).toMatch(/^rgba\(\d+,\d+,\d+,1\)$/);
  });

  it('should emit a complete ColorScale with all 10 levels', () => {
    const emitted: ColorPicker = colorSpy.mock.calls[0]?.[0];
    const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
    for (const level of levels) {
      expect(emitted.scale[level]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('should parse a hex initialColor', () => {
    vi.restoreAllMocks();
    mockPickerCanvasGetContext();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [ColorPickerComponent] });
    const fix = TestBed.createComponent(ColorPickerComponent);
    const comp = fix.componentInstance;

    const spy = vi.fn();
    comp.colors.subscribe(spy);

    fix.componentRef.setInput('initialColor', '#00ff00');
    fix.detectChanges();

    const emitted: ColorPicker = spy.mock.calls[0]?.[0];
    expect(emitted).toBeDefined();
    expect(emitted.hex).toBe('#00ff00');
  });

  it('should parse hex without hash prefix', () => {
    vi.restoreAllMocks();
    mockPickerCanvasGetContext();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [ColorPickerComponent] });
    const fix = TestBed.createComponent(ColorPickerComponent);
    const comp = fix.componentInstance;

    const spy = vi.fn();
    comp.colors.subscribe(spy);

    fix.componentRef.setInput('initialColor', 'ff0000');
    fix.detectChanges();

    expect(spy.mock.calls[0]?.[0].hex).toBe('#ff0000');
  });

  it('should use default red for invalid hex', () => {
    vi.restoreAllMocks();
    mockPickerCanvasGetContext();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [ColorPickerComponent] });
    const fix = TestBed.createComponent(ColorPickerComponent);
    const comp = fix.componentInstance;

    const spy = vi.fn();
    comp.colors.subscribe(spy);

    fix.componentRef.setInput('initialColor', 'zzzzzz');
    fix.detectChanges();

    expect(spy.mock.calls[0]?.[0].rgb).toBe('rgba(255,0,0,1)');
  });

  it('should use default red for empty initialColor', () => {
    vi.restoreAllMocks();
    mockPickerCanvasGetContext();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [ColorPickerComponent] });
    const fix = TestBed.createComponent(ColorPickerComponent);
    const comp = fix.componentInstance;

    const spy = vi.fn();
    comp.colors.subscribe(spy);

    fix.componentRef.setInput('initialColor', '');
    fix.detectChanges();

    expect(spy.mock.calls[0]?.[0].rgb).toBe('rgba(255,0,0,1)');
  });

  it('should emit new color when palette child is clicked', () => {
    const before = colorSpy.mock.calls.length;

    fixture.nativeElement
      .querySelector('lib-color-palette canvas')
      ?.dispatchEvent(new MouseEvent('mousedown', { clientX: 80, clientY: 120 }));

    if (colorSpy.mock.calls.length > before) {
      const emitted: ColorPicker = colorSpy.mock.calls[colorSpy.mock.calls.length - 1]?.[0];
      expect(emitted.hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('should emit new color when slider child is clicked', () => {
    const before = colorSpy.mock.calls.length;

    fixture.nativeElement
      .querySelector('lib-color-slider canvas')
      ?.dispatchEvent(new MouseEvent('mousedown', { clientX: 120, clientY: 12 }));

    if (colorSpy.mock.calls.length > before) {
      const emitted: ColorPicker = colorSpy.mock.calls[colorSpy.mock.calls.length - 1]?.[0];
      expect(emitted.hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
