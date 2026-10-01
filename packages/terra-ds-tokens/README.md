# terra-ds-tokens

Build dos tokens Solaris da marca The House usado pelo Terra DS:

- `dist/solaris/styles/theHouse/` — variáveis CSS (light, dark, global)
- `dist/solaris/fonts/icons/` — fonte de ícones Solaris
- `dist/solaris/types/icon.ts` — lista de ícones
- `tokens.json` — fonte (variáveis do Figma Terra.ds)

Para atualizar: edite `tokens.json` (variáveis do Figma Terra.ds), gere o build com
Style Dictionary e substitua as pastas acima. Depois, neste repo:
`npm install && npm run compile:styles && npm run sync:icon-types`.
