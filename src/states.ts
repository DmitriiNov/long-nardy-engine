import { Player } from './player';
import { Board } from './board';

class GameState {
	constructor(player1: Player, player2: Player) {
		this.player1 = player1;
		this.player2 = player2;
		this.board = new Board();
	}
	player1: Player;
	player2: Player;
	board: Board;
}

class MoveState {
	constructor(num: number, player: Player, dices: [number, number] | null) {
		this.moveNumber = num;
		this.currentPlayer = player
		if (dices !== null) {
			this.dices = dices;
		}
		this.remainingMoves = [this.dices[0], this.dices[1]];
		if (this.dices[0] === this.dices[1]) {
			this.remainingMoves.push(this.dices[0], this.dices[1]);
		}
	}

	moveNumber: number;
	currentPlayer: Player;
	dices: [number, number] = [this.getRandomDice(), this.getRandomDice()];
	remainingMoves: Array<number>;
	doneMoves: Array<[number, number]> = [];

	getRandomDice(): number {
		return Math.floor(Math.random() * 6) + 1;
	}
}

export { GameState, MoveState };