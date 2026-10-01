import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lib-dropdown-group-header',
  templateUrl: './dropdown-group-header.component.html',
  styleUrls: ['./dropdown-group-header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'presentation',
    class: 'terra-dropdown-group-header',
  },
})
export class DropdownGroupHeaderComponent {
  @Input({ required: true }) label!: string;
}
