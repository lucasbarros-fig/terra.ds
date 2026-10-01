import type { ComponentFixture } from "@angular/core/testing";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { AccordionComponent } from "./accordion.component";

@Component({
	standalone: true,
	imports: [AccordionComponent],
	template: `
		<lib-accordion
			[label]="label"
			[icon]="icon"
			[showIcon]="showIcon"
			[showStatus]="showStatus"
			[statusColor]="statusColor"
			[statusText]="statusText"
			[(open)]="open"
			[disabled]="disabled"
		>
			<div class="projected">Conteúdo projetado</div>
		</lib-accordion>
	`,
})
class AccordionHostComponent {
	label = "Title";
	icon = "DiamondsFour";
	showIcon = true;
	open = false;
	disabled = false;
	showStatus = false;
	statusColor: "positive" | "negative" | "informative" | "warning" | "neutral" | "disabled" =
		"disabled";
	statusText = "Não enviado";
}

describe("AccordionComponent", () => {
	let host: AccordionHostComponent;
	let fixture: ComponentFixture<AccordionHostComponent>;
	let accordion: AccordionComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AccordionHostComponent],
		});
		fixture = TestBed.createComponent(AccordionHostComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
		accordion = fixture.debugElement.query(
			By.directive(AccordionComponent),
		).componentInstance;
	});

	it("should create", () => {
		expect(accordion).toBeTruthy();
	});

	it("should render the label", () => {
		host.label = "Seção";
		fixture.detectChanges();

		const labelEl: HTMLElement | null =
			fixture.nativeElement.querySelector(".accordion-label");
		expect(labelEl?.textContent?.trim()).toBe("Seção");
	});

	it("should render the leading icon when showIcon is true", () => {
		expect(
			fixture.nativeElement.querySelector(".accordion-leading-icon"),
		).toBeTruthy();
	});

	it("should hide the leading icon when showIcon is false", () => {
		host.showIcon = false;
		fixture.detectChanges();

		expect(
			fixture.nativeElement.querySelector(".accordion-leading-icon"),
		).toBeNull();
	});

	it("should not render the body when closed", () => {
		expect(
			fixture.nativeElement.querySelector(".accordion-body"),
		).toBeNull();
	});

	it("should render projected content when open", () => {
		host.open = true;
		fixture.detectChanges();

		const body = fixture.nativeElement.querySelector(".accordion-body");
		expect(body).toBeTruthy();
		expect(body?.textContent).toContain("Conteúdo projetado");
	});

	it("should toggle open on head click", () => {
		const head = fixture.nativeElement.querySelector(
			".accordion-head",
		) as HTMLElement;
		head.click();
		fixture.detectChanges();

		expect(host.open).toBe(true);
		expect(
			fixture.nativeElement.querySelector(".accordion-body"),
		).toBeTruthy();
	});

	it("should toggle closed when already open", () => {
		host.open = true;
		fixture.detectChanges();

		const head = fixture.nativeElement.querySelector(
			".accordion-head",
		) as HTMLElement;
		head.click();
		fixture.detectChanges();

		expect(host.open).toBe(false);
	});

	it("should not toggle when disabled", () => {
		host.disabled = true;
		fixture.detectChanges();

		const head = fixture.nativeElement.querySelector(
			".accordion-head",
		) as HTMLElement;
		head.click();
		fixture.detectChanges();

		expect(host.open).toBe(false);
	});

	it("should apply is-disabled host class when disabled", () => {
		host.disabled = true;
		fixture.detectChanges();

		const hostEl = fixture.debugElement.query(
			By.directive(AccordionComponent),
		).nativeElement as HTMLElement;
		expect(hostEl.classList.contains("is-disabled")).toBe(true);
	});

	it("should apply is-open host class when open", () => {
		host.open = true;
		fixture.detectChanges();

		const hostEl = fixture.debugElement.query(
			By.directive(AccordionComponent),
		).nativeElement as HTMLElement;
		expect(hostEl.classList.contains("is-open")).toBe(true);
	});

	it("should set aria-expanded according to open state", () => {
		const head = fixture.nativeElement.querySelector(
			".accordion-head",
		) as HTMLElement;
		expect(head.getAttribute("aria-expanded")).toBe("false");

		host.open = true;
		fixture.detectChanges();

		expect(head.getAttribute("aria-expanded")).toBe("true");
	});

	it("should toggle on Enter key", () => {
		const headDe = fixture.debugElement.query(By.css(".accordion-head"));
		headDe.triggerEventHandler(
			"keydown",
			new KeyboardEvent("keydown", { key: "Enter" }),
		);
		fixture.detectChanges();

		expect(host.open).toBe(true);
	});

	it("should toggle on Space key", () => {
		const headDe = fixture.debugElement.query(By.css(".accordion-head"));
		headDe.triggerEventHandler(
			"keydown",
			new KeyboardEvent("keydown", { key: " " }),
		);
		fixture.detectChanges();

		expect(host.open).toBe(true);
	});

	it("should hide status when showStatus is false", () => {
		expect(
			fixture.nativeElement.querySelector(".accordion-status"),
		).toBeNull();
	});

	it("should render status before the toggle when showStatus is true", () => {
		host.showStatus = true;
		fixture.detectChanges();

		const statusEl = fixture.nativeElement.querySelector(
			".accordion-status",
		) as HTMLElement | null;
		const toggleEl = fixture.nativeElement.querySelector(
			".accordion-toggle",
		) as HTMLElement | null;

		expect(statusEl?.textContent?.trim()).toBe("Não enviado");
		expect(statusEl?.nextElementSibling).toBe(toggleEl);
	});

	it("should update status text and color", () => {
		host.showStatus = true;
		host.statusText = "Pendente";
		host.statusColor = "warning";
		fixture.detectChanges();

		const statusEl = fixture.nativeElement.querySelector(
			"lib-status",
		) as HTMLElement | null;
		expect(statusEl?.textContent?.trim()).toBe("Pendente");
		expect(statusEl?.classList.contains("status-warning")).toBe(true);
	});

	it("should toggle once when icon button is clicked", () => {
		const toggleDe = fixture.debugElement.query(
			By.css("lib-icon-button"),
		);
		toggleDe.triggerEventHandler("clicked", new MouseEvent("click"));
		fixture.detectChanges();

		expect(host.open).toBe(true);
	});
});
