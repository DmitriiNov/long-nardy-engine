import Piece from "../piece";
import Player from "../player";

interface GameEngine {
	initializeBoard(player1: Player, player2: Player): Array<Array<Piece>>;
}

export default GameEngine;