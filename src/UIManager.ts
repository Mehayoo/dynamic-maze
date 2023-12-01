import { Observer } from './Observer'
import { IGameBase } from './interfaces/game-base.interface'
import { IObserverEvent } from './interfaces/observer-event.interface'
import { IMessagePayload } from './interfaces/message-payload.interface'
import { IHighScore } from './interfaces/high-score.interface'
import { Events, LOCAL_STORAGE_KEY, Messages } from './constants/constants'

export class UIManager implements Observer<Events> {
	private readonly gameContainerDiv: HTMLDivElement =
		this.createDivElement('game-container')
	public readonly stepsDiv: HTMLDivElement =
		this.createDivElement('game-steps')
	private readonly scoreDiv: HTMLDivElement =
		this.createDivElement('game-score')
	public readonly messageDiv: HTMLDivElement =
		this.createDivElement('game-message')
	private readonly highScoresDiv: HTMLDivElement =
		this.createDivElement('high-score')

	constructor(public gameDiv: HTMLDivElement, private game: IGameBase) {
		this.initUI(gameDiv)
		this.messageDiv.textContent = Messages.GAME_START
		this.scoreDiv.textContent = `${Messages.SCORE} 0`
	}

	public update(observerEvent: IObserverEvent<Events>): void {
		const { event, payload = {} } = observerEvent
		const { msg } = payload as IMessagePayload

		switch (event) {
			case Events.DISPLAY_UI_MESSAGE:
				this.messageDiv.textContent = msg
				break
			case Events.DISPLAY_UI_STEPS:
				this.stepsDiv.textContent = msg
				break
			case Events.DISPLAY_UI_SCORE:
				this.scoreDiv.textContent = msg
				break
			case Events.GAME_OVER:
				this.gameDiv.classList.add('lost')
				this.messageDiv.textContent = msg
				break
			case Events.GAME_WIN:
				this.showHighScores()
				break
			default:
				return
		}
	}

	public deployConfetti(): void {
		console.log('Roger that. Deploying Confetti! Pew pew!')

		const confettiDivs: HTMLDivElement[] = []
		for (let i = 0; i < 100; i++) {
			confettiDivs.push(this.createDivElement('confetti'))
		}

		this.appendChildren(this.gameContainerDiv, confettiDivs)

		confettiDivs.forEach((el: HTMLDivElement) => {
			el.style.left = `${Math.random() * 100}%`
			el.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`
			el.style.animationDelay = `${Math.random() * 1}s`
		})
	}

	private initUI(gameDiv: HTMLDivElement): void {
		document.body.appendChild(gameDiv)
		const gameHeight = gameDiv.offsetHeight
		document.body.removeChild(gameDiv)

		this.gameDiv.className = 'game'

		this.appendChildren(this.gameContainerDiv, [
			this.gameDiv,
			this.createGameOutputDiv(),
			this.createControlButtons(gameHeight),
		])

		document.body.appendChild(this.gameContainerDiv)
	}

	private showHighScores(): void {
		const parsedHighScores: IHighScore[] =
			JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
		parsedHighScores.forEach((item: IHighScore, index: number) => {
			const listItem = this.createDivElement('high-score-list-item')
			listItem.textContent = `${index + 1}: ${item.score} (size ${
				item.size
			})`
			this.highScoresDiv.appendChild(listItem)
		})

		const btnContainerDiv: HTMLDivElement = document.querySelector(
			'.control-btns-container'
		)
		btnContainerDiv.style.top = `calc(${this.gameDiv.offsetHeight}px + ${this.scoreDiv.offsetHeight}px + ${this.messageDiv.offsetHeight}px + ${this.highScoresDiv.offsetHeight}px + 40px)`
	}

	private createDivElement(className: string): HTMLDivElement {
		const divElement: HTMLDivElement = document.createElement('div')
		divElement.className = className
		return divElement
	}

	private appendChildren(
		parent: HTMLDivElement,
		children: HTMLElement[]
	): void {
		children.forEach((child) => parent.appendChild(child))
	}

	private createGameOutputDiv(): HTMLDivElement {
		const outputDiv = this.createDivElement('game-output')
		const statsDiv = this.createDivElement('game-stats')

		this.appendChildren(statsDiv, [this.stepsDiv, this.scoreDiv])
		this.appendChildren(outputDiv, [
			statsDiv,
			this.messageDiv,
			this.highScoresDiv,
		])

		return outputDiv
	}

	private restart = (): void => {
		const { size, entrancePos, exitPos } = this.game.gameConfig
		document.body.removeChild(this.gameContainerDiv)

		this.game.resetGame()
		this.game.startGame(size, entrancePos, exitPos)
	}

	private createControlButtons(height: number): HTMLDivElement {
		const btnContainerDiv = this.createDivElement('control-btns-container')

		const restartBtn = document.createElement('button')
		restartBtn.className = 'restart-game'
		restartBtn.textContent = 'Restart'
		restartBtn.addEventListener('click', this.restart)

		const exitBtn = document.createElement('button')
		exitBtn.className = 'exit-game'
		exitBtn.textContent = 'Exit'
		exitBtn.addEventListener('click', () => location.reload())

		this.appendChildren(btnContainerDiv, [restartBtn, exitBtn])

		btnContainerDiv.style.top = `calc(${height}px +  80px)`

		return btnContainerDiv
	}
}
