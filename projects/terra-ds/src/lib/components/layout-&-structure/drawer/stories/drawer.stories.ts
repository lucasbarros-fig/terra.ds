import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from "@angular/core";
import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { ButtonComponent } from "../../../actions/button/button.component";
import { TERRA_DROPDOWN_IMPORTS } from "../../dropdown";
import { DrawerComponent } from "../drawer.component";
import type { DrawerPosition } from "../drawer.types";
import type { IconNameType } from "../../icon/icon.component";

@Component({
	selector: "lib-story-drawer",
	standalone: true,
	imports: [CommonModule, DrawerComponent, ButtonComponent],
	template: `
		<div style="min-height: 360px; position: relative; padding: 8px 0;">
			<div style="margin-bottom: 16px;">
				<lib-button
					label="Abrir Drawer"
					intent="branding"
					[showIcon]="false"
					(clicked)="handleOpen()"
				></lib-button>
			</div>

			<lib-drawer
				[position]="position"
				[open]="open"
				[showBackdrop]="showBackdrop"
				[closeOnBackdropClick]="closeOnBackdropClick"
				[title]="title"
				[description]="description"
				[prefix]="prefix"
				[suffix]="suffix"
				[showCloseButton]="showCloseButton"
				[showFooter]="showFooter"
				[showPrimaryAction]="showPrimaryAction"
				[primaryActionLabel]="primaryActionLabel"
				[primaryActionIcon]="primaryActionIcon"
				[primaryActionLoading]="primaryActionLoading"
				[showSecondaryAction]="showSecondaryAction"
				[secondaryActionLabel]="secondaryActionLabel"
				[secondaryActionIcon]="secondaryActionIcon"
				[secondaryActionLoading]="secondaryActionLoading"
				[showOptionalAction]="showOptionalAction"
				[optionalActionLabel]="optionalActionLabel"
				[optionalActionIcon]="optionalActionIcon"
				[optionalActionLoading]="optionalActionLoading"
				ariaLabel="Drawer de exemplo"
				(backdropClick)="open = false"
				(closeClick)="open = false"
				(primaryActionClick)="open = false"
				(secondaryActionClick)="open = false"
				(optionalActionClick)="open = false"
			>
				<p style="margin: 0 0 12px;">
					Conteúdo do Drawer.
				</p>
				<p style="margin: 0;">
					Use o botão <strong>Abrir Drawer</strong> para exibir o painel.
					Alterne <strong>position</strong> entre <code>right</code>
					(entrada lateral) e <code>center</code> (entrada por baixo).
				</p>
			</lib-drawer>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class LibDrawerStoryHostComponent {
	@Input() position: DrawerPosition = "right";
	@Input() title = "Título do Drawer";
	@Input() description = "";
	@Input() prefix = "";
	@Input() suffix = "";
	@Input() showBackdrop = true;
	@Input() closeOnBackdropClick = true;
	@Input() showCloseButton = true;
	@Input() showFooter = true;
	@Input() showPrimaryAction = true;
	@Input() primaryActionLabel = "Confirmar";
	@Input() primaryActionIcon?: IconNameType;
	@Input() primaryActionLoading = false;
	@Input() showSecondaryAction = true;
	@Input() secondaryActionLabel = "Cancelar";
	@Input() secondaryActionIcon?: IconNameType;
	@Input() secondaryActionLoading = false;
	@Input() showOptionalAction = false;
	@Input() optionalActionLabel = "Ação";
	@Input() optionalActionIcon?: IconNameType;
	@Input() optionalActionLoading = false;

	handleOpen(): void {
		this.open = true;
		// drawer debug: open state tracked via Storybook controls
	}

	open = false;
}

const drawerDocsDescription =
	"Apresenta conteúdo complementar de forma temporária e contextual, deslizando sobre a interface principal sem interromper completamente o fluxo do usuário. Permite exibir informações, formulários ou ações relacionadas à tarefa atual, mantendo o contexto da tela de origem. Utilize o Drawer para interações secundárias que não exigem mudança de página ou bloqueio total da interface.";

@Component({
	selector: "lib-story-drawer-custom-footer",
	standalone: true,
	imports: [CommonModule, DrawerComponent, ButtonComponent, ...TERRA_DROPDOWN_IMPORTS],
	template: `
		<div style="min-height: 360px; position: relative; padding: 8px 0;">
			<div style="margin-bottom: 16px;">
				<lib-button
					label="Abrir Drawer"
					intent="branding"
					[showIcon]="false"
					(clicked)="open = true"
				></lib-button>
			</div>

			<lib-drawer
				title="Comparativo de Parceiros"
				description="Confira os dados antes de compartilhar."
				[open]="open"
				[showFooter]="true"
				[showCustomFooter]="true"
				[showPrimaryAction]="false"
				[showSecondaryAction]="false"
				ariaLabel="Drawer com footer customizado"
				(backdropClick)="open = false"
				(closeClick)="open = false"
			>
				<p style="margin: 0 0 12px;">
					Conteúdo principal do drawer.
				</p>
				<p style="margin: 0;">
					O rodapé abaixo utiliza o slot <code>libDrawerFooter</code>
					para renderizar um dropdown de compartilhamento no lugar dos
					botões padrão.
				</p>

				<div libDrawerFooter style="display: flex; justify-content: flex-end; width: 100%;">
					<lib-dropdown [closeOnItemClick]="true" placement="top-end">
						<lib-button
							libDropdownTrigger
							nativeType="button"
							label="Compartilhar"
							intent="neutral"
							variant="filled"
						></lib-button>
						<lib-dropdown-item
							label="WhatsApp"
							(select)="onShare('WhatsApp')"
						></lib-dropdown-item>
						<lib-dropdown-item
							label="E-mail"
							(select)="onShare('E-mail')"
						></lib-dropdown-item>
						<lib-dropdown-item
							label="Baixar PDF"
							(select)="onShare('PDF')"
						></lib-dropdown-item>
					</lib-dropdown>
				</div>
			</lib-drawer>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class LibDrawerCustomFooterStoryHostComponent {
	open = true;

	onShare(_channel: string): void {
		// share channel tracked via Storybook actions
	}
}

const meta: Meta<LibDrawerStoryHostComponent> = {
	title: "Terra-DS/Layout & Structure/Drawer",
	component: LibDrawerStoryHostComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component: drawerDocsDescription,
			},
		},
	},
	render: (args) => ({
		props: args,
		moduleMetadata: {
			imports: [LibDrawerStoryHostComponent],
		},
		template: `<lib-story-drawer
			[position]="position"
			[title]="title"
			[description]="description"
			[prefix]="prefix"
			[suffix]="suffix"
			[showBackdrop]="showBackdrop"
			[closeOnBackdropClick]="closeOnBackdropClick"
			[showCloseButton]="showCloseButton"
			[showFooter]="showFooter"
			[showPrimaryAction]="showPrimaryAction"
			[primaryActionLabel]="primaryActionLabel"
			[primaryActionIcon]="primaryActionIcon"
			[primaryActionLoading]="primaryActionLoading"
			[showSecondaryAction]="showSecondaryAction"
			[secondaryActionLabel]="secondaryActionLabel"
			[secondaryActionIcon]="secondaryActionIcon"
			[secondaryActionLoading]="secondaryActionLoading"
			[showOptionalAction]="showOptionalAction"
			[optionalActionLabel]="optionalActionLabel"
			[optionalActionIcon]="optionalActionIcon"
			[optionalActionLoading]="optionalActionLoading"
		></lib-story-drawer>`,
	}),
	args: {
		position: "right",
		title: "Título do Drawer",
		description: "",
		prefix: "",
		suffix: "",
		showBackdrop: true,
		closeOnBackdropClick: true,
		showCloseButton: true,
		showFooter: true,
		showPrimaryAction: true,
		primaryActionLabel: "Confirmar",
		primaryActionLoading: false,
		showSecondaryAction: true,
		secondaryActionLabel: "Cancelar",
		secondaryActionLoading: false,
		showOptionalAction: false,
		optionalActionLabel: "Ação",
		optionalActionLoading: false,
	},
	argTypes: {
		position: {
			control: "radio",
			options: ["right", "center"] satisfies DrawerPosition[],
		},
		primaryActionLoading: {
			control: "boolean",
			description:
				"Exibe o spinner na ação primária e bloqueia o clique enquanto a ação assíncrona é executada.",
		},
		secondaryActionLoading: {
			control: "boolean",
			description:
				"Exibe o spinner na ação secundária e bloqueia o clique enquanto a ação assíncrona é executada.",
		},
		optionalActionLoading: {
			control: "boolean",
			description:
				"Exibe o spinner na ação opcional e bloqueia o clique enquanto a ação assíncrona é executada.",
		},
	},
};

export default meta;
type Story = StoryObj<LibDrawerStoryHostComponent>;

export const Default: Story = {
	name: "Default",
	args: {
		title: "Detalhes do pedido",
		description: "Confira os itens antes de confirmar.",
	},
};

export const RightFullHeight: Story = {
	name: "Right — full height",
	args: {
		position: "right",
		title: "Editar perfil",
		description: "Atualize suas informações pessoais e clique em confirmar.",
	},
};

export const CenterModal: Story = {
	name: "Center — modal",
	args: {
		position: "center",
		title: "Confirmar exclusão",
		description: "Esta ação não poderá ser desfeita.",
		primaryActionLabel: "Excluir",
		secondaryActionLabel: "Cancelar",
	},
};

export const TitleOnly: Story = {
	name: "Title only",
	args: {
		title: "Apenas título",
		showFooter: false,
	},
};

export const NoFooter: Story = {
	name: "Without footer",
	args: {
		title: "Drawer sem rodapé",
		description: "Use somente para conteúdo informativo.",
		showFooter: false,
	},
};

export const PrimaryActionOnly: Story = {
	name: "Primary action only",
	args: {
		title: "Somente ação primária",
		showSecondaryAction: false,
		primaryActionLabel: "Entendi",
	},
};

export const SecondaryActionOnly: Story = {
	name: "Secondary action only",
	args: {
		title: "Somente ação secundária",
		showPrimaryAction: false,
		secondaryActionLabel: "Fechar",
	},
};

export const WithOptionalAction: Story = {
	name: "With optional action",
	args: {
		title: "Três ações no rodapé",
		description: "A ação opcional fica alinhada à esquerda.",
		showOptionalAction: true,
		optionalActionLabel: "Saiba mais",
	},
};

export const WithPrefixSuffix: Story = {
	name: "With prefix and suffix",
	args: {
		title: "Notificações",
		description: "Você possui novas mensagens.",
		prefix: "#",
		suffix: "#",
	},
};

export const ActionsWithIcons: Story = {
	name: "Actions with icons",
	args: {
		title: "Salvar alterações?",
		description: "As alterações ainda não foram persistidas.",
		primaryActionIcon: "CheckCircle",
		secondaryActionIcon: "X",
	},
};

export const PrimaryActionLoading: Story = {
	name: "Primary action — loading",
	args: {
		title: "Salvando alterações",
		description:
			"A ação primária exibe o spinner e fica bloqueada enquanto a requisição é processada.",
		primaryActionLoading: true,
	},
};

export const SecondaryActionLoading: Story = {
	name: "Secondary action — loading",
	args: {
		title: "Cancelando operação",
		description:
			"A ação secundária exibe o spinner e fica bloqueada enquanto a requisição é processada.",
		secondaryActionLoading: true,
	},
};

export const OptionalActionLoading: Story = {
	name: "Optional action — loading",
	args: {
		title: "Três ações no rodapé",
		description: "A ação opcional exibe o spinner enquanto é processada.",
		showOptionalAction: true,
		optionalActionLabel: "Saiba mais",
		optionalActionLoading: true,
	},
};

export const CustomWidth: Story = {
	name: "Custom width (--drawer-width)",
	parameters: {
		docs: {
			description: {
				story: `
A largura padrão do drawer é \`min(420px, 100%)\`. Para casos que exigem um painel
mais largo, defina a CSS custom property \`--drawer-width\` diretamente no elemento
— sem necessidade de \`ng-deep\`:

\`\`\`scss
// component.scss
lib-drawer {
  --drawer-width: min(650px, 100%);
}
\`\`\`

\`\`\`html
<!-- ou via binding inline -->
<lib-drawer [style.--drawer-width]="'min(650px, 100%)'" ...>
\`\`\`
				`,
			},
		},
	},
	render: (args) => ({
		props: args,
		moduleMetadata: { imports: [LibDrawerStoryHostComponent] },
		template: `<story-lib-drawer
			[position]="position"
			[title]="title"
			[description]="description"
			style="--drawer-width: min(650px, 100%)"
		></story-lib-drawer>`,
	}),
	args: {
		position: "right",
		title: "Drawer com largura customizada",
		description: "Este painel usa --drawer-width: min(650px, 100%).",
	},
};

export const CustomFooter: Story = {
	name: "Custom footer (dropdown)",
	parameters: {
		docs: {
			source: {
				code: `<lib-drawer
  [showFooter]="true"
  [showCustomFooter]="true"
  [showPrimaryAction]="false"
  [showSecondaryAction]="false"
>
  <p>Conteúdo...</p>

  <div libDrawerFooter>
    <lib-dropdown placement="top-end">
      <lib-button libDropdownTrigger label="Compartilhar"></lib-button>
      <lib-dropdown-item label="WhatsApp" (select)="onShare('WhatsApp')"></lib-dropdown-item>
      <lib-dropdown-item label="E-mail" (select)="onShare('E-mail')"></lib-dropdown-item>
      <lib-dropdown-item label="Baixar PDF" (select)="onShare('PDF')"></lib-dropdown-item>
    </lib-dropdown>
  </div>
</lib-drawer>`,
			},
			description: {
				story: `
Utilize \`[showCustomFooter]="true"\` junto com o atributo \`libDrawerFooter\`
no elemento que deseja projetar no rodapé. Os botões padrão são substituídos
pelo conteúdo projetado. Os demais inputs do drawer continuam funcionando normalmente.

\`\`\`html
<lib-drawer
  [showFooter]="true"
  [showCustomFooter]="true"
  [showPrimaryAction]="false"
  [showSecondaryAction]="false"
>
  <!-- corpo -->
  <p>Conteúdo...</p>

  <!-- footer customizado -->
  <div libDrawerFooter>
    <lib-dropdown placement="top-end">
      <lib-button libDropdownTrigger label="Compartilhar"></lib-button>
      <lib-dropdown-item label="WhatsApp" (select)="..."></lib-dropdown-item>
      <lib-dropdown-item label="E-mail" (select)="..."></lib-dropdown-item>
    </lib-dropdown>
  </div>
</lib-drawer>
\`\`\`
				`,
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [LibDrawerCustomFooterStoryHostComponent],
		}),
	],
	render: () => ({
		template: `<story-lib-drawer-custom-footer></story-lib-drawer-custom-footer>`,
	}),
};
