import { memo, useCallback, useReducer, useState, useEffect } from 'react'

import { Cell, CellMark } from './components/Cell'
import { GameStatus, PlayerTurn, checkGameStatus } from './game'

import './App.scss'

enum Theme {
    Dark = 'dark',
    Light = 'light'
}

type GameFieldAction =
    | { type: 'new', size: number }
    | { type: 'mark', rowIdx: number, colIdx: number }

type GameState = {
    playerTurn: PlayerTurn
    field: CellMark[][]
    gameStatus: GameStatus
}

const gameFieldReducer = (prevState: GameState, action: GameFieldAction): GameState => {
    let { field, playerTurn } = prevState

    switch (action.type) {
        case 'new':
            const sizeObject = { length: action.size }
            field = Array.from(sizeObject, () => Array.from(sizeObject, () => CellMark.Empty))
            playerTurn = PlayerTurn.X
            break
        case 'mark':
            const currentValue = field[action.rowIdx]?.[action.colIdx]
            if (currentValue !== CellMark.Empty) return prevState
            field = JSON.parse(JSON.stringify(prevState.field))
            // Из-за strictMode reducer вызывается дважды,
            // без deepcopy при втором вызове значение уже изменено,
            // а используется именно значение второго варианта
            field[action.rowIdx][action.colIdx] = CellMark[playerTurn]
            playerTurn = playerTurn === PlayerTurn.X ? PlayerTurn.O : PlayerTurn.X
            break
        default:
            return prevState
    }

    return {
        gameStatus: checkGameStatus(field),
        field,
        playerTurn,
    }
}

const initialGameState = {
    field: [],
    playerTurn: PlayerTurn.X,
    gameStatus: GameStatus.NotOver,
}

export const App = memo(() => {
    const [theme, setTheme] = useState<Theme>(Theme.Dark)
    const [fieldSize, setFieldSize] = useState<number>(3)
    const [{ field, playerTurn, gameStatus }, dispatchGameField] = useReducer(gameFieldReducer, initialGameState)

    const onGameRestart = useCallback(() => {
        dispatchGameField({ type: 'new', size: fieldSize })
    }, [fieldSize])

    const onFieldSizeChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setFieldSize(Number((e.target as HTMLInputElement).value))
    }, [])

    const onThemeChange = useCallback((e: React.FormEvent<HTMLSelectElement>) => {
        setTheme((e.target as HTMLSelectElement).value as Theme)
    }, [])

    useEffect(onGameRestart, [onGameRestart])

    useEffect(() => {
        document.body.className = `theme-${theme}`
    }, [theme])

    return (
        <>
            <header className={'page-header'}>
                <span>Theme:</span>
                <select className={'theme-slc'} defaultValue={theme} onChange={onThemeChange}>
                    {Object.entries(Theme).map(([label, value]) => (
                        <option value={value}>{label}</option>
                    ))}
                </select>
                <input type={'range'} min={3} max={6} value={fieldSize} onInput={onFieldSizeChange} />
                <button className={'restart-btn'} onClick={onGameRestart}>Restart</button>
            </header>
            <main>
                <div className={'game-field'}>
                    <div className={'turn-label'}>
                        <span>Ход</span>
                        <span>{playerTurn}</span>
                    </div>
                    {field.map((row, rowIdx) => (
                        <div className={'game-row'}>
                            {row.map((cell, colIdx) => (
                                <Cell
                                    mark={cell}
                                    key={`${rowIdx}-${colIdx}`}
                                    onClick={() => dispatchGameField({ type: 'mark', rowIdx, colIdx })}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className={['end-screen', gameStatus !== GameStatus.NotOver && 'visible'].filter(Boolean).join(' ')}>
                    <span className={'game-over-label'}>Game over!</span>
                    <button className={'restart-btn'} onClick={onGameRestart}>Restart</button>
                </div>
            </main>
        </>
    )
})

export default App
