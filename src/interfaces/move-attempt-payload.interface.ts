import { Positions } from '../constants/constants'
import { Position } from './position.interface'

export interface IMoveAttemptPayload {
	direction: Positions
	position: Position
}
