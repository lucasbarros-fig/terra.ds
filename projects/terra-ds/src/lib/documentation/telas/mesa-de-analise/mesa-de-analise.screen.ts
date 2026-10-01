import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";

import { ButtonComponent } from "../../../components/actions/button/button.component";
import { AlertComponent } from "../../../components/feedback/alert/alert.component";
import { GoalProgressComponent } from "../../../components/feedback/goal-progress/goal-progress.component";
import type { GoalProgressStatus } from "../../../components/feedback/goal-progress/goal-progress.component";
import type { StatusColor } from "../../../components/feedback/status/status.component";
import { TagComponent } from "../../../components/feedback/tag/tag.component";
import { InputTextComponent } from "../../../components/inputs-&-controls/input-text/input-text.component";
import { BannerComponent } from "../../../components/layout-&-structure/banner/banner.component";
import type { BannerSlide } from "../../../components/layout-&-structure/banner/banner.component";
import { CardKanbanComponent } from "../../../components/layout-&-structure/card-kanban/card-kanban.component";
import type { CardKanbanType } from "../../../components/layout-&-structure/card-kanban/card-kanban.component";
import type { IconNameType } from "../../../components/layout-&-structure/icon/icon.component";
import { KpiCardComponent } from "../../../components/layout-&-structure/kpi-card/kpi-card.component";
import { SidebarComponent } from "../../../components/layout-&-structure/sidebar/sidebar.component";
import type { SidebarItem } from "../../../components/layout-&-structure/sidebar/sidebar.component";
import { TopComponent } from "../../../components/layout-&-structure/top/top.component";
import type { TopAction } from "../../../components/layout-&-structure/top/top.component";

type KpiFilter = "carteira" | "fila" | "sla" | "aprovadas";

interface Kpi {
	id: KpiFilter;
	label: string;
	value: number;
	icon: IconNameType;
	statusLabel: string;
	statusColor: StatusColor;
	note: string;
	/** Só os KPIs que filtram o pipeline são interativos. */
	filters: boolean;
}

interface Proposta {
	type: CardKanbanType;
	id: string;
	client: string;
	product: string;
	amount: string;
	statusLabel: string;
	statusColor: StatusColor;
	comments: number;
	time: string;
	mine: boolean;
}

interface Etapa {
	name: string;
	total: number;
	cards: Proposta[];
}

interface Meta {
	label: string;
	valueText: string;
	value: number;
	target: number;
	status: GoalProgressStatus;
	statusLabel: string;
	note: string;
	lowerIsBetter?: boolean;
}

/**
 * Tela de referência "Mesa de Análise" (Crédito Veicular), montada só com componentes do Terra DS.
 * Figma: Terra.ds — Dashboard Crédito Veicular (conceito) › v3 · sem rolagem.
 * Não faz parte da API pública da biblioteca — existe apenas para o Storybook.
 */
@Component({
	selector: "lib-screen-mesa-de-analise",
	standalone: true,
	imports: [
		AlertComponent,
		BannerComponent,
		ButtonComponent,
		CardKanbanComponent,
		GoalProgressComponent,
		InputTextComponent,
		KpiCardComponent,
		SidebarComponent,
		TagComponent,
		TopComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./mesa-de-analise.screen.html",
	styleUrls: ["./mesa-de-analise.screen.scss"],
	host: { "data-terra-ds": "" },
})
export class MesaDeAnaliseScreenComponent {
	protected readonly sidebarItems: SidebarItem[] = [
		{ id: "inicio", label: "Início", icon: "HouseLine" },
		{ id: "mesa", label: "Mesa de análise", icon: "kanban" },
		{ id: "propostas", label: "Propostas", icon: "files" },
		{ id: "clientes", label: "Clientes", icon: "users" },
		{ id: "instituicoes", label: "Instituições", icon: "bank" },
		{ id: "relatorios", label: "Relatórios", icon: "ChartBarHorizontal" },
		{ id: "configuracoes", label: "Configurações", icon: "gear" },
	];

	protected readonly topActions: TopAction[] = [
		{ id: "escola", icon: "GraduationCap", label: "Escola" },
		{ id: "loja", icon: "storefront", label: "Loja" },
		{ id: "notificacoes", icon: "BellSimple", label: "Notificações", badge: true },
		{ id: "configuracoes", icon: "GearSix", label: "Configurações" },
	];

	protected readonly bannerSlides: BannerSlide[] = [1, 2, 3, 4].map((n) => ({
		src: "/assets/banners/conkey-escola-consorcio.jpg",
		alt: `Conkey — Primeira escola de consórcio do Brasil (${n} de 4)`,
	}));

	protected readonly kpis: Kpi[] = [
		{ id: "carteira", label: "Minha carteira", value: 8, icon: "UserCircle", statusLabel: "8 de 10", statusColor: "neutral", note: "capacidade do turno", filters: true },
		{ id: "fila", label: "Fila da equipe", value: 15, icon: "HourglassMedium", statusLabel: "5 novas hoje", statusColor: "informative", note: "aguardando distribuição", filters: false },
		{ id: "sla", label: "SLA em risco", value: 3, icon: "WarningCircle", statusLabel: "Crítico", statusColor: "negative", note: "vencem em menos de 1 h", filters: true },
		{ id: "aprovadas", label: "Aprovadas hoje", value: 14, icon: "CheckCircle", statusLabel: "+4 em relação a ontem", statusColor: "positive", note: "R$ 612 mil liberados", filters: false },
	];

	protected readonly etapas: Etapa[] = [
		{ name: "Recebidas", total: 6, cards: [
			{ type: "PF", id: "#48231", client: "Carlos Eduardo Ramos", product: "Financiamento · Civic 2021", amount: "R$ 98.500,00", statusLabel: "Novo", statusColor: "informative", comments: 0, time: "12 min", mine: false },
			{ type: "PJ", id: "#48229", client: "Transportes Aurora Ltda.", product: "Frota · 3× Fiorino 2024", amount: "R$ 312.000,00", statusLabel: "Novo", statusColor: "informative", comments: 1, time: "25 min", mine: false },
		] },
		{ name: "Documentação", total: 5, cards: [
			{ type: "PF", id: "#48207", client: "Fernanda Prado Costa", product: "Refinanciamento · Onix 2020", amount: "R$ 41.200,00", statusLabel: "SLA em risco", statusColor: "negative", comments: 3, time: "4h 18 min", mine: true },
			{ type: "PF", id: "#48202", client: "Rafael Andrade Souza", product: "Financiamento · T-Cross 2023", amount: "R$ 124.900,00", statusLabel: "Pendente CNH", statusColor: "warning", comments: 2, time: "2h 05 min", mine: true },
		] },
		{ name: "Análise de crédito", total: 8, cards: [
			{ type: "PF", id: "#48213", client: "Marcos Vinícius Lima", product: "Financiamento · Corolla 2022", amount: "R$ 138.500,00", statusLabel: "SLA em risco", statusColor: "negative", comments: 4, time: "5h 42 min", mine: true },
			{ type: "PF", id: "#48210", client: "Camila Rocha Teixeira", product: "Financiamento · HB20 2024", amount: "R$ 76.300,00", statusLabel: "Em análise", statusColor: "neutral", comments: 1, time: "1h 10 min", mine: true },
		] },
		{ name: "Aguardando banco", total: 4, cards: [
			{ type: "PF", id: "#48199", client: "João Pedro Nascimento", product: "Financiamento · Compass 2023", amount: "R$ 162.000,00", statusLabel: "Enviado ao Itaú", statusColor: "informative", comments: 2, time: "6h 05 min", mine: true },
			{ type: "PJ", id: "#48188", client: "Ribeiro & Filhos Comércio", product: "Frota · 2× Strada 2024", amount: "R$ 189.800,00", statusLabel: "Pré-aprovado", statusColor: "positive", comments: 0, time: "1 dia", mine: false },
		] },
	];

	protected readonly metas: Meta[] = [
		{ label: "Propostas analisadas", valueText: "42 de 60", value: 70, target: 100, status: "warning", statusLabel: "Abaixo do ritmo", note: "no ritmo atual: 46 de 60 até dia 30" },
		{ label: "Qualidade da análise", valueText: "92% · meta 90%", value: 92, target: 90, status: "positive", statusLabel: "Atingida", note: "propostas sem retrabalho" },
		{ label: "SLA cumprido", valueText: "94% · meta 95%", value: 94, target: 95, status: "warning", statusLabel: "Abaixo da meta", note: "3 propostas em risco hoje" },
		{ label: "Tempo médio de análise", valueText: "38 min · limite 45 min", value: 84, target: 100, status: "positive", statusLabel: "Dentro do limite", note: "menor é melhor · 7 min de folga", lowerIsBetter: true },
	];

	protected readonly activeSidebar = signal<string | null>("mesa");
	protected readonly filter = signal<KpiFilter | null>(null);

	protected readonly visibleEtapas = computed(() => {
		const f = this.filter();
		if (!f) return this.etapas;
		const keep = (p: Proposta) => (f === "sla" ? p.statusColor === "negative" : p.mine);
		return this.etapas.map((e) => ({ ...e, cards: e.cards.filter(keep) }));
	});

	protected readonly filterLabel = computed(() => {
		const f = this.filter();
		return f ? this.kpis.find((k) => k.id === f)?.label ?? "" : "";
	});

	protected toggleFilter(kpi: Kpi): void {
		if (!kpi.filters) return;
		this.filter.update((current) => (current === kpi.id ? null : kpi.id));
	}

	protected hiddenCount(etapa: Etapa): number {
		return Math.max(0, etapa.total - etapa.cards.length);
	}
}
