import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	contentChildren,
	effect,
	inject,
	Injector,
	signal,
} from "@angular/core";
import { AccordionComponent } from "../accordion/accordion.component";
import type { TerraAccordionGroup } from "./accordion-group.tokens";

@Component({
	selector: "lib-accordion-group",
	templateUrl: "./accordion-group.component.html",
	styleUrls: ["./accordion-group.component.scss"],
	standalone: true,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionGroupComponent implements TerraAccordionGroup {
	private readonly items = contentChildren(AccordionComponent);
	private readonly openId = signal<string | null>(null);
	private readonly injector = inject(Injector);
	private initialSyncDone = false;

	constructor() {
		effect(() => {
			const items = this.items();
			for (const item of items) {
				item.bindGroup(this);
			}
		});

		afterNextRender(
			() => {
				if (this.initialSyncDone) return;
				this.initialSyncDone = true;

				const items = this.items();
				const initiallyOpen = items.find((item) => item.open());
				if (initiallyOpen) {
					this.openId.set(initiallyOpen.accordionId);
					this.syncOpenChange(initiallyOpen.accordionId);
				}
			},
			{ injector: this.injector },
		);
	}

	isItemOpen(accordionId: string): boolean {
		return this.openId() === accordionId;
	}

	requestToggle(accordionId: string): void {
		const items = this.items();
		const target = items.find((item) => item.accordionId === accordionId);
		if (!target || target.disabled()) return;

		const nextId = this.openId() === accordionId ? null : accordionId;
		this.openId.set(nextId);
		this.syncOpenChange(nextId);
	}

	private syncOpenChange(nextId: string | null): void {
		for (const item of this.items()) {
			const shouldBeOpen = item.accordionId === nextId;
			item.openChange.emit(shouldBeOpen);
		}
	}
}
