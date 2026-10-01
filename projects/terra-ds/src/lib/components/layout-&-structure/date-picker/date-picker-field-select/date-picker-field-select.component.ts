import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from "@angular/core";
import { IconComponent } from "../../icon/icon.component";

@Component({
	selector: "lib-date-picker-field-select",
	templateUrl: "./date-picker-field-select.component.html",
	styleUrls: ["./date-picker-field-select.component.scss"],
	standalone: true,
	imports: [IconComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { "data-terra-ds": "" },
})
export class DatePickerFieldSelectComponent {
	@Input() ariaLabel = "";
	@Input() label = "";

	@Output() readonly activate = new EventEmitter<void>();

	onActivate(): void {
		this.activate.emit();
	}
}
