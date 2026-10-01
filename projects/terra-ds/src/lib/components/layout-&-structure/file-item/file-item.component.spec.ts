import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { FileItemComponent } from './file-item.component';

describe('FileItemComponent', () => {
  let component: FileItemComponent;
  let fixture: ComponentFixture<FileItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FileItemComponent],
    });
    fixture = TestBed.createComponent(FileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getRoot(): HTMLElement {
    return fixture.nativeElement.querySelector('.lib-file-item');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default title and caption', () => {
    const title = fixture.nativeElement.querySelector('.lib-file-item__title');
    const caption = fixture.nativeElement.querySelector('.lib-file-item__caption');
    expect(title?.textContent?.trim()).toBe('file_title.type');
    expect(caption?.textContent?.trim()).toBe('00MB • 20/11/26');
  });

  it('should format Date input as dd/mm/yy', () => {
    fixture.componentRef.setInput('date', new Date(2026, 10, 20));
    fixture.detectChanges();
    const caption = fixture.nativeElement.querySelector('.lib-file-item__caption');
    expect(caption?.textContent?.trim()).toBe('00MB • 20/11/26');
  });

  it('should format ISO date string as dd/mm/yy', () => {
    fixture.componentRef.setInput('date', '2026-11-20');
    fixture.detectChanges();
    const caption = fixture.nativeElement.querySelector('.lib-file-item__caption');
    expect(caption?.textContent?.trim()).toBe('00MB • 20/11/26');
  });

  it('should convert dd/mm/yyyy string to dd/mm/yy', () => {
    fixture.componentRef.setInput('date', '20/11/2026');
    fixture.detectChanges();
    const caption = fixture.nativeElement.querySelector('.lib-file-item__caption');
    expect(caption?.textContent?.trim()).toBe('00MB • 20/11/26');
  });

  it('should omit date when showDate is false', () => {
    fixture.componentRef.setInput('showDate', false);
    fixture.detectChanges();
    const caption = fixture.nativeElement.querySelector('.lib-file-item__caption');
    expect(caption?.textContent?.trim()).toBe('00MB');
  });

  it('should apply selected class', () => {
    fixture.componentRef.setInput('state', 'selected');
    fixture.detectChanges();
    expect(getRoot().classList.contains('lib-file-item--selected')).toBe(true);
  });

  it('should apply uploading class and caption', () => {
    fixture.componentRef.setInput('state', 'uploading');
    fixture.componentRef.setInput('progress', 50);
    fixture.detectChanges();
    expect(getRoot().classList.contains('lib-file-item--uploading')).toBe(true);
    const caption = fixture.nativeElement.querySelector('.lib-file-item__caption');
    expect(caption?.textContent?.trim()).toBe('Enviando • 50%');
  });

  it('should apply disabled class', () => {
    fixture.componentRef.setInput('state', 'disabled');
    fixture.detectChanges();
    expect(getRoot().classList.contains('lib-file-item--disabled')).toBe(true);
  });

  it('should apply error class and caption', () => {
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();
    expect(getRoot().classList.contains('lib-file-item--error')).toBe(true);
    const caption = fixture.nativeElement.querySelector('.lib-file-item__caption');
    expect(caption?.textContent?.trim()).toBe('Falha no envio');
  });

  it('should emit actionClicked when action is pressed', () => {
    const spy = vi.fn();
    component.actionClicked.subscribe(spy);
    const button: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('button');
    button?.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit actionClicked when disabled', () => {
    fixture.componentRef.setInput('state', 'disabled');
    fixture.detectChanges();
    const spy = vi.fn();
    component.actionClicked.subscribe(spy);
    const button: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('button');
    button?.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render slot instead of action when showSlot is true', () => {
    fixture.componentRef.setInput('showSlot', true);
    fixture.detectChanges();
    const slot: HTMLElement | null = fixture.nativeElement.querySelector(
      '.lib-file-item__slot',
    );
    expect(slot).toBeTruthy();
    expect(slot?.classList.contains('lib-file-item__slot--hidden')).toBe(false);
    expect(fixture.nativeElement.querySelector('lib-icon-button')).toBeNull();
  });
});
