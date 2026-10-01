import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { AvisosService } from './shared/avisos.service';
import { DashboardComponent } from './telas/dashboard/dashboard.component';
import { J } from './shared/data';

/**
 * Dashboard da The House no Terra DS, embutida no artefato Jornadas (iframe 1728x972).
 * Tema pelo hash (#light / #dark) ou por postMessage({ type: 'jv-mode', mode }) do visualizador.
 * Cliques que levam a outra jornada são enviados ao visualizador: postMessage({ type: 'jv-nav', value }).
 */
@Component({
  selector: 'jv-embed',
  standalone: true,
  imports: [DashboardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<jv-dashboard [journey]="journey" (nav)="navegar($event)"></jv-dashboard>`,
  styles: [`:host { display: block; height: 100vh; }`],
})
export class EmbedComponent {
  protected readonly journey = J.journeys.find((j: any) => j.id === 'dashboard');
  private readonly modo = signal('light');

  private readonly avisos = inject(AvisosService);
  private readonly sozinha = window.parent === window;

  constructor() {
    const h = location.hash.replace('#', '');
    if (h) this.aplicar(h);
    else if (!document.documentElement.getAttribute('data-theme')) this.aplicar(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  private aplicar(m: string): void {
    const modo = m === 'dark' ? 'dark' : 'light';
    this.modo.set(modo);
    document.documentElement.setAttribute('data-theme', modo);
  }

  @HostListener('window:hashchange')
  protected aoHash(): void { this.aplicar(location.hash.replace('#', '')); }

  @HostListener('window:message', ['$event'])
  protected aoMensagem(e: MessageEvent): void {
    if (e.data && e.data.type === 'jv-mode') this.aplicar(e.data.mode);
  }

  private readonly nomes: Record<string, string> = { propostas: 'Propostas', nova: 'Nova proposta', simuladores: 'Simuladores' };

  protected navegar(v: string): void {
    if (this.sozinha) {
      const nome = this.nomes[v] ?? (J.menus.thehouse.find((m: any) => m.value === v)?.label || v);
      this.avisos.mostrar(`"${nome}" fica fora desta página: aqui está só a Dashboard no Terra DS.`);
      return;
    }
    try { window.parent.postMessage({ type: 'jv-nav', value: v }, '*'); } catch { /* fora do visualizador */ }
  }
}
