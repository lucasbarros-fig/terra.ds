export const ICON_COLOR_TOKENS = {
  'static-white': 'var(--color-icons-static-white)',
  'static-black': 'var(--color-icons-static-black)',

  'essential-contrast': 'var(--color-icons-essential-contrast)',
  'essential-high': 'var(--color-icons-essential-high)',
  'essential-medium': 'var(--color-icons-essential-medium)',
  'essential-low': 'var(--color-icons-essential-low)',
  'essential-disabled': 'var(--color-icons-essential-disabled)',

  'support-neutral': 'var(--color-support-colors-neutral)',
  'support-orange': 'var(--color-support-colors-orange)',
  'support-teal': 'var(--color-support-colors-teal)',
  'support-emerald': 'var(--color-support-colors-emerald)',
  'support-red': 'var(--color-support-colors-red)',
  'support-yellow': 'var(--color-support-colors-yellow)',
  'support-pink': 'var(--color-support-colors-pink)',
  'support-cyan': 'var(--color-support-colors-cyan)',
  'support-purple': 'var(--color-support-colors-purple)',
  'support-green': 'var(--color-support-colors-green)',
  'support-blue': 'var(--color-support-colors-blue)',

  'feedback-informative': 'var(--color-state-feedback-informative-surface-base)',
  'feedback-negative': 'var(--color-state-feedback-negative-surface-base)',
  'feedback-warning': 'var(--color-state-feedback-warning-surface-base)',
  'feedback-positive': 'var(--color-state-feedback-positive-surface-base)',
} as const satisfies Record<string, `var(--${string})`>;

export type IconColorTokenType = keyof typeof ICON_COLOR_TOKENS;

export const ICON_COLOR_TOKEN_NAMES = Object.keys(ICON_COLOR_TOKENS) as readonly IconColorTokenType[];

export type IconColorType = IconColorTokenType | 'inherit' | (string & {});

export function resolveIconColor(value: IconColorType): string {
  if (value in ICON_COLOR_TOKENS) {
    return ICON_COLOR_TOKENS[value as IconColorTokenType];
  }
  return value;
}
