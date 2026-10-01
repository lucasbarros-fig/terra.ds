/** Dados das jornadas (public/j/data.js, carregado antes do app em window.JORNADAS). */
export const J: any = (globalThis as any).JORNADAS;
/** Prefixo dos arquivos do artefato (banners, prints) quando a tela roda embutida em terra/dashboard/. */
export const ASSET: string = (globalThis as any).JV_ASSET_BASE ?? '';

/** Topo padrão de todas as telas (pessoa logada, notificações, loja e configurações). Base: Figma "Dashboard | The House". */
J.topo = {
  account: { name: 'Gilberto', role: 'Gestor Master' },
  versao: 'Versão 3.0.7',
  notificacoes: [
    { id: 'n1', texto: 'A proposta #302158 de João Silva recebeu um novo comentário. Acesse para visualizar os detalhes.', data: '14/03/2024 às 12h34', lida: false },
    { id: 'n2', texto: 'A proposta #696123 de Maria Oliveira foi atualizada para "Em aprovação". Acompanhe o andamento da solicitação.', data: '14/03/2024 às 12h34', lida: false },
    { id: 'n3', texto: 'A proposta #312452 de Carlos Santos possui um novo documento solicitado. Realize o envio para avançar.', data: '14/03/2024 às 12h34', lida: true },
  ],
  configuracoes: [
    { value: 'conta', label: 'Conta', icon: 'profile--duotone', group: 'Configurações' },
    { value: 'loja', label: 'Loja', icon: 'store--duotone', group: 'Configurações' },
    { value: 'seguranca', label: 'Segurança', icon: 'lock-key--duotone', group: 'Configurações' },
    { value: 'sessoes', label: 'Sessões confiáveis', icon: 'monitor-mobbile--duotone', group: 'Configurações' },
    { value: 'plano', label: 'Plano', icon: 'card--duotone', group: 'Configurações', disabled: true, emBreve: true },
    { value: 'termos', label: 'Termos e Condições', icon: 'document-text-vertical--duotone', group: 'Outros' },
    { value: 'ajuda', label: 'Central de Ajuda', icon: 'Help--duotone', group: 'Outros' },
    { value: 'sair', label: 'Sair', icon: 'logout--duotone', group: 'Outros' },
  ],
  loja: [
    { value: 'ir', label: 'Ir para loja', icon: 'store--duotone' },
    { value: 'copiar', label: 'Copiar link da loja', icon: 'copy--duotone' },
  ],
};

/** Ícones do TeddyDS usados nos dados → ícones Solaris do Terra. */
const ICONES: Record<string, string> = {
  'Help--duotone': 'Question', 'activity--duotone': 'Pulse', 'add-circle--duotone': 'PlusCircle',
  'arrange-horizontal--duotone': 'ArrowsLeftRight', 'arrow-left--duotone': 'ArrowLeft', 'arrow-right--duotone': 'ArrowRight',
  'bank--duotone': 'Bank', 'briefcase--duotone': 'Briefcase', 'building-classic--duotone': 'Bank',
  'building-commercial--duotone': 'Storefront', 'building-modern--duotone': 'Buildings', 'buildings--duotone': 'Buildings',
  'calculator--duotone': 'Calculator', 'calendar--duotone': 'Calendar', 'call--duotone': 'Phone', 'car--duotone': 'Car',
  'card--duotone': 'CreditCard', 'chart-column--duotone': 'ChartBar', 'chart-simple--duotone': 'ChartLine',
  'check--duotone': 'Check', 'check-circle--duotone': 'CheckCircle', 'chevron-down--duotone': 'CaretDown',
  'chevron-down--filled': 'CaretDown', 'chevron-right--duotone': 'CaretRight', 'city--duotone': 'City',
  'clipboard-text--duotone': 'ClipboardText', 'clock--duotone': 'Clock', 'close--duotone': 'X',
  'close-circle--duotone': 'XCircle', 'copy--duotone': 'Copy', 'courthouse--duotone': 'Bank', 'danger--duotone': 'Warning',
  'direct--duotone': 'Envelope', 'directbox-receive--duotone': 'Tray', 'document-download--duotone': 'FileArrowDown',
  'document-normal--duotone': 'File', 'document-text-vertical--duotone': 'FileText',
  'dollar-sign-circle--duotone': 'CurrencyCircleDollar', 'dollar-sign-square--duotone': 'CurrencyDollar',
  'double-check--duotone': 'Checks', 'edit--duotone': 'PencilSimple', 'email--duotone': 'Envelope',
  'export-up-right-square--duotone': 'ArrowSquareOut', 'eye--duotone': 'Eye', 'filter-remove--duotone': 'FunnelX',
  'filter-search--duotone': 'Funnel', 'folder--duotone': 'Folder', 'folder-open--duotone': 'FolderOpen',
  'gallery--duotone': 'Image', 'home--duotone': 'House', 'house--duotone': 'House', 'lock-key--duotone': 'LockKey',
  'logout--duotone': 'SignOut', 'mobile--duotone': 'DeviceMobile', 'money-change--duotone': 'ArrowsClockwise',
  'monitor--duotone': 'Monitor', 'monitor-mobbile--duotone': 'Devices', 'more--duotone': 'DotsThreeVertical',
  'notification--duotone': 'Bell', 'paint-brush--duotone': 'PaintBrush', 'people--duotone': 'Users',
  'person-id--duotone': 'IdentificationCard', 'profile--duotone': 'User', 'profiles--duotone': 'UsersThree',
  'ray--duotone': 'Sparkle', 'receipt-search--duotone': 'MagnifyingGlass', 'search-normal--duotone': 'MagnifyingGlass',
  'search-status--duotone': 'ListMagnifyingGlass', 'security-user--duotone': 'ShieldCheck', 'share--duotone': 'ShareNetwork',
  'shield-check--duotone': 'ShieldCheck', 'shine--duotone': 'Sparkle', 'status-up--duotone': 'TrendUp',
  'stickynote-add--duotone': 'NotePencil', 'store--duotone': 'Storefront', 'trash-can--duotone': 'Trash',
  'unlock--duotone': 'LockOpen', 'user--duotone': 'User', 'wallet-card-dot-add--duotone': 'Wallet',
  'whatsapp--duotone': 'WhatsappLogo', 'route-square--duotone': 'Path',
};
export function ic(name: string | undefined | null): string {
  if (!name) return 'Circle';
  return ICONES[name] ?? name;
}

export function brl(v: number): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function semAcento(s: string): string {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
export function dataBR(iso: string): string {
  const p = iso.split('-');
  return `${p[2]}/${p[1]}/${p[0]}`;
}
