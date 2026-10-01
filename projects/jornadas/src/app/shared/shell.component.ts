import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import {
  BreadcrumbItem, ButtonComponent, IconButtonComponent, DropdownItemComponent, DropdownGroupHeaderComponent, IconComponent,
  SidebarComponent, SidebarItem, TabsComponent, TopAction, TopComponent, ToastComponent,
} from './terra';
import { J, ic } from './data';
import { AvisosService } from './avisos.service';
import { inject } from '@angular/core';


/** Estrutura de todas as telas da The House no Terra: Sidebar + Top + conteúdo, com os painéis do topo. */
@Component({
  selector: 'jv-shell',
  standalone: true,
  imports: [SidebarComponent, TopComponent, IconButtonComponent, TabsComponent, ButtonComponent, DropdownItemComponent, DropdownGroupHeaderComponent, IconComponent, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly menu = input.required<string>();
  readonly title = input('');
  readonly breadcrumbs = input<BreadcrumbItem[]>([]);
  /** Cabeçalho de boas-vindas da Home (faixa na cor da marca, como no Figma "Dashboard | The House"). */
  readonly home = input(false);
  readonly subtitulo = input('');
  readonly nav = output<string>();
  protected readonly avisos = inject(AvisosService);

  protected readonly topo = J.topo;
  protected readonly painel = signal<null | 'notificacoes' | 'loja' | 'configuracoes'>(null);
  protected readonly abaNotif = signal(0);
  protected readonly lidas = signal<Record<string, boolean>>(Object.fromEntries(J.topo.notificacoes.map((n: any) => [n.id, n.lida])));
  protected readonly tudoCerto = signal(false);
  protected readonly aviso = signal<string | null>(null);

  /** Menu único da The House: "Nova proposta" em destaque no topo + itens do Figma. */
  protected readonly itens: SidebarItem[] = (() => {
    const l: SidebarItem[] = J.menus.thehouse.map((m: any) => ({ id: m.value, label: m.label, icon: ic(m.icon) }));
    l.splice(1, 0, { id: 'nova', label: J.menuHighlights.thehouse.label, icon: 'PlusCircle' });
    return l;
  })();
  protected readonly ativo = computed(() => {
    const m = this.menu();
    if (m.startsWith('base')) return 'base';
    if (m.startsWith('loja')) return 'loja';
    return m;
  });

  protected readonly naoLidas = computed(() => J.topo.notificacoes.filter((n: any) => !this.lidas()[n.id]).length);
  protected readonly acoes = computed<TopAction[]>(() => [
    { id: 'treinamentos', icon: 'Calendar', label: 'Treinamentos' },
    { id: 'loja', icon: 'Storefront', label: 'Minha loja' },
    { id: 'notificacoes', icon: 'Bell', label: this.naoLidas() ? `Notificações: ${this.naoLidas()} não lidas` : 'Notificações', badge: this.naoLidas() > 0 },
    { id: 'configuracoes', icon: 'Gear', label: 'Configurações' },
  ]);
  protected readonly notifs = computed(() =>
    J.topo.notificacoes.filter((n: any) => this.abaNotif() === 0 || !this.lidas()[n.id]));
  protected readonly gruposConfig = computed(() => {
    const g: Record<string, any[]> = {};
    for (const it of J.topo.configuracoes) (g[it.group] ??= []).push(it);
    return Object.entries(g);
  });
  protected readonly ic = ic;
  protected iniciais(n: string): string { const p = n.split(' '); return (p[0][0] + (p[1]?.[0] ?? p[0][1] ?? '')).toUpperCase(); }

  protected selecionar(item: SidebarItem): void {
    const destino = item.id === 'base' ? 'base-minha' : item.id;
    if (destino !== this.menu()) this.nav.emit(destino);
  }

  protected acao(a: TopAction): void {
    if (a.id === 'treinamentos') { this.avisos.mostrar('A agenda de treinamentos ainda não tem jornada cadastrada.'); return; }
    this.painel.set(this.painel() === a.id ? null : (a.id as any));
  }

  protected abrirNotificacao(n: any): void {
    this.lidas.update((l) => ({ ...l, [n.id]: true }));
    this.painel.set(null);
    this.nav.emit('propostas');
  }

  protected marcarTodas(): void {
    this.lidas.set(Object.fromEntries(J.topo.notificacoes.map((n: any) => [n.id, true])));
    this.tudoCerto.set(true);
    setTimeout(() => { this.tudoCerto.set(false); this.abaNotif.set(0); }, 2200);
  }

  protected config(it: any): void {
    this.painel.set(null);
    if (['conta', 'loja', 'seguranca', 'sessoes'].includes(it.value)) this.nav.emit('configuracoes#' + it.value);
    else this.avisos.mostrar(it.value === 'sair' ? 'Sair encerra a sessão e volta para o login (fora do protótipo).' : `"${it.label}" ainda não tem jornada cadastrada.`);
  }

  protected loja(v: string): void {
    this.painel.set(null);
    if (v === 'ir') this.nav.emit('loja-minha');
    else this.avisos.mostrar('Link da sua loja copiado.', 'success');
  }
}
