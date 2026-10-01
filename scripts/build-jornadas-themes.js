/**
 * Gera projects/jornadas/src/themes.css: tokens de cor do Terra (The House) em light e dark,
 * aplicados por html[data-theme="light|dark"].
 */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../node_modules/terra-ds-tokens/dist/solaris/styles/theHouse');
const out = path.join(__dirname, '../projects/jornadas/src/themes.css');
const block = (mode) => fs.readFileSync(path.join(dir, `${mode}.scss`), 'utf8')
  .replace(/:root\s*\{/, `html[data-theme="${mode}"] {`);
fs.writeFileSync(out, `/* Gerado por scripts/build-jornadas-themes.js — não editar. */\n${block('light')}\n${block('dark')}\nhtml[data-theme="dark"] { color-scheme: dark; }\n`);
console.log('themes.css gerado');
