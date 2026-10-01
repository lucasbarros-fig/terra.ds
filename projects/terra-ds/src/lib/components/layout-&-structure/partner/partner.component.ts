import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

/** Parceiros disponíveis no Figma (Terra.ds | Components › Identity › Partners). */
export const PARTNER_NAMES = [
  'bradesco',
  'caixa',
  'itau',
  'santander',
  'inter',
  'brb',
  'cashme',
  'c6bank',
  'bari',
  'galleriabank',
  'creditas',
  'crediblue',
] as const;

export type PartnerName = (typeof PARTNER_NAMES)[number];
/** Fill: logo sobre a cor da marca. Solid: logo colorido sem fundo. Contrast: logo branco, para fundos escuros ou coloridos. */
export type PartnerStyle = 'fill' | 'solid' | 'contrast';
/** Default: logotipo completo. Minimal: só o símbolo. */
export type PartnerType = 'default' | 'minimal';
export type PartnerShape = 'circle' | 'rounded' | 'square';

export const PARTNER_LABELS: Readonly<Record<PartnerName, string>> = {
  bradesco: 'Bradesco',
  caixa: 'Caixa',
  itau: 'Itaú',
  santander: 'Santander',
  inter: 'Inter',
  brb: 'BRB',
  cashme: 'CashMe',
  c6bank: 'C6 Bank',
  bari: 'Banco Bari',
  galleriabank: 'Galleria Bank',
  creditas: 'Creditas',
  crediblue: 'Crediblue',
};

/** Normaliza "Itaú", "C6 Bank", "Galleria Bank" etc. para a chave do parceiro. */
export function toPartnerName(valor: string | null | undefined): PartnerName | null {
  const chave = (valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^banco/, '');
  const apelidos: Record<string, PartnerName> = { c6: 'c6bank', galleria: 'galleriabank', caixaeconomica: 'caixa', caixaeconomicafederal: 'caixa' };
  const nome = (apelidos[chave] ?? chave) as PartnerName;
  return (PARTNER_NAMES as readonly string[]).includes(nome) ? nome : null;
}

/** Os SVGs ficam num módulo separado, carregado sob demanda (chunk próprio no app). */
let logos: Promise<Readonly<Record<string, string>>> | null = null;
const carregarLogos = () => (logos ??= import('./partner-logos.data').then((m) => m.PARTNER_LOGOS));

@Component({
  selector: 'lib-partner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
  host: {
    'data-terra-ds': '',
    role: 'img',
    '[attr.aria-label]': 'rotulo()',
    '[attr.title]': 'rotulo()',
    '[class]': 'classes()',
    '[style.--partner-size.px]': 'size()',
  },
})
export class PartnerComponent {
  /** Nome do parceiro: a chave (`itau`) ou o nome de exibição (`Itaú`). Sem logo no Terra, mostra as iniciais. */
  readonly partner = input.required<string>();
  readonly partnerStyle = input<PartnerStyle>('fill');
  readonly type = input<PartnerType>('minimal');
  readonly shape = input<PartnerShape>('circle');
  /** Lado em px. */
  readonly size = input(40);
  /** Texto alternativo; por padrão, o nome do parceiro. */
  readonly label = input('');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly mapa = signal<Readonly<Record<string, string>> | null>(null);

  protected readonly nome = computed(() => toPartnerName(this.partner()));
  protected readonly rotulo = computed(() => this.label() || (this.nome() ? PARTNER_LABELS[this.nome()!] : this.partner()));

  protected readonly svg = computed<SafeHtml | null>(() => {
    const nome = this.nome();
    const mapa = this.mapa();
    if (!nome || !mapa) return null;
    const markup = mapa[`${nome}/${this.partnerStyle()}/${this.type()}`];
    // Conteúdo estático gerado a partir do Figma, sem scripts nem links.
    return markup ? this.sanitizer.bypassSecurityTrustHtml(markup) : null;
  });

  protected readonly iniciais = computed(() => {
    const partes = this.rotulo().replace(/[^A-Za-zÀ-ú0-9 ]/g, '').split(/\s+/).filter(Boolean);
    if (!partes.length) return '?';
    return (partes.length > 1 ? partes[0][0] + partes[1][0] : partes[0].slice(0, 2)).toUpperCase();
  });

  protected readonly classes = computed(() =>
    ['lib-partner', `lib-partner--${this.partnerStyle()}`, `lib-partner--${this.shape()}`, this.nome() ? '' : 'lib-partner--fallback']
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    carregarLogos().then((m) => this.mapa.set(m));
  }
}
