import { Player } from './player';
class Board {
	constructor() {
		this.whiteBoard = Array(24).fill(0).map((_, i) => (i === 0 ? 15 : 0));
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

	getBoardCopy(): Board {
		const board = new Board();
		board.whiteBoard = this.whiteBoard.slice();
		board.blackBoard = this.blackBoard.slice();
		return board;
	}
}

export { Board };