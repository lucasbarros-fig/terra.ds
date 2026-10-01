# Tokens The House (vendorizados)

Cópia do build de `@teddy-conkey/conkey-ds-tokens` só com o que o Terra DS usa:

- `dist/solaris/styles/theHouse/` — variáveis CSS (light, dark, global)
- `dist/solaris/fonts/icons/` — fonte de ícones Solaris
- `dist/solaris/types/icon.ts` — lista de ícones
- `tokens.json` — fonte (variáveis do Figma Terra.ds)

Para atualizar: no repo `conkey-ds-tokens`, edite `tokens/solaris-theHouse/tokens.json`,
rode `npm run build` e copie as pastas acima para cá. Depois, neste repo:
`npm install && npm run compile:styles && npm run sync:icon-types`.
