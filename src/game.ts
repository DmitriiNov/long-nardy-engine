import { GameEngine } from './engines';
import Player from './player';

class Game {
	constructor(engine: GameEngine) {
		this.engine = engine;
		this.player1 = new Player();
		this.player2 = new Player();
	}

	private engine: GameEngine;
	private player1: Player;
	private player2: Player;
}