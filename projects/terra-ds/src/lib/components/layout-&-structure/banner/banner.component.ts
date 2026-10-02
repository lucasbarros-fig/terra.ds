import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { IconButtonComponent } from '../../actions/icon-button/icon-button.component';

export interface BannerSlide {
  src: string;
  alt: string;
  /** Quando informado, o slide inteiro vira um link. */
  href?: string;
}

/**
 * Banner — carrossel de imagens para comunicação institucional e campanhas.
 * Figma: Terra.ds › Layout & Structure › Banner.
 *
 * Altura fixa (padrão 400px) e largura fluida. Setas (`lib-icon-button` Neutral) nas laterais
 * e indicador de página centralizado na base. Navegação circular, teclado ←/→ (Home/End),
 * autoplay opcional que pausa em hover/foco e é desativado com `prefers-reduced-motion`.
 *
 * Slides customizados: passe `items` e um `slideTemplate` (ng-template com `let-item`) para montar
 * banners em HTML (ex.: produto com título, texto e botão) mantendo setas, paginação e autoplay.
 */
@Component({
  selector: 'lib-banner',
  standalone: true,
  imports: [IconButtonComponent, NgTemplateOutlet],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-terra-ds': '',
    class: 'lib-banner',
    role: 'region',
    'aria-roledescription': 'carrossel',
    '[attr.aria-label]': 'ariaLabel()',
    '[class.lib-banner--with-pagination]': 'hasPagination()',
    '[style.--banner-height.px]': 'height()',
    '(keydown)': 'onKeydown($event)',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class BannerComponent {
  slides = input<BannerSlide[]>([]);
  showArrows = input(true);
  showPagination = input(true);
  autoplay = input(false);
  /** Intervalo do autoplay em milissegundos. */
  interval = input(6000);
  /** Altura do banner em px. */
  height = input(400);
  ariaLabel = input('Banners');
  /** Dados dos slides customizados (usados com `slideTemplate`). */
  items = input<unknown[]>([]);
  /** Template de cada slide customizado; recebe o item em `$implicit` e o índice em `index`. */
  slideTemplate = input<TemplateRef<unknown> | null>(null);

  /** Lista efetiva de slides: itens customizados ou imagens. */
  readonly lista = computed<unknown[]>(() => (this.slideTemplate() ? this.items() : this.slides()));

  /** Índice do slide ativo. Suporta `[(activeIndex)]`. */
  activeIndex = model(0);

  readonly hovered = signal(false);
  readonly focused = signal(false);
  private readonly reducedMotion = signal(false);

  readonly count = computed(() => this.lista().length);
  readonly hasMultiple = computed(() => this.count() > 1);
  readonly hasArrows = computed(() => this.showArrows() && this.hasMultiple());
  readonly hasPagination = computed(() => this.showPagination() && this.hasMultiple());

  /** Índice normalizado (sempre dentro do intervalo de slides). */
  readonly current = computed(() => this.normalize(this.activeIndex()));

  readonly isRotating = computed(
    () =>
      this.autoplay() &&
      this.hasMultiple() &&
      !this.reducedMotion() &&
      !this.hovered() &&
      !this.focused(),
  );

  protected asSlide(item: unknown): BannerSlide { return item as BannerSlide; }

  readonly trackTransform = computed(() => `translateX(-${this.current() * 100}%)`);

  constructor() {
    const destroyRef = inject(DestroyRef);

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion.set(media.matches);
      const onChange = (event: MediaQueryListEvent): void => this.reducedMotion.set(event.matches);
      media.addEventListener('change', onChange);
      destroyRef.onDestroy(() => media.removeEventListener('change', onChange));
    }

    effect((onCleanup) => {
      if (!this.isRotating()) return;
      const id = setInterval(() => this.next(), Math.max(1000, this.interval()));
      onCleanup(() => clearInterval(id));
    });
  }

  previous(): void {
    this.goTo(this.current() - 1);
  }

  next(): void {
    this.goTo(this.current() + 1);
  }

  goTo(index: number): void {
    if (!this.count()) return;
    const target = this.normalize(index);
    if (target !== this.activeIndex()) this.activeIndex.set(target);
  }

  slideLabel(index: number): string {
    return `${index + 1} de ${this.count()}`;
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.hasMultiple()) return;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => this.previous(),
      ArrowRight: () => this.next(),
      Home: () => this.goTo(0),
      End: () => this.goTo(this.count() - 1),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement | null;
    const next = event.relatedTarget as Node | null;
    if (!host || !next || !host.contains(next)) this.focused.set(false);
  }

  private normalize(index: number): number {
    const n = this.count();
    if (!n) return 0;
    return ((index % n) + n) % n;
  }
}
