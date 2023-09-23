import MovesTreeNode from "../src/engine/movesTree";
import { describe, expect, test } from '@jest/globals';


function getTree(struc: any): Array<MovesTreeNode> {
	const result: Array<MovesTreeNode> = [];
	for (const to in struc) {
		const moveNode = new MovesTreeNode(parseInt(to), parseInt(to)+1);

		if (struc[to] !== null) {
			const childNodes = getTree(struc[to]);
			childNodes.forEach(childNode => moveNode.addNextMove(childNode));
		}

		result.push(moveNode);
	}
	return result;
}

describe('MovesTreeNode', () => {

	test('Remove one main node', () => {
		const tree = getTree({0: {1: null}, 2: null});
		const filteredTree = getTree({0: {1: null}});

		expect(MovesTreeNode.filterMovesTree(tree)).toEqual(filteredTree);
	});

	test('No filtering', () => {
		const tree = getTree({0: {3: null}, 1: {4: null}});
		const filteredTree = getTree({0: {3: null}, 1: {4: null}});
		expect(MovesTreeNode.filterMovesTree(tree)).toEqual(filteredTree);
	});

	test('Hard example', () => {
		const tree = getTree({0: {3: null}, 1: {4: null, 5: {6: null}}, 2: {7: {8: null}}});
		const filteredTree = getTree({1: {5: {6: null}}, 2: {7: {8: null}}},)
		expect(MovesTreeNode.filterMovesTree(tree)).toEqual(filteredTree);
	});
});