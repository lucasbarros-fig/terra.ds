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

export type IconButtonType = "branding" | "neutral";
export type IconButtonSemantic = IconButtonType;
export type IconButtonVariant = "filled" | "ghost" | "bare";
export type IconButtonSize = "default" | "small";
export type IconButtonNativeType = "button" | "submit" | "reset";

@Component({
	selector: "lib-icon-button",
	templateUrl: "./icon-button.component.html",
	styleUrls: ["./icon-button.component.scss"],
	standalone: true,
	host: { "data-terra-ds": "" },
	imports: [IconComponent, SpinnerComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
	readonly type = input<IconButtonType>("branding");
	readonly variant = input<IconButtonVariant>("filled");
	readonly size = input<IconButtonSize>("default");
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly icon = input<IconNameType>("DiamondsFour");
	readonly loading = input(false, { transform: booleanAttribute });
	readonly ariaLabel = input("");
	readonly nativeType = input<IconButtonNativeType>("button");

	readonly clicked = output<MouseEvent>();

	readonly rootClass = computed(() => {
		return [
			"icon-button-root",
			`type-${this.type()}`,
			`variant-${this.variant()}`,
			`size-${this.size()}`,
			this.disabled() || this.loading() ? "is-disabled" : "",
			this.loading() ? "is-loading" : "",
		]
			.filter(Boolean)
			.join(" ");
	});

	readonly iconSizeBinding = computed<IconSizeType>(() =>
		this.size() === "small" ? 16 : 20,
	);

	onClick(event: MouseEvent): void {
		if (this.disabled() || this.loading()) {
			event.preventDefault();
			event.stopImmediatePropagation();
			return;
		}
		this.clicked.emit(event);
	}
}
