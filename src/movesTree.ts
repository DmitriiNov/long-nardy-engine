class MovesTreeNode {
	move: [number, number] | null = null;
	nextMoves: Array<MovesTreeNode> | null = null;

	constructor(from?: number, to?: number) {
		if (from !== undefined && to !== undefined) this.move = [from, to];
	}

	get dice() {
		return this.move === null ? 0 : this.move[1] - this.move[0];
	}

	static New(from?: number, to?: number, nextMoves?: Array<MovesTreeNode>): MovesTreeNode {
		const result = new MovesTreeNode(from, to);
		if (nextMoves) result.nextMoves = nextMoves;
		return result;
	}

	printNode(tab: number = 0): string {
		let node = this.move === null ? '===============\n' : `${'\t'.repeat(tab)}- ${tab} - [${this.move[0]} -> ${this.move[1]}]\n`;
		if (this.nextMoves === null) return node + '===============\n';

		this.nextMoves.forEach((n) => {
			node += n.printNode(tab + 1);
		});
		return node;
	}

	getPossibleMovesObject(): { [key: number]: number[] } {
		if (this.move !== null) throw new Error('This is not root node');
		return this.nodeToObject();
	}

	private nodeToObject(): { [key: number]: number[] } {
		const result: { [key: number]: number[] } = {};

		if (this.move !== null) result[this.move[0]] = [this.move[1]];

		this.childrenToObjects(result);

		if (this.move !== null) return result;

		for (const key in result) result[key] = Array.from(new Set(result[key])).sort((a, b) => a - b);

		return result;
	}

	private childrenToObjects(result: { [key: number]: number[] }): void {
		if (this.nextMoves === null) return;
		for (let node of this.nextMoves) {
			if (node.move && !Array.isArray(result[node.move[0]])) result[node.move[0]] = [];

			const nodeRes = node.nodeToObject();

			if (this.move === null || node.move === null || this.move[1] !== node.move[0]) {
				for (const key in nodeRes) {
					if (result[key] !== undefined) result[key].push(...nodeRes[key]);
				}
				continue;
			}
			result[this.move[0]].push(...nodeRes[node.move[0]]);
			for (const key in nodeRes) {
				if (key !== node.move[0].toString() && result[key] !== undefined) result[key].push(...nodeRes[key]);
			}
		}
	}

	findIfCombinedMovePossible(from: number, to: number): boolean {
		if (this.move !== null) throw new Error('This is not root node');
		return this.nodeToFind(from, to);
	}

	private nodeToFind(from: number, to: number): boolean {
		if (this.nextMoves === null) return false;
		for (let node of this.nextMoves) {
			if (node.move && node.move[0] === from && node.move[1] === to) return true;
			if (node.move && node.move[0] === from && node.move[1] < to) return node.nodeToFind(node.move[1], to);
		}
		return false;
	}

	filterMovesTree() {
		if (this.move !== null) throw new Error('This is not root node');
		if (this.nextMoves === null) return;
		this.clearChildrenBySum();
	}

	private clearChildrenBySum() {
		if (this.nextMoves === null) return;
		const moves = Array<MovesTreeNode>();
		const maxSum = this.calculateMaxSum();
		this.nextMoves.forEach((n) => {
			const sum = n.calculateMaxSum();
			if (this.dice + sum >= maxSum) {
				n.clearChildrenBySum();
				moves.push(n);
			}
		});
		this.nextMoves = moves.length > 0 ? moves : null;
	}

	private calculateMaxSum(): number {
		if (this.nextMoves === null) return this.dice;
		return Math.max(...this.nextMoves.map((n) => n.calculateMaxSum())) + this.dice;
	}

	allMovesToArray(): [number, number][][] {
		if (this.move !== null) throw new Error('This is not root node');
		const result: [number, number][][] = this.convertToMovesArray();
		return result;
	}

	private convertToMovesArray(path: [number, number][] = []): [number, number][][] {
		let result: [number, number][][] = [];
		if (this.move !== null) {
			path = [...path, this.move];
		}
		if (this.nextMoves === null) {
			if (path.length > 0) result.push(path);
		} else {
			for (let child of this.nextMoves) {
				result = result.concat(child.convertToMovesArray(path));
			}
		}
		return result;
	}
}

export default MovesTreeNode;
