import * as Blockly from 'blockly/core';

export class SqlGenerator extends Blockly.Generator {
  constructor() {
    super('SQL');
    this.ORDER_ATOMIC = 0;
    this.ORDER_NONE = 99;
  }

  /**
   * Gera código para um bloco específico usando o mapa forBlock_.
   * Se não existir gerador para o tipo do bloco, retorna string vazia
   * em vez de lançar erro.
   */

  blockToCode(block) {
    if (!block) {
      return '';
    }

    const func = this.forBlock_ && this.forBlock_[block.type];
    if (!func) {
      // Sem gerador definido para este tipo de bloco
      return '';
    }

    return func(block, this) || '';
  }

  /**
   * Gera código SQL a partir de um workspace
   */
  workspaceToCode(workspace) {
    if (!workspace) {
      return '';
    }

    const code = [];
    const blocks = workspace.getTopBlocks(true);

    for (const topBlock of blocks) {
      let block = topBlock;
      while (block) {
        if (block.type !== 'variables_get') {
          const blockCode = this.blockToCode(block);
          if (blockCode) {
            code.push(blockCode);
          }
        }
        block = block.getNextBlock();
      }
    }

    return code.join('\n');
  }

  /**
   * Converte um statement para código
   */
  statementToCode(block, name) {
    const targetBlock = block.getInputTargetBlock(name);
    if (!targetBlock) {
      return '';
    }

    let code = '';
    let nextBlock = targetBlock;

    while (nextBlock) {
      const blockCode = this.blockToCode(nextBlock);
      if (blockCode) {
        code += blockCode;
      }
      nextBlock = nextBlock.getNextBlock();
    }

    return code;
  }

  /**
   * Converte um value para código
   */
  valueToCode(block, name, order) {
    const targetBlock = block.getInputTargetBlock(name);
    if (!targetBlock) {
      return ['', order];
    }

    const code = this.blockToCode(targetBlock);
    return [code, order];
  }
}

// Criar instância padrão do gerador
export const sqlGenerator = new SqlGenerator();

/**
 * Definições de geração de código para cada tipo de bloco.
 * Registramos no prototype e também na instância padrão para garantir compatibilidade.
 */
SqlGenerator.prototype.forBlock_ = sqlGenerator.forBlock_ = {
  start_sql(block, generator) {
    const dbName = block.getFieldValue('db_name') || '';
    if (!dbName) {
      return '';
    }
    return `CREATE DATABASE IF NOT EXISTS ${dbName};\nUSE ${dbName};\n`;
  },

  create_table(block, generator) {
    const option = block.getFieldValue('option') || '';
    const tableName = block.getFieldValue('table_name') || '';

    const cols = [];
    const fks = [];
    const pks = [];

    let colBlock = block.getInputTargetBlock('table_var');
    while (colBlock) {
      if (colBlock.type === 'table_var') {
        const name = colBlock.getFieldValue('var_name') || '';
        const type = colBlock.getFieldValue('type') || '';
        const attr = colBlock.getFieldValue('opcao') || '';
        cols.push(`  ${name} ${type}${attr}`.trim());
      } else if (colBlock.type === 'table_var_pk') {
        const name = colBlock.getFieldValue('var_name') || '';
        if (name) pks.push(name);
      } else if (colBlock.type === 'table_var_fk') {
        const col = colBlock.getFieldValue('var_name') || '';
        const refTable = colBlock.getFieldValue('table_name') || '';
        const refCol = colBlock.getFieldValue('var_name_reference') || '';
        if (col && refTable && refCol) {
          fks.push(`  FOREIGN KEY (${col}) REFERENCES ${refTable}(${refCol})`);
        }
      }
      colBlock = colBlock.getNextBlock();
    }

    if (pks.length) {
      cols.push(`  PRIMARY KEY (${pks.join(', ')})`);
    }
    cols.push(...fks);

    const body = cols.join(',\n');
    const sql = `CREATE TABLE${option} ${tableName} (\n${body}\n);`;
    return sql + '\n';
  },

  insert_table(block, generator) {
    const tableName = block.getFieldValue('table_name') || '';

    // Percorre a lista de pares coluna/valor
    const columns = [];
    const values = [];
    let pairBlock = block.getInputTargetBlock('pairs');

    while (pairBlock) {
      if (pairBlock.type === 'insert_pair') {
        const col = pairBlock.getFieldValue('column_name') || '';
        const type = pairBlock.getFieldValue('value_type') || 'typed';
        const text = pairBlock.getFieldValue('value_text') || '';

        if (col) {
          columns.push(col);

          if (type === 'typed') {
            values.push(`'${text}'`);
          } else if (type === 'NULL') {
            values.push('NULL');
          } else if (type === 'CURRENT_TIMESTAMP') {
            values.push('CURRENT_TIMESTAMP');
          } else if (type === 'DEFAULT') {
            values.push('DEFAULT');
          }
        }
      }

      pairBlock = pairBlock.getNextBlock();
    }

    if (!tableName || !columns.length) {
      // Gera comentário para ajudar o aluno a entender o que falta
      return '-- Complete o bloco INSERT: informe o nome da tabela e pelo menos uma coluna/valor.\n';
    }

    const columnsSql = columns.join(', ');
    const valuesSql = values.join(', ');

    return `INSERT INTO ${tableName} (${columnsSql})\nVALUES (${valuesSql});\n`;
  },

  update_table(block, generator) {
    const tableName = block.getFieldValue('table_name') || '';

    // SET: percorrer cadeia de update_var
    const sets = [];
    let setBlock = block.getInputTargetBlock('update_var');
    while (setBlock) {
      if (setBlock.type === 'update_var') {
        const col = setBlock.getFieldValue('var_name') || '';
        const val = setBlock.getFieldValue('value') || '';
        if (col) sets.push(`${col} = '${val}'`);
      }
      setBlock = setBlock.getNextBlock();
    }

    const setSql = sets.length ? sets.join(', ') : '-- sem_colunas_para_atualizar';

    // WHERE simples
    const whereCol = block.getFieldValue('column_name') || '';
    const whereOp = block.getFieldValue('type') || '=';
    const whereVal = block.getFieldValue('value') || '';
    const whereSql = whereCol ? ` WHERE ${whereCol} ${whereOp} '${whereVal}'` : '';

    return `UPDATE ${tableName}\nSET ${setSql}${whereSql};\n`;
  },

  delete_from_table(block, generator) {
    const tableName = block.getFieldValue('table_name') || '';
    const col = block.getFieldValue('var_name') || '';
    const op = block.getFieldValue('type') || '=';
    const val = block.getFieldValue('value') || '';

    const whereSql = col ? ` WHERE ${col} ${op} '${val}'` : '';
    return `DELETE FROM ${tableName}${whereSql};\n`;
  },

  drop_table(block, generator) {
    const option = block.getFieldValue('option') || '';
    const name = block.getFieldValue('name_table') || '';
    return `DROP TABLE${option} ${name};\n`;
  },

  select(block, generator) {
    // Colunas
    const distinct = block.getFieldValue('option') || '';
    const [varsCode] = generator.valueToCode(block, 'vars', generator.ORDER_NONE);
    const cols = varsCode || '*';

    // FROM
    const [fromCode] = generator.valueToCode(block, 'from', generator.ORDER_NONE);
    const fromSql = fromCode ? `\nFROM ${fromCode.trim()}` : '';

    // WHERE
    const [whereCode] = generator.valueToCode(block, 'conditions', generator.ORDER_NONE);
    const whereSql = whereCode ? `\nWHERE ${whereCode.trim()}` : '';

    // ORDER BY
    const [orderCode] = generator.valueToCode(block, 'orderby', generator.ORDER_NONE);
    const orderSql = orderCode ? `\nORDER BY ${orderCode.trim()}` : '';

    return `SELECT${distinct} ${cols}${fromSql}${whereSql}${orderSql};\n`;
  },

  // Bloco SELECT simplificado: colunas + FROM
  select2(block, generator) {
    const distinct = block.getFieldValue('option') || '';
    const [varsCode] = generator.valueToCode(block, 'vars', generator.ORDER_NONE);
    const cols = varsCode || '*';

    const [fromCode] = generator.valueToCode(block, 'from', generator.ORDER_NONE);
    const fromSql = fromCode ? `\nFROM ${fromCode.trim()}` : '';

    return `SELECT${distinct} ${cols}${fromSql};\n`;
  },

  // Variações adicionais do bloco principal de SELECT (mesma lógica do select)
  select3(block, generator) {
    const distinct = block.getFieldValue('option') || '';
    const [varsCode] = generator.valueToCode(block, 'vars', generator.ORDER_NONE);
    const cols = varsCode || '*';

    const [fromCode] = generator.valueToCode(block, 'from', generator.ORDER_NONE);
    const fromSql = fromCode ? `\nFROM ${fromCode.trim()}` : '';

    const [whereCode] = generator.valueToCode(block, 'conditions', generator.ORDER_NONE);
    const whereSql = whereCode ? `\nWHERE ${whereCode.trim()}` : '';

    const [orderCode] = generator.valueToCode(block, 'orderby', generator.ORDER_NONE);
    const orderSql = orderCode ? `\nORDER BY ${orderCode.trim()}` : '';

    return `SELECT${distinct} ${cols}${fromSql}${whereSql}${orderSql};\n`;
  },

  select4(block, generator) {
    const distinct = block.getFieldValue('option') || '';
    const [varsCode] = generator.valueToCode(block, 'vars', generator.ORDER_NONE);
    const cols = varsCode || '*';

    const [fromCode] = generator.valueToCode(block, 'from', generator.ORDER_NONE);
    const fromSql = fromCode ? `\nFROM ${fromCode.trim()}` : '';

    const [whereCode] = generator.valueToCode(block, 'conditions', generator.ORDER_NONE);
    const whereSql = whereCode ? `\nWHERE ${whereCode.trim()}` : '';

    const [orderCode] = generator.valueToCode(block, 'orderby', generator.ORDER_NONE);
    const orderSql = orderCode ? `\nORDER BY ${orderCode.trim()}` : '';

    return `SELECT${distinct} ${cols}${fromSql}${whereSql}${orderSql};\n`;
  },

  // Blocos auxiliares de SELECT
  select_var(block, generator) {
    const name = block.getFieldValue('var_input') || '*';
    const [rest] = generator.valueToCode(block, 'vars', generator.ORDER_NONE);
    if (rest) {
      return `${name}, ${rest}`;
    }
    return name;
  },

  select_from(block, generator) {
    const table = block.getFieldValue('table_name') || '';
    const [rest] = generator.valueToCode(block, 'from', generator.ORDER_NONE);
    if (rest) {
      return `${table}, ${rest}`;
    }
    return table;
  },

  select_where(block, generator) {
    const col = block.getFieldValue('variavel') || '';
    const op = block.getFieldValue('op') || '=';
    const val = block.getFieldValue('value') || '';
    const [rest] = generator.valueToCode(block, 'conditions', generator.ORDER_NONE);
    const base = `${col} ${op} '${val}'`;
    if (rest) {
      return `${base} ${rest}`;
    }
    return base;
  },

  select_where_op(block, generator) {
    const action = block.getFieldValue('action') || 'AND';
    const col = block.getFieldValue('variavel') || '';
    const op = block.getFieldValue('op') || '=';
    const val = block.getFieldValue('value') || '';
    const [rest] = generator.valueToCode(block, 'conditions', generator.ORDER_NONE);
    const base = `${action} ${col} ${op} '${val}'`;
    if (rest) {
      return `${base} ${rest}`;
    }
    return base;
  },

  select_orderby(block, generator) {
    const col = block.getFieldValue('variavel') || '';
    const dir = block.getFieldValue('op') || '';
    const [rest] = generator.valueToCode(block, 'orderby', generator.ORDER_NONE);
    const base = `${col}${dir}`;
    if (rest) {
      return `${base}, ${rest}`;
    }
    return base;
  }
};

