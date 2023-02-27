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
	constructor(num: number, player: Player, dices: [number, number] | null, remainingMoves: Array<number> | null, doneMoves: Array<[number, number]> | null) {
		this.moveNumber = num;
		this.currentPlayer = player
		if (dices !== null) {
			this.dices = dices;
		}
		this.remainingMoves = [this.dices[0], this.dices[1]];
		if (this.dices[0] === this.dices[1]) {
			this.remainingMoves.push(this.dices[0], this.dices[1]);
		}
		if (remainingMoves !== null) {
			this.remainingMoves = remainingMoves;
		}
		if (doneMoves !== null) {
			this.doneMoves = doneMoves;
		}
	}

	readonly moveNumber: number;
	readonly currentPlayer: Player;
	readonly dices: [number, number] = [this.getRandomDice(), this.getRandomDice()];
	readonly remainingMoves: Array<number>;
	readonly doneMoves: Array<[number, number]> = [];

	removeFromRemainingMoves(move: number): boolean {
		const index = this.remainingMoves.indexOf(move);
		if (index === -1) {
			return false;
		}
		this.remainingMoves.splice(index, 1);
		return true;
	}

	addMove(move: [number, number]): void {
		this.doneMoves.push(move);
	}

	getRandomDice(): number {
		return Math.floor(Math.random() * 6) + 1;
	}
}

export { GameState, MoveState };