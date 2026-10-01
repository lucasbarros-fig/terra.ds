export * from "./components/dropdown-group-header/dropdown-group-header.component";
export * from "./components/dropdown-item/dropdown-item.component";
export * from "./directives/dropdown-trigger.directive";
export * from "./dropdown.component";
export * from "./dropdown.tokens";

import { DropdownGroupHeaderComponent } from "./components/dropdown-group-header/dropdown-group-header.component";
import { DropdownItemComponent } from "./components/dropdown-item/dropdown-item.component";
import { DropdownTriggerDirective } from "./directives/dropdown-trigger.directive";
import { DropdownComponent } from "./dropdown.component";

export const TERRA_DROPDOWN_IMPORTS = [
	DropdownComponent,
	DropdownItemComponent,
	DropdownGroupHeaderComponent,
	DropdownTriggerDirective,
] as const;
