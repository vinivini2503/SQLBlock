import * as Blockly from 'blockly/core';

/**
 * Blocos relacionados à leitura e visualização de dados.
 * Escrito em português simples, com foco na clareza para estudantes PcD.
 */
export function registerSelectBlocks() {

  // 🧱 Bloco: Selecionar todos os registros de uma tabela
  Blockly.Blocks['selecionar_tudo'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Selecionar todos os registros da tabela")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.setColour(210);
      this.setTooltip("Mostra todos os dados de uma tabela.");
      this.setHelpUrl("");
    }
  };

  // 🧱 Gerador SQL: selecionar_tudo
  Blockly.JavaScript['selecionar_tudo'] = function (block) {
    const tableName = block.getFieldValue('table_name');
    const code = `SELECT * FROM ${tableName};\n`;
    return code;
  };

  // 🧩 Bloco: Selecionar colunas específicas
  Blockly.Blocks['selecionar_colunas'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Selecionar colunas")
        .appendField(new Blockly.FieldTextInput("coluna1, coluna2"), "columns")
        .appendField("da tabela")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.setColour(200);
      this.setTooltip("Mostra apenas as colunas escolhidas da tabela.");
      this.setHelpUrl("");
    }
  };

  // 🧱 Gerador SQL: selecionar_colunas
  Blockly.JavaScript['selecionar_colunas'] = function (block) {
    const columns = block.getFieldValue('columns');
    const tableName = block.getFieldValue('table_name');
    const code = `SELECT ${columns} FROM ${tableName};\n`;
    return code;
  };

  // 🧩 Bloco: Selecionar com condição (WHERE)
  Blockly.Blocks['selecionar_com_condicao'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Selecionar da tabela")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.appendValueInput("condicao")
        .setCheck("String")
        .appendField("onde (condição):");
      this.setColour(190);
      this.setTooltip("Mostra apenas os dados que cumprem a condição escolhida.");
      this.setHelpUrl("");
    }
  };

  // 🧱 Gerador SQL: selecionar_com_condicao
  Blockly.JavaScript['selecionar_com_condicao'] = function (block) {
    const tableName = block.getFieldValue('table_name');
    const condition = Blockly.JavaScript.valueToCode(block, 'condicao', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `SELECT * FROM ${tableName} WHERE ${condition};\n`;
    return code;
  };

  // 🧩 Bloco: Condição simples (ex: idade > 18)
  Blockly.Blocks['condicao_simples'] = {
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
      this.setTooltip("Cria uma condição simples para filtrar os dados.");
      this.setHelpUrl("");
    }
  };

  // 🧱 Gerador SQL: condicao_simples
  Blockly.JavaScript['condicao_simples'] = function (block) {
    const column = block.getFieldValue('column');
    const operator = block.getFieldValue('operator');
    const value = block.getFieldValue('value');
    const code = `${column} ${operator} ${value}`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
}
