import { NgFor, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import type { IconNameType } from '../icon/icon.component';

export interface Tab {
  label: string;
  icon: IconNameType;
  disabled?: boolean;
}

@Component({
  selector: 'lib-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() selected = 0;

  @Output() readonly selectedChange = new EventEmitter<number>();

  onTabClick(index: number): void {
    const tab = this.tabs[index];
    if (tab?.disabled) return;
    this.selected = index;
    this.selectedChange.emit(index);
    this.mostrarAba(index);
  }

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Com abas roladas para o lado, traz a aba escolhida para a área visível. */
  private mostrarAba(index: number): void {
    const el = this.host.nativeElement;
    const tab = el.querySelectorAll<HTMLElement>('.tab')[index];
    if (!tab || el.scrollWidth <= el.clientWidth) return;
    const ini = tab.offsetLeft, fim = ini + tab.offsetWidth;
    if (ini < el.scrollLeft) el.scrollTo({ left: ini - 16, behavior: 'smooth' });
    else if (fim > el.scrollLeft + el.clientWidth) el.scrollTo({ left: fim - el.clientWidth + 16, behavior: 'smooth' });
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    let next = -1;

    if (event.key === 'ArrowRight') {
      next = this.findNextEnabled(index, 1);
    } else if (event.key === 'ArrowLeft') {
      next = this.findNextEnabled(index, -1);
    } else if (event.key === 'Home') {
      next = this.findNextEnabled(-1, 1);
    } else if (event.key === 'End') {
      next = this.findNextEnabled(this.tabs.length, -1);
    }

    if (next >= 0) {
      event.preventDefault();
      this.onTabClick(next);
    }
  }

  private findNextEnabled(from: number, direction: 1 | -1): number {
    let i = from + direction;
    while (i >= 0 && i < this.tabs.length) {
      if (!this.tabs[i].disabled) return i;
      i += direction;
    }
    return -1;
  }
}
