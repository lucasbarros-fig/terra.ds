import type { SolarisIconType } from 'terra-ds-tokens/dist/solaris/types/icon';
import solarisTypesCatalog from '../data/solaris-types.generated.json';

export const solarisIconTypes =
  solarisTypesCatalog.solarisIconTypes as readonly SolarisIconType[];

export type { SolarisIconType };

export function solarisIconInputToStyleCssSuffix(name: string): string {
  const raw = String(name).trim();
  if (!raw) {
    return 'Triangle';
  }
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw)) {
    return raw
      .split('-')
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join('');
  }
  return raw;
}

export const ICON_SIZES = [8, 12, 16, 20, 24, 32] as const;

export type IconSizeType = (typeof ICON_SIZES)[number];

export {
  ICON_COLOR_TOKENS,
  ICON_COLOR_TOKEN_NAMES,
  resolveIconColor,
} from './icon-color';
export type { IconColorType, IconColorTokenType } from './icon-color';
 