import { Game } from './Game'
import { Positions } from './constants/constants'
import { validateSelections } from './utils/utils'
import './style.scss'

const formContainer: HTMLElement = document.querySelector('.settings-container')
const form = document.querySelector('.game-params-form') as HTMLFormElement
const sizeInput = document.querySelector('.sizeInput') as HTMLInputElement

const entranceSelect = document.querySelector(
	'.entrance-position-select'
) as HTMLSelectElement
const exitSelect = document.querySelector(
	'.exit-position-select'
) as HTMLSelectElement

const errorMsgDiv: HTMLElement = document.querySelector('.error_msg')

entranceSelect.addEventListener('change', () => {
	try {
		validateSelections(
			entranceSelect.value as Positions,
			exitSelect.value as Positions
		)

		errorMsgDiv.textContent = ''
	} catch (error) {
		errorMsgDiv.textContent = error.message
	}
})

exitSelect.addEventListener('change', () => {
	try {
		validateSelections(
			exitSelect.value as Positions,
			entranceSelect.value as Positions
		)

		errorMsgDiv.textContent = ''
	} catch (error) {
		errorMsgDiv.textContent = error.message
	}
})

form.addEventListener('submit', (e: SubmitEvent) => {
	e.preventDefault()

	if (errorMsgDiv.textContent) {
		errorMsgDiv.textContent = 'Take care of errors first'
		return
	}
	errorMsgDiv.textContent = ''

	formContainer.style.display = 'none'

	const gameInstance = Game.getInstance()
	gameInstance.startGame(
		parseInt(sizeInput.value, 10),
		entranceSelect.value as Positions,
		exitSelect.value as Positions
	)
})
