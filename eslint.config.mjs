// @ts-check
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import templateParser from '@angular-eslint/template-parser';

export default tseslint.config(
  // ─── Ignores globais ─────────────────────────────────────────────────────────
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'storybook-static/**',
      'storybook-static-terra/**',
      '.angular/**',
      'coverage/**',
      'scripts/**',
      '**/*.d.ts',
      '**/*.spec.ts',
      // Storybook builder configs are webpack/Node files not covered by tsconfig
      'projects/terra-ds/.storybook/main.ts',
      // terra-ds spec files: tsconfig.spec.json is not named tsconfig.json so
      // projectService cannot auto-discover it; root tsconfig excludes **/*.spec.ts
      'projects/terra-ds/src/**/*.spec.ts',
    ],
  },

  // ─── Arquivos TypeScript ──────────────────────────────────────────────────────
  {
    files: ['projects/**/*.ts'],
    extends: [...tseslint.configs.recommended],
    plugins: {
      '@angular-eslint': angular,
    },
    languageOptions: {
      parserOptions: {
        // projectService discovers tsconfig per-file (lib + storybook tsconfigs)
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Angular: boas práticas de classes ──────────────────────────────────
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/contextual-lifecycle': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/no-outputs-metadata-property': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@angular-eslint/template/label-has-associated-control': 'off',


      // ── Angular: nomenclatura de seletores (prefixo 'lib' conforme angular.json) ─
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'lib', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'lib', style: 'camelCase' },
      ],

      // ── TypeScript: qualidade de código ───────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        { accessibility: 'no-public' },
      ],

      // ── Boas práticas gerais ──────────────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },

  // ─── Specs Vitest (globals) ───────────────────────────────────────────────────
  {
    files: ['projects/**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },

  // ─── Templates Angular (HTML) ─────────────────────────────────────────────────
  {
    files: ['projects/**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    languageOptions: {
      parser: templateParser,
    },
    rules: {
      // ── Template: correção de bugs ────────────────────────────────────────
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/eqeqeq': ['warn', { allowNullOrUndefined: true }],
      '@angular-eslint/template/no-negated-async': 'warn',
      '@angular-eslint/template/no-any': 'warn',

      // ── Template: acessibilidade ─────────────────────────────────────────
      '@angular-eslint/template/alt-text': 'warn',
      '@angular-eslint/template/click-events-have-key-events': 'warn',
      '@angular-eslint/template/mouse-events-have-key-events': 'warn',
      '@angular-eslint/template/interactive-supports-focus': 'warn',
      '@angular-eslint/template/elements-content': 'warn',
      '@angular-eslint/template/role-has-required-aria': 'warn',
      '@angular-eslint/template/valid-aria': 'warn',
      '@angular-eslint/template/label-has-associated-control': 'off',
    },
  },
);
