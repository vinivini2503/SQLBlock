import * as Blockly from 'blockly/core';

/**
 * Gerador SQL customizado para os blocos
 */
export class SqlGenerator extends Blockly.Generator {
  constructor() {
    super('SQL');
    this.ORDER_ATOMIC = 0;
    this.ORDER_NONE = 99;
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
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.type !== 'variables_get') {
        const blockCode = this.blockToCode(block);
        if (blockCode) {
          code.push(blockCode);
        }
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

// Criar instância do gerador
export const sqlGenerator = new SqlGenerator();

