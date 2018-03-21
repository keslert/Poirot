import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Text } from 'rebass';
import Toggle from './toggle';

class MenuItem extends React.Component {

  static propTypes = {
    color: PropTypes.string,
    isOn: PropTypes.bool,
    label: PropTypes.string,

  }

  state = {
    open: false,
    on: false,
  }

  handleToggleOn = () => {
    this.setState({on: !this.state.on})
  }

  render() {
    const { open, on } = this.state;
    const { item } = this.props;
    return (
      <Box p={2}>
        <Flex align="center">
          <Toggle checked={on} onClick={this.handleToggleOn} />
          <Box flex={1} ml={2}><Text>{item.label}</Text></Box>
          <Text is="span" f={0}>▼</Text>
        </Flex>
      </Box>
    )
  }
}
export default MenuItem;