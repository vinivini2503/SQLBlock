import * as Blockly from 'blockly/core';

export function registerAdvancedSqlBlocks() {
  const commonStatements = [
    'create_table',
    'insert_table',
    'select',
    'select2',
    'select3',
    'select4',
    'delete_from_table',
    'drop_table',
    'alter_table',
    'update_table'
  ];

  const validator = function (newValue) {
    if (newValue === '*') return '*';
    newValue = newValue.toLowerCase();
    newValue = newValue.replace(/[^A-Za-z0-9_ ]/g, '');
    newValue = newValue.replace(/  +/g, ' ');
    return newValue.replace(/\s/g, '_');
  };

  function newBlock(tipo) {
    const newblock = Blockly.getMainWorkspace().newBlock(tipo);
    newblock.initSvg();
    newblock.render();

    if (newblock.outputConnection) return newblock.outputConnection;
    return newblock.previousConnection;
  }

  Blockly.Blocks['start_sql'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Conectar ao banco de dados')
        .appendField(new Blockly.FieldTextInput('nome_do_banco'), 'db_name');
      this.setNextStatement(true, 'create_table');
      this.setColour(120);
      this.setTooltip('Iniciando projeto SQL');
      this.setHelpUrl('https://www.w3schools.com/sql/default.asp');
    }
  };

  Blockly.Blocks['create_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Criar tabela')
        .appendField(
          new Blockly.FieldDropdown([
            ['sem verificar', ''],
            ['se ainda não existir', ' IF NOT EXISTS']
          ]),
          'option'
        )
        .appendField(new Blockly.FieldTextInput('nome_tabela', validator), 'table_name');
      this.appendStatementInput('table_var').setCheck('table_var');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Variáveis')
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            addVar
          )
        )
        .appendField('Primary key')
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            addPK
          )
        )
        .appendField('Foreign key')
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            addFk
          )
        );
      this.setPreviousStatement(true, commonStatements);
      this.setNextStatement(true, commonStatements);
      this.setColour(225);
      this.setTooltip('Cria uma nova tabela no banco');
      this.setHelpUrl('https://github.com/google/blockly/wiki/IfElse');
    }
  };

  Blockly.Blocks['table_var'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Coluna')
        .appendField(new Blockly.FieldTextInput('nome_da_coluna', validator), 'var_name')
        .appendField('Tipo de dado')
        .appendField(
          new Blockly.FieldDropdown([
            ['Texto curto', 'VARCHAR(30)'],
            ['Número inteiro', 'INTEGER'],
            ['Número pequeno', 'TINYINT'],
            ['Uma letra', 'CHAR(1)'],
            ['Número com vírgula', 'FLOAT'],
            ['Data', 'DATE'],
            ['Data e hora', 'TIMESTAMP']
          ]),
          'type'
        )
        .appendField('Regra extra')
        .appendField(
          new Blockly.FieldDropdown([
            ['sem regra extra', ''],
            ['não repetir valores', ' UNIQUE'],
            ['não pode ficar vazio', ' NOT NULL'],
            ['numeração automática', ' AUTO_INCREMENT'],
            ['não vazio e numeração automática', ' NOT NULL AUTO_INCREMENT']
          ]),
          'opcao'
        )
        .appendField(
          new Blockly.FieldImage(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Feather-arrows-chevron-up.svg/120px-Feather-arrows-chevron-up.svg.png',
            20,
            20,
            'Adicionar Variavel',
            up
          )
        )
        .appendField(
          new Blockly.FieldImage(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Feather-arrows-chevron-down.svg/1200px-Feather-arrows-chevron-down.svg.png',
            20,
            20,
            'Adicionar Variavel',
            down
          )
        );
      this.setInputsInline(false);
      this.setPreviousStatement(true, 'table_var');
      this.setNextStatement(true, ['table_var', 'table_var_pk']);
      this.setColour(180);
      this.setTooltip('Adiciona um novo dado à tabela');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['table_var_pk'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Marcar como chave principal')
        .appendField(new Blockly.FieldTextInput('nome_da_coluna', validator), 'var_name');
      this.setInputsInline(true);
      this.setPreviousStatement(true, 'table_var_pk');
      this.setNextStatement(true, 'table_var_pk');
      this.setColour(180);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['table_var_fk'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Ligar com outra tabela')
        .appendField(new Blockly.FieldTextInput('id', validator), 'var_name')
        .appendField('na tabela')
        .appendField(new Blockly.FieldTextInput('nome_tabela', validator), 'table_name')
        .appendField('coluna')
        .appendField(new Blockly.FieldTextInput('id', validator), 'var_name_reference');
      this.setInputsInline(true);
      this.setPreviousStatement(true, 'table_var_pk');
      this.setNextStatement(true, 'table_var_pk');
      this.setColour(180);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  function addVar() {
    const tipo = Blockly.selected.getFirstStatementConnection().check_;
    let bloco;

    if (
      Blockly.selected.getChildren(true).length > 0 &&
      Blockly.selected.getChildren(true)[0].type === tipo[0]
    ) {
      bloco = Blockly.selected.getChildren(true)[0];
      while (bloco.getNextBlock() && bloco.getNextBlock().type === tipo[0]) {
        bloco = bloco.getNextBlock();
      }
      bloco = bloco.nextConnection;
    } else {
      bloco = Blockly.selected.getInput(tipo[0]).connection;
    }

    bloco.connect(newBlock(tipo[0]));
  }

  function addPK() {
    if (
      Blockly.selected.getChildren(true).length === 0 ||
      Blockly.selected.getChildren(true)[0].type !== 'table_var'
    ) {
      Blockly.selected.getInput('table_var').connection.connect(newBlock('table_var'));
    }

    const block = Blockly.selected.getChildren(true)[0].lastConnectionInStack();
    block.connect(newBlock('table_var_pk'));
  }

  function addFk() {
    if (
      Blockly.selected.getChildren(true).length === 0 ||
      Blockly.selected.getChildren(true)[0].type !== 'table_var'
    ) {
      Blockly.selected.getInput('table_var').connection.connect(newBlock('table_var'));
    }

    let bloco = Blockly.selected.getChildren(true)[0].lastConnectionInStack();

    while (bloco.sourceBlock_.type === 'table_var_pk') {
      bloco = bloco.sourceBlock_.getPreviousBlock().nextConnection;
    }

    bloco.connect(newBlock('table_var_fk'));
  }

  function up() {
    if (Blockly.selected !== Blockly.selected.getTopStackBlock()) {
      let parent;
      if (Blockly.selected.getTopStackBlock().getNextBlock() === Blockly.selected) {
        parent = Blockly.selected
          .getTopStackBlock()
          .getPreviousBlock()
          .getFirstStatementConnection();
      } else {
        parent = Blockly.selected.getPreviousBlock().getPreviousBlock().nextConnection;
      }
      Blockly.selected.unplug(true);
      parent.connect(Blockly.selected.previousConnection);
    }
  }

  function down() {
    const bloco = Blockly.selected;
    if (
      bloco.getNextBlock() &&
      (bloco.getNextBlock().nextConnection.check_[0] === bloco.type ||
        bloco.getNextBlock().nextConnection.check_[1] === bloco.type)
    ) {
      const child = bloco.getNextBlock().nextConnection;
      bloco.unplug(true);
      child.connect(bloco.previousConnection);
    }
  }

  // =========================
  // Blocos de INSERT
  // =========================

  Blockly.Blocks['insert_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Adicionar novas linhas na tabela')
        .appendField(new Blockly.FieldTextInput('nome_tabela'), 'table_name')
        .appendField('com colunas')
        .appendField(new Blockly.FieldTextInput('coluna1, coluna2'), 'vars');
      this.appendStatementInput('insert_var')
        .appendField('Valores para inserir')
        .setCheck('insert_start');
      this.appendDummyInput()
        .appendField('Valor digitado')
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            InsertVar
          )
        )
        .appendField('Valor automático')
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            InsertVarDefault
          )
        );
      this.setPreviousStatement(true, commonStatements);
      this.setNextStatement(true, commonStatements);
      this.setInputsInline(false);
      this.setColour(270);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['insert_start'] = {
    init: function () {
      this.appendValueInput('insert_var').setCheck(['insert_var', 'insert_var_default']);
      this.setPreviousStatement(['insert_table'], null);
      this.setColour(270);
      this.setTooltip('');
      this.setHelpUrl('');
      this.setDeletable(false);
      this.setMovable(false);
      this.setEditable(false);
    }
  };

  Blockly.Blocks['insert_var'] = {
    init: function () {
      this.appendValueInput('insert_var')
        .setCheck(['insert_var', 'insert_var_default'])
        .appendField(new Blockly.FieldTextInput('valor'), 'var_input');
      this.setOutput(true, ['insert_var', 'insert_var_default']);
      this.setColour(300);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['insert_var_default'] = {
    init: function () {
      this.appendValueInput('insert_var')
        .setCheck(['insert_var', 'insert_var_default'])
        .appendField(
          new Blockly.FieldDropdown([
            ['sem valor (NULL)', 'NULL'],
            ['data e hora de agora', 'CURRENT_TIMESTAMP']
          ]),
          'var_input'
        );
      this.setOutput(true, ['insert_var', 'insert_var_default']);
      this.setColour(300);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  function InsertVar() {
    let bloco = Blockly.selected.getChildren(true)[0];

    while (bloco.getChildren(true)[0]) {
      bloco = bloco.getChildren(true)[0];
    }

    bloco = bloco.getInput('insert_var').connection;
    bloco.connect(newBlock('insert_var'));
  }

  function InsertVarDefault() {
    let bloco = Blockly.selected.getChildren(true)[0];

    while (bloco.getChildren(true)[0]) {
      bloco = bloco.getChildren(true)[0];
    }

    bloco = bloco.getInput('insert_var').connection;
    bloco.connect(newBlock('insert_var_default'));
  }

  // =========================
  // Blocos de UPDATE / ALTER / DELETE / DROP
  // =========================

  Blockly.Blocks['update_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Atualizar dados da tabela')
        .appendField(new Blockly.FieldTextInput('nome_tabela', validator), 'table_name');
      this.appendStatementInput('update_var').setCheck('update_var');
      this.appendDummyInput()
        .appendField('Somente onde a coluna')
        .appendField(new Blockly.FieldTextInput('nome_coluna'), 'column_name')
        .appendField(
          new Blockly.FieldDropdown([
            ['é igual a', '='],
            ['é maior que', '>'],
            ['é menor que', '<'],
            ['maior ou igual a', '>='],
            ['menor ou igual a', '<='],
            ['diferente de', '<>'],
            ['parecida com (LIKE)', 'LIKE'],
            ['é', 'IS'],
            ['não é', 'IS NOT']
          ]),
          'type'
        )
        .appendField(new Blockly.FieldTextInput('valor'), 'value');
      this.appendDummyInput()
        .appendField(' Adicionar mais colunas para mudar')
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            25,
            25,
            'Adicionar Variavel',
            addVar
          )
        );
      this.setInputsInline(true);
      this.setPreviousStatement(true, commonStatements);
      this.setNextStatement(true, commonStatements);
      this.setColour(30);
      this.setTooltip('');
      this.setHelpUrl('https://github.com/google/blockly/wiki/IfElse');
    }
  };

  Blockly.Blocks['update_var'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Coluna')
        .appendField(new Blockly.FieldTextInput('nome_coluna', validator), 'var_name');
      this.appendDummyInput()
        .appendField('Novo valor para esta coluna')
        .appendField(new Blockly.FieldTextInput('novo_valor'), 'value');
      this.setInputsInline(true);
      this.setPreviousStatement(true, 'update_var');
      this.setNextStatement(true, 'update_var');
      this.setColour(60);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['alter_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Mudar estrutura da tabela')
        .appendField(new Blockly.FieldTextInput('nome_tabela', validator), 'table_name');
      this.appendDummyInput()
        .appendField(
          new Blockly.FieldDropdown([
            ['Adicionar nova coluna', 'ADD'],
            ['Mudar nome da tabela', 'RENAME TO'],
            ['Apagar coluna', 'DROP COLUMN'],
            ['Mudar tipo da coluna', 'MODIFY COLUMN']
          ]),
          'operation'
        );
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('nome_coluna', validator), 'column_name')
        .appendField(
          new Blockly.FieldDropdown([
            ['Texto curto', 'VARCHAR(30)'],
            ['Número inteiro', 'INTEGER'],
            ['Número pequeno', 'TINYINT'],
            ['Uma letra', 'CHAR(1)'],
            ['Número com vírgula', 'FLOAT']
          ]),
          'type'
        );
      this.setInputsInline(true);
      this.setPreviousStatement(true, commonStatements);
      this.setNextStatement(true, commonStatements);
      this.setColour(30);
      this.setTooltip('');
      this.setHelpUrl('https://github.com/google/blockly/wiki/IfElse');
    }
  };

  Blockly.Blocks['delete_from_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Apagar algumas linhas da tabela')
        .appendField(new Blockly.FieldTextInput('nome_tabela'), 'table_name')
        .appendField('onde a coluna')
        .appendField(new Blockly.FieldTextInput('nome_coluna'), 'var_name');
      this.appendDummyInput()
        .appendField(
          new Blockly.FieldDropdown([
            ['é igual a', '='],
            ['é maior que', '>'],
            ['é menor que', '<'],
            ['maior ou igual a', '>='],
            ['menor ou igual a', '<='],
            ['diferente de', '<>'],
            ['parecida com (LIKE)', 'LIKE'],
            ['é', 'IS'],
            ['não é', 'IS NOT']
          ]),
          'type'
        );
      this.appendDummyInput().appendField(new Blockly.FieldTextInput('valor'), 'value');
      this.setInputsInline(true);
      this.setPreviousStatement(true, commonStatements);
      this.setNextStatement(true, commonStatements);
      this.setColour(0);
      this.setTooltip('Deletar tabela');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['drop_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Apagar a tabela inteira')
        .appendField(
          new Blockly.FieldDropdown([
            ['sem verificar', ''],
            ['se a tabela existir', ' IF EXISTS']
          ]),
          'option'
        )
        .appendField(new Blockly.FieldTextInput('nome_tabela', validator), 'name_table');
      this.setPreviousStatement(true, commonStatements);
      this.setNextStatement(true, commonStatements);
      this.setColour(345);
      this.setTooltip('Deletar tabela');
      this.setHelpUrl('');
    }
  };

  // =========================
  // Blocos de SELECT
  // =========================

  Blockly.Blocks['select'] = {
    init: function () {
      this.appendValueInput('vars')
        .setCheck('select_var')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Mostrar colunas')
        .appendField(
          new Blockly.FieldDropdown([
            ['com repetidos', ''],
            ['sem repetir linhas', ' DISTINCT']
          ]),
          'option'
        );
      this.appendValueInput('from')
        .setCheck('select_from')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('da tabela');
      this.appendValueInput('join')
        .setCheck('select_join')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(
          new Blockly.FieldDropdown([
            ['juntar onde combina', 'INNER JOIN'],
            ['juntar deixando vazios à direita', 'LEFT JOIN'],
            ['juntar deixando vazios à esquerda', 'RIGHT JOIN'],
            ['juntar tudo das duas tabelas', 'FULL JOIN']
          ]),
          'join_type'
        );
      this.appendValueInput('conditions')
        .setCheck('select_where')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('somente onde');
      this.appendValueInput('orderby')
        .setCheck('select_orderby')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('organizar por');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('Adicionar mais partes')
        .appendField(
          new Blockly.FieldDropdown([
            ['Coluna', 'Select'],
            ['Tabela', 'From'],
            ['Interação', 'Join'],
            ['Restrição', 'Where'],
            ['Ordenação', 'OrderBy']
          ]),
          'opcao'
        )
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            addSelect
          )
        );
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setColour(205);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select2'] = {
    init: function () {
      this.appendValueInput('vars')
        .setCheck('select_var')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('SELECT')
        .appendField(
          new Blockly.FieldDropdown([
            ['', ''],
            ['DISTINCT', ' DISTINCT']
          ]),
          'option'
        );
      this.appendValueInput('from')
        .setCheck('select_from')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('FROM');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('Adicionar')
        .appendField(
          new Blockly.FieldDropdown([
            ['Coluna', 'Select'],
            ['Tabela', 'From']
          ]),
          'opcao'
        )
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            addSelect
          )
        );
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setColour(205);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select3'] = {
    init: function () {
      this.appendValueInput('vars')
        .setCheck('select_var')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('SELECT')
        .appendField(
          new Blockly.FieldDropdown([
            ['', ''],
            ['DISTINCT', ' DISTINCT']
          ]),
          'option'
        );
      this.appendValueInput('from')
        .setCheck('select_from')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('FROM');
      this.appendValueInput('join')
        .setCheck('select_join')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(
          new Blockly.FieldDropdown([
            ['INNER JOIN', 'INNER JOIN'],
            ['LEFT JOIN', 'LEFT JOIN'],
            ['RIGHT JOIN', 'RIGHT JOIN'],
            ['FULL JOIN', 'FULL JOIN']
          ]),
          'join_type'
        );
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('Adicionar')
        .appendField(
          new Blockly.FieldDropdown([
            ['Coluna', 'Select'],
            ['Tabela', 'From'],
            ['Interação', 'Join']
          ]),
          'opcao'
        )
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            addSelect
          )
        );
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setColour(205);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select4'] = {
    init: function () {
      this.appendValueInput('vars')
        .setCheck('select_var')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('SELECT')
        .appendField(
          new Blockly.FieldDropdown([
            ['', ''],
            ['DISTINCT', ' DISTINCT']
          ]),
          'option'
        );
      this.appendValueInput('from')
        .setCheck('select_from')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('FROM');
      this.appendValueInput('conditions')
        .setCheck('select_where')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('WHERE');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('Adicionar')
        .appendField(
          new Blockly.FieldDropdown([
            ['Coluna', 'Select'],
            ['Tabela', 'From'],
            ['Restrição', 'Where']
          ]),
          'opcao'
        )
        .appendField(
          new Blockly.FieldImage(
            'https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png',
            15,
            15,
            '',
            addSelect
          )
        );
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setColour(205);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select_var'] = {
    init: function () {
      this.appendValueInput('vars')
        .setCheck('select_var')
        .appendField(new Blockly.FieldTextInput('nome_coluna_ou_*'), 'var_input');
      this.setOutput(true, 'select_var');
      this.setColour(185);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select_from'] = {
    init: function () {
      this.appendValueInput('from')
        .setCheck('select_from')
        .appendField(new Blockly.FieldTextInput('nome_tabela'), 'table_name');
      this.setOutput(true, 'select_from');
      this.setColour(105);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select_join'] = {
    init: function () {
      this.appendValueInput('join')
        .appendField(new Blockly.FieldTextInput('nome_tabela'), 'table_name')
        .appendField('ligar quando')
        .appendField(new Blockly.FieldLabelSerializable(''), 'tabela1')
        .appendField('.')
        .appendField(new Blockly.FieldTextInput('coluna1'), 'table_var')
        .appendField('=')
        .appendField(new Blockly.FieldLabelSerializable(''), 'tabela2')
        .appendField('.')
        .appendField(new Blockly.FieldTextInput('coluna2'), 'table_join_var')
        .setCheck('select_join_op');
      this.setOutput(true, 'select_join');
      this.setColour(235);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select_join_op'] = {
    init: function () {
      this.appendValueInput('join')
        .appendField(
          new Blockly.FieldDropdown([
            ['juntar onde combina', 'INNER JOIN'],
            ['juntar deixando vazios à direita', 'LEFT JOIN'],
            ['juntar deixando vazios à esquerda', 'RIGHT JOIN'],
            ['juntar tudo das duas tabelas', 'FULL JOIN']
          ]),
          'join_type'
        )
        .appendField(new Blockly.FieldTextInput('nome_tabela'), 'table_name')
        .appendField('ligar quando')
        .appendField(new Blockly.FieldTextInput('coluna1'), 'table_var')
        .appendField('=')
        .appendField(new Blockly.FieldTextInput('coluna2'), 'table_join_var')
        .setCheck('select_join_op');
      this.setOutput(true, 'select_join_op');
      this.setColour(235);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select_where'] = {
    init: function () {
      this.appendValueInput('conditions')
        .appendField(new Blockly.FieldTextInput('nome_coluna'), 'variavel')
        .appendField(
          new Blockly.FieldDropdown([
            ['diferente de', '<>'],
            ['igual a', '='],
            ['maior que', '>'],
            ['menor que', '<'],
            ['maior ou igual a', '>='],
            ['menor ou igual a', '<='],
            ['parecida com (LIKE)', 'LIKE'],
            ['é', 'IS'],
            ['não é', 'IS NOT'],
            ['entre dois valores', 'BETWEEN'],
            ['em uma lista de valores', 'IN']
          ]),
          'op'
        )
        .appendField(new Blockly.FieldTextInput('valor'), 'value')
        .setCheck('select_where_op');
      this.setOutput(true, 'select_where');
      this.setColour(330);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select_where_op'] = {
    init: function () {
      this.appendValueInput('conditions')
        .appendField(
          new Blockly.FieldDropdown([
            ['e também (AND)', 'AND'],
            ['ou então (OR)', 'OR']
          ]),
          'action'
        )
        .appendField(new Blockly.FieldTextInput('nome_coluna'), 'variavel')
        .appendField(
          new Blockly.FieldDropdown([
            ['diferente de', '<>'],
            ['igual a', '='],
            ['maior que', '>'],
            ['menor que', '<'],
            ['maior ou igual a', '>='],
            ['menor ou igual a', '<='],
            ['parecida com (LIKE)', 'LIKE'],
            ['é', 'IS'],
            ['não é', 'IS NOT'],
            ['entre dois valores', 'BETWEEN'],
            ['em uma lista de valores', 'IN']
          ]),
          'op'
        )
        .appendField(new Blockly.FieldTextInput('valor'), 'value')
        .setCheck('select_where_op');
      this.setOutput(true, 'select_where_op');
      this.setColour(330);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select_orderby'] = {
    init: function () {
      this.appendValueInput('orderby')
        .appendField(new Blockly.FieldTextInput('nome_coluna'), 'variavel')
        .appendField(
          new Blockly.FieldDropdown([
            ['na ordem normal', ''],
            ['do menor para o maior', ' ASC'],
            ['do maior para o menor', ' DESC']
          ]),
          'op'
        )
        .setCheck('select_orderby');
      this.setOutput(true, 'select_orderby');
      this.setColour(45);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  function addSelect() {
    switch (Blockly.selected.getFieldValue('opcao')) {
      case 'Select':
        addVarSelect();
        break;
      case 'From':
        addFromSelect();
        break;
      case 'Join':
        addJoinSelect();
        break;
      case 'Where':
        addWhereSelect();
        break;
      case 'OrderBy':
        addOrderBySelect();
        break;
      default:
        break;
    }
  }

  function addVarSelect() {
    let bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('vars') != null) {
      bloco = bloco.getInputTargetBlock('vars');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }
    }

    bloco.getInput('vars').connection.connect(newBlock('select_var'));
  }

  function addFromSelect() {
    let bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('from') != null) {
      bloco = bloco.getInputTargetBlock('from');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }
    }

    bloco.getInput('from').connection.connect(newBlock('select_from'));
  }

  function addJoinSelect() {
    let bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('join') != null) {
      bloco = bloco.getInputTargetBlock('join');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }

      bloco.getInput('join').connection.connect(newBlock('select_join_op'));
    } else {
      bloco.getInput('join').connection.connect(newBlock('select_join'));
    }
  }

  function addWhereSelect() {
    let bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('conditions') != null) {
      bloco = bloco.getInputTargetBlock('conditions');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }

      bloco.getInput('conditions').connection.connect(newBlock('select_where_op'));
    } else {
      bloco.getInput('conditions').connection.connect(newBlock('select_where'));
    }
  }

  function addOrderBySelect() {
    let bloco;
    if (Blockly.selected.getInputTargetBlock('orderby') != null) {
      bloco = Blockly.selected.getInputTargetBlock('orderby');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }
    } else {
      bloco = Blockly.selected;
    }

    bloco.getInput('orderby').connection.connect(newBlock('select_orderby'));
  }
}
