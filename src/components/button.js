import { Box } from 'rebass';

export default Box.extend`
  cursor: pointer;
  padding: .5rem .75rem;
  border-radius: 9999px;
  &:hover {
    opacity: .8;
  }
  text-transform: uppercase;
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-align: center;
`