import { Dices } from './dices';
import { GameEngine } from './engines';
import Player from './player';
import Piece from './piece';

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
		console.log(this);
		return this.currentPlayer !== null;
	}

	Start(): [number, number, Player] {
		this.initializeBoard();
		const [fR, sR] = this.randomizer.getTwoDices();
		this.currentPlayer = fR > sR ? this.player1 : this.player2;
		return [fR, sR, this.currentPlayer];
	}

	private isGameGoing() {
		if (this.currentPlayer === null) {
			throw new Error('Game is not started');
		}
	}

	GetDiceResults(): [number, number] {
		this.isGameGoing();
		if (this.diceResults[0] === 0 && this.diceResults[1] === 0) {
			this.diceResults = this.randomizer.getTwoDices();
			return this.diceResults;
		}
		return this.diceResults;
	};

	GetValidMoves(): Array<number> {
		this.isGameGoing();
		return [];
	}

	MakeMove(from: number, to: number): boolean {
		this.isGameGoing();
		return false;
	}
}

export default Game;