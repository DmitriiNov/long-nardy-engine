import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import Player from '../src/player';
import MoveState from '../src/states/moveState';

jest.mock('../src/player');

describe('MoveState', () => {
	let player: Player;
	let moveState: MoveState;

	beforeEach(() => {
		player = new Player(true);
		MoveState.prototype.getRandomDice = jest.fn().mockReturnValue(3) as () => number;

		moveState = new MoveState(1, player, null, null, null);
	});

	describe('constructor', () => {
		test('should initialize with provided values', () => {
			expect(moveState.moveNumber).toBe(1);
			expect(moveState.currentPlayer).toBe(player);
		});

		test('should initialize dices with random values if not provided', () => {
			expect(moveState.dices).toEqual([3, 3]);
		});

		test('should initialize remainingMoves with dices if not provided', () => {
			expect(moveState.remainingMoves).toEqual([3, 3, 3, 3]);
		});

		test('should initialize doneMoves as an empty array if not provided', () => {
			expect(moveState.doneMoves).toEqual([]);
		});

		test('should sort remainingMoves in ascending order if provided', () => {
			moveState = new MoveState(1, player, null, [4, 1, 3], null);
			expect(moveState.remainingMoves).toEqual([1, 3, 4]);
		});
	});

	describe('removeFromRemainingMoves', () => {
		test('should remove the specified move from remainingMoves if it exists', () => {
			moveState.remainingMoves = [1, 2, 3, 4];

			const result = moveState.removeFromRemainingMoves(3);

			expect(result).toBe(true);
			expect(moveState.remainingMoves).toEqual([1, 2, 4]);
		});

		test('should return false if the specified move does not exist in remainingMoves', () => {
			moveState.remainingMoves = [1, 2, 4];

			const result = moveState.removeFromRemainingMoves(3);

			expect(result).toBe(false);
			expect(moveState.remainingMoves).toEqual([1, 2, 4]);
		});
	});

	describe('addMove', () => {
		test('should add the specified move to doneMoves', () => {
			moveState.addMove([2, 4]);

			expect(moveState.doneMoves).toEqual([[2, 4]]);
		});
	});

	describe('getRandomDice', () => {
		test('should return a random number between 1 and 6', () => {
			const result = moveState.getRandomDice();
			expect(result).toBeGreaterThanOrEqual(1);
			expect(result).toBeLessThanOrEqual(6);
		});
	});

	describe('endMove', () => {
		test('should set isEnded to true', () => {
			moveState.endMove();
			expect(moveState.isMoveEnded()).toBe(true);
		});
	});

	describe('setRemainingMoves', () => {
		test('should set the remainingMoves to the specified moves', () => {
			moveState.setRemainingMoves([2, 4]);

			expect(moveState.remainingMoves).toEqual([2, 4]);
		});
	});

	describe('setDoneMoves', () => {
		test('should set the doneMoves to the specified moves', () => {
			moveState.setDoneMoves([
				[1, 3],
				[4, 5]
			]);

			expect(moveState.doneMoves).toEqual([
				[1, 3],
				[4, 5]
			]);
		});
	});

	describe('isMoveEnded', () => {
		test('should return the value of isEnded', () => {
			expect(moveState.isMoveEnded()).toBe(false);
			moveState.endMove();
			expect(moveState.isMoveEnded()).toBe(true);
		});
	});

	describe('getStateCopy', () => {
		test('should return a new MoveState instance with the same values', () => {
			const copy = moveState.getStateCopy();

			expect(copy).toBeInstanceOf(MoveState);
			expect(copy.moveNumber).toBe(moveState.moveNumber);
			expect(copy.currentPlayer).toBe(moveState.currentPlayer);
			expect(copy.dices).toEqual(moveState.dices);
			expect(copy.remainingMoves).toEqual(moveState.remainingMoves);
			expect(copy.doneMoves).toEqual(moveState.doneMoves);
		});
	});
});
