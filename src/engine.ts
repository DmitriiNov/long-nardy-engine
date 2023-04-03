import { Game } from "./game";
import { Board } from "./board";
import { MoveState } from "./states";

type ValidatorFunction = (moveState: MoveState, board: Board, move: [number, number]) => ValidationResult;
class ValidationResult {
	constructor (message: string, valid: boolean) {
		this.message = message;
		this.valid = valid;
	}
	message: string;
	valid: boolean;

	IsValid() {
		return this.valid
	}
}

function GetFalseValidationResult(message: string) {
	return new ValidationResult(message, false)
}

function GetTrueValidationResult() {
	return new ValidationResult('', true)
}
class Engine {
	constructor(game: Game) {
		this.game = game;
	}

	private game: Game;

	getNumber(n: number): number {
		return n;
	}

	GetPossibleMoves(): { [key: number]: Array<number>; } {
		const ms = this.game.GetCurrentMoveState();
		if (ms.remainingMoves.length === 0)
			return {};
		const board = this.game.GetBoard();
		const currentBoardCopy = board.getCurrentBoard(ms.currentPlayer).slice();

		const moves: { [key: number]: Array<number>; } = {};

		const permutations = this.getAllUniquePermutations(ms.remainingMoves);
		for (let i = 0; i<24; i++) {
			const possibleMoves = Array<number>();
			if (currentBoardCopy[i] === 0)
				continue;
			for (let permutation of permutations) {
				const newMoveState = ms.getStateCopy();
				const newBoard = board.getBoardCopy();
				let currentPoint = i;
				for (let j = 0; j < permutation.length; j++) {
					const validationResult = this.IsMoveValid(newMoveState, newBoard, [currentPoint, currentPoint + permutation[j]]);
					if (validationResult.IsValid()) {
						newMoveState.remainingMoves.splice(newMoveState.remainingMoves.indexOf(permutation[j]), 1);
						newMoveState.doneMoves.push([currentPoint, permutation[j]]);
						newBoard.move(newMoveState.currentPlayer, currentPoint, currentPoint + permutation[j])
						currentPoint += permutation[j];
						const found = possibleMoves.find(v => v === currentPoint);
						if (!found)
							possibleMoves.push(currentPoint);
					} else {
						j = Infinity;
					}
				}
				
			}
			if (possibleMoves.length > 0) {
				moves[i] = possibleMoves;
			}
		}
		return moves;
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
		const board = this.game.GetBoard();
		return this.makeMove(ms, board, move);
	}

	makeMove(ms: MoveState, board: Board, move: [number, number]): boolean {
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
			const newMoveState = ms.getStateCopy();
			const newBoard = board.getBoardCopy();
			
			const isValid = this.validateMove(newMoveState, newBoard, usedMoves, move[0]);
			if (isValid) {
				const movestate = this.game.GetCurrentMoveState();
				if (movestate) {
					movestate.setRemainingMoves(newMoveState.remainingMoves);
					movestate.setDoneMoves(newMoveState.doneMoves);
				}
				const board = this.game.GetBoard();
				if (board)
					board.ApplyBoard(newBoard);

				return true;
			}
		}
		return false;
	}

	validateMove(moveState: MoveState, board: Board, moves: Array<number>, from: number): boolean {
		let currentPoint = from;
		for (let j = 0; j < moves.length; j++) {
			const validationResult = this.IsMoveValid(moveState, board, [currentPoint, currentPoint + moves[j]]);
			if (!validationResult.IsValid())
				return false;
			moveState.remainingMoves.splice(moveState.remainingMoves.indexOf(moves[j]), 1);
			moveState.doneMoves.push([currentPoint, moves[j]]);
			board.move(moveState.currentPlayer, currentPoint, currentPoint + moves[j])
			currentPoint += moves[j];
		}
		return true
	}

	IsMoveValid(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		let result: ValidationResult;
		const validators: Array<ValidatorFunction> = [
			this.IsMovePossible.bind(this),
			this.IsThereAnyPiece.bind(this),
			this.IsThereNoPieceOnOpponentBoard.bind(this),
			this.IsOnlyOnePieceFromHead.bind(this),
			this.IsNoSixBlocked.bind(this),
			this.AreAllPiecesAtHome.bind(this),
			this.AreThereNoAlternativeMoves.bind(this)
		]

		for (let validator of validators) {
			result = validator(moveState, board, move);
			if (!result.IsValid())
				return result;
		}
		return GetTrueValidationResult();
	}

	IsThereAnyPiece(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		const from = move[0];
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		if (currentBoard[from] <= 0)
			return GetFalseValidationResult('[IsThereAnyPiece] no pieces')
		return GetTrueValidationResult();
	}

	IsThereNoPieceOnOpponentBoard(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		let to = move[1];
		if (to > 23)
			return GetTrueValidationResult();
		const currentBoard = board.getOpponentBoard(moveState.currentPlayer);
		to += 12;
		if (to > 23)
			to -= 24;
		if (currentBoard[to] > 0)
			return GetFalseValidationResult('[IsThereNoPieceOnOpponentBoard] there are pieces on opponent`s board');
		return GetTrueValidationResult();
	}

	IsMovePossible(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		if (move[0] < 0 || move[0] > 23)
			return GetFalseValidationResult('[IsMovePossible] move "from" is not valid');
		if (move[1] < 1 || move[1] > 29)	
			return GetFalseValidationResult('[IsMovePossible] move "to" is not valid');
		if (move[1] <= move[0])
			return GetFalseValidationResult('[IsMovePossible] "to" bigger than "from"');
		return GetTrueValidationResult();
	}

	AreAllPiecesAtHome(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		if (move[1] < 24)
			return GetTrueValidationResult();
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		for (let i = 0; i < 18; i++) {
			if (currentBoard[i] !== 0)
				return GetFalseValidationResult('[AreAllPiecesAtHome] not all pieces are at home');
		}
		return GetTrueValidationResult();
	}

	AreThereNoAlternativeMoves(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		if (move[1] < 25) {
			return GetTrueValidationResult();
		}
		const mv = move[1] - move[0];
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
		const opponentBoard = board.getOpponentBoard(moveState.currentPlayer).slice(6, 12);
		
		for (let i = 0; i < 6; i++) {
			if (i + 18 + mv < 24 && currentBoard[i+18] !== 0) {
				if (opponentBoard[i + mv] === 0)
					return GetFalseValidationResult('[AreThereNoAlternativeMoves] there are alternative moves');
			}
		}
		return GetTrueValidationResult();
	}

	IsOnlyOnePieceFromHead(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		let from = move[0];
		if (from !==  0 || moveState.doneMoves.length === 0)
			return GetTrueValidationResult();
		if (moveState.doneMoves.length > 0) {
			let doneHead = 0;
			moveState.doneMoves.forEach((move) => {
				if (move[0] === 0)
					doneHead++;
			});
			if (doneHead === 1) {
				let isRightDouble = moveState.dices[0] === moveState.dices[1] && [6,4,3].indexOf(moveState.dices[0]) !== -1;
				if (moveState.dices[0] === 4) {
					let opponentBoard = board.getOpponentBoard(moveState.currentPlayer).slice(6, 12);
					if (opponentBoard[20] !== 0)
						return GetFalseValidationResult('[IsOnlyOnePieceFromHead] no possible moves with two heads')
				}
				let result = moveState.moveNumber < 3 && isRightDouble;
				if (result)
					return GetTrueValidationResult();
				return GetFalseValidationResult('[IsOnlyOnePieceFromHead] head has been done');
			}
			if (doneHead > 1)
				return GetFalseValidationResult('[IsOnlyOnePieceFromHead] head has been done twice already')
		}
		return GetTrueValidationResult();
	}

	IsNoSixBlocked(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		let to = move[1];
		const currentBoard = board.getCurrentBoard(moveState.currentPlayer).slice();
		currentBoard[move[0]] -= 1;
		if (move[1] < 24)
			currentBoard[move[1]] += 1;
		const opponentBoard = board.getOpponentBoard(moveState.currentPlayer);
		const opponentPiecesBiggerThanTwelve = Array<number>();
		opponentBoard.slice(12).forEach((piece, index) => {
			if (piece > 0)
				opponentPiecesBiggerThanTwelve.push(index);
		});
		for (let pieceIndex of opponentPiecesBiggerThanTwelve) {
			if (pieceIndex >= 6)
				return GetTrueValidationResult();
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
					return GetFalseValidationResult('[IsNoSixBlocked] blocked six');
				}
			}
			if (currentBoard[i] > 0) {
				rowTo = i;
			} else {
				rowFrom = i+1;
			}
		}
		return GetTrueValidationResult();
	}
}

export { Engine, ValidationResult };