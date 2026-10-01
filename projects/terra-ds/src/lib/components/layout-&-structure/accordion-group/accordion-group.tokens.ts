import { InjectionToken } from "@angular/core";

export interface TerraAccordionGroup {
	isItemOpen(accordionId: string): boolean;
	requestToggle(accordionId: string): void;
}

export const TERRA_ACCORDION_GROUP =
	new InjectionToken<TerraAccordionGroup>("terraAccordionGroup");
