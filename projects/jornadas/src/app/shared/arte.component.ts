import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent } from './terra';
import { MarcaComponent } from './marca.component';

export type ArteModelo = 'cor' | 'claro' | 'escuro' | 'dividido';
export type ArteFormato = 'post' | 'story';

export interface Arte {
  id: string;
  categoria: string;
  modelo: ArteModelo;
  icone: string;
  chamada: string;
  destaque: string;
  texto: string;
  itens: string[];
  legenda: string;
  hashtags: string[];
}

/**
 * Arte pronta para redes sociais, desenhada com CSS (escala com o tamanho do card via container query).
 * Recebe a cor e o nome da loja do banker, então muda na hora quando ele personaliza.
 */
@Component({
  selector: 'jv-arte',
  standalone: true,
  imports: [IconComponent, MarcaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'ar ar--' + arte().modelo + ' ar--' + formato()", '[style.--ar-cor]': 'cor()', role: 'img', '[attr.aria-label]': 'rotulo()' },
  template: `
    <div class="ar-tela">
      <svg class="ar-casa" viewBox="0 0 200 160" aria-hidden="true">
        <path d="M14 78 100 12l86 66M34 63v85h132V63M84 148v-46h32v46" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
      </svg>
      @if (arte().modelo === 'dividido') { <span class="ar-faixa" aria-hidden="true"></span> }

      <div class="ar-topo">
        <span class="ar-icone"><lib-icon [icon]="arte().icone" [size]="32" color="inherit"></lib-icon></span>
        <span class="ar-tag">{{ arte().categoria }}</span>
      </div>

      <div class="ar-corpo">
        <p class="ar-chamada">{{ arte().chamada }}</p>
        <p class="ar-destaque">{{ arte().destaque }}</p>
        <p class="ar-texto">{{ arte().texto }}</p>
        @if (formato() === 'story' || arte().modelo === 'claro') {
          <ul class="ar-itens">
            @for (i of arte().itens; track i) { <li><span aria-hidden="true">✓</span>{{ i }}</li> }
          </ul>
        }
      </div>

      <div class="ar-rodape">
        @if (identidade() === 'thehouse') {
          <jv-marca class="ar-marca"></jv-marca>
          <span class="ar-loja ar-loja--th"><b>{{ loja() }}</b><small>Consultor The House</small></span>
        } @else {
          <span class="ar-logo" aria-hidden="true">{{ iniciais() }}</span>
          <span class="ar-loja"><b>{{ loja() }}</b><small>Parceiro The House</small></span>
        }
        @if (formato() === 'story') { <span class="ar-cta">Fale comigo</span> }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; container-type: inline-size; text-align: left; --ar-cor: #2b7de9; --ar-escuro: #0d1b2a; }
    .ar-tela { position: relative; display: flex; flex-direction: column; gap: 4cqw; aspect-ratio: 1 / 1; padding: 7cqw; overflow: hidden;
      border-radius: inherit; font-family: var(--font-family-primary, 'DM Sans', sans-serif); color: #fff; background: var(--ar-cor); isolation: isolate; }
    :host(.ar--story) .ar-tela { aspect-ratio: 9 / 16; padding: 9cqw 7cqw; gap: 6cqw; }

    .ar-casa { position: absolute; right: -10cqw; bottom: -8cqw; z-index: -1; width: 70cqw; color: #fff; opacity: .16; }
    :host(.ar--story) .ar-casa { width: 95cqw; bottom: 18cqw; right: -22cqw; }

    .ar-topo { display: flex; align-items: center; justify-content: space-between; gap: 3cqw; }
    .ar-icone { display: inline-grid; place-items: center; width: 13cqw; height: 13cqw; border-radius: 3.5cqw; background: rgba(255, 255, 255, .18);
      lib-icon { font-size: 7cqw; } ::ng-deep i { font-size: 7cqw !important; } }
    .ar-tag { overflow: hidden; max-width: 60%; padding: 1.4cqw 3cqw; border-radius: 99px; background: rgba(255, 255, 255, .18);
      font-size: 3.2cqw; font-weight: 600; letter-spacing: .02em; text-overflow: ellipsis; white-space: nowrap; }

    .ar-corpo { display: flex; flex: 1 1 auto; flex-direction: column; justify-content: center; gap: 2cqw; min-height: 0; }
    .ar-chamada { margin: 0; font-size: 4.6cqw; font-weight: 600; opacity: .9; }
    .ar-destaque { margin: 0; font-size: 10.5cqw; font-weight: 800; line-height: 1.02; letter-spacing: -.02em; text-wrap: balance; }
    .ar-texto { margin: 0; max-width: 78%; font-size: 3.9cqw; line-height: 1.35; opacity: .92; }
    :host(.ar--story) .ar-destaque { font-size: 13cqw; }
    :host(.ar--story) .ar-texto { font-size: 4.6cqw; max-width: 92%; }
    .ar-itens { display: flex; flex-direction: column; gap: 1.6cqw; margin: 2cqw 0 0; padding: 0; list-style: none; font-size: 3.6cqw; font-weight: 600;
      li { display: flex; align-items: center; gap: 2cqw; }
      span { display: inline-grid; place-items: center; width: 5cqw; height: 5cqw; border-radius: 50%; background: #fff; color: var(--ar-cor); font-size: 3cqw; font-weight: 800; } }
    :host(.ar--story) .ar-itens { font-size: 4.4cqw; gap: 2.6cqw; span { width: 6cqw; height: 6cqw; font-size: 3.6cqw; } }

    .ar-rodape { display: flex; align-items: center; gap: 2.6cqw; padding-top: 3.4cqw; border-top: .4cqw solid rgba(255, 255, 255, .28); }
    .ar-logo { display: inline-grid; place-items: center; flex: 0 0 auto; width: 9cqw; height: 9cqw; border-radius: 2.6cqw; background: #fff; color: var(--ar-cor);
      font-size: 3.6cqw; font-weight: 800; }
    .ar-loja { display: flex; flex: 1 1 auto; flex-direction: column; min-width: 0; line-height: 1.2;
      b { overflow: hidden; font-size: 3.8cqw; text-overflow: ellipsis; white-space: nowrap; } small { font-size: 2.8cqw; opacity: .8; } }
    .ar-marca { flex: 0 0 auto; height: 5.6cqw; color: #fff; --jv-marca-simbolo: #fff; }
    .ar-loja--th { padding-left: 2.6cqw; border-left: .4cqw solid rgba(255, 255, 255, .3); }
    :host(.ar--story) .ar-loja--th small { display: none; }
    :host(.ar--story) .ar-marca { height: 5cqw; }
    :host(.ar--claro) .ar-marca, :host(.ar--dividido) .ar-marca { color: var(--ar-escuro); --jv-marca-simbolo: var(--ar-cor); }
    :host(.ar--claro) .ar-loja--th, :host(.ar--dividido) .ar-loja--th { border-left-color: color-mix(in srgb, var(--ar-escuro) 15%, transparent); }
    .ar-cta { padding: 2cqw 4cqw; border-radius: 2.4cqw; background: #fff; color: var(--ar-cor); font-size: 3.8cqw; font-weight: 700; white-space: nowrap; }

    /* Claro: fundo branco, destaque na cor da loja */
    :host(.ar--claro) .ar-tela { color: var(--ar-escuro); background: #fff; }
    :host(.ar--claro) .ar-tela::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 2.4cqw; background: var(--ar-cor); }
    :host(.ar--claro) .ar-casa { color: var(--ar-cor); opacity: .1; }
    :host(.ar--claro) .ar-icone, :host(.ar--claro) .ar-tag { background: color-mix(in srgb, var(--ar-cor) 12%, #fff); color: var(--ar-cor); }
    :host(.ar--claro) .ar-destaque { color: var(--ar-cor); }
    :host(.ar--claro) .ar-itens span { background: var(--ar-cor); color: #fff; }
    :host(.ar--claro) .ar-rodape { border-top-color: color-mix(in srgb, var(--ar-escuro) 12%, transparent); }
    :host(.ar--claro) .ar-logo, :host(.ar--claro) .ar-cta { background: var(--ar-cor); color: #fff; }

    /* Escuro: azul-noite com destaque na cor */
    :host(.ar--escuro) .ar-tela { background: radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--ar-cor) 45%, var(--ar-escuro)) 0%, var(--ar-escuro) 60%); }
    :host(.ar--escuro) .ar-destaque { color: color-mix(in srgb, var(--ar-cor) 55%, #fff); }
    :host(.ar--escuro) .ar-casa { color: var(--ar-cor); opacity: .35; }
    :host(.ar--escuro) .ar-logo, :host(.ar--escuro) .ar-cta { background: var(--ar-cor); color: #fff; }
    :host(.ar--escuro) .ar-itens span { background: var(--ar-cor); color: #fff; }

    /* Dividido: faixa na cor em cima, texto escuro embaixo */
    :host(.ar--dividido) .ar-tela { color: var(--ar-escuro); background: #f4f6f9; }
    .ar-faixa { position: absolute; inset: 0 0 auto 0; z-index: -1; height: 33%; background: var(--ar-cor); border-radius: 0 0 0 18cqw; }
    :host(.ar--story) .ar-faixa { height: 28%; }
    :host(.ar--dividido) .ar-topo { color: #fff; }
    :host(.ar--dividido) .ar-casa { color: #fff; opacity: .22; bottom: auto; top: -6cqw; right: -8cqw; width: 52cqw; }
    :host(.ar--dividido) .ar-corpo { justify-content: flex-end; }
    :host(.ar--dividido) .ar-destaque { color: var(--ar-cor); }
    :host(.ar--dividido) .ar-itens span { background: var(--ar-cor); color: #fff; }
    :host(.ar--dividido) .ar-rodape { border-top-color: color-mix(in srgb, var(--ar-escuro) 12%, transparent); }
    :host(.ar--dividido) .ar-logo, :host(.ar--dividido) .ar-cta { background: var(--ar-cor); color: #fff; }
  `],
})
export class ArteComponent {
  readonly arte = input.required<Arte>();
  readonly formato = input<ArteFormato>('post');
  readonly cor = input('#2b7de9');
  readonly loja = input('Sua loja');
  /** `loja`: logo e nome do banker. `thehouse`: identidade da The House (logo e cor da marca) com o nome do consultor. */
  readonly identidade = input<'loja' | 'thehouse'>('loja');

  protected readonly iniciais = computed(() => {
    const p = this.loja().trim().split(/\s+/).filter(Boolean);
    return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase() || 'TH';
  });
  protected readonly rotulo = computed(() => `Arte ${this.arte().categoria}: ${this.arte().chamada} ${this.arte().destaque}`);
}
