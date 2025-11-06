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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
          </svg>
          <span>Exportar para SQL</span>
        </button>
        <button class="btn-header" @click="salvarProjeto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
          </svg>
          <span>Salvar</span>
        </button>
        <button class="btn-menu" @click="toggleMenu">
          <span class="icon">☰</span>
        </button>
      </div>
    </header>

    <!-- Área do Blockly Workspace com Toolbox nativa -->
    <div class="workspace-container">
      <div v-if="!workspaceIniciado" class="workspace-placeholder">
        <p>Arraste os blocos da lateral para começar</p>
      </div>
      <div ref="blocklyDiv" class="blockly-workspace"></div>
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
import 'blockly/blocks';
import { sqlGenerator } from '@/blockly/generators/sql';

// Importar os blocos customizados
import { registerCreateBlocks } from '@/blockly/blocks/createBlocks';
import { registerSelectBlocks } from '@/blockly/blocks/selectBlocks';
import { registerInsertBlocks } from '@/blockly/blocks/insertBlocks';
import { registerUpdateBlocks } from '@/blockly/blocks/updateBlocks';
import { registerDeleteBlocks } from '@/blockly/blocks/deleteBlocks';

export default {
  name: 'BlocklyView',
  data() {
    return {
      workspace: null,
      workspaceIniciado: false,
      codigoSQL: '',
      modalExportar: false
    };
  },
  mounted() {
    // Usar nextTick para garantir que o DOM está completamente renderizado
    this.$nextTick(() => {
      this.inicializarBlockly();
    });
  },
  beforeUnmount() {
    if (this.workspace) {
      this.workspace.dispose();
    }
  },
  methods: {
    inicializarBlockly() {
      try {
        // Verificar se o elemento DOM está disponível
        if (!this.$refs.blocklyDiv) {
          console.error('Elemento blocklyDiv não encontrado!');
          return;
        }

        console.log('Elemento DOM encontrado:', this.$refs.blocklyDiv);
        console.log('Dimensões do elemento:', {
          width: this.$refs.blocklyDiv.offsetWidth,
          height: this.$refs.blocklyDiv.offsetHeight
        });

        console.log('Registrando blocos customizados...');

        // Registrar todos os blocos customizados ANTES de criar a toolbox
        registerCreateBlocks();
        console.log('✓ Blocos de criação registrados');

        registerSelectBlocks();
        console.log('✓ Blocos de seleção registrados');

        registerInsertBlocks();
        console.log('✓ Blocos de inserção registrados');

        registerUpdateBlocks();
        console.log('✓ Blocos de atualização registrados');

        registerDeleteBlocks();
        console.log('✓ Blocos de deleção registrados');

        // Verificar se os blocos foram registrados
        console.log('Blocos registrados:', {
          criar_tabela: typeof Blockly.Blocks['criar_tabela'] !== 'undefined',
          selecionar_tudo: typeof Blockly.Blocks['selecionar_tudo'] !== 'undefined'
        });

        // Configuração da toolbox do Blockly usando XML (mais compatível)
        const toolboxXml = `
          <xml xmlns="https://developers.google.com/blockly/xml">
            <category name="Criar Tabelas" colour="#5C81A6">
              <block type="criar_tabela"></block>
              <block type="definir_coluna"></block>
            </category>
            <category name="Consultas (SELECT)" colour="#5CA65C">
              <block type="selecionar_tudo"></block>
              <block type="selecionar_colunas"></block>
              <block type="selecionar_com_condicao"></block>
              <block type="condicao_simples"></block>
            </category>
            <category name="Inserir (INSERT)" colour="#A65C81">
              <block type="inserir_dados"></block>
              <block type="valor_inserir"></block>
            </category>
            <category name="Atualizar (UPDATE)" colour="#5C7DA6">
              <block type="atualizar_dados"></block>
              <block type="novo_valor"></block>
              <block type="condicao_simples_update"></block>
            </category>
            <category name="Deletar (DELETE)" colour="#A65C5C">
              <block type="deletar_registros"></block>
              <block type="deletar_todos"></block>
              <block type="deletar_tabela"></block>
              <block type="condicao_simples_delete"></block>
            </category>
          </xml>
        `;

        console.log('Toolbox XML configurada');

        // Inicializar workspace do Blockly
        console.log('Inicializando workspace do Blockly...');

        // Converter XML string para elemento DOM
        const parser = new DOMParser();
        const toolboxElement = parser.parseFromString(toolboxXml, 'text/xml');
        const toolbox = toolboxElement.documentElement;

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

        console.log('Workspace criado:', this.workspace);

        // Forçar resize do workspace para garantir que seja renderizado corretamente
        setTimeout(() => {
          if (this.workspace) {
            try {
              // No Blockly 12, usar resizeContents se disponível
              if (typeof this.workspace.resize === 'function') {
                this.workspace.resize();
              } else if (typeof Blockly.svgResize === 'function') {
                Blockly.svgResize(this.workspace);
              }
              console.log('Workspace redimensionado');
            } catch (e) {
              console.warn('Erro ao redimensionar workspace:', e);
            }
          }
        }, 100);

        // Verificar se a toolbox foi criada
        setTimeout(() => {
          const toolbox = this.workspace.getToolbox();
          if (toolbox) {
            console.log('✓ Toolbox criada com sucesso');
            console.log('Toolbox element:', toolbox);
          } else {
            console.warn('⚠ Toolbox não foi criada!');
          }
        }, 200);

        // Listener para mudanças no workspace
        this.workspace.addChangeListener(() => {
          this.gerarCodigoSQL();
          this.workspaceIniciado = true;
        });

        console.log('✓ Blockly inicializado com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao inicializar Blockly:', error);
        console.error('Stack trace:', error.stack);
        alert(`Erro ao inicializar o Blockly: ${error.message}\n\nVerifique o console para mais detalhes.`);
      }
    },

    gerarCodigoSQL() {
      try {
        // Gerar SQL usando o gerador customizado
        this.codigoSQL = sqlGenerator.workspaceToCode(this.workspace);
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
      }).catch(() => {
        alert('Erro ao copiar código');
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

        // Aqui você pode integrar com Firebase depois
        console.log('Salvando projeto:', xmlText);
        alert('Projeto salvo com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar projeto');
      }
    },

    voltar() {
      this.$router.push('/projetos');
    },

    toggleMenu() {
      // Funcionalidade do menu pode ser implementada depois
      console.log('Menu toggle');
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.blockly-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

/* Header */
.header {
  background: #2E4B9E;
  color: white;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 100;
  flex-shrink: 0;
}

.btn-voltar {
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: rgba(255,255,255,0.1);
}

.arrow {
  font-size: 20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.db-icon {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-header {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-header:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-1px);
}

.btn-header svg {
  flex-shrink: 0;
}

.btn-menu {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
}

/* Workspace Container */
.workspace-container {
  flex: 1;
  position: relative;
  background: #fff;
  overflow: hidden;
}

.blockly-workspace {
  position: absolute;
  width: 100%;
  height: 100%;
  min-width: 400px;
  min-height: 400px;
}

.workspace-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  font-size: 20px;
  pointer-events: none;
  z-index: 1;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #333;
}

.sql-textarea {
  width: 100%;
  min-height: 300px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn-primary:hover {
  background: #357ABD;
}

.btn-secondary {
  background: #ddd;
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn-secondary:hover {
  background: #ccc;
}

/* Responsive */
@media (max-width: 768px) {
  .btn-header span {
    display: none;
  }

  .header-title h1 {
    font-size: 20px;
  }
}
</style>
