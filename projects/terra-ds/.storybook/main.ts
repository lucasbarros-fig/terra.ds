import type { StorybookConfig } from '@storybook/angular';
import type { Configuration } from 'webpack';

/** Alinhar com `STORYBOOK_BASE` em `scripts/compile-scss-to-css.js` (p.ex. GitHub Pages com subpasta /repo/). */
const storybookBase: string = (() => {
  const raw = process.env['STORYBOOK_BASE']?.trim() ?? '';
  if (!raw || raw === '/') {
    return '/';
  }
  return raw.endsWith('/') ? raw : `${raw}/`;
})();

const config: StorybookConfig & { base: string } = {
  base: storybookBase,
  stories: ['../src/lib/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [
    { from: '../.storybook', to: '/.storybook' },
    { from: '../../../node_modules/terra-ds-tokens/dist/solaris/fonts/icons', to: '/fonts' },
    { from: '../src/assets', to: '/assets' },
    { from: '../../../node_modules/@angular/cdk', to: '/cdk' },
  ],
  webpackFinal: async (config: Configuration) => {
    const fontRule = {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name][ext]',
      },
    };

    const rules = config.module?.rules || [];
    if (Array.isArray(rules)) {
      rules.unshift(fontRule);
      config.module!.rules = rules;
    }

    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.extensions) {
      config.resolve.extensions = [];
    }
    if (!config.resolve.extensions.includes('.woff2')) {
      config.resolve.extensions.push('.woff2', '.woff', '.ttf', '.eot', '.otf');
    }

    config.resolve.conditionNames = ['style', '...'];

    config.performance = { hints: false };

    return config;
  },
};
export default config;
