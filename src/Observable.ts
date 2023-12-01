import { Observer } from './Observer'
import { IObserverEvent } from './interfaces/observer-event.interface'

export abstract class Observable<T> {
	protected observers: Observer<T>[] = []

	public addObserver(observer: Observer<T>): () => Observer<T>[] {
		this.observers.push(observer)

		return () => this.observers.filter((o) => o !== observer)
	}

	protected notifyObservers(observerEvent: IObserverEvent<T>): void {
		this.observers.forEach((observer) => observer.update(observerEvent))
	}
}
