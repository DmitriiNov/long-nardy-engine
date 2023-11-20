import MoveState from '../states/moveState';
import Board from '../board';

type ValidatorFunction = (moveState: MoveState, board: Board, move: [number, number]) => ValidationResult;
type ValidatorFunctionsMap = { [key: string]: ValidatorFunction };

class ValidationResult {
	constructor(public message: string, public valid: boolean) {}
	IsValid() {
		return this.valid;
	}
}

function GetFalseValidationResult(message: string) {
	return new ValidationResult(message, false);
}

function GetTrueValidationResult() {
	return new ValidationResult('', true);
}

const IsThereAnyPiece: ValidatorFunction = (moveState, board, move) => {
	const from = move[0];
	const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
	if (currentBoard[from] <= 0) return GetFalseValidationResult('[IsThereAnyPiece] no pieces');
	return GetTrueValidationResult();
};

const IsThereNoPieceOnOpponentBoard: ValidatorFunction = (moveState, board, move) => {
	let to = move[1];
	if (to > 23) return GetTrueValidationResult();

	const currentBoard = board.getOpponentBoard(moveState.currentPlayer);
	to += 12;
	if (to > 23) to -= 24;
	if (currentBoard[to] > 0) return GetFalseValidationResult('[IsThereNoPieceOnOpponentBoard] there are pieces on opponent`s board');
	return GetTrueValidationResult();
};

const IsMovePossible: ValidatorFunction = (moveState, board, move) => {
	if (move[0] < 0 || move[0] > 23) return GetFalseValidationResult('[IsMovePossible] move "from" is not valid');
	if (move[1] < 1 || move[1] > 29) return GetFalseValidationResult('[IsMovePossible] move "to" is not valid');
	if (move[1] <= move[0]) return GetFalseValidationResult('[IsMovePossible] "to" bigger than "from"');
	return GetTrueValidationResult();
};

const AreAllPiecesAtHome: ValidatorFunction = (moveState, board, move) => {
	if (move[1] < 24) return GetTrueValidationResult();
	const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
	for (let i = 0; i < 18; i++) {
		if (currentBoard[i] !== 0) return GetFalseValidationResult('[AreAllPiecesAtHome] not all pieces are at home');
	}
	return GetTrueValidationResult();
};

const AreThereNoAlternativeMoves: ValidatorFunction = (moveState, board, move) => {
	if (move[1] <= 24) return GetTrueValidationResult();

	const mv = move[1] - move[0];
	const currentBoard = board.getCurrentBoard(moveState.currentPlayer);
	const opponentBoard = board.getOpponentBoard(moveState.currentPlayer).slice(6, 12);
	for (let i = 18; i < move[0]; i++) {
		if (currentBoard[i] > 0) return GetFalseValidationResult('[AreThereNoAlternativeMoves] there are alternative moves');
	}
	return GetTrueValidationResult();
};

const IsOnlyOnePieceFromHead: ValidatorFunction = (moveState, board, move) => {
	const from = move[0];
	if (from !== 0 || moveState.doneMoves.length === 0) return GetTrueValidationResult();
	let doneHead = 0;
	moveState.doneMoves.forEach((doneMove) => {
		if (doneMove[0] === 0) doneHead++;
	});
	if (doneHead === 1) {
		const isRightDouble = moveState.dices[0] === moveState.dices[1] && [6, 4, 3].indexOf(moveState.dices[0]) !== -1;
		if (moveState.dices[0] === 4) {
			const opponentBoard = board.getOpponentBoard(moveState.currentPlayer);
			if (opponentBoard[20] !== 0) return GetFalseValidationResult('[IsOnlyOnePieceFromHead] no possible moves with two heads');
		}
		const result = moveState.moveNumber < 3 && isRightDouble;
		if (result) return GetTrueValidationResult();
		return GetFalseValidationResult('[IsOnlyOnePieceFromHead] head has been done');
	}
	if (doneHead > 1) return GetFalseValidationResult('[IsOnlyOnePieceFromHead] head has been done twice already');
	return GetTrueValidationResult();
};

const IsNoSixBlocked: ValidatorFunction = (moveState, board, move) => {
	let currentBoard = board.getCurrentBoard(moveState.currentPlayer).slice();
	currentBoard[move[0]] -= 1;
	if (move[1] < 24) currentBoard[move[1]] += 1;
	currentBoard = currentBoard.concat(currentBoard.slice(0, 5));

	const opponentBoard = board.getOpponentBoard(moveState.currentPlayer).slice();
	const opponentSum = opponentBoard.reduce((acc, val) => acc + val, 0);
	if (opponentSum === 0) return GetTrueValidationResult();
	
	let k = -1;
	for (let i = 0; i < currentBoard.length; i++) {
		if (currentBoard[i] === 0) k = i;
		if (i - k <= 5) continue;
			
		let index = i > 24 ? i - 24 : i;
		index = index < 12 ? index + 12 : index - 12;

		for (let m = index; m < opponentBoard.length; m++) {
			if (opponentBoard[m] > 0) return GetTrueValidationResult();
		}
		return GetFalseValidationResult('[IsNoSixBlocked] blocked six');
	}

	return GetTrueValidationResult();
};

const validators: ValidatorFunctionsMap = {
	IsThereAnyPiece,
	IsThereNoPieceOnOpponentBoard,
	IsMovePossible,
	AreAllPiecesAtHome,
	AreThereNoAlternativeMoves,
	IsOnlyOnePieceFromHead,
	IsNoSixBlocked
};

export { ValidationResult, ValidatorFunction, ValidatorFunctionsMap, validators };
