import { CommonModule } from "@angular/common";
import type { Meta, StoryObj } from "@storybook/angular";
import { UploaderComponent } from "../uploader.component";

const uploaderDocsDescription =
	"Permite selecionar e enviar arquivos de forma simples, segura e orientada, oferecendo feedback durante todo o processo de upload. Pode suportar ações como arrastar e soltar arquivos (drag and drop), seleção pelo explorador de arquivos, visualização do progresso e tratamento de erros. Aplique o Uploader para facilitar o envio de documentos, imagens e outros arquivos, proporcionando uma experiência clara, confiável e eficiente.";

const meta: Meta<UploaderComponent> = {
	title: "Terra-DS/Inputs & Controls/Uploader",
	component: UploaderComponent,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: uploaderDocsDescription,
			},
		},
	},
	render: (args) => ({
		props: {
			...args,
		},
		template: `
      <div style="width: 364px;">
        <lib-uploader
          [label]="label"
          [acceptedTypes]="acceptedTypes"
          [maxSize]="maxSize"
          [showAdditionalLabel]="showAdditionalLabel"
          [additionalLabel]="additionalLabel"
          [icon]="icon"
          [disabled]="disabled"
          [error]="error"
          [helperText]="helperText"
          [maxSizeBytes]="maxSizeBytes"
          [allowedTypes]="allowedTypes"
          [multiple]="multiple"
          (filesSelected)="filesSelected($event)"
        ></lib-uploader>
      </div>
    `,
	}),
	args: {
		label: "Arraste ou selecione um arquivo",
		acceptedTypes: "JPG, JPEG ou PNG",
		maxSize: "10 MB",
		showAdditionalLabel: false,
		additionalLabel: "000x000",
		icon: "TrayArrowUp",
		disabled: false,
		error: false,
		helperText: "Helper",
		maxSizeBytes: 10 * 1024 * 1024,
		allowedTypes: [],
		multiple: false,
	},
	argTypes: {
		label: {
			control: "text",
			description: "Título principal exibido na área de upload.",
		},
		acceptedTypes: {
			control: "text",
			description: "Texto informando os formatos de arquivo aceitos.",
		},
		maxSize: {
			control: "text",
			description:
				'Texto do tamanho máximo permitido (exibido como "• até {{maxSize}}"). Vazio = não exibir.',
		},
		showAdditionalLabel: {
			control: "boolean",
			description:
				"Exibe um rótulo adicional (ex.: dimensões de imagem) entre o tipo de arquivo e o tamanho máximo.",
		},
		additionalLabel: {
			control: "text",
			description: "Texto do rótulo adicional, exibido quando `showAdditionalLabel` é verdadeiro.",
		},
		icon: {
			control: "text",
			description: "Ícone exibido acima do rótulo (`IconNameType`).",
		},
		disabled: {
			control: "boolean",
			description: "Desativa a seleção de arquivos e aplica o estilo visual desabilitado.",
		},
		error: {
			control: "boolean",
			description: "Estado de erro visual + exibição do `lib-helper` com `helperText`.",
		},
		helperText: {
			control: "text",
			description: "Texto do `lib-helper` exibido abaixo da área de upload quando `error` é verdadeiro.",
		},
		maxSizeBytes: {
			control: "number",
			description:
				"Tamanho máximo permitido por arquivo, em bytes, usado na validação real da seleção (mantenha alinhado ao texto de `maxSize`).",
		},
		allowedTypes: {
			control: "object",
			description:
				'Lista de tipos aceitos, usada na validação real da seleção e para preencher o atributo nativo `accept` do `<input type="file">`. Aceita extensões (ex.: ".pdf") e/ou MIME types (ex.: "application/pdf", "image/*"). Array vazio = nenhuma restrição.',
		},
		multiple: {
			control: "boolean",
			description: "Permite selecionar mais de um arquivo pelo explorador de arquivos.",
		},
		filesSelected: { action: "filesSelected" },
	},
};

export default meta;
type Story = StoryObj<UploaderComponent>;

export const Default: Story = {
	name: "Padrão",
	parameters: {
		docs: {
			description: {
				story: "Estado base da área de upload. Passe o mouse para ver o estado de hover.",
			},
		},
	},
};

export const ComRotuloAdicional: Story = {
	name: "Com rótulo adicional",
	args: {
		showAdditionalLabel: true,
		additionalLabel: "1080x1080",
	},
	parameters: {
		docs: {
			description: {
				story:
					'Com `showAdditionalLabel`, um rótulo extra (ex.: dimensões recomendadas) é exibido entre o tipo de arquivo e o tamanho máximo: "Tipo • Rótulo adicional • até Tamanho".',
			},
		},
	},
};

export const Erro: Story = {
	name: "Erro",
	args: {
		error: true,
		helperText: "Arquivo excede o tamanho máximo permitido.",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Com `error`, a borda muda para o tom `negative` e o `lib-helper` exibe `helperText` abaixo da área de upload.",
			},
		},
	},
};

export const Desabilitado: Story = {
	name: "Desabilitado",
	args: {
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Com `disabled`, a área de upload não responde a cliques, hover ou teclado.",
			},
		},
	},
};

export const ValidacaoDeTamanho: Story = {
	name: "Validação de tamanho",
	args: {
		maxSize: "500 KB",
		maxSizeBytes: 500 * 1024,
	},
	parameters: {
		docs: {
			description: {
				story:
					"O `Uploader` valida o tamanho real dos arquivos selecionados (por clique ou arrastar e soltar) contra `maxSizeBytes`. Selecione ou arraste um arquivo maior que 500 KB para ver o estado de erro e o helper sendo exibidos automaticamente, sem precisar controlar `error`/`helperText` manualmente.",
			},
		},
	},
};

export const ValidacaoDeTipo: Story = {
	name: "Validação de tipo",
	args: {
		acceptedTypes: "PDF",
		allowedTypes: [".pdf"],
	},
	parameters: {
		docs: {
			description: {
				story:
					"O `Uploader` também valida o tipo real dos arquivos selecionados (por clique ou arrastar e soltar) contra `allowedTypes` — aceita extensões (`.pdf`) e/ou MIME types (`application/pdf`, `image/*`). O mesmo valor também preenche o atributo nativo `accept` do `<input type=\"file\">`, mas isso só filtra o explorador de arquivos (não tem efeito no drag and drop); a validação de `allowedTypes` é o que de fato bloqueia o arquivo em ambos os fluxos e exibe o helper de erro. Tente soltar um PNG para ver o erro.",
			},
		},
	},
};

export const SelecaoComLog: Story = {
	name: "Seleção de arquivos (com log)",
	parameters: {
		docs: {
			description: {
				story:
					"Demonstra a captura real dos arquivos escolhidos: ao selecionar (clique) ou soltar arquivos no `Uploader` com `multiple`, cada novo arquivo é somado aos já selecionados (em vez de substituí-los). A lista completa é exibida abaixo do componente e também registrada no console do navegador (`console.log`), confirmando que os arquivos estão sendo efetivamente acumulados pelo componente.",
			},
		},
	},
	render: () => ({
		moduleMetadata: { imports: [CommonModule, UploaderComponent] },
		props: {
			selectedFiles: [] as File[],
			onFilesSelected(files: File[] | null): void {
				const list = files ?? [];
				
				this["selectedFiles"] = list;
			},
		},
		template: `
      <div style="display:flex; flex-direction:column; gap: 16px; width: 364px;">
        <lib-uploader
          maxSize="2 MB"
          [maxSizeBytes]="2097152"
          [multiple]="true"
          (filesSelected)="onFilesSelected($event)"
        ></lib-uploader>

        <ul *ngIf="selectedFiles.length" style="margin:0; padding-left: 20px; font-size: 13px;">
          <li *ngFor="let file of selectedFiles">
            {{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)
          </li>
        </ul>
      </div>
    `,
	}),
};

export const TodasAsVariacoes: Story = {
	name: "Todas as variações",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				story: "Visão geral dos estados padrão, com rótulo adicional, erro e desabilitado, como na grade do arquivo do Figma.",
			},
		},
	},
	render: () => ({
		moduleMetadata: { imports: [UploaderComponent] },
		template: `
      <div style="display:flex; flex-direction:column; gap: 24px; width: 364px;">
        <lib-uploader></lib-uploader>
        <lib-uploader [showAdditionalLabel]="true" [additionalLabel]="'1080x1080'"></lib-uploader>
        <lib-uploader [error]="true" [helperText]="'Arquivo excede o tamanho máximo permitido.'"></lib-uploader>
        <lib-uploader [disabled]="true"></lib-uploader>
      </div>
    `,
	}),
};
