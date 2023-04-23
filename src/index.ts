import { Game } from './game'

function GetNewGame(): Game {
	return new Game();
}

function ImportGame(data: any): Game {
	return new Game();
}

export { GetNewGame }