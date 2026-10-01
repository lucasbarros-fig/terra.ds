import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { TERRA_DROPDOWN_HOST } from '../dropdown.tokens';

@Directive({
  selector: '[libDropdownTrigger]',
  standalone: true,
  hostDirectives: [CdkOverlayOrigin],
})
export class DropdownTriggerDirective {
  readonly toggleOnClick = input(true);

  readonly triggerDisabled = input(false);

  readonly applyHostAria = input(true);

  open = false;

  panelId: string | null = null;

  toggle?: () => void;

  readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly overlayOrigin = inject(CdkOverlayOrigin, { self: true });

  private readonly host = inject(TERRA_DROPDOWN_HOST, { optional: true });

  @HostBinding('attr.aria-haspopup')
  get ariaHaspopup(): string | null {
    if (!this.applyHostAria()) return null;
    return this.host?.panelRole ?? 'menu';
  }

  @HostBinding('attr.aria-expanded')
  get ariaExpanded(): 'true' | 'false' | null {
    if (!this.applyHostAria()) return null;
    return this.open ? 'true' : 'false';
  }

  @HostBinding('attr.aria-controls')
  get ariaControls(): string | null {
    if (!this.applyHostAria()) return null;
    return this.panelId;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.triggerDisabled()) return;
    if (!this.toggleOnClick() && this.open) return;
    this.toggle?.();
  }
}
