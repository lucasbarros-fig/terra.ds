import type { Meta, StoryObj } from '@storybook/angular';

/*
 * Tokens reais de tipografia disponíveis no Terra DS (.storybook/styles.css):
 *
 * Tamanhos:  --size-font-heading-40 (40px) | --size-font-heading-32 (32px)
 *            --size-font-heading-24 (24px) | --size-font-heading-20 (20px)
 *            --size-font-body-16 (16px) | --size-font-body-14 (14px)
 *            --size-font-body-12 (12px)
 *
 * Famílias:  --font-family-primary ("DM Sans", sans-serif)
 *            Pesos DM Sans carregados via Google Fonts: 400 | 500 | 700
 *            Source Code Pro: carregado em todos os pesos (sem token no terra)
 *
 * Tokens --lui-typography-*, --tds-ref-font-weight-*, --tds-ref-font-line-height-*
 * e --tds-ref-font-family-code ainda não estão definidos no terra-ds —
 * sinalizados como "a definir" nas tabelas abaixo.
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

const BADGE_NAO_DISPONIVEL = `
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--size-radius-4, 4px);
  background: var(--color-state-feedback-negative-surface-base);
  color: var(--color-text-static-white);
  letter-spacing: 0.04em;
  vertical-align: middle;
`.trim();

const meta: Meta = {
  title: 'Fundamentos/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Os tokens de tipografia do Terra DS definem as escalas compostas que garantem hierarquia, ' +
          'legibilidade e consistência visual em toda a interface. ' +
          'Aplique-os via classe CSS (ex.: `lui-text-body`) ou diretamente pelo token CSS ' +
          '(ex.: `--size-font-body-16`). Ambos são acessíveis via SCSS no pacote de tokens do Terra DS.',
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
      <div class="typo-page" style="
        max-width: 860px;
        font-family: var(--font-family-primary, 'DM Sans', sans-serif);
        color: var(--color-text-essential-body);
        font-size: 14px;
        line-height: 1.6;
      ">

        <!-- ══ SEÇÃO TYPOGRAPHY ══════════════════════════════════════════ -->
        <section style="margin-bottom: 48px;">
          <h1 style="
            font-size: clamp(20px, 2.5vw, 24px);
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 16px;
          ">Typography</h1>

          <p style="margin: 0 0 12px;">
            Os tokens de tipografia do Terra DS definem as <strong>escalas compostas</strong>
            que garantem hierarquia, legibilidade e consistência visual em toda a interface.
          </p>
          <p style="margin: 0;">
            Aplique-os via classe CSS (ex.:
            <code style="${CODIGO_INLINE}">lui-text-body</code>)
            ou diretamente pelo token CSS (ex.:
            <code style="${CODIGO_INLINE}">--size-font-body-16</code>).
            Ambos são acessíveis via SCSS no pacote de tokens do Terra DS.
          </p>
        </section>

        <!-- ══ ESCALAS COMPOSTAS ════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: clamp(16px, 2vw, 18px);
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Escalas Compostas</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Cada estilo composto agrupa tamanho, peso, altura de linha e família.
            Aplique a classe CSS correspondente ou o token CSS diretamente.
          </p>

          <!-- Cabeçalho -->
          <div class="typo-scale-header" style="
            display: grid;
            grid-template-columns: 120px 220px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Estilo</span>
            <span style="${LABEL_HEADER}">Classe / Token</span>
            <span style="${LABEL_HEADER}">Preview</span>
            <span style="${LABEL_HEADER}">Uso recomendado</span>
          </div>

          <!-- Display ────────────────────────────────────────────────── -->
          <div class="typo-scale-row" style="
            display: grid;
            grid-template-columns: 120px 220px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 16px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              Display
            </span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              .lui-text-display
              <span style="${BADGE_DEFINIR}">a definir</span>
              <br>
              <code style="${CODIGO_INLINE}">--size-font-heading-40</code>
            </span>
            <span style="
              font-size: var(--size-font-heading-40, 40px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
              line-height: 1.2;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">O design system cuida dos detalhes.</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Títulos de destaque, hero sections
            </span>
          </div>

          <!-- Heading H1 ────────────────────────────────────────────── -->
          <div class="typo-scale-row" style="
            display: grid;
            grid-template-columns: 120px 220px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              Heading H1
            </span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              .lui-text-h1
              <span style="${BADGE_DEFINIR}">a definir</span>
              <br>
              <code style="${CODIGO_INLINE}">--size-font-heading-32</code>
            </span>
            <span style="
              font-size: var(--size-font-heading-32, 32px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
              line-height: 1.2;
            ">O design system cuida dos detalhes.</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Títulos de página
            </span>
          </div>

          <!-- Heading H2 ────────────────────────────────────────────── -->
          <div class="typo-scale-row" style="
            display: grid;
            grid-template-columns: 120px 220px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              Heading H2
            </span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              .lui-text-h2
              <span style="${BADGE_DEFINIR}">a definir</span>
              <br>
              <code style="${CODIGO_INLINE}">--size-font-heading-24</code>
            </span>
            <span style="
              font-size: var(--size-font-heading-24, 24px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
              line-height: 1.3;
            ">O design system cuida dos detalhes.</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Títulos de seção
            </span>
          </div>

          <!-- Heading H3 ────────────────────────────────────────────── -->
          <div class="typo-scale-row" style="
            display: grid;
            grid-template-columns: 120px 220px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              Heading H3
            </span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              .lui-text-h3
              <span style="${BADGE_DEFINIR}">a definir</span>
              <br>
              <code style="${CODIGO_INLINE}">--size-font-heading-20</code>
            </span>
            <span style="
              font-size: var(--size-font-heading-20, 20px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
              line-height: 1.4;
            ">O design system cuida dos detalhes.</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Sub-títulos, cards de destaque
            </span>
          </div>

          <!-- Body-lg ────────────────────────────────────────────────── -->
          <div class="typo-scale-row" style="
            display: grid;
            grid-template-columns: 120px 220px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              Body-lg
            </span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              .lui-text-body-lg
              <span style="${BADGE_DEFINIR}">a definir</span>
              <br>
              <code style="${CODIGO_INLINE}">--size-font-body-16</code>
            </span>
            <span style="
              font-size: var(--size-font-body-16, 16px);
              font-weight: 500;
              color: var(--color-text-essential-body);
              line-height: 1.5;
            ">O design system cuida dos detalhes.</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Corpo de texto em destaque
            </span>
          </div>

          <!-- Body ───────────────────────────────────────────────────── -->
          <div class="typo-scale-row" style="
            display: grid;
            grid-template-columns: 120px 220px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              Body
            </span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              .lui-text-body
              <span style="${BADGE_DEFINIR}">a definir</span>
              <br>
              <code style="${CODIGO_INLINE}">--size-font-body-14</code>
            </span>
            <span style="
              font-size: var(--size-font-body-14, 14px);
              font-weight: 400;
              color: var(--color-text-essential-body);
              line-height: 1.5;
            ">O design system cuida dos detalhes.</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Texto corrido, descrições
            </span>
          </div>

          <!-- Caption ────────────────────────────────────────────────── -->
          <div class="typo-scale-row" style="
            display: grid;
            grid-template-columns: 120px 220px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              Caption
            </span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              .lui-text-caption
              <span style="${BADGE_DEFINIR}">a definir</span>
              <br>
              <code style="${CODIGO_INLINE}">--size-font-body-12</code>
            </span>
            <span style="
              font-size: var(--size-font-body-12, 12px);
              font-weight: 400;
              color: var(--color-text-essential-caption);
              line-height: 1.5;
            ">O design system cuida dos detalhes.</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Labels, legendas, metadados
            </span>
          </div>
        </section>

        <!-- ══ TAMANHOS DE FONTE ════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: clamp(16px, 2vw, 18px);
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Tamanhos de Fonte</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Escala de tamanhos disponíveis para body e heading.
            Use o token CSS diretamente na propriedade
            <code style="${CODIGO_INLINE}">font-size</code>.
          </p>

          <!-- Cabeçalho -->
          <div class="typo-size-header" style="
            display: grid;
            grid-template-columns: 80px 1fr 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Preview</span>
            <span style="${LABEL_HEADER}">Token CSS</span>
            <span style="${LABEL_HEADER}">Valor</span>
            <span style="${LABEL_HEADER}">Uso recomendado</span>
          </div>

          <!-- heading-40 ─────────────────────────────────────────────── -->
          <div class="typo-size-row" style="
            display: grid;
            grid-template-columns: 80px 1fr 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="
              font-size: var(--size-font-heading-40, 40px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
              line-height: 1;
            ">Aa</span>
            <code style="${CODIGO_INLINE}">--size-font-heading-40</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">40px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Display</span>
          </div>

          <!-- heading-32 ─────────────────────────────────────────────── -->
          <div class="typo-size-row" style="
            display: grid;
            grid-template-columns: 80px 1fr 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="
              font-size: var(--size-font-heading-32, 32px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
              line-height: 1;
            ">Aa</span>
            <code style="${CODIGO_INLINE}">--size-font-heading-32</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">32px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Heading H1</span>
          </div>

          <!-- heading-24 ─────────────────────────────────────────────── -->
          <div class="typo-size-row" style="
            display: grid;
            grid-template-columns: 80px 1fr 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="
              font-size: var(--size-font-heading-24, 24px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
              line-height: 1;
            ">Aa</span>
            <code style="${CODIGO_INLINE}">--size-font-heading-24</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">24px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Heading H2</span>
          </div>

          <!-- heading-20 ─────────────────────────────────────────────── -->
          <div class="typo-size-row" style="
            display: grid;
            grid-template-columns: 80px 1fr 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="
              font-size: var(--size-font-heading-20, 20px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
              line-height: 1;
            ">Aa</span>
            <code style="${CODIGO_INLINE}">--size-font-heading-20</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">20px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Heading H3</span>
          </div>

          <!-- body-16 ────────────────────────────────────────────────── -->
          <div class="typo-size-row" style="
            display: grid;
            grid-template-columns: 80px 1fr 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="
              font-size: var(--size-font-body-16, 16px);
              font-weight: 400;
              color: var(--color-text-essential-heading);
              line-height: 1;
            ">Aa</span>
            <code style="${CODIGO_INLINE}">--size-font-body-16</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">16px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Body padrão</span>
          </div>

          <!-- body-14 ────────────────────────────────────────────────── -->
          <div class="typo-size-row" style="
            display: grid;
            grid-template-columns: 80px 1fr 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="
              font-size: var(--size-font-body-14, 14px);
              font-weight: 400;
              color: var(--color-text-essential-heading);
              line-height: 1;
            ">Aa</span>
            <code style="${CODIGO_INLINE}">--size-font-body-14</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">14px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Body pequeno</span>
          </div>

          <!-- body-12 ────────────────────────────────────────────────── -->
          <div class="typo-size-row" style="
            display: grid;
            grid-template-columns: 80px 1fr 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="
              font-size: var(--size-font-body-12, 12px);
              font-weight: 400;
              color: var(--color-text-essential-heading);
              line-height: 1;
            ">Aa</span>
            <code style="${CODIGO_INLINE}">--size-font-body-12</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">12px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Caption</span>
          </div>
        </section>

        <!-- ══ PESOS TIPOGRÁFICOS ═══════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: clamp(16px, 2vw, 18px);
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Pesos Tipográficos</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Pesos disponíveis na fonte DM Sans (carregada via Google Fonts).
            Pesos não disponíveis são sinalizados.
          </p>

          <!-- Cabeçalho -->
          <div class="typo-weight-header" style="
            display: grid;
            grid-template-columns: 120px 80px 1fr 200px;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Peso</span>
            <span style="${LABEL_HEADER}">Valor</span>
            <span style="${LABEL_HEADER}">Preview</span>
            <span style="${LABEL_HEADER}">Token / Status</span>
          </div>

          <!-- Light 300 ─────────────────────────────────────────────── -->
          <div class="typo-weight-row" style="
            display: grid;
            grid-template-columns: 120px 80px 1fr 200px;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
            opacity: 0.5;
          ">
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Light</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">300</span>
            <span style="
              font-size: var(--size-font-body-16, 16px);
              font-weight: 300;
              color: var(--color-text-essential-heading);
            ">Typography</span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-weight-light
              <span style="${BADGE_DEFINIR}">a definir</span>
              <span style="${BADGE_NAO_DISPONIVEL}">não disponível</span>
            </span>
          </div>

          <!-- Regular 400 ────────────────────────────────────────────── -->
          <div class="typo-weight-row" style="
            display: grid;
            grid-template-columns: 120px 80px 1fr 200px;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Regular</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">400</span>
            <span style="
              font-size: var(--size-font-body-16, 16px);
              font-weight: 400;
              color: var(--color-text-essential-heading);
            ">Typography</span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-weight-regular
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
          </div>

          <!-- Medium 500 ─────────────────────────────────────────────── -->
          <div class="typo-weight-row" style="
            display: grid;
            grid-template-columns: 120px 80px 1fr 200px;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Medium</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">500</span>
            <span style="
              font-size: var(--size-font-body-16, 16px);
              font-weight: 500;
              color: var(--color-text-essential-heading);
            ">Typography</span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-weight-medium
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
          </div>

          <!-- Semibold 600 ────────────────────────────────────────────── -->
          <div class="typo-weight-row" style="
            display: grid;
            grid-template-columns: 120px 80px 1fr 200px;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
            opacity: 0.5;
          ">
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Semibold</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">600</span>
            <span style="
              font-size: var(--size-font-body-16, 16px);
              font-weight: 600;
              color: var(--color-text-essential-heading);
            ">Typography</span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-weight-semibold
              <span style="${BADGE_DEFINIR}">a definir</span>
              <span style="${BADGE_NAO_DISPONIVEL}">não disponível</span>
            </span>
          </div>

          <!-- Bold 700 ────────────────────────────────────────────────── -->
          <div class="typo-weight-row" style="
            display: grid;
            grid-template-columns: 120px 80px 1fr 200px;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; color: var(--color-text-essential-body);">Bold</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">700</span>
            <span style="
              font-size: var(--size-font-body-16, 16px);
              font-weight: 700;
              color: var(--color-text-essential-heading);
            ">Typography</span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-weight-bold
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
          </div>
        </section>

        <!-- ══ ALTURAS DE LINHA ══════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: clamp(16px, 2vw, 18px);
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Alturas de Linha</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Escala de <code style="${CODIGO_INLINE}">line-height</code>
            para controlar o espaçamento vertical entre linhas de texto.
          </p>

          <!-- Cabeçalho -->
          <div class="typo-lh-header" style="
            display: grid;
            grid-template-columns: 220px 80px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Token</span>
            <span style="${LABEL_HEADER}">Valor</span>
            <span style="${LABEL_HEADER}">Exemplo</span>
          </div>

          <!-- line-height 1 ───────────────────────────────────────────── -->
          <div class="typo-lh-row" style="
            display: grid;
            grid-template-columns: 220px 80px 1fr;
            gap: 8px 20px;
            align-items: start;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-line-height-xs
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">1</span>
            <p style="
              margin: 0;
              font-size: var(--size-font-body-14, 14px);
              line-height: 1;
              color: var(--color-text-essential-body);
            ">Os tokens de tipografia garantem hierarquia visual e legibilidade consistente em toda a interface do Terra DS.</p>
          </div>

          <!-- line-height 1.1 ─────────────────────────────────────────── -->
          <div class="typo-lh-row" style="
            display: grid;
            grid-template-columns: 220px 80px 1fr;
            gap: 8px 20px;
            align-items: start;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-line-height-sm
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">1.1</span>
            <p style="
              margin: 0;
              font-size: var(--size-font-body-14, 14px);
              line-height: 1.1;
              color: var(--color-text-essential-body);
            ">Os tokens de tipografia garantem hierarquia visual e legibilidade consistente em toda a interface do Terra DS.</p>
          </div>

          <!-- line-height 1.25 ────────────────────────────────────────── -->
          <div class="typo-lh-row" style="
            display: grid;
            grid-template-columns: 220px 80px 1fr;
            gap: 8px 20px;
            align-items: start;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-line-height-md
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">1.25</span>
            <p style="
              margin: 0;
              font-size: var(--size-font-body-14, 14px);
              line-height: 1.25;
              color: var(--color-text-essential-body);
            ">Os tokens de tipografia garantem hierarquia visual e legibilidade consistente em toda a interface do Terra DS.</p>
          </div>

          <!-- line-height 1.5 ─────────────────────────────────────────── -->
          <div class="typo-lh-row" style="
            display: grid;
            grid-template-columns: 220px 80px 1fr;
            gap: 8px 20px;
            align-items: start;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-line-height-lg
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">1.5</span>
            <p style="
              margin: 0;
              font-size: var(--size-font-body-14, 14px);
              line-height: 1.5;
              color: var(--color-text-essential-body);
            ">Os tokens de tipografia garantem hierarquia visual e legibilidade consistente em toda a interface do Terra DS.</p>
          </div>

          <!-- line-height 1.7 ─────────────────────────────────────────── -->
          <div class="typo-lh-row" style="
            display: grid;
            grid-template-columns: 220px 80px 1fr;
            gap: 8px 20px;
            align-items: start;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-line-height-xl
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">1.7</span>
            <p style="
              margin: 0;
              font-size: var(--size-font-body-14, 14px);
              line-height: 1.7;
              color: var(--color-text-essential-body);
            ">Os tokens de tipografia garantem hierarquia visual e legibilidade consistente em toda a interface do Terra DS.</p>
          </div>

          <!-- line-height 2 ───────────────────────────────────────────── -->
          <div class="typo-lh-row" style="
            display: grid;
            grid-template-columns: 220px 80px 1fr;
            gap: 8px 20px;
            align-items: start;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-line-height-2xl
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">2</span>
            <p style="
              margin: 0;
              font-size: var(--size-font-body-14, 14px);
              line-height: 2;
              color: var(--color-text-essential-body);
            ">Os tokens de tipografia garantem hierarquia visual e legibilidade consistente em toda a interface do Terra DS.</p>
          </div>
        </section>

        <!-- ══ FAMÍLIAS TIPOGRÁFICAS ════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: clamp(16px, 2vw, 18px);
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Famílias Tipográficas</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Famílias de fonte disponíveis no Terra DS.
          </p>

          <!-- Cabeçalho -->
          <div class="typo-family-header" style="
            display: grid;
            grid-template-columns: 160px 240px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Família</span>
            <span style="${LABEL_HEADER}">Token CSS</span>
            <span style="${LABEL_HEADER}">Preview</span>
          </div>

          <!-- DM Sans ────────────────────────────────────────────────── -->
          <div class="typo-family-row" style="
            display: grid;
            grid-template-columns: 160px 240px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 16px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              DM Sans
            </span>
            <code style="${CODIGO_INLINE}">--font-family-primary</code>
            <span style="
              font-family: var(--font-family-primary, 'DM Sans', sans-serif);
              font-size: var(--size-font-heading-20, 20px);
              color: var(--color-text-essential-heading);
            ">ABCDEFGHIJ abcdefghij 0123456789</span>
          </div>

          <!-- Source Code Pro ─────────────────────────────────────────── -->
          <div class="typo-family-row" style="
            display: grid;
            grid-template-columns: 160px 240px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 16px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <span style="font-size: 13px; font-weight: 600; color: var(--color-text-essential-body);">
              Source Code Pro
            </span>
            <span style="font-size: 12px; color: var(--color-text-essential-caption);">
              --tds-ref-font-family-code
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="
              font-family: 'Source Code Pro', monospace;
              font-size: var(--size-font-body-14, 14px);
              color: var(--color-text-essential-heading);
            ">ABCDEFGHIJ abcdefghij 0123456789</span>
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
            Os tokens
            <code style="${CODIGO_INLINE}">--lui-typography-*</code>,
            <code style="${CODIGO_INLINE}">--tds-ref-font-weight-*</code>,
            <code style="${CODIGO_INLINE}">--tds-ref-font-line-height-*</code> e
            <code style="${CODIGO_INLINE}">--tds-ref-font-family-code</code>
            ainda não foram definidos no pacote de tokens do Terra DS.
            Enquanto isso, utilize os tokens globais disponíveis
            (<code style="${CODIGO_INLINE}">--size-font-*</code>,
            <code style="${CODIGO_INLINE}">--font-family-primary</code>) e
            alinhe com o time de tokens a criação dos aliases definitivos.
            Os pesos sinalizados como "não disponível" correspondem a variações da DM Sans
            não carregadas no Storybook (somente 400, 500 e 700 estão disponíveis).
          </p>
        </aside>

      </div>
    `,
    styles: [
      `
        @media (max-width: 1024px) {
          .typo-page { max-width: 100% !important; }
        }
        @media (max-width: 640px) {
          .typo-scale-header,
          .typo-size-header,
          .typo-weight-header,
          .typo-lh-header,
          .typo-family-header { display: none !important; }
          .typo-scale-row {
            grid-template-columns: 100px 1fr !important;
            gap: 4px 12px !important;
            padding: 10px 12px !important;
          }
          .typo-size-row {
            grid-template-columns: 56px 1fr !important;
            gap: 4px 12px !important;
            padding: 10px 12px !important;
          }
          .typo-weight-row {
            grid-template-columns: 80px 1fr !important;
            gap: 4px 12px !important;
            padding: 10px 12px !important;
          }
          .typo-lh-row {
            grid-template-columns: 1fr !important;
            gap: 4px !important;
            padding: 10px 12px !important;
          }
          .typo-family-row {
            grid-template-columns: 1fr !important;
            gap: 4px !important;
            padding: 10px 12px !important;
          }
        }
      `,
    ],
  }),
};
