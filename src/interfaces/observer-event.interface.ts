export interface IObserverEvent<T> {
	event: T
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload?: Record<string, any>
}
