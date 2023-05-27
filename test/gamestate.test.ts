import { describe, expect, test, beforeEach } from '@jest/globals';
import Player from '../src/player';
import Board from '../src/board';
import GameState from '../src/states/gameState';

describe('GameState', () => {
	let player1: Player;
	let player2: Player;
	let board: Board;
	let gameState: GameState;

	beforeEach(() => {
		player1 = new Player(true);
		player2 = new Player(false);
		board = new Board();
		gameState = new GameState(player1, player2, board);
	});

	describe('constructor', () => {
		test('should initialize with provided players and board', () => {
			expect(gameState.player1).toBe(player1);
			expect(gameState.player2).toBe(player2);
			expect(gameState.board).toBe(board);
		});

		test('should initialize with a new Board if no board is provided', () => {
			const defaultGameState = new GameState(player1, player2);
			expect(defaultGameState.board).toBeInstanceOf(Board);
		});
	});

	describe('EndGame', () => {
		test('should set gameEnded to true', () => {
			gameState.EndGame();
			expect(gameState.HasGameEnded()).toBe(true);
		});
	});

	describe('HasGameEnded', () => {
		test('should return the value of gameEnded', () => {
			expect(gameState.HasGameEnded()).toBe(false);
			gameState.EndGame();
			expect(gameState.HasGameEnded()).toBe(true);
		});
	});

	describe('GetWinner', () => {
		test('should return the winner if it is set', () => {
			gameState.SetWinner(player2);
			expect(gameState.GetWinner()).toBe(player2);
		});

		test('should return undefined if the winner is not set', () => {
			expect(gameState.GetWinner()).toBeUndefined();
		});
	});

	describe('SetWinner', () => {
		test('should set the winner if the player is either player1 or player2', () => {
			gameState.SetWinner(player1);
			expect(gameState.GetWinner()).toBe(player1);
		});

		test('should not set the winner if the player is neither player1 nor player2', () => {
			const winner = new Player(true);
			gameState.SetWinner(winner);
			expect(gameState.GetWinner()).toBeUndefined();
		});
	});
});
