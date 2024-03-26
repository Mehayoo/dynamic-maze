import { Observer } from './Observer'
import { Observable } from './Observable'

export class SubscriptionManager<T> {
	// Providing a default observer to allow SubscriptionManager to add subscriptions with a default observer if one is not explicitly provided
	constructor(private observer: Observer<T>) {}

	// Keeps track of observables and their corresponding unsubscription functions
	// The key is the observable, and the value is the unsubscription function
	private subscriptionManager: Map<Observable<T>, () => Observer<T>[]> =
		new Map()

	// Adds subscriptions to observables
	public addSubscription(
		observable: Observable<T>,
		// If this observer of the observable is not provided, the default observer from the constructor will be used
		observer?: Observer<T>
	): void {
		if (observer) {
			// Check if the observer has an unsubscribe method. If not, it adds the observer to the observable using observable.addObserver(observer)
			const unsubscribe: () => Observer<T>[] =
				!observer.unsubscribe && observable.addObserver(observer)

			this.subscriptionManager.set(
				observable,
				// Use an unsubscribe variable that returns a reference to a function because if a class is an observer,
				// it either has to implement its own unsubscribe method (because of it being optional and also returning () => Observer<T>[], which is an instance of a function, see Observer<T>)
				// or the class is an instance of the Controller class (which can be an observer of other observables and an observable to other observers,
				// all while not creating a circular dependency between the same observers and the observables because they are different) which has an unsubscribe method
				// that also returns a reference to a function. This correlates with the removeSubscriptions method which invokes these unsubscription functions when removeSubscriptions is called
				unsubscribe || observer.unsubscribe()
			)
		} else {
			// Adds the default observer from the constructor directly to the observable and assign the resulting unsubscription function to the unsubscribe variable
			const unsubscribe: () => Observer<T>[] = observable.addObserver(
				this.observer
			)
			this.subscriptionManager.set(observable, unsubscribe)
		}
	}

	public removeSubscriptions(): void {
		this.subscriptionManager.forEach((unsubscribe: () => Observer<T>[]) =>
			unsubscribe()
		)
		this.subscriptionManager.clear()
	}
}
