import { Component, HostBinding, input } from "@angular/core";
import { IconComponent, type IconNameType } from "../../layout-&-structure";

export type HelperColor =
	| "neutral"
	| "informative"
	| "warning"
	| "positive"
	| "negative";

export type HelperType = "helper" | "inline_message";

const DEFAULT_ICON_BY_COLOR: Record<HelperColor, IconNameType> = {
	neutral: "Info",
	informative: "Info",
	warning: "WarningCircle",
	positive: "CheckCircle",
	negative: "XCircle",
};

@Component({
	selector: "lib-helper",
	templateUrl: "./helper.component.html",
	styleUrls: ["./helper.component.scss"],
	standalone: true,
	imports: [IconComponent],
	host: { "data-terra-ds": "" },
})
export class HelperComponent {
	color = input<HelperColor>("neutral");
	text = input("");
	description = input("");
	type = input<HelperType>("helper");

	get icon(): IconNameType {
		return DEFAULT_ICON_BY_COLOR[this.color()];
	}

	@HostBinding("class") get hostClasses(): string {
		return `helper-container helper-color-${this.color()} helper-type-${this.type()}`;
	}
}
