import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IconButtonComponent } from "../../../actions/icon-button/icon-button.component";
import { InputQuantityComponent } from "../../../inputs-&-controls/input-quantity/input-quantity.component";
import { ListComponent } from "../list.component";
import { ListHeaderComponent } from "../list-header/list-header.component";
import { ListHeaderItemComponent } from "../list-header-item/list-header-item.component";
import { ListBodyComponent } from "../list-body/list-body.component";
import { ListBodyRowComponent } from "../list-body-row/list-body-row.component";
import { ListBodyCellComponent } from "../list-body-cell/list-body-cell.component";
import { ListPaginationComponent } from "../list-pagination/list-pagination.component";

const listImports = [
	CommonModule,
	FormsModule,
	ListComponent,
	ListHeaderComponent,
	ListHeaderItemComponent,
	ListBodyComponent,
	ListBodyRowComponent,
	ListBodyCellComponent,
	IconButtonComponent,
	InputQuantityComponent,
	ListPaginationComponent,
];

interface ListStoryArgs {
	striped: boolean;
	hoverable: boolean;
	emptyMessage?: string;
}

const listDocsDescription =
	'Organiza informações em uma sequência estruturada de itens, facilitando a leitura, comparação e navegação de dados relacionados. Pode acomodar diferentes tipos de conteúdo, como textos, ícones, ações e metadados, adaptando-se a diversos contextos da interface.';

const meta: Meta<ListStoryArgs> = {
	title: "Terra-DS/Layout & Structure/List",
	component: ListComponent,
	tags: ["autodocs"],
	decorators: [
		moduleMetadata({
			imports: listImports,
		}),
	],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: listDocsDescription,
			},
		},
	},
	argTypes: {
		striped: { control: "boolean" },
		hoverable: { control: "boolean" },
		emptyMessage: { control: "text" },
	},
};

export default meta;
type Story = StoryObj<ListStoryArgs>;

const mockUsers = [
	{ id: 1, name: "Ana Souza", email: "ana@email.com", role: "Admin", status: "Ativo" },
	{ id: 2, name: "Bruno Lima", email: "bruno@email.com", role: "Editor", status: "Inativo" },
	{ id: 3, name: "Carla Dias", email: "carla@email.com", role: "Viewer", status: "Ativo" },
	{ id: 4, name: "Diego Alves", email: "diego@email.com", role: "Editor", status: "Ativo" },
	{ id: 5, name: "Elisa Castro", email: "elisa@email.com", role: "Admin", status: "Inativo" },
];

const mockUsersWithQuantity = mockUsers.map((row) => ({ ...row, quantity: 0 }));

const firstNames = [
	"Ana", "Bruno", "Carla", "Diego", "Elisa",
	"Felipe", "Gabriela", "Henrique", "Isabel", "João",
	"Karina", "Lucas", "Marina", "Nuno", "Olivia",
	"Pedro", "Queila", "Rafael", "Sofia", "Tiago",
];
const lastNames = [
	"Souza", "Lima", "Dias", "Alves", "Castro",
	"Pereira", "Rocha", "Mendes", "Cardoso", "Pinto",
];
const roles = ["Admin", "Editor", "Viewer"];
const statuses: Array<"Ativo" | "Inativo"> = ["Ativo", "Inativo"];

type PaginationStoryRow = ReturnType<typeof generateUsers>[number];

interface PaginationStoryContext {
	allData: PaginationStoryRow[];
	page: number;
	pageSize: number;
}

function generateUsers(count: number) {
	return Array.from({ length: count }, (_, i) => {
		const first = firstNames[i % firstNames.length];
		const last = lastNames[(i * 3) % lastNames.length];
		return {
			id: i + 1,
			name: `${first} ${last}`,
			email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@email.com`,
			role: roles[i % roles.length],
			status: statuses[i % statuses.length],
		};
	});
}

function getVisibleRows(this: PaginationStoryContext) {
	const start = (this.page - 1) * this.pageSize;
	return this.allData.slice(start, start + this.pageSize);
}

export const Default: Story = {
	args: {
		striped: true,
		hoverable: true,
	},
	render: (args) => ({
		props: { ...args, data: mockUsers },
		template: `
      <div style="max-width:900px;margin:0 auto; padding-bottom: 100px;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item width="60px">ID</lib-list-header-item>
            <lib-list-header-item>Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
            <lib-list-header-item>Perfil</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngFor="let row of data" tabindex="0">
              <lib-list-body-cell>{{ row.id }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.role }}</lib-list-body-cell>
              <lib-list-body-cell align="center">{{ row.status }}</lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>
      </div>
    `,
	}),
};

export const ComTemplateCustomizado: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: { ...args, data: mockUsers },
		template: `
      <div style="max-width:900px;margin:0 auto;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item>Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngFor="let row of data" tabindex="0">
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>
                <a [href]="'mailto:' + row.email" style="color:#2563eb;">{{ row.email }}</a>
              </lib-list-body-cell>
              <lib-list-body-cell align="center">
                <span
                  [style.background]="row.status === 'Ativo' ? '#dcfce7' : '#fee2e2'"
                  [style.color]="row.status === 'Ativo' ? '#166534' : '#991b1b'"
                  style="padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;"
                >
                  {{ row.status }}
                </span>
              </lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>
      </div>
    `,
	}),
};

export const Vazia: Story = {
	args: {
		striped: true,
		hoverable: true,
		emptyMessage: "Nenhum utilizador registado.",
	},
	render: (args) => ({
		props: { ...args, data: [] as typeof mockUsers },
		template: `
      <div style="max-width:640px;margin:0 auto;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item>Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngIf="data.length === 0" tabindex="0">
              <lib-list-body-cell [colspan]="2">
                <div class="list-empty">{{ emptyMessage }}</div>
              </lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>
      </div>
    `,
	}),
};

export const ColunasProporcionais: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: { ...args, data: mockUsers },
		template: `
      <div style="max-width:900px;margin:0 auto;padding-bottom:100px;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item [weight]="1">ID</lib-list-header-item>
            <lib-list-header-item [weight]="3">Nome</lib-list-header-item>
            <lib-list-header-item [weight]="2">E-mail</lib-list-header-item>
            <lib-list-header-item>Perfil</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngFor="let row of data" tabindex="0">
              <lib-list-body-cell>{{ row.id }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.role }}</lib-list-body-cell>
              <lib-list-body-cell align="center">{{ row.status }}</lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>
      </div>
    `,
	}),
};

export const HeaderComIcons: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: { ...args, data: mockUsers },
		template: `
      <div style="max-width:900px;margin:0 auto;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item width="60px">ID</lib-list-header-item>
            <lib-list-header-item icon="Info" iconPosition="after">Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngFor="let row of data" tabindex="0">
              <lib-list-body-cell>{{ row.id }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell align="center">{{ row.status }}</lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>
      </div>
    `,
	}),
};

export const LinhasSelecionadas: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: { ...args, data: mockUsers },
		template: `
      <div style="max-width:900px;margin:0 auto;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item width="60px">ID</lib-list-header-item>
            <lib-list-header-item>Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row
              *ngFor="let row of data; let i = index"
              tabindex="0"
              [selected]="i % 2 === 0"
            >
              <lib-list-body-cell>{{ row.id }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell align="center">{{ row.status }}</lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>
      </div>
    `,
	}),
};

export const AcoesHeaderQuantidade: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: {
			...args,
			data: mockUsersWithQuantity.map((r) => ({ ...r })),
			actionsMenuOpen: false,
		},
		template: `
      <div style="max-width:960px;margin:0 auto;padding-bottom:120px;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item width="140px">Cotas</lib-list-header-item>
            <lib-list-header-item>Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
            <lib-list-header-item width="72px" align="center">
              <div style="position:relative;display:inline-flex;justify-content:center;width:100%;">
                <lib-icon-button
                  icon="Sliders"
                  ariaLabel="Ações e filtros"
                  type="neutral"
                  variant="ghost"
                  size="small"
                  (clicked)="actionsMenuOpen = !actionsMenuOpen"
                ></lib-icon-button>
                <div
                  *ngIf="actionsMenuOpen"
                  role="menu"
                  style="position:absolute;top:calc(100% + 6px);right:0;z-index:30;min-width:200px;padding:var(--size-spacing-8);background:var(--color-theme-upper);border:1px solid var(--color-stroke-list);border-radius:var(--size-radius-8);box-shadow:0 8px 24px rgba(0,0,0,0.12);"
                >
                  <button
                    type="button"
                    style="display:block;width:100%;text-align:left;padding:var(--size-spacing-8) var(--size-spacing-12);border:none;background:transparent;cursor:pointer;border-radius:var(--size-radius-8);font:inherit;color:var(--color-text-essential-heading);"
                    (click)="actionsMenuOpen = false"
                  >Filtrar por status</button>
                  <button
                    type="button"
                    style="display:block;width:100%;text-align:left;padding:var(--size-spacing-8) var(--size-spacing-12);border:none;background:transparent;cursor:pointer;border-radius:var(--size-radius-8);font:inherit;color:var(--color-text-essential-heading);"
                    (click)="actionsMenuOpen = false"
                  >Exportar lista</button>
                </div>
              </div>
            </lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row
              *ngFor="let row of data"
              tabindex="0"
              [selected]="row.quantity >= 1"
            >
              <lib-list-body-cell>
                <lib-input-quantity
                  [(ngModel)]="row.quantity"
                  [min]="0"
                  placeholder="0"
                ></lib-input-quantity>
              </lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell align="center">{{ row.status }}</lib-list-body-cell>
              <lib-list-body-cell></lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>
      </div>
    `,
	}),
};

export const ComPaginacao: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: {
			...args,
			allData: generateUsers(100),
			pageSize: 10,
			page: 1,
			getVisibleRows,
		},
		template: `
      <div style="max-width:900px;margin:0 auto;padding-bottom:120px;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item width="60px">ID</lib-list-header-item>
            <lib-list-header-item>Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngFor="let row of getVisibleRows()" tabindex="0">
              <lib-list-body-cell>{{ row.id }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell align="center">{{ row.status }}</lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>

        <lib-list-pagination
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          [total]="allData.length"
          [page]="page"
          (pageSizeChange)="pageSize = $event"
          (pageChange)="page = $event"
        ></lib-list-pagination>
      </div>
    `,
	}),
};

export const ComPaginacaoDezDeDez: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: {
			...args,
			allData: generateUsers(10),
			pageSize: 10,
			page: 1,
			getVisibleRows,
		},
		template: `
      <div style="max-width:900px;margin:0 auto;padding-bottom:120px;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item width="60px">ID</lib-list-header-item>
            <lib-list-header-item>Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngFor="let row of getVisibleRows()" tabindex="0">
              <lib-list-body-cell>{{ row.id }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell align="center">{{ row.status }}</lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>

        <lib-list-pagination
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          [total]="allData.length"
          [page]="page"
          (pageSizeChange)="pageSize = $event"
          (pageChange)="page = $event"
        ></lib-list-pagination>
      </div>
    `,
	}),
};

export const ComPaginacaoDezDeVinte: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: {
			...args,
			allData: generateUsers(20),
			pageSize: 10,
			page: 1,
			getVisibleRows,
		},
		template: `
      <div style="max-width:900px;margin:0 auto;padding-bottom:120px;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item width="60px">ID</lib-list-header-item>
            <lib-list-header-item>Nome</lib-list-header-item>
            <lib-list-header-item>E-mail</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngFor="let row of getVisibleRows()" tabindex="0">
              <lib-list-body-cell>{{ row.id }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell align="center">{{ row.status }}</lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>

        <lib-list-pagination
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          [total]="allData.length"
          [page]="page"
          (pageSizeChange)="pageSize = $event"
          (pageChange)="page = $event"
        ></lib-list-pagination>
      </div>
    `,
	}),
};

export const HeaderEbodyComIconsETooltip: Story = {
	args: { striped: true, hoverable: true },
	render: (args) => ({
		props: { ...args, data: mockUsers },
		template: `
      <div style="max-width:900px;margin:0 auto;padding-bottom:120px;">
        <lib-list [striped]="striped" [hoverable]="hoverable">
          <lib-list-header>
            <lib-list-header-item width="60px">ID</lib-list-header-item>
            <lib-list-header-item
              iconPosition="before"
              icon="Info"
              tooltip="Nome completo do cliente"
            >Nome</lib-list-header-item>
            <lib-list-header-item
              icon="Info"
              tooltip="Endereço de contacto"
            >E-mail</lib-list-header-item>
            <lib-list-header-item align="center">Status</lib-list-header-item>
          </lib-list-header>
          <lib-list-body>
            <lib-list-body-row *ngFor="let row of data" tabindex="0">
              <lib-list-body-cell>{{ row.id }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.name }}</lib-list-body-cell>
              <lib-list-body-cell>{{ row.email }}</lib-list-body-cell>
              <lib-list-body-cell
                align="center"
                [icon]="row.status === 'Ativo' ? 'CheckCircle' : 'XCircle'"
                [iconColor]="row.status === 'Ativo' ? 'var(--color-state-system-positive)' : 'var(--color-state-system-negative)'"
                [tooltip]="row.status === 'Ativo' ? 'Cliente confirmou' : 'Cliente recusou'"
              >{{ row.status }}</lib-list-body-cell>
            </lib-list-body-row>
          </lib-list-body>
        </lib-list>
      </div>
    `,
	}),
};
