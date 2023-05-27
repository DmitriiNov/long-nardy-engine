import { describe, expect, test } from '@jest/globals';
import { Game } from '../src/game';

let game = Game.CreateGame();
game.InitGame([6, 1]);

describe('Make Game e2e testing', () => {
	test('6 move from starting position', () => {
		game.StartMove([2, 4]);
		const ms = game.GetCurrentMoveState();
		const result = game.Move([0, 6]);
		expect(result).toEqual(true);
	});

	test('End move', () => {
		game.EndMove();
	});

	test('7 move from starting position (wrong)', () => {
		game.StartMove([2, 2]);
		const board = game.GetBoard();
		const result = game.Move([0, 7]);
		expect(result).toEqual(false);
	});

	test('6 move from starting position', () => {
		const board = game.GetBoard();
		const result = game.Move([0, 6]);
		expect(result).toEqual(true);
	});

	test('4 move from 4 with UNDO', () => {
		const undoMove = game.UndoLastMove();
		expect(undoMove).toEqual([4, 6]);

		const result = game.Move([4, 8]);
		expect(result).toEqual(true);
	});

	test('End move', () => {
		game.EndMove();
	});

	test('Making one 3 move', () => {
		game.StartMove([3, 5]);
		const result = game.Move([0, 3]);
		expect(result).toEqual(true);
	});

	test('Export and Import', () => {
		const gameExport = game.Export();
		game = Game.CreateGame(gameExport);
		const result = game.Move([3, 8]);
		expect(result).toEqual(true);
	});
});
