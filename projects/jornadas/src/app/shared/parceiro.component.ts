import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ASSET } from './data';

const LOGOS: Record<string, string> = {
  'Itaú': 'img/parceiros/itau-logo.svg',
  'Santander': 'img/parceiros/santander-logo.svg',
  'Porto': 'img/parceiros/porto-logo.svg',
};

/** Logo do banco parceiro: usa o logo do Terra quando existe; senão, as iniciais (composição com tokens do Terra). */
@Component({
  selector: 'jv-parceiro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (logo()) {
      <img [src]="logo()" [alt]="nome()" [title]="nome()" [style.width.px]="tamanho()" [style.height.px]="tamanho()" />
    } @else {
      <span class="ini" role="img" [attr.aria-label]="nome()" [title]="nome()" [style.width.px]="tamanho()" [style.height.px]="tamanho()">{{ iniciais() }}</span>
    }
  `,
  styles: [`
    :host { display: inline-flex; }
    img { display: block; border-radius: var(--size-radius-999); object-fit: cover; background: var(--color-theme-base); }
    .ini { display: inline-grid; place-items: center; border: var(--size-stoke-1) solid var(--color-stroke-frame); border-radius: var(--size-radius-999);
      background: var(--color-theme-base); color: var(--color-text-essential-heading); font-size: 12px; font-weight: 700; letter-spacing: .02em; }
  `],
})
export class ParceiroComponent {
  readonly nome = input.required<string>();
  readonly tamanho = input(40);
  protected readonly logo = computed(() => LOGOS[this.nome()] ? ASSET + LOGOS[this.nome()] : '');
  protected readonly iniciais = computed(() => {
    const p = this.nome().replace(/[^A-Za-zÀ-ú0-9 ]/g, '').split(/\s+/).filter(Boolean);
    return (p.length > 1 ? p[0][0] + p[1][0] : p[0].slice(0, 2)).toUpperCase();
  });
}
