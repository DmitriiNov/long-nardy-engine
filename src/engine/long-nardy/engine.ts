import Engine from '../engine';
import Board from '../../board';
import Move from '../../move';
import MoveState from '../../moveState';
import Player from '../../player';
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

	private findPossibleMoves(moveState: MoveState, board: Board) {
		
	}
}

export default LongNardyEngine;