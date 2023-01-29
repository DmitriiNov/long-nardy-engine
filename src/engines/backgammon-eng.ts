import Piece from "../piece";
import Player from "../player";
import GameEngine from "./engine";

class BackgammonEngine implements GameEngine {
	initializeBoard(player1: Player, player2: Player): Array<Array<Piece>> {
		throw new Error("Method not implemented.");
	}
};

export default BackgammonEngine;