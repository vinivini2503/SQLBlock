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

  function isBlockInFlyout(block) {
    return !block || !block.workspace || block.workspace.isFlyout === true;
  }

  function newBlock(tipo) {
    // Usar o mesmo workspace do bloco selecionado, quando não estiver no flyout.
    let workspace = Blockly.selected && !isBlockInFlyout(Blockly.selected)
      ? Blockly.selected.workspace
      : Blockly.getMainWorkspace();

    if (!workspace) {
      return null;
    }

    const newblock = workspace.newBlock(tipo);
    newblock.initSvg();
    newblock.render();

    if (newblock.outputConnection) return newblock.outputConnection;
    return newblock.previousConnection;
  }

  Blockly.Blocks['start_sql'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Criar um novo banco de dados chamado')
        .appendField(new Blockly.FieldTextInput('nome_do_banco'), 'db_name');
      this.setNextStatement(true, 'create_table');
      this.setColour(120);
      this.setTooltip('Cria um banco de dados novo e começa a usar esse banco.');
      this.setHelpUrl('https://www.w3schools.com/sql/default.asp');
    }
  };

  Blockly.Blocks['create_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Criar tabela nova')
        .appendField(
          new Blockly.FieldDropdown([
            ['sempre criar', ''],
            ['criar só se não existir ainda', ' IF NOT EXISTS']
          ]),
          'option'
        )
        .appendField('com o nome')
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
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

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
    const connection = newBlock(tipo[0]);
    if (!connection) return;

    bloco.connect(connection);
  }

  function addPK() {
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

    if (
      Blockly.selected.getChildren(true).length === 0 ||
      Blockly.selected.getChildren(true)[0].type !== 'table_var'
    ) {
      Blockly.selected.getInput('table_var').connection.connect(newBlock('table_var'));
    }

    const block = Blockly.selected.getChildren(true)[0].lastConnectionInStack();
    const connection = newBlock('table_var_pk');
    if (!connection) return;

    block.connect(connection);
  }

  function addFk() {
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

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
    const connection = newBlock('table_var_fk');
    if (!connection) return;

    bloco.connect(connection);
  }

  function up() {
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

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
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

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

  // Blocos de INSERT

  // Bloco principal: representa o comando INSERT inteiro
  Blockly.Blocks['insert_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Colocar um novo registro na tabela')
        .appendField(new Blockly.FieldTextInput('nome_tabela', validator), 'table_name');
      this.appendStatementInput('pairs')
        .appendField('Colunas e valores desta nova linha:')
        .setCheck('insert_pair');
      this.setPreviousStatement(true, commonStatements);
      this.setNextStatement(true, commonStatements);
      this.setInputsInline(false);
      this.setColour(270);
      this.setTooltip('Monta um comando INSERT, adicionando colunas e valores para uma nova linha.');
      this.setHelpUrl('');
    }
  };

  // Cada bloco representa um par coluna/valor do INSERT
  Blockly.Blocks['insert_pair'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Na coluna')
        .appendField(new Blockly.FieldTextInput('nome_coluna', validator), 'column_name')
        .appendField('colocar')
        .appendField(
          new Blockly.FieldDropdown([
            ['um valor que eu digito', 'typed'],
            ['nenhum valor (NULL)', 'NULL'],
            ['data e hora de agora', 'CURRENT_TIMESTAMP'],
            ['valor padrão do banco (DEFAULT)', 'DEFAULT']
          ]),
          'value_type'
        )
        .appendField(new Blockly.FieldTextInput('valor'), 'value_text');
      this.setPreviousStatement(true, 'insert_pair');
      this.setNextStatement(true, 'insert_pair');
      this.setColour(300);
      this.setTooltip('Liga uma coluna a um valor para o comando INSERT.');
      this.setHelpUrl('');
    }
  };


  // Blocos de UPDATE / ALTER / DELETE / DROP

  Blockly.Blocks['update_table'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Mudar dados na tabela')
        .appendField(new Blockly.FieldTextInput('nome_tabela', validator), 'table_name');
      this.appendStatementInput('update_var').setCheck('update_var');
      this.appendDummyInput()
        .appendField('Só nas linhas onde a coluna')
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
        .appendField('Coluna que vai mudar')
        .appendField(new Blockly.FieldTextInput('nome_coluna', validator), 'var_name');
      this.appendDummyInput()
        .appendField('Novo valor dessa coluna')
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
        .appendField('Apagar linha da tabela')
        .appendField(new Blockly.FieldTextInput('nome_tabela'), 'table_name')
        .appendField('quando a coluna')
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
        .appendField('Apagar a tabela inteira (com todos os dados)')
        .appendField(
          new Blockly.FieldDropdown([
            ['apagar direto', ''],
            ['apenas se a tabela existir', ' IF EXISTS']
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

  // Blocos de SELECT

  // Bloco principal de consulta, em linguagem mais didática
  Blockly.Blocks['select'] = {
    init: function () {
      this.appendValueInput('vars')
        .setCheck('select_var')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Quais colunas você quer ver?')
        .appendField(
          new Blockly.FieldDropdown([
            ['aceitar linhas repetidas', ''],
            ['sem repetir linhas (DISTINCT)', ' DISTINCT']
          ]),
          'option'
        );
      this.appendValueInput('from')
        .setCheck('select_from')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('De qual tabela?');
      this.appendValueInput('conditions')
        .setCheck('select_where')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Filtrar resultados: só onde');
      this.appendValueInput('orderby')
        .setCheck('select_orderby')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Organizar o resultado (ORDER BY)');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('Adicionar mais partes na consulta')
        .appendField(
          new Blockly.FieldDropdown([
            ['Mais colunas para mostrar', 'Select'],
            ['Mais condições (WHERE)', 'Where'],
            ['Mais ordenações (ORDER BY)', 'OrderBy']
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
        .appendField('Quais colunas você quer ver?')
        .appendField(
          new Blockly.FieldDropdown([
            ['aceitar linhas repetidas', ''],
            ['sem repetir linhas (DISTINCT)', ' DISTINCT']
          ]),
          'option'
        );
      this.appendValueInput('from')
        .setCheck('select_from')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('De qual tabela?');
      this.appendValueInput('conditions')
        .setCheck('select_where')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Filtrar resultados: só onde');
      this.appendValueInput('orderby')
        .setCheck('select_orderby')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Organizar o resultado (ORDER BY)');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('Adicionar mais partes na consulta')
        .appendField(
          new Blockly.FieldDropdown([
            ['Mais colunas para mostrar', 'Select'],
            ['Mais condições (WHERE)', 'Where'],
            ['Mais ordenações (ORDER BY)', 'OrderBy']
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
        .appendField('Quais colunas você quer ver?')
        .appendField(
          new Blockly.FieldDropdown([
            ['aceitar linhas repetidas', ''],
            ['sem repetir linhas (DISTINCT)', ' DISTINCT']
          ]),
          'option'
        );
      this.appendValueInput('from')
        .setCheck('select_from')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('De qual tabela?');
      this.appendValueInput('conditions')
        .setCheck('select_where')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Filtrar resultados: só onde');
      this.appendValueInput('orderby')
        .setCheck('select_orderby')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Organizar o resultado (ORDER BY)');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('Adicionar mais partes na consulta')
        .appendField(
          new Blockly.FieldDropdown([
            ['Mais colunas para mostrar', 'Select'],
            ['Mais condições (WHERE)', 'Where'],
            ['Mais ordenações (ORDER BY)', 'OrderBy']
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
        .appendField('Quais colunas você quer ver?')
        .appendField(
          new Blockly.FieldDropdown([
            ['aceitar linhas repetidas', ''],
            ['sem repetir linhas (DISTINCT)', ' DISTINCT']
          ]),
          'option'
        );
      this.appendValueInput('from')
        .setCheck('select_from')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('De qual tabela?');
      this.appendValueInput('conditions')
        .setCheck('select_where')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Filtrar resultados: só onde');
      this.appendValueInput('orderby')
        .setCheck('select_orderby')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Organizar o resultado (ORDER BY)');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField('Adicionar mais partes na consulta')
        .appendField(
          new Blockly.FieldDropdown([
            ['Mais colunas para mostrar', 'Select'],
            ['Mais condições (WHERE)', 'Where'],
            ['Mais ordenações (ORDER BY)', 'OrderBy']
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
        .appendField('Juntar com a tabela')
        .appendField(new Blockly.FieldTextInput('tabela_secundaria'), 'table_name')
        .appendField('quando')
        .appendField(new Blockly.FieldTextInput('tabela_principal.coluna'), 'table_var')
        .appendField('=')
        .appendField(new Blockly.FieldTextInput('tabela_secundaria.coluna'), 'table_join_var')
        .setCheck('select_join_op');
      this.setOutput(true, 'select_join');
      this.setColour(235);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks['select_where'] = {
    init: function () {
      this.appendValueInput('conditions')
        .appendField('Coluna para comparar')
        .appendField(new Blockly.FieldTextInput('nome_coluna'), 'variavel')
        .appendField(
          new Blockly.FieldDropdown([
            ['é diferente de', '<>'],
            ['é igual a', '='],
            ['é maior que', '>'],
            ['é menor que', '<'],
            ['é maior ou igual a', '>='],
            ['é menor ou igual a', '<='],
            ['parecida com o texto (LIKE)', 'LIKE'],
            ['é (IS)', 'IS'],
            ['não é (IS NOT)', 'IS NOT'],
            ['entre dois valores (BETWEEN)', 'BETWEEN'],
            ['em uma lista de valores (IN)', 'IN']
          ]),
          'op'
        )
        .appendField('e comparar com o valor')
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
        .appendField('mais uma condição na coluna')
        .appendField(new Blockly.FieldTextInput('nome_coluna'), 'variavel')
        .appendField(
          new Blockly.FieldDropdown([
            ['é diferente de', '<>'],
            ['é igual a', '='],
            ['é maior que', '>'],
            ['é menor que', '<'],
            ['é maior ou igual a', '>='],
            ['é menor ou igual a', '<='],
            ['parecida com o texto (LIKE)', 'LIKE'],
            ['é (IS)', 'IS'],
            ['não é (IS NOT)', 'IS NOT'],
            ['entre dois valores (BETWEEN)', 'BETWEEN'],
            ['em uma lista de valores (IN)', 'IN']
          ]),
          'op'
        )
        .appendField('comparando com o valor')
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
        .appendField('Organizar usando a coluna')
        .appendField(new Blockly.FieldTextInput('nome_coluna'), 'variavel')
        .appendField(
          new Blockly.FieldDropdown([
            ['da forma que vier (padrão)', ''],
            ['do menor para o maior (ASC)', ' ASC'],
            ['do maior para o menor (DESC)', ' DESC']
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
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

    switch (Blockly.selected.getFieldValue('opcao')) {
      case 'Select':
        addVarSelect();
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
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

    let bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('vars') != null) {
      bloco = bloco.getInputTargetBlock('vars');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }
    }
    const connection = newBlock('select_var');
    if (!connection) return;

    bloco.getInput('vars').connection.connect(connection);
  }

  function addFromSelect() {
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

    let bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('from') != null) {
      bloco = bloco.getInputTargetBlock('from');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }
    }
    const connection = newBlock('select_from');
    if (!connection) return;

    bloco.getInput('from').connection.connect(connection);
  }

  function addJoinSelect() {
    let bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('join') != null) {
      bloco = bloco.getInputTargetBlock('join');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }
      const connectionOp = newBlock('select_join_op');
      if (!connectionOp) return;

      bloco.getInput('join').connection.connect(connectionOp);
    } else {
      const connectionJoin = newBlock('select_join');
      if (!connectionJoin) return;

      bloco.getInput('join').connection.connect(connectionJoin);
    }
  }

  function addWhereSelect() {
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

    let bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('conditions') != null) {
      bloco = bloco.getInputTargetBlock('conditions');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }
      const connectionOp = newBlock('select_where_op');
      if (!connectionOp) return;

      bloco.getInput('conditions').connection.connect(connectionOp);
    } else {
      const connection = newBlock('select_where');
      if (!connection) return;

      bloco.getInput('conditions').connection.connect(connection);
    }
  }

  function addOrderBySelect() {
    if (!Blockly.selected || isBlockInFlyout(Blockly.selected)) {
      return;
    }

    let bloco;
    if (Blockly.selected.getInputTargetBlock('orderby') != null) {
      bloco = Blockly.selected.getInputTargetBlock('orderby');

      while (bloco.getChildren(true)[0]) {
        bloco = bloco.getChildren(true)[0];
      }
    } else {
      bloco = Blockly.selected;
    }

    const connection = newBlock('select_orderby');
    if (!connection) return;

    bloco.getInput('orderby').connection.connect(connection);
  }
}
