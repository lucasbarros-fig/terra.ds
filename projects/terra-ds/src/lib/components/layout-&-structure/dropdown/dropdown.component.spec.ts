import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownItemComponent } from './components';
import { DropdownTriggerDirective } from './directives/dropdown-trigger.directive';
import { DropdownComponent, type TerraDropdownFocusPanelOnOpen } from './dropdown.component';

@Component({
  standalone: true,
  imports: [DropdownComponent, DropdownItemComponent, DropdownTriggerDirective],
  template: `
    <lib-dropdown
      [focusPanelOnOpen]="focusPanelOnOpen"
      (opened)="openedCount = openedCount + 1"
      (closed)="closedCount = closedCount + 1"
    >
      <button
        libDropdownTrigger
        type="button"
        [toggleOnClick]="toggleOnClick"
        [triggerDisabled]="triggerDisabled"
        [applyHostAria]="applyHostAria"
      >
        Abrir
      </button>
      <lib-dropdown-item label="Um"></lib-dropdown-item>
      <lib-dropdown-item label="Dois"></lib-dropdown-item>
    </lib-dropdown>
  `,
})
class DropdownHostComponent {
  focusPanelOnOpen: TerraDropdownFocusPanelOnOpen = 'first-item';
  toggleOnClick = true;
  triggerDisabled = false;
  applyHostAria = true;
  openedCount = 0;
  closedCount = 0;
}

describe('DropdownComponent', () => {
  let fixture: ComponentFixture<DropdownHostComponent>;
  let host: DropdownHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DropdownHostComponent] });
    fixture = TestBed.createComponent(DropdownHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getTrigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('[libDropdownTrigger]');
  }

  function getDropdown(): DropdownComponent {
    return fixture.debugElement.query(By.directive(DropdownComponent)).componentInstance;
  }

  function getPanel(): HTMLElement | null {
    return document.querySelector('.terra-dropdown__panel');
  }

  function clickTrigger(): void {
    getTrigger().click();
    fixture.detectChanges();
  }

  function setHost(patch: Partial<DropdownHostComponent>): void {
    Object.assign(host, patch);
    fixture.detectChanges();
  }

  it('should toggle on trigger click and reflect the state on the trigger ARIA', () => {
    const trigger = getTrigger();
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    clickTrigger();

    expect(getPanel()).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(getPanel()?.id);

    clickTrigger();

    expect(getPanel()).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should only open on click when toggleOnClick is false', () => {
    setHost({ toggleOnClick: false });

    clickTrigger();
    clickTrigger();

    expect(getPanel()).not.toBeNull();
    expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('should not open on click when triggerDisabled is true', () => {
    setHost({ triggerDisabled: true });

    clickTrigger();

    expect(getPanel()).toBeNull();
    expect(host.openedCount).toBe(0);
  });

  it('should not set ARIA on the host when applyHostAria is false', () => {
    setHost({ applyHostAria: false });
    clickTrigger();

    const trigger = getTrigger();
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
    expect(trigger.hasAttribute('aria-expanded')).toBe(false);
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
  });

  it('should focus the first item on open by default', async () => {
    clickTrigger();
    await Promise.resolve();

    expect(document.activeElement?.textContent?.trim()).toBe('Um');
  });

  it('should keep focus on the trigger when focusPanelOnOpen is none', async () => {
    setHost({ focusPanelOnOpen: 'none' });
    const trigger = getTrigger();
    trigger.focus();

    clickTrigger();
    await Promise.resolve();

    expect(getPanel()).not.toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('should emit opened once the panel is attached and closed when it closes', () => {
    const dropdown = getDropdown();

    dropdown.openPanel();
    fixture.detectChanges();
    dropdown.openPanel();
    fixture.detectChanges();

    expect(getPanel()).not.toBeNull();
    expect(host.openedCount).toBe(1);

    dropdown.close();
    fixture.detectChanges();

    expect(getPanel()).toBeNull();
    expect(host.closedCount).toBe(1);
    expect(document.activeElement).toBe(getTrigger());
  });
});
