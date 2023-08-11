import { CellMark } from './components/Cell'

export enum PlayerTurn { X = 'X', O = 'O' }
export enum GameStatus { NotOver, X, O, Draw }

export const checkGameStatus = (field: CellMark[][]): GameStatus => {
    for (let row = 0; row < field.length; row++) {
        for (let col = 0; col < field[row].length; col++) {
            const winnerMark = field[row][col]
            if (winnerMark === CellMark.Empty) continue
            const winnerStatus = GameStatus[winnerMark]
            if (
                col + 2 < field.length &&
                field[row][col + 1] === winnerMark &&
                field[row][col + 2] === winnerMark
            ) // Горизонтальная черта
                return winnerStatus
            if (row >= field.length - 2) continue
            if (
                field[row + 1][col] === winnerMark &&
                field[row + 2][col] === winnerMark
            ) // Вертикальная черта
                return winnerStatus
            if (
                col + 2 < field.length &&
                field[row + 1][col + 1] === winnerMark &&
                field[row + 2][col + 2] === winnerMark
            ) // Наклонная вправо
                return winnerStatus
            if (
                col - 2 >= 0 &&
                field[row + 1][col - 1] === winnerMark &&
                field[row + 2][col - 2] === winnerMark
            ) // Наклонная влево
                return winnerStatus
        }
    }

    if (field.every((row) => row.every((cell) => cell !== CellMark.Empty)))
        return GameStatus.Draw

    return GameStatus.NotOver
}
