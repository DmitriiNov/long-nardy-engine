import { Game } from '../game';
import Board from '../board';
import MoveState from '../states/moveState';
import { ValidationResult, validators } from './moveValidators';
import MovesTreeNode from './movesTree';
class Engine {
	constructor(game: Game) {
		this.game = game;
	}

	private game: Game;

	GetPossibleMovesTree(): MovesTreeNode {
		const ms = this.game.GetCurrentMoveState();
		const board = this.game.GetBoard().getBoardCopy()
		let movesTree = this.calculatePossibleMovesTree(ms, board);
		movesTree.filterMovesTree();
		return movesTree;
	}

	private calculatePossibleMovesTree(ms: MoveState, board: Board): MovesTreeNode {
		const permutations = this.getAllUniquePermutations(ms.remainingMoves);
		const movesTree = new MovesTreeNode();
		for (let i = 0; i < 24; i++) {
			if (board.getCurrentBoard(ms.currentPlayer)[i] === 0) continue;
			for (const permutation of permutations) {
				const move :[number, number] = [i, i + permutation[0]];
				const newMoveState = ms.getStateCopy();
				const newBoard = board.getBoardCopy();
				const MoveValid = this.IsMoveValid(newMoveState, newBoard, move);
				if (!MoveValid.IsValid())
					continue;
				newBoard.move(newMoveState.currentPlayer, move[0], move[1]);
				newMoveState.remainingMoves.splice(newMoveState.remainingMoves.indexOf(permutation[0]), 1);
				newMoveState.doneMoves.push(move);
				const nextMovesTree = this.calculatePossibleMovesTree(newMoveState, newBoard);
				nextMovesTree.move = move;
				movesTree.addNextUniqueMove(nextMovesTree);
			}
		}
		return movesTree;
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
		const movesTree = ms.getMovesTree();
		if (movesTree === null) return false

		const movesTreeObject = movesTree.nodeToObject();

		if (!Array.isArray(movesTreeObject[move[0]]) || !movesTreeObject[move[0]].includes(move[1])) return false;

		ms.setRemainingMoves();
		ms.addToDoneMoves(move);
		originBoard.ApplyBoard(newBoard);
		return true;
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
