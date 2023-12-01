export class Cell {
	readonly i: number
	readonly j: number
	readonly element: HTMLElement
	private _visited: boolean = false

	get visited(): boolean {
		return this._visited
	}

	constructor(i: number, j: number, element: HTMLElement) {
		this.i = i
		this.j = j
		this.element = element
	}

	public visit(): void {
		this._visited = true
	}
}
