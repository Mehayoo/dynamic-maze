import { Position } from './interfaces/position.interface'

export class HeroState {
	private position: Position
	private hasKey: boolean

	constructor(initialPosition: Position) {
		this.position = initialPosition
		this.hasKey = false
	}

	public getPosition(): Position {
		return this.position
	}
	public setPosition(newPosition: Position): void {
		this.position = newPosition
	}

	public getHasKey(): boolean {
		return this.hasKey
	}
	public setHasKey(hasKey: boolean): void {
		this.hasKey = hasKey
	}
}
