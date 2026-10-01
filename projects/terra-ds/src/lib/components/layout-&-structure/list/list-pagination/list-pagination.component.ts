import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Output,
	ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconComponent } from "../../icon/icon.component";
import { IconButtonComponent } from "../../../actions/icon-button/icon-button.component";
import { DropdownComponent } from "../../dropdown/dropdown.component";
import { DropdownItemComponent } from "../../dropdown/components/dropdown-item/dropdown-item.component";
import { DropdownTriggerDirective } from "../../dropdown/directives/dropdown-trigger.directive";

@Component({
	selector: "lib-list-pagination",
	standalone: true,
	imports: [
		CommonModule,
		IconComponent,
		IconButtonComponent,
		DropdownComponent,
		DropdownItemComponent,
		DropdownTriggerDirective,
	],
	templateUrl: "./list-pagination.component.html",
	styleUrls: ["./list-pagination.component.scss"],
	encapsulation: ViewEncapsulation.None,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPaginationComponent {
	@Input() label = "Visualizar por página";

	@Input() pageSize = 10;

	@Input() pageSizeOptions: number[] = [10, 25, 50, 100];

	@Input() total = 0;

	@Input() page = 1;

	@Output() pageSizeChange = new EventEmitter<number>();

	@Output() pageChange = new EventEmitter<number>();

	protected isDropdownOpen = false;

	constructor(private readonly cdr: ChangeDetectorRef) {}

	get totalPages(): number {
		if (this.total <= 0 || this.pageSize <= 0) return 1;
		return Math.max(1, Math.ceil(this.total / this.pageSize));
	}

	get rangeStart(): number {
		if (this.total <= 0) return 0;
		return (this.page - 1) * this.pageSize + 1;
	}

	get rangeEnd(): number {
		return Math.min(this.page * this.pageSize, this.total);
	}

	get canPrev(): boolean {
		return this.page > 1;
	}

	get canNext(): boolean {
		return this.page < this.totalPages;
	}

	get displayPageSizeOptions(): number[] {
		return [...this.pageSizeOptions].reverse();
	}

	selectPageSize(size: number): void {
		if (size !== this.pageSize) {
			this.pageSize = size;
			this.pageSizeChange.emit(size);
			if (this.page > this.totalPages) {
				this.page = this.totalPages;
				this.pageChange.emit(this.page);
			}
			this.cdr.markForCheck();
		}
	}

	goPrev(): void {
		if (!this.canPrev) return;
		this.page = this.page - 1;
		this.pageChange.emit(this.page);
	}

	goNext(): void {
		if (!this.canNext) return;
		this.page = this.page + 1;
		this.pageChange.emit(this.page);
	}
}
