import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, DialogBodyComponent, DialogComponent, DialogFooterComponent, DialogHeaderComponent, DrawerComponent, EmptyStateComponent,
  IconButtonComponent, IconComponent, InputTextComponent, SelectComponent, SkeletonComponent, TabsComponent, TagComponent, ToggleGroupComponent,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { AvisosService } from '../../shared/avisos.service';
import { VideoProdutoComponent } from '../../shared/video-produto.component';
import { MarcaComponent } from '../../shared/marca.component';
import { Arte, ArteComponent, ArteFormato } from '../../shared/arte.component';
import { J, semAcento } from '../../shared/data';
import { BIOS, CAPAS, CORES, INSTITUCIONAIS, SECOES, Secao } from './marketing-dados';

type Aba = 0 | 1 | 2 | 3;

/**
 * Marketing (ideia do Figma Otto · Posts & Stories, visual 100% Terra):
 * banner com vídeo, cartão da loja (personalização de cor e nome), artes por categoria em carrossel,
 * Reels, capas de destaque, bios e materiais institucionais. Visualizar abre o Drawer da arte.
 */
@Component({
  selector: 'jv-marketing',
  standalone: true,
  imports: [
    ShellComponent, FormsModule, ButtonComponent, DialogComponent, DialogHeaderComponent, DialogBodyComponent, DialogFooterComponent, DrawerComponent,
    EmptyStateComponent, IconButtonComponent, IconComponent, InputTextComponent, SelectComponent, SkeletonComponent, TabsComponent, TagComponent,
    ToggleGroupComponent, VideoProdutoComponent, MarcaComponent, ArteComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marketing.component.html',
  styleUrl: './marketing.component.scss',
})
export class MarketingComponent {
  readonly nav = output<string>();
  private readonly avisos = inject(AvisosService);

  protected readonly abas = [
    { label: 'Mídia', icon: 'Images' }, { label: 'Capas', icon: 'InstagramLogo' }, { label: 'Bio', icon: 'TextAa' }, { label: 'Institucionais', icon: 'FileText' },
  ];
  protected readonly aba = signal<Aba>(0);
  protected readonly busca = signal('');
  protected readonly carregando = signal(true);

  /* Loja do banker (personalizável) */
  protected readonly cores = CORES;
  protected readonly cor = signal(CORES[0]);
  protected readonly loja = signal(`${J.topo.account.name} Imóveis`);
  protected readonly iniciais = computed(() => {
    const p = this.loja().trim().split(/\s+/).filter(Boolean);
    return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase() || 'TH';
  });
  protected readonly personalizando = signal(false);
  protected readonly rascunho = signal({ cor: CORES[0], loja: '' });

  /* Mídia */
  protected readonly tipo = signal<'posts' | 'reels'>('posts');
  protected readonly opTipo = [
    { id: 'posts', content: 'icon-text' as const, icon: 'Images', label: 'Posts e Stories' },
    { id: 'reels', content: 'icon-text' as const, icon: 'FilmStrip', label: 'Reels' },
  ];
  protected readonly filtro = signal<string[]>([]);
  protected readonly opCategorias = SECOES.map((s) => ({ value: s.id, label: s.label }));
  protected readonly soFavoritos = signal(false);
  protected readonly favoritos = signal<Record<string, boolean>>({ 'financiamento-0': true, 'cgi-1': true });
  protected readonly qtdFavoritos = computed(() => Object.values(this.favoritos()).filter(Boolean).length);

  protected readonly secoes = computed<Secao[]>(() => {
    const q = semAcento(this.busca().trim());
    const f = this.filtro(), fav = this.favoritos(), so = this.soFavoritos();
    return SECOES
      .filter((s) => !f.length || f.includes(s.id))
      .map((s) => ({ ...s, artes: s.artes.filter((a) => (!so || fav[a.id]) && (!q || semAcento(`${a.categoria} ${a.chamada} ${a.destaque} ${a.texto}`).includes(q))) }))
      .filter((s) => s.artes.length);
  });

  /* Visualizar */
  protected readonly aberta = signal<Arte | null>(null);
  protected readonly formato = signal<ArteFormato>('post');
  protected readonly opFormato = [
    { id: 'post', content: 'text' as const, label: 'Post 1:1' },
    { id: 'story', content: 'text' as const, label: 'Story 9:16' },
  ];
  private readonly previa = viewChild<ElementRef<HTMLElement>>('previa');
  protected readonly baixando = signal(false);

  /* Downloads */
  protected readonly downloads = signal<{ arte: Arte; formato: ArteFormato; quando: string }[]>([]);
  protected readonly vendoDownloads = signal(false);

  /* Capas, bio, institucionais */
  protected readonly capas = CAPAS;
  protected readonly estiloCapa = signal<'cheia' | 'contorno'>('cheia');
  protected readonly opEstiloCapa = [
    { id: 'cheia', content: 'text' as const, label: 'Preenchida' },
    { id: 'contorno', content: 'text' as const, label: 'Contorno' },
  ];
  protected readonly bios = computed(() => BIOS.map((b) => ({ ...b, texto: b.texto.replace('{loja}', this.loja()) })));
  protected readonly linkLoja = computed(() => 'thehouse.com.br/' + semAcento(this.loja()).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  protected readonly institucionais = INSTITUCIONAIS;

  constructor() { setTimeout(() => this.carregando.set(false), 1200); }

  protected trocarAba(i: number): void { this.aba.set(i as Aba); }
  protected rolar(trilho: HTMLElement, dir: 1 | -1): void { trilho.scrollBy({ left: dir * trilho.clientWidth * 0.85, behavior: 'smooth' }); }

  protected favoritar(a: Arte, ev?: Event): void {
    ev?.stopPropagation?.();
    const novo = !this.favoritos()[a.id];
    this.favoritos.update((f) => ({ ...f, [a.id]: novo }));
    this.avisos.mostrar(novo ? 'Arte salva nos favoritos.' : 'Arte removida dos favoritos.', novo ? 'success' : 'informative', 3000);
  }
  protected alternarFavoritos(): void { this.soFavoritos.update((v) => !v); this.aba.set(0); }

  protected visualizar(a: Arte): void { this.formato.set(this.tipo() === 'reels' ? 'story' : 'post'); this.aberta.set(a); }
  protected fechar(): void { this.aberta.set(null); }

  protected copiar(texto: string, aviso = 'Copiado.'): void {
    const ok = () => this.avisos.mostrar(aviso, 'success', 3000);
    navigator.clipboard?.writeText(texto).then(ok, ok);
  }
  protected legendaCompleta(a: Arte): string { return `${a.legenda}\n\n${a.hashtags.join(' ')}`; }

  /** Gera o PNG da arte a partir da prévia (1080px de largura). */
  protected async baixar(a: Arte): Promise<void> {
    const el = this.previa()?.nativeElement.querySelector<HTMLElement>('jv-arte');
    if (!el || this.baixando()) return;
    this.baixando.set(true);
    try {
      const { toPng } = await import('html-to-image');
      const escala = 1080 / el.getBoundingClientRect().width;
      const url = await toPng(el, { pixelRatio: escala, cacheBust: true, style: { borderRadius: '0', boxShadow: 'none' } });
      const link = document.createElement('a');
      link.href = url; link.download = `${a.id}-${this.formato()}.png`; link.click();
      this.registrarDownload(a);
      this.avisos.mostrar('Arte baixada em alta resolução.', 'success', 3500);
    } catch {
      this.avisos.mostrar('Não foi possível gerar a imagem agora. Tente de novo.', 'error');
    } finally { this.baixando.set(false); }
  }
  private registrarDownload(a: Arte): void {
    const quando = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.downloads.update((l) => [{ arte: a, formato: this.formato(), quando }, ...l.filter((d) => !(d.arte.id === a.id && d.formato === this.formato()))].slice(0, 20));
  }
  protected compartilhar(a: Arte): void {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    const texto = this.legendaCompleta(a);
    if (nav.share) nav.share({ title: a.destaque, text: texto }).catch(() => {});
    else this.copiar(texto, 'Legenda copiada. Agora é só colar na sua rede social.');
  }

  /* Personalização */
  protected abrirPersonalizar(): void { this.rascunho.set({ cor: this.cor(), loja: this.loja() }); this.personalizando.set(true); }
  protected salvarPersonalizacao(): void {
    const r = this.rascunho();
    this.cor.set(r.cor); this.loja.set(r.loja.trim() || this.loja());
    this.personalizando.set(false);
    this.avisos.mostrar('Pronto! Todas as artes já estão com a sua marca.', 'success');
  }
  protected readonly previaPersonalizacao = SECOES[0].artes[0];

  protected baixarCapa(c: { label: string }): void { this.avisos.mostrar(`Capa "${c.label}" baixada.`, 'success', 3000); }
  protected baixarMaterial(m: { titulo: string; formato: string }): void {
    if (m.formato === 'HTML') this.copiar(`${this.loja()} · Parceiro The House · ${this.linkLoja()}`, 'Assinatura copiada. Cole nas configurações do seu e-mail.');
    else this.avisos.mostrar(`${m.titulo} baixado.`, 'success', 3000);
  }
}
