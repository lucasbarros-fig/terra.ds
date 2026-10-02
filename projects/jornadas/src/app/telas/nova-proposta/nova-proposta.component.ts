import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ActionBarComponent, ButtonComponent, DivisorComponent, PartnerComponent, IconComponent, TagComponent } from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { ParceiroComponent } from '../../shared/parceiro.component';
import { VideoProdutoComponent } from '../../shared/video-produto.component';
import { AvisosService } from '../../shared/avisos.service';
import { ic } from '../../shared/data';

/** Nova Proposta: perguntas em sequência (perfil › solução › produto › como seguir) + painel de produto. */
@Component({
  selector: 'jv-nova-proposta',
  standalone: true,
  imports: [ShellComponent, ActionBarComponent, ButtonComponent, DivisorComponent, IconComponent, TagComponent, ParceiroComponent, VideoProdutoComponent, PartnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nova-proposta.component.html',
  styleUrl: './nova-proposta.component.scss',
})
export class NovaPropostaComponent {
  readonly journey = input.required<any>();
  readonly state = input<any>({});
  readonly stateChange = output<any>();
  readonly nav = output<string>();

  private readonly avisos = inject(AvisosService);
  protected readonly ic = ic;

  protected readonly C = computed(() => this.journey().content);
  protected readonly s = computed(() => this.state() || {});
  protected readonly cfg = computed(() => {
    const s = this.s();
    return s.perfil && s.solucao ? this.C().produtos[s.perfil + '.' + s.solucao] : null;
  });
  protected readonly cat = computed(() => (this.s().perfil ? this.C().catalogo[this.s().perfil] : null));
  protected readonly produto = computed(() => (this.s().produto ? this.cat()[this.s().produto] : null));
  protected readonly listaPainel = computed(() => {
    const cfg = this.cfg();
    if (cfg) return { title: cfg.panelTitle, items: cfg.list.map((v: string) => ({ label: this.cat()[v].label, icon: this.cat()[v].icon, text: this.cat()[v].card.text, partners: this.cat()[v].card.partners })) };
    if (this.s().perfil) return this.C().grupos[this.s().perfil];
    return null;
  });

  protected emBreve(v: string): boolean { return this.C().emBreve.includes(v) && this.s().produto !== v; }
  protected bullet(b: any): { text: string; sub: string[] } { return typeof b === 'string' ? { text: b, sub: [] } : b; }

  protected escolher(campo: 'perfil' | 'solucao' | 'produto', v: string): void {
    const s = this.s();
    if (campo === 'perfil') this.stateChange.emit({ perfil: v });
    if (campo === 'solucao') this.stateChange.emit({ perfil: s.perfil, solucao: v });
    if (campo === 'produto') this.stateChange.emit({ perfil: s.perfil, solucao: s.solucao, produto: v });
  }
  protected voltar(): void {
    const s = this.s();
    if (s.produto) this.stateChange.emit({ perfil: s.perfil, solucao: s.solucao });
    else if (s.solucao) this.stateChange.emit({ perfil: s.perfil });
    else this.stateChange.emit({});
  }
  protected preencher(): void {
    this.avisos.mostrar(`Próximo passo: preenchimento da proposta de ${this.produto().label}. Essa jornada ainda não foi cadastrada.`);
  }
  protected copiarLink(): void { this.avisos.mostrar('Envio disponível após criar sua loja.', 'warning', 7000); }
  protected documentacao(): void { this.avisos.mostrar('Abre a documentação do produto no portal do parceiro (fora do protótipo).'); }
}
