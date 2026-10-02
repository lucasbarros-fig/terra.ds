/* Jornadas TeddyDS: registro das jornadas por marca.
   Para adicionar uma jornada: acrescente um objeto em JORNADAS.journeys (brands, steps, content)
   e, se a tela for nova, um módulo em j/<tela>.js que registre JORNADAS.screens['<tela>']. */
window.JORNADAS = window.JORNADAS || { screens: {}, journeys: [] };

window.JORNADAS.brands = [
  { value: 'thehouse', label: 'The House' },
  { value: 'teddy', label: 'Teddy' },
  { value: 'consig', label: 'Consig' },
  { value: 'base', label: 'Base' }
];

window.JORNADAS.storybook = 'https://claude.ai/artifact/KGyyTgsmcAFdmyjoRkwXZV';

/* Menu lateral (SideNavigation) único por marca: todas as telas da marca usam o mesmo menu.
   Base: Figma "Dashboard | The House" (botão "Nova proposta" em destaque no topo).
   Cada jornada diz a qual item pertence (campo menu): clicar no item, dentro do protótipo, abre essa jornada. */
window.JORNADAS.menus = {
  thehouse: [
    { value: 'home', label: 'Home', icon: 'home--duotone' },
    { value: 'propostas', label: 'Propostas', icon: 'briefcase--duotone' },
    { value: 'base', label: 'Base de clientes', icon: 'profiles--duotone', children: [{ value: 'base-minha', label: 'Clientes' }, { value: 'base-importar', label: 'Importar clientes' }] },
    { value: 'comissoes', label: 'Comissões', icon: 'dollar-sign-square--duotone' },
    { value: 'consulta', label: 'Consulta+', icon: 'search-normal--duotone' },
    { value: 'loja', label: 'Loja', icon: 'store--duotone', children: [{ value: 'loja-minha', label: 'Minha loja' }, { value: 'loja-produtos', label: 'Produtos' }] },
    { value: 'marketing', label: 'Marketing', icon: 'gallery--duotone' },
    { value: 'simuladores', label: 'Simuladores', icon: 'calculator--duotone' }
  ]
};
/* Botão de destaque no topo do menu (Highlight Menu Item). */
window.JORNADAS.menuHighlights = { thehouse: { label: 'Nova proposta', icon: 'add-circle--duotone', value: 'nova' } };

/* Props do SideNavigation usadas por todas as telas: mesmo menu, mesmo destaque, item da jornada selecionado. */
window.JORNADAS.sideNav = function (brand, journey, onNav) {
  var J = window.JORNADAS, items = J.menus[brand] || J.menus.thehouse, hl = J.menuHighlights[brand] || J.menuHighlights.thehouse;
  function go(v) { if (v !== journey.menu && onNav) onNav(v); }
  return {
    items: items, value: journey.menu,
    highlight: hl ? { label: hl.label, icon: hl.icon, onClick: function () { go(hl.value); } } : undefined,
    onChange: go
  };
};

(function () {
  var FIGMA_FILE = 'mCjfRZJKPJJYH5jPhMx8AQ';
  function fig(node) { return 'https://www.figma.com/design/' + FIGMA_FILE + '/Nova-Proposta-%7C-The-House?node-id=' + node.replace(':', '-'); }

  var BASE_COMP = ['Theme', 'AppShell', 'SideNavigation', 'TopNavigation', 'BackgroundBanner', 'Button', 'Divisor'];

  window.JORNADAS.journeys.push({
    id: 'nova-proposta',
    title: 'Nova Proposta',
    subtitle: 'Escolha do perfil, da solução e do produto antes de preencher a proposta',
    brands: ['thehouse'],
    scope: 'exclusiva',
    menu: 'nova',
    version: 'v1',
    updated: '2026-09-30',
    screen: 'nova-proposta',
    pattern: 'Padrão 3 · Nova proposta (perguntas em sequência + painel de produto)',
    figma: { label: 'Nova Proposta | The House · página 1728x972 - L Desktop', url: fig('21327:113435') },
    description: 'O banker responde até quatro perguntas em sequência (perfil do cliente, solução, produto e como prosseguir). O painel da direita acompanha cada resposta: primeiro o passo a passo, depois os grupos de produto, a lista de produtos e, por fim, o detalhe do produto com os bancos parceiros.',
    groups: [
      { id: 'inicio', label: 'Início' },
      { id: 'pf', label: 'Pessoa Física' },
      { id: 'pj', label: 'Pessoa Jurídica' }
    ],
    steps: [
      { id: 'perfil', group: 'inicio', title: 'Identifique o perfil do cliente', state: {}, node: '21327:179923', figmaName: 'Qual o perfil do cliente?', shot: 'shots/01-perfil.png',
        about: 'Primeira tela da Nova Proposta. Só a pergunta de perfil aparece; o painel explica os quatro passos do fluxo.',
        rules: ['Não há rodapé de ações nesta etapa.', 'A pergunta seguinte só aparece depois que o perfil é escolhido.'],
        components: BASE_COMP.concat(['Avatar']) },
      { id: 'pf', group: 'pf', title: 'Pessoa Física · Qual solução oferecer', state: { perfil: 'pf' }, node: '23413:3729', figmaName: 'PF - Grupo', shot: 'shots/02-pf-solucao.png',
        about: 'Com Pessoa Física escolhida, aparece a pergunta de solução. O painel mostra os dois grupos de produto para PF e os bancos de cada grupo.',
        rules: ['A opção escolhida fica na cor da marca; a outra fica neutra e ainda pode ser trocada.', 'O rodapé passa a mostrar "Voltar".'],
        components: BASE_COMP.concat(['Card', 'PartnerLogo', 'Icon']) },
      { id: 'pf-financiamentos', group: 'pf', title: 'PF · Financiamentos', state: { perfil: 'pf', solucao: 'fin' }, node: '21327:305761', figmaName: 'PF - Imobiliário', shot: 'shots/03-pf-financiamentos.png',
        about: 'Financiamentos para PF: o painel vira "Produtos imobiliários" e lista os dois produtos da categoria.',
        rules: ['Opções: Financiamento / Aquisição de Imóvel e Financiamento para Construção.'],
        components: BASE_COMP.concat(['Card', 'PartnerLogo', 'Icon']) },
      { id: 'pf-construcao', group: 'pf', title: 'PF · Financiamento para Construção', state: { perfil: 'pf', solucao: 'fin', produto: 'construcao' }, node: '23207:2136', figmaName: 'Crédito para construção PF', shot: 'shots/05-pf-construcao.png',
        about: 'Produto escolhido: o painel mostra o detalhe do produto e surge a última pergunta, "Como deseja prosseguir?".',
        rules: ['"Preencher proposta" é a ação principal.', '"Copiar link para o cliente" mostra o Toast "Envio disponível após criar sua loja." com a ação "Criar loja" quando o banker ainda não tem loja.'],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Toast']) },
      { id: 'pf-aquisicao', group: 'pf', title: 'PF · Financiamento / Aquisição de Imóvel', state: { perfil: 'pf', solucao: 'fin', produto: 'aquisicao' }, node: '23201:57543', figmaName: 'Financiamento Imobiliário PF', shot: 'shots/06-pf-aquisicao.png',
        about: 'Detalhe do financiamento imobiliário para PF, com condições, bancos parceiros e a descrição do produto.',
        rules: ['Mesma última pergunta das outras telas de produto.'],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Toast']) },
      { id: 'pf-emprestimos', group: 'pf', title: 'PF · Empréstimos', state: { perfil: 'pf', solucao: 'emp' }, node: '23420:10087', figmaName: 'PF - Empréstimos', shot: 'shots/04-pf-emprestimos.png',
        about: 'Empréstimos para PF: o painel vira "Produtos empréstimos".',
        rules: ['Crédito com Garantia de Veículos aparece desabilitado, com o balão "Em breve".'],
        components: BASE_COMP.concat(['Card', 'PartnerLogo', 'Tooltip', 'Icon']) },
      { id: 'pf-garantia-imovel', group: 'pf', title: 'PF · Crédito com Garantia de Imóvel', state: { perfil: 'pf', solucao: 'emp', produto: 'imovel' }, node: '23207:1734', figmaName: 'Home Equity PF', shot: 'shots/07-pf-garantia-imovel.png',
        about: 'Detalhe do crédito com garantia de imóvel para PF e sócios PJ.',
        rules: ['No Figma o frame se chama "Home Equity PF", mas a tela mostra Crédito com Garantia de Imóvel.'],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Tooltip', 'Toast']) },
      { id: 'pf-garantia-veiculos', group: 'pf', title: 'PF · Crédito com Garantia de Veículos', state: { perfil: 'pf', solucao: 'emp', produto: 'veiculos' }, node: '23420:11178', figmaName: 'Emprestimo com garantia PF', shot: 'shots/08-pf-garantia-veiculos.png',
        about: 'Detalhe do crédito com garantia de veículos para PF.',
        rules: ['Atenção: na etapa anterior este produto está "Em breve" (desabilitado). Confirmar se a tela vale para quando o produto for liberado.'],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Toast']) },
      { id: 'pj', group: 'pj', title: 'Pessoa Jurídica · Qual solução oferecer', state: { perfil: 'pj' }, node: '23420:11963', figmaName: 'PJ - Imobiliário (duplicado)', shot: 'shots/09-pj-solucao.png',
        about: 'Com Pessoa Jurídica escolhida, o painel mostra os grupos de produto para PJ.',
        rules: ['No Figma há dois frames chamados "PJ - Imobiliário"; este é o da pergunta de solução.'],
        components: BASE_COMP.concat(['Card', 'PartnerLogo', 'Icon']) },
      { id: 'pj-financiamentos', group: 'pj', title: 'PJ · Financiamentos', state: { perfil: 'pj', solucao: 'fin' }, node: '21346:8613', figmaName: 'PJ - Imobiliário', shot: 'shots/10-pj-financiamentos.png',
        about: 'Financiamentos para PJ: um único produto, Financiamento / Aquisição de Imóvel.',
        rules: [],
        components: BASE_COMP.concat(['Card', 'PartnerLogo', 'Icon']) },
      { id: 'pj-aquisicao', group: 'pj', title: 'PJ · Financiamento / Aquisição de Imóvel', state: { perfil: 'pj', solucao: 'fin', produto: 'aquisicao' }, node: '23207:2561', figmaName: 'Financiamento Imobiliário PJ', shot: 'shots/11-pj-aquisicao.png',
        about: 'Detalhe do financiamento imobiliário PJ, com um único parceiro.',
        rules: ['Sem o bloco "Conheça o produto" no Figma.'],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Toast']) },
      { id: 'pj-emprestimos', group: 'pj', title: 'PJ · Empréstimos', state: { perfil: 'pj', solucao: 'emp' }, node: '23420:12613', figmaName: 'PJ - Empréstimos', shot: 'shots/12-pj-emprestimos.png',
        about: 'Empréstimos para PJ: quatro produtos, com Garantia de Veículos em "Em breve".',
        rules: ['A descrição do card "Crédito com Garantia de Veículos" repete o texto de Financiamentos. Revisar o texto no Figma.'],
        components: BASE_COMP.concat(['Card', 'PartnerLogo', 'Tooltip', 'Icon']) },
      { id: 'pj-garantia-imovel', group: 'pj', title: 'PJ · Crédito com Garantia de Imóvel', state: { perfil: 'pj', solucao: 'emp', produto: 'imovel' }, node: '23207:2593', figmaName: 'Home Equity PJ', shot: 'shots/13-pj-garantia-imovel.png',
        about: 'Detalhe do crédito com garantia de imóvel para empresas (idade mínima de 2 anos).',
        rules: ['No Figma o frame se chama "Home Equity PJ".'],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Tooltip', 'Toast']) },
      { id: 'pj-condominios', group: 'pj', title: 'PJ · Crédito para Condomínios', state: { perfil: 'pj', solucao: 'emp', produto: 'condominios' }, node: '23207:2529', figmaName: 'Crédito para Condomínios PJ', shot: 'shots/14-pj-condominios.png',
        about: 'Detalhe do crédito para condomínios.',
        rules: ['O detalhe repete o texto e os parceiros do Financiamento para Construção PF (CashMe e Crediblue), enquanto o card da etapa anterior mostra só CashMe. Revisar o conteúdo no Figma.'],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Tooltip', 'Toast']) },
      { id: 'pj-garantia-veiculos', group: 'pj', title: 'PJ · Crédito com Garantia de Veículos', state: { perfil: 'pj', solucao: 'emp', produto: 'veiculos' }, node: '23420:13116', figmaName: 'Emprestimo com garantia de veículos PJ', shot: 'shots/15-pj-garantia-veiculos.png',
        about: 'Detalhe do crédito com garantia de veículos para PJ.',
        rules: ['Na etapa anterior o produto está "Em breve"; aqui aparece selecionado.'],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Toast']) },
      { id: 'pj-capital-giro', group: 'pj', title: 'PJ · Capital de giro', state: { perfil: 'pj', solucao: 'emp', produto: 'giro' }, node: '23420:13162', figmaName: 'Capital de giro PJ', shot: 'shots/16-pj-capital-giro.png',
        about: 'Detalhe do capital de giro, com as garantias aceitas por modalidade.',
        rules: [],
        components: BASE_COMP.concat(['PartnerLogo', 'Link', 'Tooltip', 'Toast']) }
    ],
    extras: [
      { title: 'Toast "Envio disponível após criar sua loja."', node: '23270:8089', shot: 'shots/17-toast-loja.png', about: 'Aviso (notice) com a ação "Criar loja", ao tocar em "Copiar link para o cliente" sem loja criada.' }
    ],
    notes: [
      'Os frames do Figma não têm conexões de protótipo: a ordem das etapas segue a árvore de decisão (perfil › solução › produto).',
      'Os logos dos bancos parceiros não estão no TeddyDS: no protótipo o PartnerLogo mostra as iniciais. Os logos reais estão nos prints do Figma.',
      'O painel da direita é o Drawer do Figma aberto ao lado do conteúdo; no protótipo ele é composto com os tokens do DS (fundo level-lower e cantos huge), sem criar componente novo.',
      'Textos mantidos como estão no Figma, inclusive "Credito" e "Ultima coisa" sem acento, para o histórico ficar fiel.',
      'O menu lateral do protótipo é o menu único da The House (o do Dashboard), com "Nova proposta" como botão de destaque. O print do Figma desta jornada mostra o menu antigo, com "Nova proposta" como item, Consórcio e "Precisa de ajuda?" no rodapé.'
    ],

    /* Conteúdo que a tela usa. */
    content: {
      questions: {
        perfil: { caption: 'Para iniciarmos...', title: 'Identifique o perfil do cliente' },
        solucao: { caption: 'Continuando...', title: 'Qual solução deseja oferecer ao seu cliente?' },
        produto: { caption: 'Agora...', title: 'Qual produto deseja ofertar ao seu cliente?' },
        seguir: { caption: 'Ultima coisa...', title: 'Como deseja prosseguir?' }
      },
      perfis: [
        { value: 'pf', label: 'Pessoa Física', icon: 'user--duotone' },
        { value: 'pj', label: 'Pessoa Jurídica', icon: 'buildings--duotone' }
      ],
      solucoes: [
        { value: 'fin', label: 'Financiamentos', icon: 'bank--duotone' },
        { value: 'emp', label: 'Empréstimos', icon: 'dollar-sign-circle--duotone' }
      ],
      intro: {
        title: 'Nova proposta',
        text: ['Crie uma proposta completa em poucos minutos.', 'Durante o processo, esta seção vai orientar você na escolha do produto ideal para o seu cliente.', 'Siga o passo a passo e preencha as informações para encontrar as melhores ofertas disponíveis.'],
        steps: [
          { title: 'Selecione o perfil do cliente', text: 'Escolha entre Pessoa Física ou Jurídica.' },
          { title: 'Selecione o grupo do produto', text: 'Escolha a categoria ideal para o cliente.' },
          { title: 'Selecione o produto', text: 'Escolha a melhor opção disponível.' },
          { title: 'Preencher a proposta', text: 'Complete os dados e envie para análise.' }
        ]
      },
      grupos: {
        pf: { title: 'Produtos para pessoa física', items: [
          { value: 'fin', label: 'Financiamentos', icon: 'bank--duotone', text: 'Inclui financiamento para construção e financiamento de imóveis.', partners: ['Bradesco', 'Caixa', 'Itaú', 'Inter', 'Santander'] },
          { value: 'emp', label: 'Empréstimos', icon: 'dollar-sign-circle--duotone', text: 'Soluções como crédito com garantia de veículos e credito com garantia de imóvel.', partners: ['BV', 'Creditas', 'CashMe', 'Daycoval', 'Omni', 'C6 Bank', 'Safra'] }
        ] },
        pj: { title: 'Produtos para pessoa jurídica', items: [
          { value: 'fin', label: 'Financiamentos', icon: 'bank--duotone', text: 'Inclui crédito para condomínios, financiamento de imóveis e crédito de garantia de imóveis.', partners: ['Bradesco', 'Caixa', 'Itaú', 'Inter', 'Santander', 'C6 Bank'] },
          { value: 'emp', label: 'Empréstimos', icon: 'dollar-sign-circle--duotone', text: 'Soluções como capital de giro, crédito com garantia de veículos, credito com garantia de imóvel e crédito para construção.', partners: ['Bradesco', 'BV', 'Safra', 'Santander', 'CashMe', 'Omni', 'Daycoval'] }
        ] }
      },
      /* Opções da pergunta de produto (ordem dos botões) e cards do painel (ordem da lista). */
      produtos: {
        'pf.fin': { panelTitle: 'Produtos imobiliários', options: ['aquisicao', 'construcao'], list: ['construcao', 'aquisicao'] },
        'pf.emp': { panelTitle: 'Produtos empréstimos', options: ['imovel', 'veiculos'], list: ['imovel', 'veiculos'] },
        'pj.fin': { panelTitle: 'Produtos imobiliários', options: ['aquisicao'], list: ['aquisicao'] },
        'pj.emp': { panelTitle: 'Produtos para pessoa jurídica', options: ['imovel', 'condominios', 'veiculos', 'giro'], list: ['imovel', 'condominios', 'veiculos', 'giro'] }
      },
      emBreve: [],
      catalogo: {
        pf: {
          construcao: { label: 'Financiamento para Construção', icon: 'building-commercial--duotone',
            card: { text: 'Voltado para quem deseja construir ou ampliar um imóvel em terreno próprio. O valor é liberado por etapas conforme o avanço da obra, garantindo controle financeiro e previsibilidade no projeto.', partners: ['CashMe', 'Crediblue'] },
            detail: { subtitle: 'Descrição do produto',
              bullets: ['Você pode iniciar ou continuar a construção da casa, comércio ou outro imóvel;', 'Taxa a partir de 0,74% + IPCA a.m.;', 'Até 10 anos para pagar;', 'Liberação do recurso sob medição até que a obra esteja concluída;', 'Até 80% do valor de avaliação do imóvel pronto.'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Crédito para construção, com os parceiros:', partners: ['CashMe', 'Crediblue'],
              about: 'Oferta de crédito personalizada, com pouca burocracia e aprovação do Comitê em até dois dias úteis. Taxas flexíveis conforme análise de crédito, imóvel e prazo. Operações sob medida, pensadas para cada perfil, com ampla aceitação de diferentes tipos de imóveis. Com a garantia, é possível contratar prazos de até 120 meses. Aqui você encontra as melhores soluções em crédito para construção com parceiros especializados.' } },
          aquisicao: { label: 'Financiamento / Aquisição de Imóvel', icon: 'building-modern--duotone',
            card: { text: 'Indicado para quem deseja comprar um imóvel novo ou usado, residencial ou comercial. Permite financiar parte do valor com prazos longos, taxas competitivas e segurança no processo, sendo uma das opções mais tradicionais do mercado.', partners: ['Bradesco', 'Caixa', 'Itaú', 'Inter', 'Santander'] },
            detail: { subtitle: 'Descrição do produto',
              bullets: ['Financie até 80% do imóvel residencial ou imóvel comercial 70%;', 'Prazo de 12 até 420 meses (35 anos);', 'Taxa de juros a partir 11,69 % a.a. + TR;', 'Tabela SAC;', 'Pessoa física;', 'Valor mínimo do imóvel é de R$ 98.000,00;', 'Renda mínima R$ 2.500,00.'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Financiamento Imobiliário, com os parceiros:', partners: ['Bradesco', 'Caixa', 'Inter', 'Itaú', 'Santander'],
              about: 'Financiamento imobiliário: Para aqueles clientes que sonham em sair do aluguel, investir ou ter a tão sonhada casa própria. Temos uma linha de crédito imobiliário exclusiva para aquisição de imóveis residenciais, comerciais ou terrenos (Bradesco), sendo a forma mais fácil e rápida de realização.' } },
          imovel: { label: 'Credito com Garantia de Imóvel', icon: 'building-classic--duotone',
            card: { text: 'Crédito com garantia de imóvel quitado, ideal para quem busca valores maiores e prazos estendidos. Oferece taxas menores e liberdade para usar o dinheiro em investimentos, reformas ou quitação de dívidas, mantendo a posse do bem.', partners: ['Galleria Bank', 'Santander', 'Itaú', 'CashMe', 'Creditas', 'C6 Bank', 'Direto'] },
            detail: { subtitle: 'Descrição do produto',
              bullets: ['Imóvel como garantia Residencial ou Comercial', 'Imóveis de R$ 70 mil a R$ 20 milhões;', 'Empréstimo a partir de R$ 30.000;', 'Valor máximo até 60% do valor do imóvel;', 'Prazo de 12 a 240 meses para pagar;', 'Carência de até 12 meses para começar a pagar;', 'Juros a partir de 1,09% a.m + IPCA; ou Juros Fixos', 'Tabela PRICE', 'Aceitamos imóveis com parte da área de construção não averbada;', 'Operações para Pessoa Física e Sócios PJ'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Credito com Garantia de Imóvel, com os parceiros:', partners: ['Itaú', 'Santander', 'Inter', 'CashMe', 'C6 Bank', 'Creditas', 'Banco Bari', 'Galleria Bank', 'Direto'],
              about: 'O empréstimo com garantia de imóvel oferece taxas mais baixas, a partir de 1,09% ao mês + IPCA ou juros fixos. Você utiliza seu imóvel como garantia, continua usando normalmente e pode compor renda para aumentar o valor liberado. É uma solução simples, segura e ideal para quem busca mais prazo e melhores condições de pagamento.' } },
          veiculos: { label: 'Crédito com Garantia de Veículos', icon: 'car--duotone',
            card: { text: 'Empréstimo destinado a quem precisa de dinheiro rápido usando o veículo quitado como garantia. Permite manter o carro em uso enquanto o cliente obtém um valor proporcional ao bem, com taxas reduzidas e prazos flexíveis para pagamento. É uma alternativa acessível e segura para quem busca crédito sem abrir mão do próprio veículo.', partners: ['BV', 'Creditas', 'CashMe', 'Daycoval', 'Omni', 'C6 Bank', 'Safra'] },
            detail: { subtitle: null,
              bullets: ['Crédito de até 90% do valor de avaliação do veículo (sujeito à análise de crédito);', 'Taxas de juros reduzidas em comparação ao empréstimo tradicional;', 'Prazo de pagamento de 3 a 60 meses;', 'Até 60 dias de carência para o pagamento da primeira parcela;', 'Parcelas fixas durante todo o contrato;', { text: 'Elegibilidade dos veículos:', sub: ['Carros, Caminhonetes e SUVs: até 24 anos de uso;', 'Caminhões e Utilitários: até 50 anos;', 'Ônibus: até 20 anos.'] }, 'O cliente continua utilizando o veículo normalmente durante o contrato.'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Empréstimo com Garantia de Veículos, com os parceiros:', partners: ['BV', 'Creditas', 'CashMe', 'Daycoval', 'Omni', 'C6 Bank', 'Safra'],
              about: 'Indicado para clientes que desejam obter crédito utilizando um veículo quitado como garantia. Permite acessar até 90% do valor de avaliação, com taxas mais competitivas, prazos flexíveis e liberdade para utilizar o recurso conforme sua necessidade, mantendo o veículo em sua posse durante toda a operação.' } }
        },
        pj: {
          aquisicao: { label: 'Financiamento / Aquisição de Imóvel', icon: 'building-modern--duotone',
            card: { text: 'Solução destinada a empresas que desejam financiar imóveis comerciais ou residenciais. Oferece até 80% de financiamento, prazos de até 10 anos e juros competitivos, com amortização pela Tabela Price ou SAC, garantindo flexibilidade e segurança na aquisição do patrimônio empresarial.', partners: ['Bradesco', 'Caixa', 'Itaú', 'Inter', 'Santander'] },
            detail: { subtitle: 'Descrição do produto',
              bullets: ['Financiamento para imóvel residencial de até 80% do valor, com limite de até R$ 4 milhões (para imóveis de até R$ 5 milhões);', 'Financiamento para imóvel comercial de até 60% do valor, com limite de até R$ 3 milhões (para imóveis de até R$ 5 milhões);', 'Prazo de até 10 anos para pagamento;', 'Sistema de amortização SAC ou Tabela Price;', 'Juros de 15% ao ano, com saldo devedor corrigido pela TR;', 'Garantia por alienação fiduciária, trazendo mais segurança para a operação.'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Financiamento Imobiliário PJ, com o parceiro:', partners: ['Bradesco'], about: null } },
          imovel: { label: 'Credito com Garantia de Imóvel', icon: 'building-classic--duotone',
            card: { text: 'Empréstimo com garantia de imóvel, indicado para pessoas físicas e jurídicas que buscam crédito de médio a longo prazo com taxas reduzidas. Permite obter até 60% do valor do bem, mantendo o uso do imóvel, com prazos de até 240 meses e contratação simples e segura.', partners: ['Galleria Bank', 'Crediblue', 'Inter', 'CashMe', 'Creditas', 'Banco Bari'] },
            detail: { subtitle: 'Descrição do produto',
              bullets: ['Imóvel como garantia;', 'Imóveis de R$ 70 mil a R$15 milhões;', 'Financiamento a partir de R$ 40.000;', 'Valor máximo até 60% do valor do imóvel;', 'Prazo de 12 a 240 meses para pagar;', 'Carência de até 12 meses para começar a pagar;', 'Juros a partir de 1,09% a.m + IPCA;', 'Tabela PRICE ou SAC;', 'Aceitamos imóveis com parte da área de construção não averbada;', 'Operações para Pessoa Jurídica;', 'Idade mínima da empresa: 2 anos.'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Credito com Garantia de Imóvel, com os parceiros:', partners: ['Galleria Bank', 'Inter', 'CashMe', 'Banco Bari', 'Crediblue', 'Creditas'],
              about: 'O empréstimo com garantia de imóvel oferece taxas a partir de 1,09% ao mês + IPCA, permitindo utilizar o próprio imóvel como garantia para obter mais capital, continuar usando-o normalmente e ainda compor renda. É uma opção simples, segura e com prazos maiores, ideal para quem busca crédito com juros mais baixos e melhores condições de pagamento.' } },
          condominios: { label: 'Crédito para Condomínios', icon: 'courthouse--duotone',
            card: { text: 'Linha de crédito voltada para modernização e melhorias estruturais em condomínios residenciais e comerciais. Permite financiar projetos como portaria remota, energia solar, reformas e adequações, com prazos de até 90 meses, carência para início do pagamento e sem necessidade de garantias pessoais.', partners: ['CashMe'] },
            detail: { subtitle: 'Descrição do produto',
              bullets: ['Você pode iniciar ou continuar a construção da casa, comércio ou outro imóvel;', 'Taxa a partir de 0,74% + IPCA a.m.;', 'Até 10 anos para pagar;', 'Liberação do recurso sob medição até que a obra esteja concluída;', 'Até 80% do valor de avaliação do imóvel pronto.'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Crédito para construção, com os parceiros:', partners: ['CashMe', 'Crediblue'],
              about: 'Oferta de crédito personalizada, com pouca burocracia e aprovação do Comitê em até dois dias úteis. Taxas flexíveis conforme análise de crédito, imóvel e prazo. Operações sob medida, pensadas para cada perfil, com ampla aceitação de diferentes tipos de imóveis. Com a garantia, é possível contratar prazos de até 120 meses. Aqui você encontra as melhores soluções em crédito para construção com parceiros especializados.' } },
          veiculos: { label: 'Crédito com Garantia de Veículos', icon: 'car--duotone',
            card: { text: 'Inclui crédito para condomínios, financiamento de imóveis e crédito de garantia de imóveis.', partners: ['BV', 'CashMe', 'Omni', 'Safra'] },
            detail: { subtitle: 'Descrição do produto',
              bullets: ['Crédito de até 90% do valor de avaliação do veículo (sujeito à análise de crédito);', 'Taxas de juros reduzidas em comparação ao empréstimo tradicional;', 'Prazo de pagamento de 3 a 60 meses;', 'Até 60 dias de carência para o pagamento da primeira parcela;', 'Parcelas fixas durante todo o contrato;', { text: 'Elegibilidade dos veículos:', sub: ['Carros, Caminhonetes e SUVs: até 24 anos de uso;', 'Caminhões e Utilitários: até 50 anos;', 'Ônibus: até 20 anos.'] }, 'O cliente continua utilizando o veículo normalmente durante o contrato.'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Empréstimo com Garantia de Veículos, com os parceiros:', partners: ['BV', 'CashMe', 'Omni', 'Safra'],
              about: 'Indicado para clientes que desejam obter crédito utilizando um veículo quitado como garantia. Permite acessar até 90% do valor de avaliação, com taxas mais competitivas, prazos flexíveis e liberdade para utilizar o recurso conforme sua necessidade, mantendo o veículo em sua posse durante toda a operação.' } },
          giro: { label: 'Capital de giro', icon: 'money-change--duotone',
            card: { text: 'Financiamento voltado para sustentar as operações diárias e equilibrar o fluxo de caixa de empresas. Oferece prazos flexíveis, taxas competitivas e diversas opções de garantia, como recebíveis, veículos ou imóveis, adequando-se ao porte e à necessidade do negócio.', partners: ['Daycoval'] },
            detail: { subtitle: 'Descrição do produto',
              bullets: ['Capital de giro para empresas com prazo de até 60 meses;', { text: 'Garantias aceitas conforme a modalidade:', sub: ['Aval dos sócios ou terceiros;', 'Recebíveis (duplicatas);', 'Imóveis.'] }, 'Taxas a partir de 1,35% ao mês (sujeitas à análise de crédito);', 'Prazo de pagamento de 18 a 62 meses;'],
              partnersTitle: 'Aqui você encontra as melhores soluções em Capital de Giro, com os parceiros:', partners: ['Daycoval'],
              about: 'Capital de Giro: Indicado para empresas que buscam recursos para fortalecer o fluxo de caixa, expandir operações ou investir no negócio. Conta com modalidades com ou sem garantia, taxas competitivas e prazos flexíveis, oferecendo soluções adequadas às necessidades de cada empresa.' } }
        }
      }
    }
  });

  /* ── Dashboard (Home do gestor) ── */
  var DASH_FILE = '5UNvSshKTi0JPwniRkJHPz';
  function figD(node) { return 'https://www.figma.com/design/' + DASH_FILE + '/Dashboard-%7C-The-House?node-id=' + node.replace(':', '-'); }
  window.JORNADAS.journeys.push({
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Home do gestor com métricas, destaques, funil e listas de trabalho',
    brands: ['thehouse'],
    scope: 'exclusiva',
    menu: 'home',
    version: 'v1',
    updated: '2026-09-30',
    screen: 'dashboard',
    pattern: 'Padrão 2 · Home (painel do usuário)',
    figma: { label: 'Dashboard | The House · frame Dashboard', url: figD('6402:3945') },
    description: 'Primeira tela depois do login. O gestor vê as métricas da carteira, fala com o gerente de sucesso, acompanha os destaques, o funil de propostas e as duas listas de trabalho do dia. Daqui ele abre uma proposta, gera uma proposta a partir de uma simulação ou começa uma Nova Proposta.',
    groups: [{ id: 'home', label: 'Home' }],
    steps: [
      { id: 'dashboard', group: 'home', title: 'Dashboard do gestor', state: {}, node: '6402:3945', figmaName: 'Dashboard', shot: 'shots/20-dashboard.png',
        about: 'Tela única com tudo o que o gestor precisa para começar o dia. O conteúdo passa da altura da tela e rola: as duas listas têm quatro itens cada.',
        rules: [
          'Valores em dinheiro têm o olho para ocultar: "Seu estoque" vem visível e "Comissão validada" vem oculta.',
          '"Nova proposta" (botão de destaque do menu) e "Gerar proposta" abrem a jornada Nova Proposta.',
          '"Ver proposta" e "Ver todas propostas" abrem a jornada Propostas; "Ver todas simulações" abre Simuladores.',
          'O TeddyDS não tem Tag com gradiente de IA: "Recomendado por IA" usa o AIButton pequeno, parado no quadro inicial, que é a peça do DS com esse gradiente.',
          'Destaques: Banner do DS em carrossel automático (troca a cada 6 segundos e pausa com o mouse em cima) com os 4 banners reais enviados pelo time. O texto e o botão fazem parte da imagem; o clique em qualquer ponto do banner abre o destino.'
        ],
        components: ['Theme', 'AppShell', 'SideNavigation', 'TopNavigation', 'Tabs', 'Dropdown', 'Dot', 'Card', 'Metrics', 'Avatar', 'Button', 'IconButton', 'Banner', 'Link', 'Status', 'AIButton', 'Icon', 'Toast'] }
    ],
    extras: [
      { title: 'Notificações · Todas', node: '6161:29090', shot: 'shots/21-notificacoes-todas.png', about: 'Painel do sino: abas Todas e Não lidas, itens com ponto vermelho quando não lidos, "Lida" com check nos lidos e "Marcar todas como lidas" no rodapé.' },
      { title: 'Notificações · Não lidas', node: '6161:29089', shot: 'shots/22-notificacoes-nao-lidas.png', about: 'Aba Não lidas: só as notificações ainda não lidas.' },
      { title: 'Configurações', node: '6134:55908', shot: 'shots/23-configuracoes.png', about: 'Menu da engrenagem: Conta, Loja, Segurança, Plano (Em breve), Termos e Condições, Central de Ajuda, Sair e a versão.' },
      { title: 'Minha loja', node: '6134:55724', shot: 'shots/24-loja.png', about: 'Menu do ícone da loja: Ir para loja e Copiar link da loja.' }
    ],
    notes: [
      'O menu lateral deste Figma virou o menu único da The House: todas as telas do Jornadas usam ele.',
      'Topo padrão em todas as telas: pessoa logada como Gilberto · Gestor Master, com Loja, Notificações e Configurações funcionando (painéis do Figma do Dashboard). O mesmo arquivo tem uma versão do Dashboard para o perfil Agente (sem o card de Comissão validada), que não entrou no Jornadas.',
      'Foto do gestor e da gerente de sucesso não entram no protótipo: o Avatar mostra as iniciais. Os banners usam as artes oficiais enviadas em 30/09/2026 (no Figma havia só o banner "Domine os nossos produtos").',
      'O valor da "Comissão validada" está oculto no Figma; o valor que aparece ao tocar no olho é um exemplo.'
    ],
    content: {
      header: { welcome: 'Bem vindo', name: 'Gilberto', role: 'Gestor Master', subtitle: 'Vamos juntos fechar mais propostas hoje?' },
      metrics: [
        { title: 'Propostas ativas', value: '47', prefix: '', description: 'Em 6 etapas', icon: 'document-normal--duotone', color: 'gold', hideable: false },
        { title: 'Seu estoque', value: '7.000.600', prefix: 'R$', description: 'Potencial da sua carteira', icon: 'chart-column--duotone', color: 'blue', hideable: true, hidden: false },
        { title: 'Comissão validada', value: '18.450,00', prefix: 'R$', description: 'Últimos 30 dias', icon: 'dollar-sign-circle--duotone', color: 'green', hideable: true, hidden: true }
      ],
      gerente: { name: 'Rafaela Santos', role: 'Gerente de sucesso', email: 'rafaela.santos@thehouse.com.br', phone: '(11) 9959-16780' },
      destaques: { title: 'Destaques', link: 'Ver todas notícias',
        /* Banners reais do time (1660x330), em carrossel automático. O quadro tem a altura do Figma (261px) e corta as laterais; focus ajusta o corte quando o texto fica perto da borda. */
        slides: [
          { image: 'banners/01-home-evoluiu.jpg', label: 'A home da The House evoluiu: prioridades, oportunidades e próximos passos em um só lugar. Conheça a novidade.', cta: 'Conheça a novidade' },
          { image: 'banners/02-acesso-dispositivos.jpg', label: 'Mais praticidade para acessar a The House: agora cada dispositivo e navegador autorizado mantém seu próprio ciclo de validação. Saiba mais.', cta: 'Saiba mais' },
          { image: 'banners/03-jornada-cgi.jpg', label: 'A jornada de CGI ficou mais completa: Defesa de Crédito, Avaliação Técnica e Emissão e Registro agora podem ser acompanhadas na proposta. Conheça a novidade.', cta: 'Conheça a novidade' },
          { image: 'banners/04-condicoes-credito-imobiliario.jpg', label: 'Novas condições de crédito imobiliário: confira as atualizações de taxas. Ver condições.', cta: 'Ver condições', focus: '35% 50%' }
        ] },
      funil: { title: 'Meu funil', total: '47', caption: 'propostas ativas no funil',
        etapas: [
          { label: 'Pré-Aprovado', value: 'R$ 530.000,00' }, { label: 'Análise de crédito', value: 'R$ 2.840.600,00' },
          { label: 'Aprovado', value: 'R$ 1.040.000,00' }, { label: 'Em avaliação', value: 'R$ 290.000,00' },
          { label: 'Em emissão', value: 'R$ 300.000,00' }, { label: 'Finalizado', value: 'R$ 750.000,00' }] },
      atencao: { title: 'O que precisa da sua atenção hoje', tag: 'Recomendado por IA', link: 'Ver todas propostas',
        itens: [
          { nome: 'Lucas Pereira', numero: '#412524', produto: 'Fin. Imobiliário • R$ 500.000,00', status: 'Documentos pendentes', tempo: 'Há 1 hora' },
          { nome: 'Marcos Silva', numero: '#412524', produto: 'Fin. Imobiliário • R$ 500.000,00', status: 'Documentos pendentes', tempo: 'Há 1 hora' },
          { nome: 'Thiago Costa', numero: '#412524', produto: 'Fin. Imobiliário • R$ 500.000,00', status: 'Documentos pendentes', tempo: 'Há 1 hora' },
          { nome: 'Felipe Almeida', numero: '#412524', produto: 'Fin. Imobiliário • R$ 500.000,00', status: 'Documentos pendentes', tempo: 'Há 1 hora' }] },
      simulacoes: { title: 'Suas simulações recentes', link: 'Ver todas simulações',
        itens: [
          { cliente: 'João da Silva • 293.254.886-09', produto: 'Fin. Imobiliário • R$ 450.000,00', data: '01 set. às 20:15' },
          { cliente: 'Rafael Martins • 123.456.789-01', produto: 'Fin. Imobiliário • R$ 450.000,00', data: '10 set. às 14:30' },
          { cliente: 'Mariana Oliveira • 234.567.890-12', produto: 'CGI • R$ 750.000,00', data: '08 set. às 09:15' },
          { cliente: 'Felipe Andrade • 345.678.901-23', produto: 'CGI • R$ 620.000,00', data: '12 set. às 11:45' }] }
    }
  });

  /* ── Propostas · Seu acompanhamento (Gestor Master) ── */
  var PROP_FILE = 'U8WBwb19Y9IFP79M7ed0LX';
  function figP(node) { return 'https://www.figma.com/design/' + PROP_FILE + '/Acompanhamento-de-propostas-%7C-The-House?node-id=' + node.replace(':', '-'); }
  function pr(id, nome, status, valor, etapa, dono) { return { id: id, cliente: nome, tipo: 'PF', produto: 'Financiamento Imobiliário', valor: valor, status: status, etapa: etapa, criado: '2026-03-16T12:00:00', dono: dono }; }
  var PROPOSTAS = [
    pr('123456', 'Carlos Silva Santos', 'Pendência documentos de crédito', 600000, 'analise', 'mariana/carlos'),
    pr('654321', 'Mateus Oliveira Silva', 'Análise de crédito', 210500, 'analise', 'gabriel'),
    pr('345678', 'Ana Paula Mendes', 'Reanálise documental', 205300, 'analise', 'isabela'),
    pr('987654', 'Gustavo Henrique Martins', 'Crédito negado', 195400, 'analise', 'lucas'),
    pr('214299', 'Manuel de Lucas Paz', 'Crédito aprovado', 180750, 'preaprovado', 'mariana/gabriel'),
    pr('234890', 'Beatriz Lopes Andrade', 'Crédito aprovado', 320000, 'preaprovado', 'beatriz'),
    pr('789012', 'Mariana Santos Almeida', 'Pendência pré contratação', 550000, 'aprovacao', 'mariana/isabela'),
    pr('876543', 'Isabela Costa Rocha', 'Montagem de pasta', 610000, 'aprovacao', 'gabriel'),
    pr('345890', 'Tatiane Mendes Silva', 'Pré contratação', 590000, 'aprovacao', 'mariana/lucas'),
    pr('234567', 'Gabriela Ferreira Lima', 'Vistoria do imóvel', 635000, 'contratacao', 'beatriz'),
    pr('456789', 'Aline Pereira dos Santos', 'Pendência vistoria', 615000, 'contratacao', 'isabela'),
    pr('678901', 'Renata Alves Martins', 'Pendência jurídica', 580000, 'contratacao', 'beatriz'),
    pr('789123', 'Patrícia Nascimento Souza', 'Reanálise jurídica', 600000, 'contratacao', 'mariana/carlos'),
    pr('890234', 'Luciana Ribeiro da Silva', 'Análise jurídica', 570000, 'contratacao', 'gabriel'),
    pr('012456', 'Juliana Martins de Souza', 'Confirmação de valores', 655000, 'contratacao', 'lucas'),
    pr('123567', 'Sofia Almeida Ferreira', 'FGTS', 620000, 'contratacao', 'beatriz'),
    pr('234678', 'Ricardo Gomes Pereira', 'Em pagamento de IQ', 600000, 'formalizacao', 'mariana/gabriel'),
    pr('345789', 'André Luiz Costa', 'Contrato emitido / assinatura', 600000, 'formalizacao', 'isabela'),
    pr('672490', 'Juliano Costa Pereira', 'Confecção de minuta', 625300, 'formalizacao', 'gabriel'),
    pr('456890', 'Felipe Augusto Pereira', 'Exigência cartorária', 610000, 'formalizacao', 'lucas'),
    pr('567901', 'Thiago Mendes Costa', 'Liberação ao vendedor', 625000, 'formalizacao', 'beatriz')
  ];
  var BASE_P = ['Theme', 'AppShell', 'SideNavigation', 'TopNavigation', 'Search', 'Select', 'DatePicker', 'Button', 'IconButton', 'Badge', 'Icon'];

  window.JORNADAS.journeys.push({
    id: 'propostas',
    title: 'Propostas',
    subtitle: 'Seu acompanhamento: todas as propostas da carteira por etapa, em kanban',
    brands: ['thehouse'],
    scope: 'exclusiva',
    menu: 'propostas',
    version: 'v1',
    updated: '2026-09-30',
    screen: 'propostas',
    pattern: 'Padrão 5 · Lista com filtros (e visão kanban)',
    figma: { label: 'Acompanhamento de propostas | The House · seção Jornada (Super) Gestor Master', url: figP('8626:14197') },
    description: 'Tela "Seu acompanhamento" do Gestor Master. Os filtros (cliente, período, produto, status e usuários) ficam no topo; logo abaixo, o resumo por etapa (Em análise, Pré-Aprovado, Aprovação, Contratação, Formalização e Finalizado) com a quantidade e o valor. As propostas aparecem em kanban (6 colunas com rolagem lateral), e cada uma tem o menu Ver, Transferir e Cancelar.',
    groups: [{ id: 'acompanhamento', label: 'Seu acompanhamento' }, { id: 'vazio', label: 'Estados vazios' }],
    steps: [
      { id: 'kanban', group: 'acompanhamento', title: 'Seu acompanhamento · kanban', state: { view: 'kanban' }, node: '8285:25159', figmaName: 'Acompanhamento de proposta / KanBan / Step 1', shot: 'shots/38-kanban-step1.png',
        about: 'As mesmas propostas em 6 colunas por etapa. O quadro rola para o lado (as últimas etapas ficam à direita, como no Step 2 do Figma) e cada coluna rola sozinha; a etapa sem propostas mostra uma mensagem.',
        rules: ['6 etapas: Em análise, Pré-Aprovado, Aprovação, Contratação, Formalização e Finalizado. O resumo de cada etapa fica em cima da coluna e rola junto com ela.', 'A cor do topo do card é a cor da etapa.', 'O menu "..." do card tem Ver proposta, Transferir proposta e Cancelar proposta (em vermelho).', 'Coluna vazia: "As propostas aparecerão aqui quando chegarem nesta etapa."', 'O botão de alternar para lista foi removido (30/09/2026): a tela fica só em kanban.'],
        components: BASE_P.concat(['Card', 'Status', 'Tag', 'Dropdown', 'Toast']) },
      { id: 'vazio-primeiro-acesso', group: 'vazio', title: 'Primeiro acesso (sem propostas)', state: { view: 'kanban', vazio: true }, node: '8617:10914', figmaName: 'Propostas -> Seu acompanhamento -> Empty State/1°Acesso', shot: 'shots/32-propostas-vazio-primeiro-acesso.png',
        about: 'Quem ainda não tem propostas vê o resumo zerado e o convite para criar a primeira.',
        rules: ['"Nova proposta" abre a jornada Nova Proposta.', 'O resumo mostra as 6 etapas zeradas.'],
        components: BASE_P.concat(['Toast']) },
      { id: 'vazio-filtros', group: 'vazio', title: 'Nenhuma proposta com os filtros', state: { view: 'kanban', filtros: 'sem-resultado' }, node: '8617:10976', figmaName: 'Propostas -> Seu acompanhamento -> Empty State/Filtros', shot: 'shots/33-propostas-vazio-filtros.png',
        about: 'Filtros sem resultado (período 1 a 15 de abril de 2026 e produto Crédito com Garantia de Imóvel): a lista some e aparece "Limpar filtros".',
        rules: ['"Limpar filtros" volta todos os filtros para "Todos" e mostra a lista de novo.'],
        components: BASE_P.concat(['Toast']) }
    ],
    extras: [
      { title: 'Kanban rolado até o fim (Step 2)', node: '8695:19297', shot: 'shots/39-kanban-step2.png', about: 'O quadro rolado para a direita mostra Formalização e Finalizado (vazio). No Figma há um minimapa no canto inferior direito; o TeddyDS não tem esse componente, então o protótipo usa a rolagem lateral.' },
      { title: 'Menu da proposta', node: '8617:11038', shot: 'shots/34-menu-proposta.png', about: 'Menu do "..." da linha ou do card: Ver proposta, Transferir proposta e Cancelar proposta.' },
      { title: 'Filtro de produto', node: '8617:11039', shot: 'shots/35-filtro-produto.png', about: 'Busca, "Selecionar todos" e os produtos com checkbox.' },
      { title: 'Filtro de usuários · parceiros', node: '8630:22482', shot: 'shots/36-filtro-parceiros.png', about: 'Primeiro nível: parceiros, com "Selecionar todos os parceiros" e seta para abrir os usuários de cada um.' },
      { title: 'Filtro de usuários · usuários do parceiro', node: '8630:23098', shot: 'shots/37-filtro-usuarios.png', about: 'Segundo nível: "Selecionar todos usuários abaixo do parceiro" e os usuários.' }
    ],
    notes: [
      'Base: seção "Jornada (Super) Gestor Master" do Figma (1728x972). A pessoa logada no Figma é "Welliton Moura · Gestor Master"; no protótipo fica o topo padrão (Gilberto · Gestor Master).',
      'O Figma está em Dark; o protótipo abre no tema escolhido em "Tema do protótipo".',
      'Os primeiros cards de cada etapa seguem o kanban Step 1/Step 2 do Figma; as demais propostas de exemplo foram redistribuídas pelas 6 etapas conforme o status.',
      'O Figma não diz quem é o responsável de cada proposta: para o filtro de usuários funcionar, cada proposta recebeu um responsável de exemplo.',
      'Etapas (30/09/2026): as 6 do kanban "Acompanhamento de proposta / KanBan / Step 1 e Step 2" (Em análise, Pré-Aprovado, Aprovação, Contratação, Formalização, Finalizado). A tela do Gestor Master no Figma ainda mostra 5 etapas (com "Novo negócio" e sem Pré-Aprovado e Contratação) e precisa ser atualizada.',
      'No Figma o nome da etapa aparece como "Aprovado" em alguns frames e "Aprovação" em outros; o protótipo usa "Aprovação".',
      'As telas de detalhe da proposta entram na próxima fase desta jornada.'
    ],
    content: {
      etapas: [
        { value: 'analise', label: 'Em análise', icon: 'search-status--duotone', color: 'gold' },
        { value: 'preaprovado', label: 'Pré-Aprovado', icon: 'shield-check--duotone', color: 'blue' },
        { value: 'aprovacao', label: 'Aprovação', icon: 'check-circle--duotone', color: 'lime' },
        { value: 'contratacao', label: 'Contratação', icon: 'paint-brush--duotone', color: 'orange' },
        { value: 'formalizacao', label: 'Formalização', icon: 'clipboard-text--duotone', color: 'teal' },
        { value: 'finalizado', label: 'Finalizado', icon: 'chart-simple--duotone', color: 'green' }
      ],
      produtos: ['Financiamento Imobiliário', 'Crédito para construção', 'Crédito com Garantia de Imóvel', 'Crédito para Condomínios'],
      usuarios: [
        { value: 'mariana', label: 'Mariana Silva', children: [
          { value: 'mariana/carlos', label: 'Carlos Silva' }, { value: 'mariana/gabriel', label: 'Gabriel Souza' },
          { value: 'mariana/isabela', label: 'Isabela Santos' }, { value: 'mariana/lucas', label: 'Lucas Oliveira' } ] },
        { value: 'gabriel', label: 'Gabriel Souza' }, { value: 'isabela', label: 'Isabela Santos' },
        { value: 'lucas', label: 'Lucas Oliveira' }, { value: 'beatriz', label: 'Beatriz Costa' }
      ],
      statusIntent: { 'Pendência documentos de crédito': 'notice', 'Crédito negado': 'negative', 'Crédito aprovado': 'positive' },
      filtrosSemResultado: { produto: ['Crédito com Garantia de Imóvel'], periodo: { start: '2026-04-01', end: '2026-04-15' } },
      propostas: PROPOSTAS
    }
  });

  /* ── Simuladores · Financiamento Imobiliário (Banker, The House) ── */
  var SIM_FILE = 'c2ijAoeyfssXy4Nu6vkwQu';
  function figS(node) { return 'https://www.figma.com/design/' + SIM_FILE + '/Simuladores-%7C-The-House?node-id=' + node.replace(':', '-'); }
  var BASE_S = ['Theme', 'AppShell', 'SideNavigation', 'TopNavigation', 'Breadcrumbs', 'Button', 'Icon'];
  window.JORNADAS.journeys.push({
    id: 'simuladores',
    title: 'Simuladores',
    subtitle: 'Nova simulação de Financiamento Imobiliário: dados do cliente e do imóvel, comparação entre bancos e geração da proposta',
    brands: ['thehouse'],
    scope: 'exclusiva',
    menu: 'simuladores',
    version: 'v1',
    updated: '2026-09-30',
    screen: 'simuladores',
    pattern: 'Padrão 3 · Perguntas + painel (formulário) e Padrão 5 · Lista (recentes e resultado)',
    figma: { label: 'Simuladores | The House · 1728x972 - L Desktop', url: figS('5513:3864') },
    description: 'O Banker escolhe o produto (hoje só Financiamento Imobiliário tem simulador), informa o perfil do cliente, o tipo de imóvel e os valores, e compara as condições dos bancos parceiros. Da comparação ele gera a proposta ou ajusta a simulação. As simulações recentes ficam na tela inicial e também podem virar proposta.',
    groups: [{ id: 'inicio', label: 'Início' }, { id: 'simulacao', label: 'Financiamento Imobiliário' }],
    steps: [
      { id: 'inicio', group: 'inicio', title: 'Simuladores · nova simulação e recentes', state: {}, node: '5513:3864', figmaName: 'Simuladores', shot: 'shots/40-simuladores.png',
        about: 'Escolha do produto a simular e a lista "Suas simulações recentes", com a origem (Nova proposta ou Simulador).',
        rules: ['"Financiamento Imobiliário" abre o simulador.', '"Crédito com Garantia de Imóveis" ainda não tem simulador no Figma: mostra um aviso.', '"Gerar proposta" de uma simulação recente abre a Nova Proposta.', 'Cliente não informado aparece como "Não informado", em cinza.'],
        components: BASE_S.concat(['Card', 'Avatar', 'List', 'Toast']) },
      { id: 'form-vazio', group: 'simulacao', title: 'Informe os dados (vazio)', state: { produto: 'fi' }, node: '5513:3914', figmaName: 'Simulador / Financimento Imobiliário - Sem Preencher', shot: 'shots/41-simulador-vazio.png',
        about: 'Formulário em branco. À direita, o painel "Como funciona" com os 3 passos: Informe os dados, Simule e Compare.',
        rules: ['"Simular" só aparece quando todos os campos estão preenchidos.', 'Pessoa Jurídica não pede Nascimento nem FGTS.', 'O valor de entrada não pode ser maior que o valor do imóvel.'],
        components: BASE_S.concat(['TextInput', 'Card', 'Avatar']) },
      { id: 'form-pf', group: 'simulacao', title: 'Informe os dados · Pessoa Física', state: { produto: 'fi', perfil: 'pf', preenchido: true }, node: '5513:3982', figmaName: 'Simulador / Financimento Imobiliário - PF', shot: 'shots/42-simulador-pf.png',
        about: 'Pessoa Física, imóvel Residencial, nascimento 20/12/1986, R$ 450.000,00 de imóvel, R$ 100.000,00 de entrada, 420 meses, com custas de cartório e sem FGTS.',
        rules: ['A opção escolhida fica na cor da marca; o tipo de imóvel escolhido ganha o check.', '"Simular" leva para o resultado com os dados informados.'],
        components: BASE_S.concat(['TextInput', 'Card', 'Avatar']) },
      { id: 'form-pj', group: 'simulacao', title: 'Informe os dados · Pessoa Jurídica', state: { produto: 'fi', perfil: 'pj', preenchido: true }, node: '5513:4216', figmaName: 'Simulador / Financimento Imobiliário - PJ', shot: 'shots/43-simulador-pj.png',
        about: 'Pessoa Jurídica: os campos passam a ser Valor do imóvel, Valor de entrada, Prazo de pagamento e Incluir custos de cartório.',
        rules: ['Sem Nascimento e sem FGTS para Pessoa Jurídica.'],
        components: BASE_S.concat(['TextInput', 'Card', 'Avatar']) },
      { id: 'resultado', group: 'simulacao', title: 'Resultado · compare os bancos', state: { produto: 'fi', resultado: true }, node: '5513:4051', figmaName: 'Simulador / Financimento Imobiliário - Resultado', shot: 'shots/44-simulador-resultado.png',
        about: 'Resumo da simulação e a comparação entre os bancos parceiros: valor financiado, taxa de juros, CET, parcelas, 1ª e última parcela.',
        rules: ['"Ajustar simulação" volta para o formulário com os dados preenchidos.', '"Gerar proposta" abre a Nova Proposta.', '"Compartilhar" copia o link da simulação.', 'No protótipo as parcelas são calculadas pela tabela SAC a partir dos dados informados.'],
        components: BASE_S.concat(['Card', 'CardItem', 'List', 'PartnerLogo', 'Toast']) }
    ],
    extras: [],
    notes: [
      'Base: página "1728x972 - L Desktop" do Figma (5 frames). A pessoa logada no Figma é "Gilberto Rocha · Banker"; no protótipo fica o topo padrão (Gilberto · Gestor Master).',
      'As ilustrações 3D de Residencial, Comercial e Terreno são artes do Figma (componente local "Simulador/Item/Img buttons", não é do TeddyDS) e entram como imagem.',
      'Os botões de tipo de imóvel e os de Sim/Não também são componentes locais do Figma: no protótipo viram Card clicável e Button outline do TeddyDS.',
      'Na tabela do Figma todas as linhas têm os mesmos valores (R$ 300.000,00 financiado, 12 parcelas) e não batem com os dados informados (R$ 350.000,00 e 420 meses). O protótipo calcula pela tabela SAC com taxas de exemplo por banco.',
      'Os logos dos bancos não estão no DS: PartnerLogo com iniciais.',
      'O Figma tem ainda, na página S Desktop, uma tela "Informações dos participantes" com o diálogo "Simulações encontradas", que pertence ao preenchimento da proposta e não entrou aqui.'
    ],
    content: {
      produtos: [
        { value: 'fi', label: 'Financiamento Imobiliário', text: 'Crédito para aquisição de imóveis.', icon: 'house--duotone' },
        { value: 'cgi', label: 'Crédito com Garantia de Imóveis', text: 'Crédito obtido usando um imóvel como garantia.', icon: 'building-classic--duotone' }
      ],
      recentes: [
        { id: 'r1', origem: 'Nova proposta', cliente: 'João da Silva | 293.254.886-09', produto: 'Financiamento Imobiliário', valor: 450000, data: '01 set. às 20:15' },
        { id: 'r2', origem: 'Simulador', cliente: null, produto: 'Financiamento Imobiliário', valor: 450000, data: '01 set. às 20:15' }
      ],
      tipos: [
        { value: 'residencial', label: 'Residencial', image: 'img/simuladores/residencial.png' },
        { value: 'comercial', label: 'Comercial', image: 'img/simuladores/comercial.png' },
        { value: 'terreno', label: 'Terreno', image: 'img/simuladores/terreno.png' }
      ],
      exemplo: { pf: { tipo: 'residencial', nascimento: '20/12/1986', valor: '450.000,00', entrada: '100.000,00', prazo: '420', cartorio: 'sim', fgts: 'nao' },
                 pj: { tipo: 'residencial', valor: '450.000,00', entrada: '100.000,00', prazo: '420', cartorio: 'sim' } },
      comoFunciona: { title: 'Como funciona', text: 'Transforme os dados do cliente em oportunidades de negócio. Simule, compare as condições disponíveis e encontre a melhor alternativa para avançar com a proposta.',
        steps: [
          { icon: 'profile--duotone', title: 'Informe os dados', text: 'Preencha as informações do cliente e do imóvel com atenção.' },
          { icon: 'calculator--duotone', title: 'Simule', text: 'Veja as propostas disponíveis com base nos dados informados.' },
          { icon: 'status-up--duotone', title: 'Compare', text: 'Encontre a condição mais adequada e siga para a geração da proposta!' }
        ] },
      /* Taxas de exemplo (a.a.) para o cálculo do protótipo. */
      bancos: [
        { nome: 'Itaú', taxa: 10.49 }, { nome: 'Bradesco', taxa: 10.79 }, { nome: 'Santander', taxa: 10.99 },
        { nome: 'BRB', taxa: 10.29 }, { nome: 'Caixa', taxa: 9.99 }, { nome: 'Inter', taxa: 11.29 }
      ]
    }
  });

  /* ── Base de clientes · Clientes (The House) ── */
  var CLI_FILE = 'Ij1PaYr94R7TnfpDAyfPJR';
  function figC(node) { return 'https://www.figma.com/design/' + CLI_FILE + '/Clientes-%7C-The-House?node-id=' + node.replace(':', '-'); }
  function dig(seed, n) { var s = ''; for (var i = 0; i < n; i++) { seed = (seed * 9301 + 49297) % 233280; s += Math.floor(seed / 233280 * 10); } return s; }
  function cpf(i) { var d = dig(i * 7 + 3, 11); return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9, 11); }
  function cnpj(i) { var d = dig(i * 11 + 5, 8); return d.slice(0, 2) + '.' + d.slice(2, 5) + '.' + d.slice(5, 8) + '/0001-' + dig(i + 2, 2); }
  function fone(i) { var d = dig(i * 13 + 1, 8); return '(11) 9' + d.slice(0, 4) + '-' + d.slice(4, 8); }
  function mail(n) { return n.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '.' + n.split(' ').slice(-1)[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '') + '@email.com'; }
  var DATAS = ['2026-01-14', '2026-01-11', '2025-12-10', '2025-12-08', '2025-12-08', '2025-12-08', '2025-12-08', '2025-12-05', '2025-12-03', '2025-12-01', '2025-11-28', '2025-11-25', '2025-11-21', '2025-11-18', '2025-11-14', '2025-11-10', '2025-11-06', '2025-11-03', '2025-10-30', '2025-10-27', '2025-10-22', '2025-10-17', '2025-10-14', '2025-10-09', '2025-10-06', '2025-10-01', '2025-09-26', '2025-09-22', '2025-09-18', '2025-09-15', '2025-09-10', '2025-09-05', '2025-09-02', '2025-08-28', '2025-08-25'];
  var NOMES_PF = ['Elaine Cristina Gomes Gonzaga', 'Carla Silva', 'Ana Paula Oliveira', 'Eduardo Souza Lima', 'Carla Fernanda Lopes', 'Pablo Silva', 'Sophia Ribeiro', 'Fernanda Lopes Martins', 'Pablo Henrique Duarte', 'Paulo Silva Neto',
    'Mariana Costa', 'Rafael Almeida', 'Juliana Pereira', 'Thiago Barbosa', 'Beatriz Nogueira', 'Lucas Carvalho', 'Camila Rocha', 'Gustavo Mendes', 'Larissa Freitas', 'Bruno Teixeira',
    'Patrícia Moura', 'Diego Araújo', 'Aline Castro', 'Rodrigo Pires', 'Vanessa Cardoso', 'Marcelo Dias', 'Tatiane Ramos', 'Felipe Gomes', 'Renata Vieira', 'André Martins',
    'Priscila Batista', 'Leandro Farias', 'Natália Correia', 'Vinícius Monteiro', 'Débora Cunha'];
  var NOMES_PJ = [['Costa Silva Consultoria Empresarial', 'Elaine Roberts'], ['Silva Carvalho Enterprises', 'Carla Hernandez'], ['Almeida & Partners', 'Ana Perez'], ['EducaCorp', 'Eduardo Souza'], ['Carvalho Consulting', 'Carla Hernandez'],
    ['Pereira Tech Solutions', 'Pablo Martinez'], ['Ribeiro Consultoria Empresarial', 'Sophia Johnson'], ['Carvalho & Fernandes Associados', 'Carla Hernandez'], ['Pereira Group', 'Pablo Martinez'], ['Kappa Corporation', 'Marcos Andrade'],
    ['Nova Engenharia', 'Renato Faria'], ['Horizonte Incorporadora', 'Luciana Prado'], ['Alfa Logística', 'Sérgio Couto'], ['Brasa Alimentos', 'Helena Moraes'], ['Vértice Construções', 'Otávio Reis'],
    ['Sol Nascente Imóveis', 'Cristina Lage'], ['Delta Serviços', 'Fábio Leal'], ['Aurora Tecnologia', 'Mônica Sales'], ['Prisma Comunicação', 'Igor Tavares'], ['Atlas Transportes', 'Rita Fontes'],
    ['Verde Vale Agro', 'Joaquim Pacheco'], ['Porto Seguro Contábil', 'Denise Brito'], ['Lumen Arquitetura', 'Caio Bastos'], ['Monte Azul Hotéis', 'Sandra Queiroz'], ['Norte Sul Distribuidora', 'Ricardo Paiva'],
    ['Ômega Saúde', 'Paula Siqueira'], ['Capital Participações', 'Hugo Rezende'], ['Estrela Educação', 'Márcia Lobo'], ['Rio Claro Metalúrgica', 'Wagner Lopes'], ['Boa Vista Varejo', 'Simone Aguiar'],
    ['Pioneira Energia', 'Álvaro Rangel'], ['Cidade Nova Empreendimentos', 'Tânia Rezende'], ['Maré Alta Pescados', 'Júlio Cesar Brandão'], ['Serra Dourada Mineração', 'Elisa Campos'], ['Ponte Forte Engenharia', 'Nelson Bittencourt']];
  var CLIENTES_PF = NOMES_PF.map(function (n, i) { return { id: String(35495 - i * 17), nome: n, doc: i === 0 ? '873.035.806-03' : cpf(i), telefone: fone(i), email: i === 0 ? 'elaine@email.com' : mail(n), atualizado: DATAS[i] + 'T12:00:00' }; });
  var CLIENTES_PJ = NOMES_PJ.map(function (n, i) { return { id: String(87656 - i * 23), nome: n[0], doc: i === 9 ? '58.272.000/0001-00' : cnpj(i), faturamento: [500000, 1200000, 850000, 2300000, 640000, 3100000, 780000, 920000, 1500000, 500000][i % 10], representante: n[1], email: mail(n[0]), atualizado: DATAS[i] + 'T12:00:00' }; });
  var BASE_C = ['Theme', 'AppShell', 'SideNavigation', 'TopNavigation', 'Breadcrumbs', 'Tabs', 'Search', 'List', 'IconButton', 'Tooltip', 'Dropdown', 'Icon'];

  window.JORNADAS.journeys.push({
    id: 'clientes',
    title: 'Clientes',
    subtitle: 'Base de clientes: lista de Pessoa Física e Pessoa Jurídica, busca, detalhes do cliente, edição e exclusão',
    brands: ['thehouse'],
    scope: 'exclusiva',
    menu: 'base-minha',
    version: 'v1',
    updated: '2026-09-30',
    screen: 'clientes',
    pattern: 'Padrão 5 · Lista com filtros e detalhe em Drawer',
    figma: { label: 'Clientes | The House · 2. Desktop L | 1728x924', url: figC('1:163677') },
    description: 'Lista dos clientes da carteira, separada em Pessoa Física e Pessoa Jurídica, com busca pelo nome e contagem. Em cada linha: enviar LGPD, criar proposta e o menu com Ver detalhes, Documentos e Excluir cliente. Os detalhes abrem num Drawer com os dados do cliente, o histórico de negócios, a edição e as ações Consulta Serasa e Gerar nova proposta.',
    groups: [{ id: 'lista', label: 'Lista e busca' }, { id: 'detalhe', label: 'Detalhes do cliente' }],
    steps: [
      { id: 'pf', group: 'lista', title: 'Pessoa Física', state: { tab: 'pf' }, node: '1:163677', figmaName: 'Clientes (PF)', shot: 'shots/50-clientes-pf.png',
        about: 'Lista dos clientes Pessoa Física: Nome, CPF, Telefone, E-mail e Atualizado em, com 10 por página.',
        rules: ['Ícone de escudo: "Enviar LGPD". Ícone da carteira: "Criar proposta" (abre a Nova Proposta).', 'O "..." tem Ver detalhes, Documentos e Excluir cliente (em vermelho).', 'Clicar na linha também abre os detalhes.'],
        components: BASE_C.concat(['Pagination', 'Toast']) },
      { id: 'pj', group: 'lista', title: 'Pessoa Jurídica', state: { tab: 'pj' }, node: '4:7278', figmaName: 'Clientes (PJ)', shot: 'shots/51-clientes-pj.png',
        about: 'Lista dos clientes Pessoa Jurídica: Razão Social, CNPJ, Faturamento anual, Representante Legal e Atualizado em.',
        rules: ['As mesmas ações da Pessoa Física.'], components: BASE_C.concat(['Pagination', 'Toast']) },
      { id: 'busca', group: 'lista', title: 'Busca com resultado', state: { tab: 'pj', busca: 'Kappa' }, node: '1:163789', figmaName: 'Pesquisa com resultados', shot: 'shots/52-clientes-busca.png',
        about: 'A busca filtra pelo nome enquanto a pessoa digita e atualiza a contagem ("1 cliente").',
        rules: ['O "x" da busca limpa o filtro.', 'A busca também encontra pelo CPF ou CNPJ.'], components: BASE_C },
      { id: 'sem-resultado', group: 'lista', title: 'Busca sem resultado', state: { tab: 'pf', busca: 'Ana Boiadeira Castella' }, node: '1:163763', figmaName: 'Pesquisa sem resultados', shot: 'shots/53-clientes-sem-resultado.png',
        about: 'Nenhum cliente com o nome buscado: a lista some e aparece "Nenhum cliente encontrado para essa busca.".',
        rules: ['A contagem mostra "0 cliente".'], components: BASE_C },
      { id: 'detalhe-pf', group: 'detalhe', title: 'Detalhes · Pessoa Física', state: { tab: 'pf', cliente: '35495' }, node: '118:6290', figmaName: 'Drawer/Informações do cliente/PF', shot: 'shots/54-cliente-pf.png',
        about: 'Drawer com o tipo e o ID do cliente, nome, CPF (com copiar), as abas Dados pessoais, Telefones, Vínculos e Empresas, e o Histórico de negócios à direita.',
        rules: ['"Editar informações" abre a edição.', '"Consulta Serasa" e "Gerar nova proposta" no rodapé; "Excluir cliente" à esquerda.', 'Status LGPD e Carta BACEN com Status positivo; a Carta BACEN tem download.'],
        components: ['Drawer', 'Tag', 'Tabs', 'CardItem', 'Status', 'Card', 'Button', 'IconButton', 'TooltipAction', 'Toast'] },
      { id: 'editar-pf', group: 'detalhe', title: 'Editar · Pessoa Física', state: { tab: 'pf', cliente: '35495', editar: true }, node: '118:6666', figmaName: 'Drawer/Informações do cliente/PF (editando)', shot: 'shots/55-cliente-pf-editar.png',
        about: 'Edição dos dados: só o e-mail e as observações ficam editáveis; os dados que vêm do CPF e do endereço aparecem bloqueados.',
        rules: ['"Salvar" pede confirmação ("Salvar alterações").', '"Cancelar" com alterações pede confirmação ("Descartar alterações?").'],
        components: ['Drawer', 'Tag', 'Tabs', 'TextInput', 'TextArea', 'Dialog', 'Button', 'Toast'] },
      { id: 'detalhe-pj', group: 'detalhe', title: 'Detalhes · Pessoa Jurídica', state: { tab: 'pj', cliente: '87449' }, node: '1:163672', figmaName: 'Drawer/Informações do cliente/PJ', shot: 'shots/56-cliente-pj.png',
        about: 'Drawer da empresa: abas Dados da empresa, Representante legal e Atividades econômicas secundárias.',
        rules: ['No Figma a Tag deste Drawer está escrita "Pessoa Física" (roxa); o protótipo usa "Pessoa Jurídica".'],
        components: ['Drawer', 'Tag', 'Tabs', 'CardItem', 'Status', 'Card', 'Button', 'Toast'] },
      { id: 'excluir', group: 'detalhe', title: 'Excluir cliente', state: { tab: 'pf', excluir: '35495' }, node: '1:163762', figmaName: 'Dialog · Excluir cliente', shot: null,
        about: 'Confirmação "Excluir cliente": "Tem certeza que deseja excluir este lead?". Ao excluir, o cliente sai da lista e aparece o Toast "Cliente excluído, todos os dados foram removidos."',
        rules: ['"Excluir" em vermelho (negative).'], components: ['Dialog', 'Toast'] }
    ],
    extras: [],
    notes: [
      'Base: página "2. Desktop L | 1728x924" do Figma. A pessoa logada no Figma é "Gilberto Silva · Gestor Master"; no protótipo fica o topo padrão.',
      'O menu do Figma mostra "Base de clientes" aberto sem os nomes dos subitens; no protótipo o subitem desta tela se chama "Clientes" (o outro, "Importar clientes", ainda é provisório).',
      'No Figma todas as linhas repetem o mesmo CPF, telefone e CNPJ; o protótipo usa documentos de exemplo diferentes para cada cliente. "Edus Company" aparecia na lista de Pessoa Física e virou "Eduardo Souza Lima".',
      'A busca "Kappa" no Figma aparece na aba Pessoa Física, mas Kappa Corporation é Pessoa Jurídica: no protótipo a etapa fica na aba PJ.',
      'O Figma não mostra o conteúdo das abas Telefones, Vínculos, Empresas, Representante legal e Atividades; o protótipo mostra conteúdo de exemplo simples.',
      'Na edição do Figma o campo "Nome completo da mãe" aparece com "Feminino" (erro de cópia); o protótipo usa "Barbara Cristina".'
    ],
    content: {
      pf: CLIENTES_PF, pj: CLIENTES_PJ,
      detalhes: {
        '35495': { tipo: 'pf', nome: 'Elaine Cristina Gomes Gonzaga', doc: '873.035.806-03', nascimento: '10/10/1996', genero: 'Feminino', estadoCivil: 'Casada', renda: 'R$ 10.000,00', mae: 'Barbara Cristina', email: 'elainegg21@gmail.com',
          endereco: ['R. Princesa Izabel, 741', 'Jardim Vila Galvão, Guarulhos - SP, 07055-040'], cep: '07055-040', rua: 'R. Princesa Izabel', numero: '741', complemento: '', uf: 'SP', cidade: 'Guarulhos',
          lgpd: 'Assinado', bacen: 'Assinado', criado: '20 jul 2023', obs: '', telefones: [{ tipo: 'Celular', numero: '(11) 96894-1111', principal: true }, { tipo: 'Residencial', numero: '(11) 2408-3321' }],
          vinculos: [], empresas: [],
          historico: [{ produto: 'Financiamento Imobiliário', data: '30 jul 2023', status: 'Cancelada', intent: 'negative' }, { produto: 'Financiamento Imobiliário', data: '22 ago 2023', status: 'Aguardando assinatura', intent: 'notice' }] },
        '87449': { tipo: 'pj', nome: 'Kappa Corporation', doc: '58.272.000/0001-00', fantasia: 'Não possui', abertura: '10/10/1996', porte: 'Pequeno', nivel: 'Não possui', natureza: 'Não possui', regime: 'Não possui',
          capital: 'R$ 1.000.000,00', faturamento: 'R$ 500.000,00', inicioSimples: 'Não possui', fimSimples: 'Não possui', mei: 'Sim', renda: 'R$ 65.000,00', funcionarios: '115', email: 'kappacorporation@email.com',
          endereco: ['R. Princesa Izabel, 741', 'Jardim Vila Galvão, Guarulhos - SP, 07055-040'], lgpd: 'Assinado', bacen: 'Assinado', criado: '20 jul 2023', obs: '',
          representante: { nome: 'Marcos Andrade', cpf: '312.458.967-20', cargo: 'Sócio-administrador', email: 'marcos.andrade@kappacorp.com.br', telefone: '(11) 97451-2230' },
          atividades: ['6810-2/02 · Aluguel de imóveis próprios', '6821-8/01 · Corretagem na compra e venda de imóveis'],
          historico: [{ produto: 'Financiamento de imóvel', data: '14 dez 2025', status: 'Em negociação', intent: 'notice' }, { produto: 'Consórcio de imóvel', data: '14 dez 2025', status: 'Novo negócio', intent: 'informative' }] }
      }
    }
  });

  /* ── Configurações (The House) ── */
  var CFG_FILE = 'Ou7Tt2YCu5G7TROjcuAAkY';
  function figG(node) { return 'https://www.figma.com/design/' + CFG_FILE + '/Configura%C3%A7%C3%B5es-%7C-The-House?node-id=' + node.replace(':', '-'); }
  var BASE_G = ['Theme', 'AppShell', 'SideNavigation', 'TopNavigation', 'Breadcrumbs', 'Tabs', 'Button', 'Icon'];
  window.JORNADAS.journeys.push({
    id: 'configuracoes',
    title: 'Configurações',
    subtitle: 'Configurações da conta: segurança (alterar e recuperar a senha) e sessões confiáveis',
    brands: ['thehouse'],
    scope: 'exclusiva',
    menu: 'configuracoes',
    version: 'v1',
    updated: '2026-09-30',
    screen: 'configuracoes',
    pattern: 'Padrão 9 · Configurações com abas (formulário + card de apoio; lista de sessões)',
    figma: { label: 'Configurações | The House · 3. Desktop S - 1366x768 (Light)', url: figG('17:61221') },
    description: 'Aberta pela engrenagem do topo (Configurações › Conta, Loja, Segurança ou Sessões confiáveis), com as mesmas opções das abas. Abas Conta, Loja, Segurança e Sessões confiáveis. Em Segurança a pessoa altera a senha, com a força da senha em tempo real, ou recupera o acesso por código enviado por e-mail ou WhatsApp. Em Sessões confiáveis vê os dispositivos com acesso autorizado e remove os que não usa mais.',
    groups: [{ id: 'seguranca', label: 'Segurança' }, { id: 'recuperar', label: 'Recuperar senha' }, { id: 'sessoes', label: 'Sessões confiáveis' }, { id: 'sem-tela', label: 'Sem tela no Figma' }],
    steps: [
      { id: 'seguranca', group: 'seguranca', title: 'Alterar senha', state: { tab: 'seguranca' }, node: '17:61219', figmaName: 'Config/Store/Security', shot: 'shots/60-config-seguranca.png',
        about: 'Formulário "Alterar senha" (senha atual, nova senha e confirmação) e, à direita, o card "Não lembra sua senha atual?" com o botão "Recuperar senha".',
        rules: ['"Alterar senha" (rodapé) só fica ativo com a senha atual preenchida, a nova senha forte e a confirmação igual.', 'Cada campo tem o olho para mostrar a senha.', 'Ao alterar: Toast "Senha alterada com sucesso!".'],
        components: BASE_G.concat(['TextInput', 'Card', 'Avatar', 'ProgressBar', 'Toast']) },
      { id: 'senha-media', group: 'seguranca', title: 'Força da senha · média', state: { tab: 'seguranca', exemplo: 'media' }, node: '40:688', figmaName: 'Config/Store/Security (média)', shot: 'shots/61-config-senha-media.png',
        about: 'Ao digitar a nova senha aparece a caixa "Força da senha" com 3 barras e a dica do que falta.',
        rules: ['Critérios: 8 caracteres, maiúsculas e minúsculas, número e caractere especial.', 'Fraca (1 barra, vermelho), Média (2 barras, amarelo), Forte (3 barras, verde).', 'A dica mostra o primeiro critério que falta; a média do Figma: "Mínimo de 1 caractere especial (@$!)".'],
        components: BASE_G.concat(['TextInput', 'ProgressBar']) },
      { id: 'senha-forte', group: 'seguranca', title: 'Força da senha · forte', state: { tab: 'seguranca', exemplo: 'forte' }, node: '40:1043', figmaName: 'Config/Store/Security (forte)', shot: 'shots/62-config-senha-forte.png',
        about: 'Senha forte e confirmação igual: "Tudo correto!" e o botão "Alterar senha" ativo.',
        rules: ['Confirmação diferente mostra "As senhas não coincidem."'], components: BASE_G.concat(['TextInput', 'ProgressBar', 'Toast']) },
      { id: 'recuperar', group: 'recuperar', title: 'Recuperar acesso · canal', state: { tab: 'seguranca', dialogo: 'canal' }, node: '67:33199', figmaName: 'Dialog · Recuperar acesso', shot: 'shots/63-config-recuperar.png',
        about: 'Escolha de onde receber o código de 6 dígitos: e-mail ou WhatsApp (mascarados).',
        rules: ['"Enviar código" só fica ativo depois de escolher o canal.'], components: ['Dialog', 'Radio', 'Card', 'Avatar', 'Button'] },
      { id: 'codigo', group: 'recuperar', title: 'Verifique sua identidade', state: { tab: 'seguranca', dialogo: 'codigo' }, node: '67:34720', figmaName: 'Dialog · Verifique sua identidade', shot: 'shots/64-config-codigo.png',
        about: 'Código de 6 dígitos com contagem regressiva ("Expira em 4:59") e "Reenviar".',
        rules: ['"Validar código" só fica ativo com os 6 dígitos.', '"Reenviar" reinicia a contagem e mostra um Toast.', 'No protótipo qualquer código de 6 dígitos é aceito.'],
        components: ['Dialog', 'TokenInput', 'Link', 'Button', 'Toast'] },
      { id: 'nova-senha', group: 'recuperar', title: 'Defina uma nova senha', state: { tab: 'seguranca', dialogo: 'nova' }, node: '68:34905', figmaName: 'Dialog · Defina uma nova senha', shot: 'shots/65-config-nova-senha.png',
        about: 'Nova senha com a mesma caixa de força e a confirmação. Ao salvar, Toast "Senha alterada com sucesso!".',
        rules: ['"Alterar senha" só com senha forte e confirmação igual.'], components: ['Dialog', 'TextInput', 'ProgressBar', 'Button', 'Toast'] },
      { id: 'sessoes', group: 'sessoes', title: 'Sessões confiáveis', state: { tab: 'sessoes' }, node: '133:1497', figmaName: 'Config/Dispositivos confiáveis', shot: 'shots/66-config-sessoes.png',
        about: 'Dispositivos com acesso autorizado: dispositivo (com ID), navegador e versão, último acesso e próxima validação.',
        rules: ['O dispositivo atual tem a Tag "Ativo" e não pode ser removido.', 'Próxima validação em verde quando falta mais de 7 dias e em amarelo quando falta pouco.', 'A lixeira remove o dispositivo depois da confirmação.'],
        components: BASE_G.concat(['List', 'Tag', 'Avatar', 'IconButton', 'Dialog', 'Toast']) },
      { id: 'remover', group: 'sessoes', title: 'Remover dispositivo', state: { tab: 'sessoes', remover: 'd2' }, node: '140:3156', figmaName: 'Dialog · Remover dispositivo', shot: 'shots/67-config-remover.png',
        about: 'Confirmação: "Ao remover o iPhone 13, será necessário validar o acesso novamente com um token no próximo login por este dispositivo." Depois, Toast "Dispositivo removido com sucesso."',
        rules: ['"Remover dispositivo" em vermelho (negative).'], components: ['Dialog', 'Toast'] },
      { id: 'conta', group: 'sem-tela', title: 'Conta (sem tela)', state: { tab: 'conta' }, node: '17:61219', figmaName: '—', shot: null,
        about: 'A aba Conta existe no Figma, mas ainda não tem tela desenhada.', rules: [], components: BASE_G },
      { id: 'loja', group: 'sem-tela', title: 'Loja (sem tela)', state: { tab: 'loja' }, node: '17:61219', figmaName: '—', shot: null,
        about: 'A aba Loja existe no Figma, mas ainda não tem tela desenhada.', rules: [], components: BASE_G }
    ],
    extras: [
      { title: 'Recuperar acesso · sem canal escolhido', node: '66:30901', shot: 'shots/69-config-recuperar-vazio.png', about: '"Enviar código" desabilitado até escolher o canal.' },
      { title: 'Verifique sua identidade · vazio', node: '67:33309', shot: 'shots/70-config-codigo-vazio.png', about: 'Código em branco, "Validar código" desabilitado.' },
      { title: 'Login (Usuário deslogado)', node: '60:26310', shot: 'shots/68-login.png', about: 'Tela de login que está no mesmo arquivo: e-mail, senha, "Acessar", "Lembre-me" e "Esqueceu sua senha?". Fica como referência; não é parte das Configurações.' }
    ],
    notes: [
      'O Figma está só em Desktop S (1366x768). A pessoa logada é "Gilberto · Banker"; no protótipo fica o topo padrão (Gestor Master) e o menu lateral padrão (o Figma mostra o menu recolhido).',
      'As abas Conta e Loja aparecem no Figma, mas sem tela: no protótipo mostram um aviso.',
      'A caixa "Força da senha" não é componente do TeddyDS: é uma composição com ProgressBar (3 segmentos) e tokens de status.',
      'Os logos dos navegadores (Chrome, Safari, Edge, Opera) são marcas de terceiros e não entram: fica só o nome e a versão.',
      'No Figma a próxima validação dos dois últimos dispositivos (20/07/2025) está antes do último acesso; o protótipo usa datas coerentes com 30/09/2026.',
      'Os IDs dos dispositivos se repetem no Figma (e807...c4d3); no protótipo cada um tem o seu.'
    ],
    content: {
      tabs: [{ value: 'conta', label: 'Conta', icon: 'profile--duotone' }, { value: 'loja', label: 'Loja', icon: 'store--duotone' },
             { value: 'seguranca', label: 'Segurança', icon: 'lock-key--duotone' }, { value: 'sessoes', label: 'Sessões confiáveis', icon: 'monitor-mobbile--duotone' }],
      recuperar: { title: 'Não lembra sua senha atual?', text: 'Recupere o acesso à sua conta utilizando os canais cadastrados.', itens: [
        { icon: 'email--duotone', title: 'Código por e-mail ou WhatsApp', text: 'Receba um código de verificação instantaneamente.' },
        { icon: 'shield-check--duotone', title: 'Validação segura', text: 'Confirme sua identidade antes de redefinir sua senha.' },
        { icon: 'ray--duotone', title: 'Processo rápido', text: 'Conclua a recuperação em menos de 2 minutos.' } ] },
      canais: [{ value: 'email', label: 'E-mail', destino: 'gilb****@gmail.com', icon: 'email--duotone' }, { value: 'whatsapp', label: 'Whatsapp', destino: '(11) 99****-6780', icon: 'whatsapp--duotone' }],
      exemplos: { media: { atual: 'Casa@2025', nova: 'Imovel2026' }, forte: { atual: 'Casa@2025', nova: 'Imovel@2026', confirma: 'Imovel@2026' } },
      dispositivos: [
        { id: 'd1', nome: 'Este dispositivo - Windows 11', tipo: 'desktop', codigo: '5f3a...762b', navegador: 'Google Chrome', versao: 'Versão 121.0.6167.139', acesso: 'Hoje, 10:24', validacao: '28/10/2026', faltam: 28, atual: true },
        { id: 'd2', nome: 'iPhone 13 - iOS 17.5', curto: 'iPhone 13', tipo: 'mobile', codigo: 'e807...c4d3', navegador: 'Safari', versao: 'Versão 17.5', acesso: 'Ontem, 16:45', validacao: '28/10/2026', faltam: 28 },
        { id: 'd3', nome: 'Desktop L28312 - Windows 11', curto: 'Desktop L28312', tipo: 'desktop', codigo: 'a91c...07fe', navegador: 'Microsoft Edge', versao: 'Versão 121.0.2277.83', acesso: '5 dias atrás', validacao: '28/10/2026', faltam: 28 },
        { id: 'd4', nome: 'Notebook N11874 - Windows 11', curto: 'Notebook N11874', tipo: 'desktop', codigo: '3b27...9d10', navegador: 'Opera', versao: 'Versão 106.0.4998.70', acesso: '7 dias atrás', validacao: '05/10/2026', faltam: 5 },
        { id: 'd5', nome: 'Desktop L30541 - Windows 11', curto: 'Desktop L30541', tipo: 'desktop', codigo: 'c6d4...51ab', navegador: 'Não identificado', versao: 'Versão não disponível', acesso: '7 dias atrás', validacao: '05/10/2026', faltam: 5 }
      ]
    }
  });
})();
