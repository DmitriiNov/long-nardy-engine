import { Game } from "./game";
import { Board } from "./board";
import { MoveState } from "./states";
class Engine {
	constructor(game: Game) {
		this.game = game;
	}

	private game: Game;

	IsThereAnyPiece(moveState: MoveState, from: number): boolean {
		const board = this.game.GetBoard();
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		if (currentBoard[from] > 0)
			return false;
		return true;
	}

	IsThereAnyPieceOnOpponentBoard(moveState: MoveState, to: number): boolean {
		const board = this.game.GetBoard();
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		to += 12;
		if (to > 23)
			to -= 24;
		if (currentBoard[to] > 0)
			return false;
		return true;
	}

	IsOnlyOnePieceFromHead(moveState: MoveState, from: number): boolean {
		if (from !==  0 || moveState.doneMoves.length === 0)
			return true;
		if (moveState.doneMoves.length > 0) {
			let doneHead = false;
			moveState.doneMoves.forEach((move) => {
				if (move[0] === 0)
					doneHead = true;
			});
			if (doneHead) {
				let isRightDouble = moveState.dices[0] === moveState.dices[1] && [6,4,3].indexOf(moveState.dices[0]) !== -1;
				return moveState.moveNumber === 1 && isRightDouble;
			}
			return true;
		}
		return false;
	}

	IsNoSixBlocked(moveState: MoveState, to: number): boolean {
		const board = this.game.GetBoard();
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		const opponentBoard = board.getOpponentBoard(moveState.currentPlayer);
		const opponentPiecesBiggerThanTwelve = Array<number>();
		opponentBoard.slice(12).forEach((piece, index) => {
			if (piece > 0)
				opponentPiecesBiggerThanTwelve.push(index);
		});
		for (let pieceIndex of opponentPiecesBiggerThanTwelve) {
			if (pieceIndex >= 6)
				return true;
		}
		let checkFrom = to - 5 > 0 ? to - 5 : 0;
		let checkTo = to + 5 > 11 ? to + 5 : 11;


		let rowFrom = checkFrom;
		let rowTo = checkFrom;
		for (let i = checkFrom; i <= checkTo; i++) {
			if (rowTo - rowFrom === 5) {
				// тут проверка
			}
		}

	}

	GetMovesTree(moveState: MoveState, board: Board): Array<Array<[number, number]>> {

		return [[[0, 0]]];
	}

	Move(move: [number, number]): boolean {
		const movesTree = this.GetMovesTree(this.game.GetCurrentMoveState(), this.game.GetBoard());
		return true;
	}
}

export { Engine };