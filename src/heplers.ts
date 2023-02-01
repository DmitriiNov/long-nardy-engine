import Player from './player';

class Board {
	constructor(highBoard: Array<number>, lowBoard: Array<number>, highBoardPlayer: Player, lowBoardPlayer: Player) {
		this.highBoard = highBoard;
		this.lowBoard = lowBoard;
		this.highBoardPlayer = highBoardPlayer;
		this.lowBoardPlayer = lowBoardPlayer;
	}

	private lowBoard: Array<number> = [];
	private highBoard: Array<number> = [];
	private lowBoardPlayer: Player | null = null;
	private highBoardPlayer: Player | null = null;

	getPlayerPieces(player: Player): Array<number> {
		if (this.lowBoardPlayer === player) {
			return this.lowBoard;
		} else if (this.highBoardPlayer === player) {
			return this.highBoard;
		} else {
			throw new Error('Player is not in the game');
		}
	}

	getOpponentPieces(player: Player): Array<number> {
		if (this.lowBoardPlayer === player) {
			return this.highBoard;
		} else if (this.highBoardPlayer === player) {
			return this.lowBoard;
		} else {
			throw new Error('Player is not in the game');
		}
	}
}

type Move = [number, number];

export { Board, Move }