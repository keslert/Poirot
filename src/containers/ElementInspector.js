import React from 'react';
import { Box } from 'rebass';

const SFrame = Box.extend`
  position: absolute;
  background: #00beef55;
  z-index: 2147483647;
  border: 2px solid #00beef99;
  pointer-events: none;
  transition: all 200ms;
`
const resetBB = {top: 0, left: 0, width: 0, height: 0}
class ElementInspector extends React.Component {

  state = {
    bb: resetBB,
  }

  componentDidMount() {
    document.onmouseover = this.handleMouseOver;
  }

  componentWillMount() {
    document.onmouseover = null;
  }

  handleMouseOver = (e) => {
    const el = e.target;
    this.resize(el.getBoundingClientRect());
  }

  handleMouseOut = (e) => {
    this.resize(resetBB)
  }
  
  resize = (bb) => {
    this.setState({bb: {
      width: bb.width,
      height: bb.height,
      top: bb.top + window.scrollY,
      left: bb.left + window.scrollX,
    }})
  }

  render() {
    return <SFrame style={this.state.bb} />;
  }
}
export default ElementInspector;