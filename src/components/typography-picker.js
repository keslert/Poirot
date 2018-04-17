import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass'; 
import FontFamilyPicker from './font-family-picker';
import FontWeightPicker from './font-weight-picker';
import FontSizePicker from './font-size-picker';

class TypographyPicker extends React.Component {

  fontLabel = (font) => {
    return `${font.fontFamily} ${font.fontWeight} ${font.fontSize}`; 
  }

  renderCustom() {
    const { value, onChange } = this.props;

    return (
      <Flex>
        <Box flex={2}>
          <FontFamilyPicker 
            value={value.fontFamily}
            onChange={fontFamily => onChange({...value, fontFamily})}
          />
        </Box>
        <Box flex={1}>
          <FontWeightPicker
            value={value.fontWeight}
            onChange={fontWeight => onChange({ ...value, fontWeight })}
          />
        </Box>
        <Box flex={1}>
          <FontSizePicker
            value={value.fontSize}
            onChange={fontSize => onChange({ ...value, fontSize })}
          />
        </Box>
      </Flex>
    )
  }

  render() {
    const { options, value, onChange, allowCustom } = this.props;
    return (
      allowCustom
      ? this.renderCustom()
      : <Select
          onChange={({ value }) => onChange(value)}
          options={options.map(value => ({label: this.fontLabel(value), value}))}
          optionComponent={FontSelectOption}
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
