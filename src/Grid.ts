import { Observable } from './Observable'
import { Cell } from './Cell'
import { IGridBase } from './interfaces/grid-base.interface'
import { IMessagePayload } from './interfaces/message-payload.interface'
import { IMoveAttemptPayload } from './interfaces/move-attempt-payload.interface'
import { IMoveAllowedPayload } from './interfaces/move-allowed-payload.interface'
import { Events, Messages, Positions } from './constants/constants'
import { getRandomIntExcluding } from './utils/utils'

export class Grid extends Observable<Events> implements IGridBase {
	public gridDiv: HTMLDivElement | null
	private readonly grid: Cell[][] = []
	private readonly outerGrid: Record<Positions, Cell[]> = {
		top: [],
		bottom: [],
		left: [],
		right: [],
	}
	private readonly innerGrid: Cell[] = []

	private readonly deltas: Record<Positions, number[]> = {
		[Positions.TOP]: [-1, 0],
		[Positions.BOTTOM]: [1, 0],
		[Positions.LEFT]: [0, -1],
		[Positions.RIGHT]: [0, 1],
	}
	private readonly borderStyles = (
		currentStepStyle: CSSStyleDeclaration
	): Record<Positions, string> => {
		const {
			borderTopStyle,
			borderBottomStyle,
			borderLeftStyle,
			borderRightStyle,
		} = currentStepStyle

		return {
			[Positions.TOP]: borderTopStyle,
			[Positions.BOTTOM]: borderBottomStyle,
			[Positions.LEFT]: borderLeftStyle,
			[Positions.RIGHT]: borderRightStyle,
		}
	}

	private readonly max: number = this.size - 2
	private readonly min: number = 1
	public entrance: Cell

	constructor(
		private readonly size: number,
		private readonly entrancePos: Positions,
		private readonly exitPos: Positions
	) {
		super()
	}

	public init(): void {
		this.createGridCanvas(this.size)

		this.entrance = this.placeAccessPoint({
			max: this.max,
			min: this.min,
			pos: this.entrancePos,
			classes: ['entrance'],
		})
		this.placeAccessPoint({
			max: this.max,
			min: this.min,
			pos: this.exitPos,
			classes: ['door', 'exit'],
		})
		this.placeGridArtefacts()
	}

	public reset(): void {
		this.grid.length = 0
		Object.keys(this.outerGrid).forEach((key: string) => {
			this.outerGrid[key as keyof typeof this.outerGrid].length = 0
		})
		this.innerGrid.length = 0
		this.entrance = undefined
	}

	public getCellRandomNeighbor(cell: Cell): Cell {
		const { i, j } = cell || {}

		const top: Cell = i - 1 > 0 && this.grid[i - 1][j]

		const right: Cell = j + 1 <= this.size - 1 && this.grid[i][j + 1]

		const bottom: Cell = i + 1 <= this.size - 1 && this.grid[i + 1][j]

		const left: Cell = j - 1 > 0 && this.grid[i][j - 1]

		const neighbors: Cell[] = [top, right, bottom, left].filter(
			(neighbour: Cell) =>
				neighbour &&
				!neighbour.visited &&
				!neighbour.element.className.match(/wall/)
		)

		if (neighbors.length > 0) {
			const r: number = getRandomIntExcluding(neighbors.length)

			return neighbors[r]
		}
	}

	public validateMove(payload: IMoveAttemptPayload): void {
		const { direction, position } = payload
		const currentCell: Cell = this.grid[position.x][position.y]
		const currentStepStyle: CSSStyleDeclaration = getComputedStyle(
			currentCell.element
		)

		if (this.borderStyles(currentStepStyle)[direction] === 'solid') {
			return this.notifyObservers({
				event: Events.WALL_COLLISION,
				payload: { msg: Messages.WRONG_WAY },
			})
		}

		const [deltaX, deltaY] = this.deltas[direction]
		const newPosX: number = position.x + deltaX
		const newPosY: number = position.y + deltaY

		this.handleCellContent(newPosX, newPosY)
	}

	private handleCellContent(x: number, y: number): void {
		const next: Cell = this.grid[x][y]

		const childClassName: string = next.element.children.length
			? next.element.children[0].className
			: ''

		let message = ''

		switch (true) {
			case childClassName.includes('nubbin'):
				message = Messages.HERO_TAKES_TREASURE
				this.notifyObservers({ event: Events.COLLECT_TREASURE })
				break
			case childClassName.includes('key'):
				message = Messages.HERO_TAKES_KEY
				this.notifyObservers({ event: Events.COLLECT_KEY })
				break
			case next.element.className.includes('exit'):
				return this.notifyObservers({
					event: Events.EXIT_ATTEMPT,
					payload: { newPosition: { x, y } } as IMoveAllowedPayload,
				})
		}

		childClassName !== '' &&
			!childClassName.includes('hero') &&
			next.element.removeChild(next.element.children[0])

		this.notifyObservers({
			event: Events.EVENT_MESSAGE,
			payload: { msg: message } as IMessagePayload,
		})
		this.notifyObservers({
			event: Events.MOVE_ALLOWED,
			payload: { newPosition: { x, y } } as IMoveAllowedPayload,
		})
	}

	private createGridCanvas(size: number): void {
		const gridDiv: HTMLDivElement = document.createElement('div')

		for (let rowIndex = 0; rowIndex < size; rowIndex++) {
			const rowContainer: HTMLDivElement = document.createElement('div')
			rowContainer.setAttribute('class', 'row')
			const row: Cell[] = []

			for (let columnIndex = 0; columnIndex < size; columnIndex++) {
				const element: HTMLDivElement = document.createElement('div')
				element.setAttribute('class', 'column')
				rowContainer.appendChild(element)

				const cell: Cell = new Cell(rowIndex, columnIndex, element)

				if (
					rowIndex === 0 ||
					rowIndex === size - 1 ||
					columnIndex === 0 ||
					columnIndex === size - 1
				) {
					element.classList.add('wall')
				}

				if (rowIndex !== 0 && rowIndex !== size - 1) {
					if (columnIndex === 0) {
						this.outerGrid.left.push(cell)
					}

					if (columnIndex === size - 1) {
						this.outerGrid.right.push(cell)
					}
				}

				if (columnIndex !== 0 && columnIndex !== size - 1) {
					if (rowIndex === 0) {
						this.outerGrid.top.push(cell)
					}

					if (rowIndex === size - 1) {
						this.outerGrid.bottom.push(cell)
					}
				}

				row.push(cell)
			}

			this.grid.push(row)

			if (rowIndex !== 0 && rowIndex !== size - 1) {
				const filteredRow: Cell[] = row.filter(
					(_, index) => index !== 0 && index !== this.size - 1
				)
				this.innerGrid.push(...filteredRow)
			}

			gridDiv.appendChild(rowContainer)
		}
		this.gridDiv = gridDiv
	}

	private placeAccessPoint(params: {
		max: number
		min: number
		pos: Positions
		classes: string[]
	}): Cell {
		const { max, min, pos, classes } = params || {}

		const gridSection: Cell[] = this.outerGrid[pos]

		const index: number = getRandomIntExcluding(max, min)
		gridSection[index - 1].element.classList.remove('wall')
		classes.forEach((className) =>
			gridSection[index - 1].element.classList.add(className)
		)

		return gridSection[index - 1]
	}

	private placeGridArtefacts(): void {
		const gridCenter: number = Math.round((this.size - 1) / 2)

		const offsetY: number = Math.max(0, Math.floor(gridCenter / 2) - 1)
		const minY: number = Math.max(1, gridCenter - offsetY)
		const maxY: number = Math.min(this.size, gridCenter + offsetY)

		const yPos: number = getRandomIntExcluding(maxY, minY)
		const xPos: number = getRandomIntExcluding(this.max, this.min)

		const keyDiv: HTMLDivElement = document.createElement('div')
		keyDiv.setAttribute('class', 'key')

		let keyCellIndex: number
		this.innerGrid.forEach((item, index) => {
			if (item.i === yPos && item.j === xPos) {
				item.element.appendChild(keyDiv)
				keyCellIndex = index
			}
		})

		const randomIndexes: Set<number> = new Set()
		while (
			randomIndexes.size !==
			Math.floor(this.innerGrid.length / this.size / 2) // 1.7 previously
		) {
			const rand: number = Math.floor(
				Math.random() * this.innerGrid.length
			)
			rand !== keyCellIndex && randomIndexes.add(rand)
		}

		randomIndexes.forEach((index) => {
			const nubbinDiv = document.createElement('div')
			nubbinDiv.setAttribute('class', 'nubbin')
			this.innerGrid[index].element.appendChild(nubbinDiv)
		})
	}
}
