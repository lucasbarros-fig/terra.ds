import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import type { ToastState } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastComponent],
    });
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('state input', () => {
    it('should default state to success', () => {
      expect(component.state()).toBe('success');
    });

    it('should accept error state', () => {
      fixture.componentRef.setInput('state', 'error');
      fixture.detectChanges();
      expect(component.state()).toBe('error');
    });

    it('should accept warning state', () => {
      fixture.componentRef.setInput('state', 'warning');
      fixture.detectChanges();
      expect(component.state()).toBe('warning');
    });

    it('should accept informative state', () => {
      fixture.componentRef.setInput('state', 'informative');
      fixture.detectChanges();
      expect(component.state()).toBe('informative');
    });
  });

  describe('hostClass', () => {
    it('should return toast-state-success for default state', () => {
      expect(component.hostClass).toBe('toast-state-success');
    });

    it('should return toast-state-error when state is error', () => {
      fixture.componentRef.setInput('state', 'error');
      fixture.detectChanges();
      expect(component.hostClass).toBe('toast-state-error');
    });

    it('should return toast-state-warning when state is warning', () => {
      fixture.componentRef.setInput('state', 'warning');
      fixture.detectChanges();
      expect(component.hostClass).toBe('toast-state-warning');
    });

    it('should return toast-state-informative when state is informative', () => {
      fixture.componentRef.setInput('state', 'informative');
      fixture.detectChanges();
      expect(component.hostClass).toBe('toast-state-informative');
    });
  });

  describe('resolvedIcon', () => {
    it('should return custom icon when provided', () => {
      fixture.componentRef.setInput('icon', 'Star');
      fixture.detectChanges();
      expect(component.resolvedIcon).toBe('Star');
    });

    it('should default to CheckCircle for success state', () => {
      expect(component.resolvedIcon).toBe('CheckCircle');
    });

    it('should default to XCircle for error state', () => {
      fixture.componentRef.setInput('state', 'error');
      fixture.detectChanges();
      expect(component.resolvedIcon).toBe('XCircle');
    });

    it('should default to Warning for warning state', () => {
      fixture.componentRef.setInput('state', 'warning');
      fixture.detectChanges();
      expect(component.resolvedIcon).toBe('Warning');
    });

    it('should default to Info for informative state', () => {
      fixture.componentRef.setInput('state', 'informative');
      fixture.detectChanges();
      expect(component.resolvedIcon).toBe('Info');
    });
  });

  describe('resolvedStateLabel', () => {
    it('should return custom stateLabel when provided', () => {
      fixture.componentRef.setInput('stateLabel', 'Customizado');
      fixture.detectChanges();
      expect(component.resolvedStateLabel).toBe('Customizado');
    });

    it('should default to Sucesso for success state', () => {
      expect(component.resolvedStateLabel).toBe('Sucesso');
    });

    it('should default to Erro for error state', () => {
      fixture.componentRef.setInput('state', 'error');
      fixture.detectChanges();
      expect(component.resolvedStateLabel).toBe('Erro');
    });

    it('should default to Atenção for warning state', () => {
      fixture.componentRef.setInput('state', 'warning');
      fixture.detectChanges();
      expect(component.resolvedStateLabel).toBe('Atenção');
    });

    it('should default to Informação for informative state', () => {
      fixture.componentRef.setInput('state', 'informative');
      fixture.detectChanges();
      expect(component.resolvedStateLabel).toBe('Informação');
    });
  });

  describe('close', () => {
    it('should emit closed event when close() is called', () => {
      const spy = vi.fn();
      component.closed.subscribe(spy);
      component.close();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit closed event when close button is clicked', () => {
      const spy = vi.fn();
      component.closed.subscribe(spy);
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.toast-close');
      button.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('label input', () => {
    it('should render label text in the template', () => {
      fixture.componentRef.setInput('label', 'Mensagem de teste');
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('.toast-label');
      expect(label.textContent?.trim()).toBe('Mensagem de teste');
    });
  });
});
