import type { ComponentFixture } from "@angular/core/testing";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { AccordionComponent } from "../accordion/accordion.component";
import { AccordionGroupComponent } from "./accordion-group.component";

@Component({
	standalone: true,
	imports: [AccordionComponent, AccordionGroupComponent],
	template: `
		<lib-accordion-group>
			<lib-accordion label="Um" [(open)]="openOne">
				<div>Conteúdo um</div>
			</lib-accordion>
			<lib-accordion label="Dois" [(open)]="openTwo">
				<div>Conteúdo dois</div>
			</lib-accordion>
			<lib-accordion label="Três" [disabled]="true" [(open)]="openThree">
				<div>Conteúdo três</div>
			</lib-accordion>
		</lib-accordion-group>
	`,
})
class AccordionGroupHostComponent {
	openOne = true;
	openTwo = false;
	openThree = false;
}

describe("AccordionGroupComponent", () => {
	let host: AccordionGroupHostComponent;
	let fixture: ComponentFixture<AccordionGroupHostComponent>;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [AccordionGroupHostComponent],
		});
		fixture = TestBed.createComponent(AccordionGroupHostComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	});

	function accordionBodies(): NodeListOf<Element> {
		return fixture.nativeElement.querySelectorAll(".accordion-body");
	}

	function heads(): HTMLElement[] {
		return Array.from(
			fixture.nativeElement.querySelectorAll(".accordion-head"),
		) as HTMLElement[];
	}

	it("should keep only the initially open item expanded", () => {
		expect(accordionBodies().length).toBe(1);
		expect(accordionBodies()[0].textContent).toContain("Conteúdo um");
		expect(host.openOne).toBe(true);
		expect(host.openTwo).toBe(false);
	});

	it("should close the previous item when another is opened", () => {
		heads()[1].click();
		fixture.detectChanges();

		expect(accordionBodies().length).toBe(1);
		expect(accordionBodies()[0].textContent).toContain("Conteúdo dois");
		expect(host.openOne).toBe(false);
		expect(host.openTwo).toBe(true);
	});

	it("should allow closing the currently open item", () => {
		heads()[0].click();
		fixture.detectChanges();

		expect(accordionBodies().length).toBe(0);
		expect(host.openOne).toBe(false);
		expect(host.openTwo).toBe(false);
	});

	it("should not open a disabled item in the group", () => {
		heads()[2].click();
		fixture.detectChanges();

		expect(accordionBodies().length).toBe(1);
		expect(accordionBodies()[0].textContent).toContain("Conteúdo um");
		expect(host.openThree).toBe(false);
	});
});
