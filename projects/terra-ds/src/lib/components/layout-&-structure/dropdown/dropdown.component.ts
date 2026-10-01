import { A11yModule, FocusKeyManager } from '@angular/cdk/a11y';
import {
  CdkOverlayOrigin,
  type ConnectedPosition,
  OverlayModule,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { NgIf } from '@angular/common';
import type { AfterContentInit, QueryList } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { resolveOverlayPanelMinWidth } from '../../../utils/app-ui-scale.util';
import { DropdownItemComponent } from './components';
import { DropdownTriggerDirective } from './directives/dropdown-trigger.directive';
import {
  TERRA_DROPDOWN_HOST,
  type TerraDropdownHost,
} from './dropdown.tokens';

export type TerraDropdownPlacement =
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end'
  | 'top-start'
  | 'top-center'
  | 'top-end';

export type TerraDropdownFocusPanelOnOpen = 'first-item' | 'none';

let _panelIdSeed = 0;

const POSITION_MAP: Record<TerraDropdownPlacement, ConnectedPosition[]> = {
  'bottom-start': [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ],
  'bottom-center': [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 4 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -4 },
  ],
  'bottom-end': [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
  ],
  'top-start': [
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  ],
  'top-center': [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -4 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 4 },
  ],
  'top-end': [
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  ],
};

@Component({
  selector: 'lib-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: true,
  imports: [NgIf, OverlayModule, A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CdkOverlayOrigin],
  providers: [
    { provide: TERRA_DROPDOWN_HOST, useExisting: DropdownComponent },
  ],
})
export class DropdownComponent implements TerraDropdownHost, AfterContentInit {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() placement: TerraDropdownPlacement = 'bottom-start';
  @Input() maxHeight = '280px';
  @Input() panelMinWidth = '191px';
  @Input() matchTriggerWidth = false;
  @Input() closeOnItemClick = true;
  @Input() panelRole: 'menu' | 'listbox' = 'menu';
  @Input() focusPanelOnOpen: TerraDropdownFocusPanelOnOpen = 'first-item';

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ContentChild(DropdownTriggerDirective, { static: true })
  trigger?: DropdownTriggerDirective;

  @ContentChildren(DropdownItemComponent, { descendants: true })
  private items!: QueryList<DropdownItemComponent>;

  readonly panelId = `terra-dropdown-${++_panelIdSeed}`;

  private keyManager?: FocusKeyManager<DropdownItemComponent>;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly hostOverlayOrigin = inject(CdkOverlayOrigin, { self: true });
  private readonly scrollStrategies = inject(ScrollStrategyOptions);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterContentInit(): void {
    if (this.trigger) {
      this.trigger.open = this.open;
      this.trigger.panelId = this.panelId;
      this.trigger.toggle = () => this.toggle();
    }

    this.items.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.rebuildKeyManager());

    this.rebuildKeyManager();
  }

  get positions(): ConnectedPosition[] {
    return POSITION_MAP[this.placement];
  }

  get triggerOrigin(): CdkOverlayOrigin {
    return this.trigger?.overlayOrigin ?? this.hostOverlayOrigin;
  }

  get overlayScrollStrategy() {
    return this.scrollStrategies.reposition();
  }

  get triggerWidth(): number {
    return resolveOverlayPanelMinWidth(this.triggerOrigin.elementRef.nativeElement);
  }

  toggle(): void {
    this.setOpen(!this.open);
  }

  openPanel(): void {
    this.setOpen(true);
  }

  close(): void {
    if (!this.open) return;
    this.setOpen(false);
    const host = this.trigger?.elementRef.nativeElement;
    if (!host) return;
    const focusable = host.matches('input,button,textarea,select,[tabindex]')
      ? host
      : (host.querySelector('input,button,textarea,select,[tabindex]') as HTMLElement | null);
    (focusable ?? host).focus();
  }

  focusFirstItem(): void {
    this.keyManager?.setFirstItemActive();
  }

  focusLastItem(): void {
    this.keyManager?.setLastItemActive();
  }

  onOverlayAttached(): void {
    this.opened.emit();
    if (this.focusPanelOnOpen === 'none') return;
    queueMicrotask(() => {
      this.keyManager?.setFirstItemActive();
    });
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.close();
      return;
    }
    this.keyManager?.onKeydown(event);
  }

  onOverlayOutsideClick(event: Event): void {
    const target = event.target;
    if (
      this.trigger &&
      target instanceof Node &&
      this.trigger.elementRef.nativeElement.contains(target)
    ) {
      return;
    }
    this.setOpen(false);
  }

  onBackdropClose(): void {
    this.setOpen(false);
  }

  private setOpen(next: boolean): void {
    if (this.open === next) return;
    this.open = next;
    this.openChange.emit(next);
    if (this.trigger) {
      this.trigger.open = next;
    }
    if (!next) {
      this.closed.emit();
    }
    this.cdr.markForCheck();
  }

  private rebuildKeyManager(): void {
    this.keyManager = new FocusKeyManager(this.items)
      .withWrap()
      .withHomeAndEnd()
      .withTypeAhead()
      .skipPredicate((item) => item.disabled);
  }
}
