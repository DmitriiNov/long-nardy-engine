import { Game } from '../game';
import Board from '../board';
import MoveState from '../states/moveState';
import { ValidationResult, validators } from './moveValidators';

class Engine {
	constructor(game: Game) {
		this.game = game;
	}

	private game: Game;

	GetPossibleMoves(): { [key: number]: number[] } {
		const ms = this.game.GetCurrentMoveState();
		if (ms.remainingMoves.length === 0) return {};
		const board = this.game.GetBoard();
		const currentBoardCopy = board.getCurrentBoard(ms.currentPlayer).slice();

		const moves: { [key: number]: number[] } = {};

		const permutations = this.getAllUniquePermutations(ms.remainingMoves);
		for (let i = 0; i < 24; i++) {
			const possibleMoves: number[] = [];
			if (currentBoardCopy[i] === 0) continue;
			for (const permutation of permutations) {
				const newMoveState = ms.getStateCopy();
				const newBoard = board.getBoardCopy();
				let currentPoint = i;
				for (let j = 0; j < permutation.length; j++) {
					const validationResult = this.IsMoveValid(newMoveState, newBoard, [currentPoint, currentPoint + permutation[j]]);
					if (!validationResult.IsValid()) {
						j = Infinity;
						continue;
					}
					newMoveState.remainingMoves.splice(newMoveState.remainingMoves.indexOf(permutation[j]), 1);
					newMoveState.doneMoves.push([currentPoint, currentPoint + permutation[j]]);
					newBoard.move(newMoveState.currentPlayer, currentPoint, currentPoint + permutation[j]);
					currentPoint += permutation[j];
					const found = possibleMoves.find((v) => v === currentPoint);
					if (!found) possibleMoves.push(currentPoint);
				}
			}
			if (possibleMoves.length > 0) {
				moves[i] = possibleMoves;
			}
		}
		return moves;
	}

	private getAllUniquePermutations(nums: number[]): number[][] {
		if (nums.length === 0) return [];
		if (nums.length === 2) {
			if (nums[0] === nums[1]) return [[nums[0], nums[1]]];
			return [
				[nums[0], nums[1]],
				[nums[1], nums[0]]
			];
		}
		return [nums];
	}

	MakeMove(move: [number, number]): boolean {
		const ms = this.game.GetCurrentMoveState();
		const board = this.game.GetBoard();
		return this.makeMove(ms, board, move);
	}

	private makeMove(ms: MoveState, board: Board, move: [number, number]): boolean {
		const moveLength = move[1] - move[0];
		const moves = ms.remainingMoves;

		const permutations = this.getAllUniquePermutations(moves);

		for (const perm of permutations) {
			let sum = 0;
			let i;
			for (i = 0; i < perm.length; i++) {
				sum += perm[i];
				if (sum === moveLength) break;
			}
			if (i === perm.length) continue;
			const usedMoves = perm.slice(0, i + 1);
			const newMoveState = ms.getStateCopy();
			const newBoard = board.getBoardCopy();

			const isValid = this.validateMove(newMoveState, newBoard, usedMoves, move[0]);
			if (!isValid) continue;

			const movestate = this.game.GetCurrentMoveState();
			if (movestate) {
				movestate.setRemainingMoves(newMoveState.remainingMoves);
				movestate.setDoneMoves(newMoveState.doneMoves);
			}
			const originBoard = this.game.GetBoard();
			if (originBoard) originBoard.ApplyBoard(newBoard);

			return true;
		}
		return false;
	}

	private validateMove(moveState: MoveState, board: Board, moves: number[], from: number): boolean {
		let currentPoint = from;
		for (const move of moves) {
			const validationResult = this.IsMoveValid(moveState, board, [currentPoint, currentPoint + move]);
			if (!validationResult.IsValid()) return false;
			moveState.remainingMoves.splice(moveState.remainingMoves.indexOf(move), 1);
			moveState.doneMoves.push([currentPoint, currentPoint + move]);
			board.move(moveState.currentPlayer, currentPoint, currentPoint + move);
			currentPoint += move;
		}
		return true;
	}

	IsMoveValid(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		let result: ValidationResult;

		for (const name in validators) {
			if (validators[name]) {
				result = validators[name](moveState, board, move);
				if (!result.IsValid()) return result;
			}
		}
		return new ValidationResult('', true);
	}

	toJSON(): any {
		return {};
	}
}

export default Engine;
