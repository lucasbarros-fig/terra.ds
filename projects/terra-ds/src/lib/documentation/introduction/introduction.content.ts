/** HTML estático da página de introdução — fora do template Angular para evitar conflito com `{`, `}` e `@`. */
export const INTRODUCTION_HTML = `<main class="pds-intro" role="main" aria-label="Terra Design System — documentação de introdução">

  <section aria-labelledby="pds-heading-intro">
    <h1 id="pds-heading-intro">Terra Design System</h1>
    <h2>Introdução</h2>
    <p>
      O Terra Design System é a biblioteca de componentes e tokens da The House/Teddy,
      projetada para criar interfaces consistentes, acessíveis e responsivas nos produtos da
      plataforma. Baseado no Token Studio e compilado com Style Dictionary, o Terra DS oferece
      componentes Angular reutilizáveis e tokens CSS semânticos que se adaptam automaticamente
      aos temas claro e escuro e às marcas da organização.
    </p>

    <ul role="list" class="pds-cards">
      <li class="pds-card">
        <h3>Marca Solaris</h3>
        <p>
          Componentes estilizados com os tokens visuais da marca Solaris, garantindo identidade
          visual unificada em toda a plataforma.
        </p>
      </li>
      <li class="pds-card">
        <h3>Suporte e compatibilidade</h3>
        <p>
          Angular 20+, Storybook 9+, navegadores modernos. Compatível com temas claro e escuro
          via <code>data-theme</code>.
        </p>
      </li>
      <li class="pds-card">
        <h3>Componentes reutilizáveis</h3>
        <p>
          Biblioteca de componentes atômicos e moleculares prontos para uso: botões, inputs,
          diálogos, selects, tabelas e muito mais.
        </p>
      </li>
      <li class="pds-card">
        <h3>Mobile first</h3>
        <p>
          Componentes projetados com abordagem mobile-first, utilizando tokens de spacing e
          tipografia fluida para garantir boa experiência em qualquer viewport.
        </p>
      </li>
    </ul>
  </section>

  <section aria-labelledby="pds-heading-pacotes">
    <h2 id="pds-heading-pacotes">Pacotes</h2>
    <ul class="pds-packages" role="list">
      <li class="pds-pkg-item">
        <span class="pds-pkg-name">@teddy-conkey/terra-ds</span>
        <span class="pds-badge">v0.26.4</span>
        <a
          class="pds-pkg-link"
          href="https://www.npmjs.com/package/@teddy-conkey/terra-ds"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir pacote terra-ds no npm (nova aba)"
        >npm ↗</a>
      </li>
      <li class="pds-pkg-item">
        <span class="pds-pkg-name">@teddy-conkey/conkey-ds-tokens</span>
        <span class="pds-badge">^2.0.8</span>
        <a
          class="pds-pkg-link"
          href="https://www.npmjs.com/package/@teddy-conkey/conkey-ds-tokens"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir pacote conkey-ds-tokens no npm (nova aba)"
        >npm ↗</a>
      </li>
    </ul>
  </section>

  <section aria-labelledby="pds-heading-install-css">
    <h2 id="pds-heading-install-css">Instalação — Somente CSS</h2>
    <p class="pds-code-label">1. Instale o pacote:</p>
    <div
      class="pds-code-block"
      role="region"
      aria-label="Bloco de código — instalação via npm"
    >
      <pre><code>npm install @teddy-conkey/terra-ds</code></pre>
      <button type="button" class="pds-copy-btn" aria-label="Copiar comando de instalação npm">Copiar</button>
    </div>

    <p class="pds-code-label">2. Importe o CSS global no arquivo de estilos raiz (ex.: <code>styles.css</code>):</p>
    <div
      class="pds-code-block"
      role="region"
      aria-label="Bloco de código — importação do CSS global"
    >
      <pre><code>@import '@teddy-conkey/terra-ds/styles/style.css';</code></pre>
      <button type="button" class="pds-copy-btn" aria-label="Copiar importação CSS">Copiar</button>
    </div>
  </section>

  <section aria-labelledby="pds-heading-install-wc">
    <h2 id="pds-heading-install-wc">Instalação — Com Web Components</h2>
    <p>
      Importe o componente desejado em um <em>standalone component</em> ou módulo Angular:
    </p>
    <div
      class="pds-code-block"
      role="region"
      aria-label="Bloco de código — importação de componente Angular"
    >
      <pre><code>// Importação em standalone component (Angular 15+)
import { ButtonComponent } from '@teddy-conkey/terra-ds';

// adicione ao array imports: [] do seu componente:</code></pre>
      <button type="button" class="pds-copy-btn" aria-label="Copiar exemplo de importação Angular">Copiar</button>
    </div>
  </section>

  <section aria-labelledby="pds-heading-temas">
    <h2 id="pds-heading-temas">Temas e marcas</h2>

    <h3 class="pds-subsection-title">Modo claro/escuro</h3>
    <p>
      O tema é controlado pelo atributo <code>data-theme</code> no elemento
      <code>&lt;html&gt;</code>. O Terra DS usa tema <strong>escuro</strong> como padrão:
    </p>
    <div
      class="pds-code-block"
      role="region"
      aria-label="Bloco de código — alternância de tema claro/escuro"
    >
      <pre><code>// Aplicar tema escuro (padrão do Terra DS)
document.documentElement.setAttribute('data-theme', 'dark');

// Alternar para tema claro
document.documentElement.setAttribute('data-theme', 'light');</code></pre>
      <button type="button" class="pds-copy-btn" aria-label="Copiar código de alternância de tema">Copiar</button>
    </div>

    <h3 class="pds-subsection-title">Multi-marca</h3>
    <p>
      A marca é controlada pelo atributo <code>data-brand</code> no elemento
      <code>&lt;html&gt;</code>:
    </p>
    <div
      class="pds-code-block"
      role="region"
      aria-label="Bloco de código — configuração de marca"
    >
      <pre><code>// Aplicar marca Terra The House (disponível hoje)
document.documentElement.setAttribute('data-brand', 'solaris-theHouse');</code></pre>
      <button type="button" class="pds-copy-btn" aria-label="Copiar código de configuração de marca">Copiar</button>
    </div>
  </section>

  <section aria-labelledby="pds-heading-requisitos">
    <h2 id="pds-heading-requisitos">Requisitos</h2>
    <div class="pds-table-wrapper">
      <table class="pds-table">
        <thead>
          <tr>
            <th scope="col">Dependência</th>
            <th scope="col">Versão mínima</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Node.js</th>
            <td>&gt;= 18</td>
          </tr>
          <tr>
            <th scope="row">Angular CLI</th>
            <td>&gt;= 20</td>
          </tr>
          <tr>
            <th scope="row">Storybook</th>
            <td>&gt;= 9</td>
          </tr>
          <tr>
            <th scope="row">@teddy-conkey/conkey-ds-tokens</th>
            <td>&gt;= 2.0.8</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section aria-labelledby="pds-heading-licenca">
    <h2 id="pds-heading-licenca">Licença</h2>
    <p>
      Terra DS é distribuído sob a licença MIT. Consulte o arquivo
      <a
        class="pds-license-link"
        href="https://github.com/Teddy-Conkey/conkey-ds/blob/main/LICENSE"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir arquivo LICENSE no GitHub (nova aba)"
      >LICENSE</a>
      para mais informações.
    </p>
  </section>

</main>`;
