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
	selector: "lib-list-body-cell",
	standalone: true,
	imports: [NgIf, IconComponent, TooltipComponent],
	templateUrl: "./list-body-cell.component.html",
	styleUrls: ["./list-body-cell.component.scss"],
	encapsulation: ViewEncapsulation.None,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListBodyCellComponent {
	@Input() align: "left" | "center" | "right" = "left";

	@Input() colspan: number | null = null;

	@Input() icon?: IconNameType;

	@Input() iconSize: IconSizeType = 12;

	@Input() iconColor: IconColorType = "inherit";

	@Input() iconPosition: "before" | "after" = "before";

	@Input() tooltip = "";

	/** Rótulo mostrado no layout compacto (cartão), antes do valor. Ex.: "CPF". */
	@Input() label = "";

	/**
	 * Papel da célula no layout compacto (mobile/tablet):
	 * - `title`: vira o cabeçalho do cartão;
	 * - `actions`: fica no canto do cabeçalho; só o último elemento (o "⋯") aparece —
	 *   os demais devem ter a classe `lib-list-action-inline` e entrar também no menu.
	 */
	@Input() kind: "default" | "title" | "actions" = "default";

	protected syncOverflowTitle(el: HTMLElement): void {
		const text = (el.textContent ?? "").trim();

		if (text && el.scrollWidth > el.clientWidth) el.title = text;
		else el.removeAttribute("title");
	}
}
