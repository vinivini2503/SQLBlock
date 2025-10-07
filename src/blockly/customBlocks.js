import * as Blockly from "blockly/core";

// Lista de blocos SQL para protótipo
const commonStatements = [
  "create_table",
  "insert_table",
  "select_table",
  "select_table_where",
  "delete_table",
  "delete_from_table",
  "alter_table",
  "update_table"
];

// Função que registra todos os blocos
export function registerBlocks() {

  commonStatements.forEach(statement => {
    Blockly.Blocks[statement] = {
      init: function() {
        const bloco = this; // declare a variável para ESLint
        bloco.appendDummyInput()
          .appendField(`Comando: ${statement}`);
        bloco.setColour(230);
        bloco.setPreviousStatement(true, null);
        bloco.setNextStatement(true, null);
        bloco.setTooltip("");
        bloco.setHelpUrl("");
      }
    };
  });

  // SELECT com WHERE
  Blockly.Blocks['select_table_where'] = {
    init: function() {
      const bloco = this;
      bloco.appendDummyInput()
        .appendField("SELECT * FROM tabela WHERE")
        .appendField(new Blockly.FieldTextInput("condição"), "CONDICAO");
      bloco.setPreviousStatement(true, null);
      bloco.setNextStatement(true, null);
      bloco.setColour(180);
      bloco.setTooltip("");
      bloco.setHelpUrl("");
    }
  };

  Blockly.JavaScript['select_table_where'] = function(block) {
    const condicao = block.getFieldValue('CONDICAO');
    return `SELECT * FROM tabela WHERE ${condicao};\n`;
  };
}
