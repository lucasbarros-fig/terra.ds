import {
  STORYBOOK_BRAND_TOOLBAR_ITEMS,
  TEDDY_STORYBOOK_BRANDS,
  TEDDY_STORYBOOK_DEFAULT_BRAND,
  type TeddyStorybookBrand,
} from './storybook-brands.generated';

export {
  STORYBOOK_BRAND_TOOLBAR_ITEMS,
  TEDDY_STORYBOOK_BRANDS,
  TEDDY_STORYBOOK_DEFAULT_BRAND,
  type TeddyStorybookBrand,
};

export const TEDDY_STORYBOOK_THEMES = ['light', 'dark'] as const;

export type TeddyStorybookTheme = (typeof TEDDY_STORYBOOK_THEMES)[number];

export function isTeddyStorybookBrand(value: string | undefined | null): value is TeddyStorybookBrand {
  return (
    value !== null && value !== undefined &&
    (TEDDY_STORYBOOK_BRANDS as readonly string[]).includes(value)
  );
}
