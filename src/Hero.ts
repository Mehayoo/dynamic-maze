import { Observable } from './Observable'
import { HeroState } from './HeroState'
import { Cell } from './Cell'
import { Position } from './interfaces/position.interface'
import { Events, Positions } from './constants/constants'

export class Hero extends Observable<Events> {
	private heroDiv: HTMLElement
	public readonly state: HeroState

	private cellSize: number
	private heroSize: number
	private offset: number

	private readonly keyPressHandler: () => void

	constructor(private readonly entrance: Cell) {
		super()

		const { i, j } = entrance
		this.state = new HeroState({ x: i, y: j })

		this.placeHeroAtStart()
		this.calculateHeroDimensions()

		this.keyPressHandler = this.mazeKeyPressHandler.bind(this)
		document.addEventListener('keydown', this.keyPressHandler)
	}

	public reset(): void {
		document.removeEventListener('keydown', this.keyPressHandler)
	}

	public updatePosition(position: Position): void {
		this.state.setPosition(position)
		this.updateVisualPosition()
	}

	public collectKey(): void {
		this.state.setHasKey(true)
	}

	private placeHeroAtStart(): void {
		this.heroDiv = document.createElement('div')
		this.heroDiv.style.position = 'absolute'
		this.heroDiv.classList.add('hero')
		this.entrance.element.appendChild(this.heroDiv)
	}

	private calculateHeroDimensions(): void {
		this.cellSize = this.entrance.element.offsetWidth
		this.heroSize = this.heroDiv.offsetWidth
		this.offset = (this.cellSize - this.heroSize) / 2
	}

	private updateVisualPosition(): void {
		this.heroDiv.style.top =
			this.state.getPosition().x * this.cellSize + this.offset + 'px'
		this.heroDiv.style.left =
			this.state.getPosition().y * this.cellSize + this.offset + 'px'
	}

	private mazeKeyPressHandler(e: KeyboardEvent): void {
		const currentPosition: Position = { ...this.state.getPosition() }
		let direction: Positions

		switch (e.key) {
			case 'ArrowUp':
				direction = Positions.TOP
				break

			case 'ArrowDown':
				direction = Positions.BOTTOM
				break

			case 'ArrowLeft':
				this.heroDiv.classList.add('face-left')
				direction = Positions.LEFT
				break

			case 'ArrowRight':
				this.heroDiv.classList.remove('face-left')
				direction = Positions.RIGHT
				break

			default:
				return
		}

		this.notifyObservers({
			event: Events.MOVE_ATTEMPT,
			payload: { direction, position: currentPosition },
		})
		e.preventDefault()
	}
}
