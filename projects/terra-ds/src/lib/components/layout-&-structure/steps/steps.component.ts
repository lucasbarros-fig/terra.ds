import { NgFor, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";

export type StepsSizeType = "small" | "medium" | "large";

@Component({
	selector: "lib-steps",
	templateUrl: "./steps.component.html",
	styleUrls: ["./steps.component.scss"],
	standalone: true,
	host: { "data-terra-ds": "" },
	imports: [NgFor, NgIf],
})
export class StepsComponent {
	@Input() label?: string | string[];
	@Input() total = 1;
	@Input() current = 0;
	@Input() showNumber = true;

	get steps(): number[] {
		return Array.from({ length: this.total }, (_, i) => i);
	}

	get currentLabel(): string | undefined {
		if (!this.label) return undefined;
		return Array.isArray(this.label) ? this.label[this.current] : this.label;
	}

	isActive(index: number): boolean {
		return index < this.current;
	}
}
