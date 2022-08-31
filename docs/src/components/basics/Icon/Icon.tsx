import { FC } from 'react';
import remix from 'remixicon/fonts/remixicon.symbol.svg';

import Svg, { SvgProps } from './Svg';

interface Props extends SvgProps {
    color?: string;
    line?: boolean;
    fill?: boolean;
    name: string;
    className?: string;
    noStyle?: boolean;
}

/**
 * 
 * @description Icons come from [Remixicons](https://remixicon.com/)
 */
const Icon: FC<Props> = ({ color = 'currentColor', size = '1.3rem', fill, noStyle, name = 'admin', className }) => {
    const nameAndStyleSeperator = noStyle ? '' : '-';
    const iconStyle = fill ? 'fill' : 'line';
    const iconName = `${ name }${ nameAndStyleSeperator }${ iconStyle }`;
    
    return (
        <Svg
            { ...{ color, size, className }}
        >
            <use href={ remix + `#ri-${ iconName }`}></use>
        </Svg>
    )
}

export default Icon