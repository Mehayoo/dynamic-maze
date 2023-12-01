import { Observable } from './Observable'
import { Observer } from './Observer'
import { IObserverEvent } from './interfaces/observer-event.interface'

export abstract class Controller<T>
	extends Observable<T>
	implements Observer<T>
{
	private _unsubscribe: () => Observer<T>[]

	constructor(private subject: Observable<T>) {
		super()

		this._unsubscribe = this.subject.addObserver(this)
	}

	public abstract update(observerEvent: IObserverEvent<T>): void

	public unsubscribe(): () => Observer<T>[] {
		// unsubscribes from observing the subject
		return this._unsubscribe
	}
}
