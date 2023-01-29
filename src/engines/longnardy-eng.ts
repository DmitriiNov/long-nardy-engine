import Piece from "../piece";
import Player from "../player";
import GameEngine from "./engine";

class LongnardyEngine implements GameEngine {
	initializeBoard(player1: Player, player2: Player): Array<Array<Piece>> {
		const arr = new Array<Array<Piece>>();
		for (let i = 0; i < 24; i++) {
			arr.push(new Array<Piece>());
		}
		for (let i = 0; i < 15; i++) {
			arr[0].push(new Piece(player1));
			arr[23].push(new Piece(player2));
		}

		return arr;
	}
};

export default LongnardyEngine;