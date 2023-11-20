import MovesTreeNode from './engine/movesTree';
import Player from './player';

class MoveState {
	constructor(
		num: number,
		player: Player,
		dices: [number, number] | null,
		remainingMoves: number[] | null,
		doneMoves: Array<[number, number]> | null,
	) {
		this.moveNumber = num;
		this.currentPlayer = player;
		if (dices !== null) {
			this.dices = dices;
		}
		this.remainingMoves = [this.dices[0], this.dices[1]];
		if (this.dices[0] === this.dices[1]) {
			this.remainingMoves.push(this.dices[0], this.dices[1]);
		}
		if (remainingMoves !== null) {
			this.remainingMoves = remainingMoves;
		}
		if (doneMoves !== null) {
			this.doneMoves = doneMoves;
		}
		remainingMoves?.sort((a, b) => a - b);
	}

	readonly moveNumber: number;
	readonly currentPlayer: Player;
	readonly dices: [number, number] = [this.getRandomDice(), this.getRandomDice()];
	remainingMoves: number[];
	doneMoves: Array<[number, number]> = [];
	private isEnded: boolean = false;
	private movesTree: MovesTreeNode | null = null;

	removeFromRemainingMoves(move: number): boolean {
		const index = this.remainingMoves.indexOf(move);
		if (index === -1) {
			return false;
		}
		this.remainingMoves.splice(index, 1);
		return true;
	}

	addMove(move: [number, number]): void {
		this.doneMoves.push(move);
	}

	getRandomDice(): number {
		return Math.floor(Math.random() * 6) + 1;
	}

	endMove() {
		this.isEnded = true;
		this.movesTree = null;
	}

	setRemainingMoves(moves: number[]) {
		this.remainingMoves = moves;
	}

	removeFromRemainingMoves(move: number): boolean {
		const index = this.remainingMoves.indexOf(move);
		if (index === -1) {
			return false;
		}
		this.remainingMoves.splice(index, 1);
		return true;
	}

	addToDoneMoves(move: [number, number]) {
		this.doneMoves.push(move);
	}

	setMovesTree(tree: MovesTreeNode | null) {
		this.movesTree = tree;
	}

	getMovesTree(): MovesTreeNode | null {
		return this.movesTree;
	}

	isMoveEnded() {
		return this.isEnded;
	}

	getStateCopy() {
		const ms = new MoveState(this.moveNumber, this.currentPlayer, [...this.dices], [...this.remainingMoves], [...this.doneMoves]);
		ms.setMovesTree(this.getMovesTree());
		return ms;
	}
}

export default MoveState;
