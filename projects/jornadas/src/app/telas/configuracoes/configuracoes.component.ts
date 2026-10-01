import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ShellComponent } from '../../shared/shell.component';

@Component({
  selector: 'jv-configuracoes',
  standalone: true,
  imports: [ShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<jv-shell [menu]="journey().menu" [title]="journey().title" (nav)="nav.emit($event)"><p style="padding:24px">Em construção</p></jv-shell>`,
})
export class ConfiguracoesComponent {
  readonly journey = input.required<any>();
  readonly state = input<any>({});
  readonly stateChange = output<any>();
  readonly nav = output<string>();
}
