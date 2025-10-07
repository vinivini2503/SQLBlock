<template>
  <div>
    <div ref="blocklyDiv" style="height: 480px; width: 100%"></div>

    <xml id="toolbox" style="display: none">
      <block type="create_table"></block>
      <block type="insert_table"></block>
      <block type="select_table_where"></block>
    </xml>
  </div>
</template>

<script>
import * as Blockly from 'blockly/core'
import { registerBlocks } from './blockly/customBlocks'

export default {
  name: 'BlocklyView',
  mounted() {
    // Registrar blocos antes de criar workspace
    registerBlocks()

    // Criar workspace
    this.workspace = Blockly.inject(this.$refs.blocklyDiv, {
      toolbox: document.getElementById('toolbox'),
    })
  },
}
</script>

<style>
/* Apenas para garantir que o workspace ocupe a tela */
</style>
