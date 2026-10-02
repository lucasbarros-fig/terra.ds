import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, input, signal, viewChild } from '@angular/core';
import { DialogBodyComponent, DialogComponent, DialogHeaderComponent, IconComponent } from './terra';
import { ASSET } from './data';

/**
 * Vídeo do produto (Figma "The House - New Ds Test" › Nova proposta › Produto › Video, 169:8680).
 * - Mouse parado sobre a miniatura (600ms): toca a prévia sem som, em loop.
 * - Clique (ou Enter/Espaço): abre o vídeo grande num Dialog do Terra, com som e controles.
 * Sem `src`, a prévia anima a capa e o Dialog mostra a capa com o aviso de que o vídeo ainda não foi enviado.
 */
@Component({
  selector: 'jv-video-produto',
  standalone: true,
  imports: [DialogComponent, DialogHeaderComponent, DialogBodyComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vp">
      <span class="vp-moldura" aria-hidden="true"></span>
      <button type="button" class="vp-thumb" [class.is-previa]="previa()" [attr.aria-label]="'Assistir: ' + titulo()"
        (mouseenter)="parar(); agendar()" (mouseleave)="parar()" (focus)="agendar()" (blur)="parar()" (click)="abrir()">
        <img class="vp-capa" [src]="capa()" alt="" />
        @if (src() && previa()) {
          <video #previaEl class="vp-video" [src]="src()" muted playsinline loop autoplay></video>
        }
        <span class="vp-play" aria-hidden="true"><lib-icon icon="Play" [size]="20" color="inherit"></lib-icon></span>
        @if (previa()) {
          <span class="vp-chip" aria-hidden="true"><i></i> Prévia</span>
          <span class="vp-barra" aria-hidden="true"><i></i></span>
        }
      </button>
    </div>

    <lib-dialog [open]="aberto()" [ariaLabel]="titulo()" (backdropClick)="fechar()">
      <lib-dialog-header [title]="titulo()" (closeClick)="fechar()"></lib-dialog-header>
      <lib-dialog-body>
        <div class="vp-grande">
          @if (src()) {
            <video [src]="src()" [poster]="capa()" controls autoplay playsinline></video>
          } @else {
            <img [src]="capa()" alt="" />
            <p class="vp-aviso"><lib-icon icon="Info" [size]="16" color="inherit"></lib-icon> O vídeo ainda não foi enviado para o protótipo. Aqui ele toca com som e controles.</p>
          }
        </div>
      </lib-dialog-body>
    </lib-dialog>
  `,
  styles: [`
    :host { display: block; }
    .vp { position: relative; padding: var(--size-spacing-8) var(--size-spacing-8) var(--size-spacing-8) 0; }
    .vp-moldura { position: absolute; top: 0; right: 0; left: 9.09%; height: calc(100% - 16px); border-radius: var(--size-radius-8);
      background: linear-gradient(160deg, var(--color-branding-surface-primary-base) 2%, var(--color-branding-surface-primary-pressing) 40%); }
    .vp-thumb { position: relative; display: grid; place-items: center; width: 100%; aspect-ratio: 344 / 202; padding: 0; overflow: hidden;
      border: 0; border-radius: var(--size-radius-8); background: #000; cursor: pointer;
      &:focus-visible { outline: var(--size-stoke-2) solid var(--color-state-system-focus); outline-offset: 2px; } }
    .vp-capa, .vp-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .vp-capa { transition: transform 600ms ease, filter 300ms ease; }
    .vp-thumb:hover .vp-capa { filter: brightness(.92); }
    .vp-thumb.is-previa .vp-capa { animation: vp-kenburns 9s ease-in-out infinite alternate; filter: none; }
    .vp-play { position: relative; z-index: 1; display: inline-grid; place-items: center; padding: var(--size-spacing-12);
      border-radius: var(--size-radius-8); background: var(--color-branding-surface-primary-base); color: var(--color-icons-static-white);
      transition: opacity 200ms ease, transform 200ms ease; }
    .vp-thumb:hover .vp-play { background: var(--color-branding-surface-primary-hovering); transform: scale(1.06); }
    .vp-thumb.is-previa .vp-play { opacity: 0; transform: scale(.9); }
    .vp-chip { position: absolute; z-index: 1; top: var(--size-spacing-8); left: var(--size-spacing-8); display: inline-flex; align-items: center; gap: 6px;
      padding: 2px 8px; border-radius: var(--size-radius-999); background: rgba(0, 0, 0, .55); color: #fff; font-size: var(--size-font-body-12); font-weight: 500;
      i { width: 6px; height: 6px; border-radius: 50%; background: var(--color-support-colors-red); animation: vp-pisca 1.2s ease-in-out infinite; } }
    .vp-barra { position: absolute; z-index: 1; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(255, 255, 255, .25);
      i { display: block; height: 100%; width: 0; background: var(--color-branding-surface-primary-base); animation: vp-progresso 12s linear infinite; } }
    .vp-grande { width: min(880px, 82vw);
      video, img { display: block; width: 100%; aspect-ratio: 16 / 10; border-radius: var(--size-radius-8); background: #000; object-fit: cover; } }
    .vp-aviso { display: flex; align-items: center; gap: var(--size-spacing-8); margin: var(--size-spacing-12) 0 0; font-size: var(--size-font-body-14); color: var(--color-text-essential-caption); }
    @keyframes vp-kenburns { from { transform: scale(1); } to { transform: scale(1.12) translate(-2%, -2%); } }
    @keyframes vp-pisca { 50% { opacity: .3; } }
    @keyframes vp-progresso { to { width: 100%; } }
    @media (prefers-reduced-motion: reduce) {
      .vp-thumb.is-previa .vp-capa, .vp-chip i, .vp-barra i { animation: none; }
    }
  `],
})
export class VideoProdutoComponent {
  readonly titulo = input('Conheça o produto em vídeo');
  /** Capa (caminho relativo ao app). */
  readonly poster = input('img/video/apresentacao-the-house.jpg');
  /** Arquivo de vídeo (mp4/webm). Vazio: usa a prévia animada da capa. */
  readonly src = input('');

  protected readonly capa = computed(() => ASSET + this.poster());
  protected readonly previa = signal(false);
  protected readonly aberto = signal(false);
  private readonly previaEl = viewChild<ElementRef<HTMLVideoElement>>('previaEl');
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected agendar(): void {
    if (this.timer || this.aberto()) return;
    this.timer = setTimeout(() => { this.timer = null; this.previa.set(true); }, 600);
  }
  protected parar(): void {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    this.previaEl()?.nativeElement.pause();
    this.previa.set(false);
  }
  protected abrir(): void { this.parar(); this.aberto.set(true); }
  @HostListener('document:keydown.escape')
  protected fechar(): void { this.aberto.set(false); }
}
