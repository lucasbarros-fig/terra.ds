import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusComponent } from '../status/status.component';

export type GoalProgressStatus = 'positive' | 'warning' | 'neutral';

/**
 * Goal Progress — avanço de uma meta: rótulo, valor atual vs. meta, barra com marcador da meta
 * e Status com nota de contexto.
 * Figma: Terra.ds › Feedback › Goal Progress.
 *
 * Status: Positive (meta atingida ou dentro do limite), Warning (abaixo da meta ou do ritmo)
 * e Neutral (em andamento, sem avaliação). O texto do status é sempre visível — nunca só cor.
 */
@Component({
  selector: 'lib-goal-progress',
  standalone: true,
  imports: [StatusComponent],
  templateUrl: './goal-progress.component.html',
  styleUrls: ['./goal-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-terra-ds': '' },
})
export class GoalProgressComponent {
  label = input('Meta');
  /** Texto exibido à direita do rótulo (ex.: "42 de 60", "92% · meta 90%"). */
  valueText = input('0 de 0');

  /** Valor atual, na mesma escala de `max`. */
  value = input(0);
  max = input(100);
  /** Posição do marcador da meta, na mesma escala de `max`. Omitido = sem marcador. */
  target = input<number | null | undefined>(undefined);

  status = input<GoalProgressStatus>('positive');
  statusLabel = input('Atingida');
  note = input('Nota de contexto');

  /** Métrica em que menor é melhor (ex.: tempo médio). Afeta apenas a semântica do `aria-valuetext`. */
  lowerIsBetter = input(false);
  /** Substitui o `aria-valuetext` gerado automaticamente. */
  ariaValueText = input('');

  protected readonly safeMax = computed(() => (this.max() > 0 ? this.max() : 100));

  protected readonly clampedValue = computed(() =>
    Math.min(Math.max(this.value(), 0), this.safeMax()),
  );

  /** Progresso em fração 0–1. */
  protected readonly progress = computed(() => this.clampedValue() / this.safeMax());

  /** Posição do marcador em fração 0–1, ou `null` sem meta. */
  protected readonly targetPosition = computed(() => {
    const target = this.target();
    if (target === null || target === undefined) return null;
    return Math.min(Math.max(target, 0), this.safeMax()) / this.safeMax();
  });

  protected readonly computedValueText = computed(() => {
    if (this.ariaValueText()) return this.ariaValueText();

    const parts = [`${Math.round(this.progress() * 100)}%`];
    const target = this.targetPosition();
    if (target !== null) {
      parts.push(`${this.lowerIsBetter() ? 'limite' : 'meta'} ${Math.round(target * 100)}%`);
    }
    if (this.statusLabel()) parts.push(this.statusLabel().toLocaleLowerCase('pt-BR'));
    if (this.lowerIsBetter()) parts.push('menor é melhor');
    return parts.join(', ');
  });
}
