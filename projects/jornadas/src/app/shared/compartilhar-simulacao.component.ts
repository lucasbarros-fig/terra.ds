import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DialogBodyComponent, DialogComponent, DialogHeaderComponent, IconButtonComponent, IconComponent, PartnerComponent } from './terra';
import { AvisosService } from './avisos.service';
import { brl } from './data';

export interface SimulacaoCompartilhada {
  produto: string;
  icone: string;
  /** Rótulo da parcela de destaque ("1ª parcela" no SAC, "Parcela" no Price). */
  rotuloParcela: string;
  parcela: number;
  parceiro: string;
  taxa: string;
  dados: { rotulo: string; valor: string }[];
  parceiros: string[];
}

/**
 * Dialog "Compartilhar simulação" no mesmo padrão do envio de proposta:
 * prévia do resumo que o cliente recebe e as formas de envio (copiar, WhatsApp, e-mail, compartilhar do sistema e baixar a imagem).
 */
@Component({
  selector: 'jv-compartilhar-simulacao',
  standalone: true,
  imports: [DialogComponent, DialogHeaderComponent, DialogBodyComponent, IconButtonComponent, IconComponent, PartnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lib-dialog size="content" [open]="aberto()" ariaLabel="Compartilhar simulação" (backdropClick)="fechar.emit()">
      <lib-dialog-header title="Compartilhar simulação" (closeClick)="fechar.emit()"></lib-dialog-header>
      <lib-dialog-body>
        <div class="cp">
          <p class="cp-intro">Envie o resumo para o cliente acompanhar a melhor condição encontrada entre os parceiros.</p>

          <article class="cp-card" aria-label="Prévia do resumo">
            <header class="cp-card-head">
              <span class="cp-ic"><lib-icon [icon]="dados().icone" [size]="20" color="inherit"></lib-icon></span>
              <h3>{{ dados().produto }}</h3>
            </header>

            <div class="cp-destaque">
              <div>
                <span>Melhor {{ dados().rotuloParcela.toLowerCase() }}</span>
                <b class="cp-grande">{{ moeda(dados().parcela) }}</b>
                <em>{{ dados().parceiro }} · {{ dados().taxa }}</em>
              </div>
              <i aria-hidden="true"></i>
              <div>
                <span>{{ dados().parceiros.length === 1 ? 'Parceiro' : 'Parceiros comparados' }}</span>
                <div class="cp-logos">
                  @for (n of dados().parceiros.slice(0, 5); track n) {
                    <lib-partner [partner]="n" partnerStyle="fill" type="default" [size]="32"></lib-partner>
                  }
                  @if (dados().parceiros.length > 5) { <span class="cp-mais">+{{ dados().parceiros.length - 5 }}</span> }
                </div>
              </div>
            </div>

            <dl class="cp-dados">
              @for (d of dados().dados; track d.rotulo) { <div><dt>{{ d.rotulo }}</dt><dd>{{ d.valor }}</dd></div> }
            </dl>

            <footer class="cp-link">
              <lib-icon icon="Info" [size]="16" color="inherit"></lib-icon>
              <span>Valores de referência, sujeitos à análise de crédito de cada parceiro.</span>
            </footer>
          </article>

          <ul class="cp-acoes" aria-label="Formas de envio">
            @for (a of acoes; track a.id) {
              <li>
                <lib-icon-button type="branding" variant="filled" [icon]="a.id === 'copiar' && copiado() ? 'Check' : a.icon" [ariaLabel]="a.label" (clicked)="agir(a.id)"></lib-icon-button>
                <span aria-hidden="true">{{ a.id === 'copiar' && copiado() ? 'Copiado' : a.label }}</span>
              </li>
            }
          </ul>
        </div>
      </lib-dialog-body>
    </lib-dialog>
  `,
  styles: [`
    :host { display: contents; }
    .cp { display: flex; flex-direction: column; gap: var(--size-spacing-24); width: min(560px, calc(100vw - 80px)); }
    .cp-intro { margin: 0; font-size: var(--size-font-body-14); line-height: 1.5; color: var(--color-text-essential-body); }
    .cp-card { display: flex; flex-direction: column; gap: var(--size-spacing-16); padding: var(--size-spacing-16);
      border: 1px solid color-mix(in srgb, var(--color-stroke-frame) 60%, transparent); border-radius: var(--size-radius-8); background: transparent; }
    .cp-card-head { display: flex; align-items: center; gap: var(--size-spacing-8);
      h3 { flex: 1; min-width: 0; margin: 0; font-size: var(--size-font-body-16); font-weight: 700; color: var(--color-text-essential-heading); } }
    .cp-ic { display: inline-grid; place-items: center; flex: 0 0 auto; width: 32px; height: 32px; border: 1px solid var(--color-stroke-frame);
      border-radius: var(--size-radius-8); color: var(--color-icons-essential-default, var(--color-text-essential-heading)); }
    .cp-destaque { display: grid; grid-template-columns: 1fr 1px 1fr; gap: var(--size-spacing-16); padding: var(--size-spacing-16);
      border-radius: var(--size-radius-8); background: color-mix(in srgb, var(--color-theme-lower) 70%, transparent);
      > i { background: var(--color-stroke-frame); }
      > div { display: flex; flex-direction: column; gap: var(--size-spacing-4); min-width: 0; }
      span { font-size: var(--size-font-body-12); color: var(--color-text-essential-caption); }
      em { font-style: normal; font-size: var(--size-font-body-12); color: var(--color-text-essential-caption); } }
    .cp-grande { font-size: var(--size-font-heading-24); font-weight: 700; line-height: 1.2; color: var(--color-text-essential-heading); }
    .cp-logos { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 2px; }
    .cp-mais { font-size: var(--size-font-body-12) !important; font-weight: 600; color: var(--color-text-essential-body) !important; }
    .cp-dados { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--size-spacing-12); margin: 0;
      dt { font-size: var(--size-font-body-12); color: var(--color-text-essential-caption); }
      dd { margin: 2px 0 0; font-size: var(--size-font-body-14); font-weight: 600; color: var(--color-text-essential-heading); } }
    .cp-link { display: flex; align-items: center; gap: var(--size-spacing-8); padding-top: var(--size-spacing-12); border-top: 1px solid var(--color-stroke-frame);
      font-size: var(--size-font-body-12); color: var(--color-text-essential-caption); }
    .cp-acoes { display: flex; justify-content: center; gap: var(--size-spacing-24); margin: 0; padding: 0; list-style: none;
      li { display: flex; flex-direction: column; align-items: center; gap: var(--size-spacing-8); min-width: 64px; }
      span { font-size: var(--size-font-body-14); color: var(--color-text-essential-body); } }
    @media (max-width: 600px) {
      .cp { width: calc(100vw - 64px); }
      .cp-destaque { grid-template-columns: 1fr; > i { height: 1px; } }
      .cp-dados { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .cp-acoes { gap: var(--size-spacing-8); justify-content: space-between; li { min-width: 0; } span { font-size: var(--size-font-body-12); white-space: nowrap; } }
    }
  `],
})
export class CompartilharSimulacaoComponent {
  readonly aberto = input(false);
  readonly dados = input.required<SimulacaoCompartilhada>();
  readonly fechar = output<void>();

  private readonly avisos = inject(AvisosService);
  protected readonly copiado = signal(false);
  protected moeda(v: number): string { return 'R$ ' + brl(v); }

  private readonly mensagem = computed(() => {
    const d = this.dados();
    const linhas = d.dados.map((x) => `${x.rotulo}: ${x.valor}`).join('\n');
    return `Simulação The House · ${d.produto}\n${linhas}\nMelhor ${d.rotuloParcela.toLowerCase()}: ${this.moeda(d.parcela)} (${d.parceiro}, ${d.taxa})\n${d.parceiros.length} parceiros comparados. Valores de referência, sujeitos à análise de crédito.`;
  });

  protected readonly acoes = [
    { id: 'copiar', label: 'Copiar', icon: 'Copy' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'WhatsappLogo' },
    { id: 'email', label: 'E-mail', icon: 'EnvelopeSimple' },
    { id: 'mais', label: 'Compartilhar', icon: 'ShareNetwork' },
    { id: 'baixar', label: 'Baixar', icon: 'DownloadSimple' },
  ] as const;

  protected agir(id: (typeof this.acoes)[number]['id']): void {
    const msg = this.mensagem();
    if (id === 'copiar') this.copiar(msg, 'Resumo copiado. Agora é só enviar para o cliente.');
    if (id === 'whatsapp') this.abrir('https://wa.me/?text=' + encodeURIComponent(msg));
    if (id === 'email') this.abrir(`mailto:?subject=${encodeURIComponent('Sua simulação de ' + this.dados().produto)}&body=${encodeURIComponent(msg)}`);
    if (id === 'mais') {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (nav.share) nav.share({ title: 'Simulação ' + this.dados().produto, text: msg }).catch(() => {});
      else this.copiar(msg, 'Resumo copiado. Cole onde quiser enviar.');
    }
    if (id === 'baixar') this.baixar();
  }

  /** Copia com a API do navegador e, se o iframe bloquear, com o fallback de seleção. */
  private copiar(texto: string, aviso: string): void {
    const ok = () => { this.copiado.set(true); setTimeout(() => this.copiado.set(false), 2000); this.avisos.mostrar(aviso, 'success', 4000); };
    const reserva = () => {
      const t = document.createElement('textarea'); t.value = texto; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      const deu = document.execCommand('copy'); t.remove();
      deu ? ok() : this.avisos.mostrar('Não foi possível copiar. Use "Baixar" para enviar a imagem.', 'warning');
    };
    navigator.clipboard?.writeText(texto).then(ok, reserva) ?? reserva();
  }

  private abrir(url: string): void {
    const w = window.open(url, '_blank', 'noopener');
    if (!w && !url.startsWith('mailto:')) this.avisos.mostrar('O navegador bloqueou a nova aba. Use "Copiar".', 'warning');
  }

  /** Gera um PNG do resumo (desenhado no canvas, com as cores do tema atual). */
  private baixar(): void {
    const d = this.dados();
    const css = getComputedStyle(document.documentElement);
    const cor = (v: string, f: string) => css.getPropertyValue(v).trim() || f;
    const fonte = getComputedStyle(document.body).fontFamily || 'sans-serif';
    const W = 1080, H = 640;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d'); if (!g) return;
    const fundo = cor('--color-theme-lower', '#f4f5f7'), base = cor('--color-theme-base', '#ffffff');
    const titulo = cor('--color-text-essential-heading', '#1b1d21'), legenda = cor('--color-text-essential-caption', '#6b7280');
    const linha = cor('--color-stroke-frame', '#e5e7eb'), marca = cor('--color-branding-surface-primary-base', '#2b7de9');
    const ret = (x: number, y: number, w: number, h: number, r: number, f: string, s?: string) => {
      g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); if (s) { g.strokeStyle = s; g.lineWidth = 2; g.stroke(); } };
    const txt = (t: string, x: number, y: number, tam: number, peso: number, c: string) => {
      g.font = `${peso} ${tam}px ${fonte}`; g.fillStyle = c; g.textAlign = 'left'; g.fillText(t, x, y); };

    ret(0, 0, W, H, 0, fundo);
    ret(48, 48, W - 96, H - 96, 16, base, linha);
    txt('The House · Simulação', 96, 116, 22, 700, marca);
    txt(d.produto, 96, 172, 38, 700, titulo);
    ret(96, 204, W - 192, 150, 12, fundo);
    txt('Melhor ' + d.rotuloParcela.toLowerCase(), 128, 250, 20, 400, legenda);
    txt(this.moeda(d.parcela), 128, 304, 44, 700, titulo);
    txt(`${d.parceiro} · ${d.taxa}`, 128, 336, 18, 400, legenda);
    g.fillStyle = linha; g.fillRect(W / 2, 228, 2, 102);
    txt(d.parceiros.length === 1 ? 'Parceiro' : 'Parceiros comparados', W / 2 + 32, 250, 20, 400, legenda);
    txt(String(d.parceiros.length), W / 2 + 32, 304, 44, 700, titulo);
    const col = (W - 192) / 3;
    d.dados.slice(0, 6).forEach((x, i) => {
      const cx = 96 + (i % 3) * col, cy = 410 + Math.floor(i / 3) * 70;
      txt(x.rotulo, cx, cy, 18, 400, legenda);
      txt(x.valor, cx, cy + 30, 22, 600, titulo);
    });
    txt('Valores de referência, sujeitos à análise de crédito de cada parceiro.', 96, H - 76, 16, 400, legenda);

    cv.toBlob((b) => {
      if (!b) return;
      const a = document.createElement('a'); a.href = URL.createObjectURL(b);
      a.download = `simulacao-${d.produto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      this.avisos.mostrar('Imagem da simulação baixada.', 'success', 4000);
    }, 'image/png');
  }
}
