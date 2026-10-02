import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, DialogBodyComponent, DialogComponent, DialogFooterComponent, DialogHeaderComponent, DrawerComponent, EmptyStateComponent,
  IconButtonComponent, IconComponent, InputTextComponent, SelectComponent, SkeletonComponent, TabsComponent, TagComponent,
} from '../../shared/terra';
import { ShellComponent } from '../../shared/shell.component';
import { AvisosService } from '../../shared/avisos.service';
import { VideoProdutoComponent } from '../../shared/video-produto.component';
import { MarcaComponent } from '../../shared/marca.component';
import { Arte, ArteComponent, ArteFormato } from '../../shared/arte.component';
import { J, semAcento } from '../../shared/data';
import { BIOS, CAPAS, INSTITUCIONAIS, SECOES, Secao } from './marketing-dados';

type Aba = 0 | 1 | 2 | 3;

/**
 * Marketing (ideia do Figma Otto · Posts & Stories, visual 100% Terra):
 * banner com vídeo, cartão da marca (loja do banker ou The House), artes por categoria em carrossel,
 * Reels, capas de destaque, bios e materiais institucionais. Visualizar abre o Drawer da arte.
 */
@Component({
  selector: 'jv-marketing',
  standalone: true,
  imports: [
    ShellComponent, FormsModule, ButtonComponent, DialogComponent, DialogHeaderComponent, DialogBodyComponent, DialogFooterComponent, DrawerComponent,
    EmptyStateComponent, IconButtonComponent, IconComponent, InputTextComponent, SelectComponent, SkeletonComponent, TabsComponent, TagComponent,
    VideoProdutoComponent, MarcaComponent, ArteComponent,
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

  /**
   * Marca das artes: vem da loja criada no fluxo de criação de loja (não se edita aqui).
   * Sem loja, as artes usam a identidade The House com o nome do consultor.
   * Protótipo: #marketing-semloja mostra o banker sem loja.
   */
  protected readonly temLoja = signal(!location.hash.includes('semloja'));
  protected readonly cor = signal('#2b7de9');
  protected readonly loja = signal(`${J.topo.account.name} Imóveis`);
  protected readonly iniciais = computed(() => {
    const p = this.loja().trim().split(/\s+/).filter(Boolean);
    return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase() || 'TH';
  });
  protected readonly identidade = computed<'loja' | 'thehouse'>(() => (this.temLoja() ? 'loja' : 'thehouse'));
  protected readonly corArte = computed(() => (this.identidade() === 'thehouse' ? '#1684E6' : this.cor()));
  protected readonly nomeArte = computed(() => (this.identidade() === 'thehouse' ? J.topo.account.name : this.loja()));

  /* Mídia */
  protected readonly tipo = signal<'posts' | 'reels'>('posts');
  protected readonly abasTipo = [{ label: 'Posts e Stories', icon: 'Images' }, { label: 'Reels', icon: 'FilmStrip' }];
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
  protected readonly abasFormato = [{ label: 'Post 1:1', icon: 'Square' }, { label: 'Story 9:16', icon: 'DeviceMobile' }];
  private readonly previa = viewChild<ElementRef<HTMLElement>>('previa');
  protected readonly baixando = signal(false);

  /* Downloads */
  protected readonly downloads = signal<{ arte: Arte; formato: ArteFormato; quando: string }[]>([]);
  protected readonly vendoDownloads = signal(false);

  /* Capas, bio, institucionais */
  protected readonly capas = CAPAS;
  protected readonly estiloCapa = signal<'cheia' | 'contorno'>('cheia');
  protected readonly abasEstiloCapa = [{ label: 'Preenchida', icon: 'Circle' }, { label: 'Contorno', icon: 'CircleDashed' }];
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
    const ok = () => { if (aviso) this.avisos.mostrar(aviso, 'success', 3000); };
    const reserva = () => {
      // Fallback para iframes sem permissão de clipboard.
      const t = document.createElement('textarea'); t.value = texto; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); ok(); } catch { this.avisos.mostrar('Não foi possível copiar automaticamente.', 'warning'); }
      t.remove();
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(texto).then(ok, reserva); else reserva();
  }
  protected legendaCompleta(a: Arte): string { return `${a.legenda}\n\n${a.hashtags.join(' ')}`; }

  /** Gera o PNG da arte a partir da prévia (1080px de largura). */
  protected async baixar(a: Arte): Promise<void> {
    const el = this.previa()?.nativeElement.querySelector<HTMLElement>('jv-arte');
    if (!el || this.baixando()) return;
    this.baixando.set(true);
    const ok = await this.gerarPng(el, a, this.formato());
    this.baixando.set(false);
    if (ok) this.avisos.mostrar('Arte baixada em alta resolução.', 'success', 3500);
  }
  private async gerarPng(el: HTMLElement, a: Arte, formato: ArteFormato): Promise<boolean> {
    try {
      const { toPng } = await import('html-to-image');
      const escala = 1080 / el.getBoundingClientRect().width;
      // Arte sai quadrada, sem o arredondamento e a sombra da prévia.
      const antes = el.getAttribute('style') ?? '';
      el.style.borderRadius = '0'; el.style.boxShadow = 'none';
      let url = '';
      try { url = await toPng(el, { pixelRatio: escala, cacheBust: true }); } finally { el.setAttribute('style', antes); }
      const link = document.createElement('a');
      link.href = url; link.download = `${a.id}-${formato}.png`; link.click();
      this.registrarDownload(a, formato);
      return true;
    } catch {
      this.avisos.mostrar('Não foi possível gerar a imagem agora. Tente de novo.', 'error');
      return false;
    }
  }
  private registrarDownload(a: Arte, formato: ArteFormato = this.formato()): void {
    const quando = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.downloads.update((l) => [{ arte: a, formato, quando }, ...l.filter((d) => !(d.arte.id === a.id && d.formato === formato))].slice(0, 20));
  }
  /* Compartilhar: folha própria (o share nativo é bloqueado dentro de iframes e em vários navegadores). */
  protected readonly compartilhando = signal<Arte | null>(null);
  private readonly previaComp = viewChild<ElementRef<HTMLElement>>('previaComp');
  protected readonly redes = [
    { id: 'whatsapp', label: 'WhatsApp', icon: 'WhatsappLogo' },
    { id: 'instagram', label: 'Instagram', icon: 'InstagramLogo' },
    { id: 'facebook', label: 'Facebook', icon: 'FacebookLogo' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'LinkedinLogo' },
    { id: 'email', label: 'E-mail', icon: 'EnvelopeSimple' },
    { id: 'copiar', label: 'Copiar legenda', icon: 'Copy' },
  ] as const;
  protected compartilhar(a: Arte): void { this.compartilhando.set(a); }
  protected async compartilharEm(rede: (typeof this.redes)[number]['id']): Promise<void> {
    const a = this.compartilhando(); if (!a) return;
    const texto = this.legendaCompleta(a), link = 'https://' + this.linkLoja();
    const msg = `${texto}\n\n${link}`;
    if (rede === 'whatsapp') this.abrir('https://wa.me/?text=' + encodeURIComponent(msg));
    if (rede === 'facebook') this.abrir('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(link) + '&quote=' + encodeURIComponent(texto));
    if (rede === 'linkedin') this.abrir('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(link));
    if (rede === 'email') this.abrir(`mailto:?subject=${encodeURIComponent(a.chamada + ' ' + a.destaque)}&body=${encodeURIComponent(msg)}`);
    if (rede === 'copiar') this.copiar(texto, 'Legenda copiada. Agora é só colar na sua rede social.');
    if (rede === 'instagram') {
      // O Instagram não aceita post pelo navegador: baixa a arte e copia a legenda para colar no app.
      this.copiar(texto, '');
      const el = this.previaComp()?.nativeElement.querySelector<HTMLElement>('jv-arte');
      if (el) await this.gerarPng(el, a, 'post');
      this.avisos.mostrar('Arte baixada e legenda copiada. Abra o Instagram, escolha a arte e cole a legenda.', 'success', 6000);
    }
  }
  private abrir(url: string): void {
    const w = window.open(url, '_blank', 'noopener');
    if (!w && !url.startsWith('mailto:')) this.avisos.mostrar('O navegador bloqueou a nova aba. Copie a legenda e cole na rede social.', 'warning', 6000);
  }

  protected criarLoja(): void { this.nav.emit('loja-minha'); }

  protected baixarCapa(c: { label: string }): void { this.avisos.mostrar(`Capa "${c.label}" baixada.`, 'success', 3000); }
  protected baixarMaterial(m: { titulo: string; formato: string }): void {
    if (m.formato === 'HTML') this.copiar(`${this.loja()} · Parceiro The House · ${this.linkLoja()}`, 'Assinatura copiada. Cole nas configurações do seu e-mail.');
    else this.avisos.mostrar(`${m.titulo} baixado.`, 'success', 3000);
  }
}
