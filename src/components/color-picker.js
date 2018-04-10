import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { Fixed, Absolute, Relative } from 'rebass';

class ColorPicker extends React.Component {
  
  state = {
    displayPicker: false,
  }

  handleClick = () => {
    this.setState({ displayPicker: !this.state.displayPicker });
  }

  handleClose = () => {
    this.setState({ displayPicker: false });
  }

  handleChange = (color) => {
    this.props.onChange(color.hex);
  }

  renderPicker() {
    const { color, colors } = this.props;

    if (this.state.displayPicker) {
      return (
        <Absolute style={{bottom: 0, left: 25, zIndex: 2147483647}}>
          <Fixed style={{ top: 0, left: 0, right: 0, bottom: 0 }} onClick={this.handleClose} />
          <SketchPicker
            color={color}
            presetColors={colors}
            onChange={this.handleChange}
            width={150}
            triangle="hide" />
        </Absolute>
      );
    }
  }

  render() {
    const { children } = this.props;

    return (
      <Relative>
        <span onClick={this.handleClick}>{children}</span>
        {this.renderPicker()}
      </Relative>
    );
  }
}

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  colors: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ColorPicker;