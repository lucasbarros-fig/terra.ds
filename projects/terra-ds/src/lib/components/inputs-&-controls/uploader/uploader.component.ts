import { NgIf } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	input,
	output,
	signal,
	ViewChild,
} from "@angular/core";
import { HelperComponent } from "../../feedback/helper/helper.component";
import {
	IconComponent,
	type IconNameType,
} from "../../layout-&-structure/icon/icon.component";

@Component({
	selector: "lib-uploader",
	standalone: true,
	imports: [NgIf, IconComponent, HelperComponent],
	templateUrl: "./uploader.component.html",
	styleUrls: ["./uploader.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { "data-terra-ds": "" },
})
export class UploaderComponent {
	readonly label = input("Arraste ou selecione um arquivo");
	readonly acceptedTypes = input("JPG, JPEG ou PNG");
	readonly maxSize = input("10 MB");
	readonly showAdditionalLabel = input(false);
	readonly additionalLabel = input("000x000");
	readonly icon = input<IconNameType>("TrayArrowUp");

	readonly disabled = input(false);
	readonly error = input(false);
	readonly helperText = input("Helper");

	readonly maxSizeBytes = input(10 * 1024 * 1024);
	readonly allowedTypes = input<string[]>([]);

	readonly multiple = input(false);
	readonly inputAriaLabel = input("");

	readonly filesSelected = output<File[] | null>();

	@ViewChild("fileInput") private fileInputRef?: ElementRef<HTMLInputElement>;

	protected readonly isDragging = signal(false);
	protected readonly sizeError = signal(false);
	protected readonly typeError = signal(false);
	private selectedFiles: File[] = [];

	protected readonly displayError = computed(
		() => this.error() || this.sizeError() || this.typeError(),
	);

	protected readonly displayHelperText = computed(() => {
		if (this.typeError()) {
			return `Tipo de arquivo não permitido (aceitos: ${this.acceptedTypes()}).`;
		}
		if (this.sizeError()) {
			return `Arquivo maior que o permitido (máx. ${this.maxSize()}).`;
		}
		return this.helperText();
	});

	protected readonly computedAccept = computed(() =>
		this.allowedTypes().join(","),
	);

	protected openFileDialog(): void {
		if (this.disabled()) return;
		this.fileInputRef?.nativeElement.click();
	}

	protected onKeydown(event: KeyboardEvent): void {
		if (this.disabled()) return;
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			this.openFileDialog();
		}
	}

	protected onFileChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.handleFiles(input.files);
		input.value = "";
	}

	protected onDragEnter(event: DragEvent): void {
		if (this.disabled()) return;
		event.preventDefault();
		this.isDragging.set(true);
	}

	protected onDragOver(event: DragEvent): void {
		if (this.disabled()) return;
		event.preventDefault();
	}

	protected onDragLeave(event: DragEvent): void {
		if (this.disabled()) return;
		event.preventDefault();
		this.isDragging.set(false);
	}

	protected onDrop(event: DragEvent): void {
		this.isDragging.set(false);
		if (this.disabled()) return;
		event.preventDefault();
		this.handleFiles(event.dataTransfer?.files ?? null);
	}

	private isFileTypeAllowed(file: File): boolean {
		const allowedTypes = this.allowedTypes();
		if (allowedTypes.length === 0) return true;

		const fileName = file.name.toLowerCase();
		const fileType = file.type.toLowerCase();

		return allowedTypes.some((type) => {
			const normalized = type.toLowerCase();
			if (normalized.startsWith(".")) return fileName.endsWith(normalized);
			if (normalized.endsWith("/*"))
				return fileType.startsWith(normalized.slice(0, -1));
			return fileType === normalized;
		});
	}

	private handleFiles(files: FileList | null): void {
		const incoming = files ? Array.from(files) : [];
		if (incoming.length === 0) return;

		const hasInvalidType = incoming.some(
			(file) => !this.isFileTypeAllowed(file),
		);
		const hasOversizedFile = incoming.some(
			(file) => file.size > this.maxSizeBytes(),
		);
		this.typeError.set(hasInvalidType);
		this.sizeError.set(hasOversizedFile);

		if (hasInvalidType || hasOversizedFile) {
			this.filesSelected.emit(null);
			return;
		}

		this.selectedFiles = this.multiple()
			? [...this.selectedFiles, ...incoming]
			: incoming;
		this.filesSelected.emit(this.selectedFiles);
	}
}
