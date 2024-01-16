import { Observable } from './Observable'
import { Observer } from './Observer'
import { IObserverEvent } from './interfaces/observer-event.interface'

export abstract class Controller<T>
	extends Observable<T>
	implements Observer<T>
{
	// Keeps track of the observers that have been added to the subject
	private _unsubscribe: () => Observer<T>[]

	constructor(private subject: Observable<T>) {
		super()

		// When an instance of Controller<T> is created, it subscribes itself as an observer to the subject
		// and provides a way to later unsubscribe from the subject if needed
		this._unsubscribe = this.subject.addObserver(this)
	}

	public abstract update(observerEvent: IObserverEvent<T>): void

	public unsubscribe(): () => Observer<T>[] {
		// Unsubscribes from observing the subject
		// Providing a more flexible and extensible mechanism for handling unsubscription in more complex scenarios, where control over the unsubscription process is essential
		return this._unsubscribe
	}
}
