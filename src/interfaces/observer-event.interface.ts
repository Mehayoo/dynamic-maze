export interface IObserverEvent<T> {
	event: T
	payload?: Record<string, any>
}
