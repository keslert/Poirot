import React from 'react';
import { Relative, Absolute, Box } from 'rebass'

class HoverMenu extends React.Component {
  state = {
    visible: false,
  }

  handleMouseEnter = () => {
    this.setState({visible: true});
  }
  handleMouseLeave = () => {
    this.setState({visible: false});
  }

  render() {
    const { visible } = this.state;
    return (
      <Relative onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <Box bg={visible ? 'rgba(0,0,0,.05)' : 'transparent'}>
          {this.props.children}
        </Box>

        {this.state.visible && 
          <Absolute style={{bottom: 28, left: 0, boxShadow: '0 1px 2px rgba(0,0,0,.1)'}}>
            {this.props.renderMenu()}
          </Absolute>
        }
      </Relative>
    )
  }
}
export default HoverMenu;