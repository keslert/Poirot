import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass'; 
import FontFamilyPicker from './font-family-picker';
import FontWeightPicker from './font-weight-picker';
import NumericPicker from './numeric-picker';
import theme from '../styles/rebass-theme';

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
          <NumericPicker
            min={8}
            max={100}
            unit="px"
            value={value.fontSize}
            onChange={fontSize => onChange({ ...value, fontSize })}
          />
        </Box>
      </Flex>
    )
  }

  renderOption(props) {
    const { style, option, selectValue, focusOption, focusedOption } = props;

    const extraStyle = {
      fontFamily: `'${option.value.fontFamily}'`,
      fontWeight: option.value.fontWeight,
    }
    return (
      <SelectOption
        style={{...style, ...extraStyle}}
        onHover={() => null}
        selectValue={selectValue}
        option={option}
        isFocused={focusedOption && focusedOption === option}
        focusOption={focusOption}
      />
    );
  }

  render() {
    const { options, value, onChange, allowCustom } = this.props;
    return (
      allowCustom
      ? this.renderCustom()
      : <VirtualizedSelect
          onChange={({ value }) => onChange(value)}
          options={options.map(value => ({label: this.fontLabel(value), value}))}
          // optionRenderer={this.renderOption}
          clearable={false}
          value={{ label: this.fontLabel(value), value }}
          scrollMenuIntoView={false}
        />
    )
  }
}
export default TypographyPicker;


class SelectOption extends React.PureComponent {

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.selectValue(this.props.option.value);
  }

  handleMouseEnter = (event) => {
    this.props.focusOption(this.props.option);
    this.props.onHover();
  }

  render() {
    return (
      <Box p={2} bg={theme.colors[this.props.isFocused ? 'lightBlue' : 'white']}
        style={this.props.style}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
      >
        {this.props.option.label}
      </Box>
    );
  }
}
