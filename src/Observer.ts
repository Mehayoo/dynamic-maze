import { IObserverEvent } from './interfaces/observer-event.interface'

export abstract class Observer<T> {
	public abstract update(observerEvent: IObserverEvent<T>): void
	public abstract unsubscribe?(): () => Observer<T>[]
}
