import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	output,
} from "@angular/core";
import {
	IconComponent,
	type IconNameType,
} from "../../layout-&-structure/icon/icon.component";
import type { IconSizeType } from "../../layout-&-structure/icon/utils/theme";
import { SpinnerComponent } from "../../layout-&-structure/spinner/spinner.component";

export type ButtonIntent =
	| "branding"
	| "neutral"
	| "positive"
	| "warning"
	| "negative"
	| "informative";

export type ButtonVariant = "filled" | "ghost" | "bare";

export type ButtonNativeType = "button" | "submit" | "reset";

@Component({
	selector: "lib-button",
	templateUrl: "./button.component.html",
	styleUrls: ["./button.component.scss"],
	standalone: true,
	host: {
		"data-terra-ds": "",
		"[class]": "hostClass()",
	},
	imports: [IconComponent, SpinnerComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
	readonly intent = input<ButtonIntent>("branding");
	readonly variant = input<ButtonVariant>("filled");
	readonly selected = input(false, { transform: booleanAttribute });
	readonly highlight = input(false, { transform: booleanAttribute });
	readonly highlightLabel = input("Highlight");
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly fullWidth = input(false, { transform: booleanAttribute });
	readonly label = input("");

	readonly showIcon = input(true, { transform: booleanAttribute });
	readonly iconSize = input<IconSizeType>(20);
	readonly icon = input<IconNameType>("");
	readonly loading = input(false, { transform: booleanAttribute });
	readonly nativeType = input<ButtonNativeType>("button");
	readonly ariaLabel = input<string | undefined>(undefined);

	readonly clicked = output<MouseEvent>();

	readonly hostClass = computed(() => {
		const classes = [`intent-${this.intent()}`, `variant-${this.variant()}`];
		if (this.selected()) classes.push("is-selected");
		if (this.highlight()) classes.push("is-highlight");
		if (this.disabled() || this.loading()) classes.push("is-disabled");
		if (this.fullWidth()) classes.push("is-full-width");
		if (this.loading()) classes.push("is-loading");
		return classes.join(" ");
	});

	onClick(event: MouseEvent): void {
		if (this.disabled() || this.loading()) {
			event.preventDefault();
			event.stopImmediatePropagation();
			return;
		}
		this.clicked.emit(event);
	}
}
