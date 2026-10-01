/**
 * Gera `solaris-types.generated.json` (catálogo de ícones Solaris + mapa slug)
 * a partir de `terra-ds-tokens/dist/solaris/types/icon.ts`.
 * Importado em `icon/utils/theme.ts` com `resolveJsonModule`.
 */
const fs = require('fs');
const path = require('path');
const { buildLinearSlugBySolarisIconType } = require('./build-solaris-icon-type-to-slug.js');

const SRC = path.join(
  __dirname,
  '../node_modules/terra-ds-tokens/dist/solaris/types/icon.ts',
);
const OUT = path.join(
  __dirname,
  '../projects/terra-ds/src/lib/components/layout-&-structure/icon/data/solaris-types.generated.json',
);

function parseIconConstArray(ts, exportName) {
  const m = ts.match(new RegExp(`export const ${exportName} = (\\[[\\s\\S]*?\\])\\s*as const\\s*;`));
  if (!m) throw new Error(`Não foi possível localizar \`export const ${exportName} = [...] as const\`.`);
  const arr = JSON.parse(m[1].replace(/,(\s*[\]\}])/g, '$1'));
  if (!Array.isArray(arr) || !arr.every((x) => typeof x === 'string')) {
    throw new Error('Formato inesperado: esperado array de strings.');
  }
  return arr;
}

try {
  if (!fs.existsSync(SRC)) throw new Error(`Arquivo não encontrado: ${SRC} (npm install?)`);
  const solarisIconTypes = parseIconConstArray(fs.readFileSync(SRC, 'utf8'), 'solarisIconTypes');
  const doc = {
    _comment: 'Gerado por scripts/sync-icon-types-from-tokens.js — não editar manualmente.',
    solarisIconTypes,
    linearSlugBySolarisIconType: buildLinearSlugBySolarisIconType(),
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(doc, null, 2) + '\n', 'utf8');
  console.log('Escrito', OUT, `(${doc.solarisIconTypes.length} tipos)`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
