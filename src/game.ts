import { Player } from "./player";
import { GameState, MoveState } from "./states";
import { Engine } from "./engine"
import { Board } from "./board";
import { platform } from "os";
class Game {
	constructor() {
		this.engine = new Engine(this);
	}
 
	private gameState: GameState | null = null;
	private moveState: MoveState | null = null;
	private engine: Engine;

	InitGame(dices: [number, number] | null): [number, number] {
		const diceResult = dices || this.getDiffDices();
		const player1 = new Player(diceResult[0] > diceResult[1]);
		const player2 = new Player(diceResult[0] < diceResult[1]);
		this.gameState = new GameState(player1, player2);
		return diceResult;
	}

	GetPlayers(): [Player, Player] {
		if (this.gameState === null) {
			throw new Error("Game not initialized");
		}
		return [this.gameState.player1, this.gameState.player2];
	}

	GetCurrentPlayer(): Player {
		if (this.moveState === null) {
			throw new Error("Game not initialized");
		}
		return this.moveState.currentPlayer;
	}

	// IsMoveEnded(): boolean {
	// 	if (this.moveState === null || this.gameState === null) {
	// 		throw new Error("Game or Move not initialized");
	// 	}
	// 	if (this.moveState.remainingMoves.length === 0)
	// 		return true;
	// 	if (this.engine.GetMovesTree(this.moveState, this.gameState.board).length === 0)
	// 		return true;
	// 	return false;
	// }

	Move(move: [number, number]): boolean {
		if (this.gameState === null || this.moveState === null) {
			throw new Error("Game or Move not initialized");
		}
		const isDone = this.engine.MakeMove(move);
		return isDone;
	}

	GetBoard(): Board {
		if (this.gameState === null) {
			throw new Error("Game not initialized");
		}
		return this.gameState.board;
	}

	GetPossibleMoves(): void {

	}

	GetCurrentMoveState(): MoveState {
		if (this.moveState === null) {
			throw new Error("Game not initialized");
		}
		return this.moveState;
	}

	InitMove(dices: [number, number] | null) {
		if (this.gameState === null) {
			throw new Error("Game not initialized");
		}
		// if (!this.IsMoveEnded()) {
		// 	throw new Error("Previous move not ended");
		// }
		let currPlayer = this.gameState.player1.isFirst ? this.gameState.player1 : this.gameState.player2;
		if (this.moveState !== null) {
			currPlayer = this.moveState.currentPlayer;
		}
		this.moveState = new MoveState(this.moveState === null ? 1 : this.moveState.moveNumber + 1, currPlayer, dices, null, null);
	}

	private getDiffDices(): [number, number] {
		let dice1 = Math.floor(Math.random() * 6) + 1;
		let dice2 = Math.floor(Math.random() * 6) + 1;
		while (dice1 === dice2) {
			dice2 = Math.floor(Math.random() * 6) + 1;
		}
		return [dice1, dice2];
	}
}

export { Game };