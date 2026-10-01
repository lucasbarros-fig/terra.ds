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

import {
  clamp,
  createOffscreen,
  getCanvasCoords,
  rgbaString,
} from '../../utils/canvas';
import { parseRgb, rgbToHsv } from '../../utils/color-converter';

const INDICATOR_DIAMETER = 16;
const INDICATOR_STROKE_WIDTH = 2;
const INDICATOR_PATH_RADIUS = INDICATOR_DIAMETER / 2 - INDICATOR_STROKE_WIDTH / 2;
const DEFAULT_HUE = 'rgba(255,255,255,1)';

@Component({
  selector: 'lib-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
  readonly hue = input('');
  readonly initialColor = input(DEFAULT_HUE);
  readonly selectedColor = input('');

  readonly color = output<string>();

  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private offscreen!: HTMLCanvasElement;
  private offscreenCtx!: CanvasRenderingContext2D;
  private mousedown = false;
  private selected: { x: number; y: number } | null = null;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.syncBitmapFromLayout(canvas);
    this.ctx = canvas.getContext('2d')!;
    this.offscreen = createOffscreen(canvas.width, canvas.height);
    this.offscreenCtx = this.offscreen.getContext('2d')!;
    this.renderGradient();
    if (this.selectedColor()) {
      this.syncSelectionFromSelectedColor();
    } else {
      this.draw();
    }
  }

  private syncBitmapFromLayout(canvas: HTMLCanvasElement): void {
    const w = Math.max(1, Math.floor(canvas.clientWidth));
    const h = Math.max(1, Math.floor(canvas.clientHeight));
    canvas.width = w;
    canvas.height = h;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.offscreenCtx) return;

    const hueChanged = !!changes['hue'] && !changes['hue'].firstChange;
    const selectedChanged = !!changes['selectedColor'];

    if (hueChanged) {
      this.renderGradient();
    }
    if (selectedChanged && !this.mousedown) {
      this.syncSelectionFromSelectedColor();
    } else if (hueChanged) {
      this.draw();
    }
  }

  private syncSelectionFromSelectedColor(): void {
    if (!this.selectedColor()) return;
    const parsed = parseRgb(this.selectedColor());
    if (!parsed) return;
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = canvas;
    if (width < 1 || height < 1) return;

    const { s, v } = rgbToHsv(parsed[0], parsed[1], parsed[2]);
    this.selected = {
      x: clamp(s * (width - 1), 0, width - 1),
      y: clamp((1 - v) * (height - 1), 0, height - 1),
    };
    this.draw();
  }

  protected onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.handle(evt);
  }

  protected onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) this.handle(evt);
  }

  @HostListener('window:mouseup')
  protected onWindowMouseUp(): void {
    this.mousedown = false;
  }

  private handle(evt: MouseEvent): void {
    const { x, y } = getCanvasCoords(this.canvasRef.nativeElement, evt.clientX, evt.clientY);
    this.selected = { x, y };

    const data = this.offscreenCtx.getImageData(x, y, 1, 1).data;
    this.color.emit(rgbaString(data[0], data[1], data[2]));
    this.draw();
  }

  private renderGradient(): void {
    const ctx = this.offscreenCtx;
    const { width, height } = this.offscreen;

    ctx.fillStyle = this.hue() || this.initialColor() || DEFAULT_HUE;
    ctx.fillRect(0, 0, width, height);

    const whiteGrad = ctx.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, width, height);

    const blackGrad = ctx.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, width, height);
  }

  private draw(): void {
    const ctx = this.ctx;
    const { width, height } = this.canvasRef.nativeElement;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(this.offscreen, 0, 0);

    if (!this.selected) return;
    const half = INDICATOR_DIAMETER / 2;
    const cx = clamp(this.selected.x, half, width - half);
    const cy = clamp(this.selected.y, half, height - half);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = INDICATOR_STROKE_WIDTH;
    ctx.beginPath();
    ctx.arc(cx, cy, INDICATOR_PATH_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
