/**
 * Constrói Phosphor glyph-name → slug linear (`.solaris-{slug}-linear`) via codepoint
 * comum entre `selection.json` e `solaris-icons.svg`.
 */
const fs = require('fs');
const path = require('path');

const TOKENS = path.join(
  __dirname,
  '../node_modules/@teddy-conkey/conkey-ds-tokens/dist/solaris',
);
const SVG = path.join(TOKENS, 'fonts/icons/solaris-icons.svg');
const SELECTION = path.join(TOKENS, 'fonts/icons/selection.json');

function parseSvgGlyphNamesToCode(svgText) {
  /** @type {Map<string, number>} */
  const nameToCode = new Map();
  const re =
    /<glyph\s+unicode="&#x([0-9a-fA-F]+);"\s+glyph-name="([^"]+)"/g;
  let m;
  while ((m = re.exec(svgText)) !== null) {
    const code = parseInt(m[1], 16);
    const glyphName = m[2];
    nameToCode.set(glyphName, code);
  }
  return nameToCode;
}

function parseSelectionSlugToCode(selectionPath) {
  const raw = JSON.parse(fs.readFileSync(selectionPath, 'utf8'));
  const icons = raw.icons || [];
  /** @type {Map<number, string>} */
  const codeToSlug = new Map();
  for (const entry of icons) {
    const name = entry && entry.properties && entry.properties.name;
    const code = entry && entry.properties && entry.properties.code;
    if (typeof name !== 'string' || !name.endsWith('-linear')) continue;
    if (typeof code !== 'number') continue;
    const slug = name.slice(0, -'-linear'.length);
    codeToSlug.set(code, slug);
  }
  return codeToSlug;
}

/**
 * @returns {Record<string, string>}
 */
function buildLinearSlugBySolarisIconType() {
  if (!fs.existsSync(SVG) || !fs.existsSync(SELECTION)) {
    throw new Error(
      'Tokens: solaris-icons.svg ou selection.json não encontrados (npm install?).',
    );
  }
  const svg = fs.readFileSync(SVG, 'utf8');
  const phosphorToCode = parseSvgGlyphNamesToCode(svg);
  const codeToSlug = parseSelectionSlugToCode(SELECTION);

  /** @type {Record<string, string>} */
  const phosphorToSlug = {};
  for (const [phosphorName, code] of phosphorToCode) {
    const slug = codeToSlug.get(code);
    if (slug) {
      phosphorToSlug[phosphorName] = slug;
    }
  }
  return phosphorToSlug;
}

module.exports = { buildLinearSlugBySolarisIconType };
