import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals';
import Engine from '../src/engine/engine';
import { ValidationResult, validators } from '../src/engine/moveValidators';
import { Game } from '../src/game';
import MoveState from '../src/states/moveState';
import Player from '../src/player';
import Board from '../src/board';
const game = Game.CreateGame();
let engine = new Engine(game);
let player = new Player(true);
const trueVal = new ValidationResult('', true);

describe('Checking "IsMovePossible"', () => {
	const validatorFunction = validators['IsMovePossible'];
	const ms = new MoveState(1, player!, [6, 5], [6, 5], []);
	const board = new Board();
	test('Normal move', () => {
		const result = validatorFunction(ms, board, [3, 6]);
		expect(result).toEqual(trueVal);
	});

	test('Move "from" bigger than 23', () => {
		const result = validatorFunction(ms, board, [24, 28]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "from" less than 0', () => {
		const result = validatorFunction(ms, board, [-1, 3]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "to" bigger than 29', () => {
		const result = validatorFunction(ms, board, [23, 30]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "to" less than 1', () => {
		const result = validatorFunction(ms, board, [0, 0]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "to" equal "from', () => {
		const result = validatorFunction(ms, board, [2, 2]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "to" less "from', () => {
		const result = validatorFunction(ms, board, [4, 2]);
		expect(result?.IsValid()).toEqual(false);
	});
});

describe('Checking "IsThereAnyPiece"', () => {
	const board = new Board(Board.ObjectToArray({ 0: 10, 3: 4, 5: 1 }));
	const validatorFunction = validators['IsThereAnyPiece'];

	test('There are pieces', () => {
		let ms = new MoveState(1, player!, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board, [3, 6]);
		expect(result).toEqual(trueVal);
	});

	test('There are no pieces', () => {
		let ms = new MoveState(1, player!, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board, [4, 7]);
		expect(result?.IsValid()).toEqual(false);
	});
});

describe('Checking "IsThereNoPieceOnOpponentBoard"', () => {
	const board = new Board(Board.ObjectToArray({ 0: 10, 3: 4, 5: 1 }), Board.ObjectToArray({ 0: 14, 14: 1 }));
	const validatorFunction = validators['IsThereNoPieceOnOpponentBoard'];

	test('There are no pieces', () => {
		let ms = new MoveState(1, player!, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board, [0, 3]);
		expect(result).toEqual(trueVal);
	});

	test('There are pieces', () => {
		let ms = new MoveState(1, player!, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board, [0, 2]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('There are pieces far', () => {
		let ms = new MoveState(1, player!, [6, 6], [6, 6, 6, 6], []);
		const result = validatorFunction(ms, board, [0, 12]);
		expect(result?.IsValid()).toEqual(false);
	});
});

describe('Checking "IsOnlyOnePieceFromHead"', () => {
	const board = new Board();
	const validatorFunction = validators['IsOnlyOnePieceFromHead'];

	test('First move from head', () => {
		let ms = new MoveState(1, player!, [6, 5], [6, 5], [[2, 3]]);
		const result = validatorFunction(ms, board, [0, 5]);
		expect(result).toEqual(trueVal);
	});

	test('Only one piece from head', () => {
		let ms = new MoveState(1, player!, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board, [0, 5]);
		expect(result).toEqual(trueVal);
	});

	test('Second piece from head', () => {
		let ms = new MoveState(4, player!, [5, 5], [5, 5, 5], [[0, 5]]);
		const result = validatorFunction(ms, board, [0, 5]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Second piece from head on move 1 with 3', () => {
		let ms = new MoveState(1, player!, [3, 3], [3, 3, 3], [[0, 3]]);
		const result = validatorFunction(ms, board, [0, 3]);
		expect(result).toEqual(trueVal);
	});

	test('Second piece from head on move 1 with 5', () => {
		let ms = new MoveState(1, player!, [5, 5], [5, 5, 5], [[0, 5]]);
		const result = validatorFunction(ms, board, [0, 5]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Third piece from head on move 1 with 3', () => {
		let ms = new MoveState(
			1,
			player!,
			[3, 3],
			[3, 3],
			[
				[0, 3],
				[0, 3]
			]
		);
		const result = validatorFunction(ms, board, [0, 3]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('No two heads when 20 is occupied', () => {
		const board = new Board(undefined, Board.ObjectToArray({ 0: 14, 20: 1 }));
		let ms = new MoveState(2, player!, [4, 4], [4, 4, 4], [[0, 4]]);
		const result = validatorFunction(ms, board, [0, 4]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('4x4 problem', () => {
		const board = new Board();
		let ms = new MoveState(2, player!, [4, 4], [4, 4], [[0, 8]]);
		const result = validatorFunction(ms, board, [0, 4]);
		expect(result).toEqual(trueVal);
	});
});

describe('Checking "IsNoSixBlocked"', () => {
	const validatorFunction = validators['IsNoSixBlocked'];
	test('Six no block', () => {
		const board = new Board(Board.ObjectToArray({ 0: 10, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1 }));
		let ms = new MoveState(12, player!, [2, 3], [2, 3], []);
		const result = validatorFunction(ms, board, [4, 6]);
		expect(result).toEqual(trueVal);
	});

	test('Six block 1', () => {
		const board = new Board(
			Board.ObjectToArray({ 0: 6, 3: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1 }),
			Board.ObjectToArray({ 0: 7, 11: 1, 13: 1 })
		);
		let ms = new MoveState(12, player!, [3, 6], [3, 6], []);
		const result = validatorFunction(ms, board, [3, 6]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block 2 ', () => {
		const board = new Board(Board.ObjectToArray({ 0: 11, 1: 1, 2: 1, 3: 1, 23: 1 }), Board.ObjectToArray({ 0: 15 }));
		let ms = new MoveState(12, player!, [4, 2], [4, 2], []);
		const result = validatorFunction(ms, board, [0, 4]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block 2 Opposite', () => {
		const board = new Board(Board.ObjectToArray({ 0: 11, 1: 1, 2: 1, 3: 1, 23: 1 }), Board.ObjectToArray({ 0: 14, 20: 1 }));
		let ms = new MoveState(12, player!, [4, 2], [4, 2], []);
		const result = validatorFunction(ms, board, [0, 4]);
		expect(result).toEqual(trueVal);
	});

	test('Six block 3', () => {
		const board = new Board(Board.ObjectToArray({ 22: 1, 21: 1, 20: 1, 19: 1, 18: 1, 17: 0, 16: 1 }), Board.ObjectToArray({ 0: 15 }));
		let ms = new MoveState(12, player!, [1, 1], [1, 1, 1, 1], []);
		const result = validatorFunction(ms, board, [16, 17]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block 3 Opposite', () => {
		const board = new Board(
			Board.ObjectToArray({ 22: 1, 21: 1, 20: 1, 19: 1, 18: 1, 17: 0, 16: 1 }),
			Board.ObjectToArray({ 0: 14, 13: 1 })
		);
		let ms = new MoveState(12, player!, [1, 1], [1, 1, 1, 1], []);
		const result = validatorFunction(ms, board, [16, 17]);
		expect(result).toEqual(trueVal);
	});

	test('Six block', () => {
		const board = new Board(Board.ObjectToArray({ 0: 10, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1 }), Board.ObjectToArray({ 0: 14, 13: 1 }));
		let ms = new MoveState(12, player!, [3, 6], [3, 6], []);
		const result = validatorFunction(ms, board, [0, 6]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block but opponent forward', () => {
		const board = new Board(Board.ObjectToArray({ 0: 10, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1 }), Board.ObjectToArray({ 0: 14, 23: 1 }));
		let ms = new MoveState(12, player!, [3, 6], [3, 6], []);
		const result = validatorFunction(ms, board, [0, 6]);
		expect(result).toEqual(trueVal);
	});

	test('Six block', () => {
		const board = new Board(Board.ObjectToArray({ 0: 11, 1: 1, 2: 1, 3: 1, 4: 1 }), Board.ObjectToArray({ 0: 15 }));
		let ms = new MoveState(12, player!, [5, 2], [5, 2], []);
		const result = validatorFunction(ms, board, [0, 5]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block', () => {
		const board = new Board(Board.ObjectToArray({ 0: 11, 2: 2, 3: 1, 4: 1, 5: 1, 6: 1 }), Board.ObjectToArray({ 0: 15 }));
		let ms = new MoveState(12, player!, [5, 2], [5, 2], []);
		const result = validatorFunction(ms, board, [2, 7]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block', () => {
		const board = new Board(Board.ObjectToArray({ 0: 11, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 }), Board.ObjectToArray({ 0: 15 }));
		let ms = new MoveState(12, player!, [5, 2], [5, 2], []);
		const result = validatorFunction(ms, board, [2, 7]);
		expect(result).toEqual(trueVal);
	});

});

describe('Checking "AreAllPiecesAtHome"', () => {
	const validatorFunction = validators['AreAllPiecesAtHome'];

	test('All pieces are at home', () => {
		const board = new Board(Board.ObjectToArray({ 19: 3, 22: 12 }));
		let ms = new MoveState(12, player!, [5, 4], [5, 4], []);
		const result = validatorFunction(ms, board, [19, 24]);
		expect(result).toEqual(trueVal);
	});

	test('Not all pieces are at home', () => {
		const board = new Board(Board.ObjectToArray({ 16: 1, 19: 3, 22: 11 }));
		let ms = new MoveState(12, player!, [5, 4], [5, 4], []);
		const result = validatorFunction(ms, board, [19, 24]);
		expect(result?.IsValid()).toEqual(false);
	});
});

describe('Checking "AreThereNoAlternativeMoves"', () => {
	const validatorFunction = validators['AreThereNoAlternativeMoves'];

	test('There are no alternatives 1', () => {
		const board = new Board(Board.ObjectToArray({ 19: 3, 22: 12 }));
		let ms = new MoveState(12, player!, [6, 6], [6, 6, 6, 6], []);
		const result = validatorFunction(ms, board, [19, 25]);
		expect(result).toEqual(trueVal);
	});

	test('There are no alternatives 2', () => {
		const board = new Board(Board.ObjectToArray({ 20: 1, 22: 1 }));
		let ms = new MoveState(12, player!, [3, 5], [3, 5], []);
		const result = validatorFunction(ms, board, [22, 27]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('There are no alternatives 3', () => {
		const board = new Board(Board.ObjectToArray({ 20: 1, 21: 1 }));
		let ms = new MoveState(12, player!, [3, 5], [3, 5], []);
		const result = validatorFunction(ms, board, [22, 24]);
		expect(result).toEqual(trueVal);
	});

	test('There are no alternatives 4', () => {
		const board = new Board(Board.ObjectToArray({ 19: 3, 22: 12 }));
		let ms = new MoveState(12, player!, [3, 3], [3, 3, 3, 3], []);
		const result = validatorFunction(ms, board, [22, 25]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('There are no alternatives (blocked)', () => {
		const board = new Board(Board.ObjectToArray({ 18: 1, 21: 1 }), Board.ObjectToArray({ 10: 1 }));
		let ms = new MoveState(12, player!, [4, 1], [4], [[23, 24]]);
		const result = validatorFunction(ms, board, [21, 25]);
		expect(result?.IsValid()).toEqual(false);
	});
});
