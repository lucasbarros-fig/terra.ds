import { ChangeDetectionStrategy, Component, computed, effect, HostListener, inject, signal } from '@angular/core';
import {
  ButtonComponent, DrawerComponent, IconButtonComponent, IconComponent, SelectComponent, TabsComponent, TagComponent,
} from './shared/terra';
import { J, dataBR, ic } from './shared/data';
import { AvisosService } from './shared/avisos.service';
import { DashboardComponent } from './telas/dashboard/dashboard.component';
import { NovaPropostaComponent } from './telas/nova-proposta/nova-proposta.component';
import { PropostasComponent } from './telas/propostas/propostas.component';
import { SimuladoresComponent } from './telas/simuladores/simuladores.component';
import { ClientesComponent } from './telas/clientes/clientes.component';
import { ConfiguracoesComponent } from './telas/configuracoes/configuracoes.component';

const BRAND = 'thehouse';

function lerHash(): { journey: string | null; step: string | null } {
  const p = (location.hash || '').replace(/^#\/?/, '').split(/[./]/);
  return { journey: p[1] || null, step: p[2] || null };
}
function normal(o: any): string {
  const r: any = {};
  Object.keys(o || {}).sort().forEach((k) => { if (o[k] != null && o[k] !== false) r[k] = o[k]; });
  return JSON.stringify(r);
}
function lsGet(k: string, d: string): string { try { return localStorage.getItem('jornadas-terra:' + k) ?? d; } catch { return d; } }
function lsSet(k: string, v: string): void { try { localStorage.setItem('jornadas-terra:' + k, v); } catch { /* sem storage */ } }

/** Jornadas Terra: visualizador das jornadas da The House, todo montado com o Terra DS. */
@Component({
  selector: 'jv-root',
  standalone: true,
  imports: [
    ButtonComponent, DrawerComponent, IconButtonComponent, IconComponent, SelectComponent, TabsComponent, TagComponent,
    DashboardComponent, NovaPropostaComponent, PropostasComponent, SimuladoresComponent, ClientesComponent, ConfiguracoesComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly avisos = inject(AvisosService);

  /** Jornadas da The House na ordem do menu. */
  protected readonly jornadas: any[] = (() => {
    const menu = J.menus[BRAND];
    const pos = (j: any) => {
      if (j.menu === 'nova') return 0.5;
      const i = menu.findIndex((m: any) => m.value === j.menu || (m.children || []).some((c: any) => c.value === j.menu));
      return i < 0 ? 999 : i;
    };
    return J.journeys.filter((j: any) => j.brands.includes(BRAND)).sort((a: any, b: any) => pos(a) - pos(b));
  })();
  protected readonly opcoesJornada = this.jornadas.map((j) => ({ value: j.id, label: j.title }));

  private readonly h = lerHash();
  protected readonly jid = signal<string>(this.jornadas.some((j) => j.id === this.h.journey) ? this.h.journey! : (this.jornadas.find((j) => j.id === 'dashboard') ?? this.jornadas[0]).id);
  protected readonly sid = signal<string | null>(this.h.step);
  protected readonly modo = signal<'light' | 'dark'>(lsGet('modo', 'light') === 'dark' ? 'dark' : 'light');
  protected readonly aba = signal(0); // 0 protótipo, 1 print do Figma
  protected readonly detalhes = signal(false);
  /** Estado vivo da tela (muda com os cliques no protótipo; a etapa da lateral define o estado inicial). */
  protected readonly estado = signal<any>({});
  protected readonly versao = signal(0);

  protected readonly jornada = computed(() => this.jornadas.find((j) => j.id === this.jid())!);
  protected readonly etapa = computed(() => {
    const j = this.jornada();
    return j.steps.find((s: any) => s.id === this.sid()) ?? j.steps[0];
  });
  protected readonly indice = computed(() => this.jornada().steps.indexOf(this.etapa()));
  protected readonly grupos = computed(() => {
    const j = this.jornada();
    return j.groups.map((g: any) => ({ ...g, steps: j.steps.filter((s: any) => s.group === g.id) })).filter((g: any) => g.steps.length);
  });
  protected readonly ic = ic;
  protected readonly dataBR = dataBR;

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.modo());
      lsSet('modo', this.modo());
    });
    effect(() => {
      const hash = `#${BRAND}.${this.jid()}.${this.etapa().id}`;
      try { history.replaceState(null, '', hash); } catch { /* ok */ }
    });
    effect(() => { this.estado.set({ ...(this.etapa().state || {}) }); this.versao.update((v) => v + 1); }, { allowSignalWrites: true } as any);
  }

  @HostListener('window:hashchange')
  protected aoMudarHash(): void {
    const x = lerHash();
    if (x.journey && this.jornadas.some((j) => j.id === x.journey)) { this.jid.set(x.journey); this.sid.set(x.step); }
  }

  @HostListener('window:keydown', ['$event'])
  protected teclado(e: KeyboardEvent): void {
    const alvo = e.target as HTMLElement;
    if (alvo && (alvo.closest('input, textarea, select, [contenteditable], [role="slider"]'))) return;
    if (e.altKey && e.key === 'ArrowRight') this.irPara(this.indice() + 1);
    if (e.altKey && e.key === 'ArrowLeft') this.irPara(this.indice() - 1);
  }

  protected escolherJornada(id: unknown): void {
    if (typeof id === 'string' && id !== this.jid()) { this.jid.set(id); this.sid.set(null); this.avisos.limpar(); }
  }
  protected irPara(i: number): void {
    const st = this.jornada().steps;
    if (i >= 0 && i < st.length) { this.sid.set(st[i].id); this.avisos.limpar(); }
  }
  protected escolherEtapa(id: string): void { this.sid.set(id); this.avisos.limpar(); }

  /** A tela pediu outro estado: se ele corresponde a uma etapa cadastrada, a etapa acompanha. */
  protected mudarEstado(next: any): void {
    const m = this.jornada().steps.find((s: any) => normal(s.state) === normal(next));
    if (m && m.id !== this.etapa().id) { this.sid.set(m.id); return; }
    this.estado.set(next);
  }

  /** Clique no menu lateral ou em links da tela: abre a jornada daquele item, se existir. */
  protected navegar(v: string): void {
    let etapa: string | null = null;
    if (v.includes('#')) { [v, etapa] = v.split('#'); }
    const alvo = this.jornadas.find((j) => j.menu === v);
    if (alvo) {
      this.avisos.limpar();
      this.jid.set(alvo.id);
      this.sid.set(etapa && alvo.steps.some((s: any) => s.id === etapa) ? etapa : null);
      return;
    }
    const rot = this.rotuloMenu(v);
    this.avisos.mostrar(`"${rot}" ainda não tem jornada cadastrada na The House.`);
  }
  private rotuloMenu(v: string): string {
    for (const it of J.menus[BRAND]) {
      if (it.value === v) return it.label;
      for (const c of it.children || []) if (c.value === v) return `${it.label} › ${c.label}`;
    }
    return v;
  }

  protected linkFigma(): string {
    const j = this.jornada();
    return j.figma.url.replace(/node-id=[^&]+/, 'node-id=' + this.etapa().node.replace(':', '-'));
  }
}
