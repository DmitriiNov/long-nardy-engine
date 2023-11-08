class MovesTreeNode {
	move: [number, number] | null;
	nextMoves: Array<MovesTreeNode> | null;

	constructor(from?: number, to?: number) {
		if (from !== undefined && to !== undefined) {
			this.move = [from, to];
			this.nextMoves = null;
			return
		}
		this.move = null;
		this.nextMoves = null;
	}

	static New(from?: number, to?: number, nextMoves?: Array<MovesTreeNode>): MovesTreeNode {
		const result = new MovesTreeNode(from, to);
		if (nextMoves)
			result.nextMoves = nextMoves;
		return result;
	}

	get dice() {
		if (this.move === null)
			return 0
		return this.move[1] - this.move[0];
	}

	addNextUniqueMove(moveNode: MovesTreeNode) {
		if (this.nextMoves === null)
			this.nextMoves = Array<MovesTreeNode>();
		this.nextMoves.push(moveNode);
	}

	filterMovesTree() {
		if (this.nextMoves === null)
			return;
		let maxDepth = this.calculateMaxDepth();
		this.clearChildren(1, maxDepth);
		let maxSum = this.calculateMaxSum();
		this.clearChildrenBySum(0, maxSum);
	}

	printNode(tab: number = 0): string {
		let node = "";
		if (this.move === null)
			node += ("===============\n");
		else
			node = `tab: ${tab} - ${this.move[0]} -> ${this.move[1]} (${this.dice})\n`;
		if (this.nextMoves !== null) {
			this.nextMoves.forEach(n => {
				node += n.printNode(tab + 1);
			})
		}
		if (this.move === null)
			node += "===============\n";
		return node;
	}

	clearChildrenBySum(currSum: number, maxSum: number) {
		if (this.nextMoves === null)
			return;
		const moves = Array<MovesTreeNode>();
		this.nextMoves.forEach(n => {
			const sum = n.calculateMaxSum();
			if (sum + currSum >= maxSum) {
				n.clearChildrenBySum(sum, maxSum);
				moves.push(n);
			}
		})
		this.nextMoves = moves.length > 0 ? moves : null;
	}

	calculateMaxSum(): number {
		if (this.nextMoves === null)
			return 0;
		return Math.max(...this.nextMoves.map(n => n.calculateMaxSum())) + this.dice;
	}

	clearChildren(currLevel: number, depthLevel: number) {
		if (this.nextMoves === null)
			return;
		const moves = Array<MovesTreeNode>();
		this.nextMoves.forEach(n => {
			const depth = n.calculateMaxDepth();
			if (depth + currLevel === depthLevel) {
				n.clearChildren(currLevel + 1, depthLevel);
				moves.push(n);
			}
		})
		this.nextMoves = moves.length > 0 ? moves : null;
	}

	calculateMaxDepth(k?: number): number {
		if (k === 0)
			return 0;
		if (k === undefined)
			k = 6;
		k--;
		if (this.nextMoves !== null) {
			return 1 + Math.max(...this.nextMoves.map(n => n.calculateMaxDepth(k)))
		}
		return 1;
	}

	nodeToObject(): { [key: number]: number[] } {
		const result: { [key: number]: number[] } = {};

		if (this.move !== null) {
			result[this.move[0]] = [this.move[1]];
		}

		if (this.nextMoves === null)
			return result;

		for (let node of this.nextMoves) {
			if (node.move)
				result[node.move[0]] = []
		}

		for (let node of this.nextMoves) {
			const nodeRes = node.nodeToObject();
			if (this.move !== null && node.move !== null && this.move[1] === node.move[0]) {
				result[this.move[0]].push(...nodeRes[node.move[0]]);
				for (const key in nodeRes) {
					if (key !== node.move[0].toString()) {
						if (result[key] !== undefined)
							result[key].push(...nodeRes[key]);
					}
				}
			} else {
				for (const key in nodeRes) {
					if (result[key] !== undefined)
						result[key].push(...nodeRes[key]);	
				}
			}
		}

		if (this.move !== null)
			return result;

		for (const key in result) {
			result[key] = Array.from(new Set(result[key])).sort((a, b) => a - b);
		}

		return result;
	}
}

export default MovesTreeNode;