import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import GoogleFonts from '../data/google-fonts';
import { Box } from 'rebass';

const fonts = GoogleFonts.map(font => ({ label: font, value: font }));

class FontPicker extends React.Component {
  render() {

    const { value, onChange } = this.props;

    return (
      <div style={{ fontFamily: `'${value}'`, marginTop: 4 }}>
        <Select
          onChange={({ value }) => onChange(value)}
          optionComponent={FontSelectOption}
          options={fonts}
          clearable={false}
          menuStyle={{maxHeight: 100}}
          value={{ label: value, value }}
        />
      </div>
    )
  }
}
export default FontPicker;


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
    const style = {
      fontFamily: `'${this.props.option.value}'`,
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