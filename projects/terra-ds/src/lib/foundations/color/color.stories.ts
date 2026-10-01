import type { Meta, StoryObj } from '@storybook/angular';

/*
 * Tokens de cor disponíveis no Terra DS (styles.css compilado):
 *
 * Primitivas:  --color-support-colors-{blue,neutral,green,orange,red,purple,teal,emerald,yellow,pink,cyan}
 * Estáticas:   --color-text-static-black | --color-text-static-white
 * Marca:       --color-branding-surface-primary-{base,hovering,pressing}
 *              --color-branding-surface-segundary-base
 *              --color-branding-logo-contrast
 * Semânticas:  --color-state-feedback-{negative,positive,warning,informative}-surface-{base,hovering,pressing}
 *              --color-state-system-{selected,hovering,pressing,focus,disabled}
 *
 * Tokens "a definir": escalas completas Blue-50..Blue-900, tokens de text/border semânticos,
 * --color-link-*, --tds-ref-color-alpha-* e aliases --lui-color-*.
 *
 * Todos os tokens semânticos são definidos em dois blocos:
 *   html[data-theme="light"][data-brand="solaris-theHouse"] { ... }
 *   html[data-theme="dark"][data-brand="solaris-theHouse"]  { ... }
 * O decorator `withTerraStorybookGlobals` em preview.ts aplica data-theme e data-brand
 * automaticamente ao alternar na toolbar — os swatches reagem sem lógica adicional.
 */

const CODIGO_INLINE = `
  background: var(--color-theme-upper);
  border: 1px solid var(--color-stroke-frame);
  border-radius: var(--size-radius-4, 4px);
  padding: 1px 6px;
  font-size: 12px;
  font-family: 'Source Code Pro', monospace;
  color: var(--color-text-essential-body);
`.trim();

const LABEL_HEADER = `
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-essential-caption);
`.trim();

const BADGE_DEFINIR = `
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--size-radius-4, 4px);
  background: var(--color-state-feedback-warning-surface-base);
  color: var(--color-text-static-white);
  letter-spacing: 0.04em;
  vertical-align: middle;
`.trim();

const meta: Meta = {
  title: 'Fundamentos/Color',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Os tokens de cor do Terra DS dividem-se em três camadas: **primitivas** (escala base RGB), ' +
          '**de marca** (identidade Terra The House) e **semânticas** (intenção de feedback e estado). ' +
          'Use sempre o token semântico nos componentes — ele adapta-se automaticamente ao tema claro/escuro e à marca.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Documentacao: Story = {
  name: 'Documentação',
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
  render: () => ({
    template: `
      <style>
        .color-doc {
          max-width: 860px;
          font-family: var(--font-family-primary, 'DM Sans', sans-serif);
          color: var(--color-text-essential-body);
          font-size: 14px;
          line-height: 1.6;
        }
        .color-row {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 8px 14px;
          align-items: center;
          padding: 10px 16px;
          border-bottom: 1px solid var(--color-stroke-frame);
        }
        .color-value {
          display: none;
          font-size: 12px;
          color: var(--color-text-essential-caption);
          font-family: 'Source Code Pro', monospace;
          white-space: nowrap;
        }
        @media (min-width: 768px) {
          .color-row {
            grid-template-columns: 40px 1fr auto;
            gap: 8px 20px;
          }
          .color-value { display: block; }
        }
        @media (min-width: 1024px) {
          .color-row {
            grid-template-columns: 44px 1fr auto;
            padding: 12px 16px;
          }
        }
        .color-swatch {
          width: 28px;
          height: 28px;
          border-radius: var(--size-radius-4, 4px);
          border: 1px solid var(--color-stroke-frame);
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .color-swatch { width: 32px; height: 32px; }
        }
        @media (min-width: 1024px) {
          .color-swatch { width: 36px; height: 36px; }
        }
        .color-row-header {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 8px 14px;
          align-items: center;
          padding: 0 16px 8px;
          border-bottom: 2px solid var(--color-stroke-frame);
          margin-bottom: 4px;
        }
        @media (min-width: 768px) {
          .color-row-header {
            grid-template-columns: 40px 1fr auto;
            gap: 8px 20px;
          }
        }
        @media (min-width: 1024px) {
          .color-row-header { grid-template-columns: 44px 1fr auto; }
        }
        .col-header-value {
          display: none;
        }
        @media (min-width: 768px) {
          .col-header-value { display: block; }
        }
        .semantic-group {
          margin-bottom: 32px;
        }
        .semantic-group-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-essential-heading);
          margin: 0 0 4px 16px;
          letter-spacing: 0.02em;
        }
        .alpha-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          padding: 16px;
        }
        @media (min-width: 768px) {
          .alpha-grid { grid-template-columns: repeat(9, 1fr); }
        }
        .alpha-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--color-text-essential-caption);
        }
        .alpha-swatch {
          width: 28px;
          height: 28px;
          border-radius: var(--size-radius-4, 4px);
          border: 1px solid var(--color-stroke-frame);
          background: var(--color-text-static-black);
        }
        @media (min-width: 768px) {
          .alpha-swatch { width: 36px; height: 36px; }
        }
        .h1-doc {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-text-essential-heading);
          margin: 0 0 16px;
        }
        @media (min-width: 768px) { .h1-doc { font-size: 22px; } }
        @media (min-width: 1024px) { .h1-doc { font-size: 24px; } }
        .h2-doc {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-essential-heading);
          margin: 0 0 8px;
        }
        @media (min-width: 768px) { .h2-doc { font-size: 17px; } }
        @media (min-width: 1024px) { .h2-doc { font-size: 18px; } }
        .static-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: var(--size-radius-4, 4px);
          background: var(--color-state-feedback-informative-surface-base);
          color: var(--color-text-static-white);
          letter-spacing: 0.04em;
          vertical-align: middle;
        }
      </style>

      <div class="color-doc">

        <!-- ══ SEÇÃO COLOR ════════════════════════════════════════════ -->
        <section style="margin-bottom: 48px;">
          <h1 class="h1-doc">Color</h1>
          <p style="margin: 0 0 10px;">
            Os tokens de cor do Terra DS organizam-se em três categorias:
          </p>
          <ul style="margin: 0 0 10px; padding-left: 20px;">
            <li>
              <strong>Primitivas</strong> — escala base RGB (suporte). Acesse via
              <code style="${CODIGO_INLINE}">--color-support-colors-*</code>.
            </li>
            <li>
              <strong>De marca</strong> — identidade visual Terra The House. Acesse via
              <code style="${CODIGO_INLINE}">--color-branding-*</code>.
            </li>
            <li>
              <strong>Semânticas</strong> — intenção de feedback e estado. Acesse via
              <code style="${CODIGO_INLINE}">--color-state-*</code>.
              Adaptam-se ao tema (claro/escuro) e à marca selecionada na toolbar.
            </li>
          </ul>
          <p style="margin: 0; font-size: 13px; color: var(--color-text-essential-caption);">
            Prefira sempre o token semântico nos componentes — garante consistência entre temas e marcas.
          </p>
        </section>

        <!-- ══ CORES PRIMITIVAS ════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 class="h2-doc">Cores Primitivas</h2>
          <p style="margin: 0 0 6px; font-size: 13px; color: var(--color-text-essential-caption);">
            Escala de cores base do Terra DS. As famílias abaixo representam as cores disponíveis
            como tokens de suporte. As escalas completas (ex.: Blue-50 a Blue-900) ainda não foram
            expostas no terra-ds e estão sinalizadas como
            <span style="${BADGE_DEFINIR}">a definir</span>.
          </p>

          <!-- Cabeçalho da tabela -->
          <div class="color-row-header" style="margin-top: 20px;">
            <span style="${LABEL_HEADER}">Cor</span>
            <span style="${LABEL_HEADER}">Token CSS</span>
            <span class="col-header-value" style="${LABEL_HEADER}">Valor (light)</span>
          </div>

          <!-- Blue ───────────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-support-colors-blue);"></div>
            <code style="${CODIGO_INLINE}">--color-support-colors-blue</code>
            <span class="color-value">rgba(37,99,235,1)</span>
          </div>

          <!-- Gray (token real: neutral) ──────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-support-colors-neutral);"></div>
            <span style="font-size: 13px;">
              <code style="${CODIGO_INLINE}">--color-support-colors-neutral</code>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-left: 4px;">
                (Gray — token real é <em>neutral</em>)
              </span>
            </span>
            <span class="color-value">rgba(74,85,96,1)</span>
          </div>

          <!-- Green ──────────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-support-colors-green);"></div>
            <code style="${CODIGO_INLINE}">--color-support-colors-green</code>
            <span class="color-value">rgba(101,163,13,1)</span>
          </div>

          <!-- Orange ─────────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-support-colors-orange);"></div>
            <code style="${CODIGO_INLINE}">--color-support-colors-orange</code>
            <span class="color-value">rgba(217,119,6,1)</span>
          </div>

          <!-- Red ────────────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-support-colors-red);"></div>
            <code style="${CODIGO_INLINE}">--color-support-colors-red</code>
            <span class="color-value">rgba(220,38,38,1)</span>
          </div>

          <!-- Violet (token real: purple) ─────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-support-colors-purple);"></div>
            <span style="font-size: 13px;">
              <code style="${CODIGO_INLINE}">--color-support-colors-purple</code>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-left: 4px;">
                (Violet — token real é <em>purple</em>)
              </span>
            </span>
            <span class="color-value">rgba(124,58,237,1)</span>
          </div>
        </section>

        <!-- ══ BLACK ALPHA ═════════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 class="h2-doc">Black Alpha</h2>
          <p style="margin: 0 0 16px; font-size: 13px; color: var(--color-text-essential-caption);">
            Opacidade do token <code style="${CODIGO_INLINE}">--color-text-static-black</code>
            em incrementos de 10%.
            <span class="static-badge">estático</span>
            <strong style="display: block; margin-top: 6px; color: var(--color-text-essential-body);">
              Atenção:
            </strong>
            Esta é uma cor estática — <strong>não muda</strong> com a troca de tema claro/escuro.
            Os tokens <code style="${CODIGO_INLINE}">--tds-ref-color-alpha-*</code> ainda não estão
            expostos no terra-ds e estão sinalizados como
            <span style="${BADGE_DEFINIR}">a definir</span>.
            A opacidade abaixo é aplicada via CSS <code style="${CODIGO_INLINE}">opacity</code>.
          </p>

          <div class="alpha-grid">
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.1;"></div>
              <span>10%</span>
            </div>
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.2;"></div>
              <span>20%</span>
            </div>
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.3;"></div>
              <span>30%</span>
            </div>
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.4;"></div>
              <span>40%</span>
            </div>
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.5;"></div>
              <span>50%</span>
            </div>
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.6;"></div>
              <span>60%</span>
            </div>
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.7;"></div>
              <span>70%</span>
            </div>
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.8;"></div>
              <span>80%</span>
            </div>
            <div class="alpha-cell">
              <div class="alpha-swatch" style="opacity: 0.9;"></div>
              <span>90%</span>
            </div>
          </div>
        </section>

        <!-- ══ CORES DA MARCA ═══════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 class="h2-doc">Cores da Marca</h2>
          <p style="margin: 0 0 6px; font-size: 13px; color: var(--color-text-essential-caption);">
            Tokens de marca da Terra The House. Reagem à troca de marca na toolbar
            (quando 2+ marcas estiverem disponíveis). Variações de text e border estão
            sinalizadas como <span style="${BADGE_DEFINIR}">a definir</span>.
          </p>

          <div class="color-row-header" style="margin-top: 20px;">
            <span style="${LABEL_HEADER}">Cor</span>
            <span style="${LABEL_HEADER}">Token CSS</span>
            <span class="col-header-value" style="${LABEL_HEADER}">Valor</span>
          </div>

          <!-- Primary base ──────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-branding-surface-primary-base);"></div>
            <code style="${CODIGO_INLINE}">--color-branding-surface-primary-base</code>
            <span class="color-value">rgba(219,0,130,1)</span>
          </div>

          <!-- Primary hovering ─────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-branding-surface-primary-hovering);"></div>
            <code style="${CODIGO_INLINE}">--color-branding-surface-primary-hovering</code>
            <span class="color-value">rgba(194,0,116,1)</span>
          </div>

          <!-- Primary pressing ─────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-branding-surface-primary-pressing);"></div>
            <code style="${CODIGO_INLINE}">--color-branding-surface-primary-pressing</code>
            <span class="color-value">rgba(184,0,109,1)</span>
          </div>

          <!-- Secondary base ───────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-branding-surface-segundary-base);"></div>
            <code style="${CODIGO_INLINE}">--color-branding-surface-segundary-base</code>
            <span class="color-value">rgba(53,0,109,1)</span>
          </div>

          <!-- Logo contrast ────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: var(--color-branding-logo-contrast);"></div>
            <code style="${CODIGO_INLINE}">--color-branding-logo-contrast</code>
            <span class="color-value">rgba(53,0,109,1)</span>
          </div>
        </section>

        <!-- ══ CORES SEMÂNTICAS ═════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 class="h2-doc">Cores Semânticas</h2>
          <p style="margin: 0 0 24px; font-size: 13px; color: var(--color-text-essential-caption);">
            Cores de feedback que se adaptam ao tema (claro/escuro) e à marca selecionada.
            Cada grupo exibe as variações de superfície disponíveis. Variações de
            <code style="${CODIGO_INLINE}">text</code> e <code style="${CODIGO_INLINE}">border</code>
            ainda não estão expostas e estão sinalizadas como
            <span style="${BADGE_DEFINIR}">a definir</span>.
          </p>

          <!-- ── PRIMARY ──────────────────────────────────────────── -->
          <div class="semantic-group">
            <p class="semantic-group-title">Primary</p>
            <div class="color-row-header">
              <span style="${LABEL_HEADER}">Cor</span>
              <span style="${LABEL_HEADER}">Token CSS</span>
              <span class="col-header-value" style="${LABEL_HEADER}">Valor (light)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-branding-surface-primary-base);"></div>
              <code style="${CODIGO_INLINE}">--color-branding-surface-primary-base</code>
              <span class="color-value">rgba(219,0,130,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-branding-surface-primary-hovering);"></div>
              <code style="${CODIGO_INLINE}">--color-branding-surface-primary-hovering</code>
              <span class="color-value">rgba(194,0,116,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-branding-surface-primary-pressing);"></div>
              <code style="${CODIGO_INLINE}">--color-branding-surface-primary-pressing</code>
              <span class="color-value">rgba(184,0,109,1)</span>
            </div>
          </div>

          <!-- ── SECONDARY ────────────────────────────────────────── -->
          <div class="semantic-group">
            <p class="semantic-group-title">Secondary</p>
            <div class="color-row-header">
              <span style="${LABEL_HEADER}">Cor</span>
              <span style="${LABEL_HEADER}">Token CSS</span>
              <span class="col-header-value" style="${LABEL_HEADER}">Valor (light)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-branding-surface-segundary-base);"></div>
              <span>
                <code style="${CODIGO_INLINE}">--color-branding-surface-segundary-base</code>
                <span style="${BADGE_DEFINIR}; margin-left: 4px;">a definir</span>
                <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-left: 4px;">
                  hovering/pressing
                </span>
              </span>
              <span class="color-value">rgba(53,0,109,1)</span>
            </div>
          </div>

          <!-- ── DANGER ───────────────────────────────────────────── -->
          <div class="semantic-group">
            <p class="semantic-group-title">Danger</p>
            <div class="color-row-header">
              <span style="${LABEL_HEADER}">Cor</span>
              <span style="${LABEL_HEADER}">Token CSS</span>
              <span class="col-header-value" style="${LABEL_HEADER}">Valor (light)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-negative-surface-base);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-negative-surface-base</code>
              <span class="color-value">rgba(192,55,43,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-negative-surface-hovering);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-negative-surface-hovering</code>
              <span class="color-value">rgba(176,51,40,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-negative-surface-pressing);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-negative-surface-pressing</code>
              <span class="color-value">rgba(140,39,31,1)</span>
            </div>
          </div>

          <!-- ── SUCCESS ──────────────────────────────────────────── -->
          <div class="semantic-group">
            <p class="semantic-group-title">Success</p>
            <div class="color-row-header">
              <span style="${LABEL_HEADER}">Cor</span>
              <span style="${LABEL_HEADER}">Token CSS</span>
              <span class="col-header-value" style="${LABEL_HEADER}">Valor (light)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-positive-surface-base);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-positive-surface-base</code>
              <span class="color-value">rgba(31,122,77,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-positive-surface-hovering);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-positive-surface-hovering</code>
              <span class="color-value">rgba(27,110,69,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-positive-surface-pressing);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-positive-surface-pressing</code>
              <span class="color-value">rgba(20,82,53,1)</span>
            </div>
          </div>

          <!-- ── CAUTION ──────────────────────────────────────────── -->
          <div class="semantic-group">
            <p class="semantic-group-title">Caution</p>
            <div class="color-row-header">
              <span style="${LABEL_HEADER}">Cor</span>
              <span style="${LABEL_HEADER}">Token CSS</span>
              <span class="col-header-value" style="${LABEL_HEADER}">Valor (light)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-warning-surface-base);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-warning-surface-base</code>
              <span class="color-value">rgba(198,135,43,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-warning-surface-hovering);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-warning-surface-hovering</code>
              <span class="color-value">rgba(183,119,25,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-warning-surface-pressing);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-warning-surface-pressing</code>
              <span class="color-value">rgba(169,111,34,1)</span>
            </div>
          </div>

          <!-- ── INFO ─────────────────────────────────────────────── -->
          <div class="semantic-group">
            <p class="semantic-group-title">Info</p>
            <div class="color-row-header">
              <span style="${LABEL_HEADER}">Cor</span>
              <span style="${LABEL_HEADER}">Token CSS</span>
              <span class="col-header-value" style="${LABEL_HEADER}">Valor (light)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-informative-surface-base);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-informative-surface-base</code>
              <span class="color-value">rgba(30,111,217,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-informative-surface-hovering);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-informative-surface-hovering</code>
              <span class="color-value">rgba(26,99,194,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-feedback-informative-surface-pressing);"></div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-informative-surface-pressing</code>
              <span class="color-value">rgba(20,78,160,1)</span>
            </div>
          </div>

          <!-- ── NEUTRAL ──────────────────────────────────────────── -->
          <div class="semantic-group">
            <p class="semantic-group-title">Neutral</p>
            <div class="color-row-header">
              <span style="${LABEL_HEADER}">Cor</span>
              <span style="${LABEL_HEADER}">Token CSS</span>
              <span class="col-header-value" style="${LABEL_HEADER}">Valor (light)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-system-selected);"></div>
              <code style="${CODIGO_INLINE}">--color-state-system-selected</code>
              <span class="color-value">rgba(214,227,237,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-system-hovering);"></div>
              <code style="${CODIGO_INLINE}">--color-state-system-hovering</code>
              <span class="color-value">rgba(194,214,228,1)</span>
            </div>
            <div class="color-row">
              <div class="color-swatch" style="background: var(--color-state-system-pressing);"></div>
              <code style="${CODIGO_INLINE}">--color-state-system-pressing</code>
              <span class="color-value">rgba(175,201,218,1)</span>
            </div>
          </div>
        </section>

        <!-- ══ LINK ═════════════════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 class="h2-doc">Link</h2>
          <p style="margin: 0 0 16px; font-size: 13px; color: var(--color-text-essential-caption);">
            Estados de link ainda não possuem tokens definidos no Terra DS.
          </p>

          <div class="color-row-header">
            <span style="${LABEL_HEADER}">Cor</span>
            <span style="${LABEL_HEADER}">Token CSS</span>
            <span class="col-header-value" style="${LABEL_HEADER}">Valor</span>
          </div>

          <!-- default ─────────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: transparent; opacity: 0.3; border: 2px dashed var(--color-stroke-frame);"></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --color-link-default
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span class="color-value" style="color: var(--color-text-essential-caption);">—</span>
          </div>

          <!-- visited ──────────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: transparent; opacity: 0.3; border: 2px dashed var(--color-stroke-frame);"></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --color-link-visited
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span class="color-value" style="color: var(--color-text-essential-caption);">—</span>
          </div>

          <!-- hover ────────────────────────────────────────────────── -->
          <div class="color-row">
            <div class="color-swatch" style="background: transparent; opacity: 0.3; border: 2px dashed var(--color-stroke-frame);"></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --color-link-hover
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span class="color-value" style="color: var(--color-text-essential-caption);">—</span>
          </div>
        </section>

        <!-- ══ NOTA SOBRE TOKENS A DEFINIR ════════════════════════════ -->
        <aside style="
          margin-top: 48px;
          padding: 16px 20px;
          background: var(--color-theme-upper);
          border-left: var(--size-stoke-2, 2px) solid var(--color-state-feedback-warning-surface-base);
          border-radius: 0 var(--size-radius-4, 4px) var(--size-radius-4, 4px) 0;
        ">
          <p style="margin: 0 0 6px; font-weight: 600; color: var(--color-text-essential-heading);">
            Tokens sinalizados como "a definir"
          </p>
          <p style="margin: 0; font-size: 13px; color: var(--color-text-essential-caption);">
            Os tokens abaixo ainda não foram definidos no pacote do Terra DS.
            Enquanto isso, utilize os tokens globais disponíveis
            (<code style="${CODIGO_INLINE}">--color-support-colors-*</code>,
            <code style="${CODIGO_INLINE}">--color-branding-surface-*</code>,
            <code style="${CODIGO_INLINE}">--color-state-feedback-*</code>)
            e alinhe com o time de tokens a criação dos aliases definitivos:
            escalas primitivas completas (Blue-50..Blue-900 e equivalentes),
            variações <code style="${CODIGO_INLINE}">text</code> e <code style="${CODIGO_INLINE}">border</code>
            dos grupos semânticos, tokens de link (<code style="${CODIGO_INLINE}">--color-link-*</code>),
            aliases <code style="${CODIGO_INLINE}">--color-alpha-*</code> e
            <code style="${CODIGO_INLINE}">--lui-color-*</code>.
          </p>
        </aside>

      </div>
    `,
  }),
};
