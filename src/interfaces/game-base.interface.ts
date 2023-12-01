import { IGameConfig } from './game-config.interface'
import { Positions } from '../constants/constants'

export interface IGameBase {
	gameConfig: IGameConfig
	startGame(size: number, entrancePos: Positions, exitPos: Positions): void
	resetGame(): void
}
