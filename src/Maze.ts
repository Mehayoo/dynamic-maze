import { Cell } from './Cell'
import { IGridBase } from './interfaces/grid-base.interface'

export class Maze {
	private stack: Cell[] = []

	constructor(private grid: IGridBase, private current: Cell) {}

	public init(): void {
		this.drawMaze()
	}

	public reset(): void {
		this.stack.length = 0
	}

	private drawMaze(): void {
		this.current.visit()
		const next: Cell = this.grid.getCellRandomNeighbor(this.current)
		if (next) {
			next.visit()
			this.stack.push(this.current)
			this.removeWalls(this.current, next)
			this.current = next
		} else if (this.stack.length > 0) {
			this.current = this.stack.pop()
		}
		while (this.stack.length > 0) {
			this.drawMaze()
		}
	}

	private removeWalls(a: Cell, b: Cell): void {
		const x: number = a.j - b.j
		if (x === 1) {
			a.element.style.borderLeftStyle = 'none'
			b.element.style.borderRightStyle = 'none'
		} else if (x === -1) {
			a.element.style.borderRightStyle = 'none'
			b.element.style.borderLeftStyle = 'none'
		}

		const y: number = a.i - b.i
		if (y === 1) {
			a.element.style.borderTopStyle = 'none'
			b.element.style.borderBottomStyle = 'none'
		} else if (y === -1) {
			a.element.style.borderBottomStyle = 'none'
			b.element.style.borderTopStyle = 'none'
		}
	}
}
