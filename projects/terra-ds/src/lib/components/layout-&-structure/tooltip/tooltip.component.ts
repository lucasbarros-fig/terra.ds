import { NgClass, NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import type { IconColorType, IconSizeType } from '../icon/utils/theme';
import { resolveIconColor } from '../icon/utils/theme';
import type { IconNameType } from '../icon/icon.component';

export type TooltipArrow = 'start' | 'middle' | 'end';
export type TooltipIndicator = 'top' | 'bottom' | 'right' | 'left';

@Component({
  selector: 'lib-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent implements AfterContentInit, OnDestroy {
  @Input() arrow: TooltipArrow = 'middle';
  @Input() indicator: TooltipIndicator = 'top';
  @Input() text = '';
  @Input() triggerIcon: IconNameType = 'Info';
  @Input() triggerIconColor: IconColorType = 'inherit';
  @Input() triggerSize: IconSizeType = 16;
  @Input() media: string | null = null;
  @Input() mediaAlt = '';

  get resolvedTriggerIconColor(): string {
    return resolveIconColor(this.triggerIconColor);
  }

  @ViewChild('projection', { static: true })
  private projection!: ElementRef<HTMLElement>;

  protected hoverInside = false;
  protected hasProjectedTrigger = false;

  private hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    const hasContent = Array.from(this.projection.nativeElement.childNodes).some(
      (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        if (node.nodeType === Node.TEXT_NODE) {
          return (node.textContent ?? '').trim().length > 0;
        }
        return false;
      },
    );
    if (hasContent !== this.hasProjectedTrigger) {
      this.hasProjectedTrigger = hasContent;
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.clearHoverCloseTimer();
  }

  onContainerEnter(): void {
    this.clearHoverCloseTimer();
    if (!this.hoverInside) {
      this.hoverInside = true;
      this.cdr.markForCheck();
    }
  }

  onContainerLeave(): void {
    this.clearHoverCloseTimer();
    this.hoverCloseTimer = setTimeout(() => {
      this.hoverInside = false;
      this.hoverCloseTimer = null;
      this.cdr.markForCheck();
    }, 80);
  }

  private clearHoverCloseTimer(): void {
    if (this.hoverCloseTimer !== null) {
      clearTimeout(this.hoverCloseTimer);
      this.hoverCloseTimer = null;
    }
  }

  get caretViewBox(): string {
    if (this.indicator === 'left' || this.indicator === 'right') {
      return '-1 0 10 20';
    }
    return '0 -1 20 10';
  }

  get caretFillPath(): string {
    switch (this.indicator) {
      case 'top':
        return 'M 0 1 C 5 1, 7 9, 10 9 C 13 9, 15 1, 20 1 L 20 -1 L 0 -1 Z';
      case 'bottom':
        return 'M 0 8 C 5 8, 7 0, 10 0 C 13 0, 15 8, 20 8 L 20 9 L 0 9 Z';
      case 'left':
        return 'M 0 0 C 0 5, 8 7, 8 10 C 8 13, 0 15, 0 20 L -1 20 L -1 0 Z';
      case 'right':
        return 'M 8 0 C 8 5, 0 7, 0 10 C 0 13, 8 15, 8 20 L 9 20 L 9 0 Z';
    }
  }

  get caretStrokePath(): string {
    switch (this.indicator) {
      case 'top':
        return 'M 0 1 C 5 1, 7 9, 10 9 C 13 9, 15 1, 20 1';
      case 'bottom':
        return 'M 0 8 C 5 8, 7 0, 10 0 C 13 0, 15 8, 20 8';
      case 'left':
        return 'M 0 0 C 0 5, 8 7, 8 10 C 8 13, 0 15, 0 20';
      case 'right':
        return 'M 8 0 C 8 5, 0 7, 0 10 C 0 13, 8 15, 8 20';
    }
  }
}
