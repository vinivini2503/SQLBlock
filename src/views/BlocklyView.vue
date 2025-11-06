<template>
  <div class="blockly-container">
    <!-- Header -->
    <header class="header">
      <button class="btn-voltar" @click="voltar">
        <span class="arrow">←</span> Voltar
      </button>

      <div class="header-title">
        <svg class="db-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <ellipse cx="20" cy="12" rx="15" ry="6" fill="white"/>
          <path d="M5 12 V20 Q5 26 20 26 Q35 26 35 20 V12" fill="white"/>
          <path d="M5 20 V28 Q5 34 20 34 Q35 34 35 28 V20" fill="white"/>
        </svg>
        <h1>SQL BLOCK</h1>
      </div>

      <div class="header-actions">
        <button class="btn-header" @click="exportarSQL">
          <span class="icon">📄</span>
          <span>Exportar para SQL</span>
        </button>
        <button class="btn-header" @click="salvarProjeto">
          <span class="icon">💾</span>
          <span>Salvar</span>
        </button>
        <button class="btn-menu" @click="toggleMenu">
          <span class="icon">☰</span>
        </button>
      </div>
    </header>

    <div class="main-content">
      <!-- Sidebar com categorias -->
      <aside class="sidebar" :class="{ 'sidebar-hidden': !sidebarVisible }">
        <div class="category-section">
          <button class="category-header" @click="toggleCategory('modificar')">
            <span class="icon">📊</span>
            Modificar tabelas
            <span class="arrow">{{ categoriaAberta.modificar ? '▼' : '▶' }}</span>
          </button>
          <div v-show="categoriaAberta.modificar" class="category-buttons">
            <button class="btn-category blue" @click="adicionarBlocoToolbox('criar_tabela')">
              CRIAR TABELA
            </button>
            <button class="btn-category blue" @click="adicionarBlocoToolbox('alterar_tabela')">
              ALTERAR TABELA
            </button>
            <button class="btn-category blue" @click="adicionarBlocoToolbox('excluir_tabela')">
              EXCLUIR TABELA
            </button>
            <button class="btn-category blue" @click="adicionarBlocoToolbox('atualizar')">
              ATUALIZAR
            </button>
          </div>
        </div>

        <div class="category-section">
          <button class="category-header" @click="toggleCategory('pesquisas')">
            <span class="icon">🔍</span>
            Fazer pesquisas
            <span class="arrow">{{ categoriaAberta.pesquisas ? '▼' : '▶' }}</span>
          </button>
          <div v-show="categoriaAberta.pesquisas" class="category-buttons">
            <button class="btn-category green" @click="adicionarBlocoToolbox('da_tabela')">
              DA TABELA
            </button>
            <button class="btn-category green" @click="adicionarBlocoToolbox('alterar_tabela_select')">
              ALTERAR TABELA
            </button>
            <button class="btn-category green" @click="adicionarBlocoToolbox('ordenar_por')">
              ORDENAR POR
            </button>
          </div>
        </div>

        <div class="category-section">
          <button class="btn-category red" @click="adicionarBlocoToolbox('unir_tabelas')">
            Unir Tabelas
          </button>
          <button class="btn-category red-light" @click="adicionarBlocoToolbox('conectores')">
            <span class="icon">∞</span>
          </button>
          <button class="btn-category red-dark" @click="adicionarBlocoToolbox('juntar_lado_direito')">
            JUNTAR TABELA DO LADO DIREITO
          </button>
        </div>
      </aside>

      <!-- Área do Blockly Workspace -->
      <div class="workspace-area">
        <div v-if="!workspaceIniciado" class="workspace-placeholder">
          <p>Arraste os blocos da lateral para começar</p>
        </div>
        <div ref="blocklyDiv" class="blockly-workspace"></div>

        <!-- Área de código SQL gerado -->
        <div v-if="mostrarSQL" class="sql-output">
          <div class="sql-header">
            <h3>Código SQL Gerado</h3>
            <button @click="copiarSQL" class="btn-copiar">Copiar</button>
          </div>
          <pre><code>{{ codigoSQL }}</code></pre>
        </div>
      </div>
    </div>

    <!-- Modal de exportação -->
    <div v-if="modalExportar" class="modal-overlay" @click="modalExportar = false">
      <div class="modal-content" @click.stop>
        <h2>Exportar para SQL</h2>
        <textarea readonly :value="codigoSQL" class="sql-textarea"></textarea>
        <div class="modal-actions">
          <button @click="copiarSQL" class="btn-primary">Copiar</button>
          <button @click="baixarSQL" class="btn-primary">Baixar .sql</button>
          <button @click="modalExportar = false" class="btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';

// Importar os blocos customizados
import { registerCreateBlocks } from '@/blocks/createBlocks';
import { registerSelectBlocks } from '@/blocks/selectBlocks';
import { registerInsertBlocks } from '@/blocks/insertBlocks';
import { registerUpdateBlocks } from '@/blocks/updateBlocks';
import { registerDeleteBlocks } from '@/blocks/deleteBlocks';

// Importar CSS
import '@/assets/css/workspace.css';

export default {
  name: 'BlocklyView',
  data() {
    return {
      workspace: null,
      workspaceIniciado: false,
      codigoSQL: '',
      mostrarSQL: false,
      modalExportar: false,
      sidebarVisible: true,
      categoriaAberta: {
        modificar: true,
        pesquisas: true
      }
    };
  },
  mounted() {
    this.inicializarBlockly();
  },
  beforeUnmount() {
    if (this.workspace) {
      this.workspace.dispose();
    }
  },
  methods: {
    inicializarBlockly() {
      // Registrar todos os blocos customizados
      registerCreateBlocks();
      registerSelectBlocks();
      registerInsertBlocks();
      registerUpdateBlocks();
      registerDeleteBlocks();

      // Configuração do Blockly com toolbox padrão
      const toolbox = {
        kind: 'categoryToolbox',
        contents: [
          {
            kind: 'category',
            name: 'Criar/Modificar',
            colour: '#5C81A6',
            contents: [
              { kind: 'block', type: 'criar_tabela' },
              { kind: 'block', type: 'definir_coluna' },
              { kind: 'block', type: 'deletar_tabela' }
            ]
          },
          {
            kind: 'category',
            name: 'Consultas (SELECT)',
            colour: '#5CA65C',
            contents: [
              { kind: 'block', type: 'selecionar_tudo' },
              { kind: 'block', type: 'selecionar_colunas' },
              { kind: 'block', type: 'selecionar_com_condicao' },
              { kind: 'block', type: 'condicao_simples' }
            ]
          },
          {
            kind: 'category',
            name: 'Inserir (INSERT)',
            colour: '#A65C81',
            contents: [
              { kind: 'block', type: 'inserir_dados' },
              { kind: 'block', type: 'valor_inserir' }
            ]
          },
          {
            kind: 'category',
            name: 'Atualizar (UPDATE)',
            colour: '#5C7DA6',
            contents: [
              { kind: 'block', type: 'atualizar_dados' },
              { kind: 'block', type: 'novo_valor' },
              { kind: 'block', type: 'condicao_simples_update' }
            ]
          },
          {
            kind: 'category',
            name: 'Deletar (DELETE)',
            colour: '#A65C5C',
            contents: [
              { kind: 'block', type: 'deletar_registros' },
              { kind: 'block', type: 'deletar_todos' },
              { kind: 'block', type: 'condicao_simples_delete' }
            ]
          }
        ]
      };

      // Inicializar workspace
      this.workspace = Blockly.inject(this.$refs.blocklyDiv, {
        toolbox: toolbox,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true,
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        }
      });

      // Listener para mudanças no workspace
      this.workspace.addChangeListener(() => {
        this.gerarCodigoSQL();
        this.workspaceIniciado = true;
      });
    },

    gerarCodigoSQL() {
      try {
        this.codigoSQL = javascriptGenerator.workspaceToCode(this.workspace);
      } catch (error) {
        console.error('Erro ao gerar SQL:', error);
        this.codigoSQL = '-- Erro ao gerar código SQL';
      }
    },

    exportarSQL() {
      this.gerarCodigoSQL();
      this.modalExportar = true;
    },

    copiarSQL() {
      navigator.clipboard.writeText(this.codigoSQL).then(() => {
        alert('Código SQL copiado para a área de transferência!');
      });
    },

    baixarSQL() {
      const blob = new Blob([this.codigoSQL], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'query.sql';
      a.click();
      window.URL.revokeObjectURL(url);
    },

    async salvarProjeto() {
      try {
        const xml = Blockly.Xml.workspaceToDom(this.workspace);
        const xmlText = Blockly.Xml.domToText(xml);

        // Aqui você pode integrar com Firebase
        console.log('Salvando projeto:', xmlText);
        alert('Projeto salvo com sucesso!');

        // TODO: Implementar salvamento no Firebase
        // const db = getFirestore();
        // await setDoc(doc(db, 'projetos', projectId), {
        //   workspace: xmlText,
        //   updatedAt: new Date()
        // });
      } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar projeto');
      }
    },

    voltar() {
      this.$router.push('/projetos');
    },

    toggleMenu() {
      this.sidebarVisible = !this.sidebarVisible;
    },

    toggleCategory(category) {
      this.categoriaAberta[category] = !this.categoriaAberta[category];
    },

    adicionarBlocoToolbox(tipo) {
      // Esta função pode ser expandida para adicionar blocos programaticamente
      console.log('Adicionar bloco:', tipo);
    }
  }
};
</script>

<style scoped>
/* Apenas estilos específicos do componente que não estão no workspace.css */
</style>
