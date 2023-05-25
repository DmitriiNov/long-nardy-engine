# Long Nardy Game Engine

Rules can be found [here](https://en.wikipedia.org/wiki/Long_Nardy).

## Install
```
npm install long-nardy-engine
```

## Usage
```typescript
import { Game } from 'long-nardy-engine';

const game = Game.CreateGame(); // Creates a new Game
game.InitGame([6, 1]); // Initializes the game with two dice to determine who plays first (or without to randomize)
game.StartMove([2, 4]);
const result = game.Move([0, 6]);
game.EndMove();
```

### Moves
```typescript
game.StartMove([2, 4]); // Initializes a move with two dice (or without to randomize)

let possibleMoves = game.GetPossibleMoves(); // Returns an object representing the possible moves for each position on the board
let result = game.Move([0, 4]); // Makes a move; returns a boolean indicating if the move was successful
let howToMove = game.UndoLastMove(); // Undoes the last move if moves are still possible and at least one move has been made. Throws an error otherwise; returns [from, to];
result = game.Move([0, 6]);

let board = game.GetBoard(); // Returns a copy of the current board

let endMoveResult = game.EndMove(); // Ends the move if no other possible moves are left; returns a boolean
```

### Endgame
```typescript
const gameEnded = game.HasGameEnded(); // Returns a boolean indicating if the game has ended

const player = game.GetWinner(); // Returns the player who won, or undefined if the game hasn't finished or ended in a draw
```

### Game Export/Import
```typescript
const exportedGame = game.Export(); // Returns an ExportGame object
const gameCopy = Game.CreateGame();
```

## License
This library is released under the MIT License. See the LICENSE file for more information.