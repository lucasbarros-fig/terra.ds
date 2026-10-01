import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AvatarComponent, ButtonComponent, IconComponent, InputTextComponent, ListBodyCellComponent, ListBodyComponent, ListBodyRowComponent,
  ListComponent, ListHeaderComponent, ListHeaderItemComponent,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { ParceiroComponent } from '../../shared/parceiro.component';
import { AvisosService } from '../../shared/avisos.service';
import { brl, ic } from '../../shared/data';

interface Form { perfil: string | null; tipo?: string; nascimento?: string; valor?: number | null; entrada?: number | null; prazo?: string; cartorio?: string; fgts?: string; }

function num(v: string): number { return v ? parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0 : 0; }
/** Dados do formulário guardados durante a visita, para o resultado e o "Ajustar simulação". */
let ultima: Form | null = null;
let ajustando = false;

/** Simuladores: início, formulário do Financiamento Imobiliário e resultado com os bancos parceiros. */
@Component({
  selector: 'jv-simuladores',
  standalone: true,
  imports: [
    ShellComponent, FormsModule, AvatarComponent, ButtonComponent, IconComponent, InputTextComponent, ParceiroComponent,
    ListComponent, ListHeaderComponent, ListHeaderItemComponent, ListBodyComponent, ListBodyRowComponent, ListBodyCellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './simuladores.component.html',
  styleUrl: './simuladores.component.scss',
})
export class SimuladoresComponent {
  readonly journey = input.required<any>();
  readonly state = input<any>({});
  readonly stateChange = output<any>();
  readonly nav = output<string>();

  private readonly avisos = inject(AvisosService);
  protected readonly ic = ic;
  protected readonly brl = brl;
  protected readonly C = computed(() => this.journey().content);
  protected readonly s = computed(() => this.state() || {});

  protected readonly f = signal<Form>(this.inicial());

  private inicial(): Form {
    const s = this.state() || {};
    if (ajustando && ultima) { ajustando = false; return { ...ultima }; }
    if (s.preenchido) {
      const ex = this.journey().content.exemplo[s.perfil];
      return { perfil: s.perfil, ...ex, valor: num(ex.valor), entrada: num(ex.entrada) };
    }
    return { perfil: null, valor: null, entrada: null };
  }

  protected readonly breadcrumbs = computed(() => this.s().produto ? [{ label: 'Simuladores' }, { label: 'Financiamento Imobiliário' }] : [{ label: 'Simuladores' }]);
  protected readonly pj = computed(() => this.f().perfil === 'pj');
  protected readonly erroEntrada = computed(() => { const f = this.f(); return !!(f.valor && f.entrada && f.entrada >= f.valor); });
  protected readonly completo = computed(() => {
    const f = this.f();
    return !!(f.perfil && f.tipo && (f.valor ?? 0) > 0 && f.entrada != null && num(f.prazo || '') > 0 && f.cartorio && !this.erroEntrada()
      && (this.pj() || ((f.nascimento || '').replace(/\D/g, '').length === 8 && f.fgts)));
  });

  protected set<K extends keyof Form>(k: K, v: Form[K]): void { this.f.update((f) => ({ ...f, [k]: v })); }

  protected escolherProduto(pr: any): void {
    if (pr.value === 'fi') { ultima = null; this.stateChange.emit({ produto: 'fi' }); }
    else this.avisos.mostrar(`O simulador de ${pr.label} ainda não está no Figma.`);
  }
  protected simular(): void { ultima = { ...this.f() }; this.stateChange.emit({ produto: 'fi', resultado: true }); }
  protected voltarInicio(): void { this.stateChange.emit({}); }

  /* Resultado */
  protected readonly dados = computed<Form>(() => ultima ?? (() => { const ex = this.C().exemplo.pf; return { perfil: 'pf', ...ex, valor: num(ex.valor), entrada: num(ex.entrada) }; })());
  protected readonly tipoRes = computed(() => this.C().tipos.find((t: any) => t.value === this.dados().tipo) ?? this.C().tipos[0]);
  protected readonly linhas = computed(() => {
    const f = this.dados(); const fin = Math.max(0, (f.valor ?? 0) - (f.entrada ?? 0)); const n = Math.max(1, Math.round(num(f.prazo || '')));
    return this.C().bancos.map((b: any) => {
      const im = Math.pow(1 + b.taxa / 100, 1 / 12) - 1, amort = fin / n;
      return { parceiro: b.nome, financiado: fin, taxa: b.taxa, cet: b.taxa + 0.63, parcelas: n, primeira: amort + fin * im, ultima: amort + amort * im };
    });
  });
  protected readonly itensRes = computed(() => {
    const f = this.dados(); const n = Math.max(1, Math.round(num(f.prazo || '')));
    const l: [string, string][] = [['Perfil do cliente', f.perfil === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física']];
    if (f.perfil !== 'pj') l.push(['Nascimento', f.nascimento || '—']);
    l.push(['Valor do imóvel', 'R$ ' + brl(f.valor ?? 0)], ['Valor de entrada', 'R$ ' + brl(f.entrada ?? 0)], ['Prazo de pagamento', n + ' meses'], ['Custas de cartório', f.cartorio === 'sim' ? 'Sim' : 'Não']);
    if (f.perfil !== 'pj') l.push(['Vai usar FGTS?', f.fgts === 'sim' ? 'Sim' : 'Não']);
    return l;
  });
  protected pct(v: number): string { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '% a.a.'; }
  protected ajustar(): void { ajustando = !!ultima; this.stateChange.emit({ produto: 'fi', perfil: this.dados().perfil, preenchido: true }); }
  protected compartilhar(): void { this.avisos.mostrar('Link da simulação copiado.', 'success'); }
}
