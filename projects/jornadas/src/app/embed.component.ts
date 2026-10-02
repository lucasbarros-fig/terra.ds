import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { AvisosService } from './shared/avisos.service';
import { DashboardComponent } from './telas/dashboard/dashboard.component';
import { LoginComponent } from './telas/login/login.component';
import { PropostasComponent } from './telas/propostas/propostas.component';
import { NovaPropostaComponent } from './telas/nova-proposta/nova-proposta.component';
import { ClientesComponent } from './telas/clientes/clientes.component';
import { MarketingComponent } from './telas/marketing/marketing.component';
import { J } from './shared/data';

/**
 * Dashboard da The House no Terra DS, embutida no artefato Jornadas (iframe 1728x972).
 * Tema pelo hash (#light / #dark) ou por postMessage({ type: 'jv-mode', mode }) do visualizador.
 * Cliques que levam a outra jornada são enviados ao visualizador: postMessage({ type: 'jv-nav', value }).
 */
@Component({
  selector: 'jv-embed',
  standalone: true,
  imports: [DashboardComponent, NovaPropostaComponent, LoginComponent, PropostasComponent, ClientesComponent, MarketingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (tela()) {
      @case ('propostas') { <jv-propostas [journey]="propostas" (nav)="navegar($event)"></jv-propostas> }
      @case ('marketing') { <jv-marketing (nav)="navegar($event)"></jv-marketing> }
      @case ('clientes') { <jv-clientes [journey]="clientes" (nav)="navegar($event)"></jv-clientes> }
      @case ('login') { <jv-login (entrar)="navegar('home')"></jv-login> }
      @case ('nova') { <jv-nova-proposta [journey]="novaProposta" [state]="estadoNova()" (stateChange)="estadoNova.set($event)" (nav)="navegar($event)"></jv-nova-proposta> }
      @default { <jv-dashboard [journey]="journey" (nav)="navegar($event)"></jv-dashboard> }
    }
  `,
  styles: [`:host { display: block; height: 100vh; }`],
})
export class EmbedComponent {
  protected readonly journey = J.journeys.find((j: any) => j.id === 'dashboard');
  protected readonly novaProposta = J.journeys.find((j: any) => j.id === 'nova-proposta');
  protected readonly propostas = J.journeys.find((j: any) => j.id === 'propostas');
  protected readonly clientes = J.journeys.find((j: any) => j.id === 'clientes');
  /** Telas desta página: Login, Home (Dashboard), Nova proposta, Propostas e Clientes. */
  protected readonly tela = signal<'login' | 'home' | 'nova' | 'propostas' | 'clientes' | 'marketing'>(location.hash.includes('marketing') ? 'marketing' : location.hash.includes('clientes') ? 'clientes' : location.hash.includes('nova') ? 'nova' : location.hash.includes('propostas') ? 'propostas' : location.hash.includes('home') ? 'home' : 'login');
  protected readonly estadoNova = signal<any>({});
  private readonly modo = signal('light');

  private readonly avisos = inject(AvisosService);
  private readonly sozinha = window.parent === window;

  constructor() {
    const h = location.hash.replace('#', '').replace(/marketing|clientes|nova|home|login|propostas/g, '').replace(/^[.-]+|[.-]+$/g, '');
    if (h) this.aplicar(h);
    else this.aplicar('light');
  }

  private aplicar(m: string): void {
    const modo = m === 'dark' ? 'dark' : 'light';
    this.modo.set(modo);
    document.documentElement.setAttribute('data-theme', modo);
  }

  @HostListener('window:hashchange')
  protected aoHash(): void { const h = location.hash.replace('#', '').replace(/marketing|clientes|nova|home|login|propostas/g, '').replace(/^[.-]+|[.-]+$/g, ''); if (h) this.aplicar(h); }

  @HostListener('window:message', ['$event'])
  protected aoMensagem(e: MessageEvent): void {
    if (e.data && e.data.type === 'jv-mode') this.aplicar(e.data.mode);
  }

  private readonly nomes: Record<string, string> = { propostas: 'Propostas', nova: 'Nova proposta', simuladores: 'Simuladores' };

  protected navegar(v: string): void {
    if (v === 'sair') { this.avisos.limpar(); this.tela.set('login'); return; }
    if (v === 'base' || v === 'base-minha') v = 'clientes';
    if (v === 'home' || v === 'nova' || v === 'propostas' || v === 'clientes' || v === 'marketing') {
      this.avisos.limpar();
      if (v === 'nova') this.estadoNova.set({});
      this.tela.set(v);
      return;
    }
    if (this.sozinha) {
      const nome = this.nomes[v] ?? (J.menus.thehouse.find((m: any) => m.value === v)?.label || v);
      this.avisos.mostrar(`"${nome}" fica fora desta página: esta página tem a Home, a Nova proposta, as Propostas, os Clientes e o Marketing no Terra DS.`);
      return;
    }
    try { window.parent.postMessage({ type: 'jv-nav', value: v }, '*'); } catch { /* fora do visualizador */ }
  }
}
