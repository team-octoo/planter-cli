import styled from "styled-components";

export interface SvgProps {
    size?: '.8rem' | '1rem' | '1.3rem' | '1.6rem' | string;
}

const Svg = styled.svg<SvgProps>`
    fill: ${props => props.color};
    width: ${props => props.size};
    height: ${props => props.size};
`;

export default Svg