import Dices from "./dices";

class Random implements Dices {
	getTwoDices(): [number, number] {
		return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
	}

	whoIsFirst(): number {
		return Math.floor(Math.random() * 2) + 1;
	}
}

export default Random;