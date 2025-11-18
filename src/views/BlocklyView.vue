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
      </div>
    </header>

    <div class="main-content">
      <!-- Área do Blockly Workspace -->
      <div class="workspace-area">
        <div v-if="!workspaceIniciado" class="workspace-placeholder">
          <p>Arraste os blocos da toolbox para começar</p>
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
import { SqlGenerator } from '@/blockly/generators/sql';
import 'blockly/blocks';

// Importar blocos SQL avançados (versão única usada pelo app)
import { registerAdvancedSqlBlocks } from '@/blockly/blocks/sqlBlocks';

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
      sqlGenerator: null
    };
  },
  mounted() {
    this.sqlGenerator = new SqlGenerator();
    this.inicializarBlockly();
  },
  beforeUnmount() {
    if (this.workspace) {
      this.workspace.dispose();
    }
  },
  methods: {
    inicializarBlockly() {
      // Registrar blocos SQL customizados (apenas versão avançada)
      registerAdvancedSqlBlocks();

      // Configuração do Blockly com toolbox padrão usando blocos SQL avançados
      const toolbox = {
        kind: 'categoryToolbox',
        contents: [
          {
            kind: 'category',
            name: 'Início',
            colour: '#4CAF50',
            contents: [
              { kind: 'block', type: 'start_sql' }
            ]
          },
          {
            kind: 'category',
            name: 'Tabelas (CREATE / ALTER / DROP)',
            colour: '#5C81A6',
            contents: [
              { kind: 'block', type: 'create_table' },
              { kind: 'block', type: 'table_var' },
              { kind: 'block', type: 'table_var_pk' },
              { kind: 'block', type: 'table_var_fk' },
              { kind: 'block', type: 'alter_table' },
              { kind: 'block', type: 'drop_table' }
            ]
          },
          {
            kind: 'category',
            name: 'Dados (INSERT / UPDATE / DELETE)',
            colour: '#A65C81',
            contents: [
              { kind: 'block', type: 'insert_table' },
              { kind: 'block', type: 'insert_start' },
              { kind: 'block', type: 'insert_var' },
              { kind: 'block', type: 'insert_var_default' },
              { kind: 'block', type: 'update_table' },
              { kind: 'block', type: 'update_var' },
              { kind: 'block', type: 'delete_from_table' }
            ]
          },
          {
            kind: 'category',
            name: 'Consultas (SELECT)',
            colour: '#5CA65C',
            contents: [
              { kind: 'block', type: 'select' },
              { kind: 'block', type: 'select2' },
              { kind: 'block', type: 'select3' },
              { kind: 'block', type: 'select4' },
              { kind: 'block', type: 'select_var' },
              { kind: 'block', type: 'select_from' },
              { kind: 'block', type: 'select_join' },
              { kind: 'block', type: 'select_join_op' },
              { kind: 'block', type: 'select_where' },
              { kind: 'block', type: 'select_where_op' },
              { kind: 'block', type: 'select_orderby' }
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
        this.codigoSQL = this.sqlGenerator.workspaceToCode(this.workspace);
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
    }
  }
};
</script>

<style scoped>
/* Apenas estilos específicos do componente que não estão no workspace.css */
</style>
