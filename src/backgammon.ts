import { Game, TurnState } from "./game";
import { LongnardyEngine, GameEngine } from "./engines";
import { Dices, Random } from "./dices";
import Player from "./player";

enum GameType {
	LongNardy,
	Backgammon
}

function getNewGame(gameType: GameType, randomizer?: Dices): Game {
	if (randomizer === undefined) {
		randomizer = new Random();
	}
	switch (gameType) {
		case GameType.LongNardy:
			return new Game(new LongnardyEngine(), randomizer);
		default:
			throw new Error("Game type is not supported");
	}
}

export { Game, GameType, getNewGame, GameEngine, Dices, Random, Player, TurnState };