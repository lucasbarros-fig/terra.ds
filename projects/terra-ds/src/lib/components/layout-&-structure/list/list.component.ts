import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewEncapsulation,
} from "@angular/core";

@Component({
	selector: "lib-list",
	standalone: true,
	templateUrl: "./list.component.html",
	styleUrls: ["./list.component.scss"],
	encapsulation: ViewEncapsulation.None,
	host: { "data-terra-ds": "" },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
	@Input() striped = true;

	@Input() hoverable = true;

	/**
	 * Padrão do DS: abaixo de 900px de largura (mobile/tablet) cada linha vira um cartão —
	 * célula `kind="title"` no cabeçalho, ações no "⋯" e as demais como rótulo/valor.
	 */
	@Input() responsive = true;
}
