import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output, signal, viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, CardKanbanComponent, IconButtonComponent, IconComponent, InputTextComponent, SelectComponent, StatusColor,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { AvisosService } from '../../shared/avisos.service';
import { MenuFlutuanteComponent, PosicaoMenu, ancorar } from '../../shared/menu-flutuante.component';
import { brl, semAcento } from '../../shared/data';

/** Etapas do quadro (Figma "The House - New Ds Test" › 4 - Propostas): rótulo, ícone e cor da faixa. */
const ETAPAS: Record<string, { label: string; icon: string; cor: string }> = {
  analise: { label: 'Análise', icon: 'ListMagnifyingGlass', cor: 'var(--color-support-colors-yellow)' },
  preaprovado: { label: 'Pré-Aprovado', icon: 'ShieldCheck', cor: 'var(--color-support-colors-blue)' },
  aprovacao: { label: 'Aprovação', icon: 'Bank', cor: 'var(--color-support-colors-purple)' },
  contratacao: { label: 'Contratação', icon: 'PencilSimpleLine', cor: 'var(--color-support-colors-orange)' },
  formalizacao: { label: 'Formalização', icon: 'Receipt', cor: 'var(--color-support-colors-teal)' },
  finalizado: { label: 'Finalizado', icon: 'CheckCircle', cor: 'var(--color-support-colors-green)' },
};
const COR_STATUS: Record<string, StatusColor> = { notice: 'warning', negative: 'negative', positive: 'positive', informative: 'informative' };
const PERIODOS = [
  { value: 'todos', label: 'Todo o período', start: '', end: '' },
  { value: 'mar-2026', label: 'Março de 2026', start: '2026-03-01', end: '2026-03-31' },
  { value: 'abr-2026', label: 'Abril de 2026', start: '2026-04-01', end: '2026-04-30' },
  { value: 'set-2026', label: 'Setembro de 2026', start: '2026-09-01', end: '2026-09-30' },
];

/** Propostas: barra de filtros, quadro kanban por etapa e minimapa das colunas. */
@Component({
  selector: 'jv-propostas',
  standalone: true,
  imports: [ShellComponent, FormsModule, ButtonComponent, CardKanbanComponent, IconButtonComponent, IconComponent, InputTextComponent, SelectComponent, MenuFlutuanteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './propostas.component.html',
  styleUrl: './propostas.component.scss',
})
export class PropostasComponent implements AfterViewInit {
  readonly journey = input.required<any>();
  /** Compatibilidade com o visualizador de jornadas (estado da tela). */
  readonly state = input<any>({});
  readonly stateChange = output<any>();
  readonly nav = output<string>();

  private readonly avisos = inject(AvisosService);
  private readonly area = viewChild<ElementRef<HTMLElement>>('area');
  private readonly quadro = viewChild<ElementRef<HTMLElement>>('quadro');

  protected readonly C = computed(() => this.journey().content);
  protected readonly busca = signal('');
  protected readonly periodo = signal('todos');
  protected readonly produto = signal<string[]>([]);
  protected readonly menu = signal<{ pos: PosicaoMenu; p: any } | null>(null);

  protected readonly opPeriodos = PERIODOS.map((p) => ({ value: p.value, label: p.label }));
  protected readonly opProdutos = computed(() => this.C().produtos.map((p: string) => ({ value: p, label: p })));

  protected readonly filtradas = computed(() => {
    const q = semAcento(this.busca().trim());
    const per = PERIODOS.find((p) => p.value === this.periodo())!;
    return (this.C().propostas as any[]).filter((p) => {
      if (q && !semAcento(p.cliente + ' ' + p.id).includes(q)) return false;
      if (this.produto().length && !this.produto().includes(p.produto)) return false;
      if (per.start) { const d = p.criado.slice(0, 10); if (d < per.start || d > per.end) return false; }
      return true;
    });
  });

  protected readonly colunas = computed(() => (this.C().etapas as any[]).map((e) => {
    const cards = this.filtradas().filter((p) => p.etapa === e.value);
    return { id: e.value, ...(ETAPAS[e.value] ?? { label: e.label, icon: 'Circle', cor: 'var(--color-stroke-frame)' }), cards, total: cards.reduce((a, p) => a + p.valor, 0) };
  }));

  /** Minimapa: parte do quadro visível (início e largura em %), atualizada ao rolar. */
  protected readonly janela = signal({ ini: 0, larg: 100 });

  ngAfterViewInit(): void {
    const el = this.quadro()?.nativeElement;
    if (!el) return;
    const medir = () => this.janela.set({ ini: (el.scrollLeft / el.scrollWidth) * 100, larg: Math.min(100, (el.clientWidth / el.scrollWidth) * 100) });
    el.addEventListener('scroll', medir, { passive: true });
    new ResizeObserver(medir).observe(el);
    medir();
  }

  protected irPara(i: number): void {
    const el = this.quadro()?.nativeElement;
    const col = el?.children[i] as HTMLElement | undefined;
    if (el && col) el.scrollTo({ left: col.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  }

  protected brl(v: number): string { return 'R$ ' + brl(v); }
  protected corStatus(s: string): StatusColor { return COR_STATUS[this.C().statusIntent[s]] ?? 'informative'; }
  /** Tempo na etapa (protótipo: valor estável por proposta, já que os dados de exemplo são de datas passadas). */
  protected tempo(p: any): string {
    const op = ['1 min', '8 min', '25 min', '1 h', '3 h', '6 h', '1 d', '2 d', '4 d'];
    const n = String(p.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return op[n % op.length];
  }
  protected lista(v: unknown): string[] { return Array.isArray(v) ? (v as string[]) : v ? [v as string] : []; }

  protected ver(p: any): void { this.avisos.mostrar(`Proposta #${p.id} · ${p.cliente}: o detalhe da proposta entra na próxima tela.`); }
  protected abrirMenu(ev: Event, p: any): void { this.menu.set({ pos: ancorar(ev, this.area()!.nativeElement), p }); }
  protected acao(v: string): void {
    const p = this.menu()!.p; this.menu.set(null);
    if (v === 'ver') this.ver(p);
    else if (v === 'transferir') this.avisos.mostrar(`Transferir a proposta #${p.id} para outro usuário da carteira.`);
    else this.avisos.mostrar(`Proposta #${p.id} de ${p.cliente} cancelada.`, 'error');
  }
  protected exportar(): void {
    const n = this.filtradas().length;
    this.avisos.mostrar(`Relatório com ${n} ${n === 1 ? 'proposta' : 'propostas'} gerado com os filtros aplicados.`, 'success');
  }
}
