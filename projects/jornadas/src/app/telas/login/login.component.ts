import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, CheckboxComponent, IconComponent, InputTextComponent } from 'terra-ds';
import { ParceiroComponent } from '../../shared/parceiro.component';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Login da The House no Terra DS: painel da marca à esquerda, formulário à direita, com "Esqueci minha senha". */
@Component({
  selector: 'jv-login',
  standalone: true,
  imports: [FormsModule, ButtonComponent, CheckboxComponent, IconComponent, InputTextComponent, ParceiroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly entrar = output<void>();

  protected readonly modo = signal<'login' | 'esqueci' | 'enviado'>('login');
  protected readonly email = signal('');
  protected readonly senha = signal('');
  protected readonly manter = signal(true);
  protected readonly tocado = signal(false);
  protected readonly carregando = signal(false);

  protected readonly emailValido = computed(() => EMAIL.test(this.email().trim()));
  protected readonly erroEmail = computed(() => this.tocado() && !!this.email() && !this.emailValido());
  protected readonly podeEntrar = computed(() => this.emailValido() && this.senha().length >= 4);

  protected readonly ano = new Date().getFullYear();

  protected readonly beneficios = [
    { icon: 'HouseLine', texto: 'Financiamento imobiliário, home equity e consórcio em um só lugar' },
    { icon: 'Handshake', texto: 'Compare ofertas dos principais bancos parceiros em minutos' },
    { icon: 'ChartLineUp', texto: 'Acompanhe propostas e comissões em tempo real' },
  ];

  protected acessar(): void {
    this.tocado.set(true);
    if (!this.podeEntrar() || this.carregando()) return;
    this.carregando.set(true);
    setTimeout(() => { this.carregando.set(false); this.entrar.emit(); }, 900);
  }

  protected enviarLink(): void {
    this.tocado.set(true);
    if (!this.emailValido() || this.carregando()) return;
    this.carregando.set(true);
    setTimeout(() => { this.carregando.set(false); this.modo.set('enviado'); }, 800);
  }

  protected irPara(m: 'login' | 'esqueci'): void {
    this.tocado.set(false);
    this.modo.set(m);
  }
}
