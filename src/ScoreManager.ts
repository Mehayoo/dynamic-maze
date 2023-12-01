import { Controller } from './Controller'
import { Observable } from './Observable'
import { IObserverEvent } from './interfaces/observer-event.interface'
import { IMessagePayload } from './interfaces/message-payload.interface'
import { IHighScore } from './interfaces/high-score.interface'
import { Events, LOCAL_STORAGE_KEY, Messages } from './constants/constants'

export class ScoreManager extends Controller<Events> {
	private score: number = 0
	private _steps: number =
		this.size < 11 ? Math.ceil(this.size * 2.1) : Math.ceil(this.size * 3.4)
	private readonly treasureIncrement: number =
		this.size < 11 ? Math.ceil(this.size * 0.7) : Math.ceil(this.size * 1.6)
	private readonly keyIncrement: number =
		this.size < 11 ? Math.ceil(this.size * 1.1) : Math.ceil(this.size * 1.6)

	get steps() {
		return this._steps
	}

	constructor(private size: number, observable: Observable<Events>) {
		super(observable)
	}

	public setScore(step: number): void {
		this.score += step
		this.notifyObservers({
			event: Events.DISPLAY_UI_SCORE,
			payload: {
				msg: `${Messages.SCORE} ${this.score}`,
			} as IMessagePayload,
		})
	}

	public setHighScore(): void {
		const maxHighScores = 5
		const parsedScores: IHighScore[] =
			JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
		parsedScores.push({ size: this.size, score: this.score })

		const sortedHighScores: IHighScore[] = parsedScores
			.sort((a, b) => b.score - a.score)
			.slice(0, maxHighScores)

		localStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify(sortedHighScores)
		)

		this.notifyObservers({ event: Events.GAME_WIN })
	}

	public subtractStep(): void {
		this._steps--
		this.notifyObservers({
			event: Events.DISPLAY_UI_STEPS,
			payload: {
				msg: `${Messages.STEPS} ${this._steps}`,
			} as IMessagePayload,
		})

		if (this._steps === 0) {
			this.notifyObservers({
				event: Events.GAME_OVER,
				payload: {
					msg: Messages.GAME_LOSE,
				} as IMessagePayload,
			})
		}
	}

	public update(observerEvent: IObserverEvent<Events>): void {
		const { event } = observerEvent

		switch (event) {
			case Events.STEP_SUBTRACT:
				this.subtractStep()
				break
			case Events.SCORE_ADD:
				this.setScore(1)
				break
			case Events.STEP_ADD_TREASURE:
				this._steps += this.treasureIncrement
				this.score += this.treasureIncrement
				this.notifyObservers({
					event: Events.DISPLAY_UI_SCORE,
					payload: {
						msg: `${Messages.SCORE} ${this.score}`,
					} as IMessagePayload,
				})
				break
			case Events.STEP_ADD_KEY:
				this._steps += this.keyIncrement
				this.setScore(this.keyIncrement)
				break
			default:
				return
		}
	}
}
