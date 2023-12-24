import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals';
import { ValidationResult, validators } from '../src/engine/long-nardy/moveValidators';
import MoveState from '../src/moveState';
import Board from '../src/board';
const trueVal = new ValidationResult('', true);


class Brd {
	board: Board;
	constructor(a?: any, b?: any) {
		if (a === undefined) {
			a = Brd.ObjectToArray({0: 15})
		}
		if (b === undefined) {
			b = Brd.ObjectToArray({0: 15})
		}
		this.board = new Board(a, b);
	}

	static ObjectToArray(obj: { [key: number]: number }) {
		return Board.ObjectToArray(24, obj);
	}
}



describe('Checking "IsMovePossible"', () => {
	const validatorFunction = validators['IsMovePossible'];
	const ms = new MoveState(1, true, [6, 5], [6, 5], []);
	const board = new Brd();
	test('Normal move', () => {
		const result = validatorFunction(ms, board.board, [3, 6]);
		expect(result).toEqual(trueVal);
	});

	test('Move "from" bigger than 23', () => {
		const result = validatorFunction(ms, board.board, [24, 28]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "from" less than 0', () => {
		const result = validatorFunction(ms, board.board, [-1, 3]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "to" bigger than 29', () => {
		const result = validatorFunction(ms, board.board, [23, 30]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "to" less than 1', () => {
		const result = validatorFunction(ms, board.board, [0, 0]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "to" equal "from', () => {
		const result = validatorFunction(ms, board.board, [2, 2]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Move "to" less "from', () => {
		const result = validatorFunction(ms, board.board, [4, 2]);
		expect(result?.IsValid()).toEqual(false);
	});
});

describe('Checking "IsThereAnyPiece"', () => {
	const board = new Brd(Brd.ObjectToArray({ 0: 10, 3: 4, 5: 1 }));
	const validatorFunction = validators['IsThereAnyPiece'];

	test('There are pieces', () => {
		let ms = new MoveState(1, true, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board.board, [3, 6]);
		expect(result).toEqual(trueVal);
	});

	test('There are no pieces', () => {
		let ms = new MoveState(1, true, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board.board, [4, 7]);
		expect(result?.IsValid()).toEqual(false);
	});
});

describe('Checking "IsThereNoPieceOnOpponentBoard"', () => {
	const board = new Brd(Brd.ObjectToArray({ 0: 10, 3: 4, 5: 1 }), Brd.ObjectToArray({ 0: 14, 14: 1 }));
	const validatorFunction = validators['IsThereNoPieceOnOpponentBoard'];

	test('There are no pieces', () => {
		let ms = new MoveState(1, true, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board.board, [0, 3]);
		expect(result).toEqual(trueVal);
	});

	test('There are pieces', () => {
		let ms = new MoveState(1, true, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board.board, [0, 2]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('There are pieces far', () => {
		let ms = new MoveState(1, true, [6, 6], [6, 6, 6, 6], []);
		const result = validatorFunction(ms, board.board, [0, 12]);
		expect(result?.IsValid()).toEqual(false);
	});
});

describe('Checking "IsOnlyOnePieceFromHead"', () => {
	const board = new Brd();
	const validatorFunction = validators['IsOnlyOnePieceFromHead'];

	test('First move from head', () => {
		let ms = new MoveState(1, true, [6, 5], [6, 5], [[2, 3]]);
		const result = validatorFunction(ms, board.board, [0, 5]);
		expect(result).toEqual(trueVal);
	});

	test('Only one piece from head', () => {
		let ms = new MoveState(1, true, [6, 5], [6, 5], []);
		const result = validatorFunction(ms, board.board, [0, 5]);
		expect(result).toEqual(trueVal);
	});

	test('Second piece from head', () => {
		let ms = new MoveState(4, true, [5, 5], [5, 5, 5], [[0, 5]]);
		const result = validatorFunction(ms, board.board, [0, 5]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Second piece from head on move 1 with 3', () => {
		let ms = new MoveState(1, true, [3, 3], [3, 3, 3], [[0, 3]]);
		const result = validatorFunction(ms, board.board, [0, 3]);
		expect(result).toEqual(trueVal);
	});

	test('Second piece from head on move 1 with 5', () => {
		let ms = new MoveState(1, true, [5, 5], [5, 5, 5], [[0, 5]]);
		const result = validatorFunction(ms, board.board, [0, 5]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Third piece from head on move 1 with 3', () => {
		let ms = new MoveState(
			1,
			true,
			[3, 3],
			[3, 3],
			[
				[0, 3],
				[0, 3]
			]
		);
		const result = validatorFunction(ms, board.board, [0, 3]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('No two heads when 20 is occupied', () => {
		const board = new Brd(undefined, Brd.ObjectToArray({ 0: 14, 20: 1 }));
		let ms = new MoveState(2, true, [4, 4], [4, 4, 4], [[0, 4]]);
		const result = validatorFunction(ms, board.board, [0, 4]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('4x4 problem', () => {
		const board = new Brd();
		let ms = new MoveState(2, true, [4, 4], [4, 4], [[0, 8]]);
		const result = validatorFunction(ms, board.board, [0, 4]);
		expect(result).toEqual(trueVal);
	});
});

describe('Checking "IsNoSixBlocked"', () => {
	const validatorFunction = validators['IsNoSixBlocked'];
	test('Six no block', () => {
		const board = new Brd(Brd.ObjectToArray({ 0: 10, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1 }));
		let ms = new MoveState(12, true, [2, 3], [2, 3], []);
		const result = validatorFunction(ms, board.board, [4, 6]);
		expect(result).toEqual(trueVal);
	});

	test('Six block by Lesni4iy', () => {
		const board = new Brd(
			Brd.ObjectToArray({ 0: 6, 3: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1 }),
			Brd.ObjectToArray({ 0: 7, 11: 1, 13: 1 })
		);
		let ms = new MoveState(12, true, [3, 6], [3, 6], []);
		const result = validatorFunction(ms, board.board, [3, 6]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block', () => {
		const board = new Brd(Brd.ObjectToArray({ 0: 10, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1 }), Brd.ObjectToArray({ 0: 14, 13: 1 }));
		let ms = new MoveState(12, true, [3, 6], [3, 6], []);
		const result = validatorFunction(ms, board.board, [0, 6]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block but opponent forward', () => {
		const board = new Brd(Brd.ObjectToArray({ 0: 10, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1 }), Brd.ObjectToArray({ 0: 14, 23: 1 }));
		let ms = new MoveState(12, true, [3, 6], [3, 6], []);
		const result = validatorFunction(ms, board.board, [0, 6]);
		expect(result).toEqual(trueVal);
	});

	test('Six block', () => {
		const board = new Brd(Brd.ObjectToArray({ 0: 11, 1: 1, 2: 1, 3: 1, 4: 1 }), Brd.ObjectToArray({ 0: 15 }));
		let ms = new MoveState(12, true, [5, 2], [5, 2], []);
		const result = validatorFunction(ms, board.board, [0, 5]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block', () => {
		const board = new Brd(Brd.ObjectToArray({ 0: 11, 2: 2, 3: 1, 4: 1, 5: 1, 6: 1 }), Brd.ObjectToArray({ 0: 15 }));
		let ms = new MoveState(12, true, [5, 2], [5, 2], []);
		const result = validatorFunction(ms, board.board, [2, 7]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('Six block', () => {
		const board = new Brd(Brd.ObjectToArray({ 0: 11, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 }), Brd.ObjectToArray({ 0: 15 }));
		let ms = new MoveState(12, true, [5, 2], [5, 2], []);
		const result = validatorFunction(ms, board.board, [2, 7]);
		expect(result).toEqual(trueVal);
	});
});

describe('Checking "AreAllPiecesAtHome"', () => {
	const validatorFunction = validators['AreAllPiecesAtHome'];

	test('All pieces are at home', () => {
		const board = new Brd(Brd.ObjectToArray({ 19: 3, 22: 12 }));
		let ms = new MoveState(12, true, [5, 4], [5, 4], []);
		const result = validatorFunction(ms, board.board, [19, 24]);
		expect(result).toEqual(trueVal);
	});

	test('Not all pieces are at home', () => {
		const board = new Brd(Brd.ObjectToArray({ 16: 1, 19: 3, 22: 11 }));
		let ms = new MoveState(12, true, [5, 4], [5, 4], []);
		const result = validatorFunction(ms, board.board, [19, 24]);
		expect(result?.IsValid()).toEqual(false);
	});
});

describe('Checking "AreThereNoAlternativeMoves"', () => {
	const validatorFunction = validators['AreThereNoAlternativeMoves'];

	test('There are no alternatives 1', () => {
		const board = new Brd(Brd.ObjectToArray({ 19: 3, 22: 12 }));
		let ms = new MoveState(12, true, [6, 6], [6, 6, 6, 6], []);
		const result = validatorFunction(ms, board.board, [19, 25]);
		expect(result).toEqual(trueVal);
	});

	test('There are no alternatives 2', () => {
		const board = new Brd(Brd.ObjectToArray({ 20: 1, 22: 1 }));
		let ms = new MoveState(12, true, [3, 5], [3, 5], []);
		const result = validatorFunction(ms, board.board, [22, 27]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('There are no alternatives 3', () => {
		const board = new Brd(Brd.ObjectToArray({ 20: 1, 21: 1 }));
		let ms = new MoveState(12, true, [3, 5], [3, 5], []);
		const result = validatorFunction(ms, board.board, [22, 24]);
		expect(result).toEqual(trueVal);
	});

	test('There are no alternatives 4', () => {
		const board = new Brd(Brd.ObjectToArray({ 19: 3, 22: 12 }));
		let ms = new MoveState(12, true, [3, 3], [3, 3, 3, 3], []);
		const result = validatorFunction(ms, board.board, [22, 25]);
		expect(result?.IsValid()).toEqual(false);
	});

	test('There are no alternatives (blocked)', () => {
		const board = new Brd(Brd.ObjectToArray({ 18: 1, 21: 1 }), Brd.ObjectToArray({ 10: 1 }));
		let ms = new MoveState(12, true, [4, 1], [4], [[23, 24]]);
		const result = validatorFunction(ms, board.board, [21, 25]);
		expect(result?.IsValid()).toEqual(false);
	});
});
