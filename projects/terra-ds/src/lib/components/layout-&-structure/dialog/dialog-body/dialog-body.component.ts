import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "lib-dialog-body",
	templateUrl: "./dialog-body.component.html",
	styleUrls: ["./dialog-body.component.scss"],
	standalone: true,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogBodyComponent {}
