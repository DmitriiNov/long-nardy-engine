
class Board {
	constructor() {
		this.whiteBoard = Array(24).fill(0).map((_, i) => (i === 0 ? 15 : 0));
		this.blackBoard = Array(24).fill(0).map((_, i) => (i === 0 ? 15 : 0));
	}

	whiteBoard: Array<number> = [];
	blackBoard: Array<number> = [];
}

export { Board };