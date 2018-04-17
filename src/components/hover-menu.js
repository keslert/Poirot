import React from 'react';
import { Relative, Absolute } from 'rebass'

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
    return (
      <Relative onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        {this.props.children}

        {this.state.visible && 
          <Absolute style={{bottom: 30, left: 0, boxShadow: '0 1px 2px rgba(0,0,0,.1)'}}>
            {this.props.renderMenu()}
          </Absolute>
        }
      </Relative>
    )
  }
}
export default HoverMenu;