<template>
  <div class="blockly-container">
    <!-- Header -->
    <header class="header">
      <router-link to="/" class="btn-voltar">
        <span class="arrow">←</span> Voltar
      </router-link>

      <div class="header-title">
        <img :src="logo" alt="Logo SQL Block" class="db-icon" />
        <h1>SQL BLOCK</h1>
      </div>

      <div class="header-actions">
        <button class="btn-header" @click="exportarSQL">
          <img :src="exportIcon" alt="Exportar" class="icon" />
          <span>Exportar para SQL</span>
        </button>
        <button class="btn-header" @click="salvarProjeto">
          <img :src="saveIcon" alt="Salvar" class="icon" />
          <span>Salvar</span>
        </button>
      </div>
    </header>

    <div class="main-content">
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
import { sqlGenerator } from '@/blockly/generators/generatorSql';
import 'blockly/blocks';

// Importar blocos SQL avançados (versão única usada pelo app)
import { registerAdvancedSqlBlocks } from '@/blockly/blocks/sqlBlocks';

// Importar CSS
import '@/assets/css/workspace.css';
import logo from '@/assets/images/logoWhite.png';
import exportIcon from '@/assets/images/export.png';
import saveIcon from '@/assets/images/save.png';

export default {
  name: 'BlocklyView',
  data() {
    return {
      logo,
      exportIcon,
      saveIcon,
      workspace: null,
      workspaceIniciado: false,
      codigoSQL: '',
      mostrarSQL: false,
      modalExportar: false,
      sqlGenerator: null
    };
  },
  mounted() {
    this.sqlGenerator = sqlGenerator;
    this.inicializarBlockly();
  },
  beforeUnmount() {
    if (this.workspace) {
      try {
        this.workspace.dispose();
      } catch (error) {
        console.error('Erro ao destruir workspace Blockly:', error);
      }
      this.workspace = null;
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
            name: 'Tabelas (CRIAR / MUDAR / APAGAR)',
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
              // INSERT
              { kind: 'block', type: 'insert_table' },
              { kind: 'block', type: 'insert_pair' },
              // UPDATE / DELETE
              { kind: 'block', type: 'update_table' },
              { kind: 'block', type: 'update_var' },
              { kind: 'block', type: 'delete_from_table' }
            ]
          },
          {
            kind: 'category',
            name: 'Ver dados (SELECT)',
            colour: '#5CA65C',
            contents: [
              { kind: 'block', type: 'select' },
              { kind: 'block', type: 'select_var' },
              { kind: 'block', type: 'select_from' },
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
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* Apenas estilos específicos do componente que não estão no workspace.css */
</style>
