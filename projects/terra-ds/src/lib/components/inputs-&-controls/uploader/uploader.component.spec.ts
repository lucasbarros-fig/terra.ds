import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UploaderComponent } from "./uploader.component";

describe("UploaderComponent", () => {
	let component: UploaderComponent;
	let fixture: ComponentFixture<UploaderComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [UploaderComponent],
		});
		fixture = TestBed.createComponent(UploaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	function getDropzone(): HTMLElement | null {
		return fixture.nativeElement.querySelector(".uploader-dropzone");
	}

	function getNativeInput(): HTMLInputElement | null {
		return fixture.nativeElement.querySelector(".uploader-input");
	}

	function getHelper(): HTMLElement | null {
		return fixture.nativeElement.querySelector("lib-helper");
	}

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should render the default label and caption texts", () => {
		const label = fixture.nativeElement.querySelector(".uploader-label");
		const caption = fixture.nativeElement.querySelector(".uploader-caption");

		expect(label?.textContent).toContain("Arraste ou selecione um arquivo");
		expect(caption?.textContent).toContain("JPG, JPEG ou PNG");
		expect(caption?.textContent).toContain("10 MB");
	});

	it("should not render the additional label by default", () => {
		const caption = fixture.nativeElement.querySelector(".uploader-caption");
		expect(caption?.textContent).not.toContain("000x000");
	});

	it("should render the additional label when showAdditionalLabel is true", () => {
		fixture.componentRef.setInput("showAdditionalLabel", true);
		fixture.detectChanges();

		const caption = fixture.nativeElement.querySelector(".uploader-caption");
		expect(caption?.textContent).toContain("000x000");
	});

	it("should add is-disabled class to dropzone when disabled is true", () => {
		fixture.componentRef.setInput("disabled", true);
		fixture.detectChanges();

		expect(getDropzone()?.classList.contains("is-disabled")).toBe(true);
		expect(getDropzone()?.getAttribute("tabindex")).toBe("-1");
	});

	it("should add is-error class to dropzone when error is true", () => {
		fixture.componentRef.setInput("error", true);
		fixture.detectChanges();

		expect(getDropzone()?.classList.contains("is-error")).toBe(true);
	});

	it("should show helper text when error is true and helperText is provided", () => {
		fixture.componentRef.setInput("error", true);
		fixture.componentRef.setInput("helperText", "Arquivo inválido");
		fixture.detectChanges();

		const helper = getHelper();
		expect(helper).toBeTruthy();
		expect(helper?.textContent).toContain("Arquivo inválido");
	});

	it("should not show helper text when error is false", () => {
		fixture.componentRef.setInput("error", false);
		fixture.detectChanges();

		expect(getHelper()).toBeNull();
	});

	it("should not open the native file dialog when disabled", () => {
		fixture.componentRef.setInput("disabled", true);
		fixture.detectChanges();

		const input = getNativeInput();
		const clickSpy = vi.spyOn(input as HTMLInputElement, "click");

		component["openFileDialog"]();

		expect(clickSpy).not.toHaveBeenCalled();
	});

	it("should open the native file dialog when not disabled", () => {
		const input = getNativeInput();
		const clickSpy = vi.spyOn(input as HTMLInputElement, "click");

		component["openFileDialog"]();

		expect(clickSpy).toHaveBeenCalled();
	});

	it("should not emit filesSelected when the native input changes with no files", () => {
		const spy = vi.fn();
		component.filesSelected.subscribe(spy);

		const input = getNativeInput() as HTMLInputElement;
		input.dispatchEvent(new Event("change"));

		expect(spy).not.toHaveBeenCalled();
	});

	function createFileList(files: File[]): FileList {
		const fileList = {
			length: files.length,
			item: (index: number) => files[index] ?? null,
			[Symbol.iterator]: () => files[Symbol.iterator](),
		};
		files.forEach((file, index) => {
			(fileList as unknown as Record<number, File>)[index] = file;
		});
		return fileList as unknown as FileList;
	}

	function setInputFiles(files: File[]): HTMLInputElement {
		const input = getNativeInput() as HTMLInputElement;
		Object.defineProperty(input, "files", {
			value: createFileList(files),
			configurable: true,
		});
		return input;
	}

	it("should show a size error helper and not emit files when a selected file exceeds maxSizeBytes", () => {
		fixture.componentRef.setInput("maxSizeBytes", 1024);
		fixture.detectChanges();

		const spy = vi.fn();
		component.filesSelected.subscribe(spy);

		const oversizedFile = new File([new Uint8Array(2048)], "big.png", {
			type: "image/png",
		});
		const input = setInputFiles([oversizedFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(spy).toHaveBeenCalledWith(null);
		expect(getDropzone()?.classList.contains("is-error")).toBe(true);
		expect(getHelper()?.textContent).toContain(
			"Arquivo maior que o permitido",
		);
	});

	it("should show a type error helper and not emit files when a file does not match allowedTypes", () => {
		fixture.componentRef.setInput("allowedTypes", [".pdf"]);
		fixture.detectChanges();

		const spy = vi.fn();
		component.filesSelected.subscribe(spy);

		const wrongTypeFile = new File([new Uint8Array(10)], "image.png", {
			type: "image/png",
		});
		const input = setInputFiles([wrongTypeFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(spy).toHaveBeenCalledWith(null);
		expect(getDropzone()?.classList.contains("is-error")).toBe(true);
		expect(getHelper()?.textContent).toContain(
			"Tipo de arquivo não permitido",
		);
	});

	it("should accept a file matching allowedTypes by extension", () => {
		fixture.componentRef.setInput("allowedTypes", [".pdf"]);
		fixture.detectChanges();

		const spy = vi.fn();
		component.filesSelected.subscribe(spy);

		const pdfFile = new File([new Uint8Array(10)], "document.pdf", {
			type: "application/pdf",
		});
		const input = setInputFiles([pdfFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(spy).toHaveBeenCalledWith([pdfFile]);
		expect(getDropzone()?.classList.contains("is-error")).toBe(false);
	});

	it("should accept a file matching allowedTypes by MIME wildcard", () => {
		fixture.componentRef.setInput("allowedTypes", ["image/*"]);
		fixture.detectChanges();

		const imageFile = new File([new Uint8Array(10)], "photo.png", {
			type: "image/png",
		});
		const input = setInputFiles([imageFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(getDropzone()?.classList.contains("is-error")).toBe(false);
	});

	it("should expose allowedTypes as the native accept attribute", () => {
		fixture.componentRef.setInput("allowedTypes", [".pdf", "image/*"]);
		fixture.detectChanges();

		expect(getNativeInput()?.getAttribute("accept")).toBe(".pdf,image/*");
	});

	it("should emit the files and clear the size error when the file is within maxSizeBytes", () => {
		fixture.componentRef.setInput("maxSizeBytes", 1024);
		fixture.detectChanges();

		const spy = vi.fn();
		component.filesSelected.subscribe(spy);

		const validFile = new File([new Uint8Array(512)], "small.png");
		const input = setInputFiles([validFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(spy).toHaveBeenCalledWith([validFile]);
		expect(getDropzone()?.classList.contains("is-error")).toBe(false);
		expect(getHelper()).toBeNull();
	});

	it("should add newly selected files to the previous selection when multiple is true", () => {
		fixture.componentRef.setInput("multiple", true);
		fixture.detectChanges();

		const spy = vi.fn();
		component.filesSelected.subscribe(spy);

		const firstFile = new File([new Uint8Array(10)], "first.png");
		const secondFile = new File([new Uint8Array(10)], "second.png");

		const input = setInputFiles([firstFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		setInputFiles([secondFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(spy).toHaveBeenNthCalledWith(1, [firstFile]);
		expect(spy).toHaveBeenNthCalledWith(2, [firstFile, secondFile]);
	});

	it("should replace the previous selection with the new file when multiple is false", () => {
		const spy = vi.fn();
		component.filesSelected.subscribe(spy);

		const firstFile = new File([new Uint8Array(10)], "first.png");
		const secondFile = new File([new Uint8Array(10)], "second.png");

		const input = setInputFiles([firstFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		setInputFiles([secondFile]);
		input.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(spy).toHaveBeenNthCalledWith(1, [firstFile]);
		expect(spy).toHaveBeenNthCalledWith(2, [secondFile]);
	});

	it("should validate dropped files against maxSizeBytes", () => {
		fixture.componentRef.setInput("maxSizeBytes", 1024);
		fixture.detectChanges();

		const spy = vi.fn();
		component.filesSelected.subscribe(spy);

		const dropEvent = new Event("drop") as DragEvent;
		Object.defineProperty(dropEvent, "dataTransfer", {
			value: { files: createFileList([new File([new Uint8Array(2048)], "big.png")]) },
		});

		getDropzone()?.dispatchEvent(dropEvent);
		fixture.detectChanges();

		expect(spy).toHaveBeenCalledWith(null);
		expect(getDropzone()?.classList.contains("is-error")).toBe(true);
	});
});
