import { getNewGame, GameType, TurnState } from './backgammon';

const game = getNewGame(GameType.LongNardy);
const [player1, player2] = game.getPlayers();

player1.on('move', (gamestate: TurnState, move: Function) => {
	
});


player2.on('move', (gamestate: TurnState, move: Function) => {

});

// game.on('end', (gamestate: TurnState) => {

// });

game.Start();