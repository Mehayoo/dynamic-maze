import { Cell } from '../Cell'

export interface IGridBase {
	getCellRandomNeighbor(cell: Cell): Cell
}
