import Player from '../player';
import Board from '../board';

class GameState {
	constructor(player1: Player, player2: Player, board?: Board, moveCounter?: number) {
		this.player1 = player1;
		this.player2 = player2;
		if (board) this.board = board;
		else this.board = new Board();

		if (moveCounter) this.moveCounter = moveCounter;
	}

	readonly board: Board;
	readonly player1: Player;
	readonly player2: Player;

	private winner?: Player;
	private gameEnded: boolean = false;
	private moveCounter: number = 1;

	EndGame() {
		this.gameEnded = true;
	}

	HasGameEnded(): boolean {
		return this.gameEnded;
	}

	GetWinner(): Player | undefined {
		return this.winner;
	}

	SetWinner(player: Player) {
		if (player === this.player1 || player === this.player2) this.winner = player;
	}

	GetMoveCount(): number {
		return this.moveCounter;
	}

	IncrementMoveCounter() {
		this.moveCounter++;
	}
}

export default GameState;
