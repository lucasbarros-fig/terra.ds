import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import type { IconSizeType } from "../icon/utils/theme";

@Component({
	selector: "lib-spinner",
	templateUrl: "./spinner.component.html",
	styleUrls: ["./spinner.component.scss"],
	standalone: true,
	host: {
		"data-terra-ds": "",
		"[style.--lib-spinner-size]": "sizeInPx()",
		"[attr.role]": "ariaLabel() ? 'status' : null",
		"[attr.aria-label]": "ariaLabel() || null",
		"[attr.aria-hidden]": "ariaLabel() ? null : 'true'",
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
	readonly size = input<IconSizeType>(20);
	readonly ariaLabel = input<string | undefined>(undefined);
	
	readonly sizeInPx = computed(() => `${this.size()}px`);
}
