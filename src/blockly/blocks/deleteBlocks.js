import * as Blockly from 'blockly/core';
import { sqlGenerator } from '../generators/sql';

export function registerDeleteBlocks() {

  // Bloco: Deletar registros de uma tabela com condição
  Blockly.Blocks['deletar_registros'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Deletar registros da tabela")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.appendValueInput("condicao")
        .setCheck("String")
        .appendField("onde (condição):");
      this.setColour(0);
      this.setTooltip("Deleta apenas os registros que cumprem a condição escolhida.");
      this.setHelpUrl("");
    }
  };

  // Gerador SQL: deletar_registros
  sqlGenerator['deletar_registros'] = function (block) {
    const tableName = block.getFieldValue('table_name');
    const condition = sqlGenerator.valueToCode(block, 'condicao', sqlGenerator.ORDER_ATOMIC);
    const code = `DELETE FROM ${tableName} WHERE ${condition[0]};\n`;
    return code;
  };

  // Bloco: Deletar todos os registros de uma tabela
  Blockly.Blocks['deletar_todos'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Deletar todos os registros da tabela")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.setColour(15);
      this.setTooltip("Deleta todos os registros da tabela selecionada.");
      this.setHelpUrl("");
    }
  };

  // Gerador SQL: deletar_todos
  sqlGenerator['deletar_todos'] = function (block) {
    const tableName = block.getFieldValue('table_name');
    const code = `DELETE FROM ${tableName};\n`;
    return code;
  };

  // Bloco: Deletar tabela inteira
  Blockly.Blocks['deletar_tabela'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Deletar tabela")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.setColour(345);
      this.setTooltip("Remove a tabela inteira do banco de dados.");
      this.setHelpUrl("");
    }
  };

  // Gerador SQL: deletar_tabela
  sqlGenerator['deletar_tabela'] = function (block) {
    const tableName = block.getFieldValue('table_name');
    const code = `DROP TABLE ${tableName};\n`;
    return code;
  };

  // Bloco: Condição simples (reuso)
  Blockly.Blocks['condicao_simples_delete'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("coluna")
        .appendField(new Blockly.FieldTextInput("nome_coluna"), "column")
        .appendField(new Blockly.FieldDropdown([
          ["é igual a", "="],
          ["é diferente de", "<>"],
          ["é maior que", ">"],
          ["é menor que", "<"]
        ]), "operator")
        .appendField(new Blockly.FieldTextInput("'valor'"), "value");
      this.setOutput(true, "String");
      this.setColour(180);
      this.setTooltip("Cria uma condição simples para excluir apenas os registros que cumprem a condição.");
      this.setHelpUrl("");
    }
  };

  // Gerador SQL: condicao_simples_delete
  sqlGenerator['condicao_simples_delete'] = function (block) {
    const column = block.getFieldValue('column');
    const operator = block.getFieldValue('operator');
    const value = block.getFieldValue('value');
    const code = `${column} ${operator} ${value}`;
    return [code, sqlGenerator.ORDER_ATOMIC];
  };
}
