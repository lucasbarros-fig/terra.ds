import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import {
  BannerComponent, BannerSlide, ButtonComponent, IconButtonComponent, IconComponent,
  StatusComponent,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { AvisosService } from '../../shared/avisos.service';
import { ASSET, ic } from '../../shared/data';

/** Dashboard do gestor (Home), montada só com componentes do Terra DS. */
@Component({
  selector: 'jv-dashboard',
  standalone: true,
  imports: [ShellComponent, BannerComponent, ButtonComponent, IconButtonComponent, IconComponent, StatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly journey = input.required<any>();
  readonly state = input<any>({});
  readonly nav = output<string>();

  protected readonly avisos = inject(AvisosService);
  protected readonly ocultos = signal<Record<string, boolean>>({});

  /** Números do topo (modelo enviado pelo time: Pendências, Aprovados e Suas comissões). */
  protected readonly numeros = [
    { id: 'pendencias', titulo: 'Pendências', icone: 'Warning', cor: 'vermelho', valor: 'R$ 1.000.000,00', legenda: 'Aguardando avanço', detalhe: '3 propostas', comparativo: false, variacao: '' },
    { id: 'aprovados', titulo: 'Aprovados', icone: 'Check', cor: 'verde', valor: 'R$ 12.780.000,00', legenda: 'Mês anterior', detalhe: 'R$ 9.650.000,00', comparativo: true, variacao: '32%' },
    { id: 'comissoes', titulo: 'Suas comissões', icone: 'ChartPieSlice', cor: 'azul', valor: 'R$ 153.360,00', legenda: 'Mês anterior', detalhe: 'R$ 115.800,00', comparativo: true, variacao: '32%' },
  ];
  protected escondido(id: string): boolean { return !!this.ocultos()[id]; }
  protected esconder(id: string): void { this.ocultos.update((o) => ({ ...o, [id]: !o[id] })); }
  protected readonly ic = ic;

  protected get C(): any { return this.journey().content; }

  protected slides(): BannerSlide[] {
    return this.C.destaques.slides.map((s: any) => ({ src: ASSET + s.image, alt: s.label }));
  }

  protected oculto(m: any): boolean {
    const o = this.ocultos()[m.title];
    return o === undefined ? !!m.hidden : o;
  }
  protected valor(m: any): string {
    if (m.hideable && this.oculto(m)) return '••••••';
    return (m.prefix ? m.prefix + ' ' : '') + m.value;
  }
  protected alternar(m: any): void {
    if (!m.hideable) return;
    this.ocultos.update((o) => ({ ...o, [m.title]: !this.oculto(m) }));
  }

  protected avisar(texto: string, tipo: 'informative' | 'success' = 'informative'): void {
    this.avisos.mostrar(texto, tipo);
  }
}
