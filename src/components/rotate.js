import { Box } from 'rebass'

export default Box.extend(`
  transform: rotateX(${props => props.rotated ? 90 : 0});
  transition: transform .2s;
`)