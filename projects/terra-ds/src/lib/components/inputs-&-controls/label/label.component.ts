import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import type { IconNameType } from "../../layout-&-structure/icon/icon.component";
import type { IconColorType } from "../../layout-&-structure/icon/utils/theme";
import { SkeletonComponent } from "../../layout-&-structure/skeleton/skeleton.component";
import {
	type TooltipArrow,
	TooltipComponent,
	type TooltipIndicator,
} from "../../layout-&-structure/tooltip/tooltip.component";

@Component({
	selector: "lib-label",
	templateUrl: "./label.component.html",
	styleUrls: ["./label.component.scss"],
	host: { "data-terra-ds": "" },
	imports: [TooltipComponent, SkeletonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
	readonly optional = input(false);
	readonly skeleton = input(false);
	readonly description = input("");
	readonly tooltipText = input("");
	readonly tooltipArrow = input<TooltipArrow>("start");
	readonly tooltipIndicator = input<TooltipIndicator>("right");
	readonly tooltipIcon = input<IconNameType>("Info");
	readonly tooltipIconColor = input<IconColorType>("var(--color-icons-essential-high)");

	readonly hasDescription = computed(() => !!this.description()?.trim());
	readonly hasTooltip = computed(() => !!this.tooltipText()?.trim());
}
