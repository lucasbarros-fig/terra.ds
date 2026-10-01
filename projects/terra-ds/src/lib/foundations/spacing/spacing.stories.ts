import type { Meta, StoryObj } from '@storybook/angular';

/*
 * Tokens reais de espaçamento disponíveis no Terra DS (.storybook/styles.css):
 *
 * Fixo:  --size-spacing-0 (0) | --size-spacing-4 (4px) | --size-spacing-8 (8px)
 *        --size-spacing-12 (12px) | --size-spacing-16 (16px)
 *        --size-spacing-24 (24px) | --size-spacing-32 (32px)
 *
 * Tokens da referência --lui-spacing-fluid-* ainda não estão definidos —
 * sinalizados como "a definir" nas tabelas abaixo.
 * A função SCSS space($size) também é "a definir".
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
  title: 'Fundamentos/Spacing',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Os tokens de espaçamento controlam as distâncias entre os elementos da interface — margin, padding e gap. ' +
          'Serão acessados pela função SCSS `space($size)` — ou diretamente pelas ' +
          'variáveis CSS `--size-spacing-*`. ' +
          'Usar os tokens garante ritmo consistente e facilita ajustes globais sem tocar nos componentes.',
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
      <div class="sp-page" style="
        max-width: 860px;
        font-family: var(--font-family-primary, 'DM Sans', sans-serif);
        color: var(--color-text-essential-body);
        font-size: 14px;
        line-height: 1.6;
      ">

        <!-- ══ SEÇÃO SPACING ═════════════════════════════════════════════ -->
        <section style="margin-bottom: 48px;">
          <h1 style="
            font-size: 24px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 16px;
          ">Spacing</h1>

          <p style="margin: 0 0 12px;">
            Os tokens de espaçamento controlam as <strong>distâncias entre elementos</strong>
            da interface — margin, padding e gap.
          </p>
          <p style="margin: 0;">
            Aplique via função SCSS
            <code style="${CODIGO_INLINE}">space($size)</code>
            <span style="${BADGE_DEFINIR}">a definir</span>
            ou diretamente pelas variáveis CSS
            <code style="${CODIGO_INLINE}">--size-spacing-*</code>.
          </p>
        </section>

        <!-- ══ ESPAÇAMENTO FIXO ══════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: 18px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Espaçamento Fixo</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Valores absolutos em px para layouts previsíveis. Aplique via
            <code style="${CODIGO_INLINE}">space($size)</code>
            <span style="${BADGE_DEFINIR}">a definir</span>
            ou diretamente com o token CSS.
          </p>

          <!-- Cabeçalho da tabela -->
          <div class="sp-grid-header" style="
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

          <!-- 32px ─────────────────────────────────────────────────────── -->
          <div class="sp-grid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: calc(var(--size-spacing-32, 32px) * 1.5);
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
            " title="--size-spacing-32: 32px"></div>
            <code style="${CODIGO_INLINE}">--size-spacing-32</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              space(32)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">32px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Gap entre seções
            </span>
          </div>

          <!-- 24px ─────────────────────────────────────────────────────── -->
          <div class="sp-grid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: calc(var(--size-spacing-24, 24px) * 1.5);
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
            " title="--size-spacing-24: 24px"></div>
            <code style="${CODIGO_INLINE}">--size-spacing-24</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              space(24)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">24px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Padding de container
            </span>
          </div>

          <!-- 16px ─────────────────────────────────────────────────────── -->
          <div class="sp-grid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: calc(var(--size-spacing-16, 16px) * 1.5);
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
            " title="--size-spacing-16: 16px"></div>
            <code style="${CODIGO_INLINE}">--size-spacing-16</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              space(16)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">16px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Padding de seção
            </span>
          </div>

          <!-- 12px ─────────────────────────────────────────────────────── -->
          <div class="sp-grid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: calc(var(--size-spacing-12, 12px) * 1.5);
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
            " title="--size-spacing-12: 12px"></div>
            <code style="${CODIGO_INLINE}">--size-spacing-12</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              space(12)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">12px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Padding de card
            </span>
          </div>

          <!-- 8px ──────────────────────────────────────────────────────── -->
          <div class="sp-grid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: calc(var(--size-spacing-8, 8px) * 1.5);
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
            " title="--size-spacing-8: 8px"></div>
            <code style="${CODIGO_INLINE}">--size-spacing-8</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              space(8)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">8px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Gap entre elementos
            </span>
          </div>

          <!-- 4px ──────────────────────────────────────────────────────── -->
          <div class="sp-grid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: calc(var(--size-spacing-4, 4px) * 1.5);
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
            " title="--size-spacing-4: 4px"></div>
            <code style="${CODIGO_INLINE}">--size-spacing-4</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              space(4)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">4px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Gap entre grupos
            </span>
          </div>

          <!-- 0 ───────────────────────────────────────────────────────── -->
          <div class="sp-grid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 200px 72px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 40px;
              height: 12px;
              outline: 1px dashed var(--color-stroke-frame);
              box-sizing: border-box;
            " title="--size-spacing-0: 0"></div>
            <code style="${CODIGO_INLINE}">--size-spacing-0</code>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              space(0)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">0</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Sem espaçamento
            </span>
          </div>
        </section>

        <!-- ══ ESPAÇAMENTO FLUIDO ════════════════════════════════════════ -->
        <section>
          <h2 style="
            font-size: 18px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Espaçamento Fluido</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Valores adaptativos com <code style="${CODIGO_INLINE}">clamp()</code> para layouts que
            respondem à viewport. O valor real varia entre mínimo e máximo conforme a largura da
            tela; a barra abaixo exibe a proporção estimada neste viewport. Aplique via
            <code style="${CODIGO_INLINE}">--lui-spacing-fluid-*</code>
            <span style="${BADGE_DEFINIR}">a definir</span>.
          </p>

          <!-- Cabeçalho da tabela fluida -->
          <div class="sp-fluid-header" style="
            display: grid;
            grid-template-columns: 56px 1fr 160px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Visual</span>
            <span style="${LABEL_HEADER}">Token CSS</span>
            <span style="${LABEL_HEADER}">Faixa mín–máx</span>
            <span style="${LABEL_HEADER}">Uso recomendado</span>
          </div>

          <!-- xs: 4–8px ─────────────────────────────────────────────── -->
          <div class="sp-fluid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 160px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: 9px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              opacity: 0.4;
            " title="--lui-spacing-fluid-xs: 4–8px (a definir)"></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --lui-spacing-fluid-xs
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">4 – 8px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Gap entre itens em viewports variáveis
            </span>
          </div>

          <!-- sm: 8–16px ────────────────────────────────────────────── -->
          <div class="sp-fluid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 160px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: 18px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              opacity: 0.4;
            " title="--lui-spacing-fluid-sm: 8–16px (a definir)"></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --lui-spacing-fluid-sm
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">8 – 16px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Padding lateral responsivo
            </span>
          </div>

          <!-- md: 12–24px ───────────────────────────────────────────── -->
          <div class="sp-fluid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 160px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: 27px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              opacity: 0.4;
            " title="--lui-spacing-fluid-md: 12–24px (a definir)"></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --lui-spacing-fluid-md
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">12 – 24px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Gap entre seções em container fluido
            </span>
          </div>

          <!-- lg: 16–32px ───────────────────────────────────────────── -->
          <div class="sp-fluid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 160px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: 36px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              opacity: 0.4;
            " title="--lui-spacing-fluid-lg: 16–32px (a definir)"></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --lui-spacing-fluid-lg
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">16 – 32px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Padding de container responsivo
            </span>
          </div>

          <!-- xl: 24–48px ───────────────────────────────────────────── -->
          <div class="sp-fluid-row" style="
            display: grid;
            grid-template-columns: 56px 1fr 160px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              height: 12px;
              width: 54px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              opacity: 0.4;
            " title="--lui-spacing-fluid-xl: 24–48px (a definir)"></div>
            <span style="font-size: 13px; color: var(--color-text-essential-caption);">
              --lui-spacing-fluid-xl
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">24 – 48px</span>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Gap entre grupos grandes
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
            Os tokens <code style="${CODIGO_INLINE}">--lui-spacing-fluid-*</code> e a função SCSS
            <code style="${CODIGO_INLINE}">space($size)</code> ainda não foram definidos no
            pacote de tokens do Terra DS. Enquanto isso, utilize os tokens globais disponíveis
            (<code style="${CODIGO_INLINE}">--size-spacing-*</code>) e
            alinhe com o time de tokens a criação dos aliases definitivos.
          </p>
        </aside>

      </div>
    `,
    styles: [
      `
        @media (max-width: 1024px) {
          .sp-page { max-width: 100% !important; }
        }
        @media (max-width: 640px) {
          .sp-grid-header,
          .sp-fluid-header { display: none !important; }
          .sp-grid-row,
          .sp-fluid-row {
            grid-template-columns: 40px 1fr !important;
            gap: 4px 12px !important;
            padding: 10px 12px !important;
          }
        }
      `,
    ],
  }),
};
