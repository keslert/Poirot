import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker, SwatchesPicker } from 'react-color';
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
    const { color, swatches, allowCustom } = this.props;
    if (this.state.displayPicker) {
      return (
        <Absolute style={{bottom: 20, right: 0, zIndex: 2147483647}}>
          <Fixed style={{ top: 0, left: 0, right: 0, bottom: 0 }} onClick={this.handleClose} />
          {allowCustom 
            ? <SketchPicker
                color={color}
                presetColors={_.flatten(swatches)}
                onChange={this.handleChange}
                triangle="hide" 
              />
            : <SwatchesPicker
                color={color}
                colors={swatches}
                onChange={this.handleChange}
              />
          }
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
  swatches: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  onChange: PropTypes.func.isRequired,
};

export default ColorPicker;