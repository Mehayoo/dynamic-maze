import { Observer } from './Observer'
import { Observable } from './Observable'

export class SubscriptionManager<T> {
	constructor(private observer: Observer<T>) {}

	private subscriptionManager: Map<Observable<T>, () => Observer<T>[]> =
		new Map()

	public addSubscription(
		observable: Observable<T>,
		observer?: Observer<T>
	): void {
		if (observer) {
			const unsubscribe: () => Observer<T>[] =
				!observer.unsubscribe && observable.addObserver(observer)

			this.subscriptionManager.set(
				observable,
				unsubscribe || observer.unsubscribe()
			)
		} else {
			const unsubscribe = observable.addObserver(this.observer)
			this.subscriptionManager.set(observable, unsubscribe)
		}
	}

	public removeSubscriptions(): void {
		this.subscriptionManager.forEach((unsubscribe) => unsubscribe())
		this.subscriptionManager.clear()
	}
}
