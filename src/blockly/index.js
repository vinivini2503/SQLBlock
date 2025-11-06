import { registerCreateBlocks } from './blocks/createBlocks'
import { registerDeleteBlocks } from './blocks/deleteBlocks'
import { registerInsertBlocks } from './blocks/insertBlocks'
import { registerSelectBlocks } from './blocks/selectBlocks'
import { registerUpdateBlocks } from './blocks/updateBlocks'

export function registerAllBlocks() {
  registerCreateBlocks()
  registerDeleteBlocks()
  registerInsertBlocks()
  registerSelectBlocks()
  registerUpdateBlocks()
}
