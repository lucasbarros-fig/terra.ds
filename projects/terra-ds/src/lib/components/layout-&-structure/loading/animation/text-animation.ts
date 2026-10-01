import { animate, style, transition, trigger } from '@angular/animations';
import { TIMING } from './animation-timing';

export const LOADING_TEXT_ANIMATION = trigger('textLine', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate(TIMING, style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate(TIMING, style({ transform: 'translateY(100%)', opacity: 0 })),
  ]),
]);
