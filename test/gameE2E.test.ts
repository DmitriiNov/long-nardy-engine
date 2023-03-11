import {describe, expect, test, beforeAll, beforeEach} from '@jest/globals';
import { Engine, ValidationResult } from '../src/engine';
import { Game } from '../src/game';
import { MoveState } from '../src/states';
import { Player } from '../src/player';
import { Board } from '../src/board';
const game = new Game();
game.InitGame([6, 1]);

describe('Make Move Testing', () => {
	test('6 move from starting position', () => {
		game.InitFirstMove([2, 4]);
		const ms = game.GetCurrentMoveState();
		console.debug(game.GetPossibleMoves())
		const result = game.Move([0, 6]);
		console.debug(game.GetBoard());
		expect(result).toEqual(true);
	});

	test('End move', () => {
		game.EndMove();
	});

	test('7 move from starting position (wrong)', () => {
		game.StartMove([2, 2])
		const ms = game.GetCurrentMoveState();
		const board = game.GetBoard();
		console.debug(game.GetPossibleMoves())
		const result = game.Move([0, 7]);
		expect(result).toEqual(false);
	});

	test('8 move from starting position', () => {
		const ms = game.GetCurrentMoveState();
		const board = game.GetBoard();
		console.debug(game.GetPossibleMoves())
		const result = game.Move([0, 8]);
		expect(result).toEqual(true);
	});

	test('End move', () => {
		game.EndMove();
	});

	test('7 move from starting position (wrong)', () => {
		game.StartMove([3, 5])
		const ms = game.GetCurrentMoveState();
		const board = game.GetBoard();
		console.debug(game.GetPossibleMoves())
		const result = game.Move([0, 8]);
		expect(result).toEqual(true);
	});
});