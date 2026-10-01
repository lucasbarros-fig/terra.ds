# Terra Design System

Biblioteca de componentes Angular do **The House** (`@teddy-conkey/terra-ds`), com Storybook.
Mesma base de componentes do Plutão DS, com os tokens da marca `solaris-theHouse`
(`@teddy-conkey/conkey-ds-tokens`). Figma: Terra.ds | Components.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run storybook` | Storybook local em http://localhost:6006 |
| `npm run build-storybook` | Gera o Storybook estático em `storybook-static-terra/` |
| `npm run build:terra-ds` | Build da lib em `dist/terra-ds` |
| `npm run test` | Testes unitários (Vitest) |
| `npm run lint` | ESLint + Stylelint |

## Tokens

As cores vêm de `@teddy-conkey/conkey-ds-tokens` (`dist/solaris/styles/theHouse`).
Depois de atualizar o pacote de tokens, rode `npm run compile:styles` e `npm run sync:icon-types`.

## Deploy

Push na `main` publica o Storybook no GitHub Pages (`.github/workflows/deploy-pages.yml`).
