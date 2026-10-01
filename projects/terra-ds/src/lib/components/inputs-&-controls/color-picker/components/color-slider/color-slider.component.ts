import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  SimpleChanges,
  ViewChild,
  input,
  output,
} from '@angular/core';

import { clamp, createOffscreen, getCanvasCoords, rgbaString } from '../../utils/canvas';

type HueStop = readonly [number, number, number];

const HUE_STOPS: readonly HueStop[] = [
  [255, 0, 0],
  [255, 255, 0],
  [0, 255, 0],
  [0, 255, 255],
  [0, 0, 255],
  [255, 0, 255],
  [255, 0, 0],
];
const SEGMENTS = HUE_STOPS.length - 1;

const INDICATOR_DIAMETER = 16;
const INDICATOR_STROKE_WIDTH = 2;
const INDICATOR_PATH_RADIUS = INDICATOR_DIAMETER / 2 - INDICATOR_STROKE_WIDTH / 2;

@Component({
  selector: 'lib-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSliderComponent implements AfterViewInit, OnChanges {
  readonly externalHue = input<number | null>(null);
  readonly color = output<string>();

  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private gradient!: HTMLCanvasElement;
  private mousedown = false;
  private selectedX: number | null = null;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.syncBitmapFromLayout(canvas);
    this.ctx = canvas.getContext('2d')!;
    this.gradient = renderHueGradient(canvas.width, canvas.height);
    this.applyExternalHueFromInput();
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['externalHue'] || !this.ctx) return;
    if (!this.mousedown) {
      this.applyExternalHueFromInput();
      this.draw();
    }
  }

  private applyExternalHueFromInput(): void {
    const hue = this.externalHue();
    if (hue === null || hue === undefined || Number.isNaN(hue)) return;
    const w = this.canvasRef.nativeElement.width;
    if (w < 1) return;
    this.selectedX = clamp(Math.round(hue * (w - 1)), 0, w - 1);
  }

  private syncBitmapFromLayout(canvas: HTMLCanvasElement): void {
    const w = Math.max(1, Math.floor(canvas.clientWidth));
    const h = Math.max(1, Math.floor(canvas.clientHeight));
    canvas.width = w;
    canvas.height = h;
  }

  protected onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.handle(evt.clientX, evt.clientY);
  }

  protected onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) this.handle(evt.clientX, evt.clientY);
  }

  protected onTouchStart(evt: TouchEvent): void {
    evt.preventDefault();
    this.mousedown = true;
    const touch = evt.touches[0];
    this.handle(touch.clientX, touch.clientY);
  }

  protected onTouchMove(evt: TouchEvent): void {
    if (!this.mousedown) return;
    evt.preventDefault();
    const touch = evt.touches[0];
    this.handle(touch.clientX, touch.clientY);
  }

  protected onTouchEnd(): void {
    this.mousedown = false;
  }

  @HostListener('window:mouseup')
  protected onWindowMouseUp(): void {
    this.mousedown = false;
  }

  private handle(clientX: number, clientY: number): void {
    const canvas = this.canvasRef.nativeElement;
    const { x } = getCanvasCoords(canvas, clientX, clientY);
    this.selectedX = x;
    this.draw();
    this.color.emit(sampleHue(x, canvas.width));
  }

  private draw(): void {
    const ctx = this.ctx;
    const { width, height } = this.canvasRef.nativeElement;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(this.gradient, 0, 0);

    if (this.selectedX === null) return;
    const half = INDICATOR_DIAMETER / 2;
    const cx = clamp(this.selectedX, half, width - half);
    const cy = height / 2;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = INDICATOR_STROKE_WIDTH;
    ctx.beginPath();
    ctx.arc(cx, cy, INDICATOR_PATH_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

function renderHueGradient(width: number, height: number): HTMLCanvasElement {
  const offscreen = createOffscreen(width, height);
  const ctx = offscreen.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  HUE_STOPS.forEach(([r, g, b], i) => {
    gradient.addColorStop(i / SEGMENTS, rgbaString(r, g, b));
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  return offscreen;
}

function sampleHue(x: number, width: number): string {
  const t = clamp(x / width, 0, 1);
  const segment = Math.min(SEGMENTS - 1, Math.floor(t * SEGMENTS));
  const localT = t * SEGMENTS - segment;
  const lower = HUE_STOPS[segment];
  const upper = HUE_STOPS[segment + 1];
  const r = Math.round(lower[0] + localT * (upper[0] - lower[0]));
  const g = Math.round(lower[1] + localT * (upper[1] - lower[1]));
  const b = Math.round(lower[2] + localT * (upper[2] - lower[2]));
  return rgbaString(r, g, b);
}
