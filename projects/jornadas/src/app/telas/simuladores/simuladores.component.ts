import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActionBarComponent, ButtonComponent, DivisorComponent, EmptyStateComponent, IconButtonComponent, IconComponent, InputTextComponent,
  ListBodyCellComponent, ListBodyComponent, ListBodyRowComponent, ListComponent, ListHeaderComponent, ListHeaderItemComponent,
  PartnerComponent, SkeletonComponent, TagComponent,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { AvisosService } from '../../shared/avisos.service';
import { ASSET, brl } from '../../shared/data';

type Etapa = 'inicio' | 'form' | 'resultado';
interface Form { perfil: 'pf' | 'pj' | null; tipo: string | null; nascimento: string; valor: number | null; entrada: number | null; prazo: number | null; cartorio: 'sim' | 'nao' | null; fgts: 'sim' | 'nao' | null }
interface Recente { id: string; origem: string; cliente: string | null; produto: string; valor: number; data: string; form?: Form }
interface Linha { parceiro: string; financiado: number; taxa: number; cet: number; parcelas: number; primeira: number; ultima: number; total: number }

const VAZIO: Form = { perfil: null, tipo: null, nascimento: '', valor: null, entrada: null, prazo: null, cartorio: null, fgts: null };
const PRAZO_MAX = 420;

/**
 * Simuladores (Figma Simuladores | The House 5513:3864, visual Terra):
 * início com produtos e simulações recentes, formulário com estimativa ao vivo e resultado comparando os bancos parceiros.
 */
@Component({
  selector: 'jv-simuladores',
  standalone: true,
  imports: [
    ShellComponent, FormsModule, DecimalPipe, ActionBarComponent, ButtonComponent, DivisorComponent, EmptyStateComponent, IconButtonComponent, IconComponent,
    InputTextComponent, PartnerComponent, SkeletonComponent, TagComponent,
    ListComponent, ListHeaderComponent, ListHeaderItemComponent, ListBodyComponent, ListBodyRowComponent, ListBodyCellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './simuladores.component.html',
  styleUrl: './simuladores.component.scss',
})
export class SimuladoresComponent implements OnInit {
  readonly journey = input.required<any>();
  readonly state = input<any>({});
  readonly stateChange = output<any>();
  readonly nav = output<string>();

  private readonly avisos = inject(AvisosService);
  protected readonly brl = brl;
  protected readonly asset = ASSET;
  protected readonly C = computed(() => this.journey().content);

  protected readonly etapa = signal<Etapa>('inicio');
  protected readonly carregando = signal(true);
  protected readonly calculando = signal(false);
  protected readonly f = signal<Form>({ ...VAZIO });
  protected readonly enviado = signal(false);
  protected readonly recentes = signal<Recente[]>([]);

  ngOnInit(): void {
    this.recentes.set(this.journey().content.recentes.map((r: any) => ({ ...r })));
    setTimeout(() => this.carregando.set(false), 1100);
  }

  protected readonly produtos = [
    { value: 'fi', label: 'Financiamento Imobiliário', text: 'Crédito para aquisição de imóveis residenciais, comerciais ou terrenos.', icon: 'HouseLine', ativo: true },
    { value: 'cgi', label: 'Crédito com Garantia de Imóvel', text: 'Crédito usando um imóvel quitado como garantia.', icon: 'Key', ativo: false },
  ];
  protected readonly breadcrumbs = computed(() => this.etapa() === 'inicio' ? [{ label: 'Home' }, { label: 'Simuladores' }] : [{ label: 'Simuladores' }, { label: 'Financiamento Imobiliário' }]);

  /* ---------- Formulário ---------- */
  protected readonly pj = computed(() => this.f().perfil === 'pj');
  protected readonly financiado = computed(() => Math.max(0, (this.f().valor ?? 0) - (this.f().entrada ?? 0)));
  protected readonly pctEntrada = computed(() => { const v = this.f().valor ?? 0; return v ? Math.round(((this.f().entrada ?? 0) / v) * 100) : 0; });
  protected readonly erroEntrada = computed(() => { const f = this.f(); return !!(f.valor && f.entrada != null && f.entrada >= f.valor); });
  protected readonly entradaBaixa = computed(() => { const f = this.f(); return !!(f.valor && f.entrada != null && !this.erroEntrada() && this.pctEntrada() < 20); });
  protected readonly erroPrazo = computed(() => { const p = this.f().prazo; return p != null && (p < 12 || p > PRAZO_MAX); });
  protected readonly erroNascimento = computed(() => { const d = this.f().nascimento.replace(/\D/g, ''); return !this.pj() && d.length > 0 && d.length < 8; });
  protected readonly faltando = computed(() => {
    const f = this.f(), l: string[] = [];
    if (!f.perfil) l.push('perfil do cliente');
    if (!f.tipo) l.push('tipo de imóvel');
    if (!this.pj() && f.nascimento.replace(/\D/g, '').length !== 8) l.push('nascimento');
    if (!(f.valor && f.valor > 0)) l.push('valor do imóvel');
    if (f.entrada == null) l.push('valor de entrada');
    if (!f.prazo) l.push('prazo');
    if (!f.cartorio) l.push('custos de cartório');
    if (!this.pj() && !f.fgts) l.push('uso do FGTS');
    return l;
  });
  protected readonly completo = computed(() => !this.faltando().length && !this.erroEntrada() && !this.erroPrazo() && !this.erroNascimento());
  protected readonly progresso = computed(() => { const total = this.pj() ? 6 : 8; return Math.round(((total - this.faltando().length) / total) * 100); });

  /** Estimativa ao vivo no painel (faixa entre o menor e o maior banco). */
  protected readonly estimativa = computed(() => {
    const f = this.f();
    if (!this.financiado() || !f.prazo || this.erroEntrada() || this.erroPrazo()) return null;
    const l = this.calcular(f);
    const p = l.map((x) => x.primeira);
    return { min: Math.min(...p), max: Math.max(...p), renda: Math.min(...p) / 0.3 };
  });

  protected set<K extends keyof Form>(k: K, v: Form[K]): void {
    this.enviado.set(false);
    this.f.update((f) => ({ ...f, [k]: v }));
    if (k === 'perfil' && v === 'pj') this.f.update((f) => ({ ...f, nascimento: '', fgts: null }));
  }
  protected prazoRapido(m: number): void { this.set('prazo', m); }

  protected escolherProduto(p: { value: string; label: string; ativo: boolean }): void {
    if (!p.ativo) { this.avisos.mostrar(`O simulador de ${p.label} chega em breve.`); return; }
    this.f.set({ ...VAZIO }); this.enviado.set(false); this.etapa.set('form');
  }
  protected exemplo(): void {
    const ex = this.C().exemplo.pf;
    this.f.set({ perfil: 'pf', tipo: ex.tipo, nascimento: ex.nascimento, valor: 450000, entrada: 100000, prazo: 420, cartorio: 'sim', fgts: 'nao' });
  }
  protected simular(): void {
    this.enviado.set(true);
    if (!this.completo()) { this.avisos.mostrar(`Falta preencher: ${this.faltando().join(', ') || 'corrigir os campos destacados'}.`, 'warning'); return; }
    this.calculando.set(true);
    setTimeout(() => {
      this.calculando.set(false);
      this.salvarRecente();
      this.etapa.set('resultado');
    }, 900);
  }
  private salvarRecente(): void {
    const f = this.f();
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.recentes.update((l) => [{ id: 'n' + agora.getTime(), origem: 'Simulador', cliente: null, produto: 'Financiamento Imobiliário', valor: f.valor ?? 0, data, form: { ...f } }, ...l].slice(0, 8));
  }

  /* ---------- Resultado ---------- */
  protected readonly ordem = signal<'primeira' | 'taxa' | 'total'>('primeira');
  protected readonly linhas = computed<Linha[]>(() => {
    const l = this.calcular(this.f()), k = this.ordem();
    return [...l].sort((a, b) => a[k] - b[k]);
  });
  protected readonly melhor = computed(() => [...this.calcular(this.f())].sort((a, b) => a.primeira - b.primeira)[0]);
  protected readonly menorTaxa = computed(() => [...this.calcular(this.f())].sort((a, b) => a.taxa - b.taxa)[0]);
  protected readonly menorTotal = computed(() => [...this.calcular(this.f())].sort((a, b) => a.total - b.total)[0]);
  protected readonly tipoAtual = computed(() => this.C().tipos.find((t: any) => t.value === this.f().tipo) ?? this.C().tipos[0]);
  protected readonly resumo = computed(() => {
    const f = this.f();
    const l: [string, string][] = [['Perfil do cliente', f.perfil === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física']];
    if (f.perfil !== 'pj') l.push(['Nascimento', f.nascimento || '—']);
    l.push(['Valor do imóvel', 'R$ ' + brl(f.valor ?? 0)], ['Entrada', `R$ ${brl(f.entrada ?? 0)} (${this.pctEntrada()}%)`], ['Prazo', `${f.prazo} meses`], ['Custos de cartório', f.cartorio === 'sim' ? 'Incluídos' : 'Não incluídos']);
    if (f.perfil !== 'pj') l.push(['FGTS', f.fgts === 'sim' ? 'Vai usar' : 'Não vai usar']);
    return l;
  });

  /** Tabela SAC com taxas de exemplo por banco (no back, vem da API de cada parceiro). */
  private calcular(f: Form): Linha[] {
    const custas = f.cartorio === 'sim' ? (f.valor ?? 0) * 0.04 : 0;
    const fin = Math.max(0, (f.valor ?? 0) - (f.entrada ?? 0)) + custas;
    const n = Math.max(1, Math.round(f.prazo ?? 1));
    return this.C().bancos.map((b: any) => {
      const im = Math.pow(1 + b.taxa / 100, 1 / 12) - 1, amort = fin / n;
      const primeira = amort + fin * im, ultima = amort + amort * im;
      return { parceiro: b.nome, financiado: fin, taxa: b.taxa, cet: b.taxa + 0.63, parcelas: n, primeira, ultima, total: ((primeira + ultima) / 2) * n };
    });
  }
  protected pct(v: number): string { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '% a.a.'; }
  protected moeda(v: number): string { return 'R$ ' + brl(v); }

  protected ajustar(): void { this.enviado.set(false); this.etapa.set('form'); }
  protected novaSimulacao(): void { this.f.set({ ...VAZIO }); this.enviado.set(false); this.etapa.set('form'); }
  protected inicio(): void { this.etapa.set('inicio'); }
  protected gerarProposta(banco?: string): void {
    this.avisos.mostrar(banco ? `Proposta iniciada com ${banco}. Os dados da simulação já vão preenchidos.` : 'Os dados da simulação já vão preenchidos na proposta.', 'success');
    this.nav.emit('nova');
  }
  protected compartilhar(): void {
    const texto = `Simulação The House · ${this.moeda(this.f().valor ?? 0)} em ${this.f().prazo} meses · melhor 1ª parcela: ${this.moeda(this.melhor().primeira)} (${this.melhor().parceiro})`;
    const ok = () => this.avisos.mostrar('Resumo da simulação copiado. Cole no WhatsApp ou e-mail do cliente.', 'success');
    navigator.clipboard?.writeText(texto).then(ok, ok);
  }
  protected abrirRecente(r: Recente): void {
    if (r.form) { this.f.set({ ...r.form }); this.etapa.set('resultado'); return; }
    this.exemplo(); this.f.update((f) => ({ ...f, valor: r.valor })); this.etapa.set('resultado');
  }
}
