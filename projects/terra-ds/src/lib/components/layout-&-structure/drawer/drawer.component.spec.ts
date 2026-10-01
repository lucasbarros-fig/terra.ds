import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { DrawerComponent } from './drawer.component';

@Component({
  selector: 'lib-test-host',
  template: `
    <lib-drawer
      [position]="position"
      [open]="open"
      [showBackdrop]="showBackdrop"
      [closeOnBackdropClick]="closeOnBackdropClick"
      [title]="title"
      [description]="description"
      [prefix]="prefix"
      [suffix]="suffix"
      [showCloseButton]="showCloseButton"
      [closeButtonLabel]="closeButtonLabel"
      [showFooter]="showFooter"
      [showCustomFooter]="showCustomFooter"
      [showPrimaryAction]="showPrimaryAction"
      [primaryActionLabel]="primaryActionLabel"
      [primaryActionIcon]="primaryActionIcon"
      [primaryActionDisabled]="primaryActionDisabled"
      [primaryActionLoading]="primaryActionLoading"
      [showSecondaryAction]="showSecondaryAction"
      [secondaryActionLabel]="secondaryActionLabel"
      [secondaryActionIcon]="secondaryActionIcon"
      [secondaryActionDisabled]="secondaryActionDisabled"
      [secondaryActionLoading]="secondaryActionLoading"
      [showOptionalAction]="showOptionalAction"
      [optionalActionLabel]="optionalActionLabel"
      [optionalActionIcon]="optionalActionIcon"
      [optionalActionDisabled]="optionalActionDisabled"
      [optionalActionLoading]="optionalActionLoading"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [testId]="testId"
      (backdropClick)="onBackdropClick()"
      (closeClick)="onCloseClick()"
      (primaryActionClick)="onPrimaryClick($event)"
      (secondaryActionClick)="onSecondaryClick($event)"
      (optionalActionClick)="onOptionalClick($event)"
    >
      <p>Default content</p>
      <div libDrawerFooter>Footer content</div>
    </lib-drawer>
  `,
  standalone: true,
  imports: [DrawerComponent],
})
class TestHostComponent {
  position = 'right' as const;
  open = false;
  showBackdrop = true;
  closeOnBackdropClick = true;
  title = 'Drawer Title';
  description = 'Drawer description';
  prefix = '🔔';
  suffix = 'NEW';
  showCloseButton = true;
  closeButtonLabel = 'Close drawer';
  showFooter = true;
  showCustomFooter = false;
  showPrimaryAction = true;
  primaryActionLabel = 'Save';
  primaryActionIcon?: string;
  primaryActionDisabled = false;
  primaryActionLoading = false;
  showSecondaryAction = true;
  secondaryActionLabel = 'Cancel';
  secondaryActionIcon?: string;
  secondaryActionDisabled = false;
  secondaryActionLoading = false;
  showOptionalAction = true;
  optionalActionLabel = 'More';
  optionalActionIcon?: string;
  optionalActionDisabled = false;
  optionalActionLoading = false;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  testId?: string;

  onBackdropClick = vi.fn();
  onCloseClick = vi.fn();
  onPrimaryClick = vi.fn();
  onSecondaryClick = vi.fn();
  onOptionalClick = vi.fn();
}

function findDrawerRoot(el: HTMLElement): HTMLElement | null {
  return el.querySelector('.drawer-root');
}

function findBackdrop(el: HTMLElement): HTMLElement | null {
  return el.querySelector('.drawer-backdrop');
}

describe('DrawerComponent', () => {
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;
  let hostEl: HTMLElement;
  let matchMediaSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    matchMediaSpy = vi.fn().mockReturnValue({ matches: false });
    vi.stubGlobal('matchMedia', matchMediaSpy);

    TestBed.configureTestingModule({
      imports: [DrawerComponent],
    });
    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;
    hostEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('render conditional — open input', () => {
    it('should not render drawer-root when open is false', () => {
      expect(findDrawerRoot(hostEl)).toBeNull();
    });

    it('should render drawer-root when open is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      expect(findDrawerRoot(hostEl)).toBeTruthy();
    });

    it('should not render drawer-root after open toggles back to false (with animation)', async () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();
      // root still exists during closing animation
      expect(findDrawerRoot(hostEl)).toBeTruthy();
      expect(component.isClosing()).toBe(true);

      // wait for exit animation to complete
      await new Promise((r) => setTimeout(r, 350));
      fixture.detectChanges();
      expect(findDrawerRoot(hostEl)).toBeNull();
      expect(component.isClosing()).toBe(false);
    });
  });

  describe('showBackdrop', () => {
    it('should render backdrop when showBackdrop is true (default)', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      expect(findBackdrop(hostEl)).toBeTruthy();
    });

    it('should not render backdrop when showBackdrop is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();
      expect(findBackdrop(hostEl)).toBeNull();
    });

    it('should add drawer-root-no-backdrop class when showBackdrop is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();
      const root = findDrawerRoot(hostEl);
      expect(root?.classList.contains('drawer-root-no-backdrop')).toBe(true);
    });

    it('should not have drawer-root-no-backdrop class when showBackdrop is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      const root = findDrawerRoot(hostEl);
      expect(root?.classList.contains('drawer-root-no-backdrop')).toBe(false);
    });
  });

  describe('backdropClick', () => {
    it('should emit backdropClick when clicking backdrop with closeOnBackdropClick=true', () => {
      const spy = vi.fn();
      component.backdropClick.subscribe(spy);
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const backdrop = findBackdrop(hostEl)!;
      backdrop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(spy).toHaveBeenCalled();
    });

    it('should not emit backdropClick when closeOnBackdropClick is false', () => {
      const spy = vi.fn();
      component.backdropClick.subscribe(spy);
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('closeOnBackdropClick', false);
      fixture.detectChanges();

      const backdrop = findBackdrop(hostEl)!;
      backdrop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit backdropClick when target is not currentTarget', () => {
      const spy = vi.fn();
      component.backdropClick.subscribe(spy);
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const panel = hostEl.querySelector('.drawer-panel')!;
      panel.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit backdropClick when isClosing is true', () => {
      const spy = vi.fn();
      component.backdropClick.subscribe(spy);
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      component.isClosing.set(true);
      fixture.detectChanges();

      const backdrop = findBackdrop(hostEl)!;
      backdrop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('closeClick', () => {
    it('should emit closeClick when onClose is called', () => {
      const spy = vi.fn();
      component.closeClick.subscribe(spy);

      component.onClose();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('title', () => {
    it('should render title in h2 element', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('title', 'Custom Title');
      fixture.detectChanges();

      const titleEl = hostEl.querySelector('.drawer-title');
      expect(titleEl?.textContent?.trim()).toBe('Custom Title');
    });

    it('should not render title row when title is empty', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('title', '');
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-title-row')).toBeNull();
    });

    it('should render prefix when title and prefix are provided', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('title', 'My Title');
      fixture.componentRef.setInput('prefix', '🔔');
      fixture.detectChanges();

      const prefixEl = hostEl.querySelector('.drawer-title-prefix');
      expect(prefixEl?.textContent?.trim()).toBe('🔔');
    });

    it('should render suffix when title and suffix are provided', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('title', 'My Title');
      fixture.componentRef.setInput('suffix', 'NEW');
      fixture.detectChanges();

      const suffixEl = hostEl.querySelector('.drawer-title-suffix');
      expect(suffixEl?.textContent?.trim()).toBe('NEW');
    });
  });

  describe('description', () => {
    it('should render description paragraph', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('description', 'Some description');
      fixture.detectChanges();

      const descEl = hostEl.querySelector('.drawer-description');
      expect(descEl?.textContent?.trim()).toBe('Some description');
    });

    it('should not render description when empty', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('description', '');
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-description')).toBeNull();
    });
  });

  describe('showCloseButton', () => {
    it('should show close button when showCloseButton is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-close')).toBeTruthy();
    });

    it('should not show close button when showCloseButton is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showCloseButton', false);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-close')).toBeNull();
    });
  });

  describe('footer', () => {
    it('should not render footer when showFooter is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showFooter', false);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-footer')).toBeNull();
    });

    it('should render footer when showFooter is true and has footer actions', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showFooter', true);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-footer')).toBeTruthy();
    });

    it('should not render footer when all actions are hidden and customFooter is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showPrimaryAction', false);
      fixture.componentRef.setInput('showSecondaryAction', false);
      fixture.componentRef.setInput('showOptionalAction', false);
      fixture.componentRef.setInput('showCustomFooter', false);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-footer')).toBeNull();
    });
  });

  describe('action buttons', () => {
    it('should render primary action button', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-action-primary')).toBeTruthy();
    });

    it('should not render primary action when showPrimaryAction is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showPrimaryAction', false);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-action-primary')).toBeNull();
    });

    it('should render secondary action button', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-action-secondary')).toBeTruthy();
    });

    it('should not render secondary action when showSecondaryAction is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showSecondaryAction', false);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-action-secondary')).toBeNull();
    });

    it('should render optional action button when showOptionalAction is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showOptionalAction', true);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-action-optional')).toBeTruthy();
    });

    it('should not render optional action when showOptionalAction is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showOptionalAction', false);
      fixture.detectChanges();

      expect(hostEl.querySelector('.drawer-action-optional')).toBeNull();
    });
  });

  describe('action loading', () => {
    function nativeButtonOf(selector: string): HTMLButtonElement | null {
      return hostEl.querySelector(`${selector} button`);
    }

    function spinnerOf(selector: string): HTMLElement | null {
      return hostEl.querySelector(`${selector} lib-spinner`);
    }

    beforeEach(() => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showOptionalAction', true);
      fixture.detectChanges();
    });

    it('should not render spinners in the actions by default', () => {
      expect(spinnerOf('.drawer-action-primary')).toBeNull();
      expect(spinnerOf('.drawer-action-secondary')).toBeNull();
      expect(spinnerOf('.drawer-action-optional')).toBeNull();
    });

    it('should render the spinner and disable the primary action when primaryActionLoading is true', () => {
      fixture.componentRef.setInput('primaryActionLoading', true);
      fixture.detectChanges();

      expect(spinnerOf('.drawer-action-primary')).toBeTruthy();
      expect(nativeButtonOf('.drawer-action-primary')?.getAttribute('aria-busy')).toBe('true');
      expect(nativeButtonOf('.drawer-action-primary')?.disabled).toBe(true);
    });

    it('should render the spinner and disable the secondary action when secondaryActionLoading is true', () => {
      fixture.componentRef.setInput('secondaryActionLoading', true);
      fixture.detectChanges();

      expect(spinnerOf('.drawer-action-secondary')).toBeTruthy();
      expect(nativeButtonOf('.drawer-action-secondary')?.getAttribute('aria-busy')).toBe('true');
      expect(nativeButtonOf('.drawer-action-secondary')?.disabled).toBe(true);
    });

    it('should render the spinner and disable the optional action when optionalActionLoading is true', () => {
      fixture.componentRef.setInput('optionalActionLoading', true);
      fixture.detectChanges();

      expect(spinnerOf('.drawer-action-optional')).toBeTruthy();
      expect(nativeButtonOf('.drawer-action-optional')?.getAttribute('aria-busy')).toBe('true');
      expect(nativeButtonOf('.drawer-action-optional')?.disabled).toBe(true);
    });

    it('should not emit primaryActionClick while primaryActionLoading is true', () => {
      const spy = vi.fn();
      component.primaryActionClick.subscribe(spy);

      fixture.componentRef.setInput('primaryActionLoading', true);
      fixture.detectChanges();

      nativeButtonOf('.drawer-action-primary')?.click();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit secondaryActionClick while secondaryActionLoading is true', () => {
      const spy = vi.fn();
      component.secondaryActionClick.subscribe(spy);

      fixture.componentRef.setInput('secondaryActionLoading', true);
      fixture.detectChanges();

      nativeButtonOf('.drawer-action-secondary')?.click();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit optionalActionClick while optionalActionLoading is true', () => {
      const spy = vi.fn();
      component.optionalActionClick.subscribe(spy);

      fixture.componentRef.setInput('optionalActionLoading', true);
      fixture.detectChanges();

      nativeButtonOf('.drawer-action-optional')?.click();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should keep the other actions interactive while the primary action is loading', () => {
      const spy = vi.fn();
      component.secondaryActionClick.subscribe(spy);

      fixture.componentRef.setInput('primaryActionLoading', true);
      fixture.detectChanges();

      nativeButtonOf('.drawer-action-secondary')?.click();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('event emissions', () => {
    it('should emit primaryActionClick when onPrimaryActionClick is called', () => {
      const spy = vi.fn();
      component.primaryActionClick.subscribe(spy);

      component.onPrimaryActionClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalled();
    });

    it('should emit secondaryActionClick when onSecondaryActionClick is called', () => {
      const spy = vi.fn();
      component.secondaryActionClick.subscribe(spy);

      component.onSecondaryActionClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalled();
    });

    it('should emit optionalActionClick when onOptionalActionClick is called', () => {
      const spy = vi.fn();
      component.optionalActionClick.subscribe(spy);

      component.onOptionalActionClick(new MouseEvent('click'));
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('testId', () => {
    it('should set data-testid on drawer root', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('testId', 'my-drawer');
      fixture.detectChanges();

      const root = findDrawerRoot(hostEl);
      expect(root?.getAttribute('data-testid')).toBe('my-drawer');
    });

    it('should not have data-testid when testId is not set', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const root = findDrawerRoot(hostEl);
      expect(root?.getAttribute('data-testid')).toBeFalsy();
    });
  });

  describe('aria attributes', () => {
    it('should set aria-label on panel when provided', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('ariaLabel', 'Test drawer');
      fixture.detectChanges();

      const panel = hostEl.querySelector('.drawer-panel')!;
      expect(panel.getAttribute('aria-label')).toBe('Test drawer');
    });

    it('should not set aria-label when not provided', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const panel = hostEl.querySelector('.drawer-panel')!;
      expect(panel.hasAttribute('aria-label')).toBe(false);
    });

    it('should set aria-labelledby on panel when provided', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('ariaLabelledBy', 'heading-id');
      fixture.detectChanges();

      const panel = hostEl.querySelector('.drawer-panel')!;
      expect(panel.getAttribute('aria-labelledby')).toBe('heading-id');
    });

    it('should set aria-modal to true when showBackdrop is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const panel = hostEl.querySelector('.drawer-panel')!;
      expect(panel.getAttribute('aria-modal')).toBe('true');
    });

    it('should not set aria-modal when showBackdrop is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showBackdrop', false);
      fixture.detectChanges();

      const panel = hostEl.querySelector('.drawer-panel')!;
      expect(panel.getAttribute('aria-modal')).toBeNull();
    });
  });

  describe('hostClass', () => {
    it('should default to position-right', () => {
      expect(component.hostClass()).toBe('position-right');
    });

    it('should set position-center when position is center', () => {
      fixture.componentRef.setInput('position', 'center');
      fixture.detectChanges();
      expect(component.hostClass()).toBe('position-center');
    });
  });

  describe('animation — shouldSkipAnimation', () => {
    it('should close immediately without animation when prefers-reduced-motion', () => {
      matchMediaSpy.mockReturnValue({ matches: true });
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      expect(findDrawerRoot(hostEl)).toBeTruthy();

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      // with skip animation, root is removed immediately
      expect(findDrawerRoot(hostEl)).toBeNull();
      expect(component.isClosing()).toBe(false);
    });

    it('should add isClosing class during normal close (with animation)', () => {
      matchMediaSpy.mockReturnValue({ matches: false });
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      expect(component.isClosing()).toBe(true);
      expect(findDrawerRoot(hostEl)?.classList.contains('drawer-root-closing')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle rapid open/close toggles without errors', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      expect(findDrawerRoot(hostEl)).toBeTruthy();

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();
      expect(component.isClosing()).toBe(true);

      // rapid re-open while closing
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      expect(component.isRendered()).toBe(true);
      expect(component.isClosing()).toBe(false);
    });

    it('should only finalizeClose when isClosing is true', async () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      // manually reset isClosing before timeout fires
      component.isClosing.set(false);

      await new Promise((r) => setTimeout(r, 350));
      fixture.detectChanges();

      // root should still be rendered (finalizeClose was guarded)
      expect(findDrawerRoot(hostEl)).toBeTruthy();
    });

    it('should not render anything when open is false initially (double check)', () => {
      expect(findDrawerRoot(hostEl)).toBeNull();
      expect(component.isRendered()).toBe(false);
      expect(component.isClosing()).toBe(false);
    });

    it('should have correct host class after position change at runtime', () => {
      expect(component.hostClass()).toBe('position-right');

      fixture.componentRef.setInput('position', 'center');
      fixture.detectChanges();
      expect(component.hostClass()).toBe('position-center');
    });
  });
});

describe('DrawerComponent via TestHost', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let hostEl: HTMLElement;

  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostEl = hostFixture.nativeElement;
    hostFixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render default content via ng-content', () => {
    hostComponent.open = true;
    hostFixture.detectChanges();

    const body = hostEl.querySelector('.drawer-body');
    expect(body?.textContent).toContain('Default content');
  });

  it('should render custom footer via ng-content select', () => {
    hostComponent.open = true;
    hostComponent.showCustomFooter = true;
    hostFixture.detectChanges();

    const footer = hostEl.querySelector('.drawer-footer');
    expect(footer?.textContent).toContain('Footer content');
  });

  it('should not render default actions when custom footer is shown', () => {
    hostComponent.open = true;
    hostComponent.showCustomFooter = true;
    hostFixture.detectChanges();

    expect(hostEl.querySelector('.drawer-action-primary')).toBeNull();
    expect(hostEl.querySelector('.drawer-action-secondary')).toBeNull();
  });
});
