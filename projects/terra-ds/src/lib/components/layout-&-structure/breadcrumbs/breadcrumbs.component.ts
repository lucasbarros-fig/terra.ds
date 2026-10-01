import { CommonModule } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { IconComponent } from "../../layout-&-structure";

export interface BreadcrumbItem {
	label: string;
	link?: string;
}

interface BreadcrumbDisplayItem extends BreadcrumbItem {
	isEllipsis?: boolean;
	isCurrent?: boolean;
}

const DESKTOP_MAX_VISIBLE = 4;
const MOBILE_MAX_VISIBLE = 3;
const ELLIPSIS_ITEM: BreadcrumbDisplayItem = {
	label: "...",
	isEllipsis: true,
};

function markCurrent(item: BreadcrumbItem): BreadcrumbDisplayItem {
	return { ...item, isCurrent: true };
}

@Component({
	selector: "lib-breadcrumbs",
	templateUrl: "./breadcrumbs.component.html",
	styleUrls: ["./breadcrumbs.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, IconComponent],
})
export class BreadcrumbsComponent {
	@Input() breadcrumbItems: BreadcrumbItem[] = [];
	@Input() mobile = false;

	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);

	get displayItems(): BreadcrumbDisplayItem[] {
		const items = this.breadcrumbItems;
		if (!items?.length) return [];

		const lastIndex = items.length - 1;

		if (this.mobile) {
			if (items.length > MOBILE_MAX_VISIBLE) {
				return [items[0], ELLIPSIS_ITEM, markCurrent(items[lastIndex])];
			}
			return items.map((item, i) =>
				i === lastIndex ? markCurrent(item) : item,
			);
		}

		if (items.length > DESKTOP_MAX_VISIBLE) {
			return [
				...items.slice(0, DESKTOP_MAX_VISIBLE),
				ELLIPSIS_ITEM,
				markCurrent(items[lastIndex]),
			];
		}

		return items.map((item, i) => (i === lastIndex ? markCurrent(item) : item));
	}

	protected trackByItem(_: number, item: BreadcrumbDisplayItem): string {
		return `${item.label}-${item.link ?? ""}`;
	}

	protected navigateRoute(route: string | undefined): void {
		if (!route) {
			console.warn("Rota não especificada");
			return;
		}

		if (route.includes(":")) {
			const url = this.router.url.split("?")[0];
			this.router.navigate([url], {
				queryParams: this.activatedRoute.snapshot.queryParams,
			});
			return;
		}

		this.router.navigate([route]);
	}
}
