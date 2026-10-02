import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, DialogBodyComponent, DialogComponent, DialogFooterComponent, DialogHeaderComponent, DivisorComponent, DrawerComponent,
  IconButtonComponent, IconComponent, InputTextComponent, InputTextareaComponent, ListBodyCellComponent, ListBodyComponent,
  ListBodyRowComponent, ListComponent, ListHeaderComponent, ListHeaderItemComponent, ListPaginationComponent, StatusColor, StatusComponent,
  TabsComponent, TagComponent, TooltipComponent,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { AvisosService } from '../../shared/avisos.service';
import { MenuFlutuanteComponent, PosicaoMenu, ancorar } from '../../shared/menu-flutuante.component';
import { brl, semAcento } from '../../shared/data';

const COR: Record<string, StatusColor> = { notice: 'warning', negative: 'negative', positive: 'positive', informative: 'informative' };
const PRODUTOS = ['Crédito com Garantia de Imóvel', 'Financiamento / Aquisição de Imóvel', 'Crédito com Garantia de Veículos', 'Financiamento para Construção', 'Capital de giro'];

/**
 * Clientes (Base de clientes · Figma Clientes 4266:20391): lista PF/PJ com ordenação, busca, Drawer de detalhes, edição e exclusão.
 * Na The House não existe cadastro manual: o cliente nasce quando uma proposta é preenchida (por isso não há botão "+").
 */
@Component({
  selector: 'jv-clientes',
  standalone: true,
  imports: [
    ShellComponent, FormsModule, ButtonComponent, DialogComponent, DialogHeaderComponent, DialogBodyComponent, DialogFooterComponent, DivisorComponent,
    DrawerComponent, IconButtonComponent, IconComponent, InputTextComponent, InputTextareaComponent, StatusComponent, TabsComponent, TagComponent, TooltipComponent,
    ListComponent, ListHeaderComponent, ListHeaderItemComponent, ListBodyComponent, ListBodyRowComponent, ListBodyCellComponent, ListPaginationComponent,
    MenuFlutuanteComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
})
export class ClientesComponent {
  readonly journey = input.required<any>();
  readonly state = input<any>({});
  readonly stateChange = output<any>();
  readonly nav = output<string>();

  private readonly avisos = inject(AvisosService);
  private readonly area = viewChild<ElementRef<HTMLElement>>('area');
  protected readonly brl = brl;
  protected readonly C = computed(() => this.journey().content);
  private readonly s0 = this.state() || {};

  protected readonly aba = signal<number>(this.s0.tab === 'pj' ? 1 : 0);
  protected readonly busca = signal<string>(this.s0.busca || '');
  protected readonly pagina = signal(1);
  protected readonly porPagina = signal(8);
  protected readonly ordem = signal<{ k: string; asc: boolean }>({ k: 'atualizado', asc: false });
  protected readonly removidos = signal<Record<string, boolean>>({});
  protected readonly aberto = signal<string | null>(this.s0.cliente || null);
  protected readonly excluir = signal<string | null>(this.s0.excluir || null);
  protected readonly menu = signal<{ pos: PosicaoMenu; r: any } | null>(null);

  /* Drawer */
  protected readonly abaDet = signal(0);
  protected readonly editando = signal<boolean>(!!this.s0.editar);
  protected readonly form = signal<any>({});
  protected readonly dialogo = signal<null | 'salvar' | 'descartar'>(null);

  protected readonly tipo = computed(() => (this.aba() === 1 ? 'pj' : 'pf'));
  protected readonly todos = computed<any[]>(() => this.C()[this.tipo()].filter((r: any) => !this.removidos()[r.id]));
  protected readonly colunas = computed(() => this.tipo() === 'pf'
    ? [{ k: 'nome', label: 'Nome', w: undefined }, { k: 'doc', label: 'CPF', w: '170px' }, { k: 'telefone', label: 'Telefone', w: '170px' }, { k: 'email', label: 'E-mail', w: undefined }, { k: 'atualizado', label: 'Atualizado', w: '150px' }]
    : [{ k: 'nome', label: 'Razão social', w: undefined }, { k: 'doc', label: 'CNPJ', w: '200px' }, { k: 'faturamento', label: 'Faturamento', w: '190px' }, { k: 'representante', label: 'Representante legal', w: undefined }, { k: 'atualizado', label: 'Atualizado', w: '150px' }]);
  protected readonly linhas = computed(() => {
    const q = semAcento(this.busca().trim()), qd = this.busca().replace(/\D/g, '');
    const l = !q ? this.todos() : this.todos().filter((r) => semAcento(r.nome).includes(q) || (qd.length >= 3 && r.doc.replace(/\D/g, '').includes(qd)));
    const { k, asc } = this.ordem();
    return [...l].sort((a, b) => {
      const va = a[k], vb = b[k];
      const c = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb), 'pt-BR');
      return asc ? c : -c;
    });
  });
  protected readonly paginaAtual = computed(() => this.linhas().slice((this.pagina() - 1) * this.porPagina(), this.pagina() * this.porPagina()));

  protected readonly rowAberto = computed(() => this.acharRow(this.aberto()));
  protected readonly d = computed(() => (this.rowAberto() ? this.detalhe(this.rowAberto()) : null));
  protected readonly abasDet = computed(() => this.d()?.tipo === 'pj'
    ? [{ label: 'Dados da empresa', icon: 'Buildings' }, { label: 'Representante legal', icon: 'User' }, { label: 'Atividades secundárias', icon: 'Pulse' }]
    : [{ label: 'Dados pessoais', icon: 'IdentificationCard' }, { label: 'Telefones', icon: 'Phone' }, { label: 'Vínculos', icon: 'Users' }, { label: 'Empresas', icon: 'Buildings' }].map((t, i) => ({ ...t, disabled: this.editando() && i > 0 })));
  protected readonly mudou = computed(() => { const d = this.d(), f = this.form(); return !!d && (f.email !== d.email || (f.obs || '') !== (d.obs || '')); });
  protected readonly rowExcluir = computed(() => this.acharRow(this.excluir()));

  constructor() {
    if (this.aberto()) this.form.set({ ...this.detalhe(this.acharRow(this.aberto())) });
  }

  private acharRow(id: string | null): any { return id ? this.C().pf.concat(this.C().pj).find((r: any) => r.id === id) : null; }

  /** Detalhe de exemplo para clientes que não têm tela própria no Figma: monta a partir da linha da lista. */
  private detalhe(row: any): any {
    const C = this.C();
    if (C.detalhes[row.id]) return C.detalhes[row.id];
    const tipo = C.pf.includes(row) ? 'pf' : 'pj';
    const base: any = { tipo, nome: row.nome, doc: row.doc, email: row.email, endereco: ['Av. Paulista, 1000', 'Bela Vista, São Paulo - SP, 01310-100'], cep: '01310-100', rua: 'Av. Paulista', numero: '1000', complemento: '', uf: 'SP', cidade: 'São Paulo', lgpd: 'Pendente', bacen: 'Pendente', criado: '12 mar 2025', obs: '', historico: [] };
    C.detalhes[row.id] = tipo === 'pf'
      ? { ...base, nascimento: '—', genero: '—', estadoCivil: '—', renda: '—', mae: '—', telefones: [{ tipo: 'Celular', numero: row.telefone, principal: true }], vinculos: [], empresas: [] }
      : { ...base, fantasia: 'Não possui', abertura: '—', porte: '—', nivel: 'Não possui', natureza: 'Não possui', regime: 'Não possui', capital: '—', faturamento: 'R$ ' + brl(row.faturamento), inicioSimples: 'Não possui', fimSimples: 'Não possui', mei: 'Não', renda: '—', funcionarios: '—', representante: { nome: row.representante, cpf: '—', cargo: 'Representante legal', email: '—', telefone: '—' }, atividades: [] };
    return C.detalhes[row.id];
  }

  protected data(iso: string): string { return new Date(iso).toLocaleDateString('pt-BR'); }
  protected cor(intent: string): StatusColor { return COR[intent] ?? 'informative'; }
  protected corAss(v: string): StatusColor { return v === 'Assinado' ? 'positive' : 'warning'; }

  protected trocarAba(i: number): void { this.aba.set(i); this.busca.set(''); this.pagina.set(1); }
  protected ordenar(k: string): void {
    this.ordem.update((o) => (o.k === k ? { k, asc: !o.asc } : { k, asc: k !== 'atualizado' }));
    this.pagina.set(1);
  }
  /** Protótipo: parte dos clientes já assinou o termo LGPD (o escudo fica desabilitado). */
  protected lgpdOk(r: any): boolean { return this.assinados()[r.id] ?? Number(r.id) % 3 !== 1; }
  private readonly assinados = signal<Record<string, boolean>>({});
  /** Proposta que deu origem ao cliente (no back vem do vínculo cliente › proposta). */
  protected origem(r: any): { proposta: string; produto: string } {
    const n = Number(r.id);
    return { proposta: '#' + String(300000 + ((n * 37) % 99999)), produto: PRODUTOS[n % PRODUTOS.length] };
  }
  protected ver(ev: Event, r: any): void { ev?.stopPropagation?.(); this.abrir(r); }
  protected buscar(v: string): void { this.busca.set(v ?? ''); this.pagina.set(1); }

  protected abrir(r: any): void {
    this.aberto.set(r.id); this.abaDet.set(0); this.editando.set(false); this.form.set({ ...this.detalhe(r) });
  }
  protected fechar(): void { this.aberto.set(null); this.dialogo.set(null); }
  protected editar(): void {
    if (this.d().tipo === 'pj') { this.avisos.mostrar('A edição de Pessoa Jurídica não está no Figma.'); return; }
    this.abaDet.set(0); this.form.set({ ...this.d() }); this.editando.set(true);
  }
  protected campo(k: string, v: any): void { this.form.update((f) => ({ ...f, [k]: v })); }
  protected cancelarEdicao(): void { if (this.mudou()) this.dialogo.set('descartar'); else this.editando.set(false); }
  protected confirmarSalvar(): void {
    Object.assign(this.d(), { email: this.form().email, obs: this.form().obs });
    this.dialogo.set(null); this.editando.set(false);
    this.avisos.mostrar('Informações do cliente atualizadas.', 'success');
  }
  protected descartar(): void { this.form.set({ ...this.d() }); this.dialogo.set(null); this.editando.set(false); }

  protected abrirMenu(ev: Event, r: any): void { ev.stopPropagation(); this.menu.set({ pos: ancorar(ev, this.area()!.nativeElement), r }); }
  protected acaoMenu(v: string): void {
    const r = this.menu()!.r; this.menu.set(null);
    if (v === 'ver') this.abrir(r);
    else if (v === 'proposta') this.nav.emit('nova');
    else if (v === 'docs') this.avisos.mostrar(`Os documentos de ${r.nome} ainda não têm tela no Figma.`);
    else this.excluir.set(r.id);
  }
  protected lgpd(ev: Event, r: any): void { ev?.stopPropagation?.(); this.avisos.mostrar(`Termo LGPD enviado para ${r.email}.`, 'success'); }
  protected proposta(ev: Event): void { ev.stopPropagation(); this.nav.emit('nova'); }
  protected confirmarExclusao(): void {
    const r = this.rowExcluir();
    this.removidos.update((x) => ({ ...x, [r.id]: true }));
    this.excluir.set(null); this.aberto.set(null);
    this.avisos.mostrar('Cliente excluído, todos os dados foram removidos.', 'error');
  }
  protected avisar(t: string, tipo: 'success' | 'informative' = 'informative'): void { this.avisos.mostrar(t, tipo); }
}
