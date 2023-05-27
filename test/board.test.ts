import { describe, expect, test, beforeEach } from '@jest/globals';
import Player from '../src/player';
import Board from '../src/board';

describe('Board', () => {
	let board: Board;

	beforeEach(() => {
		board = new Board();
	});

	test('should initialize with default white and black boards', () => {
		expect(board['whiteBoard']).toEqual(Board.ObjectToArray({ 0: 15 }));
		expect(board['blackBoard']).toEqual(Board.ObjectToArray({ 0: 15 }));
	});

	test('should return the current board based on the player', () => {
		const player1 = new Player(true);
		const player2 = new Player(false);
		expect(board.getCurrentBoard(player1)).toBe(board['whiteBoard']);
		expect(board.getCurrentBoard(player2)).toBe(board['blackBoard']);
	});

	test('should return the opponent board based on the player', () => {
		const player1 = new Player(true);
		const player2 = new Player(false);
		expect(board.getOpponentBoard(player1)).toBe(board['blackBoard']);
		expect(board.getOpponentBoard(player2)).toBe(board['whiteBoard']);
	});

	test('should move pieces correctly on the board', () => {
		const player1 = new Player(true);
		const player2 = new Player(false);
		board.move(player1, 0, 5);
		expect(board['whiteBoard'][0]).toEqual(14);
		expect(board['whiteBoard'][5]).toEqual(1);

		board.move(player2, 10, 15);
		expect(board['blackBoard'][10]).toEqual(0);
		expect(board['blackBoard'][15]).toEqual(1);
	});

	test('should return a copy of the board', () => {
		const copiedBoard = board.getBoardCopy();
		expect(copiedBoard).toBeInstanceOf(Board);
		expect(copiedBoard).toEqual(board);
		expect(copiedBoard['whiteBoard']).toEqual(board['whiteBoard']);
		expect(copiedBoard['blackBoard']).toEqual(board['blackBoard']);
	});

	test('should apply the provided board correctly', () => {
		const newBoard = new Board([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46]);
		board.ApplyBoard(newBoard);
		expect(board['whiteBoard']).toEqual(newBoard['whiteBoard']);
		expect(board['blackBoard']).toEqual(newBoard['blackBoard']);
	});

	test('should count the number of pieces correctly for the player', () => {
		const player1 = new Player(true);
		const player2 = new Player(false);
		expect(board.CountPieces(player1)).toEqual(15);
		expect(board.CountPieces(player2)).toEqual(15);

		board['whiteBoard'][0] = 10;
		board['blackBoard'][5] = 6;
		expect(board.CountPieces(player1)).toEqual(10);
		expect(board.CountPieces(player2)).toEqual(21);
	});
});
