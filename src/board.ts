import Player from './player';

class Board {
	constructor(white?: number[], black?: number[]) {
		if (white) this.whiteBoard = white;
		else
			this.whiteBoard = Array(24)
				.fill(0)
				.map((_, i) => (i === 0 ? 15 : 0));

		if (black) this.blackBoard = black;
		else
			this.blackBoard = Array(24)
				.fill(0)
				.map((_, i) => (i === 0 ? 15 : 0));
	}

	whiteBoard: number[] = [];
	blackBoard: number[] = [];

	getCurrentBoard(player: Player): number[] {
		return player.isFirst ? this.whiteBoard : this.blackBoard;
	}

	getOpponentBoard(player: Player): number[] {
		return player.isFirst ? this.blackBoard : this.whiteBoard;
	}

	move(player: Player, from: number, to: number) {
		const brd = player.isFirst ? this.whiteBoard : this.blackBoard;
		if (from < 24) brd[from] -= 1;
		if (to < 24) brd[to] += 1;
	}

	getBoardCopy(): Board {
		const board = new Board();
		board.whiteBoard = this.whiteBoard.slice();
		board.blackBoard = this.blackBoard.slice();
		return board;
	}

	ApplyBoard(board: Board) {
		this.whiteBoard = board.whiteBoard.slice();
		this.blackBoard = board.blackBoard.slice();
	}

	CountPieces(player: Player): number {
		const count = (player.isFirst ? this.whiteBoard : this.blackBoard).reduce((acc, val) => acc + val, 0);
		return count;
	}

	static ObjectToArray(pieces: { [key: number]: number }): number[] {
		return Array(24)
			.fill(0)
			.map((_, i) => (pieces[i] && pieces[i] > 0 ? pieces[i] : 0));
	}
}

export default Board;
