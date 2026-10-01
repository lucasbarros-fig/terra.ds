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

Os tokens da marca The House ficam dentro deste repo, em `packages/conkey-ds-tokens`
(instalados como `@teddy-conkey/conkey-ds-tokens` via `file:`), então não é preciso acesso
ao registry da Teddy-Conkey. Veja `packages/conkey-ds-tokens/README.md` para atualizar.

## Deploy

Push na `main` publica o Storybook no GitHub Pages (`.github/workflows/deploy-pages.yml`):
https://lucasbarros-fig.github.io/terra.ds/

No GitHub: **Settings → Pages → Source: GitHub Actions**.
