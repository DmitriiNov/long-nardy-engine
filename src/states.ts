import { Player } from './player';
import { Board } from './board';

class GameState {
	constructor(player1: Player, player2: Player, board?: Board) {
		this.player1 = player1;
		this.player2 = player2;
		if (board) this.board = board;
		else this.board = new Board();
	}
	readonly player1: Player;
	readonly player2: Player;
	private winner?: Player;
	private gameEnded: boolean = false;
	readonly board: Board;

	EndGame() {
		this.gameEnded = true;
	}

	HasGameEnded(): boolean {
		return this.gameEnded;
	}

	GetWinner(): Player | undefined {
		return this.winner;
	}

	SetWinner(player: Player) {
		if (player === this.player1 || player === this.player2) this.winner = player;
	}
}

class MoveState {
	constructor(
		num: number,
		player: Player,
		dices: [number, number] | null,
		remainingMoves: number[] | null,
		doneMoves: Array<[number, number]> | null
	) {
		this.moveNumber = num;
		this.currentPlayer = player;
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
		remainingMoves?.sort((a, b) => a - b);
	}

	readonly moveNumber: number;
	readonly currentPlayer: Player;
	readonly dices: [number, number] = [this.getRandomDice(), this.getRandomDice()];
	remainingMoves: number[];
	doneMoves: Array<[number, number]> = [];
	private isEnded: boolean = false;

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

	endMove() {
		this.isEnded = true;
	}

	setRemainingMoves(moves: number[]) {
		this.remainingMoves = moves;
	}

	setDoneMoves(moves: Array<[number, number]>) {
		this.doneMoves = moves;
	} 

	isMoveEnded() {
		return this.isEnded;
	}

	getStateCopy() {
		return new MoveState(this.moveNumber, this.currentPlayer, [...this.dices], [...this.remainingMoves], [...this.doneMoves]);
	}
}

export { GameState, MoveState };
