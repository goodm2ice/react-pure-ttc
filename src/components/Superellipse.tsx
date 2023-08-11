import { memo } from 'react'

export type SuperellipseProps = React.SVGProps<SVGPathElement> & {
    svgProps?: React.SVGProps<SVGSVGElement>
}

export const Superellipse = memo<SuperellipseProps>(({ svgProps, ...other }) => (
    <svg {...svgProps} version={'1.1'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'-10 -10 110 110'}>
        <path {...other} d={
            'm45 45' +
            'm0 -50' +
            `c50 0 50 0 50 50` +
            `c0 50 0 50 -50 50` +
            `c-50 0 -50 0 -50 -50` +
            `c0 -50 0 -50 50 -50`
        }  />
    </svg>
))
