import Board from '../board';
import Move from '../move';
import MoveState from '../moveState';

interface Engine {
	MakeMove(moveState: MoveState, board: Board, move: Move): boolean;
	StartMove(moveState: MoveState, board: Board, dices: [number, number]): boolean;
	EndMove(moveState: MoveState, board: Board): boolean;
	UndoLastMove(moveState: MoveState, board: Board): boolean;

	GetPossibleMoves(moveState: MoveState, board: Board): Move[];
	GetNewMoveState(): MoveState;
	GetNewBoard(): Board;
}

export default Engine;
