import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { AvisosService } from './shared/avisos.service';
import { DashboardComponent } from './telas/dashboard/dashboard.component';
import { LoginComponent } from './telas/login/login.component';
import { NovaPropostaComponent } from './telas/nova-proposta/nova-proposta.component';
import { J } from './shared/data';

/**
 * Dashboard da The House no Terra DS, embutida no artefato Jornadas (iframe 1728x972).
 * Tema pelo hash (#light / #dark) ou por postMessage({ type: 'jv-mode', mode }) do visualizador.
 * Cliques que levam a outra jornada são enviados ao visualizador: postMessage({ type: 'jv-nav', value }).
 */
@Component({
  selector: 'jv-embed',
  standalone: true,
  imports: [DashboardComponent, NovaPropostaComponent, LoginComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (tela()) {
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
  /** Telas desta página: Login, Home (Dashboard) e Nova proposta. */
  protected readonly tela = signal<'login' | 'home' | 'nova'>(location.hash.includes('nova') ? 'nova' : location.hash.includes('home') ? 'home' : 'login');
  protected readonly estadoNova = signal<any>({});
  private readonly modo = signal('light');

  private readonly avisos = inject(AvisosService);
  private readonly sozinha = window.parent === window;

  constructor() {
    const h = location.hash.replace('#', '').replace(/nova|home|login/g, '').replace(/^[.-]+|[.-]+$/g, '');
    if (h) this.aplicar(h);
    else if (!document.documentElement.getAttribute('data-theme')) this.aplicar(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  private aplicar(m: string): void {
    const modo = m === 'dark' ? 'dark' : 'light';
    this.modo.set(modo);
    document.documentElement.setAttribute('data-theme', modo);
  }

  @HostListener('window:hashchange')
  protected aoHash(): void { const h = location.hash.replace('#', '').replace(/nova|home|login/g, '').replace(/^[.-]+|[.-]+$/g, ''); if (h) this.aplicar(h); }

  @HostListener('window:message', ['$event'])
  protected aoMensagem(e: MessageEvent): void {
    if (e.data && e.data.type === 'jv-mode') this.aplicar(e.data.mode);
  }

  private readonly nomes: Record<string, string> = { propostas: 'Propostas', nova: 'Nova proposta', simuladores: 'Simuladores' };

  protected navegar(v: string): void {
    if (v === 'sair') { this.avisos.limpar(); this.tela.set('login'); return; }
    if (v === 'home' || v === 'nova') {
      this.avisos.limpar();
      if (v === 'nova') this.estadoNova.set({});
      this.tela.set(v);
      return;
    }
    if (this.sozinha) {
      const nome = this.nomes[v] ?? (J.menus.thehouse.find((m: any) => m.value === v)?.label || v);
      this.avisos.mostrar(`"${nome}" fica fora desta página: esta página tem a Home e a Nova proposta no Terra DS.`);
      return;
    }
    try { window.parent.postMessage({ type: 'jv-nav', value: v }, '*'); } catch { /* fora do visualizador */ }
  }
}
