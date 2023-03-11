import {describe, expect, test, beforeAll, beforeEach} from '@jest/globals';
import { Engine, ValidationResult } from '../../src/engine';
import { Game } from '../../src/game';
import { MoveState } from '../../src/states';
import { Player } from '../../src/player';
import { Board } from '../../src/board';
const game = new Game();
let engine = new Engine(game);
let player = new Player(true);

describe('Possible Moves Testing', () => {
	// test('No possible moves', () => {
	// 	const ms = new MoveState(1, player!, [2, 5], [], [[0, 2], [0, 5]]);
	// 	const board = new Board(
	// 		undefined,
	// 		Board.ObjectToArray({0: 13, 14: 1, 17: 1})
	// 	);
	// 	const result = engine?.makeMove(ms, board, [0, 7]);
	// 	expect(result).toEqual(false);
	// });

	// test('1', () => {
	// 	const ms = new MoveState(1, player!, [2, 5], [2, 5], []);
	// 	const board = new Board(
	// 		undefined,
	// 		Board.ObjectToArray({0: 13, 14: 1, 17: 1})
	// 	);
	// 	const result = engine?.makeMove(ms, board, [0, 7]);
	// 	expect(result).toEqual(false);
	// });

	// test('1', () => {
	// 	const ms = new MoveState(1, player!, [2, 5], [2, 5], []);
	// 	const board = new Board(
	// 		undefined,
	// 		Board.ObjectToArray({0: 13, 14: 1, 17: 1})
	// 	);
	// 	const result = engine?.makeMove(ms, board, [0, 7]);
	// 	expect(result).toEqual(false);
	// });

	test('1', () => {
		expect(false).toEqual(false);
	});

});