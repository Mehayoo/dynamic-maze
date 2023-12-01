import { Controller } from './Controller'
import { Observable } from './Observable'
import { IObserverEvent } from './interfaces/observer-event.interface'
import { IMessagePayload } from './interfaces/message-payload.interface'
import { IMoveAllowedPayload } from './interfaces/move-allowed-payload.interface'
import { Events, Messages } from './constants/constants'

export class GameController extends Controller<Events> {
	constructor(grid: Observable<Events>) {
		super(grid)
	}

	public update(observerEvent: IObserverEvent<Events>): void {
		const { event, payload = {} } = observerEvent

		switch (event) {
			case Events.EVENT_MESSAGE:
				this.notifyObservers({
					event: Events.DISPLAY_UI_MESSAGE,
					payload: { msg: payload.msg } as IMessagePayload,
				})
				break
			case Events.WALL_COLLISION:
				this.notifyObservers({
					event: Events.DISPLAY_UI_MESSAGE,
					payload: { msg: Messages.WRONG_WAY } as IMessagePayload,
				})
				this.notifyObservers({
					event: Events.STEP_SUBTRACT,
				})
				break
			case Events.MOVE_ALLOWED:
				this.notifyObservers({
					event: Events.MOVE_HERO,
					payload: payload as IMoveAllowedPayload,
				})
				this.notifyObservers({
					event: Events.STEP_SUBTRACT,
				})
				this.notifyObservers({
					event: Events.SCORE_ADD,
				})
				break
			case Events.COLLECT_TREASURE:
				this.notifyObservers({
					event: Events.STEP_ADD_TREASURE,
				})
				break
			case Events.COLLECT_KEY:
				this.notifyObservers({ event: Events.COLLECT_KEY })
				this.notifyObservers({
					event: Events.STEP_ADD_KEY,
				})
				break
			case Events.EXIT_ATTEMPT:
				this.notifyObservers({
					event: Events.VALIDATE_EXIT,
					payload: payload as IMoveAllowedPayload,
				})
				break
			default:
				return
		}
	}
}
