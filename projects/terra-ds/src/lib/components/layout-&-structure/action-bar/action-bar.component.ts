import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from "@angular/core";

@Component({
	selector: "lib-action-bar",
	templateUrl: "./action-bar.component.html",
	styleUrls: ["./action-bar.component.scss"],
	standalone: true,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBarComponent {
	@ViewChild("actionBar", { read: ElementRef })
	private footerRef?: ElementRef<HTMLElement>;

	@Input() maxWidth = "";

	@Input({ transform: booleanAttribute }) fixedToViewport = true;

	get maxWidthToken(): string | null {
		const v = this.maxWidth?.trim();
		return v ? v : null;
	}

	layoutPositionElement(): HTMLElement | undefined {
		return this.footerRef?.nativeElement;
	}
}
