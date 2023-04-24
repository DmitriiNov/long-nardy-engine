import { fstat } from 'fs';
import { Board } from './board';
import { Game } from './game'
import { Player } from './player';
import { GameState, MoveState } from './states';

function GetNewGame(): Game {
	return new Game();
}

function ImportGame(data: any): Game {
	let gameState: GameState | undefined = undefined;
	let moveState: MoveState | undefined = undefined;
	if (data.gameState) {
		const gs = data.gameState
		const player1 = new Player(gs.player1?.isFirst ? true : false);
		const player2 = new Player(!player1.isFirst);
		const board = new Board(gs.board?.whiteBoard || undefined, gs.board?.blackBoard || undefined)
		gameState = new GameState(player1, player2, board);
		if (gs.gameEnded)
			gameState.EndGame();
		if (gs.winner) {
			const isWinnerFirst = !!gs.winner.isFirst;
			gameState.SetWinner(player1.isFirst ? (isWinnerFirst ? player1 : player2) : (isWinnerFirst ? player2 : player1));
		}	
		if (data.moveState) {
			const ms = data.moveState;
			const isCurrentPlayerFirst = ms.currentPlayer?.isFirst;
			const currPlayer = player1.isFirst ? (isCurrentPlayerFirst ? player1 : player2) : (isCurrentPlayerFirst ? player2 : player1);
			moveState = new MoveState(ms.moveNumber || 0, currPlayer, ms.dices, ms.remainingMoves, ms.doneMoves)
			if (ms.isEnded)
				moveState.endMove()
		}
	}
	return new Game(gameState, moveState);
}

export { GetNewGame, ImportGame }