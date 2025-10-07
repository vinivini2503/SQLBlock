<template>
  <div class="sql-block-app">
    <Header
      @back="handleBack"
      @export="handleExport"
      @save="handleSave"
      @menu="handleMenu"
    />

    <div class="main-content">
      <Sidebar />
      <BlocklyWorkspace ref="blocklyRef" />
    </div>

    <!-- Botão de teste temporário -->
    <button @click="testAddBlock" style="position: fixed; top: 100px; right: 20px; z-index: 9999; background: red; color: white; padding: 10px;">
      TESTE ADICIONAR BLOCO
    </button>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import * as Blockly from 'blockly/core'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import BlocklyWorkspace from './components/BlocklyWorkspace.vue'

const blocklyRef = ref(null)

// Função para adicionar blocos ao workspace
const addBlock = (blockType) => {
  console.log('App.vue - addBlock chamado com:', blockType)
  if (blocklyRef.value) {
    console.log('App.vue - blocklyRef.value existe:', blocklyRef.value)
    blocklyRef.value.addBlock(blockType)
  } else {
    console.log('App.vue - blocklyRef.value é null')
  }
}

// Prover a função addBlock para o Sidebar
provide('addBlock', addBlock)

// Handlers para os eventos do Header
const handleBack = () => {
  console.log('Voltar')
}

const handleExport = () => {
  console.log('Exportar para SQL')
  if (blocklyRef.value && blocklyRef.value.workspace()) {
    const code = Blockly.JavaScript.workspaceToCode(blocklyRef.value.workspace())
    console.log('Código SQL gerado:', code)
  }
}

const handleSave = () => {
  console.log('Salvar')
}

const handleMenu = () => {
  console.log('Menu')
}

// Função de teste
const testAddBlock = () => {
  console.log('TESTE - Tentando adicionar bloco create_table')
  addBlock('create_table')
}
</script>

<style scoped>
.sql-block-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  display: flex;
  height: calc(100vh - 80px);
}
</style>
