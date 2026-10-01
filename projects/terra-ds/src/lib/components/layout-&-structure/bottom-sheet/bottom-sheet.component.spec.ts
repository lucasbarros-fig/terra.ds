import type { ComponentFixture } from '@angular/core/testing';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import type { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

import { BottomSheetComponent } from './bottom-sheet.component';

function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('BottomSheetComponent', () => {
  let component: BottomSheetComponent;
  let fixture: ComponentFixture<BottomSheetComponent>;
  let pendingAnimationFinish: (() => void) | null;

  beforeEach(() => {
    mockMatchMedia(false);
    pendingAnimationFinish = null;
    vi.stubGlobal('queueMicrotask', (fn: () => void) => fn());

    HTMLElement.prototype.animate = vi.fn().mockImplementation(() => {
      const anim = {
        cancel: vi.fn(),
        get onfinish() {
          return pendingAnimationFinish;
        },
        set onfinish(fn: (() => void) | null) {
          pendingAnimationFinish = fn;
        },
        get oncancel() {
          return null;
        },
        set oncancel(_fn: (() => void) | null) {},
      };
      return anim as unknown as Animation;
    }) as typeof HTMLElement.prototype.animate;

    TestBed.configureTestingModule({
      imports: [BottomSheetComponent],
    });
    fixture = TestBed.createComponent(BottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getRoot(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.bs-root');
  }

  function getBackdrop(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.bs-backdrop');
  }

  function getPanel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.bs-panel');
  }

  function getHandle(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.bs-handle');
  }

  function getHeader(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.bs-header');
  }

  function getTitle(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.bs-title');
  }

  function getDescription(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.bs-description');
  }

  function getFooter(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.bs-footer');
  }

  function open(): void {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  }

  function completePanelLeave(): void {
    const panel = getPanel();
    if (panel) {
      panel.getBoundingClientRect = () => ({ height: 300 }) as DOMRect;
    }
    pendingAnimationFinish?.();
    fixture.detectChanges();
  }

  function buildMockDragMove(deltaY: number, pointerY = 0): CdkDragMove {
    return {
      distance: { x: 0, y: deltaY },
      pointerPosition: { x: 0, y: pointerY },
      source: { setFreeDragPosition: vi.fn() },
    } as unknown as CdkDragMove;
  }

  // getBoundingClientRect é 0 no jsdom; fixamos a altura para exercitar o
  // limiar proporcional (25% de 300 = 75px).
  function buildMockDragEnd(deltaY: number, freeY = 0): CdkDragEnd {
    const panelEl = document.createElement('div');
    panelEl.getBoundingClientRect = () => ({ height: 300 }) as DOMRect;
    return {
      distance: { x: 0, y: deltaY },
      source: {
        setFreeDragPosition: vi.fn(),
        getFreeDragPosition: () => ({ x: 0, y: freeY }),
        getRootElement: () => panelEl,
      },
    } as unknown as CdkDragEnd;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    it('should not render when open is false', () => {
      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      expect(getRoot()).toBeNull();
    });

    it('should render when open is true', () => {
      open();

      expect(getRoot()).not.toBeNull();
    });

    it('should render the drag handle when open', () => {
      open();

      expect(getHandle()).not.toBeNull();
    });
  });

  describe('showBackdrop', () => {
    beforeEach(() => open());

    it('should render backdrop when showBackdrop is true', () => {
      fixture.componentRef.setInput('showBackdrop', true);
      fixture.detectChanges();

      expect(getBackdrop()).not.toBeNull();
    });

    it('should not render backdrop when showBackdrop is false', fakeAsync(() => {
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();
      flush(); // conclui a animação :leave antes de checar a remoção do DOM

      expect(getBackdrop()).toBeNull();
    }));

    it('should add no-backdrop class when showBackdrop is false', () => {
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();

      expect(getRoot()?.classList.contains('bs-root-no-backdrop')).toBe(true);
    });
  });

  describe('closed output', () => {
    beforeEach(() => open());

    it('should emit closed when clicking backdrop with closeOnBackdropClick enabled', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.closed.subscribe(spy);

      const target = {};
      const mockEvent = { target, currentTarget: target } as unknown as MouseEvent;
      component.onBackdropMouseDown(mockEvent);
      completePanelLeave();

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit closed when closeOnBackdropClick is false', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', false);
      fixture.detectChanges();

      const spy = vi.fn();
      component.closed.subscribe(spy);

      const target = {};
      const mockEvent = { target, currentTarget: target } as unknown as MouseEvent;
      component.onBackdropMouseDown(mockEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit closed when target differs from currentTarget', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.closed.subscribe(spy);

      const mockEvent = { target: {}, currentTarget: {} } as unknown as MouseEvent;
      component.onBackdropMouseDown(mockEvent);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('header (derived visibility)', () => {
    beforeEach(() => open());

    it('should render header when a title is set', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      expect(getHeader()).not.toBeNull();
      expect(getTitle()?.textContent?.trim()).toBe('Test Title');
    });

    it('should render header when only a description is set', () => {
      fixture.componentRef.setInput('description', 'Some description');
      fixture.detectChanges();

      expect(getHeader()).not.toBeNull();
      expect(getDescription()?.textContent?.trim()).toBe('Some description');
    });

    it('should not render header when neither title nor description are set', () => {
      expect(getHeader()).toBeNull();
    });

    it('should not render title element when title is empty', () => {
      fixture.componentRef.setInput('description', 'Only description');
      fixture.detectChanges();

      expect(getTitle()).toBeNull();
    });

    it('should not render description element when description is empty', () => {
      fixture.componentRef.setInput('title', 'Only title');
      fixture.detectChanges();

      expect(getDescription()).toBeNull();
    });
  });

  describe('footer actions (derived visibility)', () => {
    beforeEach(() => open());

    it('should render footer when actions contain a label', () => {
      fixture.componentRef.setInput('actions', [{ label: 'Confirmar' }]);
      fixture.detectChanges();

      expect(getFooter()).not.toBeNull();
    });

    it('should render footer when only a secondary action label is set', () => {
      fixture.componentRef.setInput('actions', [{ label: 'Cancelar' }]);
      fixture.detectChanges();

      expect(getFooter()).not.toBeNull();
    });

    it('should render footer with three actions', () => {
      fixture.componentRef.setInput('actions', [
        { label: 'Confirmar' },
        { label: 'Salvar rascunho' },
        { label: 'Cancelar' },
      ]);
      fixture.detectChanges();

      expect(getFooter()).not.toBeNull();
      expect(fixture.nativeElement.querySelectorAll('lib-button[data-terra-ds]').length).toBe(3);
    });

    it('should not render footer when actions is empty', () => {
      expect(getFooter()).toBeNull();
    });

    it('should not render footer when all action labels are empty', () => {
      fixture.componentRef.setInput('actions', [{ label: '  ' }, { label: '' }]);
      fixture.detectChanges();

      expect(getFooter()).toBeNull();
    });

    it('should render lib-button for each action with a label', () => {
      fixture.componentRef.setInput('actions', [{ label: 'Confirmar' }]);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('lib-button[data-terra-ds]'),
      ).not.toBeNull();
    });

    it('should call action callback when provided', () => {
      const actionFn = vi.fn();
      const action = { label: 'Confirmar', action: actionFn };

      component.onActionClick(action);

      expect(actionFn).toHaveBeenCalled();
    });

    it('should emit closed after action click when leave completes', () => {
      open();
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onActionClick({ label: 'Confirmar' });
      completePanelLeave();

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit closed when closeOnClick is false', () => {
      open();
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onActionClick({ label: 'Confirmar', closeOnClick: false });

      expect(spy).not.toHaveBeenCalled();
    });

    it('should reopen after close animation completes', () => {
      open();
      component.onActionClick({ label: 'Confirmar' });
      completePanelLeave();
      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      open();

      expect(getRoot()).not.toBeNull();
    });
  });

  describe('action loading', () => {
    function getActionButton(index: number): HTMLElement | null {
      return (
        fixture.nativeElement.querySelectorAll('lib-button[data-terra-ds]')[index] ?? null
      );
    }

    function getActionNativeButton(index: number): HTMLButtonElement | null {
      return getActionButton(index)?.querySelector('button') ?? null;
    }

    function getActionSpinner(index: number): HTMLElement | null {
      return getActionButton(index)?.querySelector('lib-spinner') ?? null;
    }

    beforeEach(() => open());

    it('should not render a spinner when loading is not set on the action', () => {
      fixture.componentRef.setInput('actions', [{ label: 'Confirmar' }]);
      fixture.detectChanges();

      expect(getActionSpinner(0)).toBeNull();
      expect(getActionNativeButton(0)?.getAttribute('aria-busy')).toBeNull();
    });

    it('should render the spinner and disable the button when the action is loading', () => {
      fixture.componentRef.setInput('actions', [{ label: 'Confirmar', loading: true }]);
      fixture.detectChanges();

      expect(getActionSpinner(0)).not.toBeNull();
      expect(getActionNativeButton(0)?.getAttribute('aria-busy')).toBe('true');
      expect(getActionNativeButton(0)?.disabled).toBe(true);
    });

    it('should only mark the loading action, leaving the others untouched', () => {
      fixture.componentRef.setInput('actions', [
        { label: 'Confirmar', loading: true },
        { label: 'Cancelar' },
      ]);
      fixture.detectChanges();

      expect(getActionSpinner(0)).not.toBeNull();
      expect(getActionSpinner(1)).toBeNull();
      expect(getActionNativeButton(1)?.disabled).toBe(false);
    });

    it('should not run the action callback nor close while the action is loading', () => {
      const actionFn = vi.fn();
      const closedSpy = vi.fn();
      component.closed.subscribe(closedSpy);

      fixture.componentRef.setInput('actions', [
        { label: 'Confirmar', loading: true, action: actionFn },
      ]);
      fixture.detectChanges();

      getActionNativeButton(0)?.click();
      fixture.detectChanges();

      expect(actionFn).not.toHaveBeenCalled();
      expect(closedSpy).not.toHaveBeenCalled();
      expect(getRoot()).not.toBeNull();
    });

    it('should keep the other actions clickable while one action is loading', () => {
      const cancelFn = vi.fn();

      fixture.componentRef.setInput('actions', [
        { label: 'Confirmar', loading: true },
        { label: 'Cancelar', action: cancelFn, closeOnClick: false },
      ]);
      fixture.detectChanges();

      getActionNativeButton(1)?.click();
      fixture.detectChanges();

      expect(cancelFn).toHaveBeenCalled();
    });
  });

  describe('resolveActionIntent', () => {
    it('should default first action to branding and others to neutral', () => {
      expect(component.resolveActionIntent({ label: 'Confirmar' }, 0)).toBe('branding');
      expect(component.resolveActionIntent({ label: 'Cancelar' }, 1)).toBe('neutral');
    });

    it('should respect explicit intent on an action', () => {
      expect(
        component.resolveActionIntent({ label: 'Salvar', intent: 'neutral' }, 0),
      ).toBe('neutral');
      expect(
        component.resolveActionIntent({ label: 'Destaque', intent: 'branding' }, 2),
      ).toBe('branding');
    });
  });

  describe('ARIA attributes', () => {
    beforeEach(() => open());

    it('should set role="dialog" on the panel', () => {
      expect(getPanel()?.getAttribute('role')).toBe('dialog');
    });

    it('should set aria-modal="true" when showBackdrop is true', () => {
      fixture.componentRef.setInput('showBackdrop', true);
      fixture.detectChanges();

      expect(getPanel()?.getAttribute('aria-modal')).toBe('true');
    });

    it('should not set aria-modal when showBackdrop is false', () => {
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();

      expect(getPanel()?.getAttribute('aria-modal')).toBeNull();
    });

    it('should set aria-label on the panel when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'My bottom sheet');
      fixture.detectChanges();

      expect(getPanel()?.getAttribute('aria-label')).toBe('My bottom sheet');
    });

    it('should set aria-labelledby on the panel when provided', () => {
      fixture.componentRef.setInput('ariaLabelledBy', 'heading-id');
      fixture.detectChanges();

      expect(getPanel()?.getAttribute('aria-labelledby')).toBe('heading-id');
    });
  });

  describe('maxHeightPercent', () => {
    beforeEach(() => open());

    it('should keep default sizing when maxHeightPercent is not set', () => {
      expect(getPanel()?.style.getPropertyValue('--bs-panel-height')).toBe('');
    });

    it('should set --bs-panel-height as dvh when maxHeightPercent is provided', () => {
      fixture.componentRef.setInput('maxHeightPercent', 70);
      fixture.detectChanges();

      expect(getPanel()?.style.getPropertyValue('--bs-panel-height')).toBe('70dvh');
    });

    it('should clamp maxHeightPercent to the supported range', () => {
      fixture.componentRef.setInput('maxHeightPercent', 150);
      fixture.detectChanges();

      expect(getPanel()?.style.getPropertyValue('--bs-panel-height')).toBe('100dvh');
    });
  });

  describe('testId', () => {
    it('should set data-testid when testId is provided', () => {
      fixture.componentRef.setInput('testId', 'my-bottom-sheet');
      open();

      expect(getRoot()?.getAttribute('data-testid')).toBe('my-bottom-sheet');
    });

    it('should not set data-testid when testId is not provided', () => {
      open();

      expect(getRoot()?.getAttribute('data-testid')).toBeNull();
    });
  });

  describe('drag to close', () => {
    beforeEach(() => open());

    // Painel mockado tem 300px → limiar de distância = 25% = 75px.
    it('should emit closed when drag distance exceeds the distance threshold', () => {
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onDragEnded(buildMockDragEnd(160));
      completePanelLeave();

      expect(spy).toHaveBeenCalled();
    });

    it('should emit closed exactly at the distance threshold (25% of height)', () => {
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onDragEnded(buildMockDragEnd(75));
      completePanelLeave();

      expect(spy).toHaveBeenCalled();
    });

    it('should not close and should snap back when below the threshold', () => {
      const mockEnd = buildMockDragEnd(40);
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onDragEnded(mockEnd);

      expect(spy).not.toHaveBeenCalled();
      expect(
        (mockEnd.source as { setFreeDragPosition: ReturnType<typeof vi.fn> })
          .setFreeDragPosition,
      ).toHaveBeenCalledWith({ x: 0, y: 0 });
    });

    it('should reset drag position when dragging upward', () => {
      const mockMove = buildMockDragMove(-30);
      component.onDragMoved(mockMove);

      expect(
        (mockMove.source as { setFreeDragPosition: ReturnType<typeof vi.fn> })
          .setFreeDragPosition,
      ).toHaveBeenCalledWith({ x: 0, y: 0 });
    });

    it('should not reset drag position when dragging downward', () => {
      const mockMove = buildMockDragMove(50);
      component.onDragMoved(mockMove);

      expect(
        (mockMove.source as { setFreeDragPosition: ReturnType<typeof vi.fn> })
          .setFreeDragPosition,
      ).not.toHaveBeenCalled();
    });

    it('should emit closed when drag-to-close threshold is met', () => {
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onDragEnded(buildMockDragEnd(200));
      completePanelLeave();

      expect(spy).toHaveBeenCalled();
    });

    it('should close on a fast downward flick even with a short drag distance', () => {
      const nowSpy = vi.spyOn(Date, 'now');
      nowSpy.mockReturnValueOnce(0).mockReturnValueOnce(16);
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onDragStarted();
      component.onDragMoved(buildMockDragMove(0, 100));
      component.onDragMoved(buildMockDragMove(40, 160));
      component.onDragEnded(buildMockDragEnd(40));
      completePanelLeave();

      expect(spy).toHaveBeenCalled();
      nowSpy.mockRestore();
    });

    it('should not close on a slow short drag', () => {
      const nowSpy = vi.spyOn(Date, 'now');
      nowSpy.mockReturnValueOnce(0).mockReturnValueOnce(500);
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onDragStarted();
      component.onDragMoved(buildMockDragMove(0, 100));
      component.onDragMoved(buildMockDragMove(40, 140)); // 40px em 500ms = 0.08px/ms
      component.onDragEnded(buildMockDragEnd(40));

      expect(spy).not.toHaveBeenCalled();
      nowSpy.mockRestore();
    });

    it('should not close on a fast flick that does not meet the minimum distance', () => {
      const nowSpy = vi.spyOn(Date, 'now');
      nowSpy.mockReturnValueOnce(0).mockReturnValueOnce(16);
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onDragStarted();
      component.onDragMoved(buildMockDragMove(0, 100));
      component.onDragMoved(buildMockDragMove(20, 120)); // rápido, mas só 20px (< 24px)
      component.onDragEnded(buildMockDragEnd(20));

      expect(spy).not.toHaveBeenCalled();
      nowSpy.mockRestore();
    });
  });

  describe('prefers-reduced-motion', () => {
    it('should return true from shouldSkipAnimation when reduced motion matches', () => {
      mockMatchMedia(true);
      expect(component.shouldSkipAnimation()).toBe(true);
    });

    it('should return false from shouldSkipAnimation when reduced motion does not match', () => {
      mockMatchMedia(false);
      expect(component.shouldSkipAnimation()).toBe(false);
    });

    it('should emit closed on drag-to-close when reduced motion is preferred', () => {
      open();
      mockMatchMedia(true);

      const mockEnd = buildMockDragEnd(200);
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onDragEnded(mockEnd);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });
});
