import { Game } from "../game";
import { Board, Move } from "../heplers";
import Player from "../player";

interface GameEngine {
	initializeBoard(player1: Player, player2: Player): Board;
	getValidMoves(player: Player, board: Board, zaras: Array<number>): Array<[number, Array<number>]>;
	makeMove(player: Player, board: Board, move: Move, zaras: Array<number>): boolean;
}

export default GameEngine;