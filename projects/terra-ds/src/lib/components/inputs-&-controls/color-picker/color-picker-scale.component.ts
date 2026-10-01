import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputTextComponent } from '../input-text/input-text.component';
import {
  ColorPicker,
  ColorPickerComponent,
} from './components/color-picker/color-picker.component';
import { normalizeHexInput } from './utils/color-converter';
import {
  COLOR_SCALE_DISPLAY_LEVELS,
  type ColorScaleDisplayLevel,
} from './utils/color-scale';

@Component({
  selector: 'lib-color-picker-scale',
  templateUrl: './color-picker-scale.component.html',
  styleUrls: ['./color-picker-scale.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-terra-ds': '' },
  imports: [FormsModule, ColorPickerComponent, InputTextComponent],
})
export class ColorPickerScaleComponent {
  readonly initialColor = input('');
  readonly displayScale = input(true);
  readonly colors = output<ColorPicker>();

  @ViewChild(ColorPickerComponent) private picker?: ColorPickerComponent;

  protected hexField = '';
  protected hexInvalid = false;
  protected scaleStrip: { level: ColorScaleDisplayLevel; hex: string }[] = [];
  protected previewRgb = '';

  private lastCommittedHex = '';

  get isScaleVisible(): boolean {
    return this.displayScale() && !!this.scaleStrip.length;
  }

  protected onPickerColors(ev: ColorPicker): void {
    this.previewRgb = ev.rgb;
    this.hexField = ev.hex.replace(/^#/, '').toUpperCase();
    this.lastCommittedHex = this.hexField;
    this.hexInvalid = false;
    this.scaleStrip = COLOR_SCALE_DISPLAY_LEVELS.map((level) => ({
      level,
      hex: ev.scale[level],
    }));
    this.colors.emit(ev);
  }

  protected onHexInput(): void {
    this.hexInvalid = false;
  }

  protected onHexFieldFocusOut(event: FocusEvent): void {
    const root = event.currentTarget as HTMLElement | null;
    const next = event.relatedTarget as Node | null;
    if (next && root?.contains(next)) return;
    this.commitHexInput();
  }

  protected onHexEnter(evt: Event): void {
    evt.preventDefault();
    this.commitHexInput();
  }

  protected onToneSelect(hex: string): void {
    const normalized = normalizeHexInput(hex);
    if (!normalized) return;
    this.picker?.applyFromHex(normalized);
  }

  private commitHexInput(): void {
    const normalized = normalizeHexInput(this.hexField);
    if (!normalized) {
      this.hexInvalid = true;
      this.hexField = this.lastCommittedHex;
      return;
    }
    this.hexInvalid = false;
    this.picker?.applyFromHex(normalized);
  }
}
