import React from 'react';
import { Flex, Box, Text } from 'rebass';
import theme from '../styles/rebass-theme';

const SCrumb = Text.extend`
  color: ${props => props.theme.colors[props.bold ? 'black' : 'gray']};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  cursor: pointer;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
  font-size: 12px;
`

const SDivider = Text.extend`
  color: ${props => props.theme.colors.gray};
  user-select: none;
  font-size: 8px;
  margin: 0 2px;
`

class Breadcrumbs extends React.Component {

  render() {
    const { selected, nodes } = this.props;

    const reversed = _.reverse([selected, ...nodes].slice(0, 8))

    return (
      <Flex>
        {reversed.map((node, i) => {
          // const color = theme.colors[node.isImageNode ? 'purple' : node.isTextNode ? 'green' : 'gray'];
          const isLast = i < reversed.length - 1;
          const isBold = node.isImageNode || node.isTextNode;
          return (
            <Flex align="center">
              <SCrumb bold={isBold} children={node.nodeName} onClick={() => this.props.onSelect(node)} />
              {isLast ? <SDivider children=">" /> : null}
            </Flex>
          )
        })}
      </Flex>
    )
    
  }
}

export default Breadcrumbs;