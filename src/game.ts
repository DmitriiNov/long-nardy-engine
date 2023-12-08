import Board from './board';
import Engine from './engine/engine';
import MoveState from './moveState';
import Player from './player';

enum GameType {
	Backgammon,
	LongNardy
}

class Game {
	private engine: Engine;
	private board: Board;
	private moveState: MoveState | null = null;
	private player1: Player;
	private player2: Player;
	private winner: Player | null = null;
	private ended: boolean = false;
	private readonly gameType: GameType;

	constructor() {}

	GameFinished(): boolean {
		return this.ended;
	}

	GetWinner(): Player | null {
		return this.winner;
	}

	private EndGameWithWinner(player: Player | null) {
		this.winner = player;
		this.ended = true;
	}

	MakeMove(move: Move): boolean {
		if (this.ended) return false;
		if (this.moveState === null) return false;
		this.engine.MakeMove(this.moveState, this.board, move);
	}

	StartMove(dices: [number, number]): boolean {
		if (this.ended) return false;
		if (this.moveState === null) return false;
		this.engine.StartMove(this.moveState, this.board, dices);
	}

	EndMove(): boolean {}

	UndoLastMove(): boolean {}

	GetPossibleMoves(): {};
}
