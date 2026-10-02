import type { Arte, ArteModelo } from '../../shared/arte.component';

/** Categorias das artes prontas (os produtos da The House + datas e dicas). */
interface Base { chamada: string; destaque: string; texto: string; itens: string[]; legenda: string }
interface Categoria { id: string; label: string; icone: string; hashtags: string[]; artes: Base[] }

const CATEGORIAS: Categoria[] = [
  {
    id: 'financiamento', label: 'Financiamento imobiliário', icone: 'HouseLine', hashtags: ['#financiamentoimobiliario', '#casapropria', '#thehouse'],
    artes: [
      { chamada: 'Chegou a hora de', destaque: 'sair do aluguel', texto: 'Financie até 80% do imóvel com prazo de até 35 anos.', itens: ['Imóveis novos e usados', 'Taxas competitivas', 'Simulação gratuita'], legenda: 'Pagar aluguel ou investir no que é seu? 🏡 Financie até 80% do seu imóvel em até 35 anos, com as melhores condições dos bancos parceiros. Me chama que eu faço sua simulação sem compromisso!' },
      { chamada: 'Compare os bancos', destaque: 'em um só lugar', texto: 'Itaú, Bradesco, Santander, Caixa e mais. Eu encontro a melhor taxa para você.', itens: ['Análise rápida', 'Atendimento consultivo', 'Sem custo para simular'], legenda: 'Por que escolher um banco só? 💡 Comparo as ofertas dos principais bancos e te mostro a melhor condição para o seu financiamento. Fale comigo!' },
      { chamada: 'Seu primeiro imóvel', destaque: 'mais perto do que parece', texto: 'Use o FGTS na entrada e reduza o valor das parcelas.', itens: ['Uso do FGTS', 'Parcelas que cabem no bolso', 'Acompanhamento até a chave'], legenda: 'Sabia que dá para usar o FGTS na entrada do seu imóvel? 🔑 Te ajudo em todas as etapas, da simulação até a entrega das chaves.' },
      { chamada: 'Taxas a partir de', destaque: '11,69% a.a. + TR', texto: 'Condições especiais para imóveis residenciais e comerciais.', itens: ['Tabela SAC ou Price', 'Até 420 meses', 'Residencial e comercial'], legenda: 'Taxas a partir de 11,69% a.a. + TR para você realizar o sonho do imóvel próprio. 📈 Condições sujeitas à análise de crédito. Vamos simular?' },
    ],
  },
  {
    id: 'cgi', label: 'Crédito com Garantia de Imóvel', icone: 'Key', hashtags: ['#creditocomgarantia', '#homeequity', '#thehouse'],
    artes: [
      { chamada: 'Seu imóvel vale', destaque: 'crédito mais barato', texto: 'Até 60% do valor do imóvel com juros a partir de 1,09% a.m.', itens: ['Até 240 meses', 'Carência de até 12 meses', 'Continue morando no imóvel'], legenda: 'Precisa de crédito com juros baixos? 💰 Use seu imóvel como garantia e tenha até 60% do valor dele, com prazo de até 240 meses. E você continua morando nele!' },
      { chamada: 'Troque dívidas caras', destaque: 'por uma parcela só', texto: 'Quite cartão e cheque especial com taxas muito menores.', itens: ['Organize suas finanças', 'Parcela fixa', 'Juros a partir de 1,09% a.m.'], legenda: 'Cartão e cheque especial pesando no bolso? 😮‍💨 Com o crédito com garantia de imóvel você troca dívidas caras por uma parcela só, com juros bem menores.' },
      { chamada: 'Invista no seu negócio', destaque: 'com o que você já tem', texto: 'Capital para expandir, reformar ou investir, com prazos longos.', itens: ['Para PF e PJ', 'Imóveis de R$ 70 mil a R$ 20 mi', 'Contratação simples'], legenda: 'Seu imóvel pode ser o impulso que o seu negócio precisa. 🚀 Crédito com prazo longo e juros baixos para expandir ou investir. Me chama!' },
    ],
  },
  {
    id: 'veiculos', label: 'Crédito com Garantia de Veículos', icone: 'Car', hashtags: ['#creditocomgarantia', '#autoequity', '#thehouse'],
    artes: [
      { chamada: 'Seu carro quitado', destaque: 'vira crédito', texto: 'Até 90% do valor do veículo, e ele continua com você.', itens: ['De 3 a 60 meses', 'Até 60 dias de carência', 'Parcelas fixas'], legenda: 'Seu carro quitado pode virar crédito com juros baixos! 🚗 Até 90% do valor do veículo, e você continua usando normalmente. Vamos simular?' },
      { chamada: 'Dinheiro rápido', destaque: 'sem abrir mão do carro', texto: 'Taxas reduzidas em comparação ao empréstimo pessoal.', itens: ['Carros, SUVs e caminhões', 'Análise ágil', 'Sem burocracia'], legenda: 'Precisa de dinheiro rápido? Use seu veículo como garantia e pague menos juros que no empréstimo pessoal. 💸 Fale comigo.' },
    ],
  },
  {
    id: 'construcao', label: 'Financiamento para Construção', icone: 'HardHat', hashtags: ['#construcao', '#casanova', '#thehouse'],
    artes: [
      { chamada: 'Do terreno', destaque: 'à casa dos sonhos', texto: 'Crédito para construir com aprovação do comitê em até 2 dias úteis.', itens: ['Até 120 meses', 'Taxas flexíveis', 'Sob medida para o seu projeto'], legenda: 'Tem o terreno e quer construir? 🏗️ Crédito para construção com aprovação rápida e prazo de até 120 meses. Me conta do seu projeto!' },
      { chamada: 'Construa com', destaque: 'quem entende', texto: 'Parceiros especializados em crédito para construção.', itens: ['Pouca burocracia', 'Ampla aceitação de imóveis', 'Acompanhamento da obra'], legenda: 'Construir seu imóvel pode ser mais simples do que você imagina. 🧱 Conte com parceiros especializados e condições sob medida.' },
    ],
  },
  {
    id: 'dicas', label: 'Dicas e datas', icone: 'CalendarStar', hashtags: ['#dicasfinanceiras', '#mercadoimobiliario', '#thehouse'],
    artes: [
      { chamada: 'Dica da semana', destaque: 'organize a entrada', texto: 'Separe de 20% a 30% do valor do imóvel para entrada e custos.', itens: ['ITBI e escritura', 'Avaliação do imóvel', 'Reserva de emergência'], legenda: 'Dica da semana 💡 Antes de financiar, separe de 20% a 30% do valor do imóvel para entrada, ITBI, escritura e avaliação. Ficou com dúvida? Me chama!' },
      { chamada: 'Feliz Dia do', destaque: 'Corretor de Imóveis', texto: 'Obrigado por confiar no meu trabalho para realizar sonhos.', itens: ['27 de agosto', 'Gratidão a cada cliente', 'Juntos até a chave'], legenda: 'Hoje é Dia do Corretor de Imóveis! 🎉 Obrigado a cada cliente que confia no meu trabalho para realizar o sonho da casa própria.' },
      { chamada: 'Você sabia?', destaque: 'dá para usar o FGTS', texto: 'Na entrada, para amortizar ou para quitar o financiamento.', itens: ['Entrada do imóvel', 'Amortizar o saldo', 'Reduzir parcelas'], legenda: 'Você sabia que o FGTS pode ser usado na entrada, para amortizar ou até para quitar o financiamento? 🔎 Te explico como!' },
    ],
  },
];

const MODELOS: ArteModelo[] = ['cor', 'claro', 'escuro', 'dividido'];

export interface Secao { id: string; label: string; icone: string; artes: Arte[] }

export const SECOES: Secao[] = CATEGORIAS.map((c, ci) => ({
  id: c.id, label: c.label, icone: c.icone,
  artes: c.artes.map((b, i) => ({
    id: `${c.id}-${i}`, categoria: c.label, modelo: MODELOS[(i + ci) % MODELOS.length], icone: c.icone,
    chamada: b.chamada, destaque: b.destaque, texto: b.texto, itens: b.itens, legenda: b.legenda, hashtags: c.hashtags,
  })),
}));

/** Capas para os destaques do Instagram. */
export const CAPAS = [
  { label: 'Imóveis', icone: 'HouseLine' }, { label: 'Crédito', icone: 'Coins' }, { label: 'Simule', icone: 'Calculator' },
  { label: 'Clientes', icone: 'Handshake' }, { label: 'Chaves', icone: 'Key' }, { label: 'Dúvidas', icone: 'ChatCircleDots' },
  { label: 'Contato', icone: 'Phone' }, { label: 'Onde estou', icone: 'MapPin' }, { label: 'Depoimentos', icone: 'Quotes' },
  { label: 'Dicas', icone: 'CalendarStar' }, { label: 'Veículos', icone: 'Car' }, { label: 'Obras', icone: 'HardHat' },
];

/** Bios prontas: {loja} vira o nome da loja. */
export const BIOS = [
  { titulo: 'Consultiva', texto: '🏡 {loja} | Parceiro The House\n💰 Financiamento e crédito com garantia\n📊 Comparo os maiores bancos para você\n👇 Simule grátis' },
  { titulo: 'Direta', texto: 'Crédito imobiliário sem complicação 🔑\nFinanciamento • Crédito com garantia • Construção\n{loja} — atendimento do início à chave' },
  { titulo: 'Com prova social', texto: '+ de 500 famílias com a casa própria 🏠\n{loja} • Especialista em crédito imobiliário\n📍 Atendimento em todo o Brasil\n👇 Fale comigo' },
];

/** Materiais institucionais para baixar. */
export const INSTITUCIONAIS = [
  { id: 'apresentacao', titulo: 'Apresentação The House', descricao: 'Quem somos, bancos parceiros e como funciona a jornada.', formato: 'PDF', detalhe: '12 páginas', icone: 'FilePdf' },
  { id: 'folder', titulo: 'Folder de produtos', descricao: 'Resumo de todos os produtos e condições para o cliente.', formato: 'PDF', detalhe: '4 páginas', icone: 'FileText' },
  { id: 'cartao', titulo: 'Cartão de visita digital', descricao: 'Cartão com seu nome, contato e o link da sua loja.', formato: 'PNG', detalhe: '1080 × 1080', icone: 'IdentificationCard' },
  { id: 'assinatura', titulo: 'Assinatura de e-mail', descricao: 'Assinatura pronta com a marca The House e seus dados.', formato: 'HTML', detalhe: 'Copiar e colar', icone: 'EnvelopeSimple' },
];

/** Cores sugeridas para personalizar as artes. */
export const CORES = ['#2b7de9', '#0f766e', '#7c3aed', '#e11d48', '#ea580c', '#0d1b2a'];
