import { registerCreateBlocks } from './blocks/createBlocks';
import { registerSelectBlocks } from './blocks/selectBlocks';
import { registerInsertBlocks } from './blocks/insertBlocks';
import { registerUpdateBlocks } from './blocks/updateBlocks';
import { registerDeleteBlocks } from './blocks/deleteBlocks';

export function registerAllBlocks() {
  registerCreateBlocks();
  registerSelectBlocks();
  registerInsertBlocks();
  registerUpdateBlocks();
  registerDeleteBlocks();
}
