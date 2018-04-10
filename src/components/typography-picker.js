import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Box } from 'rebass';

class TypographyPicker extends React.PureComponent {

  fontLabel = (font) => {
    return `${font.fontFamily} ${font.fontWeight} ${font.fontSize}`; 
  }

  render() {
    const { options, value, onChange } = this.props;
    return (
      <Select
        onChange={({ value }) => onChange(value)}
        options={options.map(value => ({label: this.fontLabel(value), value}))}
        optionComponent={() => <div>This</div>}
        clearable={false}
        value={{ label: this.fontLabel(value), value }}
        scrollMenuIntoView={false}
      />
    )
  }
}
export default TypographyPicker;


class FontSelectOption extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isDisabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    option: PropTypes.object.isRequired,
  }


  handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSelect(this.props.option, e);
  }

  handleMouseEnter = (event) => {
    this.props.onFocus(this.props.option, event);
  }
  handleMouseMove = (event) => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  render() {
    const value = this.props.option.value;
    const style = {
      fontFamily: `'${value.fontFamily}'`,
      fontWeight: value.fontWeight,
      fontSize: value.fontSize,
      color: '#575757',
    }

    return (
      <div
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
      >
        <Box px={2} py={1} className="Select-value-label" style={style}>
          {this.props.children}
        </Box>
      </div>
    );
  }
}
