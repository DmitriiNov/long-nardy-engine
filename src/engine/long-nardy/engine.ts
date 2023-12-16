import Engine from '../engine';
import Board from '../../board';
import Move from '../../move';
import MoveState from '../../moveState';
import Player from '../../player';
import {ValidationResult, validators} from './moveValidators';
import MovesTreeNode from '../../movesTree';
class LongNardyEngine implements Engine {
	constructor(endGameCallback: (winner: Player | null) => void) {
		this.endGameCallback = endGameCallback;
	}
	private endGameCallback: (winner: Player | null) => void;

	MakeMove(moveState: MoveState, board: Board, move: Move): boolean {
		throw new Error('Method not implemented.');
	}

	StartMove(moveState: MoveState, board: Board, dices: [number, number]): boolean {
		throw new Error('Method not implemented.');
	}

	EndMove(moveState: MoveState, board: Board): boolean {
		throw new Error('Method not implemented.');
	}

	UndoLastMove(moveState: MoveState, board: Board): boolean {
		if (moveState.isMoveEnded()) {
			return false;
		}
		const lastMove = moveState.popLastDoneMove();
		if (lastMove === null) {
			return false;
		}
		board.addPiece(moveState.currentPlayer, lastMove[0]);
		board.removePiece(moveState.currentPlayer, lastMove[1]);
		return true;
	}

	GetPossibleMoves(moveState: MoveState, board: Board): Move[] {
		throw new Error('Method not implemented.');
	}

	GetNewMoveState(): MoveState {
		return new MoveState(1, new Player(true), [0, 0], [], []);	
	}

	GetNewBoard(): Board {
		return new Board(
			Board.ObjectToArray(24, {0: 15}),
			Board.ObjectToArray(24, {0: 15}),
		);
	}

	private setPossibleMoves(moveState: MoveState, board: Board) {
		const possibleMoves = this.findPossibleMoves(moveState, board);
		moveState.setMovesTree(possibleMoves);
	}

	private findPossibleMoves(moveState: MoveState, board: Board): MovesTreeNode {
		const moves = new MovesTreeNode();

		const currentBoardCopy = board.getCurrentBoard(moveState.currentPlayer).slice();
		const permutations = this.getAllUniquePermutations(moveState.getRemainingMoves());

		for (let i = 0; i < 24; i++) {
			
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

	private isMoveValid(moveState: MoveState, board: Board, move: [number, number]): ValidationResult {
		let result: ValidationResult;

		for (const name in validators) {
			if (validators[name]) {
				result = validators[name](moveState, board, move);
				if (!result.IsValid()) return result;
			}
		}
		return new ValidationResult('', true);
	}
}

export default LongNardyEngine;