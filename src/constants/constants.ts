export enum Positions {
	TOP = 'top',
	BOTTOM = 'bottom',
	LEFT = 'left',
	RIGHT = 'right',
}

export enum Events {
	EVENT_MESSAGE = 'event_message',
	DISPLAY_UI_MESSAGE = 'display_ui_message',
	DISPLAY_UI_STEPS = 'display_ui_steps',
	DISPLAY_UI_SCORE = 'display_ui_score',
	WALL_COLLISION = 'wall_collision',
	MOVE_ATTEMPT = 'move_attempt',
	MOVE_ALLOWED = 'move_allowed',
	MOVE_HERO = 'move_hero',
	COLLECT_TREASURE = 'collect_treasure',
	COLLECT_KEY = 'collect_key',
	EXIT_ATTEMPT = 'exit_attempt',
	VALIDATE_EXIT = 'validate_exit',
	STEP_SUBTRACT = 'step_subtract',
	STEP_ADD_TREASURE = 'step_add_treasure',
	STEP_ADD_KEY = 'step_add_key',
	SCORE_ADD = 'score_add',
	GAME_OVER = 'game_over',
	GAME_WIN = 'game_win',
}

export enum Messages {
	HERO_TAKES_TREASURE = 'Yay, treasure!',
	HERO_TAKES_KEY = 'You have the key!',
	WRONG_WAY = 'Oops, wrong way!',
	KEY_MISSING = 'You need a key to unlock the door',
	GAME_START = 'First find the key',
	GAME_WIN = 'You finished!!!',
	GAME_LOSE = "Sorry, you didn't make it",
	STEPS = 'Steps:',
	SCORE = 'Score:',
}

export const oppositeDirections: { [key in Positions]: Positions } = {
	[Positions.TOP]: Positions.BOTTOM,
	[Positions.BOTTOM]: Positions.TOP,
	[Positions.LEFT]: Positions.RIGHT,
	[Positions.RIGHT]: Positions.LEFT,
}

export const LOCAL_STORAGE_KEY = 'maze_game_high_scores'
