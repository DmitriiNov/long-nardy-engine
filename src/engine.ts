import { Game } from "./game";
import { Board } from "./board";
import { MoveState } from "./states";
class Engine {
	constructor(game: Game) {
		this.game = game;
	}

	private game: Game;

	GetMovesTree(moveState: MoveState, board: Board): Array<Array<[number, number]>> {
		return [[[0, 0]]];
	}

	Move(move: [number, number]): boolean {
		const movesTree = this.GetMovesTree(this.game.GetCurrentMoveState(), this.game.GetBoard());
		return true;
	}
}

export { Engine };