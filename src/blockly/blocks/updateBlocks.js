import * as Blockly from 'blockly/core';

/**
 * Blocos relacionados à atualização de dados em tabelas.
 * Linguagem simples e acessível para estudantes PcD.
 */
export function registerUpdateBlocks() {

  // 🧱 Bloco principal: Atualizar dados na tabela
  Blockly.Blocks['atualizar_dados'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Atualizar tabela")
        .appendField(new Blockly.FieldTextInput("nome_tabela"), "table_name");
      this.appendStatementInput("novos_valores")
        .setCheck(null)
        .appendField("com os novos valores:");
      this.appendValueInput("condicao")
        .setCheck("String")
        .appendField("onde (condição):");
      this.setColour(120);
      this.setTooltip("Atualiza os dados de uma tabela que cumprem a condição escolhida.");
      this.setHelpUrl("");
    }
  };

  // 🧱 Gerador SQL: atualizar_dados
  Blockly.JavaScript['atualizar_dados'] = function (block) {
    const tableName = block.getFieldValue('table_name');
    const newValues = Blockly.JavaScript.statementToCode(block, 'novos_valores').trim();
    const condition = Blockly.JavaScript.valueToCode(block, 'condicao', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `UPDATE ${tableName} SET ${newValues} WHERE ${condition};\n`;
    return code;
  };

  // 🧩 Bloco: Novo valor para coluna
  Blockly.Blocks['novo_valor'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Coluna")
        .appendField(new Blockly.FieldTextInput("nome_coluna"), "column")
        .appendField("novo valor")
        .appendField(new Blockly.FieldTextInput("'valor'"), "value");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(90);
      this.setTooltip("Define um novo valor para uma coluna específica.");
      this.setHelpUrl("");
    }
  };

  // 🧱 Gerador SQL: novo_valor
  Blockly.JavaScript['novo_valor'] = function (block) {
    const column = block.getFieldValue('column');
    const value = block.getFieldValue('value');
    return `${column} = ${value},\n`;
  };

  // 🧩 Bloco: Condição simples (reuso de selectBlocks)
  Blockly.Blocks['condicao_simples_update'] = {
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
      this.setTooltip("Cria uma condição simples para atualizar apenas os dados que cumprem a condição.");
      this.setHelpUrl("");
    }
  };

  // 🧱 Gerador SQL: condicao_simples_update
  Blockly.JavaScript['condicao_simples_update'] = function (block) {
    const column = block.getFieldValue('column');
    const operator = block.getFieldValue('operator');
    const value = block.getFieldValue('value');
    const code = `${column} ${operator} ${value}`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
}
