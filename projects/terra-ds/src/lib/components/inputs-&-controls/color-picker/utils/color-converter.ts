const HEX_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i;

export interface Hsv {
  h: number;
  s: number;
  v: number;
}

export function hexToRgba(hex: string): string | null {
  const match = HEX_REGEX.exec(hex);
  if (!match) return null;
  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);
  return `rgba(${r},${g},${b},1)`;
}

/** 
 * Aceita `RRGGBB` ou `#RRGGBB`; devolve `#rrggbb` ou null. 
*/
export function normalizeHexInput(raw: string): string | null {
  const t = raw.trim().replace(/^#/, '');
  if (!/^[a-f\d]{6}$/i.test(t)) return null;
  return `#${t.toLowerCase()}`;
}

export function parseRgb(rgb: string): [number, number, number] | null {
  const match = RGB_REGEX.exec(rgb);
  return match ? [+match[1], +match[2], +match[3]] : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function toHex(value: number): string {
  return Math.min(255, Math.max(0, Math.round(value))).toString(16).padStart(2, '0');
}

export function rgbToHsv(r: number, g: number, b: number): Hsv {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = 60 * (((gn - bn) / d + 6) % 6);
    else if (max === gn) h = 60 * ((bn - rn) / d + 2);
    else h = 60 * ((rn - gn) / d + 4);
  }
  if (h >= 360) h -= 360;
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const hn = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = v - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hn < 60) [rp, gp, bp] = [c, x, 0];
  else if (hn < 120) [rp, gp, bp] = [x, c, 0];
  else if (hn < 180) [rp, gp, bp] = [0, c, x];
  else if (hn < 240) [rp, gp, bp] = [0, x, c];
  else if (hn < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}
