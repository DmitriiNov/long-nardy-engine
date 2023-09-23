class MovesTreeNode {
	move: [number, number];
	dice: number;
	nextMoves: Array<MovesTreeNode> | null;

	constructor(from: number, to: number) {
		this.move = [from, to];
		this.dice = to - from;
		this.nextMoves = null;
	}

	addNextMove(moveNode: MovesTreeNode) {
		if (this.nextMoves === null)
			this.nextMoves = Array<MovesTreeNode>();
		this.nextMoves.push(moveNode);
	}

	static filterMovesTree(movesTree: Array<MovesTreeNode>): Array<MovesTreeNode> {
		let maxDepth = 0;
		movesTree.forEach(n => {
			maxDepth = Math.max(n.calculateMaxDepth(), maxDepth);
		});
		const resultingNodes = Array<MovesTreeNode>();
		movesTree.forEach(n => {
			const depth = n.calculateMaxDepth();
			if (depth === maxDepth) {
				n.cleanChildren(1, maxDepth)
				resultingNodes.push(n);
			}
		})
		return resultingNodes;
	}

	cleanChildren(currLevel: number, depthLevel: number) {
		if (this.nextMoves === null)
			return;
		const moves = Array<MovesTreeNode>();
		this.nextMoves.forEach(n => {
			const depth = n.calculateMaxDepth();
			if (depth + currLevel === depthLevel) {
				n.cleanChildren(currLevel + 1, depthLevel);
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
}

export default MovesTreeNode;