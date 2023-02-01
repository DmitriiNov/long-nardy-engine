import { compileFunction } from "vm";
import {Board, Move} from "../heplers";
import Player from "../player";
import GameEngine from "./engine";

const fieldsNumber = 24;
class LongnardyEngine implements GameEngine {

	private findAllPermutations(arr2: Array<number>): Array<Array<number>> {
		const result = new Map();
		const permute = (arr: Array<number>, m: Array<number> = []): void => {
			if (arr.length === 0) {
				const str = m.join('');
				if (!result.get(str)) {
					result.set(str, true);
				}
			} else {
				for (let i = 0; i < arr.length; i++) {
					let curr = arr.slice();
					let next = curr.splice(i, 1);
					permute(curr.slice(), m.concat(next));
				}
			}
		};
		permute(arr2);
		const keys = result.keys();
		const res = new Array<Array<number>>();
		for (let key of keys) {
			const strNumbers = key.split('');
			const numbers = new Array<number>();
			for (let strNumber of strNumbers) {
				numbers.push(parseInt(strNumber));
			}
			res.push(numbers);
		}
		return res;
	}

	getValidMoves(player: Player, board: Board, zaras: Array<number>): Array<[number, Array<number>]> {
		if (zaras.length === 0) {
			return [];
		}
		const currenPlayerPieces = board.getPlayerPieces(player);
		const opponentPieces = board.getOpponentPieces(player);

		const invertedOpponentPieces = opponentPieces.slice(12, 24).concat(opponentPieces.slice(0, 12));

		const possiblePieces = new Set<number>();
		for (let i = 0; i < currenPlayerPieces.length; i++) {
			if (currenPlayerPieces[i] === 0)
				continue;
			for (let zara of zaras) {
				const newValue = i + zara;
				if (newValue < 24) {
					if (invertedOpponentPieces[newValue] !== 0)
						continue;
					possiblePieces.add(i);
					continue;
				}
				possiblePieces.add(i);
			}
		}

		const allPermutations = this.findAllPermutations(zaras);

		const checkIfAllPiecesAreInHome = (pieces: Array<number>): boolean => {
			for (let i = 0; i < 18; i++) {
				if (pieces[i] !== 0)
					return false;
			}
			return true;
		}

		const result = Array<[number, Array<number>]>();
		for (let val of possiblePieces.values()) {
			const zaraResult: Set<number> = new Set();
			for (let zara of allPermutations) {
				let oldPosition = val;
				let newPositon = val;
				const copy = currenPlayerPieces.slice();
				for (let num of zara) {
					newPositon += num;
					if (newPositon > 23) {
						copy[oldPosition] -= 1;
						if (checkIfAllPiecesAreInHome(copy)) {
							zaraResult.add(24);
							break;
						}
					} else {
						if (copy[oldPosition] === 0)
							break;
						if (invertedOpponentPieces[newPositon] !== 0)
							break;
						copy[oldPosition] -= 1;
						copy[newPositon] += 1;
						oldPosition = newPositon;
						zaraResult.add(newPositon);
					}
				}
			}
			const setValues = Array.from(zaraResult.values());
			if (setValues.length > 0) {
				result.push([val, setValues]);
			}
		}
		return result;
	}

	makeMove(player: Player, board: Board, move: Move, zaras: Array<number>): boolean {
		throw new Error("Method not implemented.");
	}

	initializeBoard(player1: Player, player2: Player): Board {
		const highBoard = Array(fieldsNumber).fill(0);
		const lowBoard = Array(fieldsNumber).fill(0);
		highBoard[0] = 15;
		lowBoard[0] = 15;
		const board = new Board(highBoard, lowBoard, player2, player1);
		return board;
	}
};

export default LongnardyEngine;