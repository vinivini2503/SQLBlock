<template>
  <div class="blockly-container">
    <div ref="blocklyDiv" class="blockly-div"></div>
    <button @click="exportarSQL" class="btn-exportar">Exportar para .SQL</button>
    <textarea v-model="sqlCode" readonly class="sql-area"></textarea>
  </div>
</template>

<script>
import * as Blockly from 'blockly/core'
import 'blockly/blocks'
import { registerAllBlocks } from '@/blockly/index'
import toolbox from '@/blockly/toolbox/toolbox.json'

export default {
  name: 'BlockyView',
  data() {
    return {
      workspace: null,
      sqlCode: '',
    }
  },
  mounted() {
    registerAllBlocks() // registra todos os blocos criados

    this.workspace = Blockly.inject(this.$refs.blocklyDiv, {
      toolbox: toolbox,
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
      },
      scrollbars: true,
    })

    this.workspace.addChangeListener(this.atualizarCodigo)
  },
  methods: {
    atualizarCodigo() {
      const code = Blockly.JavaScript.workspaceToCode(this.workspace)
      this.sqlCode = code
    },
    exportarSQL() {
      const blob = new Blob([this.sqlCode], { type: 'text/sql' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'meu_projeto.sql'
      a.click()
    },
  },
}
</script>

<style scoped>
.blockly-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.blockly-div {
  height: 500px;
  width: 100%;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.sql-area {
  width: 100%;
  height: 150px;
  margin-top: 1rem;
  border-radius: 8px;
  border: 1px solid #bbb;
  padding: 0.5rem;
  font-family: monospace;
}

.btn-exportar {
  background-color: #4caf50;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.btn-exportar:hover {
  background-color: #43a047;
}
</style>
