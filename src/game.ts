import Dices from './dices/dices';
import { GameEngine } from './engines';
import Player from './player';
import Piece from './piece';


function gameIsGoing(target: Game, propertyKey: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		if (target.HasStarted() === false) {
			throw new Error('Game is not started');
		}
		return originalMethod.apply(this, args);
	}
}
class Game {
	constructor(engine: GameEngine, randomizer: Dices) {
		this.randomizer = randomizer;
		this.engine = engine;
		this.player1 = new Player();
		this.player2 = new Player();
	}

	private randomizer: Dices;
	private engine: GameEngine;
	private player1: Player;
	private player2: Player;
	private board: Array<Array<Piece>> = [];
	private currentPlayer: Player | null = null;

	private diceResults: [number, number] = [0, 0];

	initializeBoard() {
		this.board = this.engine.initializeBoard(this.player1, this.player2);
	}

	HasStarted(): boolean {
		return this.currentPlayer !== null;
	}

	Start(): [number, number, Player] {
		this.initializeBoard();
		const [fR, sR] = this.randomizer.getTwoDices();
		this.currentPlayer = fR > sR ? this.player1 : this.player2;
		return [fR, sR, this.currentPlayer];
	}

	@gameIsGoing
	GetDiceResults(): [number, number] {
		if (this.diceResults[0] === 0 && this.diceResults[1] === 0) {
			this.diceResults = this.randomizer.getTwoDices();
			return this.diceResults;
		}
		return this.diceResults;
	};

	@gameIsGoing
	GetValidMoves(): Array<number> {
		return [];
	}

	@gameIsGoing
	MakeMove(from: number, to: number): boolean {
		return false;
	}
}