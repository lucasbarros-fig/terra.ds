import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DropdownItemComponent } from './terra';
import { ic } from './data';

export interface ItemMenu { value: string; label: string; icon: string; }
export interface PosicaoMenu { top: number; right?: number; left?: number; }

/** Menu de ações ancorado no botão "…" (itens do Dropdown do Terra), dentro da área de conteúdo da tela. */
@Component({
  selector: 'jv-menu-flutuante',
  standalone: true,
  imports: [DropdownItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mf-fundo" (click)="fechar.emit()" aria-hidden="true"></div>
    <div class="mf-painel" role="menu" [attr.aria-label]="rotulo()" [style.top.px]="pos().top" [style.right.px]="pos().right" [style.left.px]="pos().left" [style.width.px]="largura()">
      @for (it of itens(); track it.value) {
        <lib-dropdown-item [label]="it.label" [icon]="ic(it.icon)" (itemSelect)="escolher.emit(it.value)"></lib-dropdown-item>
      }
    </div>
  `,
  styles: [`
    .mf-fundo { position: fixed; inset: 0; z-index: 40; }
    .mf-painel { position: absolute; z-index: 41; padding: var(--size-spacing-8); border: var(--size-stoke-1) solid var(--color-stroke-frame);
      border-radius: var(--size-radius-8); background: var(--color-theme-overlay); }
  `],
})
export class MenuFlutuanteComponent {
  readonly itens = input.required<ItemMenu[]>();
  readonly pos = input.required<PosicaoMenu>();
  readonly largura = input(220);
  readonly rotulo = input('Ações');
  readonly escolher = output<string>();
  readonly fechar = output<void>();
  protected readonly ic = ic;
}

/** Calcula a posição do menu em relação a um contêiner (position: relative). */
export function ancorar(ev: Event, conteiner: HTMLElement, lado: 'right' | 'left' = 'right'): PosicaoMenu {
  const alvo = (ev.target as HTMLElement).closest('button') ?? (ev.target as HTMLElement);
  const b = alvo.getBoundingClientRect(), r = conteiner.getBoundingClientRect();
  const top = Math.round(b.bottom - r.top + conteiner.scrollTop + 4);
  return lado === 'left' ? { top, left: Math.round(b.left - r.left) } : { top, right: Math.round(r.right - b.right) };
}
