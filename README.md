# Long Nardy game engine
Rules can be found here https://en.wikipedia.org/wiki/Long_Nardy

Install
```
npm install long-nardy-engine
```

Usage
```
import { Game } from 'long-nardy-engine';

const game = Game.CreateGame();
game.InitGame([6, 1]);

game.StartMove([2, 4]);
const result = game.Move([0, 6]);
game.EndMove();
```