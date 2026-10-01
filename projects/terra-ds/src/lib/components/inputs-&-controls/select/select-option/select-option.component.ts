import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  input,
} from '@angular/core';

@Component({
  selector: 'lib-select-option',
  standalone: true,
  template: `<ng-template #tpl><ng-content></ng-content></ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent {
  readonly value = input<unknown>(undefined);
  readonly label = input('');
  readonly disabled = input(false);

  @ViewChild('tpl', { static: true }) templateRef!: TemplateRef<unknown>;
}
