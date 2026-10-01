import type { Meta, StoryObj } from "@storybook/angular";

import { BannerComponent, type BannerSlide } from "../banner.component";

const IMG = "assets/banners/banner-exemplo.jpg";

const SLIDES: BannerSlide[] = [
	{ src: IMG, alt: "The House — banner de exemplo" },
	{ src: IMG, alt: "Campanha 2: banner de exemplo" },
	{ src: IMG, alt: "Campanha 3: banner de exemplo" },
	{ src: IMG, alt: "Campanha 4: novidades da plataforma" },
];

const meta: Meta<BannerComponent> = {
	title: "Terra-DS/Layout & Structure/Banner",
	component: BannerComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: `
### \`lib-banner\`

Carrossel de banners com imagem para comunicação institucional e campanhas no topo de dashboards e páginas iniciais, alinhado ao Figma (**Banner**).

- **Slides**: \`slides\` — lista de \`{ src, alt, href? }\`. Com \`href\`, o slide inteiro vira link. A imagem usa \`object-fit: cover\`: prefira imagens com a mensagem principal centralizada (as setas sobrepõem as laterais).
- **Tamanho**: \`height\` (padrão 400px) e largura fluida (100%). O indicador ultrapassa a borda inferior em 10px; o componente reserva 16px abaixo da imagem quando a paginação está visível.
- **Setas**: \`showArrows\` — \`lib-icon-button\` Neutral Filled (ArrowLeft/ArrowRight) com \`aria-label\` "Banner anterior" / "Próximo banner".
- **Paginação**: \`showPagination\` — pontos clicáveis ("Ir para o banner N", \`aria-current\` no ativo).
- **Índice ativo**: \`[(activeIndex)]\` (model). A navegação é circular.
- **Autoplay**: \`autoplay\` + \`interval\` (ms). Pausa em hover e foco e é desativado com \`prefers-reduced-motion\`.
- **Teclado**: com o banner focado (Tab), ← / → trocam o slide; Home / End vão ao primeiro / último.
- **Acessibilidade**: \`role="region"\` + \`aria-roledescription="carrossel"\` + \`ariaLabel\`; cada slide é \`role="group"\` com \`aria-roledescription="slide"\` e \`aria-label="1 de 4"\`. Slides ocultos ficam \`inert\`.
- Com **um slide só**, setas e paginação são ocultadas automaticamente.
        `.trim(),
			},
		},
	},
	argTypes: {
		interval: { control: { type: "number", min: 1000, step: 500 } },
		height: { control: { type: "number", min: 120, step: 20 } },
	},
	args: {
		slides: SLIDES,
		showArrows: true,
		showPagination: true,
		autoplay: false,
		interval: 6000,
		height: 400,
		ariaLabel: "Banners",
		activeIndex: 0,
	},
	render: (args) => ({
		props: args,
		template: `
			<div style="padding: 0 12px;">
				<lib-banner
					[slides]="slides"
					[showArrows]="showArrows"
					[showPagination]="showPagination"
					[autoplay]="autoplay"
					[interval]="interval"
					[height]="height"
					[ariaLabel]="ariaLabel"
					[(activeIndex)]="activeIndex"
				></lib-banner>
			</div>
		`,
	}),
};

export default meta;
type Story = StoryObj<BannerComponent>;

export const Default: Story = {
	name: "Default",
};

export const SemSetas: Story = {
	name: "Sem setas",
	args: { showArrows: false },
};

export const SemPaginacao: Story = {
	name: "Sem paginação",
	args: { showPagination: false },
};

export const Autoplay: Story = {
	name: "Autoplay",
	args: { autoplay: true, interval: 4000 },
	parameters: {
		docs: {
			description: {
				story: "Troca a cada 4s. Pausa com o mouse sobre o banner ou com o foco dentro dele; não roda com `prefers-reduced-motion: reduce`.",
			},
		},
	},
};

export const UmSlide: Story = {
	name: "Um slide só",
	args: { slides: SLIDES.slice(0, 1) },
	parameters: {
		docs: {
			description: {
				story: "Com `slides.length <= 1`, setas e paginação são ocultadas automaticamente.",
			},
		},
	},
};
