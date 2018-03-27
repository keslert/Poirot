import { Box } from 'rebass';

export default Box.extend`
  border-collapse: separate;
  border-spacing: 0 1px;
  width: 100%;
  td {
    padding: 4px;
  }
  th {
    padding: 4px;
    font-size: 10px;
    text-align: left;
    text-transform: uppercase;
    font-weight: bold;
    background: #ddd;
  }
`