import { Dices } from './dices';
import { GameEngine } from './engines';
import Player from './player';
import { Board, Move }  from './heplers';


class TurnState {

}
class Game {
	constructor(engine: GameEngine, randomizer: Dices) {
		this.randomizer = randomizer;
		this.engine = engine;
		this.player1 = new Player(0);
		this.player2 = new Player(1);
		this.initializeBoard();
	}

	private randomizer: Dices;
	private engine: GameEngine;
	private player1: Player;
	private player2: Player;
	private board: Board | null = null;
	private currentPlayer: Player | null = null;

	private zaras: Array<number> = [];
	private zarasFull: Array<number> = [];

	initializeBoard() {
		this.board = this.engine.initializeBoard(this.player1, this.player2);
	}

	HasStarted(): boolean {
		console.log(this);
		return this.currentPlayer !== null;
	}

	getPlayers(): [Player, Player] {
		return [this.player1, this.player2];
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
		if (this.zaras.length === 0) {
			const [fR, sR] = this.randomizer.getTwoDices();
			this.zaras = [fR, sR];
			this.zarasFull = [fR, sR];
			if (fR === sR) {
				this.zarasFull = this.zaras.concat([fR, sR]);
			}
		}
		return [this.zaras[0], this.zaras[1]];
	};

	GetValidMoves(): Array<[number, Array<number>]> {
		this.isGameGoing();
		if (this.zaras.length === 0) {
			throw new Error('Dices are not rolled');
		}
		const moves = this.engine.getValidMoves(this.currentPlayer!, this.board!, this.zaras);
		return moves;
	}

	MakeMove(from: number, to: number): boolean {
		this.isGameGoing();
		if (this.zaras.length === 0) {
			throw new Error('Dices are not rolled');
		}
		const move: Move = [from, to];
		const result = this.engine.makeMove(this.currentPlayer!, this.board!, move, this.zarasFull);
		if (this.zarasFull.length === 0) {
			this.zaras = [];
			this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
		}
		return result;
	}
}

export { Game, TurnState };