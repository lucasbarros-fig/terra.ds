import {
	ChangeDetectionStrategy,
	Component,
	Input,
	booleanAttribute,
	ViewEncapsulation,
} from "@angular/core";

@Component({
	selector: "lib-list-body-row",
	standalone: true,
	templateUrl: "./list-body-row.component.html",
	styleUrls: ["./list-body-row.component.scss"],
	encapsulation: ViewEncapsulation.None,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListBodyRowComponent {
	@Input() tabindex: string | null = null;

	@Input({ transform: booleanAttribute }) selected = false;
}
