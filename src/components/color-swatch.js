import React from 'react';
import { Text, Box } from 'rebass';
import { Checkboard } from 'react-color/lib/components/common';
import tinycolor from 'tinycolor2';

const Swatch = Box.extend`
  position: relative;
  height: 24px;
  border: 1px solid #eaeaea;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 10px;
    text-transform: uppercase;
    padding-left: 8px;
    ${props => `
      content: "${props.content}";
      color: ${props.color};
      background: ${props.bg};
    `}
  }
`

export default (props) => {
  const tcolor = tinycolor(props.color);
  const showLabel = tcolor.isValid() && tcolor.getAlpha()
  const content = showLabel ? tcolor.toHexString() : '';
  const color = tcolor.isLight() ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,0.5)';
  return (
    <Swatch bg={props.color} content={content} color={color}>
      <Checkboard />
    </Swatch>
  )
}