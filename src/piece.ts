import Player from './player';

class Piece {
	constructor(player :Player) {
		this.player = player;
	}
	player: Player;
}

export default Piece;