import type { Meta, StoryObj } from '@storybook/angular';

/*
 * Tokens reais de elevação disponíveis no Terra DS (.storybook/styles.css):
 *
 * Elevação: --tds-sys-effect-elevation-low  | --tds-sys-effect-elevation-high
 *           --tds-sys-effect-elevation-higher
 *           (nenhum desses tokens está compilado no styles.css atual —
 *           amostras usam fallback hardcoded)
 *
 * Foco:    --color-state-system-focus (disponível)
 *           --color-state-feedback-negative-surface-base (disponível)
 *           --color-state-feedback-positive-surface-base (disponível)
 *
 * Aliases --lui-elevation-* e --lui-focus-ring-* ainda não estão definidos —
 * sinalizados como "a definir" nas tabelas abaixo.
 * As funções SCSS elevation($size) e focus-ring($variant) também são "a definir".
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
  title: 'Fundamentos/Elevation',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Os tokens de sombra comunicam a altura de cada superfície na hierarquia visual do Terra DS. ' +
          'São acessados pela função SCSS `elevation($size)` — ou diretamente pelas ' +
          'variáveis CSS `--tds-sys-effect-elevation-*`. ' +
          'Usar os tokens garante profundidade consistente em cards, modais, dropdowns, tooltips e overlays.',
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
      <div class="el-page" style="
        max-width: 860px;
        font-family: var(--font-family-primary, 'DM Sans', sans-serif);
        color: var(--color-text-essential-body);
        font-size: 14px;
        line-height: 1.6;
      ">

        <!-- ══ SEÇÃO ELEVATION ══════════════════════════════════════════ -->
        <section style="margin-bottom: 48px;">
          <h1 style="
            font-size: 24px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 16px;
          ">Elevation</h1>

          <p style="margin: 0 0 12px;">
            Os tokens de sombra comunicam a <strong>altura de cada superfície</strong>
            na hierarquia visual do Terra DS.
          </p>
          <p style="margin: 0;">
            Aplique via função SCSS
            <code style="${CODIGO_INLINE}">elevation($size)</code>
            <span style="${BADGE_DEFINIR}">a definir</span>
            ou diretamente pelas variáveis CSS
            <code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-*</code>.
          </p>
        </section>

        <!-- ══ NÍVEIS DE ELEVAÇÃO ════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: 18px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Níveis de Elevação</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            Escala de profundidade do raso ao profundo. O token
            <code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-low</code> (~4px) eleva
            superfícies como cards; o
            <code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-high</code> (~8px) separa
            elementos flutuantes como dropdowns; o
            <code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-higher</code> (~16px)
            destaca modais e overlays.
          </p>

          <!-- Cabeçalho da tabela -->
          <div class="el-grid-header" style="
            display: grid;
            grid-template-columns: 96px 1fr 200px 1fr 1fr;
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

          <!-- base → --tds-sys-effect-elevation-low ──────────────────── -->
          <div class="el-grid-row" style="
            display: grid;
            grid-template-columns: 96px 1fr 200px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 16px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 72px;
              height: 72px;
              background: var(--color-theme-upper);
              border: 1px solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: var(--tds-sys-effect-elevation-low, 0 4px 8px 0 rgba(0,0,0,0.1));
            " title="base: 0 4px 8px 0 rgba(0,0,0,0.1)"></div>
            <div>
              <code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-low</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-elevation-base
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              elevation(low)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 4px 8px 0 rgba(0,0,0,0.1)</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Cards, superfícies em repouso
            </span>
          </div>

          <!-- lowered → --tds-sys-effect-elevation-high ─────────────── -->
          <div class="el-grid-row" style="
            display: grid;
            grid-template-columns: 96px 1fr 200px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 16px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 72px;
              height: 72px;
              background: var(--color-theme-upper);
              border: 1px solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: var(--tds-sys-effect-elevation-high, 0 8px 16px 0 rgba(0,0,0,0.1));
            " title="lowered: 0 8px 16px 0 rgba(0,0,0,0.1)"></div>
            <div>
              <code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-high</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-elevation-lowered
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              elevation(high)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 8px 16px 0 rgba(0,0,0,0.1)</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Dropdowns, popovers, tooltips
            </span>
          </div>

          <!-- floating → --tds-sys-effect-elevation-higher ───────────── -->
          <div class="el-grid-row" style="
            display: grid;
            grid-template-columns: 96px 1fr 200px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 16px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 72px;
              height: 72px;
              background: var(--color-theme-upper);
              border: 1px solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: var(--tds-sys-effect-elevation-higher, 0 16px 32px 0 rgba(0,0,0,0.1));
            " title="floating: 0 16px 32px 0 rgba(0,0,0,0.1)"></div>
            <div>
              <code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-higher</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-elevation-floating
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              elevation(higher)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 16px 32px 0 rgba(0,0,0,0.1)</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Modais, drawers, menus contextuais
            </span>
          </div>

          <!-- overlay → --tds-sys-effect-elevation-higher ─────────────── -->
          <div class="el-grid-row" style="
            display: grid;
            grid-template-columns: 96px 1fr 200px 1fr 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 16px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 72px;
              height: 72px;
              background: var(--color-theme-upper);
              border: 1px solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: var(--tds-sys-effect-elevation-higher, 0 16px 32px 0 rgba(0,0,0,0.1));
            " title="overlay: 0 16px 32px 0 rgba(0,0,0,0.1)"></div>
            <div>
              <code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-higher</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-elevation-overlay
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              elevation(higher)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 16px 32px 0 rgba(0,0,0,0.1)</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Overlays de tela cheia, notificações toast
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption);">
                Compartilha o mesmo token de floating.
              </span>
            </span>
          </div>
        </section>

        <!-- ══ ESCALA VISUAL ════════════════════════════════════════════ -->
        <section style="margin-bottom: 56px;">
          <h2 style="
            font-size: 18px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Escala Visual</h2>
          <p style="margin: 0 0 20px; color: var(--color-text-essential-caption); font-size: 13px;">
            A percepção da sombra varia conforme o tema (claro/escuro). O fundo neutro fixo abaixo
            serve apenas para comparação relativa entre os níveis — em componentes reais, a sombra
            interage com a cor de fundo do tema ativo.
          </p>

          <div class="el-scale-grid" style="
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
            padding: 32px;
            background: #f0f0f0;
            border-radius: var(--size-radius-8, 8px);
          ">
            <!-- base -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <div style="
                width: 80px;
                height: 80px;
                background: #ffffff;
                border-radius: var(--size-radius-4, 4px);
                outline: 1px dashed #cccccc;
                box-shadow: var(--tds-sys-effect-elevation-low, 0 4px 8px 0 rgba(0,0,0,0.1));
              " title="base"></div>
              <div style="text-align: center;">
                <div style="font-size: 12px; font-weight: 600; color: #374151;">base</div>
                <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">0 4px 8px 0</div>
              </div>
            </div>

            <!-- lowered -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <div style="
                width: 80px;
                height: 80px;
                background: #ffffff;
                border-radius: var(--size-radius-4, 4px);
                outline: 1px dashed #cccccc;
                box-shadow: var(--tds-sys-effect-elevation-high, 0 8px 16px 0 rgba(0,0,0,0.1));
              " title="lowered"></div>
              <div style="text-align: center;">
                <div style="font-size: 12px; font-weight: 600; color: #374151;">lowered</div>
                <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">0 8px 16px 0</div>
              </div>
            </div>

            <!-- floating -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <div style="
                width: 80px;
                height: 80px;
                background: #ffffff;
                border-radius: var(--size-radius-4, 4px);
                outline: 1px dashed #cccccc;
                box-shadow: var(--tds-sys-effect-elevation-higher, 0 16px 32px 0 rgba(0,0,0,0.1));
              " title="floating"></div>
              <div style="text-align: center;">
                <div style="font-size: 12px; font-weight: 600; color: #374151;">floating</div>
                <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">0 16px 32px 0</div>
              </div>
            </div>

            <!-- overlay -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <div style="
                width: 80px;
                height: 80px;
                background: #ffffff;
                border-radius: var(--size-radius-4, 4px);
                outline: 1px dashed #cccccc;
                box-shadow: var(--tds-sys-effect-elevation-higher, 0 16px 32px 0 rgba(0,0,0,0.1));
              " title="overlay"></div>
              <div style="text-align: center;">
                <div style="font-size: 12px; font-weight: 600; color: #374151;">overlay</div>
                <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">0 16px 32px 0</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ FOCUS RING ════════════════════════════════════════════════ -->
        <section>
          <h2 style="
            font-size: 18px;
            font-weight: 700;
            color: var(--color-text-essential-heading);
            margin: 0 0 8px;
          ">Focus Ring</h2>
          <p style="margin: 0 0 24px; color: var(--color-text-essential-caption); font-size: 13px;">
            O focus ring é o contorno visual aplicado ao redor de elementos interativos quando
            recebem foco por teclado. No Terra DS, as variantes abaixo seguem a intenção semântica
            do componente. A função SCSS
            <code style="${CODIGO_INLINE}">focus-ring($variant)</code>
            <span style="${BADGE_DEFINIR}">a definir</span>
            está sinalizada como "a definir".
          </p>

          <!-- Cabeçalho da tabela -->
          <div class="el-fr-header" style="
            display: grid;
            grid-template-columns: 64px 1fr 200px 120px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 0 16px 8px;
            border-bottom: 2px solid var(--color-stroke-frame);
            margin-bottom: 4px;
          ">
            <span style="${LABEL_HEADER}">Visual</span>
            <span style="${LABEL_HEADER}">Token de cor</span>
            <span style="${LABEL_HEADER}">Função SCSS</span>
            <span style="${LABEL_HEADER}">Espessura</span>
            <span style="${LABEL_HEADER}">Uso recomendado</span>
          </div>

          <!-- primary ─────────────────────────────────────────────────── -->
          <div class="el-fr-row" style="
            display: grid;
            grid-template-columns: 64px 1fr 200px 120px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 48px;
              height: 48px;
              background: var(--color-branding-surface-primary-base);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: 0 0 0 2px var(--color-state-system-focus);
            " title="focus ring primary"></div>
            <div>
              <code style="${CODIGO_INLINE}">--color-state-system-focus</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-focus-ring-primary
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              focus-ring(primary)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 0 0 2px</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Botões primários, inputs, links
            </span>
          </div>

          <!-- secondary ───────────────────────────────────────────────── -->
          <div class="el-fr-row" style="
            display: grid;
            grid-template-columns: 64px 1fr 200px 120px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 48px;
              height: 48px;
              background: var(--color-theme-upper);
              border: 1px solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: 0 0 0 2px var(--color-state-system-focus);
            " title="focus ring secondary"></div>
            <div>
              <code style="${CODIGO_INLINE}">--color-state-system-focus</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-focus-ring-secondary
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              focus-ring(secondary)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 0 0 2px</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Botões secundários e ghost
            </span>
          </div>

          <!-- danger ──────────────────────────────────────────────────── -->
          <div class="el-fr-row" style="
            display: grid;
            grid-template-columns: 64px 1fr 200px 120px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 48px;
              height: 48px;
              background: var(--color-theme-upper);
              border: 1px solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: 0 0 0 2px var(--color-state-feedback-negative-surface-base);
            " title="focus ring danger"></div>
            <div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-negative-surface-base</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-focus-ring-danger
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              focus-ring(danger)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 0 0 2px</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Ações destrutivas (excluir, remover)
            </span>
          </div>

          <!-- success ─────────────────────────────────────────────────── -->
          <div class="el-fr-row" style="
            display: grid;
            grid-template-columns: 64px 1fr 200px 120px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 48px;
              height: 48px;
              background: var(--color-theme-upper);
              border: 1px solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: 0 0 0 2px var(--color-state-feedback-positive-surface-base);
            " title="focus ring success"></div>
            <div>
              <code style="${CODIGO_INLINE}">--color-state-feedback-positive-surface-base</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-focus-ring-success
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              focus-ring(success)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 0 0 2px</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Ações de confirmação positiva
            </span>
          </div>

          <!-- neutral ─────────────────────────────────────────────────── -->
          <div class="el-fr-row" style="
            display: grid;
            grid-template-columns: 64px 1fr 200px 120px 1fr;
            gap: 8px 20px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--color-stroke-frame);
          ">
            <div style="
              width: 48px;
              height: 48px;
              background: var(--color-theme-upper);
              border: 1px solid var(--color-stroke-frame);
              border-radius: var(--size-radius-4, 4px);
              box-shadow: 0 0 0 2px var(--color-state-system-focus);
            " title="focus ring neutral"></div>
            <div>
              <code style="${CODIGO_INLINE}">--color-state-system-focus</code>
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption); margin-top: 4px; display: inline-block;">
                --lui-focus-ring-neutral
                <span style="${BADGE_DEFINIR}">a definir</span>
              </span>
            </div>
            <span style="color: var(--color-text-essential-caption); font-size: 12px;">
              focus-ring(neutral)
              <span style="${BADGE_DEFINIR}">a definir</span>
            </span>
            <code style="${CODIGO_INLINE}">0 0 0 2px</code>
            <span style="font-size: 13px; color: var(--color-text-essential-body);">
              Tags, badges, chips informativos
              <br/>
              <span style="font-size: 11px; color: var(--color-text-essential-caption);">
                Usa a mesma cor de foco do sistema que primary.
              </span>
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
            Os aliases
            <code style="${CODIGO_INLINE}">--lui-elevation-&#123;base,lowered,floating,overlay&#125;</code>,
            <code style="${CODIGO_INLINE}">--lui-focus-ring-&#123;primary,secondary,danger,success,neutral&#125;</code>
            e as funções SCSS
            <code style="${CODIGO_INLINE}">elevation($size)</code> e
            <code style="${CODIGO_INLINE}">focus-ring($variant)</code>
            ainda não foram definidos no pacote de tokens do Terra DS.
            Enquanto isso, utilize os tokens globais disponíveis
            (<code style="${CODIGO_INLINE}">--tds-sys-effect-elevation-*</code>,
            <code style="${CODIGO_INLINE}">--color-state-system-focus</code>,
            <code style="${CODIGO_INLINE}">--color-state-feedback-*-surface-base</code>)
            e alinhe com o time de tokens a criação dos aliases definitivos.
          </p>
        </aside>

      </div>
    `,
    styles: [
      `
        @media (max-width: 1024px) {
          .el-page { max-width: 100% !important; }
        }
        @media (max-width: 640px) {
          .el-grid-header,
          .el-fr-header { display: none !important; }
          .el-grid-row {
            grid-template-columns: 72px 1fr !important;
            gap: 4px 12px !important;
            padding: 10px 12px !important;
          }
          .el-fr-row {
            grid-template-columns: 56px 1fr !important;
            gap: 4px 12px !important;
            padding: 10px 12px !important;
          }
          .el-scale-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
            padding: 20px !important;
          }
        }
      `,
    ],
  }),
};
