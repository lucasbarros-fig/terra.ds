import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperComponent, type HelperColor } from './helper.component';

describe('HelperComponent', () => {
  let component: HelperComponent;
  let fixture: ComponentFixture<HelperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HelperComponent]
    });
    fixture = TestBed.createComponent(HelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should derive icon from color', () => {
    const cases: Array<[HelperColor, string]> = [
      ['neutral', 'Info'],
      ['informative', 'Info'],
      ['warning', 'WarningCircle'],
      ['positive', 'CheckCircle'],
      ['negative', 'XCircle'],
    ];
    for (const [color, expected] of cases) {
      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();
      expect(component.icon).toBe(expected);
    }
  });
});
