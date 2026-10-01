import { NgIf } from "@angular/common";
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from "@angular/core";
import { ButtonComponent, type ButtonIntent } from "../../actions/button/button.component";
import {
	IconComponent,
	type IconNameType,
} from "../icon/icon.component";

@Component({
	selector: "lib-empty-state",
	templateUrl: "./empty-state.component.html",
	styleUrls: ["./empty-state.component.scss"],
	standalone: true,
	host: { "data-terra-ds": "" },
	imports: [NgIf, IconComponent, ButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
	@Input() icon?: IconNameType;
	@Input() title?: string;
	@Input() description?: string;

	@Input() buttonLabel?: string;
	@Input() buttonIcon?: IconNameType;
	@Input() buttonIntent: Extract<ButtonIntent, "branding" | "neutral"> =
		"neutral";
	@Input({ transform: booleanAttribute }) buttonDisabled = false;

	@Output() buttonClicked = new EventEmitter<MouseEvent>();

	get hasTextBlock(): boolean {
		return Boolean(this.title?.trim()) || Boolean(this.description);
	}

	get hasAnyContent(): boolean {
		return Boolean(
			this.icon ||
				this.hasTextBlock ||
				this.buttonLabel?.trim(),
		);
	}
}
