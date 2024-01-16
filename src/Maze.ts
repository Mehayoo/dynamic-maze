import { Cell } from './Cell'
import { IGridBase } from './interfaces/grid-base.interface'

export class Maze {
	// Empty array that will be used to keep track of visited cells during the maze generation
	private stack: Cell[] = []

	// Constructing the maze with a reference to the grid and a starting cell (current)
	constructor(private grid: IGridBase, private current: Cell) {}

	public init(): void {
		this.drawMaze()
	}

	public reset(): void {
		this.stack.length = 0
	}

	private drawMaze(): void {
		// Mark current cell as visited by calling its visit() method on it
		this.current.visit()
		// Find a random unvisited neighbor (top, right, bottom, left)
		// If a current cell has no unvisited neighbors, it means the algorithm has reached a dead-end
		// In this case, the algorithm backtracks by popping the last cell from the stack (if the stack is not empty) and makes it the new current cell
		const next: Cell = this.grid.getCellRandomNeighbor(this.current)
		if (next) {
			next.visit()
			// If a valid neighbor is found, mark it as visited, and push a reference to the current cell onto the stack to keep track of the path being explored
			this.stack.push(this.current)
			// Remove the walls between the current cell and the chosen neighbor cell to create a passage
			this.removeWalls(this.current, next)
			// Set the current cell to be the chosen neighbor cell
			this.current = next
		} else if (this.stack.length > 0) {
			this.current = this.stack.pop()
		}
		while (this.stack.length > 0) {
			// Continue to explore and build the maze by calling itself recursively until there are no more unvisited cells left and the stack is empty
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
