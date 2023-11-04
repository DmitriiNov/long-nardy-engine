import MovesTreeNode from "../src/engine/movesTree";
import { describe, expect, test } from '@jest/globals';
import Engine from "../src/engine/engine";
import { Game } from "../src/game";
import Board from "../src/board";
import MoveState from "../src/states/moveState";
import Player from "../src/player";


function getTree(struc: any, val?: number): MovesTreeNode {
	let result = new MovesTreeNode();
	if (val !== undefined)
		result = new MovesTreeNode(val, val + 1);
	if (struc === null)
		return result;
	for (const key in struc) {
		result.addNextUniqueMove(getTree(struc[key], parseInt(key)));
	}
	return result;
}

describe('MovesTreeNode', () => {

	test('Remove one main node', () => {
		const tree = getTree({ 0: { 1: null }, 2: null });
		const filteredTree = getTree({ 0: { 1: null } });
		tree.filterMovesTree();
		expect(tree).toEqual(filteredTree);
	});

	test('No filtering', () => {
		const tree = getTree({ 0: { 3: null }, 1: { 4: null } });
		const filteredTree = getTree({ 0: { 3: null }, 1: { 4: null } });
		tree.filterMovesTree();
		expect(tree).toEqual(filteredTree);
	});

	test('Hard example', () => {
		const tree = getTree({ 0: { 3: null }, 1: { 4: null, 5: { 6: null } }, 2: { 7: { 8: null } } });
		const filteredTree = getTree({ 1: { 5: { 6: null } }, 2: { 7: { 8: null } } },);
		tree.filterMovesTree();
		expect(tree).toEqual(filteredTree);
	});

	test('HeadToObject', () => {
		const movesTree: MovesTreeNode = MovesTreeNode.New(
			undefined, undefined,
			[
				MovesTreeNode.New(0, 2, [MovesTreeNode.New(2, 6), MovesTreeNode.New(3, 7)]),
				MovesTreeNode.New(0, 4, [MovesTreeNode.New(4, 6), MovesTreeNode.New(3, 5)]),
				MovesTreeNode.New(3, 5, [MovesTreeNode.New(0, 4), MovesTreeNode.New(5, 9)]),
				MovesTreeNode.New(3, 7, [MovesTreeNode.New(0, 2), MovesTreeNode.New(7, 9)]),
			]
		);

		const obj = {0: [2, 4, 6], 3: [5, 7, 9]};



		const newObj = movesTree.nodeToObject();
		expect(newObj).toEqual(obj);
	});

	test('HeadToObjecEasy', () => {
		const movesTree: MovesTreeNode = MovesTreeNode.New(
			undefined, undefined,
			[
				MovesTreeNode.New(3, 5, [ MovesTreeNode.New(5, 9)]),
				MovesTreeNode.New(3, 7, [ MovesTreeNode.New(7, 9)]),
			]
		);

		const obj = {3: [5, 7, 9]};

		const newObj = movesTree.nodeToObject();
		expect(newObj).toEqual(obj);
	});

	test('HeadToDeeper', () => {
		const movesTree: MovesTreeNode = MovesTreeNode.New(
			undefined, undefined,
			[
				MovesTreeNode.New(0, 2, [
					MovesTreeNode.New(2, 4, [
						MovesTreeNode.New(4, 6, [
							MovesTreeNode.New(6, 8),
							MovesTreeNode.New(3, 5)
						]),
						MovesTreeNode.New(3, 5, [
							MovesTreeNode.New(4, 6)
						])
					]),
					MovesTreeNode.New(3, 5, [
						MovesTreeNode.New(2, 4, [
							MovesTreeNode.New(4, 6)
						])
					]),
				]),
				MovesTreeNode.New(3, 5, [
					MovesTreeNode.New(0, 2, [
						MovesTreeNode.New(2, 4, [
							MovesTreeNode.New(4, 6)
						])
					])
				]),
			]
		);

		const obj = {0: [2, 4, 6, 8], 3: [5]};

		const newObj = movesTree.nodeToObject();
		expect(newObj).toEqual(obj);
	});
});