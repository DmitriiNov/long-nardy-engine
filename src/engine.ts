import { Game } from "./game";
import { Board } from "./board";
import { MoveState } from "./states";
class Engine {
	constructor(game: Game) {
		this.game = game;
	}

	private game: Game;

	GetPossibleMoves(): Array<Array<[number, number]>> {
		const ms = this.game.GetCurrentMoveState();
		const board = this.game.GetBoard();
		const currentBoardCopy = board.getCurrentBoard(ms.currentPlayer).slice();

		const newMoveState = new MoveState(ms.moveNumber, ms.currentPlayer, ms.dices, ms.remainingMoves, ms.doneMoves);



		return [[[0, 0]]];
	}

	getAllUniquePermutations(nums: Array<number>): Array<Array<number>> {
		if (nums.length === 0)
			return [];
		if (nums.length === 2) {
			if (nums[0] === nums[1])
				return [[nums[0], nums[1]]];
			return [[nums[0], nums[1]], [nums[1], nums[0]]];
		}
		return [nums];
	}

	MakeMove(move: [number, number]): boolean {
		const ms = this.game.GetCurrentMoveState();
		const moveLength = move[1] - move[0];
		const moves = ms.remainingMoves;
		
		const permutations = this.getAllUniquePermutations(moves);
		
		for (let k = 0; k < permutations.length; k++) {
			const perm = permutations[k];
			let sum = 0;
			let i;
			for (i = 0; i < perm.length; i++) {
				sum += perm[i];
				if (sum === moveLength)
					break;
			}
			if (i === perm.length)
				continue;
			const usedMoves = perm.slice(0, i+1);
			const newMoveState = new MoveState(ms.moveNumber, ms.currentPlayer, ms.dices, ms.remainingMoves, ms.doneMoves);
			let currentPoint = move[0];
			for (let j = 0; j < usedMoves.length; j++) {
				const isValid = this.IsMoveValid(newMoveState, [currentPoint, currentPoint + usedMoves[j]]);
				if (!isValid)
					continue;
				newMoveState.remainingMoves.splice(newMoveState.remainingMoves.indexOf(usedMoves[j]), 1);
				newMoveState.doneMoves.push([currentPoint, usedMoves[j]]);
				currentPoint += usedMoves[j];
			}
			return true;
		}
		return false;
	}

	IsMoveValid(moveState: MoveState, move: [number, number]): boolean {
		if (!this.IsMovePossible(moveState, move))
			return false;
		if (!this.IsThereAnyPiece(moveState, move))
			return false;
		if (!this.IsThereNoPieceOnOpponentBoard(moveState, move))
			return false;
		if (!this.IsOnlyOnePieceFromHead(moveState, move))
			return false;
		if (!this.IsNoSixBlocked(moveState, move))
			return false;
		if (move[1] > 23) {
			if (!this.AreAllPiecesAtHome(moveState))
				return false;
			if (move[1] > 24 && !this.AreThereNoAlternativeMoves(moveState, move))
				return false;
		}
		return true;
	}

	IsThereAnyPiece(moveState: MoveState, move: [number, number]): boolean {
		const from = move[0];
		const board = this.game.GetBoard();
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		if (currentBoard[from] > 0)
			return false;
		return true;
	}

	IsThereNoPieceOnOpponentBoard(moveState: MoveState, move: [number, number]): boolean {
		let to = move[1];
		if (to > 23)
			return true;
		const board = this.game.GetBoard();
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		to += 12;
		if (to > 23)
			to -= 24;
		if (currentBoard[to] > 0)
			return false;
		return true;
	}

	IsMovePossible(moveState: MoveState, move: [number, number]): boolean {
		if (move[0] < 0 || move[0] > 23)
			return false;
		if (move[1] < 1 || move[1] > 29)	
			return false;
		if (move[1] <= move[0])
			return false;
		moveState.remainingMoves.forEach((element) => {
			if (element === move[0])
				return true;
		});
		return false;
	}

	AreAllPiecesAtHome(moveState: MoveState): boolean {
		const board = this.game.GetBoard();
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		for (let i = 0; i < 18; i++) {
			if (currentBoard[i] !== 0)
				return false;
		}
		return true;
	}

	AreThereNoAlternativeMoves(moveState: MoveState, move: [number, number]): boolean {
		const mv = move[1] - move[0];
		const board = this.game.GetBoard();
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		const opponentBoard = board.getOpponentBoard(moveState.currentPlayer).slice(6, 12);
		
		for (let i = 0; i < 6; i++) {
			if (i + 18 + mv < 24 && currentBoard[i+18] !== 0) {
				if (opponentBoard[i + mv] === 0)
					return true;
			}
		}
		return true;
	}

	IsOnlyOnePieceFromHead(moveState: MoveState, move: [number, number]): boolean {
		let from = move[0];
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

	IsNoSixBlocked(moveState: MoveState, move: [number, number]): boolean {
		let to = move[1];
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
				const found = opponentPiecesBiggerThanTwelve.find((piece) => {
					return piece >= rowTo;
				});
				if (found === undefined) {
					return false;
				}
			}
			if (currentBoard[i] > 0) {
				rowTo = i;
			} else {
				rowFrom = i;
			}
		}
		return true
	}
}

export { Engine };