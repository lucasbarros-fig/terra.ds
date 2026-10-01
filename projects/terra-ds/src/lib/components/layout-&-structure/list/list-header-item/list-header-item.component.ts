import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewEncapsulation,
} from "@angular/core";
import { NgIf } from "@angular/common";
import { IconComponent, type IconNameType } from "../../icon/icon.component";
import type { IconSizeType, IconColorType } from "../../icon/utils/theme";
import { TooltipComponent } from "../../tooltip/tooltip.component";

@Component({
	selector: "lib-list-header-item",
	standalone: true,
	imports: [NgIf, IconComponent, TooltipComponent],
	templateUrl: "./list-header-item.component.html",
	styleUrls: ["./list-header-item.component.scss"],
	encapsulation: ViewEncapsulation.None,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHeaderItemComponent {
	@Input() width?: string;

	@Input() weight?: 1 | 2 | 3 | 4;

	@Input() align: "left" | "center" | "right" = "left";

	@Input() sortable = false;

	@Input() icon?: IconNameType;

	@Input() iconSize: IconSizeType = 12;

	@Input() iconColor: IconColorType = "inherit";

	@Input() iconPosition: "before" | "after" = "after";

	@Input() tooltip = "";

	get computedWidth(): string | undefined {
		if (this.weight !== undefined) return `${this.weight * 25}%`;
		return this.width;
	}
}
