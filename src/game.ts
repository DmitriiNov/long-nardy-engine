import { Player } from "./player";
import { GameState, MoveState } from "./states";
class Game {
	constructor() {
		console.log(1)
	}
	gameState: GameState | null = null;
	moveState: MoveState | null = null;

	InitGame(): [number, number] {
		const diceResult = this.getRandomDiffDices();
		const player1 = new Player(diceResult[0] > diceResult[1]);
		const player2 = new Player(diceResult[0] < diceResult[1]);
		this.gameState = new GameState(player1, player2);
		return diceResult;
	}

	GetPlayers(): [Player, Player] {
		if (this.gameState === null) {
			throw new Error("Game not initialized");
		}
		return [this.gameState.player1, this.gameState.player2];
	}

	GetCurrentPlayer(): Player {
		if (this.moveState === null) {
			throw new Error("Game not initialized");
		}
		return this.moveState.currentPlayer;
	}

	private getRandomDiffDices(): [number, number] {
		let dice1 = Math.floor(Math.random() * 6) + 1;
		let dice2 = Math.floor(Math.random() * 6) + 1;
		while (dice1 === dice2) {
			dice2 = Math.floor(Math.random() * 6) + 1;
		}
		return [dice1, dice2];
	}
}

export { Game };