import * as Blockly from 'blockly/core';

/**
 * Blocos relacionados à criação de tabelas no banco de dados.
 * Todos os textos estão em português simples para facilitar a compreensão.
 */
export function registerCreateBlocks() {
  //  Bloco: Criar Tabela
  Blockly.Blocks['criar_tabela'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Criar nova tabela chamada")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.appendStatementInput("colunas")
        .setCheck(null)
        .appendField("com colunas:");
      this.setColour(230);
      this.setTooltip("Cria uma nova tabela no banco de dados.");
      this.setHelpUrl("");
    }
  };

  // Gerador SQL para o bloco "criar_tabela"
  Blockly.JavaScript['criar_tabela'] = function (block) {
    const tableName = block.getFieldValue('table_name');
    const columns = Blockly.JavaScript.statementToCode(block, 'colunas');
    const code = `CREATE TABLE ${tableName} (\n${columns});\n`;
    return code;
  };

  // Bloco: Definir Coluna
  Blockly.Blocks['definir_coluna'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Coluna")
        .appendField(new Blockly.FieldTextInput("nome_coluna"), "column_name")
        .appendField("do tipo")
        .appendField(new Blockly.FieldDropdown([
          ["Texto (VARCHAR)", "VARCHAR(255)"],
          ["Número (INT)", "INT"],
          ["Número decimal (FLOAT)", "FLOAT"],
          ["Data", "DATE"]
        ]), "column_type");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(180);
      this.setTooltip("Adiciona uma coluna à tabela.");
      this.setHelpUrl("");
    }
  };

  // Gerador SQL para o bloco "definir_coluna"
  Blockly.JavaScript['definir_coluna'] = function (block) {
    const columnName = block.getFieldValue('column_name');
    const columnType = block.getFieldValue('column_type');
    return `${columnName} ${columnType},\n`;
  };
}
