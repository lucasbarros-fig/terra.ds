import { Component, HostBinding, input, output } from "@angular/core";
import {
	DivisorComponent,
	IconComponent,
	type IconNameType,
} from "../../layout-&-structure";

export type ToastState = "success" | "error" | "warning" | "informative";

const STATE_LABELS: Record<ToastState, string> = {
	success: "Sucesso",
	error: "Erro",
	warning: "Atenção",
	informative: "Informação",
};

const DEFAULT_ICON_BY_COLOR: Record<ToastState, IconNameType> = {
	success: "CheckCircle",
	error: "XCircle",
	warning: "Warning",
	informative: "Info",
};

@Component({
	selector: "lib-toast",
	standalone: true,
	imports: [IconComponent, DivisorComponent],
	templateUrl: "./toast.component.html",
	styleUrls: ["./toast.component.scss"],
	host: { "data-terra-ds": "" },
})
export class ToastComponent {
	state = input<ToastState>("success");
	label = input("");
	stateLabel = input("");
	icon = input<IconNameType>();

	closed = output<void>();

	@HostBinding("class") get hostClass(): string {
		return `toast-state-${this.state()}`;
	}

	get resolvedIcon(): IconNameType {
		return this.icon() ?? DEFAULT_ICON_BY_COLOR[this.state()];
	}

	get resolvedStateLabel(): string {
		return this.stateLabel() || STATE_LABELS[this.state()];
	}

	close(): void {
		this.closed.emit();
	}
}
