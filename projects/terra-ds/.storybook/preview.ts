import { setCompodocJson } from '@storybook/addon-docs/angular';
import type { Decorator, Preview } from '@storybook/angular';
import { themes } from 'storybook/theming';
import docJson from '../documentation.json';
import {
	isTeddyStorybookBrand,
	STORYBOOK_BRAND_TOOLBAR_ITEMS,
	TEDDY_STORYBOOK_DEFAULT_BRAND,
	type TeddyStorybookBrand,
} from './storybook-globals';

setCompodocJson(docJson);

/**
 * Terra DS: `data-theme` e `data-brand` na toolbar (marca única solaris-theHouse).
 * Tokens: `.storybook/styles.css` (`npm run compile:styles`).
 */
const withTerraStorybookGlobals: Decorator = (storyFn, context) => {
	if (typeof document !== 'undefined') {
		const rawTheme = context.globals['theme'];
		const theme = rawTheme === 'light' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', theme);

		const rawBrand = context.globals['brand'] as string | undefined;
		const brand: TeddyStorybookBrand = isTeddyStorybookBrand(rawBrand)
			? rawBrand
			: TEDDY_STORYBOOK_DEFAULT_BRAND;
		document.documentElement.setAttribute('data-brand', brand);
	}
	return storyFn();
};

const customTheme = {
	...themes.dark,
	brandTitle: 'Terra Design System',
	brandUrl: './',
	fontBase: 'DM Sans, sans-serif',
	fontCode: 'Source Code Pro, monospace',

	colorPrimary: '#2B87D9',
	colorSecondary: '#166CBA',

	appBg: '#202020',
	appContentBg: '#202020',
	appPreviewBg: '#202020',
	appBorderColor: '#404040',

	textColor: 'rgba(255, 255, 255, 1)',
	textMutedColor: 'rgba(255, 255, 255, 0.72)',
	textInverseColor: '#202020',

	barBg: '#2D2D2D',
	barTextColor: 'rgba(255, 255, 255, 1)',
	barSelectedColor: '#2B87D9',
	inputBg: '#2D2D2D',
	inputBorder: '#404040',
	inputTextColor: 'rgba(255, 255, 255, 1)',
	inputBorderRadius: 4,
};

const preview: Preview = {
	decorators: [withTerraStorybookGlobals],
	parameters: {
		options: {
			storySort: {
				order: ['!Primeiros Passos', 'Fundamentos', 'Terra-DS'],
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		backgrounds: {
			default: 'dark',
			values: [
				{ name: 'dark', value: 'var(--color-theme-base, #202020)' },
				{ name: 'light', value: '#ffffff' },
				{ name: 'neutral-strong', value: '#2D2D2D' },
			],
		},
		docs: {
			theme: customTheme,
		},
	},
	globalTypes: {
		theme: {
			description: 'Tema claro ou escuro (tokens semânticos)',
			defaultValue: 'dark',
			toolbar: {
				title: 'Tema',
				icon: 'circlehollow',
				items: [
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' },
				],
				dynamicTitle: true,
			},
		},
		brand: {
			description: 'Marca Terra (tokens solaris-theHouse)',
			defaultValue: TEDDY_STORYBOOK_DEFAULT_BRAND,
			toolbar: {
				title: 'Marca',
				icon: 'component',
				items: STORYBOOK_BRAND_TOOLBAR_ITEMS,
				dynamicTitle: true,
			},
		},
	},
};

export default preview;
