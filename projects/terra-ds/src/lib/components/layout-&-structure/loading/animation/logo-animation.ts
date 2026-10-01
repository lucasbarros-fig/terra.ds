import { animate, state, style, transition, trigger } from '@angular/animations';
import { TIMING } from './animation-timing';

export const LOADING_LOGO_ANIMATION = trigger('slideAnimation', [
  state('0', style({
    transform: 'translateX(-254%) scale(.75)',
    opacity: 0,
  })),
  state('1', style({
    transform: 'translateX(-132%) scale(1)',
    opacity: 0.5,
  })),
  state('2', style({
    transform: 'translateX(0) scale(1.33)',
    opacity: 1,
  })),
  state('3', style({
    transform: 'translateX(132%) scale(1)',
    opacity: 0.5,
  })),
  state('4', style({
    transform: 'translateX(254%) scale(.75)',
    opacity: 0,
  })),
  transition('0 => 1', [animate(TIMING)]),
  transition('1 => 2', [animate(TIMING)]),
  transition('2 => 3', [animate(TIMING)]),
  transition('3 => 4', [animate(TIMING)]),
]);
