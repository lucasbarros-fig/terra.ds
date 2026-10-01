# Terra Design System

Biblioteca de componentes Angular do **The House** (`terra-ds`), com Storybook.
Tokens da marca The House (`solaris-theHouse`) no pacote local `terra-ds-tokens`. Figma: Terra.ds | Components.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run storybook` | Storybook local em http://localhost:6006 |
| `npm run build-storybook` | Gera o Storybook estático em `storybook-static-terra/` |
| `npm run build:terra-ds` | Build da lib em `dist/terra-ds` |
| `npm run test` | Testes unitários (Vitest) |
| `npm run lint` | ESLint + Stylelint |

## Tokens

Os tokens da marca The House ficam dentro deste repo, em `packages/terra-ds-tokens`
(instalados como `terra-ds-tokens` via `file:`). Veja `packages/terra-ds-tokens/README.md` para atualizar.

## Deploy

Push na `main` publica o Storybook no GitHub Pages (`.github/workflows/deploy-pages.yml`):
https://lucasbarros-fig.github.io/terra.ds/

No GitHub: **Settings → Pages → Source: GitHub Actions**.
