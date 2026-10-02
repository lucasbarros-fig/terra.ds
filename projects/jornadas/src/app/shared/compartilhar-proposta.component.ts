import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DialogBodyComponent, DialogComponent, DialogHeaderComponent, IconButtonComponent, IconComponent, PartnerComponent } from './terra';
import { AvisosService } from './avisos.service';
import { J } from './data';

export interface PropostaCompartilhada {
  produto: string;
  icone: string;
  perfil: string;
  solucao: string;
  parceiros: string[];
}

/**
 * Dialog "Disponibilizar para o cliente preencher": prévia do convite que o cliente recebe
 * e as formas de envio (copiar link, WhatsApp, e-mail, compartilhar do sistema e baixar a imagem).
 */
@Component({
  selector: 'jv-compartilhar-proposta',
  standalone: true,
  imports: [DialogComponent, DialogHeaderComponent, DialogBodyComponent, IconButtonComponent, IconComponent, PartnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lib-dialog [open]="aberto()" [ariaLabel]="'Enviar ' + dados().produto + ' para o cliente'" (backdropClick)="fechar.emit()">
      <lib-dialog-header [title]="'Enviar ' + dados().produto" (closeClick)="fechar.emit()"></lib-dialog-header>
      <lib-dialog-body>
        <div class="cp">
          <p class="cp-intro">O cliente recebe este link, preenche os dados dele e a proposta volta para você acompanhar em Propostas.</p>

          <article class="cp-card" aria-label="Prévia do convite">
              <header class="cp-card-head">
                <span class="cp-ic"><lib-icon [icon]="dados().icone" [size]="20" color="inherit"></lib-icon></span>
                <h3>{{ dados().produto }}</h3>
              </header>

              <div class="cp-destaque">
                <div>
                  <span>Tempo para preencher</span>
                  <b class="cp-grande">~10 <small>min</small></b>
                  <em>Direto pelo celular</em>
                </div>
                <i aria-hidden="true"></i>
                <div>
                  <span>{{ dados().parceiros.length === 1 ? 'Parceiro' : 'Parceiros' }}</span>
                  <div class="cp-logos">
                    @for (n of dados().parceiros.slice(0, 5); track n) {
                      <lib-partner [partner]="n" partnerStyle="fill" type="default" [size]="32"></lib-partner>
                    }
                    @if (dados().parceiros.length > 5) { <span class="cp-mais">+{{ dados().parceiros.length - 5 }}</span> }
                  </div>
                </div>
              </div>

              <footer class="cp-link">
                <lib-icon icon="LinkSimple" [size]="16" color="inherit"></lib-icon>
                <span>{{ linkCurto() }}</span>
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
    .cp-grande { font-size: var(--size-font-heading-24); font-weight: 700; line-height: 1.2; color: var(--color-text-essential-heading);
      small { font-size: var(--size-font-body-12); font-weight: 500; color: var(--color-text-essential-caption); } }
    .cp-logos { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 2px; }
    .cp-mais { font-size: var(--size-font-body-12) !important; font-weight: 600; color: var(--color-text-essential-body) !important; }
    .cp-link { display: flex; align-items: center; gap: var(--size-spacing-8); padding-top: var(--size-spacing-12); border-top: 1px solid var(--color-stroke-frame);
      font-size: var(--size-font-body-12); color: var(--color-branding-text-primary, var(--color-branding-surface-primary-base));
      span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
    .cp-acoes { display: flex; justify-content: center; gap: var(--size-spacing-24); margin: 0; padding: 0; list-style: none;
      li { display: flex; flex-direction: column; align-items: center; gap: var(--size-spacing-8); min-width: 64px; }
      span { font-size: var(--size-font-body-14); color: var(--color-text-essential-body); } }
    @media (max-width: 600px) {
      .cp { width: calc(100vw - 64px); }
      .cp-destaque { grid-template-columns: 1fr; > i { height: 1px; } }
      .cp-card-head { flex-wrap: wrap; h3 { flex-basis: calc(100% - 48px); } }
      .cp-acoes { gap: var(--size-spacing-8); justify-content: space-between; li { min-width: 0; } span { font-size: var(--size-font-body-12); white-space: nowrap; } }
    }
  `],
})
export class CompartilharPropostaComponent {
  readonly aberto = input(false);
  readonly dados = input.required<PropostaCompartilhada>();
  readonly fechar = output<void>();

  private readonly avisos = inject(AvisosService);
  protected readonly corretor = J.topo.account.name;
  protected readonly copiado = signal(false);

  /** Código estável por produto + perfil (protótipo; no back vem da API). */
  protected readonly codigo = computed(() => {
    const t = this.dados().produto + this.dados().perfil;
    let h = 0; for (const c of t) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return 'TH-' + String(10000 + (h % 90000));
  });
  protected readonly link = computed(() => 'https://thehouse.com.br/p/' + this.codigo().toLowerCase());
  protected readonly linkCurto = computed(() => this.link().replace('https://', ''));
  private readonly mensagem = computed(() =>
    `Olá! Preparei sua proposta de ${this.dados().produto} na The House. Leva uns 10 minutos para preencher: ${this.link()}`);

  protected readonly acoes = [
    { id: 'copiar', label: 'Copiar link', icon: 'LinkSimple' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'WhatsappLogo' },
    { id: 'email', label: 'E-mail', icon: 'EnvelopeSimple' },
    { id: 'mais', label: 'Compartilhar', icon: 'ShareNetwork' },
    { id: 'baixar', label: 'Baixar', icon: 'DownloadSimple' },
  ] as const;

  protected agir(id: (typeof this.acoes)[number]['id']): void {
    const msg = this.mensagem();
    if (id === 'copiar') this.copiar(this.link());
    if (id === 'whatsapp') this.abrir('https://wa.me/?text=' + encodeURIComponent(msg));
    if (id === 'email') this.abrir(`mailto:?subject=${encodeURIComponent('Sua proposta de ' + this.dados().produto)}&body=${encodeURIComponent(msg)}`);
    if (id === 'mais') {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (nav.share) nav.share({ title: this.dados().produto, text: msg, url: this.link() }).catch(() => {});
      else this.copiar(msg, 'Mensagem copiada. Cole onde quiser enviar.');
    }
    if (id === 'baixar') this.baixar();
  }

  private copiar(texto: string, aviso = 'Link copiado. Agora é só enviar para o cliente.'): void {
    const ok = () => { this.copiado.set(true); setTimeout(() => this.copiado.set(false), 2000); this.avisos.mostrar(aviso, 'success', 4000); };
    navigator.clipboard?.writeText(texto).then(ok, () => this.avisos.mostrar('Não foi possível copiar. Selecione o link na prévia.', 'warning'));
  }

  private abrir(url: string): void {
    const w = window.open(url, '_blank', 'noopener');
    if (!w && !url.startsWith('mailto:')) this.avisos.mostrar('O navegador bloqueou a nova aba. Use "Copiar link".', 'warning');
  }

  /** Gera um PNG do convite (desenhado no canvas, com as cores do tema atual). */
  private baixar(): void {
    const css = getComputedStyle(document.documentElement);
    const cor = (v: string, f: string) => css.getPropertyValue(v).trim() || f;
    const fonte = getComputedStyle(document.body).fontFamily || 'sans-serif';
    const W = 1080, H = 540, esc = 1;
    const cv = document.createElement('canvas'); cv.width = W * esc; cv.height = H * esc;
    const g = cv.getContext('2d'); if (!g) return;
    const fundo = cor('--color-theme-lower', '#f4f5f7'), base = cor('--color-theme-base', '#ffffff');
    const titulo = cor('--color-text-essential-heading', '#1b1d21'), legenda = cor('--color-text-essential-caption', '#6b7280');
    const linha = cor('--color-stroke-frame', '#e5e7eb'), marca = cor('--color-branding-surface-primary-base', '#2b7de9');
    const ret = (x: number, y: number, w: number, h: number, r: number, f: string, s?: string) => {
      g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); if (s) { g.strokeStyle = s; g.lineWidth = 2; g.stroke(); } };
    const txt = (t: string, x: number, y: number, tam: number, peso: number, c: string, alinhar: CanvasTextAlign = 'left') => {
      g.font = `${peso} ${tam}px ${fonte}`; g.fillStyle = c; g.textAlign = alinhar; g.fillText(t, x, y); };

    ret(0, 0, W, H, 0, fundo);
    ret(48, 48, W - 96, H - 96, 16, base, linha);
    txt('The House', 96, 116, 22, 700, marca);
    txt(this.dados().produto, 96, 176, 38, 700, titulo);
    ret(96, 212, W - 192, 150, 12, fundo);
    txt('Tempo para preencher', 128, 258, 20, 400, legenda);
    txt('~10 min', 128, 312, 44, 700, titulo);
    txt('Parceiros', W / 2 + 32, 258, 20, 400, legenda);
    g.font = `600 22px ${fonte}`;
    const lista = [...this.dados().parceiros]; const max = W / 2 - 160;
    let nomes = lista.join(' · ');
    while (lista.length > 1 && g.measureText(nomes).width > max) { lista.pop(); nomes = lista.join(' · ') + ` +${this.dados().parceiros.length - lista.length}`; }
    txt(nomes, W / 2 + 32, 306, 22, 600, titulo);
    g.fillStyle = linha; g.fillRect(W / 2, 236, 2, 102);
    txt(this.linkCurto(), 96, 430, 22, 600, marca);

    cv.toBlob((b) => {
      if (!b) return;
      const a = document.createElement('a'); a.href = URL.createObjectURL(b);
      a.download = `proposta-${this.codigo().toLowerCase()}.png`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      this.avisos.mostrar('Imagem do convite baixada.', 'success', 4000);
    }, 'image/png');
  }
}
