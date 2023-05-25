# Long Nardy game engine
Rules can be found here https://en.wikipedia.org/wiki/Long_Nardy

## Install
```
npm install long-nardy-engine
```

## Usage
```typescript
import { Game } from 'long-nardy-engine';

const game = Game.CreateGame(); // Creates new Game
game.InitGame([6, 1]); // Init game with two dices to determine who plays first (or without to randomize)
game.StartMove([2, 4]);
const result = game.Move([0, 6]);
game.EndMove();
```


### Moves
```typescript

game.StartMove([2, 4]); // Init move with two dices (or without to randomize)

let possibleMoves = game.GetPossibleMoves(); // Returns an object representing the possible moves for each position on the board
let result = game.Move([0, 4]); // Make move; returns bool if move was successful
let howToMove = game.UndoLastMove(); // Undo last move if moves are still possible and at least one move has been done. Throws Error otherwise; returns [from, to];
result = game.Move([0, 6]);

let board = game.GetBoard(); // returns current board copy

let endMoveResult = game.EndMove(); // End move if no other possible moves left; returns bool
```

### Endgame
```typescript

const gameEnded = game.HasGameEnded(); // returns boolean

const player = game.GetWinner(); // returns player who won, or undefined if game hasn't finished or ended with draw

```

### Game Export/Import
```typescript

const exportedGame = game.Export(); // Returns ExportGame object
const gameCopy = Game.CreateGame();

```

## License
This library is released under the MIT License. See the LICENSE file for more information.