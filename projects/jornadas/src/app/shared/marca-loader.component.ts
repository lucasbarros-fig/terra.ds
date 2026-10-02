import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MarcaComponent } from './marca.component';

/**
 * Tela cheia com o logo da The House.
 * - splash: o logo sobe e aparece ao abrir o login; depois a camada some sozinha (≈1,8s).
 * - carregando: logo no meio da tela com um brilho correndo da esquerda para a direita, enquanto a entrada demora.
 */
@Component({
  selector: 'jv-marca-loader',
  standalone: true,
  imports: [MarcaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'ml ml--' + modo()",
    role: 'status',
    '[attr.aria-live]': "'polite'",
    '[attr.aria-label]': "modo() === 'carregando' ? texto() : 'The House'",
  },
  template: `
    <div class="ml-logo">
      <jv-marca class="ml-base"></jv-marca>
      @if (modo() === 'carregando') {
        <jv-marca class="ml-brilho" aria-hidden="true"></jv-marca>
      }
    </div>
    @if (modo() === 'carregando' && texto()) {
      <p class="ml-texto">{{ texto() }}</p>
    }
  `,
  styles: [`
    :host {
      position: fixed; inset: 0; z-index: 200;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--size-spacing-24);
      background: var(--color-theme-base);
    }
    .ml-logo { position: relative; height: 48px; }
    .ml-logo jv-marca { height: 100%; }
    .ml-brilho { position: absolute; inset: 0; }
    .ml-texto { margin: 0; font-size: var(--size-font-body-14); color: var(--color-text-essential-caption); }

    /* Splash: logo sobe e aparece; a camada inteira some no fim. */
    :host(.ml--splash) { animation: ml-sair 400ms ease 1.4s forwards; }
    :host(.ml--splash) .ml-logo { animation: ml-subir 800ms cubic-bezier(.2, .8, .2, 1) 150ms both; }

    /* Carregando: logo apagado na base e uma faixa de brilho correndo por cima. */
    :host(.ml--carregando) { animation: ml-entrar 200ms ease both; }
    :host(.ml--carregando) .ml-base { opacity: .22; }
    :host(.ml--carregando) .ml-brilho {
      -webkit-mask-image: linear-gradient(100deg, transparent 35%, #000 50%, transparent 65%);
      mask-image: linear-gradient(100deg, transparent 35%, #000 50%, transparent 65%);
      -webkit-mask-size: 300% 100%; mask-size: 300% 100%;
      animation: ml-correr 1.3s linear infinite;
    }

    @keyframes ml-subir { from { opacity: 0; transform: translateY(48px); } to { opacity: 1; transform: none; } }
    @keyframes ml-sair { to { opacity: 0; visibility: hidden; } }
    @keyframes ml-entrar { from { opacity: 0; } }
    @keyframes ml-correr {
      from { -webkit-mask-position: 100% 0; mask-position: 100% 0; }
      to { -webkit-mask-position: 0% 0; mask-position: 0% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      :host(.ml--splash) .ml-logo { animation: none; }
      :host(.ml--carregando) .ml-base { opacity: 1; }
      :host(.ml--carregando) .ml-brilho { display: none; }
    }
  `],
})
export class MarcaLoaderComponent {
  readonly modo = input<'splash' | 'carregando'>('splash');
  readonly texto = input('');
}
