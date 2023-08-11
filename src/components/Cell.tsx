import { memo } from 'react'

import { Superellipse, SuperellipseProps } from './Superellipse'

export enum CellMark { Empty = '', X = 'X', O = 'O' }

export type CellProps = SuperellipseProps & {
    mark?: CellMark
}

export const Cell = memo<CellProps>(({ mark = CellMark.Empty, ...other }) => (
    <Superellipse
        svgProps={{
            className: `game-cell cell-${mark.toLocaleLowerCase() || 'empty'}`
        }}
        {...other}
    />
))
