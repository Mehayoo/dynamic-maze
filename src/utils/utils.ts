import { oppositeDirections } from '../constants/constants'
import { Positions } from '../constants/constants'

export const getRandomIntExcluding = (
	max: number,
	min: number = 0,
	excluding?: number
): number => {
	let result: number
	const range: number = min === 0 ? max - min : max - min + 1

	do {
		result = Math.floor(Math.random() * range) + min
	} while (excluding !== undefined && result === excluding)

	return result
}

export const validateSelections = (
	select1Value: Positions,
	select2Value: Positions
) => {
	if (oppositeDirections[select1Value] !== select2Value) {
		throw new Error('Selected directions are not opposites.')
	}
}
