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

	InitGame(dices?: [number, number]): [number, number] {
		const diceResult = dices || this.getDiffDices();
		const player1 = new Player(diceResult[0] > diceResult[1]);
		const player2 = new Player(diceResult[0] < diceResult[1]);
		this.gameState = new GameState(player1, player2);
		return diceResult;
	}

	UndoLastMove() {
		if (this.moveState === null)
			throw new Error("Move not initialized");
		if (this.moveState.isMoveEnded())
			throw new Error("Move ended");
		if (this.moveState.remainingMoves.length === 0)
			throw new Error("Not possible on the last move");
		const move = this.moveState.doneMoves.pop();
		if (!move)
			throw new Error("No moves have been done yet");
		this.GetBoard().move(this.GetCurrentPlayer(), move[1], move[0])
		this.moveState.remainingMoves.push(move[1] - move[0])
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

	GetOppositePlayer(): Player {
		if (this.gameState === null || this.moveState === null) {
			throw new Error("Game or Move not initialized");
		}
		const currPlayer = this.moveState.currentPlayer;
		return this.moveState.currentPlayer === this.gameState.player1 ? this.gameState.player2 : this.gameState.player1;
	}

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

	GetPossibleMoves(): { [key: number]: Array<number>; } {
		if (this.gameState === null)
			throw new Error('Game not initialized');
		if (this.moveState === null)
			throw new Error('Move not initialized');
		if (this.moveState.isMoveEnded())
			throw new Error('Move already ended');
		const result = this.engine.GetPossibleMoves();
		return result;
	}

	GetCurrentMoveState(): MoveState {
		if (this.moveState === null) {
			throw new Error("Game not initialized");
		}
		return this.moveState;
	}

	EndMove() {
		if (!this.gameState)
			throw new Error('Game is not initialized');
		if (!this.moveState)
			throw new Error('Move is not initialized');
		const possibleMoves = this.GetPossibleMoves();
		if (Object.keys(possibleMoves).length > 0)
			return false;
		this.moveState.endMove();
		const currPlayerFinished = this.gameState.board.CountPieces(this.GetCurrentPlayer()) === 0;
		const oppositePlayerFinished = this.gameState.board.CountPieces(this.GetOppositePlayer()) === 0
		if (currPlayerFinished && !oppositePlayerFinished) {
			if (!this.GetCurrentPlayer().isFirst) {
				this.gameState.EndGame();
				this.gameState.SetWinner(this.GetCurrentPlayer());
			}
		} else if (!currPlayerFinished && oppositePlayerFinished) {
			this.gameState.EndGame();
			this.gameState.SetWinner(this.GetOppositePlayer());
		} else if (currPlayerFinished && oppositePlayerFinished) {
			this.gameState.EndGame();
		}
		return true;
	}

	StartMove(dices?: [number, number]): [number, number] {
		if (!this.gameState)
			throw new Error('Game is not initialized');
		if (this.gameState.HasGameEnded())
			throw new Error('Game has been ended');
		if (this.moveState === null) {
			let currPlayer = this.gameState.player1.isFirst ? this.gameState.player1 : this.gameState.player2;
			this.moveState = new MoveState(1, currPlayer, dices || null, null, null);
			return this.moveState.dices;
		}

		if (!this.moveState?.isMoveEnded())
			throw new Error('Previous move is not ended');

		const currPlayer = this.moveState.currentPlayer === this.gameState.player1
			? this.gameState.player2 : this.gameState.player1
		const moveNumber = this.moveState.moveNumber + 1;
		this.moveState = new MoveState(this.moveState === null ? 1 : this.moveState.moveNumber + 1, currPlayer, dices || null, null, null);
		return this.moveState.dices;
	}

	HasGameEnded (): boolean {
		if (this.gameState)
			return this.gameState?.HasGameEnded();
		return false
	}

	GetWinner (): Player | undefined {
		return this.gameState?.GetWinner();
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