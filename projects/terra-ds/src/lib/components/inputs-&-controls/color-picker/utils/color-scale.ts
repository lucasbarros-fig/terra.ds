import { hsvToRgb, rgbToHex, rgbToHsv } from './color-converter';

export const COLOR_SCALE_DISPLAY_LEVELS = [400, 600, 700, 800, 900, 950] as const;
export type ColorScaleDisplayLevel = (typeof COLOR_SCALE_DISPLAY_LEVELS)[number];

export type ColorScale = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

const SHADE_V_MULTIPLIERS: Record<600 | 700 | 800 | 900 | 950, number> = {
  600: 0.837,
  700: 0.645,
  800: 0.453,
  900: 0.262,
  950: 0.15,
};

const TINT_V_OFFSETS: Record<100 | 200 | 300 | 400, number> = {
  100: 0.9,
  200: 0.74,
  300: 0.48,
  400: 0.24,
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function scaleValueFromHsv(h: number, s: number, v: number, level: keyof ColorScale): string {
  let nextV = v;

  if (level === 500) {
    nextV = v;
  } else if (level in TINT_V_OFFSETS) {
    const offset = TINT_V_OFFSETS[level as keyof typeof TINT_V_OFFSETS];
    nextV = v + (1 - v) * offset;
  } else {
    const multiplier = SHADE_V_MULTIPLIERS[level as keyof typeof SHADE_V_MULTIPLIERS];
    nextV = v * multiplier;
  }

  const { r, g, b } = hsvToRgb(h, s, clamp01(nextV));
  return rgbToHex(r, g, b);
}

export function buildColorScale(r: number, g: number, b: number): ColorScale {
  const { h, s, v } = rgbToHsv(r, g, b);
  const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  return levels.reduce(
    (scale, level) => {
      scale[level] = scaleValueFromHsv(h, s, v, level);
      return scale;
    },
    {} as ColorScale,
  );
}
