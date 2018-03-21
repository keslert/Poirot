import PropTypes from 'prop-types';
import { Box } from 'rebass'

const Rotate = Box.extend`
  transform: rotateZ(${props => props.rotated ? 90 : 0}deg);
  transition: transform .2s;
`
Rotate.propTypes = {
  rotated: PropTypes.bool,
}
export default Rotate;