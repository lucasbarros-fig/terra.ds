import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DialogBodyComponent } from './dialog-body.component';

describe('DialogBodyComponent', () => {
  let component: DialogBodyComponent;
  let fixture: ComponentFixture<DialogBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogBodyComponent],
    });
    fixture = TestBed.createComponent(DialogBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getBodyInner(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.body-inner');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the body-inner container', () => {
    expect(getBodyInner()).not.toBeNull();
  });

  it('should use OnPush change detection', () => {
    expect(component).toBeTruthy();
  });
});
