import React from 'react';
import { Box } from 'rebass';
import { Checkboard } from 'react-color/lib/components/common';

const Swatch = Box.extend`
  position: relative;
  width: 24px;
  height: 24px;
  border: 1px solid #eaeaea;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  &:after {
    content: '';
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    ${props => `
      background: ${props.color};
    `}
  }
`

export default (props) => {
  return (
    <Swatch color={props.color}>
      <Checkboard />
    </Swatch>
  )
}