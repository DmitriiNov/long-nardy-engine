import { describe, expect, test } from '@jest/globals';
import { Game, GameType } from '../src/game';

let game = Game.CreateNewGame(GameType.LongNardy);
game.InitGame([6, 1]);

function run(f: any, ...args: any[]) {
	let r: any = null;
	try {
		f(...args);
	} catch (e) {
		return false;
	}
	return r ?? true;
}

describe('Make Game e2e testing', () => {
	test('6 move from starting position', () => {
		game.StartMove([2, 4]);
		const result = run(game.MakeMove.bind(game), [0, 6]);
		expect(result).toEqual(true);
	});

	test('End move', () => {
		const result = run(game.EndMove.bind(game));
		expect(result).toEqual(true);
	});

	test('7 move from starting position (wrong)', () => {
		game.StartMove([2, 2]);
		const result = run(game.MakeMove.bind(game), [0, 7]);
		expect(result).toEqual(false);
	});

	test('6 move from starting position', () => {
		const result = run(game.MakeMove.bind(game), [0, 6]);
		expect(result).toEqual(true);
	});

	test('Export and Import', () => {
		console.debug(game);
		const gameExport = game.Export();
		console.debug(gameExport);

		const game2 = Game.ImportGame(gameExport);
		game = game2;

	});

	test('4 move from 4 with UNDO', () => {
		const undoMove = game.UndoLastMove();
		expect(undoMove).toEqual([4, 6]);

		const result = run(game.MakeMove.bind(game), [4, 8]);
		expect(result).toEqual(true);
	});

	test('End move', () => {
		game.EndMove();
	});

	test('Making one 3 move', () => {
		game.StartMove([3, 5]);
		const result = run(game.MakeMove.bind(game), [0, 3]);
		expect(result).toEqual(true);
	});

	test('Export and Import', () => {
		const result = run(game.Export.bind(game), [3, 8]);
		expect(result).toEqual(true);
	});
});