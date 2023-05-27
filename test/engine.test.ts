import { describe, expect, test, beforeEach } from '@jest/globals';
import Engine from '../src/engine/engine';
import MoveState from '../src/states/moveState';
import GameState from '../src/states/gameState';
import { Game } from '../src/game';
import Player from '../src/player';
import Board from '../src/board';

describe('Engine', () => {
	let engine: Engine;
	let game: Game;

	beforeEach(() => {
		game = Game.CreateGame();
		engine = new Engine(game);
	});

	test('Get possible moves should work', () => {
		const ms = new MoveState(1, new Player(true), [2, 4], [2, 4], []);
		const board = new Board(Board.ObjectToArray({ 0: 10, 2: 2, 8: 3 }));
		const possibleMoves = engine['getPossibleMoves'](ms, board);
		expect(possibleMoves[0].sort()).toEqual([2, 4, 6]);
		expect(possibleMoves[2].sort()).toEqual([4, 6, 8]);
		expect(possibleMoves[8].sort()).toEqual([10, 14]);
	});

	test('should return all unique permutations', () => {
		const result = engine['getAllUniquePermutations']([1, 2]);
		expect(result).toHaveLength(2);
	});
});
