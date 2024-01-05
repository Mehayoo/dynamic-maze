import { Observer } from './Observer'
import { UIManager } from './UIManager'
import { SubscriptionManager } from './SubscriptionManager'
import { GameController } from './GameController'
import { ScoreManager } from './ScoreManager'
import { Grid } from './Grid'
import { Maze } from './Maze'
import { Hero } from './Hero'
import { IObserverEvent } from './interfaces/observer-event.interface'
import { IGameConfig } from './interfaces/game-config.interface'
import { IMoveAttemptPayload } from './interfaces/move-attempt-payload.interface'
import { IMoveAllowedPayload } from './interfaces/move-allowed-payload.interface'
import { Events, Messages, Positions } from './constants/constants'

export class Game implements Observer<Events> {
	private static instance: Game | null = null
	private uiManager: UIManager
	private subscriptionManager: SubscriptionManager<Events>
	private gameController: GameController
	private scoreManager: ScoreManager
	private grid: Grid
	private maze: Maze
	private hero: Hero

	public gameConfig: IGameConfig

	private constructor() {
		if (Game.instance) {
			throw new Error(
				'You can only create one instance of Game. Use Game.getInstance()'
			)
		}

		Game.instance = this
	}

	static getInstance(): Game {
		if (!Game.instance) {
			Game.instance = new Game()
		}

		return Game.instance
	}

	public startGame(
		size: number,
		entrancePos: Positions,
		exitPos: Positions
	): void {
		this.gameConfig = { size, entrancePos, exitPos }

		this.grid = new Grid(size, entrancePos, exitPos)
		this.grid.init()

		this.uiManager = new UIManager(this.grid.gridDiv, this)

		this.maze = new Maze(this.grid, this.grid.entrance)
		this.maze.init()

		this.subscriptionManager = new SubscriptionManager(Game.instance)
		this.gameController = new GameController(this.grid)
		this.scoreManager = new ScoreManager(size, this.gameController)

		this.hero = new Hero(this.grid.entrance)

		this.subscriptionManager.addSubscription(this.grid, this.gameController)
		this.subscriptionManager.addSubscription(
			this.gameController,
			this.scoreManager
		)
		this.subscriptionManager.addSubscription(
			this.gameController,
			this.uiManager
		)
		this.subscriptionManager.addSubscription(
			this.scoreManager,
			this.uiManager
		)
		this.subscriptionManager.addSubscription(this.gameController)
		this.subscriptionManager.addSubscription(this.scoreManager)
		this.subscriptionManager.addSubscription(this.hero)

		this.uiManager.stepsDiv.textContent = `${Messages.STEPS} ${this.scoreManager.steps}`
	}

	public resetGame(): void {
		this.subscriptionManager.removeSubscriptions()

		this.grid.reset()
		this.maze.reset()
		this.hero.reset()
	}

	public update(observerEvent: IObserverEvent<Events>): void {
		const { event, payload = {} } = observerEvent

		switch (event) {
			case Events.MOVE_ATTEMPT: {
				this.grid.validateMove(payload as IMoveAttemptPayload)
				break
			}
			case Events.MOVE_HERO: {
				const { newPosition } = payload as IMoveAllowedPayload
				this.hero.updatePosition(newPosition)
				break
			}
			case Events.COLLECT_KEY: {
				this.hero.collectKey()
				break
			}
			case Events.VALIDATE_EXIT: {
				this.scoreManager.subtractStep()

				if (this.hero.state.getHasKey()) {
					const { newPosition } = payload as IMoveAllowedPayload
					this.hero.updatePosition(newPosition)
					this.scoreManager.setScore(this.gameConfig.size * 2)
					this.scoreManager.setHighScore()

					this.uiManager.messageDiv.textContent = Messages.GAME_WIN
					this.uiManager.gameDiv.classList.add('win')
					this.uiManager.deployConfetti()

					this.hero.reset()
				} else {
					this.uiManager.messageDiv.textContent = Messages.KEY_MISSING
				}
				break
			}
			case Events.GAME_OVER: {
				this.hero.reset()
				break
			}
			default:
				return
		}
	}
}
