import MovesTreeNode from '../src/movesTree';
import json from './tree.json';
import tree2 from './tree2.json';
import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals';

describe('Node Tree Conversions', () => {
	test('No folding the unrelated nodes', () => {
		const node = MovesTreeNode.CreateMoveTreeFromJson(json);
		console.debug(node.printNode());
		const res = node.getPossibleMovesObject();
		const exp = {
			'0': [1, 4, 5],
			'4': [5, 9],
			'5': [6, 9, 10],
			'6': [7, 10, 11],
			'7': [8, 11],
			'9': [10, 13],
			'10': [11, 15],
			'11': [15]
		};
		expect(res).toEqual(exp);
	});

	test('6 move from starting position', () => {
		const node = MovesTreeNode.CreateMoveTreeFromJson(tree2);
		console.debug(node.printNode());
		const res = node.getPossibleMovesObject();
		console.debug(res);
		const exp = {
		  '0': [5, 10, 15, 20],
		};
		expect(res).toEqual(exp);
	  });
});
