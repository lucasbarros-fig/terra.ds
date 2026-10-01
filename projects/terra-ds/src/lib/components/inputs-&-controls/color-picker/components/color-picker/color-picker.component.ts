import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
} from '@angular/core';

import { ColorPaletteComponent, ColorSliderComponent } from '../../components';
import {
  hexToRgba,
  hsvToRgb,
  normalizeHexInput,
  parseRgb,
  rgbToHex,
  rgbToHsv,
} from '../../utils/color-converter';
import { buildColorScale, type ColorScale } from '../../utils/color-scale';

export type { ColorScale } from '../../utils/color-scale';

export interface ColorPicker {
  rgb: string;
  hex: string;
  scale: ColorScale;
}

@Component({
  selector: 'lib-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-terra-ds': '' },
  imports: [ColorPaletteComponent, ColorSliderComponent],
})
export class ColorPickerComponent implements OnChanges, AfterViewInit {
  private static readonly DEFAULT_HUE_RGBA = 'rgba(255,0,0,1)';

  readonly initialColor = input('');
  readonly colors = output<ColorPicker>();

  protected hue = ColorPickerComponent.DEFAULT_HUE_RGBA;
  protected color = '';
  protected externalHue: number | null = 0;
  protected paletteSyncRgb = '';

  ngOnChanges(changes: SimpleChanges): void {
    const ic = changes['initialColor'];
    if (!ic) return;
    const raw = ic.currentValue;
    if (raw === undefined || raw === null || String(raw).trim() === '') return;
    const normalized = normalizeHexInput(String(raw));
    if (!normalized) return;
    const rgb = hexToRgba(normalized);
    if (!rgb) return;
    this.applyParsedRgb(rgb);
  }

  ngAfterViewInit(): void {
    this.bootstrapDefaultColorIfNeeded();
  }

  private bootstrapDefaultColorIfNeeded(): void {
    if (this.color) return;
    const rgb = this.hue;
    this.color = rgb;
    this.paletteSyncRgb = rgb;
    this.emit(rgb);
  }

  applyFromHex(normalizedWithHash: string): void {
    const rgb = hexToRgba(normalizedWithHash);
    if (!rgb) return;
    this.applyParsedRgb(rgb);
  }

  protected setHue(rgb: string): void {
    this.hue = rgb;
    this.color = rgb;
    this.patchExternalHueFromRgb(rgb);
    if (!this.paletteSyncRgb) {
      this.paletteSyncRgb = rgb;
    }
    this.emit(rgb);
  }

  protected setColor(rgb: string): void {
    this.applyParsedRgb(rgb);
  }

  private applyParsedRgb(rgb: string): void {
    const p = parseRgb(rgb);
    if (!p) return;
    const { h } = rgbToHsv(p[0], p[1], p[2]);
    const pure = hsvToRgb(h, 1, 1);
    this.hue = `rgba(${pure.r},${pure.g},${pure.b},1)`;
    this.color = rgb;
    this.paletteSyncRgb = rgb;
    this.patchExternalHueFromRgb(rgb);
    this.emit(rgb);
  }

  private patchExternalHueFromRgb(rgb: string): void {
    const p = parseRgb(rgb);
    if (!p) {
      this.externalHue = null;
      return;
    }
    this.externalHue = rgbToHsv(p[0], p[1], p[2]).h / 360;
  }

  private emit(rgb: string): void {
    const parsed = parseRgb(rgb);
    if (!parsed) return;
    const [r, g, b] = parsed;
    const hex = rgbToHex(r, g, b);
    const scale = buildColorScale(r, g, b);
    this.colors.emit({ rgb, hex, scale });
  }
}
