import { NgIf, NgTemplateOutlet } from "@angular/common";
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	Output,
} from "@angular/core";
import { TooltipComponent } from "../../tooltip/tooltip.component";

import type {
	CalendarDayCellKind,
	CalendarDayContext,
	CalendarDaySelected,
} from "./calendar-day.types";

export type {
	CalendarDayCellKind,
	CalendarDayContext,
	CalendarDaySelected,
} from "./calendar-day.types";

@Component({
	selector: "lib-calendar-day",
	templateUrl: "./calendar-day.component.html",
	styleUrls: ["./calendar-day.component.scss"],
	standalone: true,
	imports: [NgIf, NgTemplateOutlet, TooltipComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { "data-terra-ds": "" },
})
export class CalendarDayComponent {
	@Input() label = "";
	@Input() sublabel = "";
	@Input({ transform: booleanAttribute }) disabled = false;
	@Input({ transform: booleanAttribute }) today = false;
	@Input() context: CalendarDayContext = "current";
	@Input() selected: CalendarDaySelected = "none";
	@Input() cellKind: CalendarDayCellKind = "day";
	@Input() description = "";
	@Input({ transform: booleanAttribute }) readOnly = false;

	@Output() readonly activate = new EventEmitter<void>();

	@HostBinding("class")
	get hostLayoutClass(): string {
		return [
			"calendar-day-host",
			`calendar-day-kind-${this.cellKind}`,
			this.sublabelVisible ? "calendar-day-has-sublabel" : "",
			this.descriptionVisible ? "calendar-day-has-description" : "",
		]
			.filter(Boolean)
			.join(" ");
	}

	get descriptionVisible(): boolean {
		return this.cellKind === "day" && this.description.trim().length > 0;
	}

	get sublabelVisible(): boolean {
		return this.sublabel.trim().length > 0;
	}

	get rootClass(): string {
		return [
			"calendar-day-root",
			this.disabled ? "is-disabled" : "",
			this.readOnly ? "is-readonly" : "",
			this.today ? "is-today" : "",
			`context-${this.context}`,
			`selected-${this.selected}`,
		]
			.filter(Boolean)
			.join(" ");
	}

	onClick(): void {
		if (this.disabled || this.readOnly) return;
		this.activate.emit();
	}
}
