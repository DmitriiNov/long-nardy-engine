import internal from 'stream';
import { Player } from './player';
class Board {
	constructor(white?: Array<number>, black?: Array<number>) {
		if (white)
			this.whiteBoard = white;
		else
			this.whiteBoard = Array(24).fill(0).map((_, i) => (i === 0 ? 15 : 0));

		if (black)
			this.blackBoard = black;
		else
			this.blackBoard = Array(24).fill(0).map((_, i) => (i === 0 ? 15 : 0));
	}

	whiteBoard: Array<number> = [];
	blackBoard: Array<number> = [];

	getCurrentBoard(player: Player): Array<number> {
		return player.isFirst ? this.whiteBoard : this.blackBoard;
	}

	getOpponentBoard(player: Player): Array<number> {
		return player.isFirst ? this.blackBoard : this.whiteBoard;
	}

	move (player: Player, from: number, to: number) {
		const brd = player.isFirst ? this.whiteBoard : this.blackBoard
		brd[from] -= 1;
		if (to < 24) {
			brd[to] += 1;
		};
	}

	getBoardCopy(): Board {
		const board = new Board();
		board.whiteBoard = this.whiteBoard.slice();
		board.blackBoard = this.blackBoard.slice();
		return board;
	}

	static ObjectToArray(pieces: {[key: number]: number}): Array<number> {
		return Array(24).fill(0).map((_, i) => (pieces[i] && pieces[i] > 0 ? pieces[i] : 0));
	}
}

export { Board };