import { InjectionToken } from '@angular/core';

export interface TerraDropdownHost {
  readonly closeOnItemClick: boolean;
  readonly panelRole: 'menu' | 'listbox';
  close(): void;
}

export const TERRA_DROPDOWN_HOST = new InjectionToken<TerraDropdownHost>(
  'terraDropdownHost',
);
