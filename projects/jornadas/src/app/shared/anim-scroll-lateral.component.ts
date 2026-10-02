import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Animação do tooltip do quadro de Propostas: um mini quadro desliza para os lados enquanto o gesto de
 * rolagem lateral (dois dedos no trackpad) e o minimapa acompanham. Feita só com CSS e tokens do Terra,
 * então muda sozinha entre os temas claro e escuro. Com movimento reduzido, fica parada.
 */
@Component({
  selector: 'jv-anim-scroll-lateral',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="as-tela">
      <div class="as-side"><i></i><i></i><i></i><i></i></div>
      <div class="as-corpo">
        <div class="as-topo"><b></b><span></span></div>
        <div class="as-trilho">
          @for (c of colunas; track c.cor) {
            <div class="as-col" [style.--c]="c.cor">
              <div class="as-col-head"><span class="as-ic"></span><span class="as-tt"></span></div>
              <div class="as-col-linha"><span></span></div>
              @for (k of c.cards; track $index) {
                <div class="as-card"><i class="as-tag"></i><i></i><i></i><i class="as-st"></i></div>
              }
              @if (!c.cards.length) { <div class="as-vazio"></div> }
            </div>
          }
        </div>
      </div>
      <div class="as-mapa"><i></i><i></i><i></i><i></i><i></i><i></i><span class="as-mapa-jan"></span></div>
      <div class="as-gesto"><i></i><i></i></div>
      <div class="as-setas"><span>‹</span><span>›</span></div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .as-tela {
      --t: 5.2s;
      position: relative; width: 100%; height: 100%; overflow: hidden; display: flex;
      background: var(--color-theme-base);
      border: 1px solid var(--color-stroke-frame); border-radius: 8px; box-sizing: border-box;
    }
    .as-side { flex: 0 0 18px; display: flex; flex-direction: column; gap: 6px; padding: 8px 5px;
      border-right: 1px solid var(--color-stroke-frame); background: var(--color-theme-lower);
      i { height: 6px; border-radius: 2px; background: var(--color-icons-essential-disabled); }
      i:nth-child(2) { background: var(--color-branding-surface-primary-base); } }
    .as-corpo { position: relative; flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
    .as-topo { display: flex; align-items: center; justify-content: space-between; height: 14px; padding: 0 6px;
      border-bottom: 1px solid var(--color-stroke-frame); background: var(--color-theme-lower);
      b { width: 34px; height: 4px; border-radius: 2px; background: var(--color-text-essential-heading); opacity: .7; }
      span { width: 20px; height: 4px; border-radius: 2px; background: var(--color-icons-essential-disabled); } }

    .as-trilho { display: flex; gap: 6px; padding: 6px; animation: as-rolar var(--t) cubic-bezier(.65, 0, .35, 1) infinite; }
    .as-col { --c: var(--color-support-colors-blue); flex: 0 0 52px; display: flex; flex-direction: column; gap: 4px; }
    .as-col-head { display: flex; align-items: center; gap: 3px; }
    .as-ic { width: 9px; height: 9px; border-radius: 2px; border: 1px solid var(--color-stroke-frame); background: color-mix(in srgb, var(--c) 30%, transparent); }
    .as-tt { flex: 1; height: 4px; border-radius: 2px; background: var(--color-text-essential-heading); opacity: .6; }
    .as-col-linha { position: relative; height: 1px; background: var(--color-stroke-frame);
      span { position: absolute; left: 30%; width: 40%; top: -1px; height: 2px; border-radius: 2px; background: var(--c); } }
    .as-card { display: flex; flex-direction: column; gap: 3px; padding: 4px; border-radius: 3px;
      border: 1px solid var(--color-stroke-frame); background: var(--color-theme-lower);
      i { height: 3px; border-radius: 2px; background: var(--color-icons-essential-disabled); }
      i:nth-child(3) { width: 70%; }
      .as-tag { width: 14px; height: 4px; background: var(--color-support-colors-purple); }
      .as-st { width: 60%; background: var(--c); opacity: .8; } }
    .as-vazio { height: 30px; border-radius: 3px; border: 1px dashed var(--color-stroke-disable); }

    /* Minimapa: a janela azul acompanha o quadro. */
    .as-mapa { position: absolute; right: 6px; bottom: 6px; display: flex; gap: 2px; padding: 3px;
      border: 1px solid var(--color-stroke-frame); border-radius: 3px; background: var(--color-theme-base);
      i { width: 5px; height: 12px; border-radius: 1px; background: var(--color-icons-essential-disabled); } }
    .as-mapa-jan { position: absolute; top: 1px; bottom: 1px; left: 1px; width: 23px; border: 1.5px solid var(--color-state-feedback-informative-surface-base); border-radius: 2px;
      animation: as-janela var(--t) cubic-bezier(.65, 0, .35, 1) infinite; }

    /* Gesto: dois dedos deslizando no trackpad. */
    .as-gesto { position: absolute; left: 50%; top: 52%; display: flex; gap: 5px; translate: -50% -50%;
      animation: as-gesto var(--t) cubic-bezier(.65, 0, .35, 1) infinite;
      i { width: 11px; height: 11px; border-radius: 50%; background: color-mix(in srgb, var(--color-text-essential-heading) 55%, transparent);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-text-essential-heading) 14%, transparent); } }
    .as-setas { position: absolute; left: 50%; top: 52%; translate: -50% -50%; display: flex; gap: 34px;
      font: 700 14px/1 var(--font-family-primary, sans-serif); color: var(--color-branding-surface-primary-base);
      animation: as-setas var(--t) ease-in-out infinite; }

    @keyframes as-rolar {
      0%, 12% { transform: translateX(0); }
      42%, 58% { transform: translateX(-120px); }
      88%, 100% { transform: translateX(0); }
    }
    @keyframes as-janela {
      0%, 12% { left: 1px; }
      42%, 58% { left: 18px; }
      88%, 100% { left: 1px; }
    }
    @keyframes as-gesto {
      0%, 8% { opacity: 0; transform: translateX(26px); }
      14% { opacity: 1; transform: translateX(26px); }
      40% { opacity: 1; transform: translateX(-26px); }
      48%, 56% { opacity: 0; transform: translateX(-26px); }
      62% { opacity: 1; transform: translateX(-26px); }
      86% { opacity: 1; transform: translateX(26px); }
      94%, 100% { opacity: 0; transform: translateX(26px); }
    }
    @keyframes as-setas { 0%, 100% { opacity: 0; } 25%, 75% { opacity: .0; } 27%, 33%, 73%, 79% { opacity: .9; } }

    @media (prefers-reduced-motion: reduce) {
      .as-trilho, .as-mapa-jan, .as-gesto, .as-setas { animation: none; }
      .as-gesto { opacity: 1; }
    }
  `],
})
export class AnimScrollLateralComponent {
  protected readonly colunas = [
    { cor: 'var(--color-support-colors-yellow)', cards: [1, 2] },
    { cor: 'var(--color-support-colors-blue)', cards: [1] },
    { cor: 'var(--color-support-colors-purple)', cards: [] },
    { cor: 'var(--color-support-colors-orange)', cards: [1, 2] },
    { cor: 'var(--color-support-colors-teal)', cards: [1] },
    { cor: 'var(--color-support-colors-green)', cards: [] },
  ];
}
