import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActionBarComponent } from '../action-bar.component';

@Component({
  selector: 'lib-actions-bar-container',
  templateUrl: './action-bar-container.component.html',
  styleUrls: [
    './action-bar-container.component.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class ActionsBarContainerComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('actionBarContainer', {
    static: true,
  })
  footerContainerRef!: ElementRef<HTMLElement>;

  @ContentChild(ActionBarComponent, {
    read: ElementRef,
  })
  private actionsBarRef!: ElementRef<HTMLElement>;

  containerStyle: Record<string, string> = {};
  private resizeObserver!: ResizeObserver;

  ngOnInit() {
    this.updateDrawer();
    this.observeResize();
  }

  ngAfterContentInit() {
    this.applyStyleToActionsBar();
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }

  private updateDrawer() {
    requestAnimationFrame(() => {
      const el = this.footerContainerRef.nativeElement;
      const width = el.offsetWidth;
      const height = el.offsetHeight;

      this.containerStyle = {
        position: 'fixed',
        width: `${width}px`,
        bottom: `${height}px`,
        'z-index': '9999',
        'pointer-events': 'auto',
      };

      this.applyStyleToActionsBar();
    });
  }

  private observeResize() {
    this.resizeObserver = new ResizeObserver(() => this.updateDrawer());
    this.resizeObserver.observe(this.footerContainerRef.nativeElement);
  }

  private applyStyleToActionsBar() {
    if (this.actionsBarRef?.nativeElement) {
      Object.assign(this.actionsBarRef.nativeElement.style, this.containerStyle);
    }
  }
}
