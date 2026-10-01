import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	output,
	signal,
} from "@angular/core";
import { IconButtonComponent } from "../../actions/icon-button/icon-button.component";
import {
	StatusComponent,
	type StatusColor,
} from "../../feedback/status/status.component";
import { IconComponent, type IconNameType } from "../icon/icon.component";
import type { TerraAccordionGroup } from "../accordion-group/accordion-group.tokens";

let accordionIdSeq = 0;

@Component({
	selector: "lib-accordion",
	templateUrl: "./accordion.component.html",
	styleUrls: ["./accordion.component.scss"],
	standalone: true,
	host: {
		"data-terra-ds": "",
		"[class]": "hostClass()",
	},
	imports: [IconComponent, IconButtonComponent, StatusComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
	readonly accordionId = `lib-accordion-${++accordionIdSeq}`;

	readonly label = input("Title");
	readonly icon = input<IconNameType>("DiamondsFour");
	readonly showIcon = input(true, { transform: booleanAttribute });
	readonly showStatus = input(false, { transform: booleanAttribute });
	readonly statusColor = input<StatusColor>("disabled");
	readonly statusText = input("");
	readonly open = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });

	readonly openChange = output<boolean>();

	private readonly group = signal<TerraAccordionGroup | null>(null);

	readonly isExpanded = computed(() => {
		const activeGroup = this.group();
		if (activeGroup) {
			return activeGroup.isItemOpen(this.accordionId);
		}
		return this.open();
	});

	readonly hostClass = computed(() =>
		[
			"accordion-host",
			this.isExpanded() ? "is-open" : "",
			this.disabled() ? "is-disabled" : "",
		]
			.filter(Boolean)
			.join(" "),
	);

	readonly iconColor = computed(() =>
		this.disabled() ? "essential-disabled" : "essential-high",
	);

	/** Chamado pelo `lib-accordion-group` via contentChildren. */
	bindGroup(group: TerraAccordionGroup): void {
		this.group.set(group);
	}

	toggle(): void {
		if (this.disabled()) return;

		const activeGroup = this.group();
		if (activeGroup) {
			activeGroup.requestToggle(this.accordionId);
			return;
		}

		this.openChange.emit(!this.open());
	}

	onHeadClick(event: MouseEvent): void {
		event.preventDefault();
		this.toggle();
	}

	onHeadKeydown(event: KeyboardEvent): void {
		if (event.key !== "Enter" && event.key !== " ") return;
		event.preventDefault();
		this.toggle();
	}

	onToggleClick(event: MouseEvent): void {
		event.stopPropagation();
		this.toggle();
	}
}
