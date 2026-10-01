import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from "@angular/core";

@Component({
	selector: "lib-list-header",
	standalone: true,
	templateUrl: "./list-header.component.html",
	styleUrls: ["./list-header.component.scss"],
	encapsulation: ViewEncapsulation.None,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHeaderComponent {}
