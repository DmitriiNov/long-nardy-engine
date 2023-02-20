import { GameState, MoveState } from "./states";

class Engine {
	constructor() {
		console.log('Engine constructor');
		this.gameState = new GameState();
		this.moveState = new MoveState();
  	}

	gameState: GameState;
	moveState: MoveState;
	
}

export { Engine };