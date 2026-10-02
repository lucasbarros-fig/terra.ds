import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActionBarComponent, BannerComponent, ButtonComponent, DivisorComponent, DrawerComponent, EmptyStateComponent, IconButtonComponent, IconComponent, InputTextComponent,
  ListBodyCellComponent, ListBodyComponent, ListBodyRowComponent, ListComponent, ListHeaderComponent, ListHeaderItemComponent,
  KpiCardComponent, PartnerComponent, SkeletonComponent, TagComponent,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { AvisosService } from '../../shared/avisos.service';
import { ASSET, brl } from '../../shared/data';

type Etapa = 'inicio' | 'form' | 'resultado';
interface Banco { nome: string; taxa: number }
interface Produto {
  id: string; label: string; curto: string; text: string; icon: string; perfis: ('pf' | 'pj')[]; sistema: 'sac' | 'price'; modo: 'financiamento' | 'credito';
  bem: string | null; rotuloValor: string; rotuloEntrada: string; ltv?: number; tipos: string[]; prazo: { min: number; max: number; atalhos: number[] };
  cartorio: boolean; fgts: boolean; bancos: Banco[] | null;
  /** Banner do produto no início: cor (token do Terra), chamada e destaques. */
  tema: string; chamada: string; chips: string[];
}
interface Form { produto: string; perfil: 'pf' | 'pj' | null; tipo: string | null; nascimento: string; valor: number | null; entrada: number | null; prazo: number | null; cartorio: 'sim' | 'nao' | null; fgts: 'sim' | 'nao' | null }
interface Recente { id: string; origem: string; cliente: string | null; produto: string; valor: number; data: string; form?: Form }
interface Linha { parceiro: string; financiado: number; taxa: number; cet: number; parcelas: number; primeira: number; ultima: number; total: number }

const VAZIO: Form = { produto: 'fi', perfil: null, tipo: null, nascimento: '', valor: null, entrada: null, prazo: null, cartorio: null, fgts: null };

/** Produtos simuláveis (taxas de exemplo a.a.; no back vêm das APIs dos parceiros). */
const PRODUTOS: Produto[] = [
  { id: 'fi', tema: 'var(--color-branding-surface-primary-base)', chamada: 'Compare 6 bancos de uma vez', chips: ['Até 80% do imóvel', 'Até 35 anos', 'Uso do FGTS'],  label: 'Financiamento Imobiliário', curto: 'Financiamento', text: 'Aquisição de imóvel residencial, comercial ou terreno.', icon: 'HouseLine', perfis: ['pf', 'pj'], sistema: 'sac', modo: 'financiamento',
    bem: 'imóvel', rotuloValor: 'Valor do imóvel', rotuloEntrada: 'Valor de entrada', tipos: ['residencial', 'comercial', 'terreno'], prazo: { min: 12, max: 420, atalhos: [180, 240, 360, 420] }, cartorio: true, fgts: true, bancos: null },
  { id: 'construcao', tema: 'var(--color-support-colors-teal)', chamada: 'Do terreno à casa pronta', chips: ['Aprovação em até 2 dias', 'Até 120 meses'],  label: 'Financiamento para Construção', curto: 'Construção', text: 'Crédito para construir no terreno do cliente, com aprovação rápida.', icon: 'HardHat', perfis: ['pf'], sistema: 'sac', modo: 'financiamento',
    bem: 'obra', rotuloValor: 'Valor total da obra', rotuloEntrada: 'Recursos próprios', tipos: ['residencial', 'comercial'], prazo: { min: 12, max: 120, atalhos: [36, 60, 96, 120] }, cartorio: false, fgts: false,
    bancos: [{ nome: 'CashMe', taxa: 13.2 }, { nome: 'Crediblue', taxa: 13.9 }] },
  { id: 'cgi', tema: 'var(--color-support-colors-purple)', chamada: 'O imóvel vira crédito mais barato', chips: ['Até 60% do imóvel', 'Juros a partir de 1,09% a.m.', 'Até 240 meses'],  label: 'Crédito com Garantia de Imóvel', curto: 'Garantia de imóvel', text: 'Até 60% do valor do imóvel quitado, com juros menores.', icon: 'Key', perfis: ['pf', 'pj'], sistema: 'price', modo: 'credito',
    bem: 'imóvel', rotuloValor: 'Valor do imóvel em garantia', rotuloEntrada: 'Valor desejado', ltv: 0.6, tipos: ['residencial', 'comercial'], prazo: { min: 12, max: 240, atalhos: [60, 120, 180, 240] }, cartorio: false, fgts: false,
    bancos: [{ nome: 'Galleria Bank', taxa: 13.8 }, { nome: 'Itaú', taxa: 13.9 }, { nome: 'Santander', taxa: 14.2 }, { nome: 'CashMe', taxa: 14.6 }, { nome: 'C6 Bank', taxa: 14.9 }, { nome: 'Creditas', taxa: 15.1 }, { nome: 'Direto', taxa: 15.4 }] },
  { id: 'veiculos', tema: 'var(--color-support-colors-orange)', chamada: 'O carro quitado vira crédito', chips: ['Até 90% do veículo', 'Até 60 meses', 'Continua com o carro'],  label: 'Crédito com Garantia de Veículos', curto: 'Garantia de veículo', text: 'Até 90% do valor do veículo quitado, que continua com o cliente.', icon: 'Car', perfis: ['pf', 'pj'], sistema: 'price', modo: 'credito',
    bem: 'veículo', rotuloValor: 'Valor do veículo', rotuloEntrada: 'Valor desejado', ltv: 0.9, tipos: ['carro', 'moto', 'caminhao'], prazo: { min: 3, max: 60, atalhos: [12, 24, 36, 60] }, cartorio: false, fgts: false,
    bancos: [{ nome: 'Safra', taxa: 20.9 }, { nome: 'BV', taxa: 21.5 }, { nome: 'Daycoval', taxa: 21.9 }, { nome: 'C6 Bank', taxa: 22.4 }, { nome: 'Creditas', taxa: 22.9 }, { nome: 'CashMe', taxa: 23.4 }, { nome: 'Omni', taxa: 25.8 }] },
  { id: 'giro', tema: 'var(--color-support-colors-green)', chamada: 'Fôlego para o caixa da empresa', chips: ['Para PJ', 'De 18 a 62 meses'],  label: 'Capital de giro', curto: 'Capital de giro', text: 'Fôlego para o caixa da empresa, com prazos flexíveis.', icon: 'Coins', perfis: ['pj'], sistema: 'price', modo: 'credito',
    bem: null, rotuloValor: '', rotuloEntrada: 'Valor desejado', tipos: [], prazo: { min: 18, max: 62, atalhos: [18, 24, 36, 60] }, cartorio: false, fgts: false, bancos: [{ nome: 'Daycoval', taxa: 17.5 }] },
  { id: 'condominios', tema: 'var(--color-support-colors-cyan)', chamada: 'Melhorias no condomínio sem pesar', chips: ['Portaria, energia solar, reformas', 'Até 90 meses'],  label: 'Crédito para Condomínios', curto: 'Condomínios', text: 'Obras e melhorias no condomínio, com carência para começar a pagar.', icon: 'Buildings', perfis: ['pj'], sistema: 'price', modo: 'credito',
    bem: null, rotuloValor: '', rotuloEntrada: 'Valor desejado', tipos: [], prazo: { min: 12, max: 90, atalhos: [24, 48, 72, 90] }, cartorio: false, fgts: false, bancos: [{ nome: 'CashMe', taxa: 16.9 }] },
];

/**
 * Simuladores (Figma Simuladores | The House 5513:3864, visual Terra):
 * início com produtos e simulações recentes, formulário com estimativa ao vivo e resultado comparando os bancos parceiros.
 */
@Component({
  selector: 'jv-simuladores',
  standalone: true,
  imports: [
    ShellComponent, FormsModule, DecimalPipe, ActionBarComponent, BannerComponent, ButtonComponent, DivisorComponent, DrawerComponent, EmptyStateComponent, IconButtonComponent, IconComponent,
    InputTextComponent, KpiCardComponent, PartnerComponent, SkeletonComponent, TagComponent,
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
    const base: Recente[] = this.journey().content.recentes.map((r: any) => ({ ...r }));
    const extras: Recente[] = [
      { id: 'r3', origem: 'Simulador', cliente: 'Mariana Costa | 412.887.553-10', produto: 'Financiamento Imobiliário', valor: 620000, data: '30 ago. às 16:40' },
      { id: 'r4', origem: 'Nova proposta', cliente: 'Rafael Almeida | 158.302.774-91', produto: 'Financiamento Imobiliário', valor: 380000, data: '28 ago. às 10:05' },
    ];
    this.recentes.set([...base, ...extras]);
    setTimeout(() => this.carregando.set(false), 1100);
  }

  protected readonly produtos = PRODUTOS;
  protected readonly bannerAtivo = signal(0);
  protected readonly prod = computed(() => PRODUTOS.find((p) => p.id === this.f().produto) ?? PRODUTOS[0]);
  protected readonly tiposProd = computed(() => this.C().tipos.filter((t: any) => this.prod().tipos.includes(t.value)));
  protected readonly bancosProd = computed<Banco[]>(() => this.prod().bancos ?? this.C().bancos);
  protected readonly breadcrumbs = computed(() => this.etapa() === 'inicio' ? [{ label: 'Home' }, { label: 'Simuladores' }] : [{ label: 'Simuladores' }, { label: this.prod().label }]);

  /* ---------- Painel inicial ---------- */
  protected readonly kpis = computed(() => {
    const l = this.recentes(), propostas = l.filter((r) => r.origem === 'Nova proposta').length;
    const media = l.length ? l.reduce((t, r) => t + r.valor, 0) / l.length : 0;
    const volume = l.reduce((t, r) => t + r.valor, 0);
    const bancos = new Set(PRODUTOS.flatMap((p) => (p.bancos ?? this.C().bancos).map((b: { nome: string }) => b.nome))).size;
    return { total: l.length, propostas, conversao: l.length ? Math.round((propostas / l.length) * 100) : 0, media, volume, bancos };
  });
  /** Melhor condição de uma simulação recente (entrada de 20% e 360 meses quando não há dados completos). */
  protected melhorDe(r: Recente): Linha {
    const f = r.form ?? { ...VAZIO, produto: 'fi', valor: r.valor, entrada: r.valor * 0.2, prazo: 360, cartorio: 'nao' as const };
    return [...this.calcular(f)].sort((a, b) => a.primeira - b.primeira)[0];
  }
  protected iniciais(n: string): string { const p = n.trim().split(/\s+/); return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); }
  protected prodDe(r: Recente): Produto { return PRODUTOS.find((p) => p.label === r.produto) ?? PRODUTOS[0]; }
  protected prazoDe(r: Recente): number { return r.form?.prazo ?? 360; }

  /* ---------- Formulário ---------- */
  protected readonly pj = computed(() => this.f().perfil === 'pj');
  protected readonly credito = computed(() => this.prod().modo === 'credito');
  protected readonly temBem = computed(() => !!this.prod().bem);
  protected readonly financiado = computed(() => this.credito() ? (this.f().entrada ?? 0) : Math.max(0, (this.f().valor ?? 0) - (this.f().entrada ?? 0)));
  protected readonly limite = computed(() => (this.prod().ltv && this.f().valor ? this.f().valor! * this.prod().ltv! : 0));
  protected readonly pctEntrada = computed(() => { const v = this.f().valor ?? 0; return v ? Math.round(((this.f().entrada ?? 0) / v) * 100) : 0; });
  protected readonly erroEntrada = computed(() => {
    const f = this.f();
    if (this.credito()) return !!(this.limite() && f.entrada != null && f.entrada > this.limite());
    return !!(f.valor && f.entrada != null && f.entrada >= f.valor);
  });
  protected readonly entradaBaixa = computed(() => { const f = this.f(); return this.prod().id === 'fi' && !!(f.valor && f.entrada != null && !this.erroEntrada() && this.pctEntrada() < 20); });
  protected readonly erroPrazo = computed(() => { const p = this.f().prazo, r = this.prod().prazo; return p != null && (p < r.min || p > r.max); });
  protected readonly erroNascimento = computed(() => { const d = this.f().nascimento.replace(/\D/g, ''); return !this.pj() && d.length > 0 && d.length < 8; });
  protected readonly faltando = computed(() => {
    const f = this.f(), pr = this.prod(), l: string[] = [];
    if (!f.perfil) l.push('perfil do cliente');
    if (pr.tipos.length && !f.tipo) l.push('tipo de ' + pr.bem);
    if (!this.pj() && f.nascimento.replace(/\D/g, '').length !== 8) l.push('nascimento');
    if (this.temBem() && !(f.valor && f.valor > 0)) l.push(pr.rotuloValor.toLowerCase());
    if (f.entrada == null || (this.credito() && !f.entrada)) l.push(pr.rotuloEntrada.toLowerCase());
    if (!f.prazo) l.push('prazo');
    if (pr.cartorio && !f.cartorio) l.push('custos de cartório');
    if (pr.fgts && !this.pj() && !f.fgts) l.push('uso do FGTS');
    return l;
  });
  protected readonly completo = computed(() => !this.faltando().length && !this.erroEntrada() && !this.erroPrazo() && !this.erroNascimento());
  protected readonly progresso = computed(() => {
    const pr = this.prod();
    const total = 1 + (pr.tipos.length ? 1 : 0) + (this.pj() ? 0 : 1) + (this.temBem() ? 1 : 0) + 2 + (pr.cartorio ? 1 : 0) + (pr.fgts && !this.pj() ? 1 : 0);
    return Math.round(((total - this.faltando().length) / total) * 100);
  });

  /** Estimativa ao vivo no painel (faixa entre o menor e o maior banco). */
  protected readonly estimativa = computed(() => {
    const f = this.f();
    if (!this.financiado() || !f.prazo || this.erroEntrada() || this.erroPrazo() || (!this.credito() && !f.valor)) return null;
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

  protected escolherProduto(p: Produto): void {
    this.f.set({ ...VAZIO, produto: p.id, perfil: p.perfis.length === 1 ? p.perfis[0] : null }); this.enviado.set(false); this.etapa.set('form');
  }
  protected exemplo(): void {
    const pr = this.prod(), ex = this.C().exemplo.pf;
    const base = { ...VAZIO, produto: pr.id, perfil: pr.perfis.includes('pf') ? 'pf' as const : 'pj' as const, tipo: pr.tipos[0] ?? null, nascimento: pr.perfis.includes('pf') ? ex.nascimento : '', cartorio: pr.cartorio ? 'sim' as const : null, fgts: pr.fgts ? 'nao' as const : null };
    const valores: Record<string, [number | null, number, number]> = {
      fi: [450000, 100000, 420], construcao: [380000, 80000, 120], cgi: [800000, 300000, 180], veiculos: [90000, 50000, 48], giro: [null, 250000, 36], condominios: [null, 400000, 72],
    };
    const [valor, entrada, prazo] = valores[pr.id];
    this.f.set({ ...base, perfil: base.perfil, valor, entrada, prazo });
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
    this.recentes.update((l) => [{ id: 'n' + agora.getTime(), origem: 'Simulador', cliente: null, produto: this.prod().label, valor: (this.credito() ? f.entrada : f.valor) ?? 0, data, form: { ...f } }, ...l].slice(0, 8));
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
  protected readonly tipoAtual = computed(() => this.C().tipos.find((t: any) => t.value === this.f().tipo) ?? null);
  protected readonly resumo = computed(() => {
    const f = this.f(), pr = this.prod();
    const l: [string, string][] = [['Produto', pr.label], ['Perfil do cliente', f.perfil === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física']];
    if (f.perfil !== 'pj') l.push(['Nascimento', f.nascimento || '—']);
    if (this.temBem()) l.push([pr.rotuloValor, 'R$ ' + brl(f.valor ?? 0)]);
    l.push(this.credito() ? [pr.rotuloEntrada, 'R$ ' + brl(f.entrada ?? 0)] : [pr.rotuloEntrada, `R$ ${brl(f.entrada ?? 0)} (${this.pctEntrada()}%)`]);
    l.push(['Prazo', `${f.prazo} meses`], ['Sistema', pr.sistema === 'sac' ? 'SAC (parcelas decrescentes)' : 'Price (parcelas fixas)']);
    if (pr.cartorio) l.push(['Custos de cartório', f.cartorio === 'sim' ? 'Incluídos' : 'Não incluídos']);
    if (pr.fgts && f.perfil !== 'pj') l.push(['FGTS', f.fgts === 'sim' ? 'Vai usar' : 'Não vai usar']);
    return l;
  });
  /** SAC (financiamentos) ou Price (créditos) com taxas de exemplo por banco. */
  private calcular(f: Form): Linha[] {
    const pr = PRODUTOS.find((p) => p.id === f.produto) ?? PRODUTOS[0];
    const custas = pr.cartorio && f.cartorio === 'sim' ? (f.valor ?? 0) * 0.04 : 0;
    const fin = (pr.modo === 'credito' ? (f.entrada ?? 0) : Math.max(0, (f.valor ?? 0) - (f.entrada ?? 0))) + custas;
    const n = Math.max(1, Math.round(f.prazo ?? 1));
    const bancos: Banco[] = pr.bancos ?? this.C().bancos;
    return bancos.map((b) => {
      const im = Math.pow(1 + b.taxa / 100, 1 / 12) - 1;
      if (pr.sistema === 'price') {
        const pmt = (fin * im) / (1 - Math.pow(1 + im, -n));
        return { parceiro: b.nome, financiado: fin, taxa: b.taxa, cet: b.taxa + 0.9, parcelas: n, primeira: pmt, ultima: pmt, total: pmt * n };
      }
      const amort = fin / n, primeira = amort + fin * im, ultima = amort + amort * im;
      return { parceiro: b.nome, financiado: fin, taxa: b.taxa, cet: b.taxa + 0.63, parcelas: n, primeira, ultima, total: ((primeira + ultima) / 2) * n };
    });
  }
  protected pct(v: number): string { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '% a.a.'; }
  /** Valor curto para indicadores (R$ 1,9 mi · R$ 475 mil). */
  protected curto(v: number): string {
    const f = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    return v >= 1e6 ? `R$ ${f(v / 1e6)} mi` : v >= 1e3 ? `R$ ${f(v / 1e3)} mil` : this.moeda(v);
  }
  protected moeda(v: number): string { return 'R$ ' + brl(v); }

  protected ajustar(): void { this.enviado.set(false); this.etapa.set('form'); }
  protected novaSimulacao(): void { this.f.set({ ...VAZIO, produto: this.prod().id }); this.enviado.set(false); this.etapa.set('form'); }
  protected inicio(): void { this.etapa.set('inicio'); }
  protected gerarProposta(banco?: string): void {
    this.avisos.mostrar(banco ? `Proposta iniciada com ${banco}. Os dados da simulação já vão preenchidos.` : 'Os dados da simulação já vão preenchidos na proposta.', 'success');
    this.nav.emit('nova');
  }
  protected compartilhar(): void {
    const texto = `Simulação The House · ${this.prod().label} · ${this.moeda(this.financiado())} em ${this.f().prazo} meses · melhor 1ª parcela: ${this.moeda(this.melhor().primeira)} (${this.melhor().parceiro})`;
    const ok = () => this.avisos.mostrar('Resumo da simulação copiado. Cole no WhatsApp ou e-mail do cliente.', 'success');
    navigator.clipboard?.writeText(texto).then(ok, ok);
  }
  /** Detalhe da simulação recente em Drawer: usa o que já está salvo, sem refazer a consulta aos bancos. */
  protected readonly vendo = signal<Recente | null>(null);
  protected readonly detalhe = computed(() => {
    const r = this.vendo(); if (!r) return null;
    const pr = PRODUTOS.find((p) => p.label === r.produto) ?? PRODUTOS[0];
    const form: Form = r.form ?? { ...VAZIO, produto: pr.id, valor: r.valor, entrada: r.valor * 0.2, prazo: 360, cartorio: 'nao' };
    const linhas = [...this.calcular(form)].sort((a, b) => a.primeira - b.primeira);
    return { r, pr, form, linhas, melhor: linhas[0], credito: pr.modo === 'credito' };
  });
  protected abrirRecente(r: Recente): void {
    this.vendo.set(null);
    if (r.form) { this.f.set({ ...r.form }); this.etapa.set('resultado'); return; }
    this.f.set({ ...VAZIO, produto: 'fi' }); this.exemplo(); this.f.update((f) => ({ ...f, valor: r.valor })); this.etapa.set('resultado');
  }
}
