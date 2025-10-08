import * as Blockly from 'blockly/core';

export function registerInsertBlocks() {

  // Bloco principal: Inserir dados na tabela
  Blockly.Blocks['inserir_dados'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Inserir dados na tabela")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.appendStatementInput("valores")
        .setCheck(null)
        .appendField("com os valores:");
      this.setColour(160);
      this.setTooltip("Insere novos dados em uma tabela existente.");
      this.setHelpUrl("");
    }
  };

  //  Gerador SQL do bloco "inserir_dados"
  Blockly.JavaScript['inserir_dados'] = function (block) {
    const tableName = block.getFieldValue('table_name');
    const values = Blockly.JavaScript.statementToCode(block, 'valores');
    const rows = values.trim().split('\n').filter(v => v !== '');
    const code = `INSERT INTO ${tableName} VALUES \n${rows.join(',\n')};\n`;
    return code;
  };

  // Bloco: Valor a ser inserido
  Blockly.Blocks['valor_inserir'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Linha com valores:")
        .appendField(new Blockly.FieldTextInput("'valor1', 'valor2', 'valor3'"), "values");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(140);
      this.setTooltip("Adiciona uma nova linha de valores para inserir na tabela.");
      this.setHelpUrl("");
    }
  };

  // Gerador SQL do bloco "valor_inserir"
  Blockly.JavaScript['valor_inserir'] = function (block) {
    const values = block.getFieldValue('values');
    return `(${values})\n`;
  };
}
