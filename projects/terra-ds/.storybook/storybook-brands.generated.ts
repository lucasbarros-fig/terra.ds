// Gerado por scripts/compile-scss-to-css.js — Terra DS (marca única solaris-theHouse).
// Rode `npm run compile:styles` após atualizar terra-ds-tokens.

export const TEDDY_STORYBOOK_DEFAULT_BRAND = 'solaris-theHouse' as const;

export const TEDDY_STORYBOOK_BRANDS = [
  'solaris-theHouse',
] as const;

export type TeddyStorybookBrand = (typeof TEDDY_STORYBOOK_BRANDS)[number];

export const STORYBOOK_BRAND_TOOLBAR_ITEMS: {
  value: TeddyStorybookBrand;
  title: string;
}[] = [
  { value: 'solaris-theHouse', title: "The House" },
];
