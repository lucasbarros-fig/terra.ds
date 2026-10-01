import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, CardKanbanComponent, EmptyStateComponent, InputTextComponent, KpiCardComponent, SelectComponent, StatusColor, TagComponent,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { AvisosService } from '../../shared/avisos.service';
import { MenuFlutuanteComponent, PosicaoMenu, ancorar } from '../../shared/menu-flutuante.component';
import { brl, ic, semAcento } from '../../shared/data';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const COR_ETAPA: Record<string, StatusColor> = { gold: 'warning', blue: 'informative', lime: 'positive', orange: 'warning', teal: 'informative', green: 'positive' };
const COR_STATUS: Record<string, StatusColor> = { notice: 'warning', negative: 'negative', positive: 'positive', informative: 'informative' };

/** Períodos do filtro (o Terra ainda não tem seletor de intervalo de datas: o período vira um Select com intervalos prontos). */
const PERIODOS = [
  { value: 'todos', label: 'Todo o período', start: null, end: null },
  { value: 'mar-2026', label: 'Março de 2026', start: '2026-03-01', end: '2026-03-31' },
  { value: '1-15-abr-2026', label: '1 a 15 de abril de 2026', start: '2026-04-01', end: '2026-04-15' },
  { value: 'set-2026', label: 'Setembro de 2026', start: '2026-09-01', end: '2026-09-30' },
];

/** Propostas · Seu acompanhamento: filtros, resumo por etapa, kanban, menu da proposta e estados vazios. */
@Component({
  selector: 'jv-propostas',
  standalone: true,
  imports: [ShellComponent, FormsModule, ButtonComponent, CardKanbanComponent, EmptyStateComponent, InputTextComponent, KpiCardComponent, SelectComponent, TagComponent, MenuFlutuanteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './propostas.component.html',
  styleUrl: './propostas.component.scss',
})
export class PropostasComponent {
  readonly journey = input.required<any>();
  readonly state = input<any>({});
  readonly stateChange = output<any>();
  readonly nav = output<string>();

  private readonly avisos = inject(AvisosService);
  private readonly area = viewChild<ElementRef<HTMLElement>>('area');
  protected readonly ic = ic;
  protected readonly brl = brl;

  protected readonly C = computed(() => this.journey().content);
  protected readonly base = computed<any[]>(() => (this.state()?.vazio ? [] : this.C().propostas));
  private readonly ini = this.state()?.filtros === 'sem-resultado';

  protected readonly busca = signal('');
  protected readonly produto = signal<string[]>(this.ini ? ['Home Equity'] : []);
  protected readonly status = signal<string[]>([]);
  protected readonly usuarios = signal<string[]>([]);
  protected readonly periodo = signal<string>(this.ini ? '1-15-abr-2026' : 'todos');
  protected readonly menu = signal<{ pos: PosicaoMenu; p: any } | null>(null);

  protected readonly opProdutos = computed(() => this.C().produtos.map((p: string) => ({ value: p, label: p })));
  protected readonly opEtapas = computed(() => this.C().etapas.map((e: any) => ({ value: e.value, label: e.label })));
  protected readonly opUsuarios = computed(() => {
    const l: any[] = [];
    for (const u of this.C().usuarios) { l.push({ value: u.value, label: u.label }); for (const c of u.children || []) l.push({ value: c.value, label: '↳ ' + c.label }); }
    return l;
  });
  protected readonly opPeriodos = PERIODOS.map((p) => ({ value: p.value, label: p.label }));

  protected readonly filtrado = computed(() => !!this.busca().trim() || this.produto().length > 0 || this.status().length > 0 || this.usuarios().length > 0 || this.periodo() !== 'todos');

  protected readonly linhas = computed(() => {
    const q = semAcento(this.busca().trim());
    const per = PERIODOS.find((p) => p.value === this.periodo())!;
    return this.base().filter((p) => {
      if (q && !semAcento(p.cliente + ' ' + p.id).includes(q)) return false;
      if (this.produto().length && !this.produto().includes(p.produto)) return false;
      if (this.status().length && !this.status().includes(p.etapa)) return false;
      if (this.usuarios().length && !this.usuarios().some((u) => p.dono === u || p.dono.startsWith(u + '/'))) return false;
      if (per.start) { const d = p.criado.slice(0, 10); if (d < per.start || d > per.end!) return false; }
      return true;
    });
  });

  /** Resumo por etapa: total da carteira (não muda com os filtros, como no Figma). */
  protected readonly resumo = computed(() => this.C().etapas.map((e: any) => {
    const l = this.base().filter((p) => p.etapa === e.value);
    return { e, n: l.length, total: l.reduce((a, p) => a + p.valor, 0) };
  }));
  protected readonly colunas = computed(() => this.C().etapas.map((e: any) => ({ e, cards: this.linhas().filter((p) => p.etapa === e.value) })));

  protected inteiro(v: number): string { return v.toLocaleString('pt-BR', { maximumFractionDigits: 0 }); }
  protected corEtapa(c: string): StatusColor { return COR_ETAPA[c] ?? 'neutral'; }
  protected corStatus(s: string): StatusColor { return COR_STATUS[this.C().statusIntent[s]] ?? 'informative'; }
  protected curto(iso: string): string { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`; }

  protected limpar(): void { this.busca.set(''); this.produto.set([]); this.status.set([]); this.usuarios.set([]); this.periodo.set('todos'); }
  protected lista(v: unknown): string[] { return Array.isArray(v) ? v as string[] : v ? [v as string] : []; }

  protected ver(p: any): void { this.avisos.mostrar(`Proposta #${p.id} · ${p.cliente}: o detalhe da proposta entra na próxima etapa desta jornada.`); }
  protected abrirMenu(ev: Event, p: any): void { this.menu.set({ pos: ancorar(ev, this.area()!.nativeElement), p }); }
  protected acao(v: string): void {
    const p = this.menu()!.p; this.menu.set(null);
    if (v === 'ver') this.ver(p);
    else if (v === 'transferir') this.avisos.mostrar(`Transferir a proposta #${p.id} para outro usuário da carteira.`);
    else this.avisos.mostrar(`Proposta #${p.id} de ${p.cliente} cancelada.`, 'error');
  }
  protected exportar(): void {
    const n = this.linhas().length;
    this.avisos.mostrar(`Relatório com ${n} ${n === 1 ? 'proposta' : 'propostas'} gerado com os filtros aplicados.`, 'success');
  }
}
