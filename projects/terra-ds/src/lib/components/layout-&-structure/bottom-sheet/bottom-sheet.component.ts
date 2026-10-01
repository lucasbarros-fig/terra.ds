import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import type { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../actions/button/button.component';
import type { BottomSheetAction } from './bottom-sheet.types';

const BOTTOM_SHEET_EXIT_DURATION_MS = 280;
const BOTTOM_SHEET_CLOSE_DISTANCE_RATIO = 0.25;
const BOTTOM_SHEET_CLOSE_VELOCITY_PX_PER_MS = 0.6;
const BOTTOM_SHEET_MIN_FLICK_DISTANCE_PX = 24;
const BOTTOM_SHEET_VELOCITY_SAMPLE_SIZE = 5;
const BOTTOM_SHEET_MIN_HEIGHT_PERCENT = 1;
const BOTTOM_SHEET_MAX_HEIGHT_PERCENT = 100;

@Component({
  selector: 'lib-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
  standalone: true,
  host: { 'data-terra-ds': '' },
  imports: [CdkDrag, CdkDragHandle, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetComponent {
  open = input(false, { transform: booleanAttribute });
  title = input('');
  description = input('');
  actions = input<BottomSheetAction[]>([]);
  showBackdrop = input(true, { transform: booleanAttribute });
  closeOnBackdropClick = input(true, { transform: booleanAttribute });
  ariaLabel = input<string | undefined>(undefined);
  ariaLabelledBy = input<string | undefined>(undefined);
  testId = input<string | undefined>(undefined);
  /** Altura do painel em % da viewport (ex.: 75 → 75dvh). Padrão: altura pelo conteúdo, até 400px. */
  maxHeightPercent = input<number | undefined>(undefined);

  closed = output<void>();

  protected readonly isMounted = signal(false);
  protected readonly isClosing = signal(false);

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly destroyRef = inject(DestroyRef);
  private recentDrags: { y: number; t: number }[] = [];
  private closeFallbackId: ReturnType<typeof setTimeout> | null = null;
  private exitAnimation: Animation | null = null;

  protected readonly hasHeader = computed(
    () => !!this.title() || !!this.description(),
  );
  protected readonly hasActions = computed(() =>
    this.actions().some((action) => action.label?.trim()),
  );
  protected readonly panelStyle = computed(() => {
    const percent = this.maxHeightPercent();
    if (percent === null || percent === undefined || Number.isNaN(percent)) {
      return null;
    }

    const clamped = Math.min(
      BOTTOM_SHEET_MAX_HEIGHT_PERCENT,
      Math.max(BOTTOM_SHEET_MIN_HEIGHT_PERCENT, percent),
    );
    return { '--bs-panel-height': `${clamped}dvh` };
  });

  constructor() {
    effect(() => {
      if (this.open() && !this.isClosing()) {
        this.isMounted.set(true);
      } else if (!this.open() && this.isMounted() && !this.isClosing()) {
        this.requestClose();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearCloseFallback();
      this.exitAnimation?.cancel();
    });
  }

  onBackdropMouseDown(event: MouseEvent): void {
    if (!this.closeOnBackdropClick()) return;
    if (event.target === event.currentTarget) {
      this.requestClose();
    }
  }

  onDragStarted(): void {
    this.recentDrags = [];
  }

  onDragMoved(event: CdkDragMove): void {
    if (event.distance.y < 0) {
      event.source.setFreeDragPosition({ x: 0, y: 0 });
    }
    this.recentDrags.push({ y: event.pointerPosition.y, t: Date.now() });
    if (this.recentDrags.length > BOTTOM_SHEET_VELOCITY_SAMPLE_SIZE) {
      this.recentDrags.shift();
    }
  }

  onDragEnded(event: CdkDragEnd): void {
    const panelEl = event.source.getRootElement();
    const panelHeight = panelEl.getBoundingClientRect().height;
    const deltaY = event.distance.y;
    const velocity = this.computeDragVelocity();
    this.recentDrags = [];

    const closedByDistance =
      deltaY >= panelHeight * BOTTOM_SHEET_CLOSE_DISTANCE_RATIO;
    const closedByFlick =
      velocity >= BOTTOM_SHEET_CLOSE_VELOCITY_PX_PER_MS &&
      deltaY >= BOTTOM_SHEET_MIN_FLICK_DISTANCE_PX;

    if (closedByDistance || closedByFlick) {
      this.requestClose();
    } else {
      event.source.setFreeDragPosition({ x: 0, y: 0 });
    }
  }

  onActionClick(action: BottomSheetAction): void {
    action.action?.();
    if (action.closeOnClick !== false) {
      this.requestClose();
    }
  }

  resolveActionIntent(
    action: BottomSheetAction,
    index: number,
  ): 'branding' | 'neutral' {
    return action.intent ?? (index === 0 ? 'branding' : 'neutral');
  }

  shouldSkipAnimation(): boolean {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private requestClose(): void {
    if (!this.isMounted() || this.isClosing()) return;
    this.isClosing.set(true);
    this.scheduleCloseFallback();
    queueMicrotask(() => this.animateExit());
  }

  private animateExit(): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel || this.shouldSkipAnimation()) {
      this.completeClose();
      return;
    }

    const startY = this.currentTranslateY(panel);
    const offscreenY = panel.getBoundingClientRect().height;
    if (offscreenY <= 0) {
      this.completeClose();
      return;
    }

    this.exitAnimation?.cancel();
    this.exitAnimation = panel.animate(
      [
        { transform: `translateY(${startY}px)`, opacity: 1 },
        { transform: `translateY(${offscreenY}px)`, opacity: 0.4 },
      ],
      { duration: BOTTOM_SHEET_EXIT_DURATION_MS, easing: 'ease-in', fill: 'forwards' },
    );
    this.exitAnimation.onfinish = () => this.completeClose();
    this.exitAnimation.oncancel = () => this.completeClose();
  }

  private scheduleCloseFallback(): void {
    this.clearCloseFallback();
    this.closeFallbackId = setTimeout(() => {
      this.closeFallbackId = null;
      this.completeClose();
    }, BOTTOM_SHEET_EXIT_DURATION_MS + 80);
  }

  private clearCloseFallback(): void {
    if (this.closeFallbackId !== null) {
      clearTimeout(this.closeFallbackId);
      this.closeFallbackId = null;
    }
  }

  private completeClose(): void {
    this.clearCloseFallback();
    this.exitAnimation?.cancel();
    this.exitAnimation = null;
    if (!this.isClosing()) return;

    const shouldNotify = this.open();
    this.isClosing.set(false);
    this.isMounted.set(false);
    if (shouldNotify) {
      this.closed.emit();
    }
  }

  private computeDragVelocity(): number {
    if (this.recentDrags.length < 2) return 0;
    const first = this.recentDrags[0];
    const last = this.recentDrags[this.recentDrags.length - 1];
    const elapsed = last.t - first.t;
    if (elapsed <= 0) return 0;
    return (last.y - first.y) / elapsed;
  }

  private currentTranslateY(el: HTMLElement): number {
    const transform = getComputedStyle(el).transform;
    if (!transform || transform === 'none') return 0;
    try {
      return new DOMMatrixReadOnly(transform).m42;
    } catch {
      return 0;
    }
  }
}
