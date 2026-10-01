/**
 * Compila os estilos do Storybook do Terra DS (The House).
 * Tokens: `terra-ds-tokens/dist/solaris/styles/theHouse` (marca `solaris-theHouse`).
 * Saída: `projects/terra-ds/.storybook/styles.css` + `storybook-brands.generated.ts`.
 *
 * Base de deploy (GitHub Pages em subpasta): `STORYBOOK_BASE_TERRA` ou `STORYBOOK_BASE`.
 */
const sass = require('sass');
const fs = require('fs');
const path = require('path');

const BRAND = 'solaris-theHouse';
const BRAND_FOLDER = 'theHouse';
const BRAND_TITLE = 'The House';

const solarisTokensDist = path.join(
  __dirname,
  '../node_modules/terra-ds-tokens/dist/solaris'
);
const solarisStylesDir = path.join(solarisTokensDist, 'styles');
const solarisFontsDir = path.join(solarisTokensDist, 'fonts');
const solarisIconsStyleCss = path.join(solarisTokensDist, 'fonts/icons/style.css');

const projectDir = path.resolve(__dirname, '../projects/terra-ds');
const stylesDir = path.join(projectDir, 'src/lib/styles');
const storybookDir = path.join(projectDir, '.storybook');
const outputFile = path.join(storybookDir, 'styles.css');
const brandsFile = path.join(storybookDir, 'storybook-brands.generated.ts');

const GOOGLE_FONTS_IMPORT =
  '@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap");\n\n';

function storybookBase() {
  const raw = (process.env.STORYBOOK_BASE_TERRA || process.env.STORYBOOK_BASE || '').trim();
  return raw.replace(/\/$/, '');
}

function fontDir() {
  const b = storybookBase();
  return b ? `${b}/fonts` : '/fonts';
}

function rootToThemeAndBrand(css, theme) {
  return css.replace(/:root\s*\{/g, `html[data-theme="${theme}"][data-brand="${BRAND}"] {`);
}

function compileBrandMode(mode) {
  return sass.compileString(`@use "${BRAND_FOLDER}/${mode}.scss" as *;\n`, {
    loadPaths: [solarisStylesDir],
    style: 'expanded',
  }).css;
}

/** O Sass mantém `@import ".../style.css"`; inline para o Storybook servir fontes e ícones. */
function inlineIconsStyleCss(css) {
  const importRe = /@import\s+["'][^"']*dist\/solaris\/fonts\/icons\/style\.css["']\s*;/g;
  if (!importRe.test(css)) return css;
  importRe.lastIndex = 0;
  if (!fs.existsSync(solarisIconsStyleCss)) {
    console.warn('   Solaris: fonts/icons/style.css não encontrado — @import mantido.');
    return css;
  }
  return css.replace(importRe, fs.readFileSync(solarisIconsStyleCss, 'utf8'));
}

function rewriteIconFontUrls(css) {
  const dir = fontDir();
  return css.replace(/url\(\s*(["']?)([^"')]+?)\1\s*\)/g, (match, _q, rawPath) => {
    const trimmed = rawPath.trim();
    if (/^(https?:|data:)/i.test(trimmed) || trimmed.startsWith('/')) return match;
    const fileBase = path.basename(trimmed.split('?')[0].split('#')[0]);
    if (!/\.(woff2?|ttf|eot|svg|otf)$/i.test(fileBase)) return match;
    const hash = trimmed.includes('#') ? trimmed.slice(trimmed.indexOf('#')) : '';
    return `url("${dir}/${fileBase}${hash}")`;
  });
}

function applyBaseToAbsoluteFontUrls(css) {
  const b = storybookBase();
  if (!b) return css;
  return css.replace(/url\(\s*(['"]?)\/fonts\//g, (_, q) => `url(${q}${b}/fonts/`);
}

function writeBrandsFile() {
  const file = `// Gerado por scripts/compile-scss-to-css.js — Terra DS (marca única ${BRAND}).
// Rode \`npm run compile:styles\` após atualizar terra-ds-tokens.

export const TEDDY_STORYBOOK_DEFAULT_BRAND = '${BRAND}' as const;

export const TEDDY_STORYBOOK_BRANDS = [
  '${BRAND}',
] as const;

export type TeddyStorybookBrand = (typeof TEDDY_STORYBOOK_BRANDS)[number];

export const STORYBOOK_BRAND_TOOLBAR_ITEMS: {
  value: TeddyStorybookBrand;
  title: string;
}[] = [
  { value: '${BRAND}', title: ${JSON.stringify(BRAND_TITLE)} },
];
`;
  fs.writeFileSync(brandsFile, file, 'utf8');
}

try {
  for (const mode of ['light', 'dark']) {
    const f = path.join(solarisStylesDir, BRAND_FOLDER, `${mode}.scss`);
    if (!fs.existsSync(f)) {
      throw new Error(
        `Tokens The House não encontrados (${f}). Atualize terra-ds-tokens (precisa de solaris-theHouse).`
      );
    }
  }
  fs.mkdirSync(storybookDir, { recursive: true });
  writeBrandsFile();

  const main = sass.compile(path.join(stylesDir, 'style.scss'), {
    loadPaths: [stylesDir, solarisFontsDir, solarisStylesDir],
    style: 'expanded',
  }).css;
  const official = ['light', 'dark'].map((m) => rootToThemeAndBrand(compileBrandMode(m), m));

  let css = GOOGLE_FONTS_IMPORT + [main, ...official].join('\n');
  css = inlineIconsStyleCss(css);
  css = rewriteIconFontUrls(css);
  css = applyBaseToAbsoluteFontUrls(css);
  fs.writeFileSync(outputFile, css, 'utf8');
  console.log(`✅ Terra Storybook CSS: ${outputFile} (${(css.length / 1024).toFixed(2)} KB)`);
} catch (error) {
  console.error('❌ Erro ao compilar SCSS:', error.message);
  process.exit(1);
}
