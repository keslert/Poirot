import React from 'react';
import { Box } from 'rebass';

export default Box.extend`
  position: relative;
  width: 32px;
  height: 16px;
  background: #ccc;
  border-radius: 8px;
  transition: background-color 200ms;
  &:after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    left: 2px;
    top: 2px;
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0,0,0,.2);
    background: #fff;
    transition: transform 200ms;
  }
  cursor: ${props => props.disabled ? 'auto' : 'pointer'};
  ${props => props.checked && `
    background: ${props.disabled ? props.theme.colors.gray : (props.color ? props.color : props.theme.colors.blue)};
    &:after {
      transform: translateX(16px);
    }
  `}
`