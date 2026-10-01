import type { Meta, StoryObj } from '@storybook/angular';

/*
 * Tokens reais de borda disponíveis no Terra DS (global.scss):
 *
 * Radius:  --size-radius-0 (0) | --size-radius-4 (4px) | --size-radius-8 (8px)
 *          --size-radius-16 (16px) | --size-radius-999 (999px)
 *
 * Width:   --size-stoke-0 (0) | --size-stoke-1 (1px) | --size-stoke-2 (2px)
 *
 * Tokens da referência --lui-border-radius-* e --lui-border-width-* ainda
 * não estão definidos — sinalizados como "a definir" nas tabelas abaixo.
 * As funções SCSS radius($size) e width($size) também são "a definir".
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
  title: 'Fundamentos/Border',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Os tokens de borda controlam o **arredondamento** e a **espessura** dos elementos da interface. ' +
          'Serão acessados pelas funções SCSS `radius($size)` e `width($size)` — ou diretamente pelas ' +
          'variáveis CSS `--lui-border-radius-*` e `--lui-border-width-*`. ' +
          'Usar os tokens garante consistência e facilita ajustes globais sem tocar nos componentes.',
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
      <div style="
        max-width: 860px;
        font-family: var(--font-family-primary, 'DM Sans', sans-serif);
        color: var(--color-text-essential-body);
        font-size: 14px;
        line-height: 1.6;
      ">

        <!-- ══ SEÇÃO BORDER ══════════════════════════════════════════════ -->
        <section style="margin-bottom: 48px;">
          <h1 style="
            font-size: 24px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 16px;
          ">Border</h1>

          <p style="margin: 0 0 12px;">
            Os tokens de borda controlam o <strong>arredondamento</strong> e a
            <strong>espessura</strong> dos elementos da interface.
          </p>
          <p style="margin: 0;">
            Serão acessados via funções SCSS
            <code style="${CODIGO_INLINE}">radius($size)</code> e
            <code style="${CODIGO_INLINE}">width($size)</code>,
            ou diretamente pelas variáveis CSS
            <code style="${CODIGO_INLINE}">--lui-border-radius-*</code> e
            <code style="${CODIGO_INLINE}">--lui-border-width-*</code>.
          </p>
        </section>

        <!-- ══ BORDER RADIUS ════════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: 18px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Border Radius</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Escala do reto ao circular. Aplique via
            <code style="${CODIGO_INLINE}">radius($size)</code>
            <span style="${BADGE_DEFINIR}">a definir</span>
            ou diretamente com o token CSS.
          </p>

          <!-- Cabeçalho da tabela -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Visual</span>
            <span style="${LABEL_HEADER}">Token CSS</span>
            <span style="${LABEL_HEADER}">Função SCSS</span>
            <span style="${LABEL_HEADER}">Valor</span>
            <span style="${LABEL_HEADER}">Uso recomendado</span>
          </div>

          <!-- none → --size-radius-0 (0) ───────────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-0, 0);
            "></div>
            <code style="${CODIGO_INLINE}">--size-radius-0</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              radius(none)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">0</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Sem arredondamento
            </span>
          </div>

          <!-- xs → a definir (2px) ─────────────────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: var(--color-branding-surface-primary-base);
              border-radius: 2px;
              opacity: 0.4;
            "></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --lui-border-radius-xs
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              radius(xs)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">2px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Tags, badges, chips
            </span>
          </div>

          <!-- sm → --size-radius-4 (4px) ───────────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
            "></div>
            <code style="${CODIGO_INLINE}">--size-radius-4</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              radius(sm)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">4px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Botões, inputs, selects
            </span>
          </div>

          <!-- md → --size-radius-8 (8px) ───────────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-8, 8px);
            "></div>
            <code style="${CODIGO_INLINE}">--size-radius-8</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              radius(md)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">8px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Cards, painéis, modais
            </span>
          </div>

          <!-- lg → a definir (12px) ────────────────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: var(--color-branding-surface-primary-base);
              border-radius: 12px;
              opacity: 0.4;
            "></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --lui-border-radius-lg
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              radius(lg)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">12px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Superfícies maiores, drawers
            </span>
          </div>

          <!-- xl → --size-radius-16 (16px) ─────────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-16, 16px);
            "></div>
            <code style="${CODIGO_INLINE}">--size-radius-16</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              radius(xl)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">16px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Contêineres de destaque
            </span>
          </div>

          <!-- circle → --size-radius-999 (999px) ──────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-999, 999px);
            "></div>
            <code style="${CODIGO_INLINE}">--size-radius-999</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              radius(circle)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">999px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Avatares, ícones circulares
            </span>
          </div>
        </section>

        <!-- ══ BORDER WIDTH ════════════════════════════════════════════ -->
        <section>
          <h2 style="
            font-size: 18px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Border Width</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Espessuras disponíveis. Aplique via
            <code style="${CODIGO_INLINE}">width($size)</code>
            <span style="${BADGE_DEFINIR}">a definir</span>
            ou diretamente com o token CSS.
          </p>

          <!-- Cabeçalho da tabela -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Visual</span>
            <span style="${LABEL_HEADER}">Token CSS</span>
            <span style="${LABEL_HEADER}">Função SCSS</span>
            <span style="${LABEL_HEADER}">Valor</span>
            <span style="${LABEL_HEADER}">Uso recomendado</span>
          </div>

          <!-- width 0 → --size-stoke-0 (0) ────────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: var(--color-theme-upper);
              border: var(--size-stoke-0, 0) solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              outline: 1px dashed var(--color-stroke-frame);
              box-sizing: border-box;
            "></div>
            <code style="${CODIGO_INLINE}">--size-stoke-0</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              width(0)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">0</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Sem borda
            </span>
          </div>

          <!-- width 1 → --size-stoke-1 (1px) ─────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: transparent;
              border: var(--size-stoke-1, 1px) solid var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              box-sizing: border-box;
            "></div>
            <code style="${CODIGO_INLINE}">--size-stoke-1</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              width(1)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">1px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Borda padrão — inputs, cards, dividers
            </span>
          </div>

          <!-- width 2 → --size-stoke-2 (2px) ─────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: transparent;
              border: var(--size-stoke-2, 2px) solid var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              box-sizing: border-box;
            "></div>
            <code style="${CODIGO_INLINE}">--size-stoke-2</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              width(2)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">2px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Borda de ênfase — foco, seleção
            </span>
          </div>

          <!-- width 4 → a definir (4px) ───────────────────────────── -->
          <div style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 40px;
              background: transparent;
              border: 4px solid var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              box-sizing: border-box;
              opacity: 0.4;
            "></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --lui-border-width-4
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              width(4)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">4px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Borda forte — indicadores, destacados
            </span>
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
            Os tokens <code style="${CODIGO_INLINE}">--lui-border-radius-*</code> e
            <code style="${CODIGO_INLINE}">--lui-border-width-*</code>, bem como as funções SCSS
            <code style="${CODIGO_INLINE}">radius($size)</code> e
            <code style="${CODIGO_INLINE}">width($size)</code>, ainda não foram definidos no
            pacote de tokens do Terra DS. Enquanto isso, utilize os tokens globais disponíveis
            (<code style="${CODIGO_INLINE}">--size-radius-*</code>,
            <code style="${CODIGO_INLINE}">--size-stoke-*</code>) e
            alinhe com o time de tokens a criação dos aliases definitivos.
          </p>
        </aside>

      </div>
    `,
  }),
};
